import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const srcRoots = ["src", "index.html", "public"];

const WHATSAPP_URL = "https://wa.me/380954716680";
const ORDER_URL = "https://prom.ua/p3099333953-dron-detektor-dvision.html";

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
  "D.Vision SDR - FPV-відеодетектор на основі SDR-платформи",
  "D.VISION SDR",
  "SDR",
  "500–9000 МГц",
  "~9 секунд",
  "Водоспад",
  "RSSI/SNR",
  "Замовити",
  "Зв’язатись з нами",
  WHATSAPP_URL,
  ORDER_URL,
  "https://www.tiktok.com/@dvision_sdr",
  "https://www.instagram.com/dvision_sdr",
  "Language",
  "language-menu",
  "menu-backdrop",
  "/logo-default.png",
  "/logo-exp.png",
  "/device-loop-3d-alpha.webm",
  "/device-loop-3d.mp4",
  "/device-loop-3d-poster.png",
  "/og-image.png",
  "https://www.dvision.com.ua/",
  "https://www.dvision.com.ua/og-image.png",
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
  "public/device-loop-3d.mp4",
  "public/device-loop-3d-alpha.webm",
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

if (failures.length) {
  console.error("Content/design checks failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log("Content/design checks passed.");
