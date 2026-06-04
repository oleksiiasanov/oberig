import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const srcRoots = ["src", "index.html", "public"];

const SIGNAL_URL =
  "https://signal.group/#CjQKIJtYdEsLqmFX_KES9TLN8lugJYrcXZCMHkJ5namzsW9mEhDpQtJzhrOuLiakfxgBDh2Y";
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
  "Oberig",
  "SDR",
  "Водоспад",
  "RSSI/SNR",
  "Отримати консультацію",
  "Замовити",
  SIGNAL_URL,
  ORDER_URL,
  "[потребує підтвердження]",
  "Перегляд",
  "Сканер",
  "Браузер",
  "Налаштування",
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

const css = readFileSync(join(root, "src/styles.css"), "utf8");

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

if (failures.length) {
  console.error("Content/design checks failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log("Content/design checks passed.");
