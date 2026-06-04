import { marketProblems } from "../data/content.js";
import { AnimatedSection } from "./AnimatedSection.jsx";
import { SectionHeader } from "./SectionHeader.jsx";

export function MarketProblem() {
  return (
    <AnimatedSection id="market">
      <SectionHeader
        kicker="Чому це важливо"
        title="Коли FPV-дрон уже близько, кожна секунда до попередження має значення."
        text="Oberig створений не для красивої аналітики заради аналітики. Його практична ціль — дати військовому більше часу помітити загрозу, попередити групу й ухвалити рішення."
      />
      <div className="bento-grid problem-grid">
        {marketProblems.map((item, index) => (
          <article className={`bento-card problem-card span-${index === 0 ? "wide" : "normal"}`} key={item.title}>
            <span className="card-index">{String(index + 1).padStart(2, "0")}</span>
            <h3>{item.title}</h3>
            <p>{item.text}</p>
          </article>
        ))}
      </div>
    </AnimatedSection>
  );
}
