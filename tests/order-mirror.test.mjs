import { afterEach, beforeEach, describe, it, mock } from "node:test";
import assert from "node:assert/strict";
import { mirrorOrder, normalizeItems, orderAttempt } from "../src/lib/orderMirror.js";

const order = {
  clientOrderId: "3f1c2b7e-9a4d-4c1e-8f2a-6b5d4c3e2a10",
  items: [
    { id: "detector", name: "Детектор", quantity: 1, unitPrice: 24000 },
    { id: "bunker-antenna", name: "Антена", cableLengthM: 20, quantity: 1, unitPrice: 16000 },
    { id: "bunker-antenna", name: "Антена", cableLengthM: 14, quantity: 1, unitPrice: 15600 },
    { id: "detector", name: "Детектор", quantity: 2, unitPrice: 24000 },
  ],
  total: 3 * 24000 + 16000 + 15600,
  name: "Іван",
  phone: "+380501234567",
  comment: "",
  whatsappConsent: true,
  language: "uk",
  submittedAt: "2026-10-20T10:00:00.000Z",
};

describe("orderAttempt", () => {
  it("reuses id and submittedAt for the same order and renews both when it changes", () => {
    const first = orderAttempt(null, { name: "A", items: [1] });
    assert.match(first.clientOrderId, /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/);
    assert.equal(orderAttempt(first, { name: "A", items: [1] }), first);
    const changed = orderAttempt(first, { name: "B", items: [1] });
    assert.notEqual(changed.clientOrderId, first.clientOrderId);
  });
});

describe("normalizeItems", () => {
  it("merges lines by id and cable length, sorts them and drops names", () => {
    assert.deepEqual(normalizeItems(order.items), [
      { id: "bunker-antenna", cableLengthM: 14, quantity: 1, unitPrice: 15600 },
      { id: "bunker-antenna", cableLengthM: 20, quantity: 1, unitPrice: 16000 },
      { id: "detector", quantity: 3, unitPrice: 24000 },
    ]);
  });
});

describe("mirrorOrder", () => {
  beforeEach(() => mock.method(globalThis, "fetch", async () => new Response("{}", { status: 201 })));
  afterEach(() => mock.restoreAll());

  it("sends nothing without an intake URL", () => {
    mirrorOrder("", order);
    assert.equal(fetch.mock.callCount(), 0);
  });

  it("posts a simple keepalive request with the normalized order", () => {
    mirrorOrder("https://api.dvision.com.ua/order", order);
    const [url, init] = fetch.mock.calls[0].arguments;
    assert.equal(url, "https://api.dvision.com.ua/order");
    assert.equal(init.headers["Content-Type"], "text/plain;charset=UTF-8");
    assert.equal(init.keepalive, true);
    assert.equal(init.credentials, "omit");
    const body = JSON.parse(init.body);
    assert.equal(body.clientOrderId, order.clientOrderId);
    assert.equal(body.submittedAt, order.submittedAt);
    assert.equal(body.items.length, 3);
  });

  it("swallows network errors", async () => {
    fetch.mock.mockImplementation(async () => {
      throw new TypeError("offline");
    });
    assert.doesNotThrow(() => mirrorOrder("https://api.dvision.com.ua/order", order));
    await new Promise((resolve) => setImmediate(resolve));
  });
});
