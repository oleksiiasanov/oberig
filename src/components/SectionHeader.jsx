export function SectionHeader({ kicker, title, text }) {
  return (
    <div className="section-header">
      <p className="eyebrow">{kicker}</p>
      <h2>{title}</h2>
      {text ? <p>{text}</p> : null}
    </div>
  );
}
