import { SocialIcon } from "./SocialIcon.jsx";

export function FinalCTA({ content }) {
  return (
    <section id="contact" className="section site-footer">
      <small>{content.footer}</small>
      <div className="footer-links">
        {content.socials.map(([name, label, href]) => (
          <a href={href} target="_blank" rel="noreferrer" aria-label={name} key={name}>
            <SocialIcon name={name} />
            <span className="sr-only">{label}</span>
          </a>
        ))}
      </div>
    </section>
  );
}
