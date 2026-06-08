import { CTAButtons } from "./CTAButtons.jsx";
import { AnimatedSection } from "./AnimatedSection.jsx";

export function FinalCTA({ content }) {
  return (
    <AnimatedSection id="contact" className="final-cta">
      <p className="eyebrow">{content.hero.eyebrow}</p>
      <h2>{content.hero.title}</h2>
      <p>{content.hero.subtitle}</p>
      <CTAButtons content={content} center />
      <div className="footer-links">
        {content.socials.map(([name, label, href]) => (
          <a href={href} target="_blank" rel="noreferrer" aria-label={name} key={name}>
            {label}
          </a>
        ))}
      </div>
      <small>{content.footer}</small>
    </AnimatedSection>
  );
}
