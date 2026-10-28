import test from 'node:test';
import assert from 'node:assert/strict';
import {validateOrderWebhook} from '../src/lib/order-endpoint.js';
test('production checkout requires a standalone deployment and rejects retired or malformed endpoints',()=>{
  assert.doesNotThrow(()=>validateOrderWebhook('https://script.google.com/macros/s/NEW_SYNTHETIC_DEPLOYMENT/exec',true));
  assert.doesNotThrow(()=>validateOrderWebhook('',false));
  for(const url of ['', 'https://evil.test/exec', 'https://script.google.com/macros/s/test/dev',
    'https://script.google.com/macros/s/test/exec?extra=1',
    'https://script.google.com/macros/s/AKfycbzOeaAX0HWsMI0JMJ5WsO-ZmGUmTlhuAQJZl7ItiLaCBmQjiYtA1DGtiZhOr4tbDzuf/exec'])
    assert.throws(()=>validateOrderWebhook(url,true));
});
