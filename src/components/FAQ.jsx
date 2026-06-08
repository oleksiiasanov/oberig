import { AnimatedSection } from "./AnimatedSection.jsx";
import { SectionHeader } from "./SectionHeader.jsx";

export function FAQ({ content }) {
  return (
    <AnimatedSection id="faq">
      <SectionHeader kicker={content.faq.kicker} title={content.faq.title} />
      <div className="faq-list">
        {content.faq.items.map(([question, answer]) => (
          <details key={question}>
            <summary>{question}</summary>
            <p>{answer}</p>
          </details>
        ))}
      </div>
    </AnimatedSection>
  );
}
