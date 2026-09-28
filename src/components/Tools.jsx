import { AnimatedSection } from "./AnimatedSection.jsx";
import { SectionHeader } from "./SectionHeader.jsx";
import { ImagePlaceholder } from "./ImagePlaceholder.jsx";
import { CTAButtons } from "./CTAButtons.jsx";

export function Tools({ content }) {
  const { tools } = content;
  const lastIndex = tools.items.length - 1;

  return (
    <AnimatedSection id="tools">
      <SectionHeader kicker={tools.kicker} title={tools.title} text={tools.lead} wide />
      <div className="tool-list">
        {tools.items.map((tool, index) => (
          <article className="tool-row" key={tool.title}>
            <div className="tool-copy">
              <h3>{tool.title}</h3>
              <p>{tool.description}</p>
              <p className="tool-characteristics-title">{tools.characteristicsLabel}</p>
              <ul>
                {tool.characteristics.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              {tool.note ? <p className="tool-note">{tool.note}</p> : null}
            </div>
            {tool.photo ? (
              <img className="tool-media" src={tool.photo} alt={tool.imageAlt} loading="lazy" />
            ) : (
              <ImagePlaceholder alt={tool.imageAlt} label={content.order.photoPendingLabel} className="tool-media" />
            )}
            {index === 0 || index === lastIndex ? <CTAButtons content={content} secondary={false} /> : null}
          </article>
        ))}
      </div>
    </AnimatedSection>
  );
}
