import { AnimatedSection } from "./AnimatedSection.jsx";
import { SectionHeader } from "./SectionHeader.jsx";

export function MarketComparison({ content }) {
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
        {content.comparison.rows.map(([label, product, market]) => (
          <div className="comparison-row" role="row" key={label}>
            <strong role="cell">{label}</strong>
            <div className="comparison-values">
              <span role="cell" className="comparison-highlight" data-label="D.VISION SDR">
                {product}
              </span>
              <span role="cell" data-label={content.comparison.otherLabel}>
                {market}
              </span>
            </div>
          </div>
        ))}
      </div>
    </AnimatedSection>
  );
}
