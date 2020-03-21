var Environment = require('./Environment');
var SpreadsheetDataStorage = require('../src/SpreadsheetDataStorage');

var spreadsheetId = '1ucV5HRT5TR5GZQSzjtGWHzLLRjwKDRxfvlLbLSH0PWk';
var spreadsheetName = '無題スプレッドシート';
var templateName = 'TEMPLATE';
var templateHeader = ['no','kind','purchaseToken','purchaseTime','voidedTime','processTime'];

function setUp() {
  if (!Environment.isGoogleAppsScriptServer()) {
    SpreadsheetApp.mockClear();
    SpreadsheetApp.mockCreateWithIdAndName(spreadsheetId, spreadsheetName);

    // テンプレ用シート作成
    var spreadsheet = SpreadsheetApp.openById(spreadsheetId);
    var sheet = spreadsheet.mockCreateSheet(templateName);
    var header = [templateHeader];
    sheet.getRange(1,1,1,header[0].length).setValues(header);
  }

  // テンプレ以外のシートが有れば消しておく
  if (!spreadsheet) {
    spreadsheet = SpreadsheetApp.openById(spreadsheetId);
  }
  spreadsheet.getSheets().forEach(function(v) {
    if (v.getName() !== templateName) {
      spreadsheet.deleteSheet(v);
    }
  });
}

function tearDown() {
  // テンプレート以外は削除
  var spreadsheet = SpreadsheetApp.openById(spreadsheetId);
  spreadsheet.getSheets().forEach(function(v) {
    if (v.getName() !== templateName) {
      spreadsheet.deleteSheet(v);
    }
  });
}

function gastTestRunner(test_) {
  var test = function(description, f) {
    setUp();
    test_(description, f);
    tearDown();
  };

  test('テスト: createSheetIfNotExist()', function(t) {
    var sheet;
    var sds = new SpreadsheetDataStorage(spreadsheetId);
    sheet = sds.createSheetIfNotExist(templateName);

    t.notEqual(sheet, null, '既存のシートが取得できること');

    var spreadsheet = SpreadsheetApp.openById(spreadsheetId);
    var name = 'foobar';
    sheet = spreadsheet.getSheetByName(name);

    t.equal(sheet, null, 'シートが存在しないことを確認しておく');

    sheet = sds.createSheetIfNotExist(name);
    t.notEqual(sheet, null, '存在しないシートは作成されて取得できること');
    t.equal(sheet.getName(), spreadsheet.getSheets()[0].getName(), '作成されたシートは位置1に配置されていること');
  })

  test('テスト: getColumnIndex()', function(t) {
    var sds = new SpreadsheetDataStorage(spreadsheetId);
    var sheet = sds.getSheetByName(templateName);

    for (var i = 0; i < templateHeader.length; i++) {
      var index = sds.getColumnIndex(templateName, templateHeader[i]);
      t.equal(index, i + 1, 'カラム名とそれに対応するカラムインデックスが一致していること: ' + templateHeader[i]);
    }

  });

  test('テスト: getColumns()', function(t) {
    var sds = new SpreadsheetDataStorage(spreadsheetId);

    var columns = sds.getColumns(templateName);

    t.equal(columns, templateHeader.toString(), '正しいカラム名のリストが取得できること。');
  });

  test('テスト: writeData()', function(t) {
    var sds = new SpreadsheetDataStorage(spreadsheetId);

    var matrix = [
      ['kind1', 'token1', '123', '456', '789'],
      ['kind2', 'token2', '123', '456', '789'],
      ['kind3', 'token3', '123', '456', '789'],
    ];

    var sheetName = 'sheet1';

    sds.writeData(sheetName, matrix);

    var spreadsheet = SpreadsheetApp.openById(spreadsheetId);
    sheet = spreadsheet.getSheetByName(sheetName);

    var values;
    values = sheet.getRange(2, 2, sheet.getLastRow() - 1, sheet.getLastColumn() - 1).getValues();
    t.equal(values.toString(), matrix.toString(), 'データが期待通り書き込まれていること');

    sds.writeData(sheetName, matrix);

    var matrix2 = [
      ['kind1', 'token1', '123', '456', '789'],
      ['kind2', 'token2', '123', '456', '789'],
      ['kind3', 'token3', '123', '456', '789'],
      ['kind1', 'token1', '123', '456', '789'],
      ['kind2', 'token2', '123', '456', '789'],
      ['kind3', 'token3', '123', '456', '789'],
    ];

    values = sheet.getRange(2, 2, sheet.getLastRow() - 1, sheet.getLastColumn() - 1).getValues();
    t.equal(values.toString(), matrix2.toString(), '追記した場合もデータが期待通り書き込まれていること');
  });

  test('テスト: readData()', function(t) {
    var sds = new SpreadsheetDataStorage(spreadsheetId);

    var matrix = [
      ['kind1', 'token1', '123', '456', '789'],
      ['kind2', 'token2', '123', '456', '789'],
      ['kind3', 'token3', '123', '456', '789'],
    ];

    var sheetName = 'sheet1';

    sds.writeData(sheetName, matrix);

    var expected = [
      ['no','kind','purchaseToken','purchaseTime','voidedTime','processTime'],
      [1, 'kind1', 'token1', '123', '456', '789'],
      [2, 'kind2', 'token2', '123', '456', '789'],
      [3, 'kind3', 'token3', '123', '456', '789'],
    ];

    var data = sds.readData(sheetName);

    t.equal(data.toString(), expected.toString(), '読み込んだデータが期待しているデータと一致していること');
  });

  test('テスト: readDataByColumn()', function(t) {
    var sds = new SpreadsheetDataStorage(spreadsheetId);

    var matrix = [
      ['kind1', 'token1', '123', '456', '789'],
      ['kind2', 'token2', '123', '456', '789'],
      ['kind3', 'token3', '123', '456', '789'],
    ];

    var sheetName = 'sheet1';

    sds.writeData(sheetName, matrix);

    var data = sds.readDataByColumn(sheetName, ['purchaseToken', 'voidedTime']);

    var expected = [
       [ 'purchaseToken', 'voidedTime' ],
       [ 'token1', '456' ],
       [ 'token2', '456' ],
       [ 'token3', '456' ]
     ];

     t.equal(data.toString(), expected.toString(), '読み込んだデータが期待しているデータと一致していること');
  });

}

module.exports.gastTestRunner = gastTestRunner;
