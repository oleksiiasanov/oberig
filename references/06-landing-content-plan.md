# 06 — Landing content plan

Статус: **готовий до імплементації як контент-контракт.** Усі блоки ґрунтуються на `references/`.
Непідтверджені маркетингові цифри лишаються `[потребує підтвердження]`.

Цей документ визначає, що саме має говорити лендинг, у якому порядку, з якою метою, які claims
дозволені, що заборонено, які CTA ставити й як агент має перевіряти готовий текст.

## Product truth

### One-liner
**Oberig — український SDR-детектор для раннього попередження про FPV-загрозу через аналоговий відеосигнал.**

### Core positioning
Oberig не позиціонується як перепакований китайський відеоприймач або “пищалка”. Це SDR-платформа,
яка поєднує живий перегляд відео, автоматичний сканер, спектральний аналіз “Водоспад” і показники
RSSI/SNR.

### Product promise
Дати військовому більше часу помітити потенційну FPV-загрозу, попередити групу й ухвалити рішення:
не тільки факт наявності сигналу, а відео, спектр, якість каналу, налаштовуваний пошук і технічну
картину ефіру в межах підтверджених можливостей.

### What we do not promise
- Не обіцяємо універсальне виявлення всіх дронів.
- Не заявляємо частоти, дальність, автономність, екран, ціну або гарантію без підтвердження.
- Не публікуємо назви конкурентів, рейтинги або бали.
- Не даємо тактичні або бойові інструкції.
- Не повертаємо старі claims зі старого лендингу.

## Audience model

### Primary audience
Технічні військові користувачі, зв'язківці, фахівці з радіоефіру, підрозділи й люди, які оцінюють
корисність детектора не за “вау-обіцянкою”, а за тим, що він реально показує про сигнал.

### Secondary audience
Люди, які приймають рішення про закупівлю або тестування. Для них важливі: зрозуміла відмінність
від типових рішень, чесні межі заяв, українська інженерія, можливість швидко проконсультуватися
або залишити заявку.

### Tone
Технічно, впевнено, без паніки, без “суперзброї”, без цивільної драматизації. Мова має звучати
як продукт від інженера, якому довіряють, а не як агресивна реклама.

## Messaging hierarchy

1. **Oberig = раннє попередження про FPV-загрозу, а не “аналіз заради аналізу”.**
2. **SDR — причина, чому він може показувати більше контексту: live video + scanner + waterfall + RSSI/SNR.**
3. **Ринок часто страждає від нестабільного відео, неповних заявлених характеристик і хаотичної якості.**
4. **Oberig має підтверджені можливості: режими, налаштовуване сканування, дві власні антени під нестандартні частоти, AGC, OTA, USB-C workflows, SD-запис, EN/UK.**
5. **Усе непідтверджене позначається чесно.**
6. **Дві дії: консультація через Signal або замовлення через Google Form.**

## CTA system

### Consultation CTA
- Label: **Отримати консультацію**
- Destination: `https://signal.group/#CjQKIJtYdEsLqmFX_KES9TLN8lugJYrcXZCMHkJ5namzsW9mEhDpQtJzhrOuLiakfxgBDh2Y`
- Use when: користувач хоче уточнити характеристики, сценарій застосування, наявність, комплектацію,
  майбутні цифри або можливість тестування.

### Order CTA
- Label: **Замовити**
- Destination: `https://forms.gle/xFcMaTWR1G5pR4qW6`
- Use when: користувач готовий залишити заявку.
- Guardrail: не прив'язувати кнопку до непідтверджених ціни, гарантії, строків або комплектації.

### CTA placement
- Hero: обидві дії видимі, consultation primary або co-primary, order clearly distinct.
- Mid-page: можна повторювати консультацію після технічного диференціатора або режимів.
- Final CTA: обидві дії обов'язкові.

## Section-by-section plan

### 1. Hero

**Goal:** одразу змінити рамку: це Oberig, SDR-детектор, який дає більше часу помітити наближення FPV-дрона й зреагувати.

**Source:** `02`, `05`, `01`

**Recommended headline pattern:**  
`Більше часу помітити дрон і зреагувати`

**Recommended support copy:**  
`Раннє попередження про FPV-загрозу через аналоговий відеосигнал: live video, сканер, Водоспад і RSSI/SNR в одному інструменті.`

**Proof chips:**  
- `Раннє попередження`
- `Live video`
- `Сканер`
- `Водоспад`
- `RSSI/SNR`
- `OTA`

**Allowed claims:** SDR, analog video reception, live decoded video, scanner, waterfall, RSSI/SNR,
AGC, two antennas, USB-C workflows, OTA, EN/UK.

**Placeholders:** frequency ranges, distance, battery/runtime, screen, price, warranty.

**Forbidden:** `1050-6040`, “без сліпих зон”, “виявляє все”, tactical chain, named competitors.

**CTA:** `Отримати консультацію` + `Замовити`.

**Visual intent:** large product/brand moment; real detector photo or clean placeholder; subtle interface layer showing video/spectrum metaphor without fake values.

### 2. Market problem

**Goal:** show why the category needs a more serious radio platform.

**Source:** `03`

**Core message:** багато типових детекторів на ринку мають проблеми зі стабільністю картинки,
відповідністю заявленим характеристикам, автономністю або повторюваністю виробництва.

**Allowed claims:** generalized category pain only: “типові прилади”, “частина ринку”, “більшість
зразків у звіті”. No names, no scores.

**Suggested bento cards:**
- `Картинка зривається`
- `Заявлене не завжди дорівнює реальному`
- `Якість залежить від збірки`
- `Користувачу бракує контексту про сигнал`

**Forbidden:** naming devices, publishing ratings, claiming Oberig solves a point unless `02` confirms the matching capability.

**CTA:** none or soft “Поговорити про ваш сценарій”.

### 3. Why SDR matters

**Goal:** make the main differentiation impossible to miss.

**Source:** `02`, `03`

**Core message:** типовий відеоприймач часто дає обмежену картину. SDR-підхід дає прийом відео,
сканування, спектральну картину й показники якості сигналу.

**Recommended structure:** split comparison, not competitor table.

**Left side:** `Типовий відеоприймач`  
Possible copy: `Переважно показує факт прийому каналу або картинку, коли сигнал уже достатній.`

**Right side:** `Oberig на SDR`  
Possible copy: `Показує live video, допомагає шукати активні передачі, дає Водоспад і RSSI/SNR для оцінки сигналу.`

**Allowed claims:** SDR, live video, scanner, waterfall, signals too weak for video decoding, RSSI/SNR.

**Forbidden:** “guaranteed detection”, unconfirmed frequency coverage, tactical instructions.

### 4. Work modes

**Goal:** prove depth through product behavior, not slogans.

**Source:** `02 B`

**Required modes:**
- `Перегляд`: live video, 1 MHz tuning step, current frequency overlay, AGC, photo/video capture.
- `Сканер`: searches active transmissions, peaks, found channel list, RSSI/SNR, optional screenshot on clear transmission.
- `Водоспад`: spectrum/heatmap view, sees signals too weak to decode, zoom/coverage width up to 8x.
- `Браузер`: saved photo/video review.
- `Налаштування`: device configuration.

**Visual intent:** tabs or bento panels; each mode has a specific UI/interaction metaphor. Avoid generic icon cards.

**Forbidden:** old modes not confirmed by `02`: blackout, direction finding, EW integration, standby, FPV only.

### 5. Capabilities

**Goal:** collect confirmed technical capabilities into a scannable product proof section.

**Source:** `02 C-D`

**Confirmed capability groups:**
- `Радіо та сигнал`: adjustable scan range, RSSI/SNR, AGC, waterfall.
- `Антени`: two bundled custom antennas, designed in-house for better reception on non-standard frequencies, with auto switching by threshold frequency.
- `Media`: photo/video to SD card, FAT32 formatting from device.
- `Interface`: physical controls, English/Ukrainian language.
- `USB-C`: UVC camera, remote frequency control from PC, USB network for OTA, serial console.
- `Firmware`: OTA updates, factory reset.
- `Power`: USB-C charging/power screen confirmed; battery/runtime unknown.

**Placeholders:** battery, runtime, screen size/resolution, enclosure, weight, package contents, price.

**Visual intent:** dense but elegant technical bento, not marketing cards.

### 6. Spectrum and unknown specs

**Goal:** handle frequencies honestly without leaving a suspicious gap.

**Source:** `02 E`

**Core message:** частотні діапазони й дальність мають бути підтверджені паспортом/специфікацією.
Поки їх немає, лендинг чесно показує `[потребує підтвердження]`.

**Allowed visuals:** abstract waterfall/spectrum UI, configurable scan-range concept, placeholder spec table.

**Forbidden:** any fixed frequency range, “без сліпих зон”, coverage comparison with product values.

**UX note:** this section should feel like product honesty, not weakness. Copy should frame it as “ми не вигадуємо цифри”.

### 7. Market comparison

**Goal:** convert category pain into Oberig differentiation without risky competitor claims.

**Source:** `02`, `03`

**Recommended comparison columns:**
- `Типовий прилад на ринку`
- `Oberig`

**Rows:**
- Architecture: video receiver framing vs SDR platform.
- Signal context: limited picture vs live video + waterfall + RSSI/SNR.
- Search workflow: basic channel presence vs scanner and found channels.
- Antennas: generic/stock antennas vs two bundled custom antennas tuned for non-standard frequencies.
- Updates/support: unknown/generalized vs OTA confirmed.
- Engineering: generic market quality concerns vs Ukrainian SDR engineering positioning.
- Marketing figures: often claimed vs Oberig placeholders until confirmed.

**Forbidden:** named competitors, scores, “Oberig is better on range/autonomy” unless confirmed later.

### 8. Ukrainian engineering and trust

**Goal:** create trust without overclaiming.

**Source:** `02`, user-confirmed positioning in `README`

**Core message:** Oberig is a Ukrainian SDR-based product by a Ukrainian engineer, with software-defined behavior and OTA update path.

**Allowed claims:** Ukrainian engineer, SDR platform, OTA, controlled device logic, EN/UK interface.

**Forbidden:** certification, production scale, warranty, unit adoption, field proof unless supplied.

### 9. FAQ

**Goal:** answer objections and protect claim boundaries.

**Required questions:**
- `Чим Oberig відрізняється від звичайного відеоприймача?`
- `Що таке Водоспад і навіщо він потрібен?`
- `Що показують RSSI та SNR?`
- `Які режими роботи підтверджені?`
- `Чи відомі частоти, дальність і автономність?`
- `Чи можна підключити пристрій до ПК або Android?`
- `Чи є українська мова інтерфейсу?`
- `Чи виявляє Oberig усі дрони?`
- `Як отримати консультацію?`
- `Як замовити?`

**FAQ tone:** direct, honest, short. Every “unknown” answer should say it is waiting for confirmed specs, not dodge.

### 10. Final CTA

**Goal:** let ready users act without rereading.

**Source:** `05`

**Recommended headline:**  
`Потрібен час на реакцію до наближення дрона?`

**Recommended support copy:**  
`Проконсультуємо, як Oberig допомагає завчасно помічати аналоговий відеосигнал FPV-дрона, і приймемо заявку на замовлення.`

**CTA:** `Отримати консультацію` + `Замовити`.

**Forbidden:** “закрийте частотні діри”, “отримати КП”, unconfirmed delivery/price.

## Claims map

| Claim | Status | Source | Landing usage |
| --- | --- | --- | --- |
| Oberig is SDR-based | Confirmed | `02`, user positioning | Hero, SDR section, comparison |
| Receives/views/analyzes analog video signals | Confirmed | `02 A` | Hero, capabilities |
| Live video | Confirmed | `02 A-B` | Hero, SDR section, modes |
| Scanner finds active transmissions | Confirmed | `02 B` | Modes, capabilities |
| Waterfall spectrum view | Confirmed | `02 B` | Hero, SDR section, modes |
| RSSI/SNR | Confirmed | `02 A-B` | Hero, modes, comparison |
| Signals too weak for video decoding may appear in Waterfall | Confirmed | `02 B` | SDR section, modes |
| 1 MHz tuning step | Confirmed | `02 B` | Modes/specs |
| AGC | Confirmed | `02 B` | Modes/capabilities |
| Two bundled custom antennas with auto switching | Confirmed | `02 D`, owner | Capabilities/specs, comparison |
| Custom antennas designed for better reception on non-standard frequencies | Confirmed (design intent, no benchmark) | owner 2026-06-04 | Why SDR / capabilities / comparison |
| Photo/video recording to SD | Confirmed | `02 B-D` | Capabilities/specs |
| OTA updates | Confirmed | `02 D` | Trust, capabilities |
| USB-C UVC camera | Confirmed | `02 D` | Capabilities/FAQ |
| Remote frequency control from PC | Confirmed | `02 D` | Capabilities/FAQ |
| English/Ukrainian interface | Confirmed | `02 D` | Capabilities/trust |
| Frequency ranges | Placeholder | `02 E` | Placeholder only |
| Detection distance | Placeholder | `02 E` | Placeholder only |
| Battery/runtime | Placeholder | `02 E` | Placeholder only |
| Screen size/resolution | Placeholder | `02 E` | Placeholder only |
| Price/warranty | Placeholder | `02 E` | Placeholder only |

## Copy rules for agents

1. Every factual sentence must map to `02`, `03`, `05`, or this plan.
2. If a sentence contains a number, it must be confirmed in `02`; otherwise use `[потребує підтвердження]`.
3. Do not reuse old landing copy unless it survives the claims map.
4. Use “типові прилади на ринку” instead of competitor names.
5. Prefer product proof over hype: mode, signal, workflow, interface, output.
6. Keep CTA labels stable: `Отримати консультацію`, `Замовити`.
7. Keep language Ukrainian-first, technical, concise.
8. Do not write combat instructions or tactical sequences.

## Content eval checklist

- [ ] Hero does not claim old frequency coverage.
- [ ] Both CTA destinations are present and correct.
- [ ] No named competitors appear in public copy.
- [ ] No unconfirmed values appear as facts.
- [ ] Work modes match `Перегляд / Сканер / Водоспад / Браузер / Налаштування`.
- [ ] Unsupported old modes are absent.
- [ ] FAQ explains unknown specs honestly.
- [ ] Product photo/logo/favicon are treated as assets, not proof of capabilities.
