import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Brand } from "./Brand.jsx";
import { LANGUAGES } from "../data/content.js";
import { SocialIcon } from "./SocialIcon.jsx";

function LanguageSwitcher({ language, onLanguageChange, onSelect }) {
  return (
    <div className="language-switcher" aria-label="Language">
      {Object.entries(LANGUAGES).map(([code, config]) => (
        <button
          type="button"
          className={language === code ? "is-active" : ""}
          aria-pressed={language === code}
          onClick={() => {
            onLanguageChange(code);
            onSelect?.();
          }}
          key={code}
        >
          <span aria-hidden="true">{config.flag}</span>
          <span>{config.label}</span>
        </button>
      ))}
    </div>
  );
}

export function Header({ content, language, onLanguageChange }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className="site-header">
      <Brand />
      <button
        type="button"
        className="menu-toggle"
        aria-expanded={isMenuOpen}
        aria-controls="site-menu"
        onClick={() => setIsMenuOpen((value) => !value)}
      >
        {isMenuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
        <span>Menu</span>
      </button>
      <div className={`header-actions ${isMenuOpen ? "is-open" : ""}`} id="site-menu">
        <nav className="nav" aria-label={content.meta.navLabel}>
          {content.nav.map(([href, label]) => (
            <a href={href} onClick={closeMenu} key={href}>
              {label}
            </a>
          ))}
        </nav>
        <div className="social-links header-socials" aria-label="Social links">
          {content.socials.map(([name, label, href]) => (
            <a href={href} target="_blank" rel="noreferrer" aria-label={name} key={name}>
              <SocialIcon name={name} />
              <span className="sr-only">{label}</span>
            </a>
          ))}
        </div>
        <LanguageSwitcher language={language} onLanguageChange={onLanguageChange} onSelect={closeMenu} />
      </div>
    </header>
  );
}
