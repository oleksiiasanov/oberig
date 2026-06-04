import { CTAButtons } from "./CTAButtons.jsx";
import { AnimatedSection } from "./AnimatedSection.jsx";

export function FinalCTA() {
  return (
    <AnimatedSection id="contact" className="final-cta">
      <p className="eyebrow">Наступний крок</p>
      <h2>Потрібен час на реакцію до наближення дрона?</h2>
      <p>Проконсультуємо, як Oberig допомагає завчасно помічати аналоговий відеосигнал FPV-дрона, і приймемо заявку на замовлення.</p>
      <CTAButtons center />
    </AnimatedSection>
  );
}
