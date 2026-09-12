import { CheckCircle2, XCircle } from "lucide-react";
import { motion } from "framer-motion";

const SECTION_ICONS = {
  check: CheckCircle2,
  x: XCircle,
};

function ServiceSection({ section }) {
  const Icon = SECTION_ICONS[section.icon] || CheckCircle2;

  return (
    <motion.article
      className={`service-section service-section-${section.icon}`}
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ type: "spring", stiffness: 90, damping: 18 }}
    >
      <div className="service-section-head">
        <Icon aria-hidden="true" />
        <h2>{section.title}</h2>
      </div>
      <p>{section.text}</p>
      {section.listIntro ? <p className="service-list-intro">{section.listIntro}</p> : null}
      {section.items?.length ? (
        <ul>
          {section.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      ) : null}
      {section.note ? <p className="service-note">{section.note}</p> : null}
    </motion.article>
  );
}

export function ServicePage({ content }) {
  const { service } = content;

  return (
    <main className="service-page">
      <section className="section service-hero">
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08, type: "spring", stiffness: 90, damping: 18 }}>
          <h1>{service.title}</h1>
          <p className="service-lead">{service.lead}</p>
        </motion.div>
      </section>

      <section className="section service-list-section">
        <div className="service-list">
          {service.sections.map((section) => (
            <ServiceSection section={section} key={section.title} />
          ))}
        </div>
      </section>
    </main>
  );
}
