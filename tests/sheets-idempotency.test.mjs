import test from "node:test";
import assert from "node:assert/strict";
import vm from "node:vm";
import { readFileSync } from "node:fs";

test("Apps Script adds the ID column, deduplicates retries and attaches surveys to the right ID", () => {
  const rows = [["Timestamp", "№ замовлення", "Імʼя", "Номер", "Кількість детекторів", "Разом"]];
  let locks = 0;
  const sheet = {
    getSheetId: () => 1570882665, getLastColumn: () => rows[0].length,
    getLastRow: () => rows.length, getMaxColumns: () => rows[0].length,
    insertColumnsAfter: (_col, n) => rows.forEach((r) => r.push(...Array(n).fill(""))),
    insertRowBefore: (row) => rows.splice(row - 1, 0, Array(rows[0].length).fill("")),
    getRange: (row, col, height = 1, width = 1) => {
      const range = {
        getValues: () => rows.slice(row - 1, row - 1 + height).map((r) => r.slice(col - 1, col - 1 + width)),
        getValue: () => rows[row - 1][col - 1],
        setValue: (v) => { rows[row - 1][col - 1] = v; return range; },
        setNumberFormat: () => range, clearDataValidations: () => range, copyTo: () => range,
      }; return range;
    },
  };
  const book = { getSheets: () => [sheet], getUrl: () => "https://example.test/synthetic" };
  const context = vm.createContext({ console: { error() {}, log() {} },
    LockService: { getScriptLock: () => ({ waitLock: () => { locks++; }, releaseLock: () => {} }) },
    SpreadsheetApp: { getActiveSpreadsheet: () => book, CopyPasteType: { PASTE_FORMAT: "format" } },
    PropertiesService: { getScriptProperties: () => ({ getProperty: () => "" }) },
    ContentService: { MimeType: { JSON: "json" }, createTextOutput: (text) => ({ setMimeType: () => text }) },
  });
  vm.runInContext(readFileSync(new URL("../crm/Code.gs", import.meta.url), "utf8"), context);
  const post = (body) => JSON.parse(context.doPost({ postData: { contents: JSON.stringify(body) } }));
  const body = { clientOrderId: "11111111-1111-4111-8111-111111111111", name: "Synthetic", phone: "+380501234567", items: [{ id: "detector", quantity: 1000 }], total: 24000000 };
  const first = post(body);
  assert.equal(first.ok, true);
  assert.equal(rows[0].filter((s) => s === "clientOrderId").length, 1);
  assert.equal(rows[1][rows[0].indexOf("Кількість детекторів")], 1000);
  assert.equal(post(body).duplicate, true);
  assert.equal(rows.length, 2);
  const newer = post({ ...body, clientOrderId: "22222222-2222-4222-8222-222222222222" });
  assert.equal(newer.ok, true);
  assert.equal(post({ type: "survey", clientOrderId: body.clientOrderId, phone: body.phone, source: "Synthetic source" }).ok, true);
  const sourceColumn = rows[0].indexOf("Опитування");
  assert.equal(rows[2][sourceColumn], "Synthetic source");
  assert.notEqual(rows[1][sourceColumn], "Synthetic source");
  assert.ok(locks >= 4);
});
