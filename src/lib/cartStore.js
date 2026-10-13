import { useSyncExternalStore } from "react";

// Cart quantities live in sessionStorage: they follow the visitor across pages and are gone once the tab is closed.
const STORAGE_KEY = "dvision-cart";
const listeners = new Set();
let snapshot;

export const lineKey = (item, length) => (length ? `${item.id}:${length}` : item.id);

function getCart() {
  if (snapshot) return snapshot;
  try {
    const stored = JSON.parse(window.sessionStorage.getItem(STORAGE_KEY));
    snapshot = stored && typeof stored === "object" && !Array.isArray(stored) ? stored : {};
  } catch {
    snapshot = {};
  }
  return snapshot;
}

function setCart(update) {
  snapshot = typeof update === "function" ? update(getCart()) : update;
  try {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
  } catch {
    // storage is unavailable (private mode, quota): the cart still works until the page is reloaded
  }
  listeners.forEach((listener) => listener());
}

function subscribe(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useCart() {
  return [useSyncExternalStore(subscribe, getCart), setCart];
}
