import { useEffect, useState } from "react";

export function Brand({ compact = false, variant = "sdr" }) {
  const [logoFailed, setLogoFailed] = useState(false);
  const logoSrc = variant === "base" ? "/logo-default.png" : "/logo-exp.png";

  useEffect(() => {
    setLogoFailed(false);
  }, [logoSrc]);

  return (
    <a className={`brand ${compact ? "brand-compact" : ""}`} href="#top" aria-label="D.VISION">
      {logoFailed ? (
        <span className="brand-wordmark">
          D.VISION
          {variant === "sdr" ? <strong>SDR</strong> : null}
        </span>
      ) : (
        <img className="brand-logo" src={logoSrc} alt="D.VISION" onError={() => setLogoFailed(true)} />
      )}
    </a>
  );
}
