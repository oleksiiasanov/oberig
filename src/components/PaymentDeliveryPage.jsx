import { CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import { FinalCTA } from "./FinalCTA.jsx";

function PaymentSection({ section }) {
  return (
    <motion.article
      className="service-section service-section-check"
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ type: "spring", stiffness: 90, damping: 18 }}
    >
      <div className="service-section-head">
        <CheckCircle2 aria-hidden="true" />
        <h2>{section.title}</h2>
      </div>
      {section.items?.length ? (
        <ul>
          {section.items.map(([label, text]) => (
            <li key={label}>
              <strong>{label}:</strong> {text}
            </li>
          ))}
        </ul>
      ) : null}
      {section.note ? (
        <p className="service-note">
          {section.noteLabel ? <strong>{section.noteLabel}: </strong> : null}
          {section.note}
        </p>
      ) : null}
    </motion.article>
  );
}

export function PaymentDeliveryPage({ content }) {
  const { paymentDelivery } = content;

  return (
    <main className="service-page">
      <section className="section service-hero">
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08, type: "spring", stiffness: 90, damping: 18 }}>
          <h1>{paymentDelivery.title}</h1>
        </motion.div>
      </section>

      <section className="section service-list-section">
        <div className="service-list">
          {paymentDelivery.sections.map((section) => (
            <PaymentSection section={section} key={section.title} />
          ))}
        </div>
      </section>

      <FinalCTA content={content} />
    </main>
  );
}
