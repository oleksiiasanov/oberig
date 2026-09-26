import { motion } from "framer-motion";
import { CTAButtons } from "./CTAButtons.jsx";

export function Hero({ content }) {
  return (
    <section className="hero" id="top">
      <div className="hero-bg" aria-hidden="true">
        <div className="hero-bg-fade" />
      </div>
      <div className="hero-inner section">
        <div className="hero-copy">
          <motion.p className="eyebrow" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
            {content.hero.eyebrow}
          </motion.p>
          <motion.h1
            className="hero-title"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08, type: "spring", stiffness: 90, damping: 16 }}
          >
            {content.hero.title}
            <span className="hero-title-sub">{content.hero.subtitle}</span>
          </motion.h1>
          <motion.div
            className="proof-chips"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.14, type: "spring", stiffness: 90, damping: 16 }}
            aria-label={content.hero.chipsLabel}
          >
            {content.hero.chips.map((chip) => (
              <span key={chip}>{chip}</span>
            ))}
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 90, damping: 16 }}
          >
            <CTAButtons content={content} />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
