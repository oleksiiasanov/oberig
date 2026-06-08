import { Brand } from "./Brand.jsx";
import { LANGUAGES } from "../data/content.js";

function LanguageSwitcher({ language, onLanguageChange }) {
  return (
    <div className="language-switcher" aria-label="Language">
      {Object.entries(LANGUAGES).map(([code, config]) => (
        <button
          type="button"
          className={language === code ? "is-active" : ""}
          aria-pressed={language === code}
          onClick={() => onLanguageChange(code)}
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
  return (
    <header className="site-header">
      <Brand />
      <div className="header-actions">
        <nav className="nav" aria-label={content.meta.navLabel}>
          {content.nav.map(([href, label]) => (
            <a href={href} key={href}>
              {label}
            </a>
          ))}
        </nav>
        <div className="social-links header-socials" aria-label="Social links">
          {content.socials.map(([name, label, href]) => (
            <a href={href} target="_blank" rel="noreferrer" aria-label={name} key={name}>
              {label}
            </a>
          ))}
        </div>
        <LanguageSwitcher language={language} onLanguageChange={onLanguageChange} />
      </div>
    </header>
  );
}
