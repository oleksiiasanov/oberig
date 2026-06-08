import { useEffect, useMemo, useState } from "react";
import { Header } from "./components/Header.jsx";
import { Hero } from "./components/Hero.jsx";
import { MarketProblem } from "./components/MarketProblem.jsx";
import { SdrDifference } from "./components/SdrDifference.jsx";
import { Modes } from "./components/Modes.jsx";
import { Capabilities } from "./components/Capabilities.jsx";
import { MarketComparison } from "./components/MarketComparison.jsx";
import { Trust } from "./components/Trust.jsx";
import { FAQ } from "./components/FAQ.jsx";
import { FinalCTA } from "./components/FinalCTA.jsx";
import { landingContent, LANGUAGES } from "./data/content.js";

const STORAGE_KEY = "oberig-language";

function getFallbackLanguage() {
  if (typeof navigator === "undefined") return "en";
  return navigator.language?.toLowerCase().startsWith("uk") ? "uk" : "en";
}

export default function App() {
  const [language, setLanguage] = useState(() => {
    if (typeof window === "undefined") return "en";
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored === "uk" || stored === "en" ? stored : getFallbackLanguage();
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
    setLanguage(nextLanguage);
    localStorage.setItem(STORAGE_KEY, nextLanguage);
  };

  return (
    <>
      <Header content={content} language={language} onLanguageChange={handleLanguageChange} />
      <main>
        <Hero content={content} />
        <MarketProblem content={content} />
        <SdrDifference content={content} />
        <Modes content={content} />
        <MarketComparison content={content} />
        <Capabilities content={content} />
        <FAQ content={content} />
        <Trust content={content} />
        <FinalCTA content={content} />
      </main>
    </>
  );
}
