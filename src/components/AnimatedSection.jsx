import { motion } from "framer-motion";

const section = {
  hidden: { opacity: 0, y: 26 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 95, damping: 18 },
  },
};

export function AnimatedSection({ id, className = "", children }) {
  return (
    <motion.section
      id={id}
      className={`section ${className}`}
      variants={section}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
    >
      {children}
    </motion.section>
  );
}
