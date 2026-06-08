import { AnimatedSection } from "./AnimatedSection.jsx";
import { SectionHeader } from "./SectionHeader.jsx";

export function Trust({ content }) {
  return (
    <AnimatedSection id="team" className="section-quiet">
      <SectionHeader kicker={content.team.kicker} title={content.team.title} />
      <div className="team-panel">
        {content.team.text.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
    </AnimatedSection>
  );
}
