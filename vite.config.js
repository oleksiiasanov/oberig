import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "VITE_");
  const url = env.VITE_ORDER_API_URL || "";
  const key = env.VITE_TURNSTILE_SITEKEY || "";
  if (Boolean(url) !== Boolean(key)) throw new Error("Configure public order API URL and Turnstile sitekey together");
  if (url && url !== "https://api.dvision.com.ua/order") throw new Error("Unexpected public order API URL");
  return { plugins: [react()] };
});
