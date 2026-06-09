import { useEffect, useState } from "react";
import { ChevronDown, Menu, X } from "lucide-react";
import { Brand } from "./Brand.jsx";
import { LANGUAGES, SELECTABLE_LANGUAGE_CODES } from "../data/content.js";
import { SocialIcon } from "./SocialIcon.jsx";

function LanguageSwitcher({ language, onLanguageChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const currentLanguage = LANGUAGES[language] || LANGUAGES.en;

  return (
    <div className={`language-switcher ${isOpen ? "is-open" : ""}`} aria-label="Language">
      <button
        type="button"
        className="language-current"
        aria-expanded={isOpen}
        aria-haspopup="menu"
        onClick={() => setIsOpen((value) => !value)}
      >
        <span aria-hidden="true">{currentLanguage.flag}</span>
        <span>{currentLanguage.label}</span>
        <ChevronDown aria-hidden="true" />
      </button>
      <div className="language-menu" role="menu">
        {SELECTABLE_LANGUAGE_CODES.map((code) => {
          const config = LANGUAGES[code];

          return (
            <button
              type="button"
              className={`language-option ${language === code ? "is-active" : ""}`}
              aria-pressed={language === code}
              role="menuitemradio"
              onClick={() => {
                onLanguageChange(code);
                setIsOpen(false);
              }}
              key={code}
            >
              <span aria-hidden="true">{config.flag}</span>
              <span>{config.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function Header({ content, language, onLanguageChange }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const closeMenu = () => setIsMenuOpen(false);

  useEffect(() => {
    if (typeof document === "undefined" || typeof window === "undefined" || !isMenuOpen) return undefined;

    const scrollY = window.scrollY;
    const { position, top, width, overflow } = document.body.style;

    document.documentElement.classList.add("is-menu-open");
    document.body.classList.add("is-menu-open");
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = "100%";
    document.body.style.overflow = "hidden";

    return () => {
      document.documentElement.classList.remove("is-menu-open");
      document.body.classList.remove("is-menu-open");
      document.body.style.position = position;
      document.body.style.top = top;
      document.body.style.width = width;
      document.body.style.overflow = overflow;
      window.scrollTo(0, scrollY);
    };
  }, [isMenuOpen]);

  return (
    <header className="site-header">
      <Brand />
      <div className={`header-actions ${isMenuOpen ? "is-open" : ""}`} id="site-menu">
        <div className="drawer-head">
          <span>{content.meta.menuLabel}</span>
          <button type="button" className="drawer-close" aria-label={content.meta.closeMenuLabel} onClick={closeMenu}>
            <X aria-hidden="true" />
          </button>
        </div>
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
      </div>
      <div className="header-controls">
        <LanguageSwitcher language={language} onLanguageChange={onLanguageChange} />
        <button
          type="button"
          className="menu-toggle"
          aria-expanded={isMenuOpen}
          aria-controls="site-menu"
          onClick={() => setIsMenuOpen((value) => !value)}
        >
          {isMenuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
          <span>{content.meta.menuLabel}</span>
        </button>
      </div>
      <button
        type="button"
        className={`menu-backdrop ${isMenuOpen ? "is-open" : ""}`}
        aria-label={content.meta.closeMenuLabel}
        onClick={closeMenu}
      />
    </header>
  );
}
