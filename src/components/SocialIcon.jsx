import { Facebook, Instagram } from "lucide-react";

function TikTokIcon() {
  return (
    <svg className="social-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path
        d="M15.2 3.4c.35 2.4 1.7 4.05 4.25 4.34v3.13a7.4 7.4 0 0 1-4.2-1.33v5.95c0 3.1-2.2 5.15-5.13 5.15-2.74 0-4.94-1.9-4.94-4.62 0-2.88 2.42-4.74 5.16-4.74.42 0 .78.04 1.1.12v3.1a3.3 3.3 0 0 0-1.06-.17c-1.3 0-2.18.72-2.18 1.83 0 1.06.82 1.76 1.92 1.76 1.18 0 2.02-.68 2.02-2.2V3.4h3.06Z"
        fill="currentColor"
      />
    </svg>
  );
}

const ICONS = {
  Facebook,
  Instagram,
  TikTok: TikTokIcon,
};

export function SocialIcon({ name }) {
  const Icon = ICONS[name];
  if (!Icon) return null;
  return <Icon className="social-icon" aria-hidden="true" focusable="false" />;
}
