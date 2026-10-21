import test from "node:test";
import assert from "node:assert/strict";
import { readAttempt, saveAttempt, clearAttempt, orderAttempt, submitCheckout, sendCrmOrder } from "../src/lib/checkout.js";
const data = { items: [{ id: "detector", quantity: 1000, unitPrice: 24000 }], total: 24000000, name: "Synthetic", phone: "+380501234567", comment: "", whatsappConsent: true, language: "uk" };
const payload = orderAttempt(null, data).payload;
const tick = () => new Promise((resolve) => setImmediate(resolve));

test("same attempt survives reload, edits renew identity and success clears storage", () => {
  const values = new Map();
  const storage = { getItem: (k) => values.get(k), setItem: (k, v) => values.set(k, v), removeItem: (k) => values.delete(k) };
  const first = orderAttempt(null, data, 1000);
  saveAttempt(storage, first);
  const reloaded = readAttempt(storage, 2000);
  assert.deepEqual(orderAttempt(reloaded, data, 2000), first);
  assert.notEqual(orderAttempt(reloaded, { ...data, comment: "different" }, 2000).payload.clientOrderId, first.payload.clientOrderId);
  assert.equal(orderAttempt(null, data).payload.items[0].quantity, 1000);
  clearAttempt(storage);
  assert.equal(readAttempt(storage, 2000), null);
  saveAttempt(storage, first);
  assert.equal(orderAttempt(readAttempt(storage, 1000 + 24 * 60 * 60 * 1000), data).payload.clientOrderId, first.payload.clientOrderId);
});
test("CRM success does not wait for a stalled Sheets request", async () => {
  let sheetCalled = false;
  const result = await submitCheckout({ payload, submitSheets: () => { sheetCalled = true; return new Promise(() => {}); }, submitCrm: async () => ({ ok: true }) });
  assert.equal(result.ok, true);
  assert.equal(sheetCalled, true);
});
test("Sheets success cannot mask a CRM failure; replay keeps the same ID", async () => {
  const ids = [], copies = [], reports = [];
  for (let attempt = 0; attempt < 2; attempt++) {
    await assert.rejects(submitCheckout({ payload,
      submitCrm: async (body) => { ids.push(body.clientOrderId); throw new Error("offline"); },
      submitSheets: async (body) => { copies.push(body.clientOrderId); return { orderNumber: 123 }; },
      report: (code) => reports.push(code),
    }));
  }
  assert.equal(ids.length, 2);
  assert.equal(new Set(ids.concat(copies)).size, 1);
  assert.deepEqual(reports, ["order_not_confirmed", "order_not_confirmed"]);
});
test("Sheets throw/rejection never prevents CRM success and is reported without payload", async () => {
  const reports = [];
  assert.equal((await submitCheckout({ payload, submitSheets: () => { throw new Error("sheet failed"); }, submitCrm: async () => ({ ok: true }), report: (...r) => reports.push(r) })).ok, true);
  await tick();
  assert.deepEqual(reports, [["sheet_copy_failed", payload.clientOrderId]]);
});
test("public request has no CRM credentials and only a matching acknowledgement succeeds", async () => {
  const result = await sendCrmOrder("https://api.dvision.com.ua/order", payload, "synthetic-proof", async (_url, init) => {
    assert.equal(init.credentials, "omit");
    assert.equal(init.headers.Authorization, undefined);
    assert.equal(JSON.parse(init.body).challengeToken, "synthetic-proof");
    return Response.json({ ok: true, clientOrderId: payload.clientOrderId });
  });
  assert.equal(result.ok, true);
  for (const response of [Response.json({ ok: true, clientOrderId: "other" }), Response.json({ error: "unavailable" }, { status: 502 }), new Response("not JSON")])
    await assert.rejects(sendCrmOrder("https://api.dvision.com.ua/order", payload, "proof", async () => response));
});
