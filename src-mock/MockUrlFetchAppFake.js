/**
 * 通信は行わず予め設定された関数で通信のレスポンスを模した任意のデータを返します。
 * fetch毎にfetchHandlersに設定されているハンドラが順番に呼び出されます。
 * UrlFetchApp の Fake.
 */

var MockHttpResponse = require('./MockHttpResponse');

// フェッチハンドラ (url, params) => {} 型の関数のリスト
var fetchHandlers = [];

var currentFetchHandlerIndex = 0;

function fetch(url, params) {
  if (currentFetchHandlerIndex >= fetchHandlers.length) {
    throw new Error('there\'s no enough fetchHandlers. current call is ' + (currentFetchHandlerIndex + 1) + 'th call. but  fetchHandlers.length=' + fetchHandlers.length );
  }

  var handler = fetchHandlers[currentFetchHandlerIndex++];
  return handler(url, params);
}

function mockAddFetchHandler(handler) {
  fetchHandlers.push(handler);
}

function mockRemoveAllFetchHandler() {
  fetchHandlers = [];
  currentFetchHandlerIndex = 0;
}

module.exports = {
  fetch: fetch,
  mockAddFetchHandler: mockAddFetchHandler,
  mockRemoveAllFetchHandler: mockRemoveAllFetchHandler,
}
