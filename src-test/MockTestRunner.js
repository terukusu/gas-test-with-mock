var GasTap = require('./GasTap');
var Environment = require('./Environment');
var MockTestSpreadsheetDataStorage = require('./MockTestSpreadsheetDataStorage');

// モック
var MockUtilities = require('../src-mock/MockUtilities');
var MockLogger = require('../src-mock/MockLogger');
var MockSpreadsheetApp = require('../src-mock/MockSpreadsheetApp');
// var MockUrlFetchApp = require('../src-mock/MockUrlFetchApp');
var MockUrlFetchAppFake = require('../src-mock/MockUrlFetchAppFake');

global.gastTestRunner = function() {
  // グローバルスコープへのオブジェクト設定
  if (!Environment.isGoogleAppsScriptServer()) {
    // 非GAS環境なのでMockをセットアップ
    Utilities = MockUtilities;
    Logger = MockLogger;
    SpreadsheetApp = MockSpreadsheetApp;
    UrlFetchApp = MockUrlFetchAppFake;
  }

  var test = new GasTap();

  MockTestSpreadsheetDataStorage.gastTestRunner(test);

  test.finish()
};
