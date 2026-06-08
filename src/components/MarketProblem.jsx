import { AnimatedSection } from "./AnimatedSection.jsx";
import { SectionHeader } from "./SectionHeader.jsx";

export function MarketProblem({ content }) {
  return (
    <AnimatedSection id="advantages">
      <SectionHeader
        kicker={content.advantages.kicker}
        title={content.advantages.title}
        text={content.advantages.text}
      />
      <div className="stats-grid">
        {content.advantages.stats.map(([label, value]) => (
          <article className="stat-card" key={label}>
            <span>{label}</span>
            <strong>{value}</strong>
          </article>
        ))}
      </div>
    </AnimatedSection>
  );
}
