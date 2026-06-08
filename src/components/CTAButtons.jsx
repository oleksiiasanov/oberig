import { ArrowUpRight, MessageCircle, ClipboardList } from "lucide-react";

export function CTAButtons({ content, center = false }) {
  return (
    <div className={`cta-row ${center ? "cta-center" : ""}`} aria-label={content.meta.ctaLabel}>
      <a className="btn btn-primary" href={content.orderUrl} target="_blank" rel="noreferrer">
        <ClipboardList aria-hidden="true" />
        <span>{content.meta.primaryAction}</span>
        <ArrowUpRight aria-hidden="true" />
      </a>
      <a className="btn btn-secondary" href={content.whatsappUrl} target="_blank" rel="noreferrer">
        <MessageCircle aria-hidden="true" />
        <span>{content.meta.secondaryAction}</span>
      </a>
    </div>
  );
}
