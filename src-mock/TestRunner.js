var GasTap = require('../src-test/GasTap');
var TestMockCell = require('./TestMockCell');
var TestMockRange = require('./TestMockRange');
var TestMockSheet = require('./TestMockSheet');
var TestMockSpreadsheet = require('./TestMockSpreadsheet');
var TestMockSpreadsheetApp = require('./TestMockSpreadsheetApp');
var TestMockUtilities = require('./TestMockUtilities');
var TestMockHttpResponse = require('./TestMockHttpResponse');
var TestMockUrlFetchApp = require('./TestMockUrlFetchApp');
var MockUtilities = require('./MockUtilities');
var MockLogger = require('./MockLogger');

global.gastTestRunner = function() {
  // グローバルスコープへのオブジェクト設定
  if (typeof(Utilities) === 'undefined' ||  Utilities.formatString === undefined) {
    // 非GAS環境なのでMockをセットアップ
    // GasTapがこれらに依存しているので
    Utilities = MockUtilities;
    Logger = MockLogger;
  }

  var test = new GasTap();

  TestMockCell.gastTestRunner(test);
  TestMockRange.gastTestRunner(test);
  TestMockSheet.gastTestRunner(test);
  TestMockSpreadsheet.gastTestRunner(test);
  TestMockSpreadsheetApp.gastTestRunner(test);
  TestMockUtilities.gastTestRunner(test);
  TestMockHttpResponse.gastTestRunner(test);
  TestMockUrlFetchApp.gastTestRunner(test);

  test.finish();
};
