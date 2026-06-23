import { AnimatedSection } from "./AnimatedSection.jsx";
import { SectionHeader } from "./SectionHeader.jsx";

const ICONS = [
  "/usecases/security.png",
  "/usecases/warning--alt.png",
  "/usecases/iCA-2D.png",
  "/usecases/delivery-truck.png",
  "/usecases/drone--delivery.png",
];

export function Capabilities({ content }) {
  return (
    <AnimatedSection id="use-cases">
      <SectionHeader kicker={content.useCases.kicker} title={content.useCases.title} />
      <div className="use-case-grid">
        {content.useCases.cards.map(([title, text], i) => (
          <article className="use-case-card" key={title}>
            {ICONS[i] && (
              <img
                className="use-case-icon"
                src={ICONS[i]}
                alt=""
                aria-hidden="true"
                width="32"
                height="32"
              />
            )}
            <div className="use-case-text">
              <h3>{title}</h3>
              <p>{text}</p>
            </div>
          </article>
        ))}
        <div className="use-case-photo">
          <img
            src="/usecases/usecase-car.jpg"
            alt="D.VISION SDR встановлений у автомобілі"
          />
        </div>
      </div>
    </AnimatedSection>
  );
}
