import { modes } from "../data/content.js";
import { AnimatedSection } from "./AnimatedSection.jsx";
import { SectionHeader } from "./SectionHeader.jsx";

export function Modes() {
  return (
    <AnimatedSection id="modes">
      <SectionHeader
        kicker="Підтверджені режими"
        title="Продуктова глибина видно в режимах, а не в гучних обіцянках."
        text="Перегляд, Сканер, Водоспад, Браузер і Налаштування — робоча структура пристрою за посібником."
      />
      <div className="mode-grid">
        {modes.map((mode, index) => (
          <article className="mode-card" key={mode.title}>
            <span>{mode.tag}</span>
            <h3>{mode.title}</h3>
            <p>{mode.text}</p>
            <small>{String(index + 1).padStart(2, "0")}</small>
          </article>
        ))}
      </div>
    </AnimatedSection>
  );
}
