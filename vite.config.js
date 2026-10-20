import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
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

export default defineConfig({
  plugins: [react(), catalogJson()],
});
