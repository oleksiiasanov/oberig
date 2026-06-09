import { AnimatedSection } from "./AnimatedSection.jsx";
import { SectionHeader } from "./SectionHeader.jsx";

export function MarketComparison({ content }) {
  const [, oberigColumn, marketColumn] = content.comparison.columns;

  return (
    <AnimatedSection id="comparison" className="section-quiet">
      <SectionHeader
        kicker={content.comparison.kicker}
        title={content.comparison.title}
        text={content.comparison.text}
      />
      <div className="comparison-table" role="table" aria-label={content.comparison.title}>
        <div className="comparison-head" role="row">
          {content.comparison.columns.map((column) => (
            <span role="columnheader" key={column}>
              {column}
            </span>
          ))}
        </div>
        {content.comparison.rows.map(([label, oberig, market]) => (
          <div className="comparison-row" role="row" key={label}>
            <strong role="cell">{label}</strong>
            <div className="comparison-values">
              <span role="cell" className="comparison-highlight" data-label={oberigColumn}>
                {oberig}
              </span>
              <span role="cell" data-label={marketColumn}>
                {market}
              </span>
            </div>
          </div>
        ))}
      </div>
    </AnimatedSection>
  );
}
