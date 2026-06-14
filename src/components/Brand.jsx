export function Brand({ compact = false }) {
  return (
    <a className={`brand ${compact ? "brand-compact" : ""}`} href="#top" aria-label="D.VISION">
      <img className="brand-logo brand-logo-bronze" src="/logo-bronze.png" alt="D.VISION" />
      <img className="brand-logo brand-logo-green" src="/logo-green.png" alt="" aria-hidden="true" />
    </a>
  );
}
