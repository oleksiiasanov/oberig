import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Play, X } from "lucide-react";
import { AnimatedSection } from "./AnimatedSection.jsx";
import { SectionHeader } from "./SectionHeader.jsx";
import { SocialIcon } from "./SocialIcon.jsx";
import reelsData from "../data/reels.generated.json";

const POSTER_FALLBACK = "/device-loop-3d-poster.png";
const reels = Array.isArray(reelsData.items) ? reelsData.items : [];

export function SocialReels({ content }) {
  const copy = content.reels;
  const trackRef = useRef(null);
  const closeRef = useRef(null);
  const [activeReel, setActiveReel] = useState(null);

  useEffect(() => {
    if (!activeReel || typeof document === "undefined") return undefined;

    const { body } = document;
    const previousOverflow = body.style.overflow;
    body.style.overflow = "hidden";
    closeRef.current?.focus();

    const handleKeyDown = (event) => {
      if (event.key === "Escape") setActiveReel(null);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      body.style.overflow = previousOverflow;
    };
  }, [activeReel]);

  if (!reels.length) return null;

  const scrollByCards = (direction) => {
    const track = trackRef.current;
    if (!track) return;

    const card = track.querySelector(".reel-card");
    const step = card ? card.getBoundingClientRect().width + 21 : track.clientWidth * 0.8;
    track.scrollBy({ left: direction * step, behavior: "smooth" });
  };

  return (
    <AnimatedSection id="reels" className="reels-section">
      <SectionHeader kicker={copy.kicker} title={copy.title} text={copy.text} />

      <div className="reels-slider">
        <button
          type="button"
          className="reels-nav reels-nav-prev"
          aria-label={copy.prevLabel}
          onClick={() => scrollByCards(-1)}
        >
          <ChevronLeft aria-hidden="true" />
        </button>

        <ul className="reels-track" ref={trackRef}>
          {reels.map((reel) => (
            <li className="reel-card" key={reel.id}>
              <button
                type="button"
                className="reel-card-button"
                onClick={() => setActiveReel(reel)}
                aria-label={`${copy.playLabel} — ${reel.title || copy.accountName}`}
              >
                <span className="reel-media">
                  <img
                    src={(reel.thumbnails && reel.thumbnails[0]) || reel.thumbnail || POSTER_FALLBACK}
                    alt={reel.title || copy.accountName}
                    loading="lazy"
                    width="600"
                    height="600"
                    onError={(event) => {
                      const image = event.currentTarget;
                      const chain = reel.thumbnails || [];
                      const step = Number(image.dataset.step || "0") + 1;
                      image.dataset.step = String(step);
                      image.src = chain[step] || POSTER_FALLBACK;
                    }}
                  />
                  <span className="reel-play" aria-hidden="true">
                    <Play />
                  </span>
                </span>
                <span className="reel-meta">
                  <span className="reel-account">
                    <img
                      className="reel-avatar"
                      src="/favicons/favicon-96x96.png"
                      alt=""
                      aria-hidden="true"
                      width="26"
                      height="26"
                    />
                    <span className="reel-account-text">
                      <strong>{copy.accountName}</strong>
                    </span>
                  </span>
                  <SocialIcon name="YouTube" />
                </span>
              </button>
            </li>
          ))}
        </ul>

        <button
          type="button"
          className="reels-nav reels-nav-next"
          aria-label={copy.nextLabel}
          onClick={() => scrollByCards(1)}
        >
          <ChevronRight aria-hidden="true" />
        </button>
      </div>

      {activeReel ? (
        <div
          className="reel-modal"
          role="dialog"
          aria-modal="true"
          aria-label={activeReel.title || copy.accountName}
          onClick={(event) => {
            if (event.target === event.currentTarget) setActiveReel(null);
          }}
        >
          <div className="reel-modal-inner">
            <button
              type="button"
              className="reel-modal-close"
              aria-label={copy.closeLabel}
              onClick={() => setActiveReel(null)}
              ref={closeRef}
            >
              <X aria-hidden="true" />
            </button>

            <div className="reel-modal-media">
              {activeReel.embedUrl ? (
                <iframe
                  key={activeReel.id}
                  src={`${activeReel.embedUrl}?autoplay=1&rel=0&modestbranding=1&playsinline=1`}
                  title={activeReel.title || copy.accountName}
                  loading="lazy"
                  allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                  allowFullScreen
                />
              ) : (
                <video
                  key={activeReel.id}
                  src={activeReel.src}
                  poster={activeReel.thumbnail || POSTER_FALLBACK}
                  controls
                  autoPlay
                  playsInline
                />
              )}
            </div>
          </div>
        </div>
      ) : null}
    </AnimatedSection>
  );
}
