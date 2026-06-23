import { useEffect, useState } from "react";

export function Brand({ compact = false, variant = "sdr" }) {
  const [logoFailed, setLogoFailed] = useState(false);
  const logoSrc = variant === "base" ? "/logo-default.png" : "/logo-exp.png";

  useEffect(() => {
    setLogoFailed(false);
  }, [logoSrc]);

  return (
    <a className={`brand ${compact ? "brand-compact" : ""}`} href="#top" aria-label="D.VISION SDR">
      {logoFailed ? (
        <span className="brand-wordmark">
          D.VISION SDR
          {variant === "sdr" ? <strong>SDR</strong> : null}
        </span>
      ) : (
        <img className="brand-logo" src={logoSrc} alt="D.VISION SDR" onError={() => setLogoFailed(true)} />
      )}
    </a>
  );
}
