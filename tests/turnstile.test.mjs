import test from "node:test";
import assert from "node:assert/strict";
import { createChallenge } from "../src/lib/turnstile.js";
const tick = () => new Promise((resolve) => setImmediate(resolve));
test("transient script load failure can recover on the next checkout click", async () => {
  let loads = 0, callbacks, executions = 0, removed = 0;
  const api = {
    render: (_el, options) => { callbacks = options; return "widget"; }, reset: () => {},
    execute: () => { callbacks.callback(`fresh-${++executions}`); }, remove: () => { removed++; },
  };
  const challenge = createChallenge({}, "public-key", async () => { if (++loads === 1) throw new Error("offline"); return api; });
  await tick();
  assert.equal(await challenge.execute(), "fresh-1");
  assert.equal(await challenge.execute(), "fresh-2");
  assert.equal(loads, 2);
  assert.equal(callbacks.action, "checkout");
  challenge.dispose();
  assert.equal(removed, 1);
  await assert.rejects(challenge.execute());
});
test("unmount rejects an in-progress challenge instead of leaving checkout waiting", async () => {
  const challenge = createChallenge({}, "public-key", async () => ({ render: () => "widget", reset() {}, execute() {}, remove() {} }));
  const promise = challenge.execute();
  await tick();
  challenge.dispose();
  await assert.rejects(promise, /cancelled/);
});
