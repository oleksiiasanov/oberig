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
const SOURCE_HEADER = "Опитування"; // "where did you hear about us" answer from the thank-you screen; added as the last column if missing
const CLIENT_ORDER_ID_HEADER = "clientOrderId"; // set by the website cart; an id already in this column is not added again

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
  { header: CLIENT_ORDER_ID_HEADER, value: (o) => o.clientOrderId || "", text: true },
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
    if (order && order.type === "survey") {
      lock.waitLock(20000);
      return json(saveSurvey(findSheet(SpreadsheetApp.getActiveSpreadsheet()), order));
    }
    if (!order || !String(order.name || "").trim() || !String(order.phone || "").trim() || !Array.isArray(order.items) || !order.items.length) {
      return json({ ok: false, error: "invalid order" });
    }

    lock.waitLock(20000);
    const book = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = findSheet(book);
    const columnCount = sheet.getLastColumn();
    const headers = sheet.getRange(1, 1, 1, columnCount).getValues()[0].map(norm);

    // A resent order (retry after a timeout) is already saved: answer ok without a second row or email.
    const idIndex = headers.indexOf(norm(CLIENT_ORDER_ID_HEADER));
    if (order.clientOrderId && idIndex !== -1 && sheet.getLastRow() > 1) {
      const ids = sheet.getRange(2, idIndex + 1, sheet.getLastRow() - 1, 1).getValues();
      const found = ids.findIndex((cells) => String(cells[0]) === String(order.clientOrderId));
      if (found !== -1) {
        const savedNumberIndex = headers.indexOf(norm(ORDER_NUMBER_HEADER));
        const savedNumber = savedNumberIndex !== -1 ? sheet.getRange(found + 2, savedNumberIndex + 1).getValue() : "";
        return json({ ok: true, duplicate: true, orderNumber: savedNumber }); // the survey still finds the row
      }
    }

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

    return json({ ok: true, orderNumber: orderNumber });
  } catch (error) {
    return json({ ok: false, error: String(error) });
  } finally {
    lock.releaseLock();
  }
}

// Writes the survey answer into the order's row: matched by order number and phone (so nobody can fill in someone
// else's row); without an order number column, the newest row with that phone.
function saveSurvey(sheet, answer) {
  const source = String(answer.source || "").trim().slice(0, 300);
  const phone = String(answer.phone || "").replace(/\D/g, "");
  if (!source || !phone || sheet.getLastRow() < 2) return { ok: false, error: "invalid survey" };

  let headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0].map(norm);
  let sourceIndex = headers.indexOf(norm(SOURCE_HEADER));
  if (sourceIndex === -1) {
    sourceIndex = headers.length;
    if (sheet.getMaxColumns() <= sourceIndex) sheet.insertColumnsAfter(sheet.getMaxColumns(), 1); // tab has no spare column
    sheet.getRange(1, sourceIndex + 1).setValue(SOURCE_HEADER);
    headers = headers.concat(norm(SOURCE_HEADER));
  }
  const phoneIndex = headers.indexOf(norm("Номер"));
  const numberIndex = headers.indexOf(norm(ORDER_NUMBER_HEADER));
  if (phoneIndex === -1) return { ok: false, error: "phone column not found" };

  const rows = sheet.getRange(2, 1, sheet.getLastRow() - 1, headers.length).getValues();
  const rowIndex = rows.findIndex((row) =>
    String(row[phoneIndex]).replace(/\D/g, "") === phone &&
    (numberIndex === -1 || !answer.orderNumber || String(row[numberIndex]) === String(answer.orderNumber))
  );
  if (rowIndex === -1) return { ok: false, error: "order not found" };

  const cell = sheet.getRange(rowIndex + 2, sourceIndex + 1);
  cell.clearDataValidations(); // rows copy the format of the row below, which can bring a "Контакт"-style checkbox along
  cell.setNumberFormat("@");
  cell.setValue(source);

  // The order may already be in the tracking spreadsheet if "Контакт" was ticked before the customer answered.
  const orderNumber = numberIndex === -1 ? "" : rows[rowIndex][numberIndex];
  try {
    if (orderNumber !== "") updateTrackingSource(orderNumber, source);
  } catch (trackingError) {
    console.error("Tracking update failed: " + trackingError); // the answer is already saved, don't fail it
  }
  return { ok: true };
}

// Fills "Звідки дізнались" for an order that is already in the tracking spreadsheet; does nothing otherwise.
// Called inside doPost's lock.
function updateTrackingSource(orderNumber, source) {
  const sheet = trackingSheet();
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0].map((header) => String(header).trim());
  const numberColumn = headers.indexOf(ORDER_NUMBER_HEADER) + 1;
  const sourceColumn = headers.indexOf(TRACKING_SOURCE_HEADER) + 1;
  if (!numberColumn || !sourceColumn || sheet.getLastRow() < 2) return;
  const numbers = sheet.getRange(2, numberColumn, sheet.getLastRow() - 1, 1).getValues();
  const index = numbers.findIndex((cells) => String(cells[0]) === String(orderNumber));
  if (index === -1) return;
  sheet.getRange(index + 2, sourceColumn).setNumberFormat("@").setValue(source);
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

const TRACKING_SOURCE_HEADER = "Опитування"; // survey answer, copied from SOURCE_HEADER in the CRM sheet

// Tracking header (exact text, row 1) → value taken from the CRM row. Other tracking columns are left alone.
const TRACKING_COLUMNS = [
  { header: "№ замовлення", value: (get) => get(ORDER_NUMBER_HEADER) },
  { header: "Дата заявки", value: (get) => dateOnly(get("Timestamp")), format: "dd/mm/yy" },
  { header: "ПІБ", value: (get) => String(get("Імʼя")).trim(), format: "@" },
  { header: "Телефон", value: (get) => get("Номер"), format: "@" },
  { header: "Кількість детекторів", value: (get) => get("Кількість детекторів") },
  { header: "Додаткове обладнання", value: (get) => accessories(get), format: "@" },
  { header: "Сума замовлення", value: (get) => get("Разом") },
  { header: TRACKING_SOURCE_HEADER, value: (get) => (get(SOURCE_HEADER) === false ? "" : String(get(SOURCE_HEADER))), format: "@" }, // false: empty checkbox
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

// Midday, so the tracking sheet shows the same day even when its time zone differs from the script's.
function dateOnly(value) {
  return value instanceof Date ? new Date(value.getFullYear(), value.getMonth(), value.getDate(), 12) : value;
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
      const column = headers.indexOf(item.header) + 1; // exact header: "Дата заявки", not "Стара дата заявки"
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

// ── Order statuses in the tracking spreadsheet ──────────────────────────────────────────────────────────────────────
// setupTrackingStatuses (run once from the editor) adds three dropdown columns right after "Додаткове обладнання" and
// fills them for existing orders. Safe to run again: the columns are added only once and filled cells are not changed.
// previewTrackingStatuses writes nothing and logs what setupTrackingStatuses would do.

const STATUS_AFTER_HEADER = "Додаткове обладнання";
const STATUS_COLUMNS = [
  // renamed: old option → new one; filled cells with the old text are switched over on the next setupTrackingStatuses run.
  { header: "Статус", options: ["Підтверджено", "Готове", "Оплата", "Очікується відправка", "Відправлено", "Отримано", "Скасовано"], renamed: { "Очікується оплата": "Оплата" } },
  { header: "Статус оплати", options: ["Очікується оплата", "Оплачено", "Відтерміновано"] },
  { header: "Передплата", options: ["Очікується передплата", "Передплата зроблена"] },
];

function setupTrackingStatuses() {
  applyTrackingStatuses(true);
}

function previewTrackingStatuses() {
  applyTrackingStatuses(false);
}

function applyTrackingStatuses(write) {
  const sheet = trackingSheet();
  const readHeaders = () => sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0].map((header) => String(header).trim());
  let headers = readHeaders();
  const after = headers.indexOf(STATUS_AFTER_HEADER) + 1;
  if (!after) throw new Error('Column "' + STATUS_AFTER_HEADER + '" not found in the tracking sheet');
  const first = after + 1; // column of "Статус"
  const hasColumns = STATUS_COLUMNS.every((col, i) => headers[first - 1 + i] === col.header);

  if (!hasColumns && write) {
    sheet.insertColumnsAfter(after, STATUS_COLUMNS.length); // takes the formatting of "Додаткове обладнання"
    sheet.getRange(1, first, 1, STATUS_COLUMNS.length).setValues([STATUS_COLUMNS.map((col) => col.header)]);
    headers = readHeaders();
  }

  // The new "Передплата" (status) sits before the existing "Передплата" (amount), so source columns are looked up
  // outside the status block.
  const inBlock = (index) => (hasColumns || write) && index >= first - 1 && index < first - 1 + STATUS_COLUMNS.length;
  const column = (header) => headers.findIndex((h, index) => h === header && !inBlock(index));
  const shippedIndex = column("Відправлено");
  const prepaidIndex = column("Сума передплати") !== -1 ? column("Сума передплати") : column("Передплата"); // amount column, renamed later
  const numberIndex = column(ORDER_NUMBER_HEADER);
  const nameIndex = column("ПІБ");
  if (shippedIndex === -1 || prepaidIndex === -1) throw new Error('Columns "Відправлено" and "Сума передплати" are required');

  const rowCount = sheet.getLastRow() - 1;
  if (rowCount < 1) return;
  const width = headers.length;
  const range = sheet.getRange(2, 1, rowCount, width);
  const values = range.getValues();
  const backgrounds = range.getBackgrounds();
  const sourceIndexes = headers.map((h, index) => index).filter((index) => !inBlock(index));
  const filled = (row, i) => (hasColumns || write ? String(row[first - 1 + i]).trim() : "");
  const current = (row, i) => {
    const value = filled(row, i);
    return (STATUS_COLUMNS[i].renamed || {})[value] || value;
  };

  const status = [], payment = [], prepaid = [];
  const counts = { cancelled: 0, shipped: 0, prepaid: 0, renamed: 0 };
  const cancelledAndShipped = [], prepaidText = [];
  values.forEach((row, r) => {
    counts.renamed += STATUS_COLUMNS.filter((col, i) => current(row, i) !== filled(row, i)).length;
    const label = "рядок " + (r + 2) + (numberIndex !== -1 && row[numberIndex] !== "" ? " (№ " + row[numberIndex] + ")" : "");
    const isOrder = (numberIndex !== -1 && row[numberIndex] !== "") || (nameIndex !== -1 && String(row[nameIndex]).trim() !== "");
    const orangeCells = sourceIndexes.filter((index) => isOrange(backgrounds[r][index])).length;
    const cancelled = isOrder && orangeCells * 2 >= sourceIndexes.length;
    const shipped = isOrder && typeof row[shippedIndex] === "number";
    const paid = isOrder && typeof row[prepaidIndex] === "number";
    if (cancelled && shipped) cancelledAndShipped.push(label);
    if (isOrder && !paid && String(row[prepaidIndex]).trim() !== "") prepaidText.push(label);

    // Cancelled wins over shipped: an orange row is a cancelled order even if it has a shipped quantity.
    const nextStatus = current(row, 0) || (cancelled ? "Скасовано" : shipped ? "Відправлено" : "");
    const nextPrepaid = current(row, 2) || (paid ? "Передплата зроблена" : "");
    if (!current(row, 0) && nextStatus) counts[cancelled ? "cancelled" : "shipped"] += 1;
    if (!current(row, 2) && nextPrepaid) counts.prepaid += 1;
    status.push([nextStatus]);
    payment.push([current(row, 1)]);
    prepaid.push([nextPrepaid]);
  });

  console.log("Аркуш: " + sheet.getName() + (hasColumns ? " (колонки статусів уже є)" : write ? " (додано колонки статусів)" : " (колонки статусів буде додано)"));
  console.log("Статус «Скасовано»: " + counts.cancelled + ", «Відправлено»: " + counts.shipped + ", «Передплата зроблена»: " + counts.prepaid);
  if (counts.renamed) console.log("Перейменовано старих значень: " + counts.renamed);
  if (cancelledAndShipped.length) console.log("Помаранчеві, але з кількістю у «Відправлено» (поставлено «Скасовано»): " + cancelledAndShipped.join(", "));
  if (prepaidText.length) console.log("У «Передплата» текст замість суми (статус не поставлено): " + prepaidText.join(", "));
  if (!write) return;

  // Dropdowns first, so renamed options are accepted; then only the cells that change, so edits made meanwhile are kept.
  STATUS_COLUMNS.forEach((col, i) => {
    const rule = SpreadsheetApp.newDataValidation().requireValueInList(col.options, true).setAllowInvalid(false).build();
    sheet.getRange(2, first + i, sheet.getMaxRows() - 1, 1).setDataValidation(rule);
  });
  [status, payment, prepaid].forEach((columnValues, i) => columnValues.forEach(([value], r) => {
    if (value !== filled(values[r], i)) sheet.getRange(r + 2, first + i).setValue(value);
  }));
}

// Any shade of the orange column in the Sheets palette (#fce5cd … #783f04, #ff9900); yellow and red are not orange.
function isOrange(color) {
  const hex = String(color || "").replace("#", "");
  if (!/^[0-9a-f]{6}$/i.test(hex)) return false;
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  if (max - min < 0.08 || max !== r) return false;
  const hue = 60 * ((g - b) / (max - min));
  return hue >= 15 && hue <= 40;
}

// ── Order dates in the tracking spreadsheet ─────────────────────────────────────────────────────────────────────────
// "Дата заявки" is the order date. fillOrderDates (run from the editor) fills its empty cells from "Стара дата заявки"
// ("14,06,2026", "14.06.2026" or a date), shown as dd/mm/yy like the rest of the column. Filled cells are not changed.
// previewOrderDates writes nothing and logs what fillOrderDates would do.

const ORDER_DATE_HEADER = "Дата заявки";
const OLD_ORDER_DATE_HEADER = "Стара дата заявки";
const ORDER_DATE_FORMAT = "dd/mm/yy";

function fillOrderDates() {
  applyOrderDates(true);
}

function previewOrderDates() {
  applyOrderDates(false);
}

function applyOrderDates(write) {
  const sheet = trackingSheet();
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0].map((header) => String(header).trim());
  const dateColumn = headers.indexOf(ORDER_DATE_HEADER) + 1;
  const oldIndex = headers.indexOf(OLD_ORDER_DATE_HEADER);
  const numberIndex = headers.indexOf(ORDER_NUMBER_HEADER);
  const nameIndex = headers.indexOf("ПІБ");
  if (!dateColumn || oldIndex === -1) throw new Error('Columns "' + ORDER_DATE_HEADER + '" and "' + OLD_ORDER_DATE_HEADER + '" are required');

  const rowCount = sheet.getLastRow() - 1;
  if (rowCount < 1) return;
  const values = sheet.getRange(2, 1, rowCount, headers.length).getValues();
  const filled = [], noDate = [], unreadable = [];
  values.forEach((row, r) => {
    const isOrder = (numberIndex !== -1 && row[numberIndex] !== "") || (nameIndex !== -1 && String(row[nameIndex]).trim() !== "");
    const old = row[oldIndex];
    const date = parseOrderDate(old);
    // The first run wrote midnight in the script's time zone, which the sheet shows a day early: those cells are redone.
    const shifted = date && row[dateColumn - 1] instanceof Date && row[dateColumn - 1].getTime() === midnight(date).getTime();
    if (!isOrder || (row[dateColumn - 1] !== "" && !shifted)) return;
    const label = "рядок " + (r + 2) + (numberIndex !== -1 && row[numberIndex] !== "" ? " (№ " + row[numberIndex] + ")" : "");
    if (old === "") return noDate.push(label);
    if (!date) return unreadable.push(label + ": " + old);
    filled.push(label);
    if (write) sheet.getRange(r + 2, dateColumn).setNumberFormat(ORDER_DATE_FORMAT).setValue(date);
  });

  console.log("Часовий пояс скрипта: " + Session.getScriptTimeZone() + ", таблиці: " + sheet.getParent().getSpreadsheetTimeZone());
  console.log((write ? "Заповнено" : "Буде заповнено") + " «" + ORDER_DATE_HEADER + "» зі старої дати: " + filled.length);
  if (noDate.length) console.log("Немає жодної дати (залишено порожнім): " + noDate.join(", "));
  if (unreadable.length) console.log("Не вдалося прочитати стару дату (залишено порожнім): " + unreadable.join(", "));
}

// Date cells are used as they are; text like "14,06,2026", "14.06.26" or "14/06/2026" is read as day, month, year.
// The result is midday, so the sheet shows the same day even when its time zone differs from the script's.
function parseOrderDate(value) {
  if (value instanceof Date) return new Date(value.getFullYear(), value.getMonth(), value.getDate(), 12);
  const match = String(value).trim().match(/^(\d{1,2})[.,\/](\d{1,2})[.,\/](\d{2}|\d{4})$/);
  if (!match) return null;
  const [day, month] = [Number(match[1]), Number(match[2])];
  const year = match[3].length === 2 ? 2000 + Number(match[3]) : Number(match[3]);
  const date = new Date(year, month - 1, day, 12);
  return date.getDate() === day && date.getMonth() === month - 1 ? date : null;
}

function midnight(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function json(body) {
  return ContentService.createTextOutput(JSON.stringify(body)).setMimeType(ContentService.MimeType.JSON);
}
