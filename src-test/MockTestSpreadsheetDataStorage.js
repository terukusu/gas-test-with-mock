var SpreadsheetDataStorage = require('../src/SpreadsheetDataStorage');

var templateName = 'TEMPLATE';
var templateHeader = ['no','kind','purchaseToken','purchaseTime','voidedTime','processTime'];

function tearUp() {
  SpreadsheetApp.mockClear();
  SpreadsheetApp.mockCreateWithIdAndName('sampleId', '無題スプレッドシート');

  // テンプレ用シート作成
  var spreadsheet = SpreadsheetApp.openById('sampleId');
  var sheet = spreadsheet.mockCreateSheet(templateName);
  var header = [templateHeader];
  sheet.getRange(1,1,1,header[0].length).setValues(header);
}

function gastTestRunner(test) {
  test('テスト: コンストラクタ SpreadsheetDataStorage()', function (t) {
    tearUp();

    var sds = new SpreadsheetDataStorage('sampleId');
    t.notEqual(sds.spreadsheet, null, "指定されたスプレッドシートへの参照を保持していること.");
  });

  test('テスト: createSheetIfNotExist()', function (t) {
    tearUp();

    var spreadsheet = SpreadsheetApp.openById('sampleId');
    var sds = new SpreadsheetDataStorage('sampleId');

    var sheet;

    // 最初はこのシートは存在しないことを確認する
    sheet = spreadsheet.getSheetByName('foobar');
    t.equal(sheet, null, 'シートがまだ存在しないこと');

    // SpreadsheetDataStorage経由で確認する
    sheet = sds.createSheetIfNotExist('foobar');
    t.notEqual(sheet, null, 'シートが生成されて取得できること');
    t.equal(sheet.getName(), 'foobar', 'シートの名前が指定のものと一致していること');

    var values;
    values = sheet.getRange(1,1,1,templateHeader.length).getValues();
    t.equal(values[0].toString(), templateHeader.toString(), '生成されたシートのヘッダがテンプレのヘッダと一致していること');


    // スプレッドシートから直接確認する
    sheet = spreadsheet.getSheetByName('foobar');
    t.notEqual(sheet, null, 'シートが生成されて取得できること');
    t.equal(sheet.getName(), 'foobar', 'シートの名前が指定のものと一致していること');

    values = sheet.getRange(1,1,1,templateHeader.length).getValues();
    t.equal(values[0].toString(), templateHeader.toString(), '生成されたシートのヘッダがテンプレのヘッダと一致していること');

    var firstSheet = spreadsheet.getSheets()[0];
  });

  test('テスト: writeData()', function (t) {
    tearUp();

    var values = [
      [1,2,3],
      [4,5,6]
    ];

    var sds = new SpreadsheetDataStorage('sampleId');
    sds.writeData('foobar', values);

    var newSheet = SpreadsheetApp.openById('sampleId').getSheetByName('foobar');
    var newValues = newSheet.getRange(2,2,2,3).getValues();

    t.equal(newValues.toString(), values.toString(), '指定した名前のシートに値が書き込まれていること');
  });

  // TODO readDataByColumn のテストが不十分。シートが存在しない時の挙動
}


// テストメソッドをエクスポート
module.exports.gastTestRunner = gastTestRunner;
