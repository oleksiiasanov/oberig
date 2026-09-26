import { AnimatedSection } from "./AnimatedSection.jsx";
import { SectionHeader } from "./SectionHeader.jsx";
import { ImagePlaceholder } from "./ImagePlaceholder.jsx";

export function Tools({ content }) {
  const { tools } = content;

  return (
    <AnimatedSection id="tools">
      <SectionHeader kicker={tools.kicker} title={tools.title} text={tools.lead} />
      <div className="tool-list">
        {tools.items.map((tool) => (
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
            </div>
            {tool.photo ? (
              <img className="tool-media" src={tool.photo} alt={tool.imageAlt} loading="lazy" />
            ) : (
              <ImagePlaceholder alt={tool.imageAlt} label={content.order.photoPendingLabel} className="tool-media" />
            )}
          </article>
        ))}
      </div>
    </AnimatedSection>
  );
}
