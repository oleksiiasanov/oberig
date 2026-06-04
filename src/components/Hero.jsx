import { motion } from "framer-motion";
import { proofChips } from "../data/content.js";
import { CTAButtons } from "./CTAButtons.jsx";

export function Hero() {
  return (
    <section className="hero section" id="top">
      <div className="hero-copy">
        <motion.p className="eyebrow" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          FPV відеодетектор на основі SDR
        </motion.p>
        <motion.p
          className="hero-title"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08, type: "spring", stiffness: 90, damping: 16 }}
        >
          Покриває відеочастоти від 400 до 9800 МГц
        </motion.p>
        <motion.p
          className="hero-lead"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12, type: "spring", stiffness: 90, damping: 16 }}
        >
          Щоб завчасно помітити наближення FPV-дрона, попередити групу й мати більше часу на реакцію.
        </motion.p>
        <motion.div
          className="proof-chips"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.18, type: "spring", stiffness: 90, damping: 16 }}
          aria-label="Підтверджені можливості"
        >
          {proofChips.map((chip) => (
            <span key={chip}>{chip}</span>
          ))}
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.24, type: "spring", stiffness: 90, damping: 16 }}
        >
          <CTAButtons />
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
          alt="SDR-пристрій Oberig з антенами"
          width="1024"
          height="1536"
        />
      </motion.div>
    </section>
  );
}
