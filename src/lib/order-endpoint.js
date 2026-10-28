// The old primary-sheet deployment is deliberately retired at direct cutover.
const RETIRED_DEPLOYMENT = 'AKfycbzOeaAX0HWsMI0JMJ5WsO-ZmGUmTlhuAQJZl7ItiLaCBmQjiYtA1DGtiZhOr4tbDzuf';
export function validateOrderWebhook(value, required = false) {
  if (!value && !required) return;
  let url;
  try { url = new URL(value); } catch { throw new Error('Configure the new standalone Orders webhook URL'); }
  if (url.origin !== 'https://script.google.com' || !/^\/macros\/s\/[\w-]+\/exec$/.test(url.pathname) || url.search || url.hash ||
      url.pathname.includes(RETIRED_DEPLOYMENT)) throw new Error('Configure the new standalone Orders webhook URL');
}
