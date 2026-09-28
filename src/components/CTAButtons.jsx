export function CTAButtons({ content, center = false, secondary = true }) {
  return (
    <div className={`cta-row ${center ? "cta-center" : ""}`} aria-label={content.meta.ctaLabel}>
      <a className="btn btn-primary" href="/order">
        <span>{content.meta.primaryAction}</span>
      </a>
      {secondary ? (
        <a className="btn btn-secondary" href={content.whatsappUrl} target="_blank" rel="noreferrer">
          <span>{content.meta.secondaryAction}</span>
        </a>
      ) : null}
    </div>
  );
}
