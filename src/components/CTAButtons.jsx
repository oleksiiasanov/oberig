import { ArrowUpRight, MessageCircle, ClipboardList } from "lucide-react";
import { ORDER_URL, SIGNAL_URL } from "../data/content.js";

export function CTAButtons({ center = false }) {
  return (
    <div className={`cta-row ${center ? "cta-center" : ""}`} aria-label="Основні дії">
      <a className="btn btn-primary" href={SIGNAL_URL} target="_blank" rel="noreferrer">
        <MessageCircle aria-hidden="true" />
        <span>Отримати консультацію</span>
      </a>
      <a className="btn btn-secondary" href={ORDER_URL} target="_blank" rel="noreferrer">
        <ClipboardList aria-hidden="true" />
        <span>Замовити</span>
        <ArrowUpRight aria-hidden="true" />
      </a>
    </div>
  );
}
