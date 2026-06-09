import { useRef } from "react";
import { AnimatedSection } from "./AnimatedSection.jsx";
import { CTAButtons } from "./CTAButtons.jsx";
import { SectionHeader } from "./SectionHeader.jsx";

const THEME_CLICK_COUNT = 10;
const THEME_CLICK_WINDOW_MS = 3500;

export function Modes({ content, onThemeToggle }) {
  const themeClickTimesRef = useRef([]);

  const handleFeatureClick = (index) => {
    if (index !== 0 || !onThemeToggle) return;

    const now = Date.now();
    themeClickTimesRef.current = [...themeClickTimesRef.current, now].filter(
      (time) => now - time <= THEME_CLICK_WINDOW_MS,
    );

    if (themeClickTimesRef.current.length >= THEME_CLICK_COUNT) {
      themeClickTimesRef.current = [];
      onThemeToggle();
    }
  };

  return (
    <AnimatedSection id="design">
      <SectionHeader kicker={content.design.kicker} title={content.design.title} />
      <div className="feature-grid">
        {content.design.cards.map(([title, items], index) => (
          <article className="feature-card" onClick={() => handleFeatureClick(index)} key={title}>
            <small>{String(index + 1).padStart(2, "0")}</small>
            <h3>{title}</h3>
            <ul>
              {items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>
      <CTAButtons content={content} center />
    </AnimatedSection>
  );
}
