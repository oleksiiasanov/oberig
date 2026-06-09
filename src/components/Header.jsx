import { useEffect, useRef, useState } from "react";
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
  const scrollYRef = useRef(0);

  const closeMenu = () => setIsMenuOpen(false);
  const handleNavClick = (event, href) => {
    if (!href.startsWith("#")) {
      closeMenu();
      return;
    }

    event.preventDefault();
    closeMenu();
    window.setTimeout(() => {
      document.querySelector(href)?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 0);
  };

  useEffect(() => {
    if (!isMenuOpen || typeof window === "undefined") return undefined;

    const root = document.documentElement;
    const body = document.body;
    const scrollY = window.scrollY || root.scrollTop || 0;

    scrollYRef.current = scrollY;
    root.classList.add("menu-open");
    body.classList.add("menu-open");
    body.style.position = "fixed";
    body.style.top = `-${scrollY}px`;
    body.style.left = "0";
    body.style.right = "0";
    body.style.width = "100%";

    return () => {
      root.classList.remove("menu-open");
      body.classList.remove("menu-open");
      body.style.position = "";
      body.style.top = "";
      body.style.left = "";
      body.style.right = "";
      body.style.width = "";
      window.scrollTo(0, scrollYRef.current);
    };
  }, [isMenuOpen]);

  useEffect(() => {
    if (!isMenuOpen) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") closeMenu();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
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
            <a href={href} onClick={(event) => handleNavClick(event, href)} key={href}>
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
