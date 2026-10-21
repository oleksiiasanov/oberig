import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { landingContent } from "../src/data/content.js";
import { buildCatalog } from "../src/lib/catalog.js";

describe("catalog.json", () => {
  const catalog = buildCatalog(landingContent.uk.order.items);

  it("lists the 10 sellable lines with whole-hryvnia prices", () => {
    assert.deepEqual(catalog, {
      version: 1,
      currency: "UAH",
      items: [
        { id: "detector", price: 24000 },
        { id: "car-antenna", price: 7000 },
        { id: "car-antenna-amp", cableLengthM: 5, price: 13200 },
        { id: "car-antenna-amp", cableLengthM: 10, price: 14200 },
        { id: "bunker-antenna", cableLengthM: 14, price: 15600 },
        { id: "bunker-antenna", cableLengthM: 20, price: 16000 },
        { id: "car-holder", price: 1000 },
        { id: "molle-mount", price: 500 },
        { id: "antenna-high", price: 250 },
        { id: "antenna-low", price: 200 },
      ],
    });
  });

  it("matches the English cart, so prices do not depend on the visitor's language", () => {
    assert.deepEqual(buildCatalog(landingContent.en.order.items), catalog);
  });

  it("has no unpriced or duplicate lines", () => {
    const keys = catalog.items.map((line) => `${line.id}:${line.cableLengthM ?? ""}`);
    assert.equal(new Set(keys).size, keys.length);
    assert.ok(catalog.items.every((line) => Number.isInteger(line.price) && line.price > 0));
  });
});
