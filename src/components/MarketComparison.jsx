import { comparisonRows } from "../data/content.js";
import { AnimatedSection } from "./AnimatedSection.jsx";
import { SectionHeader } from "./SectionHeader.jsx";

export function MarketComparison() {
  return (
    <AnimatedSection id="comparison" className="section-quiet">
      <SectionHeader
        kicker="Порівняння"
        title="Oberig порівнюється з ринком за критеріями, а не за назвами конкурентів."
        text="Жодних рейтингів і публічних балів. Лише категорійні болі та підтверджені можливості Oberig."
      />
      <div className="comparison-table" role="table" aria-label="Порівняння Oberig з типовим приладом на ринку">
        <div className="comparison-head" role="row">
          <span role="columnheader">Критерій</span>
          <span role="columnheader">Типовий прилад на ринку</span>
          <span role="columnheader">Oberig</span>
        </div>
        {comparisonRows.map(([label, market, oberig]) => (
          <div className="comparison-row" role="row" key={label}>
            <strong role="cell">{label}</strong>
            <span role="cell">{market}</span>
            <span role="cell">{oberig}</span>
          </div>
        ))}
      </div>
    </AnimatedSection>
  );
}
