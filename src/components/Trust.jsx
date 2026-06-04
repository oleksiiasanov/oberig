import { Cpu, Languages, RefreshCw } from "lucide-react";
import { AnimatedSection } from "./AnimatedSection.jsx";
import { SectionHeader } from "./SectionHeader.jsx";

const trustItems = [
  ["Українська SDR-логіка", "Oberig позиціонується як український SDR-продукт, а не перепакований відеоприймач.", Cpu],
  ["OTA шлях розвитку", "Оновлення прошивки через мережу підтверджено в посібнику пристрою.", RefreshCw],
  ["EN / UK інтерфейс", "Підтримка англійської та української мови інтерфейсу підтверджена.", Languages],
];

export function Trust() {
  return (
    <AnimatedSection id="trust">
      <SectionHeader
        kicker="Довіра"
        title="Життя військового важливіше за рекламну гіперболу."
        text="Ми говоримо про раннє попередження, SDR-покриття 400-9800 МГц і підтверджені можливості. Там, де цифр немає, не вигадуємо дальність чи універсальне виявлення."
      />
      <div className="trust-grid">
        {trustItems.map(([title, text, Icon]) => (
          <article key={title}>
            <Icon aria-hidden="true" />
            <h3>{title}</h3>
            <p>{text}</p>
          </article>
        ))}
      </div>
    </AnimatedSection>
  );
}
