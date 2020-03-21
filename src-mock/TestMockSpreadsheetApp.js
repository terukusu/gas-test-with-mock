var SpreadsheetApp = require('./MockSpreadsheetApp');

function gastTestRunner(test) {
  SpreadsheetApp.mockClear();

  test('テスト:[mock]スプレッドシートクリア', function (t) {
    var spreadsheetCount;
    spreadsheetCount = Object.keys(SpreadsheetApp.mockGetSpreadsheets()).length;
    t.equal(spreadsheetCount, 0, "最初は、管理対象のスプレッドシートの数が0になっていること");

    SpreadsheetApp.mockCreateWithIdAndName('asdf', 'モック1');
    spreadsheetCount = Object.keys(SpreadsheetApp.mockGetSpreadsheets()).length;
    t.equal(spreadsheetCount, 1, "一つ作成され、管理対象のスプレッドシートの数が1になっていること");

    SpreadsheetApp.mockClear();
    spreadsheetCount = Object.keys(SpreadsheetApp.mockGetSpreadsheets()).length;
    t.equal(spreadsheetCount, 0, "クリアされて、管理対象のスプレッドシートの数が0になっていること");

    SpreadsheetApp.mockClear();
  });

  test('テスト:[mock]スプレッドシート生成', function (t) {
    SpreadsheetApp.mockCreateWithIdAndName('1VjIdgtMlA32tIlxiQm810S-g1hSWgcrQnG8ueAEu0bM', 'モック2');
    var spreadsheet = SpreadsheetApp.openById('1VjIdgtMlA32tIlxiQm810S-g1hSWgcrQnG8ueAEu0bM');
    t.notEqual(spreadsheet, null, "指定したIDで何らかのスプレッドシートが取得できること");
    t.equal(spreadsheet.getId(), '1VjIdgtMlA32tIlxiQm810S-g1hSWgcrQnG8ueAEu0bM', "スプレッドシートのIDが指定したものと一致していること");

    SpreadsheetApp.mockClear();
  });
}

module.exports.gastTestRunner = gastTestRunner;
