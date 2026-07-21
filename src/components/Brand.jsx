import { useEffect, useState } from "react";

export function Brand({ compact = false, href = "/", onNavigate, variant = "sdr" }) {
  const [logoFailed, setLogoFailed] = useState(false);
  const logoSrc = variant === "base" ? "/logo-default.png" : "/logo-exp.png";

  useEffect(() => {
    setLogoFailed(false);
  }, [logoSrc]);

  return (
    <a
      className={`brand ${compact ? "brand-compact" : ""}`}
      href={href}
      aria-label="D·Vision SDR"
      onClick={(event) => {
        if (!onNavigate) return;
        event.preventDefault();
        onNavigate(href);
      }}
    >
      {logoFailed ? (
        <span className="brand-wordmark">
          D·Vision SDR
          {variant === "sdr" ? <strong>SDR</strong> : null}
        </span>
      ) : (
        <img className="brand-logo" src={logoSrc} alt="D·Vision SDR" onError={() => setLogoFailed(true)} />
      )}
    </a>
  );
}
