import { Image as ImageIcon } from "lucide-react";

export function ImagePlaceholder({ alt, label, className = "" }) {
  return (
    <div className={`image-placeholder ${className}`} role="img" aria-label={alt}>
      <ImageIcon aria-hidden="true" />
      {label ? <span>{label}</span> : null}
    </div>
  );
}
