export function SectionHeader({ kicker, title, text, wide = false }) {
  return (
    <div className={`section-header ${wide ? "section-header-wide" : ""}`}>
      <p className="eyebrow">{kicker}</p>
      <h2>{title}</h2>
      {text ? <p>{text}</p> : null}
    </div>
  );
}
