/** Standalone D·Vision Orders intake. This project is not bound to a spreadsheet. */
function doPost(e) {
  if (!directEnabled()) return json({ok:false,error:'intake_disabled'});
  let body;
  try { body=JSON.parse(e.postData.contents); } catch (_) { return json({ok:false,error:'invalid_payload'}); }
  if (!body || typeof body!=='object' || Array.isArray(body)) return json({ok:false,error:'invalid_payload'});
  return directPost(body);
}

function doGet() {
  return json({ok:true,version:'standalone-orders-v1',enabled:directEnabled()});
}

function norm(text) {
  return String(text).replace(/[ʼ’‘`']/g, "'").replace(/[–—−]/g, "-").replace(/\s+/g, " ").trim().toLowerCase();
}

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


function json(body) {
  return ContentService.createTextOutput(JSON.stringify(body)).setMimeType(ContentService.MimeType.JSON);
}
