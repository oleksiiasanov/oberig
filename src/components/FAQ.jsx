import { faq } from "../data/content.js";
import { AnimatedSection } from "./AnimatedSection.jsx";
import { SectionHeader } from "./SectionHeader.jsx";

export function FAQ() {
  return (
    <AnimatedSection id="faq" className="section-quiet">
      <SectionHeader
        kicker="FAQ"
        title="Коротко про можливості й межі заяв."
        text="Питання знімають невизначеність без тактичних інструкцій і без універсальних обіцянок."
      />
      <div className="faq-list">
        {faq.map((item) => (
          <details key={item.question}>
            <summary>{item.question}</summary>
            <p>{item.answer}</p>
          </details>
        ))}
      </div>
    </AnimatedSection>
  );
}
