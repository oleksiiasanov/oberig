import { useEffect, useMemo, useState } from "react";
import { Header } from "./components/Header.jsx";
import { Hero } from "./components/Hero.jsx";
import { MarketProblem } from "./components/MarketProblem.jsx";
import { Modes } from "./components/Modes.jsx";
import { Capabilities } from "./components/Capabilities.jsx";
import { MarketComparison } from "./components/MarketComparison.jsx";
import { Trust } from "./components/Trust.jsx";
import { FAQ } from "./components/FAQ.jsx";
import { FinalCTA } from "./components/FinalCTA.jsx";
import { landingContent, LANGUAGES, SELECTABLE_LANGUAGE_CODES } from "./data/content.js";

const STORAGE_KEY = "dvision-language";
const LOGO_STORAGE_KEY = "dvision-logo-variant";
const DEFAULT_LOGO_VARIANT = "sdr";
const LOGO_VARIANTS = ["base", "sdr"];

function getFallbackLanguage() {
  if (typeof navigator === "undefined") return "en";
  return navigator.language?.toLowerCase().startsWith("uk") ? "uk" : "en";
}

function isSupportedLanguage(language) {
  return SELECTABLE_LANGUAGE_CODES.includes(language);
}

function isSupportedLogoVariant(variant) {
  return LOGO_VARIANTS.includes(variant);
}

export default function App() {
  const [language, setLanguage] = useState(() => {
    if (typeof window === "undefined") return "en";
    const stored = localStorage.getItem(STORAGE_KEY);
    return isSupportedLanguage(stored) ? stored : getFallbackLanguage();
  });
  const [logoVariant, setLogoVariant] = useState(() => {
    if (typeof window === "undefined") return DEFAULT_LOGO_VARIANT;
    const stored = localStorage.getItem(LOGO_STORAGE_KEY);
    return isSupportedLogoVariant(stored) ? stored : DEFAULT_LOGO_VARIANT;
  });

  useEffect(() => {
    if (typeof window === "undefined" || localStorage.getItem(STORAGE_KEY)) return;

    const controller = new AbortController();

    fetch("https://ipapi.co/json/", { signal: controller.signal })
      .then((response) => (response.ok ? response.json() : null))
      .then((geo) => {
        if (!geo?.country_code) return;
        setLanguage(geo.country_code === "UA" ? "uk" : "en");
      })
      .catch(() => {
        setLanguage(getFallbackLanguage());
      });

    return () => controller.abort();
  }, []);

  useEffect(() => {
    document.documentElement.lang = LANGUAGES[language].locale;
  }, [language]);

  const content = useMemo(() => landingContent[language] || landingContent.en, [language]);

  const handleLanguageChange = (nextLanguage) => {
    if (!isSupportedLanguage(nextLanguage)) return;
    setLanguage(nextLanguage);
    localStorage.setItem(STORAGE_KEY, nextLanguage);
  };

  const handleLogoToggle = () => {
    setLogoVariant((currentVariant) => {
      const nextVariant = currentVariant === "sdr" ? "base" : "sdr";
      localStorage.setItem(LOGO_STORAGE_KEY, nextVariant);
      return nextVariant;
    });
  };

  return (
    <>
      <Header content={content} language={language} logoVariant={logoVariant} onLanguageChange={handleLanguageChange} />
      <main>
        <Hero content={content} />
        <MarketProblem content={content} />
        <Modes content={content} onLogoToggle={handleLogoToggle} />
        <MarketComparison content={content} />
        <Capabilities content={content} />
        <FAQ content={content} />
        <Trust content={content} />
        <FinalCTA content={content} />
      </main>
    </>
  );
}
