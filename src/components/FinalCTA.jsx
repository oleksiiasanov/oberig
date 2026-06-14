import { AnimatedSection } from "./AnimatedSection.jsx";
import { SocialIcon } from "./SocialIcon.jsx";

export function FinalCTA({ content }) {
  return (
    <AnimatedSection id="contact" className="site-footer">
      <div className="footer-links">
        {content.socials.map(([name, label, href]) => (
          <a href={href} target="_blank" rel="noreferrer" aria-label={name} key={name}>
            <SocialIcon name={name} />
            <span className="sr-only">{label}</span>
          </a>
        ))}
      </div>
      <small>{content.footer}</small>
    </AnimatedSection>
  );
}
