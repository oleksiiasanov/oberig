import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const srcRoots = ["src", "index.html", "public"];

const WHATSAPP_URL = "https://wa.me/380954716680";
const ORDER_URL = "https://forms.gle/xFcMaTWR1G5pR4qW6";

const forbidden = [
  "1050",
  "6040",
  "без сліпих зон",
  "Закрийте частотні діри",
  "Замовити / Отримати КП",
  "Blackout",
  "EW integration",
  "Direction finding",
  "FPV only",
  "виявляє все",
  "Дзиґа",
  "Янгол",
  "Palantir",
  "Whoover",
  "Чуйка",
  "Сенс-4",
];

const required = [
  "D·Vision SDR. Детектор БПЛА на основі SDR-платформи",
  "D·Vision SDR",
  "SDR",
  "500–8700 МГц",
  "~9 секунд",
  "Водоспад",
  "Відео-огляд D·Vision SDR",
  "Замовити",
  "Зв’язатись з нами",
  WHATSAPP_URL,
  ORDER_URL,
  "https://www.tiktok.com/@dvision_sdr",
  "https://www.instagram.com/dvision_sdr",
  "https://www.facebook.com/dvision.sdr",
  "https://youtube.com/@d.visionsdr",
  "Language",
  "language-menu",
  "menu-backdrop",
  "/logo-default.png",
  "/logo-exp.png",
  "/og-image-v2.png",
  "https://www.dvision.com.ua/",
  "https://www.dvision.com.ua/og-image-v2.png",
  "/favicon.ico",
  "/favicons/favicon-32x32.png",
  "/favicons/apple-icon-180x180.png",
  "/favicons/manifest.json",
  "og:title",
  "og:image",
  "twitter:card",
  "twitter:image",
];

function collectFiles(path) {
  const full = join(root, path);
  const stats = statSync(full);

  if (stats.isFile()) return [full];

  return readdirSync(full).flatMap((entry) => {
    const next = join(path, entry);
    const nextFull = join(root, next);
    const nextStats = statSync(nextFull);

    if (nextStats.isDirectory()) return collectFiles(next);
    if (/\.(jsx?|css|html|svg)$/.test(entry)) return [nextFull];
    return [];
  });
}

const files = srcRoots.flatMap(collectFiles);
const haystack = files.map((file) => readFileSync(file, "utf8")).join("\n");
const failures = [];

for (const term of forbidden) {
  if (haystack.includes(term)) failures.push(`Forbidden public term found: ${term}`);
}

for (const term of required) {
  if (!haystack.includes(term)) failures.push(`Required public/content term missing: ${term}`);
}

for (const path of [
  "public/device-loop-3d-alpha.webm",
  "public/device-loop-3d-mobile-bg.mp4",
  "public/device-loop-3d-poster.png",
  "public/robots.txt",
  "public/sitemap.xml",
  "public/.well-known/security.txt",
]) {
  if (!existsSync(join(root, path))) failures.push(`Required public asset missing: ${path}`);
}

// public/ is copied verbatim into dist/ by Vite, so heavy/unused source media must not live there.
for (const heavy of ["public/Device_loop1_3d.mov", "public/video_1.mp4"]) {
  if (existsSync(join(root, heavy))) {
    failures.push(`Heavy/unused media in public/ ships to dist/: ${heavy}. Keep sources in raw-assets/ and use the optimized device-loop-3d.{mp4,webm}.`);
  }
}

const css = readFileSync(join(root, "src/styles.css"), "utf8");
const html = readFileSync(join(root, "index.html"), "utf8");
const vercelConfig = readFileSync(join(root, "vercel.json"), "utf8");

if (css.includes("@media (max-width")) {
  failures.push("CSS must be mobile-first and avoid max-width media queries.");
}

if (!css.includes("@media (min-width")) {
  failures.push("CSS is missing min-width mobile-first breakpoints.");
}

if (!css.includes("prefers-reduced-motion")) {
  failures.push("CSS is missing prefers-reduced-motion handling.");
}

if (!/min-height:\s*(4[4-9]|[5-9]\d)px/.test(css)) {
  failures.push("CSS should include tap targets with min-height of at least 44px.");
}

if (css.includes("#000000")) {
  failures.push("Avoid pure #000000 in the visual system.");
}

if (!css.includes("--accent-rgb: 162, 251, 10")) {
  failures.push("Design system must use green as the default focus accent rgb(162, 251, 10).");
}

if (css.includes('data-theme="bronze"') || css.includes("--accent-rgb: 195, 141, 24")) {
  failures.push("Bronze/gold theme should be removed from the visual system.");
}

if (!html.includes('name="twitter:card" content="summary_large_image"')) {
  failures.push("Twitter previews should use summary_large_image when OG image is enabled.");
}

for (const header of [
  "Content-Security-Policy",
  "Permissions-Policy",
  "Referrer-Policy",
  "X-Content-Type-Options",
  "X-Frame-Options",
]) {
  if (!vercelConfig.includes(header)) failures.push(`Vercel security header missing: ${header}`);
}

// Every className used in a component should have a matching CSS rule somewhere, so a
// deleted/lost CSS block (like the /cart page regression) fails the build instead of
// shipping an unstyled page. This is a heuristic over static string literals only —
// classes built entirely from runtime template interpolation aren't extracted, so it
// can't catch everything, but it can't be fooled into flagging a class that's actually styled.
function extractClassNameExpressions(content) {
  const exprs = [];
  const marker = "className={";
  let searchFrom = 0;
  let idx;
  while ((idx = content.indexOf(marker, searchFrom)) !== -1) {
    let i = idx + marker.length;
    let depth = 1;
    while (i < content.length && depth > 0) {
      if (content[i] === "{") depth++;
      else if (content[i] === "}") depth--;
      i++;
    }
    exprs.push(content.slice(idx + marker.length, i - 1));
    searchFrom = i;
  }
  return exprs;
}

const usedClassNames = new Set();
const jsxFiles = files.filter((file) => /\.jsx$/.test(file));

for (const file of jsxFiles) {
  const content = readFileSync(file, "utf8");

  const staticAttrRe = /className\s*=\s*["']([^"']*)["']/g;
  let match;
  while ((match = staticAttrRe.exec(content))) {
    match[1].split(/\s+/).filter(Boolean).forEach((cls) => usedClassNames.add(cls));
  }

  for (const expr of extractClassNameExpressions(content)) {
    const stringLiteralRe = /["'`]([^"'`]*)["'`]/g;
    let literalMatch;
    while ((literalMatch = stringLiteralRe.exec(expr))) {
      const literal = literalMatch[1];
      if (!literal || literal.includes("${")) continue;
      literal
        .split(/\s+/)
        .filter((cls) => /^[a-zA-Z][\w-]*$/.test(cls))
        .forEach((cls) => usedClassNames.add(cls));
    }
  }
}

// Classes below are intentionally unstyled: page-scoping hooks reserved for future overrides,
// or icon-variant modifiers where only some values (e.g. "x") need an override and the rest
// fall back to the base rule. Not orphans - don't add a class here just to silence the check.
const CLASSNAME_ALLOWLIST = new Set(["cart-page", "service-section-check"]);
for (const cls of CLASSNAME_ALLOWLIST) usedClassNames.delete(cls);

for (const cls of usedClassNames) {
  const selector = new RegExp(`\\.${cls.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(?![\\w-])`);
  if (!selector.test(css)) {
    failures.push(`CSS class used in JSX but missing from styles.css: .${cls}`);
  }
}

// Every fetch() target's origin must be allow-listed in the CSP's connect-src, so adding a
// new external call without updating vercel.json fails the build instead of the browser
// silently blocking the request in production (the /cart order-webhook regression).
// Can't catch a redirect target added by the remote service at runtime (e.g. Apps Script's
// script.google.com -> script.googleusercontent.com hop) - only origins visible in source.
const vercelJson = JSON.parse(vercelConfig);
const cspValue =
  vercelJson.headers
    ?.flatMap((rule) => rule.headers || [])
    .find((header) => header.key === "Content-Security-Policy")?.value || "";
const connectSrcMatch = cspValue.match(/connect-src\s+([^;]+)/);
const allowedOrigins = new Set(
  (connectSrcMatch?.[1] || "").split(/\s+/).filter((token) => /^https?:\/\//.test(token)),
);

const jsFiles = files.filter((file) => /\.jsx?$/.test(file));
const jsSources = jsFiles.map((file) => readFileSync(file, "utf8"));
const jsHaystack = jsSources.join("\n");
const fetchOrigins = new Set();
const fetchCallRe = /fetch\(\s*(?:"([^"]+)"|'([^']+)'|`([^`]+)`|([A-Za-z_$][\w$]*))/g;

for (const content of jsSources) {
  let match;
  fetchCallRe.lastIndex = 0;
  while ((match = fetchCallRe.exec(content))) {
    let url = match[1] || match[2] || match[3];
    if (!url && match[4]) {
      const defRe = new RegExp(`(?:const|let|var)\\s+${match[4]}\\s*=([^;]+);`);
      const urlLiteral = defRe.exec(jsHaystack)?.[1]?.match(/https?:\/\/[^"'`\s)]+/);
      if (urlLiteral) url = urlLiteral[0];
    }
    if (url && /^https?:\/\//.test(url)) {
      try {
        fetchOrigins.add(new URL(url).origin);
      } catch {
        // not a resolvable literal URL (e.g. built from runtime-only pieces); skip it
      }
    }
  }
}

for (const origin of fetchOrigins) {
  if (!allowedOrigins.has(origin)) {
    failures.push(`fetch() target ${origin} is not allow-listed in vercel.json's CSP connect-src`);
  }
}

if (failures.length) {
  console.error("Content/design checks failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log("Content/design checks passed.");
