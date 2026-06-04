export function Brand({ compact = false }) {
  return (
    <a className={`brand ${compact ? "brand-compact" : ""}`} href="#top" aria-label="Oberig">
      <img className="brand-logo" src="/logo.png" alt="Оберіг" />
    </a>
  );
}
