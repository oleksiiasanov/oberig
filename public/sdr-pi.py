#!/usr/bin/env python3
"""SDR Pi 3.1.0 — LAN TLS та інтернет SDR через вибраний інтерфейс.

Імена v2 unit/state і схема ownership v3 збережені для сумісності.
Оновлення: запускайте update з окремо завантаженого файла.
Не копіюйте поверх /usr/local/sbin/sdr-pi: діє inode/hash захист.
Для міграції v2: rollback старою копією, install новою.
"""
import pathlib
import ipaddress, time, re
import os, json, stat, hashlib, uuid
import asyncio, socket, contextlib

class Relay:
    def __init__(self, host, port, target, network, device=None):
        self.host=host; self.port=port; self.target=target; self.network=ipaddress.ip_network(network)
        self.device=device; self.tasks=set(); self.server=None
    async def start(self):
        sock=socket.socket(socket.AF_INET,socket.SOCK_STREAM)
        try:
            sock.setsockopt(socket.SOL_SOCKET,socket.SO_REUSEADDR,1)
            if self.device: sock.setsockopt(socket.SOL_SOCKET,socket.SO_BINDTODEVICE,self.device.encode()+b'\0')
            sock.bind((self.host,self.port)); sock.listen(32); sock.setblocking(False)
            self.server=await asyncio.start_server(self.handle,sock=sock,limit=65536)
            self.port=sock.getsockname()[1]
        except BaseException: sock.close(); raise
    async def handle(self,r,w):
        task=asyncio.current_task(); upstream=None
        if len(self.tasks)>=32 or ipaddress.ip_address(w.get_extra_info('peername')[0]) not in self.network:
            w.close(); await w.wait_closed(); return
        self.tasks.add(task)
        async def pump(reader,writer):
            while True:
                chunk=await asyncio.wait_for(reader.read(65536),120)
                if not chunk:
                    if writer.can_write_eof(): writer.write_eof()
                    return
                writer.write(chunk); await asyncio.wait_for(writer.drain(),120)
        pumps=[]
        try:
            ur,upstream=await asyncio.wait_for(asyncio.open_connection(*self.target,limit=65536),5)
            pumps=[asyncio.create_task(pump(r,upstream)),asyncio.create_task(pump(ur,w))]
            await asyncio.gather(*pumps)
        except (OSError,asyncio.TimeoutError,asyncio.CancelledError): pass
        finally:
            for p in pumps: p.cancel()
            await asyncio.gather(*pumps,return_exceptions=True)
            for writer in (w,upstream):
                if writer:
                    writer.close()
                    with contextlib.suppress(OSError,asyncio.TimeoutError): await asyncio.wait_for(writer.wait_closed(),2)
            self.tasks.discard(task)
    async def close(self):
        if self.server: self.server.close(); await self.server.wait_closed()
        tasks=list(self.tasks)
        for task in tasks: task.cancel()
        await asyncio.gather(*tasks,return_exceptions=True)

VERSION=3  # ownership schema remains compatible with installed v3
RELEASE='3.1.0'

class Backoff:
    def __init__(self): self.failures=0
    def delay(self, healthy):
        if healthy: self.failures=0; return 3
        delay=min(30,3*2**min(self.failures,4)); self.failures+=1
        return delay

def kernel_diagnostics(text, now):
    """Current-boot monotonic timestamps only; observations never block recovery."""
    notes=[]
    for line in text.splitlines():
        try:
            entry=json.loads(line); age=now-int(entry['__MONOTONIC_TIMESTAMP'])/1000000
            message=entry['MESSAGE'].lower()
        except (ValueError,KeyError,TypeError,AttributeError): continue
        if not 0<=age<=120: continue
        if re.search(r'over.?current',message): note='USB over-current: від’єднайте SDR; перевірте кабель/живлення або активний USB hub. Захист НЕ обходиться.'
        elif re.search(r'under.?voltage',message): note='Недостатнє живлення Pi: перевірте блок живлення та кабель.'
        elif 'usb disconnect' in message: note='USB від’єднано: перевірте кабель, живлення та повторне підключення.'
        else: continue
        note=f'Недавня історія ядра [boot+{int(entry["__MONOTONIC_TIMESTAMP"])/1000000:.3f}s]: {note}'
        if note not in notes: notes.append(note)
    return notes

def recent_diagnostics(run):
    try:
        text=run('journalctl','-k','-b','--since=-2min','-n','80','-o','json','--no-pager')
        return kernel_diagnostics(text,float(pathlib.Path('/proc/uptime').read_text().split()[0]))
    except Exception: return ['Діагностика ядра недоступна; перевірте journalctl -k -b.']

def digest(data): return hashlib.sha256(data).hexdigest()

def trusted_dir(path, uid=0):
    for p in (path, *path.parents):
        st=p.lstat()
        if not stat.S_ISDIR(st.st_mode) or st.st_uid!=uid or st.st_mode & 0o022:
            raise RuntimeError(f'Небезпечний каталог: {p}')
        if p==path.parent and uid!=0: break  # лише ізольовані тести

class Journal:
    def __init__(self, root, uid=0):
        self.root=pathlib.Path(root); self.uid=uid
        if not self.root.exists(): self.root.mkdir(mode=0o700)
        st=self.root.lstat()
        if not stat.S_ISDIR(st.st_mode) or st.st_uid!=uid or stat.S_IMODE(st.st_mode)!=0o700: raise RuntimeError('Небезпечний каталог стану')
        self.path=self.root/'journal.json'
        if not os.path.lexists(self.path) and any(self.root.iterdir()): raise RuntimeError('Непорожній сторонній каталог стану без журналу')
        if os.path.lexists(self.path):
            st=self.path.lstat()
            if not stat.S_ISREG(st.st_mode) or st.st_uid!=uid or stat.S_IMODE(st.st_mode)!=0o600 or st.st_nlink!=1: raise RuntimeError('Небезпечний журнал')
        self.data=json.loads(self.path.read_text()) if self.path.exists() else {'files':{},'prior':{},'packages':[]}
    def save(self):
        p=self.root/('journal-'+str(uuid.uuid4()))
        fd=os.open(p,os.O_WRONLY|os.O_CREAT|os.O_EXCL|os.O_NOFOLLOW,0o600)
        with os.fdopen(fd,'w') as f:
            json.dump(self.data,f,indent=2); f.flush(); os.fsync(f.fileno())
        os.replace(p,self.path)
        fd=os.open(self.root,os.O_RDONLY|os.O_DIRECTORY); os.fsync(fd); os.close(fd)
    def create(self,path,data,mode):
        path=pathlib.Path(path)
        if os.path.lexists(path): raise FileExistsError(str(path))
        # Тимчасовий файл на тій самій ФС: inode записано ДО публікації.
        stage=path.parent/('.sdr-stage-'+str(uuid.uuid4()))
        fd=os.open(stage,os.O_WRONLY|os.O_CREAT|os.O_EXCL|os.O_NOFOLLOW,mode)
        try:
            with os.fdopen(fd,'wb') as f:
                os.fchmod(f.fileno(),mode); f.write(data); f.flush(); os.fsync(f.fileno()); st=os.fstat(f.fileno())
            self.data['files'][str(path)]={'hash':digest(data),'inode':st.st_ino,'dev':st.st_dev,'mode':mode,'stage':str(stage)}
            self.save()
            os.link(stage,path,follow_symlinks=False)
        finally:
            stage.unlink(missing_ok=True)
    def create_link(self,path,target):
        path=pathlib.Path(path)
        if os.path.lexists(path): raise FileExistsError(str(path))
        stage=path.parent/('.sdr-stage-'+str(uuid.uuid4())); stage.symlink_to(target)
        try:
            st=stage.lstat()
            self.data['files'][str(path)]={'target':str(target),'inode':st.st_ino,'dev':st.st_dev,'stage':str(stage)}
            self.save(); os.link(stage,path,follow_symlinks=False)
        finally: stage.unlink(missing_ok=True)
    def matches(self,path,entry):
        st=path.lstat()
        if 'target' in entry: return stat.S_ISLNK(st.st_mode) and st.st_uid==self.uid and st.st_ino==entry['inode'] and st.st_dev==entry['dev'] and os.readlink(path)==entry['target']
        return stat.S_ISREG(st.st_mode) and st.st_uid==self.uid and st.st_ino==entry['inode'] and st.st_dev==entry['dev'] and stat.S_IMODE(st.st_mode)==entry['mode'] and digest(path.read_bytes())==entry['hash']
    def verify(self):
        for name,e in self.data['files'].items():
            p=pathlib.Path(name)
            if os.path.lexists(p) and not self.matches(p,e): raise RuntimeError(f'Стороння зміна; не чіпаю: {p}')
    def remove_owned(self):
        self.verify()
        for name,e in list(self.data['files'].items()):
            p=pathlib.Path(name)
            if os.path.lexists(p): p.unlink()
            stage=pathlib.Path(e['stage'])
            if os.path.lexists(stage):
                if not self.matches(stage,e): raise RuntimeError(f'Сторонній тимчасовий файл: {stage}')
                stage.unlink()
            del self.data['files'][name]; self.save()

PRIVATE=[ipaddress.ip_network(s) for s in ('10.0.0.0/8','172.16.0.0/12','192.168.0.0/16')]
USB_NET=ipaddress.ip_network('192.168.247.0/24')

def lan_address(rows, name):
    if not re.fullmatch(r'(eth\d+|en[a-zA-Z0-9]+|wlan\d+|wl[a-zA-Z0-9]+)',name):
        raise ValueError('Потрібен фізичний LAN/Wi-Fi, не VPN/міст')
    for row in rows:
        if row['ifname']!=name: continue
        for a in row.get('addr_info',[]):
            if a.get('family')!='inet': continue
            ip=ipaddress.ip_address(a['local']); net=ipaddress.ip_network(f"{ip}/{a['prefixlen']}",strict=False)
            if any(ip in n for n in PRIVATE) and not net.overlaps(USB_NET): return str(ip),str(net)
    raise ValueError('Немає приватної IPv4 LAN або конфлікт USB підмережі')

def lease_target(text, neighbors):
    for line in text.splitlines():
        p=line.split()
        if len(p)<3: continue
        try:
            if int(p[0])<=time.time() or p[2]!='192.168.247.2' or not re.fullmatch(r'(?:[0-9a-fA-F]{2}:){5}[0-9a-fA-F]{2}',p[1]): continue
            if int(p[1][:2],16)&1 or int(p[1].replace(':',''),16)==0: continue
        except ValueError: continue
        if any(n.get('dst')==p[2] and n.get('lladdr','').lower()==p[1].lower() and set(n.get('state',[])) & {'REACHABLE','STALE','DELAY','PROBE','PERMANENT'} for n in neighbors): return p[2]
    return None

def firewall_preflight(ruleset, legacy):
    # Accept in another nft base chain cannot override DROP. Never weaken Docker/UFW.
    for obj in ruleset.get('nftables',[]):
        chain=obj.get('chain',{})
        if chain.get('hook') in ('forward','prerouting'):
            raise RuntimeError('Конфлікт firewall (Docker/UFW/nft): потрібен аудит адміністратора; захист не вимикаю')
    if re.search(r'^:FORWARD (?!ACCEPT)',legacy,re.M) or re.search(r'^-A (FORWARD|PREROUTING) ',legacy,re.M):
        raise RuntimeError('Конфлікт legacy firewall; потрібен аудит, не flush/disable')

def internet_plan(usb,lan,gateway,host,network,dns,owner):
    if not re.fullmatch(r'[a-zA-Z0-9_.-]{1,15}',usb): raise ValueError('Неприпустимий USB інтерфейс')
    lan_address([{'ifname':lan,'addr_info':[{'family':'inet','local':host,'prefixlen':ipaddress.ip_network(network).prefixlen}]}],lan)
    net=ipaddress.ip_network(network); gateway=str(ipaddress.IPv4Address(gateway))
    if ipaddress.ip_address(gateway) not in net or gateway==host: raise ValueError('Gateway має бути на вибраному LAN')
    if not re.fullmatch('[a-zA-Z0-9-]+',owner): raise ValueError('Неприпустимий owner')
    servers=[]
    for address in dns:
        ip=ipaddress.IPv4Address(address)
        if ip.is_loopback or ip.is_unspecified or ip.is_multicast or ip in USB_NET or str(ip)==host: raise ValueError('DNS не є upstream вибраного LAN')
        servers.append(f'--server={ip}@{lan}@{host}')
    if not servers: raise ValueError('Вибраний LAN не надав IPv4 DNS')
    table=20000+int(hashlib.sha256(owner.encode()).hexdigest()[:6],16)%40000
    name='sdr_pi_'+owner.replace('-','')
    nft=f'''create table inet {name} {{ comment "sdr-pi-v3:{owner}"; }}
add chain inet {name} input {{ type filter hook input priority -10; policy accept; }}
add rule inet {name} input iifname "{usb}" udp sport 68 udp dport 67 accept
add rule inet {name} input iifname "{usb}" ip saddr 192.168.247.2 ip daddr 192.168.247.1 udp dport 53 accept
add rule inet {name} input iifname "{usb}" ip saddr 192.168.247.2 ip daddr 192.168.247.1 tcp dport 53 accept
add rule inet {name} input iifname "{usb}" ip saddr 192.168.247.2 ct state established,related accept
add rule inet {name} input iifname "{usb}" drop
add chain inet {name} forward {{ type filter hook forward priority -10; policy accept; }}
add rule inet {name} forward iifname "{usb}" oifname "{lan}" ip saddr 192.168.247.2 ct state new,established,related accept
add rule inet {name} forward iifname "{lan}" oifname "{usb}" ip daddr 192.168.247.2 ct state established,related accept
add rule inet {name} forward iifname "{usb}" drop
add rule inet {name} forward oifname "{usb}" drop
add chain inet {name} nat {{ type nat hook postrouting priority 100; policy accept; }}
add rule inet {name} nat oifname "{lan}" ip saddr 192.168.247.2 masquerade
'''
    # Priority 100/101 must be unused; no foreign rules ahead of ours except local.
    # Terminal unreachable rule remains even if a link-down removes its routes.
    return dict(name=name,owner=owner,table=str(table),nft=nft,
        routes=[['unreachable','default','metric','32767'],[network,'dev',lan,'scope','link'],['default','via',gateway,'dev',lan,'metric','10']],
        rules=[['priority','100','from','192.168.247.2/32','lookup',str(table)],['priority','101','from','192.168.247.2/32','unreachable']],
        dns=servers+['--dhcp-option=3,192.168.247.1','--dhcp-option=6,192.168.247.1'])

def discover(root=pathlib.Path('/sys/class/net')):
    found=[]
    for net in root.iterdir():
        try:
            dev=(net/'device').resolve(strict=True)
            if (dev/'driver').resolve().name != 'cdc_ncm': continue
            for parent in (dev, *dev.parents):
                if (parent/'idVendor').exists():
                    if (parent/'idVendor').read_text().strip().lower()=='cafe' and (parent/'idProduct').read_text().strip().lower()=='4015': found.append(net.name)
                    break
        except (OSError, RuntimeError): continue
    return sorted(found)

import subprocess
UNIT='''[Unit]
Description=SDR Pi: локальний наскрізний TLS
After=NetworkManager.service network.target
Wants=NetworkManager.service
StartLimitIntervalSec=0

[Service]
Type=simple
ExecStart=/usr/bin/python3 /usr/local/sbin/sdr-pi _daemon
Restart=always
RestartSec=5
TimeoutStopSec=45
KillMode=control-group
UMask=0077
NoNewPrivileges=yes
ProtectHome=yes
ProtectSystem=full
ReadWritePaths=/var/lib/sdr-pi-v2
PrivateTmp=yes

[Install]
WantedBy=multi-user.target
'''

def command(*args,check=True,input=None):
    p=subprocess.run(args,input=input,text=True,stdout=subprocess.PIPE,stderr=subprocess.PIPE,timeout=40,env={**os.environ,'LC_ALL':'C','PATH':'/usr/sbin:/usr/bin:/sbin:/bin'})
    if check and p.returncode: raise RuntimeError(f"{' '.join(args)}: {p.stderr.strip()}")
    return p.stdout.strip()

def active_uuid(run,iface):
    text=run('nmcli','-t','-f','UUID,DEVICE','connection','show','--active')
    for line in text.splitlines():
        p=line.split(':',1)
        if len(p)==2 and p[1]==iface: return p[0]
    return ''

class Installer:
    def __init__(self,root=pathlib.Path('/'),run=command,uid=0):
        self.root=pathlib.Path(root); self.run=run; self.uid=uid
        self.state=self.root/'var/lib/sdr-pi-v2'; self.script=self.root/'usr/local/sbin/sdr-pi'
        self.unit=self.root/'etc/systemd/system/sdr-pi-v2.service'
        self.enable=self.unit.parent/'multi-user.target.wants/sdr-pi-v2.service'
        self.profile=self.root/'etc/NetworkManager/system-connections/sdr-pi-v2.nmconnection'
        self.sysctl=self.root/'etc/sysctl.d/90-sdr-pi-v3-forwarding.conf'
    def prepare_fixture(self):
        if self.root==pathlib.Path('/'): raise RuntimeError('Лише для тестової ФС')
        for p in (self.state.parent,self.script.parent,self.unit.parent,self.enable.parent,self.profile.parent,self.sysctl.parent):
            p.mkdir(parents=True,exist_ok=True)
        self.sysctl.parent.chmod(0o700); self.sysctl.parent.parent.chmod(0o700)
    def journal(self): return Journal(self.state,self.uid)
    def install(self,lan,port,source,internet=False,forwarding_consent=False):
        Updater(self).guard()
        if internet and not forwarding_consent: raise RuntimeError('Потрібна явна згода на глобальний ip_forward')
        if self.state.exists():
            j=self.journal()
            if j.data.get('installed'):
                j.verify()
                if j.data.get('version')!=VERSION or j.data['files'].get(str(self.script),{}).get('hash')!=digest(source):
                    raise RuntimeError('Оновлення: збережіть старий файл/журнал, завантажте новий файл ОКРЕМО, виконайте старою копією sudo sdr-pi rollback, потім install новою. Не cp поверх установленого файла (inode/hash).')
                if j.data.get('internet',False)!=internet: raise RuntimeError('Зміна Internet режиму потребує rollback')
                if j.data['lan']!=lan or j.data['port']!=port: raise RuntimeError('Для зміни параметрів спочатку rollback')
                self.start(); return
            if j.data.get('files') or j.data.get('internet_tx') or j.data.get('forwarding'): raise RuntimeError('Незавершене встановлення/Internet: спочатку rollback')
        for p in (self.script,self.unit,self.enable,self.profile):
            if os.path.lexists(p): raise FileExistsError(f'Збережено сторонній файл: {p}')
        j=self.journal(); ident=str(uuid.uuid4())
        j.data.update(uuid=ident,lan=lan,port=port,version=VERSION,internet=internet,installed=False,prior={},restore_pending={}); j.save()
        profile=f'''[connection]
id=sdr-pi-v2
uuid={ident}
type=ethernet
autoconnect=false

[ethernet]

[ipv4]
method=manual
address1=192.168.247.1/24
never-default=true
ignore-auto-dns=true

[ipv6]
method=disabled
'''
        try:
            if internet: Forwarding(self).install()
            j=self.journal()
            j.create(self.script,source,0o700); j.create(self.unit,UNIT.encode(),0o644); j.create(self.profile,profile.encode(),0o600)
            self.run('nmcli','connection','load',str(self.profile))
            self.run('systemctl','daemon-reload')
            j.data['installed']=True; j.save(); self.start()
        except BaseException:
            try: self.rollback()
            except Exception as e: print(f'Автовідкат не завершено: {e}. Повторіть rollback.',flush=True)
            raise
    def start(self):
        Updater(self).guard()
        j=self.journal(); j.verify()
        if j.data.get('version')!=VERSION: raise RuntimeError('Виявлено v2: не замінюйте файл; rollback старою копією, install окремо завантаженою v3')
        if not j.data.get('installed'): raise RuntimeError('Спочатку install')
        for p in (self.script,self.unit,self.profile):
            if not p.exists(): raise RuntimeError(f'Відсутній власний файл: {p}; rollback')
        if j.data.get('internet'): Forwarding(self).activate()
        j=self.journal()
        if os.path.lexists(self.enable) and str(self.enable) not in j.data['files']: raise RuntimeError('Стороннє посилання автозапуску')
        if not os.path.lexists(self.enable): j.create_link(self.enable,self.unit)
        self.run('systemctl','daemon-reload'); self.run('systemctl','start','sdr-pi-v2.service')
        self.run('systemctl','is-active','--quiet','sdr-pi-v2.service')
        self.run('systemctl','is-enabled','--quiet','sdr-pi-v2.service')
        print(status_report(self),flush=True)
    def stop(self):
        Updater(self).guard()
        if not self.state.exists(): return
        j=self.journal(); j.verify()
        if str(self.unit) in j.data['files']: self.run('systemctl','stop','sdr-pi-v2.service')
        j=self.journal(); j.verify()
        if str(self.enable) in j.data['files']:
            if os.path.lexists(self.enable): self.enable.unlink()
            del j.data['files'][str(self.enable)]; j.save()
        self.run('systemctl','daemon-reload')
        self.restore(j)
        Internet(self).cleanup()
    def restore(self,j):
        own=j.data.get('uuid')
        if not own: return
        active=self.run('nmcli','-t','-f','UUID,DEVICE','connection','show','--active')
        pending=j.data.setdefault('restore_pending',{})
        for line in (active or '').splitlines():
            p=line.split(':')
            if len(p)==2 and p[0]==own:
                prior=j.data.get('prior',{}).get(p[1])
                if prior: pending[p[1]]=prior; j.save()
                self.run('nmcli','connection','down','uuid',own)
        for iface,prior in list(pending.items()):
            current=active_uuid(self.run,iface)
            if current and current not in ('--',own,prior):
                print(f'{iface}: користувач уже вибрав інший профіль; не замінюю',flush=True)
            elif current!=prior: self.run('nmcli','connection','up','uuid',prior,'ifname',iface)
            del pending[iface]; j.save()
    def rollback(self):
        if not self.state.exists(): return
        self.stop(); j=self.journal(); j.verify()
        # Видаляємо лише inode/хеш власних файлів. Чужі профілі не редагуються.
        j.remove_owned(); Forwarding(self).rollback(); j=self.journal()
        self.run('nmcli','connection','reload'); self.run('systemctl','daemon-reload')
        remaining=self.run('nmcli','-t','-f','UUID','connection','show')
        if j.data.get('uuid') in (remaining or '').splitlines(): raise RuntimeError('NM ще тримає власний UUID; відкат не завершено. Повторіть rollback після перевірки NM')
        j.data['installed']=False; j.save()
        print('Відкат виконано. Пакети залишено:', ', '.join(j.data.get('packages',[])) or 'немає записаних',flush=True)

class Updater:
    """Schema-3, code-only update. Never restore a global network snapshot.

    update.json is the write-ahead record, not the live ownership journal.
    Backups remain root-only for audit. Recovery is run from a separate candidate.
    The installed unit/profile/sysctl and enable-link inodes are not replaced.
    """
    def __init__(self,app):
        self.app=app; self.path=app.state/'update.json'

    def separate(self,source):
        source=pathlib.Path(source)
        if source.resolve()==self.app.script.resolve() or (self.app.script.exists() and source.samefile(self.app.script)):
            raise RuntimeError('update/recover-update запускайте окремо завантаженою копією, не встановленим inode')

    @staticmethod
    def runner(pid=None):
        pid=os.getpid() if pid is None else pid
        text=pathlib.Path(f'/proc/{int(pid)}/stat').read_text()
        return {'pid':pid,'start':text.rsplit(')',1)[1].split()[19],
            'boot':pathlib.Path('/proc/sys/kernel/random/boot_id').read_text().strip()}

    def guard(self,daemon=False):
        if not os.path.lexists(self.path): return
        r=self.load()
        if daemon and r['phase'] in ('trial','restored','complete'):
            try:
                live=r['runner']==self.runner(r['runner']['pid'])
                j=self.app.journal()
                entry=j.data['files'][str(self.app.script)]
                expected=[r['old']] if r['phase']=='restored' else ([r['new']] if r['phase']=='trial' else [r['old'],r.get('new')])
                live=live and entry in expected
                if live and j.data['files'][str(self.app.script)]==entry and j.matches(self.app.script,entry):
                    j.verify(); return
            except (OSError,KeyError,ValueError): pass
        raise RuntimeError('Перерване оновлення; запускайте recover-update окремою копією. Мережу не змінено.')

    @staticmethod
    def sync(directory):
        fd=os.open(directory,os.O_RDONLY|os.O_DIRECTORY|os.O_NOFOLLOW)
        try: os.fsync(fd)
        finally: os.close(fd)

    def write(self):
        p=self.app.state/('update-stage-'+str(uuid.uuid4()))
        fd=os.open(p,os.O_WRONLY|os.O_CREAT|os.O_EXCL|os.O_NOFOLLOW,0o600)
        with os.fdopen(fd,'w') as f:
            json.dump(self.record,f,indent=2); f.flush(); os.fsync(f.fileno())
        if hasattr(self,'record_identity'):
            if not os.path.lexists(self.path) or self.identity()!=self.record_identity:
                raise RuntimeError('Стороння зміна update record; не перезаписую')
            os.replace(p,self.path)
        else:
            # Atomic no-clobber initial publication, including concurrent creators.
            os.link(p,self.path,follow_symlinks=False); p.unlink()
        self.record_identity=self.identity(); self.sync(self.app.state)

    def identity(self):
        st=self.path.lstat()
        if not stat.S_ISREG(st.st_mode) or st.st_uid!=self.app.uid or stat.S_IMODE(st.st_mode)!=0o600:
            raise RuntimeError('Небезпечний update record')
        return (st.st_dev,st.st_ino,digest(self.path.read_bytes()))

    def checkpoint(self,phase):
        self.record['phase']=phase; self.write()

    def service(self):
        text=self.app.run('systemctl','show','sdr-pi-v2.service',
            '-p','LoadState','-p','FragmentPath','-p','DropInPaths',
            '-p','ActiveState','-p','SubState','-p','MainPID',
            '-p','ControlPID','-p','ControlGroup','-p','UnitFileState')
        return dict(line.split('=',1) for line in text.splitlines() if '=' in line)

    def ownership(self,allow_code=False):
        app=self.app; j=app.journal()
        if not j.data.get('installed') or j.data.get('version')!=VERSION:
            raise RuntimeError('update підтримує лише встановлену схему v3; v2 потребує окремої міграції')
        for name,entry in j.data['files'].items():
            p=pathlib.Path(name)
            if allow_code and p==app.script: continue
            if not os.path.lexists(p) or not j.matches(p,entry):
                raise RuntimeError(f'Відсутній/сторонній власний файл: {p}')
        for p in (app.script,app.unit,app.profile):
            if str(p) not in j.data['files']: raise RuntimeError(f'Немає ownership: {p}')
        if app.unit.read_bytes()!=UNIT.encode(): raise RuntimeError('Непідтримуваний unit; потрібен аудит KillMode/ExecStart')
        if os.path.lexists(app.enable) and str(app.enable) not in j.data['files']:
            raise RuntimeError('Сторонній enable link')
        state=self.service()
        if (state.get('LoadState')!='loaded' or state.get('FragmentPath')!=str(app.unit)
                or state.get('DropInPaths')!='' or os.path.lexists(str(app.unit)+'.d')):
            raise RuntimeError('Сторонній systemd fragment/drop-in; не зупиняю')
        enabled=os.path.lexists(app.enable)
        if state.get('UnitFileState')!=('enabled' if enabled else 'disabled'):
            raise RuntimeError('Неоднозначний systemd enable state; потрібен аудит')
        if state.get('ActiveState') not in ('active','inactive','failed'):
            raise RuntimeError('Сервіс у перехідному стані; повторіть після перевірки')
        return j,state

    def quiesce(self):
        self.app.run('systemctl','stop','sdr-pi-v2.service')
        state=self.service()
        if (state.get('ActiveState') not in ('inactive','failed') or
                state.get('MainPID')!='0' or state.get('ControlPID')!='0'):
            raise RuntimeError('Зупинку daemon не підтверджено; журнал не замінено')
        group=state.get('ControlGroup','')
        if group:
            if not group.startswith('/') or '..' in pathlib.PurePosixPath(group).parts:
                raise RuntimeError('Неприпустима systemd cgroup')
            root=self.app.root/'sys/fs/cgroup'/group.lstrip('/')
            if root.exists():
                for p in (root/'cgroup.procs',*root.glob('**/cgroup.procs')):
                    if p.exists() and p.read_text().strip(): raise RuntimeError('Cgroup ще містить процеси')

    def clean(self):
        # Reload CURRENT journal after stop: the daemon may have written to it.
        self.app.restore(self.app.journal()); Internet(self.app).cleanup()
        j=self.app.journal()
        if j.data.get('internet_tx') or j.data.get('restore_pending'):
            raise RuntimeError('Поточна мережна транзакція не очищена; recovery заблоковано')
        return j

    def load(self):
        trusted_dir(self.app.state,self.app.uid)
        st=self.path.lstat()
        if not stat.S_ISREG(st.st_mode) or st.st_uid!=self.app.uid or stat.S_IMODE(st.st_mode)!=0o600:
            raise RuntimeError('Небезпечний update record')
        self.record=json.loads(self.path.read_text()); r=self.record
        if (r.get('format')!=1 or str(uuid.UUID(r['id']))!=r['id'] or
                type(r.get('active')) is not bool or type(r.get('enabled')) is not bool or
                r.get('phase') not in ('preparing','staged','quiesced','published','trial','recovering','restored','complete')):
            raise RuntimeError('Непідтримуваний update record')
        directory=self.app.script.parent/('.sdr-update-'+r['id'])
        if r['directory']!=str(directory): raise RuntimeError('Неприпустимий backup path')
        if os.path.lexists(directory):
            trusted_dir(directory,self.app.uid)
            if stat.S_IMODE(directory.lstat().st_mode)!=0o700: raise RuntimeError('Небезпечний backup directory')
        if st.st_nlink!=1:
            candidates=[*self.app.state.glob('update-'+r['id']+'-*.json'),*self.app.state.glob('update-stage-*')]
            links=[p for p in candidates if p.lstat().st_ino==st.st_ino and p.lstat().st_dev==st.st_dev]
            if st.st_nlink!=2 or len(links)!=1: raise RuntimeError('Невідомий hardlink update record')
        self.record_identity=self.identity()
        return r

    def recover(self):
        app=self.app
        if not os.path.lexists(self.path): raise RuntimeError('Немає перерваного update; нічого не змінено')
        r=self.load(); j,_=self.ownership(allow_code=True)
        entries=[r['old']]+([r['new']] if 'new' in r else [])
        if (j.data['files'][str(app.script)] not in entries or
                not any(j.matches(app.script,e) for e in entries)):
            raise RuntimeError('Installed code не відповідає old/new inode; не замінюю')
        directory=pathlib.Path(r['directory']); backup=directory/'old'
        if 'snapshot' in r:
            snapshot=r['snapshot']
            if snapshot.get('internet_tx') or snapshot.get('restore_pending'):
                raise RuntimeError('Backup journal містить живу мережну транзакцію')
            if snapshot['files'][str(app.script)]!=r['old']:
                raise RuntimeError('Backup journal не відповідає old code')
            for name,e in snapshot['files'].items():
                if name==str(app.script): continue
                if j.data['files'].get(name)!=e or not j.matches(pathlib.Path(name),e):
                    raise RuntimeError('Backup ownership змінився; потрібен аудит')
            if set(snapshot['files'])!=set(j.data['files']): raise RuntimeError('Склад власних файлів змінився')
            for key in ('uuid','lan','port','version','internet','forwarding'):
                if snapshot.get(key)!=j.data.get(key): raise RuntimeError('Конфігурація змінилася під час update')
            if not backup.exists() or not j.matches(backup,r['old']): raise RuntimeError('Old inode backup втрачено/змінено')
        elif not j.matches(app.script,r['old']):
            raise RuntimeError('Немає clean snapshot для нового коду')
        else:
            # An interruption can precede mkdir/link. Establish a durable old
            # inode backup before recording the first recovery snapshot.
            if not directory.exists(): directory.mkdir(mode=0o700); self.sync(directory.parent)
            if os.path.lexists(backup):
                if not j.matches(backup,r['old']): raise RuntimeError('Сторонній old backup')
            else: os.link(app.script,backup,follow_symlinks=False); self.sync(directory)
        self.quiesce()
        with exclusive(app.root/'run/sdr-pi-v2-daemon.lock',app.uid):
            self.ownership(allow_code=True)
            # Candidate may have acquired a NEW network transaction during trial.
            # Never overwrite that journal before its ownership-checked cleanup.
            current=self.clean()
            if 'snapshot' not in r: r['snapshot']=json.loads(json.dumps(current.data))
            self.checkpoint('recovering')
            if not current.matches(app.script,r['old']):
                if not current.matches(app.script,r['new']): raise RuntimeError('Code змінився після stop')
                restore=directory/'restore'
                if os.path.lexists(restore):
                    if not current.matches(restore,r['old']): raise RuntimeError('Сторонній restore stage')
                else: os.link(backup,restore,follow_symlinks=False); self.sync(directory)
                # old identity was recorded before replacement; hardlink keeps inode.
                os.replace(restore,app.script); self.sync(app.script.parent)
            current.data=json.loads(json.dumps(r['snapshot'])); current.save()
            current.verify(); r['runner']=self.runner(); self.checkpoint('restored')
        self.restart(); self.ownership(); self.finish()

    def finish(self):
        self.checkpoint('complete')
        archive=self.app.state/('update-'+self.record['id']+'-'+str(uuid.uuid4())+'.json')
        if os.path.lexists(archive): raise RuntimeError('Сторонній recovery archive')
        # link+unlink is recoverable even if power fails between them.
        os.link(self.path,archive,follow_symlinks=False); self.sync(self.app.state)
        self.path.unlink(); self.sync(self.app.state)

    def restart(self):
        if self.record['active']:
            self.app.run('systemctl','start','sdr-pi-v2.service')
        state=self.service()
        if (state.get('ActiveState')=='active')!=self.record['active']:
            raise RuntimeError('Початковий active state не відновлено')
        if state.get('UnitFileState')!=('enabled' if self.record['enabled'] else 'disabled'):
            raise RuntimeError('Початковий enable state змінився; потрібен аудит')

    def update(self,source):
        app=self.app
        if os.path.lexists(self.path): raise RuntimeError('Перерване оновлення: окремою копією recover-update')
        compile(source,'candidate','exec')
        j,state=self.ownership()
        for p in (app.state,app.script.parent): trusted_dir(p,app.uid)
        ident=str(uuid.uuid4()); directory=app.script.parent/('.sdr-update-'+ident)
        self.record={'format':1,'id':ident,'directory':str(directory),
            'active':state['ActiveState']=='active','enabled':os.path.lexists(app.enable),
            'old':j.data['files'][str(app.script)],'phase':'preparing'}
        self.write()  # Intent and original service state before ANY mutation.
        directory.mkdir(mode=0o700); self.sync(directory.parent)
        os.link(app.script,directory/'old',follow_symlinks=False); self.sync(directory)
        if not j.matches(directory/'old',self.record['old']): raise RuntimeError('Backup identity змінилася')
        fd=os.open(directory/'new',os.O_WRONLY|os.O_CREAT|os.O_EXCL|os.O_NOFOLLOW,0o700)
        with os.fdopen(fd,'wb') as f:
            os.fchmod(f.fileno(),0o700); f.write(source); f.flush(); os.fsync(f.fileno()); st=os.fstat(f.fileno())
        self.sync(directory)
        self.record['new']={'hash':digest(source),'inode':st.st_ino,'dev':st.st_dev,'mode':0o700,'stage':str(directory/'new')}
        self.checkpoint('staged')  # New inode durable before publication.
        self.quiesce()
        with exclusive(app.root/'run/sdr-pi-v2-daemon.lock',app.uid):
            self.ownership(); j=self.clean(); self.ownership()
            self.record['snapshot']=json.loads(json.dumps(j.data))
            self.checkpoint('quiesced')  # Clean journal, never a pre-stop network snapshot.
            if not j.matches(directory/'new',self.record['new']): raise RuntimeError('Candidate stage змінився')
            if not j.matches(app.script,self.record['old']): raise RuntimeError('Installed code змінився')
            os.replace(directory/'new',app.script); self.sync(app.script.parent)
            self.checkpoint('published')
            j.data['files'][str(app.script)]=self.record['new']; j.save()
            self.record['runner']=self.runner(); self.checkpoint('trial')
        self.restart(); self.ownership(); self.finish()


class Forwarding:
    """Consent-scoped global change; conservative, best-effort runtime rollback.

    There is no kernel ownership/refcount: concurrent invisible users cannot be
    ruled out. Never promise exact restoration of global kernel state.
    """
    def __init__(self,app): self.app=app; self.run=app.run
    def value(self):
        value=self.run('sysctl','-n','net.ipv4.ip_forward')
        if value not in ('0','1'): raise RuntimeError('Невідомий ip_forward')
        return value
    def install(self):
        app=self.app; j=app.journal()
        trusted_dir(app.sysctl.parent,app.uid)
        if os.path.lexists(app.sysctl): raise FileExistsError(f'Сторонній sysctl drop-in: {app.sysctl}')
        # Publishing the drop-in can activate forwarding on reboot even if
        # installation dies before the explicit runtime sysctl command.
        j.data['forwarding']={'prior':self.value(),'approved':True,'pending':True}; j.save()
        j.create(app.sysctl,b'# Owned by SDR Pi v3; remove via rollback\nnet.ipv4.ip_forward=1\n',0o644)
    def activate(self):
        j=self.app.journal(); j.verify(); tx=j.data.get('forwarding')
        if not tx or not tx.get('approved') or str(self.app.sysctl) not in j.data['files'] or not self.app.sysctl.exists():
            raise RuntimeError('Немає згоди/власного sysctl drop-in; rollback та install')
        if self.value()=='1': return
        tx['pending']=True; j.save()  # durable BEFORE any global mutation
        self.run('sysctl','-w','net.ipv4.ip_forward=1')
        if self.value()!='1': raise RuntimeError('ip_forward readback не підтверджено')
        tx['pending']=False; tx['changed']=True; j.save()
    def users(self):
        # Unknown/failed inspection is unsafe; caller preserves current value.
        rules=json.loads(self.run('nft','-j','list','ruleset'))
        if any(o.get('chain',{}).get('hook') in ('forward','prerouting','postrouting') for o in rules['nftables']): return True
        for exe in ('iptables-save','iptables-legacy-save'):
            if shutil.which(exe):
                text=self.run(exe)
                if re.search(r'^-A |^:FORWARD (?!ACCEPT)',text,re.M): return True
        rules=json.loads(self.run('ip','-j','rule','show'))
        if any((r.get('priority'),str(r.get('table'))) not in ((0,'local'),(32766,'main'),(32767,'default')) or r.get('src','all')!='all' for r in rules): return True
        links=json.loads(self.run('ip','-j','link','show'))
        if any(r['ifname'] not in ('lo',self.app.journal().data['lan']) for r in links): return True
        for folder in ('etc/sysctl.d','run/sysctl.d','usr/local/lib/sysctl.d','usr/lib/sysctl.d','lib/sysctl.d'):
            for p in (self.app.root/folder).glob('*.conf'):
                if any(re.search(r'(ip_forward|[./]forwarding)\s*=\s*1\b',line.split('#')[0].split(';')[0]) for line in p.read_text().splitlines()): return True
        p=self.app.root/'etc/sysctl.conf'
        if p.exists() and re.search(r'(?m)^\s*[^#\n]*(ip_forward|[./]forwarding)\s*=\s*1\b',p.read_text()): return True
        shared=self.run('nmcli','-t','-f','UUID','connection','show')
        for ident in shared.splitlines():
            if self.run('nmcli','-g','ipv4.method','connection','show','uuid',ident)=='shared': return True
        return False
    def rollback(self):
        j=self.app.journal(); tx=j.data.get('forwarding')
        if not tx: return  # legacy v2 journal has no global forwarding ownership
        warning=None
        if tx['prior']=='0' and (tx.get('changed') or tx.get('pending')):
            try:
                if self.value()!='1' or self.users() or self.value()!='1':
                    warning='ip_forward збережено: зміна значення або можливі інші forwarding users; потрібен аудит адміністратора.'
                else:
                    self.run('sysctl','-w','net.ipv4.ip_forward=0')
                    if self.value()!='0': raise RuntimeError('rollback readback failed')
            except Exception as e: warning=f'ip_forward: не підтверджено безпечний відкат; значення не примушую. Аудит: {e}'
        if warning:
            j.data.setdefault('audit_warnings',[]).append(warning); print(warning,flush=True)
        del j.data['forwarding']; j.save()

class Internet:
    """Fail-closed, journaled, exclusively owned networking."""
    def __init__(self,app): self.app=app; self.run=app.run
    def prepare(self,usb,host,network):
        if self.run('sysctl','-n','net.ipv4.ip_forward')!='1':
            raise RuntimeError('ip_forward=0: Internet закрито; start активує лише схвалену інсталятором конфігурацію. Перевірте конфлікт sysctl/адміністратора.')
        j=self.app.journal(); lan=j.data['lan']
        # iproute2 omits "dev" in JSON when the CLI already filters by device.
        # Read all main defaults, then require the selected LAN explicitly below.
        routes=json.loads(self.run('ip','-j','-4','route','show','table','main','default'))
        gateways={r['gateway'] for r in routes if r.get('gateway') and r.get('dev')==lan and 'linkdown' not in r.get('flags',[])}
        if len(gateways)!=1: raise RuntimeError('Немає однозначного gateway саме вибраного LAN; default іншої NIC/VPN не використовую')
        dns=self.run('nmcli','-g','IP4.DNS','device','show',lan).splitlines()
        addresses=json.loads(self.run('ip','-j','address','show'))
        local={a['local'] for row in addresses for a in row.get('addr_info',[]) if a.get('family')=='inet'}
        if local.intersection(dns): raise RuntimeError('DNS upstream указує на сам Pi/іншу локальну NIC; це може передати запит чужому resolver. Потрібен зовнішній DNS вибраного LAN.')
        return internet_plan(usb,lan,gateways.pop(),host,network,dns,j.data['uuid'])
    @staticmethod
    def canonical(data):
        if isinstance(data,list): return [Internet.canonical(x) for x in data if not isinstance(x,dict) or 'metainfo' not in x]
        if isinstance(data,dict): return {k:Internet.canonical([x for x in v if x!='linkdown'] if k=='flags' and isinstance(v,list) else v) for k,v in data.items() if k not in ('handle','expires')}
        return data
    def nft_state(self,name):
        all_rules=json.loads(self.run('nft','-j','list','ruleset'))
        result=[]
        for obj in all_rules.get('nftables',[]):
            for kind,value in obj.items():
                if isinstance(value,dict) and value.get('family')=='inet' and (value.get('table')==name or kind=='table' and value.get('name')==name): result.append(obj)
        return self.canonical(result)
    def route_state(self,plan):
        # Query all tables: an empty/nonexistent table must not mask command errors.
        rows=json.loads(self.run('ip','-j','route','show','table','all'))
        return self.canonical([r for r in rows if str(r.get('table'))==plan['table']])
    def rule_state(self,plan):
        rows=json.loads(self.run('ip','-j','rule','show'))
        return self.canonical([r for r in rows if r.get('priority') in (100,101) or str(r.get('table'))==plan['table']])
    def apply(self,plan):
        j=self.app.journal()
        if j.data.get('internet_tx'): raise RuntimeError('Незавершена Internet транзакція: stop/rollback перед повтором')
        ruleset=json.loads(self.run('nft','-j','list','ruleset'))
        if any(o.get('table',{}).get('name')==plan['name'] for o in ruleset.get('nftables',[])):
            raise RuntimeError('Існує стороння nft таблиця; не приймаю її у власність')
        legacy=self.run('iptables-save') if shutil.which('iptables-save') else ''
        firewall_preflight(ruleset,legacy)
        # Also inspect legacy backend when installed (iptables-nft alone cannot see it).
        if shutil.which('iptables-legacy-save'): firewall_preflight({'nftables':[]},self.run('iptables-legacy-save'))
        rules=json.loads(self.run('ip','-j','rule','show'))
        if any((int(r.get('priority',0))<=101 and not (r.get('priority')==0 and str(r.get('table')) in ('local','255') and r.get('src','all')=='all')) or str(r.get('table'))==plan['table'] for r in rules):
            raise RuntimeError('Конфлікт policy routing priority 100/101 або власної таблиці; не змінюю чужі правила')
        if self.route_state(plan): raise RuntimeError('Стороння routing table; не очищаю')
        tx=dict(plan=plan,nft=[],routes=[],rules=[],done=[],pending=None,configured=False)
        j.data['internet_tx']=tx; j.save()
        # nft batch is atomic; create (not add) rejects a concurrent foreign table.
        operations=[('nft',['nft','-f','-'],plan['nft'])]
        operations += [('rule',['ip','-4','rule','add',*plan['rules'][1]],None)]
        operations += [('route',['ip','-4','route','add','table',plan['table'],*r],None) for r in plan['routes']]
        operations += [('rule',['ip','-4','rule','add',*plan['rules'][0]],None)]
        for kind,args,text in operations:
            tx['pending']={'kind':kind,'args':args}; j.save()
            if text is not None: self.run(*args,input=text)
            else: self.run(*args)
            key={'nft':'nft','route':'routes','rule':'rules'}[kind]
            before=tx[key]
            tx['nft']=self.nft_state(plan['name']); tx['routes']=self.route_state(plan); tx['rules']=self.rule_state(plan)
            tx['done'].append({'kind':kind,'args':args,'owned':[item for item in tx[key] if item not in before]})
            tx['pending']=None; j.save()
        if not tx['nft'] or len(tx['routes'])!=3 or len(tx['rules'])!=2: raise RuntimeError('Internet readback не підтвердив конфігурацію')
        tx['configured']=True; j.save()
    def verify(self):
        tx=self.app.journal().data.get('internet_tx')
        if not tx: return False
        p=tx['plan']
        if tx['pending']: raise RuntimeError('Перервана Internet операція; спочатку stop, при конфлікті — аудит journal.json')
        if self.nft_state(p['name'])!=tx['nft'] or self.route_state(p)!=tx['routes'] or self.rule_state(p)!=tx['rules']:
            raise RuntimeError('Змінено власні Internet правила або втрачено link; закриваю доступ, потрібне відновлення')
        if self.run('sysctl','-n','net.ipv4.ip_forward')!='1': raise RuntimeError('Глобальний ip_forward вимкнено адміністратором')
        return tx['configured']
    def cleanup(self):
        j=self.app.journal(); tx=j.data.get('internet_tx')
        if not tx: return
        p=tx['plan']
        # Caller deactivates owned USB first. Never remove guard with a live USB profile.
        if any(line.startswith(j.data['uuid']+':') for line in self.run('nmcli','-t','-f','UUID,DEVICE','connection','show','--active').splitlines()):
            raise RuntimeError('Спершу деактивуйте власний USB профіль; guard залишено')
        actual={'nft':self.nft_state(p['name']),'routes':self.route_state(p),'rules':self.rule_state(p)}
        # Link-down/reboot may delete owned objects. Subsets are safe; new/changed
        # objects (including crash after effect before readback) are NOT adopted.
        for kind in actual:
            if any(item not in tx[kind] for item in actual[kind]):
                raise RuntimeError('Стороння зміна/невизначена crash-фаза Internet; guard збережено. Аудит journal.json, не flush і не заміна скрипта.')
        for item in reversed(tx['done']):
            kind=item['kind']; args=item['args']
            if kind=='nft':
                if self.nft_state(p['name']): self.run('nft','delete','table','inet',p['name'])
            else:
                current=self.rule_state(p) if kind=='rule' else self.route_state(p)
                if any(owned in current for owned in item.get('owned',[])):
                    # Exact delete, no flush. ENOENT after hotplug is checked by readback.
                    delete=args.copy(); delete[3]='del'
                    try: self.run(*delete)
                    except RuntimeError:
                        after=self.rule_state(p) if kind=='rule' else self.route_state(p)
                        if after==current: raise
            # Preserve full ownership snapshot until all deletes finish. A repeated
            # stop tolerates absent entries; no broad restore of foreign rules.
        if self.nft_state(p['name']) or self.route_state(p) or self.rule_state(p): raise RuntimeError('Internet cleanup не підтверджено; повторіть stop')
        del j.data['internet_tx']; j.save()

class Runtime:
    def __init__(self,app,netroot=pathlib.Path('/sys/class/net'),detector=discover):
        Updater(app).guard(daemon=True)
        self.app=app; self.journal=app.journal(); self.child=None; self.token=None
        self.netroot=netroot; self.detector=detector
        self.dns_options=[]
        self.session=os.environ.get('INVOCATION_ID') or str(uuid.uuid4())
        self.internet_configured=False; self.sdr=None
        self.settling=None; self.stable_samples=0
    def choose(self,devices): return devices[0] if len(devices)==1 else None
    def usb_address(self,iface):
        rows=json.loads(self.app.run('ip','-j','address','show'))
        return any(row.get('ifname')==iface and any(
            a.get('family')=='inet' and a.get('local')=='192.168.247.1' and a.get('prefixlen')==24
            for a in row.get('addr_info',[])) for row in rows)
    def activate(self,iface,force=False):
        self.journal=self.app.journal()
        active=active_uuid(self.app.run,iface)
        if active==self.journal.data['uuid'] and not force: return
        # Запис перед перемиканням; чужі профілі та autoconnect незмінні.
        if active and active not in ('--',self.journal.data['uuid']):
            self.journal.data['prior'][iface]=active; self.journal.save()
        self.app.run('nmcli','connection','up','uuid',self.journal.data['uuid'],'ifname',iface)
    def stop_dhcp(self):
        if self.child:
            if self.child.poll() is None:
                self.child.terminate()
                try: self.child.wait(timeout=5)
                except subprocess.TimeoutExpired: self.child.kill(); self.child.wait()
            self.child=None
        self.token=None
    def dhcp_args(self,iface):
        dns=['--port=53','--listen-address=192.168.247.1','--stop-dns-rebind',*self.dns_options] if self.dns_options else ['--port=0','--dhcp-option=3','--dhcp-option=6']
        return ['dnsmasq','--keep-in-foreground','--conf-file=/dev/null','--no-hosts','--no-resolv','--bind-interfaces',f'--interface={iface}','--except-interface=lo','--user=root','--pid-file=',f'--dhcp-leasefile={self.app.state}/leases','--dhcp-authoritative','--dhcp-range=192.168.247.2,192.168.247.2,255.255.255.0,5m',*dns]
    def recover_network(self):
        self.stop_dhcp(); self.internet_configured=False; self.sdr=None
        if self.app.journal().data.get('internet_tx'):
            self.app.restore(self.app.journal()); Internet(self.app).cleanup()
        self.journal=self.app.journal(); self.dns_options=[]
    def snapshot(self):
        self.sdr=None
        devices=self.detector(); iface=self.choose(devices)
        if not iface:
            self.recover_network(); self.settling=(); self.stable_samples=0
            return None,('SDR не підключено: очікування cafe:4015 / cdc_ncm' if not devices else 'Знайдено кілька SDR: залиште підключеним один')
        token=(iface,(self.netroot/iface/'ifindex').read_text().strip())
        current=active_uuid(self.app.run,iface)
        if self.token and (token!=self.token or current!=self.journal.data['uuid'] or not self.usb_address(iface)):
            self.recover_network(); self.settling=token; self.stable_samples=0
            return None,'USB identity/IPv4/NM змінилися: старий DHCP зупинено; стабілізація'
        if self.settling is not None:
            if token!=self.settling: self.settling=token; self.stable_samples=0
            self.stable_samples+=1
            if self.stable_samples<2: return None,'Стабілізація USB: очікування повторного спостереження ifindex'
            self.settling=None
        rows=json.loads(self.app.run('ip','-j','address','show'))
        lan=self.journal.data['lan']; host,net=lan_address(rows,lan)
        if iface==lan: raise RuntimeError('USB не може бути LAN')
        for route in json.loads(self.app.run('ip','-j','route','show','table','all')):
            dest=route.get('dst','default')
            if dest=='default' or route.get('dev')==iface: continue
            try: overlap=ipaddress.ip_network(dest,strict=False).overlaps(USB_NET)
            except (ValueError,TypeError): continue
            if overlap: raise RuntimeError('Конфлікт 192.168.247.0/24; нічого не перемикаю')
        if self.journal.data.get('internet'):
            internet=Internet(self.app); plan=internet.prepare(iface,host,net)
            tx=self.app.journal().data.get('internet_tx')
            if tx and (tx['plan']!=plan or self.token!=token):
                self.recover_network(); tx=None
            if not tx: internet.apply(plan)
            self.internet_configured=internet.verify()
            self.dns_options=plan['dns']
        if current==self.journal.data['uuid'] and not self.usb_address(iface): self.activate(iface,force=True)
        else: self.activate(iface)
        # NM may report the old UUID while the re-enumerated NIC has no IPv4.
        # Never launch dnsmasq merely because connection up returned success.
        if (active_uuid(self.app.run,iface)!=self.journal.data['uuid'] or not self.usb_address(iface)
                or (self.netroot/iface/'ifindex').read_text().strip()!=token[1]):
            self.recover_network()
            return None,'USB IPv4 192.168.247.1/24 або активний NM UUID ще не підтверджено; DHCP не запускається'
        if token!=self.token or not self.child or self.child.poll() is not None:
            self.stop_dhcp(); (self.app.state/'leases').unlink(missing_ok=True)
            self.child=subprocess.Popen(self.dhcp_args(iface),stdin=subprocess.DEVNULL)
            self.token=token
        # .2 — єдина ВИДАНА НАМИ DHCP адреса, не припущення про прошивку.
        # Проба наповнює ARP; доступ відкривається лише після lease+MAC перевірки.
        reachable=False
        try:
            with socket.create_connection(('192.168.247.2',443),timeout=1): reachable=True
        except OSError: pass
        lease=self.app.state/'leases'
        target=lease_target(lease.read_text() if lease.exists() else '',json.loads(self.app.run('ip','-j','neigh','show','dev',iface)))
        if not target: return None,'Очікування DHCP оренди та підтвердженого MAC SDR'
        self.sdr=target
        if self.journal.data.get('internet') and not reachable: return None,f'SDR {target}: DHCP+MAC підтверджено, очікування HTTPS порту 443'
        return (host,self.journal.data['port'],target,net,lan,token),f'https://{host}:{self.journal.data["port"]}/'
    async def serve(self,stop_event=None,interval=3):
        stop=stop_event or asyncio.Event(); loop=asyncio.get_running_loop()
        import signal
        if stop_event is None:
            for sig in (signal.SIGTERM,signal.SIGINT): loop.add_signal_handler(sig,stop.set)
        relay=None; previous=None; message=None; backoff=Backoff()
        def publish(note,ready):
            status={'message':note,'ready':ready,'usb_token':self.token,'updated':time.time(),'session':self.session,'sdr':self.sdr,'lan_address':previous[0] if previous else None,'internet_configured':self.internet_configured,'internet_verified_from_sdr':False}
            p=self.app.state/('status-'+str(uuid.uuid4()))
            fd=os.open(p,os.O_WRONLY|os.O_CREAT|os.O_EXCL|os.O_NOFOLLOW,0o600)
            with os.fdopen(fd,'w') as f: json.dump(status,f,ensure_ascii=False)
            p.replace(self.app.state/'status.json')
        publish('Запуск поточної сесії; готовність ще не перевірена',False)
        try:
            while not stop.is_set():
                try: state,note=await asyncio.to_thread(self.snapshot)
                except Exception as e:
                    state=None; note=f'Очікування відновлення: {e}'
                    try: await asyncio.to_thread(self.recover_network)
                    except Exception as recovery: note+=f'; захисна зупинка: {recovery}'
                if state!=previous:
                    if relay: await relay.close(); relay=None
                    previous=None
                    if state:
                        try:
                            relay=Relay(state[0],state[1],(state[2],443),state[3],state[4]); await relay.start(); previous=state
                        except OSError as e: note=f'Не можу відкрити LAN порт: {e}'; relay=None
                delay=backoff.delay(previous is not None)*interval/3
                diagnostics=await asyncio.to_thread(recent_diagnostics,self.app.run)
                if diagnostics: note+='\n'+'\n'.join(diagnostics)
                # Stable messages are logged only on transitions, not every retry.
                if note!=message:
                    print(note,flush=True); message=note
                publish(note,previous is not None)
                try: await asyncio.wait_for(stop.wait(),delay)
                except asyncio.TimeoutError: pass
        finally:
            if relay: await relay.close()
            await asyncio.to_thread(self.stop_dhcp)
            self.internet_configured=False; publish('Сервіс зупинено; listener закрито',False)

import argparse, fcntl, shutil, platform

@contextlib.contextmanager
def exclusive(path,uid=0):
    fd=os.open(path,os.O_RDWR|os.O_CREAT|os.O_NOFOLLOW,0o600)
    try:
        st=os.fstat(fd)
        if not stat.S_ISREG(st.st_mode) or st.st_uid!=uid or stat.S_IMODE(st.st_mode)!=0o600 or st.st_nlink!=1: raise RuntimeError('Небезпечний lock файл')
        try: fcntl.flock(fd,fcntl.LOCK_EX|fcntl.LOCK_NB)
        except BlockingIOError: raise RuntimeError('Інша операція вже виконується')
        yield
    finally: os.close(fd)

def confirm(message):
    return input('\n'+readable(message)+'\n\nВведіть «так»: ').strip().lower()=='так'

def apt_command(*args):
    subprocess.run(args,check=True,env={**os.environ,'PATH':'/usr/sbin:/usr/bin:/sbin:/bin'})

def bootstrap(app,ask=confirm,which=shutil.which,apt=apt_command):
    missing=[pkg for exe,pkg in (('nmcli','network-manager'),('ip','iproute2'),('dnsmasq','dnsmasq-base'),('nft','nftables')) if not which(exe)]
    if not missing: return
    if not ask('Відсутні пакети: '+', '.join(missing)+'. Дозволити apt update/install? Пакети та дії maintainer scripts НЕ відкочуються; NetworkManager може змінити мережу.'):
        raise RuntimeError('Встановлення залежностей скасовано')
    j=app.journal()
    before=set(app.run('dpkg-query','-W','-f=${binary:Package} ${db:Status-Status}\\n').splitlines())
    j.data['apt_requested']=missing; j.data['apt_before']=sorted(before); j.save()
    try:
        apt('apt-get','update'); apt('apt-get','install','--no-remove','--no-upgrade','-y',*missing)
    finally:
        after=set(app.run('dpkg-query','-W','-f=${binary:Package} ${db:Status-Status}\\n').splitlines())
        j.data['packages']=sorted(set(j.data.get('packages',[])) | (after-before)); j.save()
        print('Пакети/стани, залишені після apt:', ', '.join(j.data['packages']) or 'немає нових записів')

def platform_check():
    release=dict(line.split('=',1) for line in pathlib.Path('/etc/os-release').read_text().splitlines() if '=' in line)
    if platform.machine() not in ('aarch64','arm64') or release.get('VERSION_CODENAME','').strip('"') not in ('bookworm','trixie'):
        raise RuntimeError('Підтримано Raspberry Pi OS 64-bit Bookworm/Trixie')
    model=pathlib.Path('/proc/device-tree/model').read_text().rstrip('\0')
    if not any(s in model for s in ('Raspberry Pi Zero 2','Raspberry Pi 3','Raspberry Pi 4','Raspberry Pi 5')): raise RuntimeError('Підтримано Pi Zero 2 W / 3 / 4 / 5, не оригінальний Zero')
    if not pathlib.Path('/run/systemd/system').is_dir(): raise RuntimeError('Потрібен systemd')

def check_port(app,host,port,lan):
    if app.state.exists():
        j=app.journal()
        if j.data.get('installed'):
            if (j.data['lan'],j.data['port'])!=(lan,port): raise RuntimeError('Зміна параметрів потребує rollback')
            return
    with socket.socket() as probe: probe.bind((host,port))

def status_report(app):
    j=app.journal(); j.verify()
    result=[f'SDR Pi {RELEASE}', 'Встановлено: '+('так' if j.data.get('installed') else 'ні')]
    try:
        raw=app.run('systemctl','show','sdr-pi-v2.service','-p','ActiveState','-p','InvocationID')
        service=dict(line.split('=',1) for line in raw.splitlines() if '=' in line)
    except Exception: service={}
    result.append('Сервіс: '+service.get('ActiveState','невідомо'))
    try: status=json.loads((app.state/'status.json').read_text())
    except (OSError,ValueError): status={}
    fresh=(service.get('ActiveState')=='active' and bool(service.get('InvocationID')) and
           status.get('session')==service['InvocationID'] and 0<=time.time()-status.get('updated',0)<90)
    # A recent heartbeat alone cannot prove the NIC still exists or owns IPv4.
    if fresh and status.get('ready'):
        try:
            token=status.get('usb_token'); devices=discover()
            fresh=bool(token and len(devices)==1 and devices[0]==token[0] and
                (pathlib.Path('/sys/class/net')/token[0]/'ifindex').read_text().strip()==token[1] and
                active_uuid(app.run,token[0])==j.data['uuid'] and Runtime(app).usb_address(token[0]))
        except Exception: fresh=False
    ready=fresh and status.get('ready',False)
    # Runtime notes may contain the URL and the same historical diagnostics.
    # Render the address once below, without discarding actual errors.
    notes=status.get('message','Поточний стан ще не отримано').splitlines() if fresh else []
    result.extend(line for line in notes if not line.startswith('https://'))
    try:
        host,network=lan_address(json.loads(app.run('ip','-j','address','show')),j.data['lan'])
        ready=ready and status.get('lan_address')==host
        result.append(f'LAN {j.data["lan"]}: {host} ({network})')
        result.append(('\nВебдоступ: готовий\n' if ready else '\nВебдоступ: очікування\nURL після готовності:\n')+f'https://{host}:{j.data["port"]}/'+'\n')
    except Exception: result.append('LAN IPv4 зараз невідома; перевірте вибраний кабель/Wi-Fi.')
    result.append('SDR IPv4: '+(str(status.get('sdr')) if fresh and status.get('sdr') else 'ще не підтверджена DHCP+MAC'))
    result.append('Інтернет: '+('налаштовано' if fresh and status.get('internet_configured') else 'очікування'))
    result.extend(line for line in dict.fromkeys(recent_diagnostics(app.run)) if line not in result)
    if service.get('ActiveState')!='active':
        result.append('\nНаступний крок:\nЗапустіть сервіс:\nsudo sdr-pi start')
    elif not ready:
        result.append('\nНаступний крок:\nПеревірте USB, кабель і живлення SDR; повторіть:\nsudo sdr-pi status')
    else:
        result.append('\nНаступний крок:\nВідкрийте HTTPS у браузері; введіть облікові дані SDR там.\n'
            'Для винятку сертифіката спочатку незалежно звірте відбиток SDR.')
    result.append('\nКерування:\nsudo sdr-pi status\nsudo sdr-pi stop\nsudo sdr-pi start\nsudo sdr-pi rollback')
    return readable('\n'.join(result))

def readable(text):
    """Wrap plain terminal text without depending on terminal width or colour."""
    import textwrap
    return '\n'.join(textwrap.fill(line, width=78,
        subsequent_indent='  ' if line.startswith('- ') else '',
        break_long_words=False, break_on_hyphens=False) if line else ''
        for line in text.split('\n'))


def main(argv=None):
    parser=argparse.ArgumentParser(add_help=False,
        formatter_class=lambda prog: argparse.RawTextHelpFormatter(prog,width=78,max_help_position=24),
        description=readable(f'SDR Pi {RELEASE}\n'
            'Вебдоступ HTTPS і інтернет для SDR через вибраний LAN/Wi-Fi.\n'
            'TLS без розшифрування; облікові дані вводьте лише у браузері.'),
        epilog=readable('Встановлення та керування:\n'
            'sudo python3 sdr-pi.py install --lan wlan0 --port 8443\n'
            'sudo sdr-pi status\nsudo sdr-pi stop\nsudo sdr-pi start\n'
            'sudo sdr-pi rollback\n\n'
            'Rollback прибирає власні зміни; пакети й журнал аудиту залишаються.\n'
            'Міграція з v2: rollback старою копією, install новою окремою копією.\n'
            'Не замінюйте /usr/local/sbin/sdr-pi вручну: діє inode/hash захист.\n\n'
            'Не всі моделі Pi та SDR перевірені: апаратна матриця обмежена.'))
    parser._positionals.title='Команди'; parser._optionals.title='Параметри'
    parser.epilog+='\n\n'+readable('Оновлення встановленої v3 (перерва сервісу):\n'
        'sudo python3 ./sdr-pi-candidate.py update\n'
        'Відновлення перерваного update — лише окремою копією:\n'
        'sudo python3 ./sdr-pi-candidate.py recover-update\n'
        'Збережено LAN/порт, active та enabled незалежно. Root-only backup старого\n'
        'inode і clean journal залишаються для аудиту. Не видаляйте їх вручну.\n'
        'recover-update повертає стару версію, не продовжує update. Невідомі\n'
        'мережні зміни блокують recovery; глобальний firewall/sysctl не відновлюється.')
    parser.add_argument('-h','--help',action='help',help='Показати довідку й вийти')
    parser.add_argument('action',nargs='?',default=None,choices=('install','start','stop','status','update','recover-update','rollback','_daemon'),metavar='команда',help='\ninstall   встановити\nstart     увімкнути також після reboot\nstop      вимкнути також після reboot\nstatus    показати стан\nupdate    оновити окремо завантаженою копією\nrecover-update відновити перерване оновлення\nrollback  прибрати власні зміни')
    parser.add_argument('--lan',help='фізичний LAN/Wi-Fi інтерфейс, наприклад wlan0')
    parser.add_argument('--port',type=int,default=8443,help='локальний HTTPS порт, типово 8443')
    args=parser.parse_args(argv)
    if args.action is None:
        import sys
        if not sys.stdin.isatty(): print(parser.format_help()); return
        print(f'SDR Pi {RELEASE}\n1. Встановити\n2. Запустити\n3. Зупинити\n4. Стан\n5. Оновити\n6. Відкотити встановлення\n0. Вийти')
        actions={'1':'install','2':'start','3':'stop','4':'status','5':'update','6':'rollback'}
        choice=input('Номер дії (0 — вихід): ').strip()
        if choice=='0': return
        if choice not in actions: print('Невідомий номер; нічого не змінено.'); return
        args.action=actions[choice]

    if os.geteuid()!=0: parser.error('Потрібні права root: sudo python3 sdr-pi.py '+args.action)
    os.umask(0o077); os.environ['PATH']='/usr/sbin:/usr/bin:/sbin:/bin'
    app=Installer()
    for p in (pathlib.Path('/run'),app.state.parent): trusted_dir(p)
    if app.state.exists(): trusted_dir(app.state)
    lock=pathlib.Path('/run/sdr-pi-v2-daemon.lock' if args.action=='_daemon' else '/run/sdr-pi-v2.lock')
    with exclusive(lock):
        if args.action=='status':
            if not app.state.exists(): print('Не встановлено'); return
            if os.path.lexists(app.state/'update.json'):
                r=Updater(app).load()
                print(readable('Перерване оновлення: '+r['phase']+'\n'
                    'Поточний ownership може очікувати завершення публікації.\n'
                    'Не запускайте старий start/stop/rollback і не замінюйте файли.\n'
                    'sudo python3 ./sdr-pi-candidate.py recover-update')); return
            print(status_report(app)); return
        if args.action=='_daemon':
            app.journal().verify(); asyncio.run(Runtime(app).serve()); return
        for p in (app.script.parent,app.unit.parent,app.enable.parent): trusted_dir(p)
        if args.action in ('update','recover-update'):
            updater=Updater(app); updater.separate(pathlib.Path(__file__))
            if not confirm('Дозволити перерву SDR сервісу для '+args.action+'?\n'
                    'Власну мережу буде очищено; LAN/порт та active/enabled збережено.\n'
                    'Backup залишиться для аудиту. Це не глобальний відкат ОС.'): raise RuntimeError('Скасовано')
            try:
                if args.action=='update': updater.update(pathlib.Path(__file__).read_bytes())
                else: updater.recover()
            except BaseException:
                print(readable('Операція не завершена. Не cp/rollback старою копією.\n'
                    'Збережіть журнали; після перевірки причини:\n'
                    'sudo python3 ./sdr-pi-candidate.py recover-update'),flush=True)
                raise
            print(readable('Операцію завершено; ownership і systemd state перевірено.\n'
                'Готовність SDR/NAT ще не підтверджена. Наступний крок:\nsudo sdr-pi status'))
            return
        Updater(app).guard()
        if args.action=='install':
            platform_check()
            if not 1024<=args.port<=65535: raise RuntimeError('Порт має бути 1024..65535')
            # Усі зміни лише після згоди; install не приховує перехоплення USB.
            print(readable('Що зміниться:\n'
                'SDR отримає вебдоступ та інтернет через вибраний LAN/Wi-Fi.\n'
                'Буде змінено маршрутизацію, створено USB профіль, DHCP і автозапуск.\n'
                'LAN-профілі не редагуються. Скасувати зараз: Ctrl+C.\n'
                'Відкотити встановлення:\nsudo sdr-pi rollback'))
            if app.state.exists() and app.journal().data.get('installed'):
                j=app.journal(); j.verify()
                if j.data.get('version')!=VERSION or j.data['files'].get(str(app.script),{}).get('hash')!=digest(pathlib.Path(__file__).read_bytes()):
                    raise RuntimeError('Виявлено іншу/v2 встановлену копію. Завантажте нову ОКРЕМО, збережіть стару копію/журнал, sudo sdr-pi rollback старою копією, тоді install новою. Не cp поверх установленого файла.')
            if not confirm('Продовжити встановлення на цьому Pi?'): raise RuntimeError('Скасовано')
            if not confirm('Згода на глобальний forwarding:\nДозволити net.ipv4.ip_forward=1 зараз і після reboot?\nstop не скасовує sysctl; rollback відновить значення лише якщо це безпечно.'): raise RuntimeError('Згоду на глобальний forwarding не надано')
            fragment=command('systemctl','show','-p','FragmentPath','--value','sdr-pi-v2.service',check=False)
            if fragment and (not app.state.exists() or str(app.unit) not in app.journal().data['files']): raise RuntimeError('Існує сторонній сервіс sdr-pi-v2')
            if pathlib.Path(str(app.unit)+'.d').exists(): raise RuntimeError('Існує сторонній drop-in сервісу')
            bootstrap(app)
            if command('systemctl','is-active','NetworkManager.service',check=False)!='active': raise RuntimeError('NetworkManager має бути вже активний; мережевий backend автоматично не перемикається')
            trusted_dir(app.profile.parent)
            rows=json.loads(command('ip','-j','address','show'))
            options=[]
            for row in rows:
                try:
                    address,network=lan_address(rows,row['ifname'])
                    if not (pathlib.Path('/sys/class/net')/row['ifname']/'device').exists() or row['ifname'] in discover(): continue
                    options.append(row['ifname']); print(f"LAN: {row['ifname']} {address} {network}")
                except ValueError: pass
            lan=args.lan or input('Оберіть LAN інтерфейс зі списку: ').strip()
            if lan not in options: raise RuntimeError('Неприпустимий LAN інтерфейс')
            host,_=lan_address(rows,lan)
            check_port(app,host,args.port,lan)
            app.install(lan,args.port,pathlib.Path(__file__).read_bytes(),internet=True,forwarding_consent=True)
        elif args.action=='start': app.start()
        elif args.action=='stop': app.stop()
        elif args.action=='rollback': app.rollback()

if __name__=='__main__':
    try: main()
    except (Exception,KeyboardInterrupt) as exc:
        import sys
        print(f'Помилка: {exc}',file=sys.stderr); sys.exit(1)



