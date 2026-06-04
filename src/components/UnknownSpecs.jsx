import { unknownSpecs } from "../data/content.js";
import { AnimatedSection } from "./AnimatedSection.jsx";
import { SectionHeader } from "./SectionHeader.jsx";

export function UnknownSpecs() {
  return (
    <AnimatedSection id="specs">
      <SectionHeader
        kicker="Чесні межі"
        title="Ми не вигадуємо частоти, дальність чи автономність."
        text="Ці параметри мають бути підтверджені паспортом або специфікацією Oberig. До цього вони лишаються відкритими плейсхолдерами."
      />
      <div className="unknown-panel">
        <div className="waterfall-preview" aria-hidden="true">
          {Array.from({ length: 42 }).map((_, index) => (
            <span key={index} style={{ "--depth": `${12 + ((index * 23) % 78)}%` }} />
          ))}
        </div>
        <div className="unknown-list">
          {unknownSpecs.map((item) => (
            <div key={item}>
              <span>{item}</span>
              <strong>[потребує підтвердження]</strong>
            </div>
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
}
