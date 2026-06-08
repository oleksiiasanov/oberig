import { useEffect, useRef } from "react";
import { AnimatedSection } from "./AnimatedSection.jsx";

export function SdrDifference({ content }) {
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.load();
    video.play()?.catch(() => {});
  }, []);

  return (
    <AnimatedSection id="spotlight" className="section-quiet">
      <div className="media-spotlight">
        <div className="media-frame">
          <span>{content.spotlight.badge}</span>
          <div className="media-video-shell">
            <video
              ref={videoRef}
              className="spotlight-video"
              aria-label={content.spotlight.videoLabel}
              autoPlay
              loop
              muted
              defaultMuted
              playsInline
              preload="auto"
              poster="/hero_main.png"
            >
              <source src="/video_1.mp4" type="video/mp4" />
            </video>
          </div>
        </div>
        <div>
          <p className="eyebrow">{content.spotlight.badge}</p>
          <h2>{content.spotlight.title}</h2>
          <p>{content.spotlight.text}</p>
        </div>
      </div>
    </AnimatedSection>
  );
}
