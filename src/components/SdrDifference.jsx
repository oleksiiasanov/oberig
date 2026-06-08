import { AnimatedSection } from "./AnimatedSection.jsx";

export function SdrDifference({ content }) {
  return (
    <AnimatedSection id="spotlight" className="section-quiet">
      <div className="media-spotlight">
        <div className="media-frame">
          <span>{content.spotlight.badge}</span>
          <img src="/hero_main.png" alt={content.hero.imageAlt} />
        </div>
        <div>
          <p className="eyebrow">{content.spotlight.badge}</p>
          <h2>{content.spotlight.title}</h2>
          <p>{content.spotlight.text}</p>
        </div>
      </div>
    </AnimatedSection>
  );
}
