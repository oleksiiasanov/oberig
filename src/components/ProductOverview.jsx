import { useRef } from "react";
import { AnimatedSection } from "./AnimatedSection.jsx";
import { SectionHeader } from "./SectionHeader.jsx";
import { CTAButtons } from "./CTAButtons.jsx";

const LOGO_CLICK_COUNT = 10;
const LOGO_CLICK_WINDOW_MS = 3500;

export function ProductOverview({ content, onLogoToggle }) {
  const { product } = content;
  const logoClickTimesRef = useRef([]);

  const handleAdvantageClick = (index) => {
    if (index !== 0 || !onLogoToggle) return;

    const now = Date.now();
    logoClickTimesRef.current = [...logoClickTimesRef.current, now].filter(
      (time) => now - time <= LOGO_CLICK_WINDOW_MS,
    );

    if (logoClickTimesRef.current.length >= LOGO_CLICK_COUNT) {
      logoClickTimesRef.current = [];
      onLogoToggle();
    }
  };

  return (
    <AnimatedSection id="product" className="characteristics-section">
      <SectionHeader kicker={product.kicker} title={product.title} />
      <p className="product-intro">{product.intro}</p>

      <div className="advantage-panel">
        <h3 className="advantage-vertical-title">{product.advantagesTitle}</h3>
        <div className="advantage-specs">
          {product.advantages.map(([title, items], index) => (
            <div className="advantage-spec-row" onClick={() => handleAdvantageClick(index)} key={title}>
              <span className="advantage-spec-label">{title}</span>
              <span className="advantage-spec-value">{items[0]}</span>
            </div>
          ))}
        </div>
      </div>

      <h3 className="subsection-title">{product.featuresTitle}</h3>
      <div className="use-case-grid">
        {product.features.map(([title, items]) => (
          <article className="use-case-card is-plain" key={title}>
            <div className="use-case-text">
              <h3>{title}</h3>
              <p>{items[0]}</p>
            </div>
          </article>
        ))}
      </div>

      <CTAButtons content={content} center />
    </AnimatedSection>
  );
}
