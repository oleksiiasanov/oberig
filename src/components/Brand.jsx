export function Brand({ compact = false }) {
  return (
    <a className={`brand ${compact ? "brand-compact" : ""}`} href="#top" aria-label="Oberig">
      <img className="brand-logo brand-logo-bronze" src="/logo-bronze.png" alt="Оберіг" />
      <img className="brand-logo brand-logo-green" src="/logo-green.png" alt="" aria-hidden="true" />
    </a>
  );
}
