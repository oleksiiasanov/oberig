import { capabilities } from "../data/content.js";
import { AnimatedSection } from "./AnimatedSection.jsx";
import { SectionHeader } from "./SectionHeader.jsx";

export function Capabilities() {
  return (
    <AnimatedSection id="capabilities" className="section-quiet">
      <SectionHeader
        kicker="Можливості"
        title="Щільний технічний набір без вигаданих цифр."
        text="Тут лише підтверджені функції. Маркетингові числа залишаються плейсхолдерами, поки не з’явиться паспорт або специфікація."
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
