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
import { ManualPage } from "./components/ManualPage.jsx";
import { OrderPage } from "./components/OrderPage.jsx";
import { ServicePage } from "./components/ServicePage.jsx";
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

function getPageFromLocation() {
  if (typeof window === "undefined") return "landing";
  const path = window.location.pathname.replace(/\/$/, "");
  if (path === "/manual") return "manual";
  if (path === "/order") return "order";
  if (path === "/service") return "service";
  return "landing";
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
  const [page, setPage] = useState(getPageFromLocation);
  const content = useMemo(() => landingContent[language] || landingContent.en, [language]);

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

  useEffect(() => {
    const handlePopState = () => setPage(getPageFromLocation());

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  useEffect(() => {
    if (page !== "order" || typeof window === "undefined" || !window.location.hash) return;

    const hash = window.location.hash;
    const timer = window.setTimeout(() => {
      document.querySelector(hash)?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 60);

    return () => window.clearTimeout(timer);
  }, [page]);

  useEffect(() => {
    const baseTitle = "D·Vision SDR - FPV-відеодетектор на основі SDR-платформи";
    const pageLabel =
      page === "manual"
        ? content.manual.navLabel
        : page === "order"
          ? content.order.navLabel
          : page === "service"
            ? content.service.navLabel
            : null;
    document.title = pageLabel ? `${pageLabel} | D·Vision SDR` : baseTitle;
  }, [content.manual.navLabel, content.order.navLabel, content.service.navLabel, page]);

  const handleNavigate = (href) => {
    if (href === "/manual") {
      window.history.pushState({}, "", "/manual");
      setPage("manual");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    if (href === "/order") {
      window.history.pushState({}, "", "/order");
      setPage("order");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    if (href.startsWith("/order#")) {
      const hash = href.slice("/order".length);
      window.history.pushState({}, "", href);
      setPage("order");
      window.setTimeout(() => {
        document.querySelector(hash)?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 60);
      return;
    }

    if (href === "/service") {
      window.history.pushState({}, "", "/service");
      setPage("service");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    if (href === "/" || href === "#top") {
      window.history.pushState({}, "", "/");
      setPage("landing");
      window.setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 0);
      return;
    }

    if (href.startsWith("#")) {
      window.history.pushState({}, "", `/${href}`);
      setPage("landing");
      window.setTimeout(() => {
        document.querySelector(href)?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 0);
    }
  };

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
      <Header
        content={content}
        language={language}
        logoVariant={logoVariant}
        onLanguageChange={handleLanguageChange}
        onNavigate={handleNavigate}
      />
      {page === "manual" ? (
        <ManualPage content={content} language={language} />
      ) : page === "order" ? (
        <OrderPage content={content} />
      ) : page === "service" ? (
        <ServicePage content={content} />
      ) : (
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
      )}
    </>
  );
}
