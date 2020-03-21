var GasTap = require('./GasTap');
var Environment = require('./Environment');
var RealTestSpreadsheetDataStorage = require('./RealTestSpreadsheetDataStorage');

global.gastTestRunner = function() {
  // グローバルスコープへのオブジェクト設定
  if (!Environment.isGoogleAppsScriptServer()) {
    // // ↓ローカルで試験的に動かす時は以下をコメントアウトしてモックを利用する
    //
    // // モック
    // var MockUtilities = require('../src-mock/MockUtilities');
    // var MockLogger = require('../src-mock/MockLogger');
    // var MockSpreadsheetApp = require('../src-mock/MockSpreadsheetApp');
    // var MockUrlFetchApp = require('../src-mock/MockUrlFetchApp');
    // var MockUrlFetchAppFake = require('../src-mock/MockUrlFetchAppFake');
    //
    // // 非GAS環境なのでMockをセットアップ
    // Utilities = MockUtilities;
    // Logger = MockLogger;
    // SpreadsheetApp = MockSpreadsheetApp;
    // UrlFetchApp = MockUrlFetchApp;
  }

  var test = new GasTap();

  RealTestSpreadsheetDataStorage.gastTestRunner(test);

  test.finish()
};
