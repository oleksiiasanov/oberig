import { AnimatedSection } from "./AnimatedSection.jsx";
import { CTAButtons } from "./CTAButtons.jsx";
import { SectionHeader } from "./SectionHeader.jsx";

export function Modes({ content }) {
  return (
    <AnimatedSection id="design">
      <SectionHeader kicker={content.design.kicker} title={content.design.title} />
      <div className="feature-grid">
        {content.design.cards.map(([title, items], index) => (
          <article className="feature-card" key={title}>
            <small>{String(index + 1).padStart(2, "0")}</small>
            <h3>{title}</h3>
            <ul>
              {items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>
      <CTAButtons content={content} center />
    </AnimatedSection>
  );
}
