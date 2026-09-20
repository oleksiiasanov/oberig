/**
 * D·Vision SDR order intake → Google Sheets (CRM).
 * Bound to the CRM spreadsheet: Extensions → Apps Script → paste this file → Deploy as Web app.
 * Columns are found by header text (row 1), so extra CRM columns (status, notes…) are left alone.
 */

const SHEET_NAME = ""; // leave empty to use the first sheet, or set the tab name

// Header text in row 1 → how to fill it. Items are matched by product id (+ cable length in metres).
const COLUMNS = [
  { header: "Timestamp", value: () => new Date() },
  { header: "Імʼя", value: (o) => o.name, text: true },
  { header: "Номер", value: (o) => o.phone, text: true },
  { header: "Кількість детекторів", value: (o) => qty(o, "detector") },
  { header: "Коментар (опціонально)", match: (h) => h.startsWith("коментар"), value: (o) => o.comment || "", text: true },
  { header: "Виносна антена для авто, 2м", value: (o) => qty(o, "car-antenna", 2) },
  { header: "Виносна антена для авто, 5м", value: (o) => qty(o, "car-antenna", 5) },
  { header: "Виносна антена для авто, 10м", value: (o) => qty(o, "car-antenna", 10) },
  { header: "Виносна антена для бліндажа, 14м", value: (o) => qty(o, "bunker-antenna", 14) },
  { header: "Виносна антена для бліндажа, 20м", value: (o) => qty(o, "bunker-antenna", 20) },
  { header: "Автомобільний тримач", value: (o) => qty(o, "car-holder") },
  { header: "Разом", value: (o) => Number(o.total) || 0 },
];

function qty(order, id, length) {
  return order.items
    .filter((i) => i.id === id && (length === undefined || Number(i.cableLengthM) === length))
    .reduce((sum, i) => sum + Number(i.quantity || 0), 0) || "";
}

// Treat ʼ ’ ' and stray spaces as the same character so header typos don't break matching.
function norm(text) {
  return String(text).replace(/[ʼ’‘`']/g, "'").replace(/\s+/g, " ").trim().toLowerCase();
}

function doPost(e) {
  const lock = LockService.getScriptLock();
  try {
    const order = JSON.parse(e.postData.contents);
    if (!order || !String(order.name || "").trim() || !String(order.phone || "").trim() || !Array.isArray(order.items) || !order.items.length) {
      return json({ ok: false, error: "invalid order" });
    }

    lock.waitLock(20000);
    const book = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = SHEET_NAME ? book.getSheetByName(SHEET_NAME) : book.getSheets()[0];
    const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0].map(norm);
    const row = sheet.getLastRow() + 1;

    COLUMNS.forEach((col) => {
      const index = col.match ? headers.findIndex(col.match) : headers.indexOf(norm(col.header));
      if (index === -1) return;
      const cell = sheet.getRange(row, index + 1);
      if (col.text) cell.setNumberFormat("@"); // keeps "+380…" and "=…" as plain text
      cell.setValue(col.value(order));
    });

    return json({ ok: true });
  } catch (error) {
    return json({ ok: false, error: String(error) });
  } finally {
    lock.releaseLock();
  }
}

function json(body) {
  return ContentService.createTextOutput(JSON.stringify(body)).setMimeType(ContentService.MimeType.JSON);
}
