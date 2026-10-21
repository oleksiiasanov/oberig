import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";
import { landingContent } from "./src/data/content.js";
import { buildCatalog } from "./src/lib/catalog.js";

// Emits /catalog.json (Ukrainian catalog prices) so the OMS order intake checks prices against the live site.
const catalogJson = () => ({
  name: "catalog-json",
  generateBundle() {
    this.emitFile({
      type: "asset",
      fileName: "catalog.json",
      source: `${JSON.stringify(buildCatalog(landingContent.uk.order.items), null, 2)}\n`,
    });
  },
});

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "VITE_");
  const url = env.VITE_ORDER_API_URL || "";
  const key = env.VITE_TURNSTILE_SITEKEY || "";
  if (Boolean(url) !== Boolean(key)) throw new Error("Configure public order API URL and Turnstile sitekey together");
  if (url && url !== "https://api.dvision.com.ua/order") throw new Error("Unexpected public order API URL");
  return { plugins: [react(), catalogJson()] };
});
