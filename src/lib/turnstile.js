let loading;
export function loadTurnstile() {
  if (window.turnstile) return Promise.resolve(window.turnstile);
  if (!loading) loading = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    const fail = () => { clearTimeout(timer); script.remove(); loading = null; reject(new Error("verification_unavailable")); };
    const timer = setTimeout(fail, 15000);
    script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
    script.async = true;
    script.onload = () => { clearTimeout(timer); window.turnstile ? resolve(window.turnstile) : fail(); };
    script.onerror = fail;
    document.head.appendChild(script);
  });
  return loading;
}

export function createChallenge(container, sitekey, load = loadTurnstile) {
  let cancelled = false, widget, api, pending, timer, initializing;
  const finish = (error, token) => {
    clearTimeout(timer);
    const current = pending; pending = null;
    if (current) error ? current.reject(error) : current.resolve(token);
  };
  const initialize = () => {
    if (widget !== undefined) return Promise.resolve();
    return initializing ??= Promise.resolve().then(load).then((loaded) => {
      if (cancelled) throw new Error("verification_unavailable");
      api = loaded;
      widget = api.render(container, {
        sitekey, action: "checkout", execution: "execute", appearance: "interaction-only",
        callback: (token) => finish(null, token),
        "error-callback": () => finish(new Error("verification_failed")),
        "expired-callback": () => finish(new Error("verification_expired")),
      });
    }).finally(() => { initializing = null; });
  };
  void initialize().catch(() => {});
  return {
    async execute() {
      await initialize();
      if (cancelled) throw new Error("verification_unavailable");
      finish(new Error("verification_restarted"));
      api.reset(widget);
      return new Promise((resolve, reject) => {
        pending = { resolve, reject };
        timer = setTimeout(() => finish(new Error("verification_timeout")), 60000);
        try { api.execute(widget); } catch { finish(new Error("verification_failed")); }
      });
    },
    dispose() {
      cancelled = true;
      finish(new Error("verification_cancelled"));
      if (widget !== undefined) api.remove(widget);
    },
  };
}
