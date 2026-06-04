import { ArrowRight, RadioTower, ScanLine } from "lucide-react";
import { AnimatedSection } from "./AnimatedSection.jsx";
import { SectionHeader } from "./SectionHeader.jsx";

export function SdrDifference() {
  return (
    <AnimatedSection id="sdr" className="section-quiet">
      <SectionHeader
        kicker="Чому SDR"
        title="SDR дає ширше покриття відеочастот і більше контексту про загрозу."
        text="Oberig покриває відеочастоти 400-9800 МГц і поєднує live video, сканер, спектральну картину та показники якості сигналу."
      />
      <div className="split-compare">
        <article>
          <RadioTower aria-hidden="true" />
          <h3>Типовий відеоприймач</h3>
          <p>Переважно показує картинку тоді, коли сигнал уже достатній для прийому.</p>
        </article>
        <ArrowRight className="compare-arrow" aria-hidden="true" />
        <article className="highlight">
          <ScanLine aria-hidden="true" />
          <h3>Oberig на SDR</h3>
          <p>Покриває 400-9800 МГц, допомагає шукати активні передачі й оцінювати сигнал, щоб раніше помітити потенційну FPV-загрозу.</p>
        </article>
      </div>
    </AnimatedSection>
  );
}
