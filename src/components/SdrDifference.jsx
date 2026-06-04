import { ArrowRight, RadioTower, ScanLine } from "lucide-react";
import { AnimatedSection } from "./AnimatedSection.jsx";
import { SectionHeader } from "./SectionHeader.jsx";

export function SdrDifference() {
  return (
    <AnimatedSection id="sdr" className="section-quiet">
      <SectionHeader
        kicker="Чому SDR"
        title="Не просто “є сигнал”. Раніше побачити активність і зрозуміти, що наближається."
        text="SDR-підхід поєднує live video, сканер, спектральну картину й показники якості сигналу, щоб попередження було практичним, а не абстрактним."
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
          <p>Допомагає шукати активні передачі й оцінювати сигнал, щоб раніше помітити потенційну FPV-загрозу.</p>
        </article>
      </div>
    </AnimatedSection>
  );
}
