import { useEffect, useRef } from "react";
import { AnimatedSection } from "./AnimatedSection.jsx";
import { CTAButtons } from "./CTAButtons.jsx";

const LOGO_CLICK_COUNT = 10;
const LOGO_CLICK_WINDOW_MS = 3500;

export function Modes({ content, onLogoToggle }) {
  const logoClickTimesRef = useRef([]);
  const layoutRef = useRef(null);
  const featureGridRef = useRef(null);

  useEffect(() => {
    if (!layoutRef.current || !featureGridRef.current) return undefined;

    const layout = layoutRef.current;
    const featureGrid = featureGridRef.current;
    const syncFeatureHeight = () => {
      layout.style.setProperty("--feature-stack-height", `${featureGrid.getBoundingClientRect().height}px`);
    };

    syncFeatureHeight();
    const resizeObserver = new ResizeObserver(syncFeatureHeight);
    resizeObserver.observe(featureGrid);
    window.addEventListener("resize", syncFeatureHeight);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", syncFeatureHeight);
    };
  }, [content.design.cards]);

  const handleFeatureClick = (index) => {
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
    <AnimatedSection id="design" className="characteristics-section">
      <div className="section-header characteristics-header">
        <p className="eyebrow">{content.design.kicker}</p>
        <h2>{content.design.title}</h2>
      </div>
      <div className="characteristics-layout" ref={layoutRef}>
        <div className="feature-grid" ref={featureGridRef}>
          {content.design.cards.map(([title, items], index) => (
            <article className="feature-card" onClick={() => handleFeatureClick(index)} key={title}>
              <h3>{title}</h3>
              <ul>
                {items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
        <div className="device-loop" aria-label={content.hero.imageAlt}>
          <div className="device-loop-clip">
            <video
              className="device-loop-video"
              poster="/device-loop-3d-poster.png"
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
            >
              <source src="/device-loop-3d-alpha.webm" type="video/webm" />
              <source src="/device-loop-3d.mp4" type="video/mp4" />
            </video>
          </div>
        </div>
        <CTAButtons content={content} center />
      </div>
    </AnimatedSection>
  );
}
