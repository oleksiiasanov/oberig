/**
 * D·Vision SDR order intake → Google Sheets (CRM).
 * Bound to the CRM spreadsheet: Extensions → Apps Script → paste this file → Deploy as Web app.
 * Columns are found by header text (row 1), so extra CRM columns (status, notes…) are left alone.
 */

const SHEET_GID = 1570882665; // tab id from the sheet URL (#gid=…); 0/empty falls back to SHEET_NAME, then the first tab
const CONTACT_HEADER = "Контакт"; // checkbox column: manager ticks it after calling the customer → the row turns green
const PROCESSED_COLOR = "#b6d7a8";
const ORDER_NUMBER_HEADER = "№ замовлення"; // running order number: highest number already in the column + 1
const SHEET_NAME = ""; // optional tab name, used only when SHEET_GID is empty

// Header text in row 1 → how to fill it. Items are matched by product id (+ cable length in metres).
const COLUMNS = [
  { header: "Timestamp", value: () => new Date() },
  { header: "Імʼя", value: (o) => o.name, text: true },
  { header: "Номер", value: (o) => o.phone, text: true },
  { header: "Кількість детекторів", value: (o) => qty(o, "detector") },
  { header: "Коментар (опціонально)", match: (h) => h.startsWith("коментар"), value: (o) => o.comment || "", text: true },
  { header: "Виносна антена для авто, 2м", value: (o) => qty(o, "car-antenna") },
  { header: "Виносна антена для авто, 5м", value: (o) => qty(o, "car-antenna-amp", 5) },
  { header: "Виносна антена для авто, 10м", value: (o) => qty(o, "car-antenna-amp", 10) },
  { header: "Виносна антена для бліндажа, 14м", value: (o) => qty(o, "bunker-antenna", 14) },
  { header: "Виносна антена для бліндажа, 20м", value: (o) => qty(o, "bunker-antenna", 20) },
  { header: "Автомобільний тримач", value: (o) => qty(o, "car-holder") },
  { header: "Кріплення на бронежилет", value: (o) => qty(o, "molle-mount") },
  { header: "Антена 2.8 – 12 (більша)", value: (o) => qty(o, "antenna-high") },
  { header: "Антена 0.5 – 3 (менша)", value: (o) => qty(o, "antenna-low") },
  { header: "Разом", value: (o) => Number(o.total) || 0 },
];

function qty(order, id, length) {
  return order.items
    .filter((i) => i.id === id && (length === undefined || Number(i.cableLengthM) === length))
    .reduce((sum, i) => sum + Number(i.quantity || 0), 0) || "";
}

// Treat ʼ ’ ' (and – — -) and stray spaces as the same character so header typos don't break matching.
function norm(text) {
  return String(text).replace(/[ʼ’‘`']/g, "'").replace(/[–—−]/g, "-").replace(/\s+/g, " ").trim().toLowerCase();
}

function findSheet(book) {
  if (SHEET_GID) {
    const byId = book.getSheets().find((sheet) => sheet.getSheetId() === SHEET_GID);
    if (byId) return byId;
  }
  return SHEET_NAME ? book.getSheetByName(SHEET_NAME) : book.getSheets()[0];
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
    const sheet = findSheet(book);
    const columnCount = sheet.getLastColumn();
    const headers = sheet.getRange(1, 1, 1, columnCount).getValues()[0].map(norm);

    // Newest order goes right under the header row: insert a row and copy the look of the order below it.
    const row = 2;
    sheet.insertRowBefore(row);
    if (sheet.getLastRow() > row) {
      sheet.getRange(row + 1, 1, 1, columnCount).copyTo(sheet.getRange(row, 1, 1, columnCount), SpreadsheetApp.CopyPasteType.PASTE_FORMAT, false);
    }

    COLUMNS.forEach((col) => {
      const index = col.match ? headers.findIndex(col.match) : headers.indexOf(norm(col.header));
      if (index === -1) return;
      const cell = sheet.getRange(row, index + 1);
      if (col.text) cell.setNumberFormat("@"); // keeps "+380…" and "=…" as plain text
      cell.setValue(col.value(order));
    });

    const numberIndex = headers.indexOf(norm(ORDER_NUMBER_HEADER));
    const orderNumber = numberIndex !== -1 ? nextOrderNumber(sheet, numberIndex + 1) : "";
    if (orderNumber) sheet.getRange(row, numberIndex + 1).setValue(orderNumber);

    const contactIndex = headers.indexOf(norm(CONTACT_HEADER));
    if (contactIndex !== -1) {
      sheet.getRange(row, contactIndex + 1).insertCheckboxes(); // unchecked
      highlightProcessedRows(sheet, contactIndex + 1, columnCount);
    }

    try {
      notify(order, book.getUrl() + "#gid=" + sheet.getSheetId(), orderNumber);
    } catch (mailError) {
      console.error("Notification failed: " + mailError); // the order is already saved, don't fail it
    }

    return json({ ok: true });
  } catch (error) {
    return json({ ok: false, error: String(error) });
  } finally {
    lock.releaseLock();
  }
}

// Rows without a number (tests, blanks) are ignored; the freshly inserted row is still empty at this point.
function nextOrderNumber(sheet, column) {
  if (sheet.getLastRow() < 2) return 1;
  const numbers = sheet.getRange(2, column, sheet.getLastRow() - 1, 1).getValues()
    .map((cells) => Number(cells[0]))
    .filter((n) => n > 0);
  return numbers.length ? Math.max(...numbers) + 1 : 1;
}

// Recipients live in Script properties (Project Settings → Script properties → NOTIFY_EMAILS, comma-separated),
// so their addresses are not stored in the public repository.
function notify(order, sheetUrl, orderNumber) {
  const recipients = (PropertiesService.getScriptProperties().getProperty("NOTIFY_EMAILS") || "")
    .split(",")
    .map((email) => email.trim())
    .filter(Boolean);
  if (!recipients.length) return;

  const money = (n) => Number(n || 0).toLocaleString("uk-UA") + " грн";
  const lines = order.items.map((i) => {
    const length = i.cableLengthM ? ", " + i.cableLengthM + " м" : "";
    return "• " + i.name + length + " × " + i.quantity;
  });
  const body = [
    "Нове замовлення на dvision.com.ua",
    orderNumber ? "Номер замовлення: " + orderNumber : "",
    "",
    "Імʼя: " + order.name,
    "Телефон: " + order.phone,
    order.comment ? "Коментар: " + order.comment : "",
    "",
    "Замовлення:",
    ...lines,
    "",
    "Разом: " + money(order.total),
    "",
    "Таблиця: " + sheetUrl,
  ].join("\n");

  MailApp.sendEmail({
    to: recipients.join(","),
    subject: "Нове замовлення" + (orderNumber ? " №" + orderNumber : "") + " D·Vision SDR — " + order.name + " (" + money(order.total) + ")",
    body: body,
  });
}

// Run this once from the editor (select testNotify → Run): it asks for the email permission and sends a sample
// email, which is the quickest way to check NOTIFY_EMAILS and authorization. Not used by the website.
function testNotify() {
  const recipients = PropertiesService.getScriptProperties().getProperty("NOTIFY_EMAILS");
  console.log("NOTIFY_EMAILS = " + recipients);
  notify(
    { name: "ТЕСТ", phone: "+380000000000", comment: "Перевірка сповіщень", total: 1000, items: [{ name: "Тест", quantity: 1 }] },
    SpreadsheetApp.getActiveSpreadsheet().getUrl()
  );
}

// One conditional-format rule for the whole tab: a ticked "Контакт" box paints the entire row green.
// It is a rule (not a trigger), so it reacts instantly and also works for rows added by hand. Safe to call repeatedly.
function highlightProcessedRows(sheet, contactColumn, columnCount) {
  const formula = "=$" + sheet.getRange(1, contactColumn).getA1Notation().replace(/\d+/, "") + "2=TRUE";
  const isOurs = (rule) => {
    const condition = rule.getBooleanCondition();
    return condition && condition.getCriteriaType() === SpreadsheetApp.BooleanCriteria.CUSTOM_FORMULA &&
      condition.getCriteriaValues()[0] === formula;
  };
  const rules = sheet.getConditionalFormatRules().filter((rule) => !isOurs(rule));
  rules.push(
    SpreadsheetApp.newConditionalFormatRule()
      .whenFormulaSatisfied(formula)
      .setBackground(PROCESSED_COLOR)
      .setRanges([sheet.getRange(2, 1, Math.max(sheet.getMaxRows() - 1, 1), columnCount)])
      .build()
  );
  sheet.setConditionalFormatRules(rules);
}

// Optional: run once from the editor to set up the green highlight (and checkboxes for existing rows) without waiting for an order.
function setupProcessedRows() {
  const sheet = findSheet(SpreadsheetApp.getActiveSpreadsheet());
  const columnCount = sheet.getLastColumn();
  const index = sheet.getRange(1, 1, 1, columnCount).getValues()[0].map(norm).indexOf(norm(CONTACT_HEADER));
  if (index === -1) throw new Error('Column "' + CONTACT_HEADER + '" not found in row 1');
  if (sheet.getLastRow() > 1) sheet.getRange(2, index + 1, sheet.getLastRow() - 1, 1).insertCheckboxes();
  highlightProcessedRows(sheet, index + 1, columnCount);
}

// ── Tracking spreadsheet ("трекінг оплат і відправок") ──────────────────────────────────────────────────────────────
// Ticking "Контакт" on an order copies it to the tracking spreadsheet as a new row. Its address lives in Script
// properties (TRACKING_SHEET_URL = the tab's full URL, with #gid=…), so it is not stored in the public repository.
// Setup: add the property, then run installTrackingTrigger once from the editor and authorize.

// Tracking header (exact text, row 1) → value taken from the CRM row. Other tracking columns are left alone.
const TRACKING_COLUMNS = [
  { header: "№ замовлення", value: (get) => get(ORDER_NUMBER_HEADER) },
  { header: "Дата заявки", value: (get) => dateOnly(get("Timestamp")), format: "dd/mm/yy" },
  { header: "ПІБ", value: (get) => String(get("Імʼя")).trim(), format: "@" },
  { header: "Телефон", value: (get) => get("Номер"), format: "@" },
  { header: "Кількість детекторів", value: (get) => get("Кількість детекторів") },
  { header: "Додаткове обладнання", value: (get) => accessories(get), format: "@" },
  { header: "Сума замовлення", value: (get) => get("Разом") },
];
const ACCESSORY_HEADERS = [
  "Виносна антена для авто, 2м",
  "Виносна антена для авто, 5м",
  "Виносна антена для авто, 10м",
  "Виносна антена для бліндажа, 14м",
  "Виносна антена для бліндажа, 20м",
  "Автомобільний тримач",
  "Кріплення на бронежилет",
  "Антена 2.8 – 12 (більша)",
  "Антена 0.5 – 3 (менша)",
];

// One accessory per line, e.g. "Автомобільний тримач x2"; empty when the order has none.
function accessories(get) {
  return ACCESSORY_HEADERS.filter((header) => Number(get(header)) > 0)
    .map((header) => header + " x" + get(header))
    .join("\n");
}

function dateOnly(value) {
  return value instanceof Date ? new Date(value.getFullYear(), value.getMonth(), value.getDate()) : value;
}

function trackingValues(headers, row) {
  const get = (header) => {
    const index = headers.indexOf(norm(header));
    return index === -1 ? "" : row[index];
  };
  return TRACKING_COLUMNS.map((col) => ({ header: col.header, format: col.format, value: col.value(get) }));
}

// Installable onEdit trigger (a simple onEdit cannot open another spreadsheet). Unticking does nothing.
function syncContactedOrder(e) {
  const range = e && e.range;
  if (!range || range.getSheet().getSheetId() !== SHEET_GID) return;
  const sheet = range.getSheet();
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0].map(norm);
  const contactColumn = headers.indexOf(norm(CONTACT_HEADER)) + 1;
  if (!contactColumn || range.getColumn() > contactColumn || range.getLastColumn() < contactColumn) return;

  const first = Math.max(range.getRow(), 2);
  const count = range.getLastRow() - first + 1;
  if (count < 1) return;
  sheet.getRange(first, 1, count, headers.length).getValues().forEach((row) => {
    if (row[contactColumn - 1] === true) appendToTracking(trackingValues(headers, row));
  });
}

function trackingSheet() {
  const url = PropertiesService.getScriptProperties().getProperty("TRACKING_SHEET_URL");
  if (!url) throw new Error("Script property TRACKING_SHEET_URL is not set");
  const gid = Number((url.match(/[#&?]gid=(\d+)/) || [])[1]);
  const sheets = SpreadsheetApp.openByUrl(url).getSheets();
  return sheets.find((sheet) => sheet.getSheetId() === gid) || sheets[0];
}

// Adds the order below the last row, unless its number is already there.
function appendToTracking(values) {
  const number = values[0].value;
  if (number === "" || number === null) return;

  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    const sheet = trackingSheet();
    const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0].map((header) => String(header).trim());
    const numberColumn = headers.indexOf(values[0].header) + 1;
    if (!numberColumn) throw new Error('Column "' + values[0].header + '" not found in the tracking sheet');

    const lastRow = sheet.getLastRow();
    const known = lastRow > 1 ? sheet.getRange(2, numberColumn, lastRow - 1, 1).getValues() : [];
    if (known.some((cells) => String(cells[0]) === String(number))) return;

    values.forEach((item) => {
      const column = headers.indexOf(item.header) + 1; // first match: "Дата заявки", not the later "дата заявки"
      if (!column) return;
      const cell = sheet.getRange(lastRow + 1, column);
      if (item.format) cell.setNumberFormat(item.format);
      cell.setValue(item.value);
    });
  } finally {
    lock.releaseLock();
  }
}

// Run once from the editor: asks for the permission to edit the tracking spreadsheet and installs the trigger.
function installTrackingTrigger() {
  trackingSheet(); // fails early if the property is missing or the spreadsheet is not accessible
  ScriptApp.getProjectTriggers()
    .filter((trigger) => trigger.getHandlerFunction() === "syncContactedOrder")
    .forEach((trigger) => ScriptApp.deleteTrigger(trigger));
  ScriptApp.newTrigger("syncContactedOrder").forSpreadsheet(SpreadsheetApp.getActiveSpreadsheet()).onEdit().create();
}

// Writes nothing: logs what ticking "Контакт" on the newest order (row 2) would send to the tracking spreadsheet.
function previewTrackingRow() {
  const sheet = findSheet(SpreadsheetApp.getActiveSpreadsheet());
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0].map(norm);
  const row = sheet.getRange(2, 1, 1, headers.length).getValues()[0];
  trackingValues(headers, row).forEach((item) => console.log(item.header + ": " + item.value));
}

function json(body) {
  return ContentService.createTextOutput(JSON.stringify(body)).setMimeType(ContentService.MimeType.JSON);
}
