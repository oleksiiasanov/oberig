import { motion } from "framer-motion";
import { CTAButtons } from "./CTAButtons.jsx";

export function Hero({ content }) {
  return (
    <section className="hero section" id="top">
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
          aria-label={content.advantages.kicker}
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
      <motion.div
        className="hero-media"
        initial={{ opacity: 0, y: 22, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ delay: 0.18, type: "spring", stiffness: 85, damping: 18 }}
      >
        <img
          className="hero-product"
          src="/hero_main.png"
          alt={content.hero.imageAlt}
          width="1024"
          height="1536"
        />
      </motion.div>
    </section>
  );
}
