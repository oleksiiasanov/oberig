import { capabilities } from "../data/content.js";
import { AnimatedSection } from "./AnimatedSection.jsx";
import { SectionHeader } from "./SectionHeader.jsx";

export function Capabilities() {
  return (
    <AnimatedSection id="capabilities" className="section-quiet">
      <SectionHeader
        kicker="Можливості"
        title="SDR-основа й широке покриття відеочастот."
        text="Oberig фокусується на FPV-відеосигналі в діапазоні 400-9800 МГц. Непідтверджені параметри на кшталт дальності чи автономності не вигадуємо."
      />
      <div className="capability-grid">
        {capabilities.map((group) => (
          <article className="capability-card" key={group.title}>
            <h3>{group.title}</h3>
            <ul>
              {group.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </AnimatedSection>
  );
}
