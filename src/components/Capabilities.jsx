import { AnimatedSection } from "./AnimatedSection.jsx";
import { SectionHeader } from "./SectionHeader.jsx";

export function Capabilities({ content }) {
  return (
    <AnimatedSection id="use-cases">
      <SectionHeader kicker={content.useCases.kicker} title={content.useCases.title} />
      <div className="use-case-grid">
        {content.useCases.cards.map(([title, text]) => (
          <article className="use-case-card" key={title}>
            <h3>{title}</h3>
            <p>{text}</p>
          </article>
        ))}
      </div>
    </AnimatedSection>
  );
}
