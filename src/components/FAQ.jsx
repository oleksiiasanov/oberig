import { AnimatedSection } from "./AnimatedSection.jsx";
import { SectionHeader } from "./SectionHeader.jsx";

export function FAQ({ content }) {
  return (
    <AnimatedSection id="faq">
      <SectionHeader kicker={content.faq.kicker} title={content.faq.title} />
      <div className="faq-list">
        {content.faq.items.map((item) => {
          const ListTag = item.listType === "ol" ? "ol" : "ul";

          return (
            <details key={item.question}>
              <summary>{item.question}</summary>
              {item.intro.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
              {item.listIntro ? <p>{item.listIntro}</p> : null}
              {item.list ? (
                <ListTag>
                  {item.list.map(([label, rest]) => (
                    <li key={label}>
                      <strong>{label}:</strong> {rest}
                    </li>
                  ))}
                </ListTag>
              ) : null}
              {item.note ? <p className="faq-note">{item.note}</p> : null}
            </details>
          );
        })}
      </div>
    </AnimatedSection>
  );
}
