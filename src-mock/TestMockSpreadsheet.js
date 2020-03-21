var Spreadsheet = require('./MockSpreadsheet');

function gastTestRunner(test) {
  test('テスト:コンストラクタ', function (t) {
    var spreadsheet;
    spreadsheet = new Spreadsheet('asdf1', 'モック1');
    t.equal(spreadsheet.getId(), 'asdf1', '指定したIDが設定されていること');
    t.equal(spreadsheet.getName(), 'モック1', '指定した名前が設定されていること');
  });

  test('テスト:mockCreateSheet()', function (t) {
    var spreadsheet;
    spreadsheet = new Spreadsheet('asdf1', 'モック1');
    spreadsheet.mockCreateSheet('シート１');
    var sheets = spreadsheet.getSheets();

    t.equal(sheets.length, 1, '１つ作成されていること');
    t.equal(sheets[0].getName(), 'シート１', '指定した名前と一致していること');
  });

  test('テスト:getSheetByName()', function (t) {
    var spreadsheet;
    spreadsheet = new Spreadsheet('asdf1', 'モック1');
    spreadsheet.mockCreateSheet('シート１');
    var sheet = spreadsheet.getSheetByName('シート１');
    t.notEqual(sheet, null, '指定した名前でシートが取得できること');
    t.equal(sheet.getName(), 'シート１', '指定した名前とシートの名前が一致していること');
  });

  test('テスト:MockSheet.copyTo()', function (t) {
    var spreadsheet = new Spreadsheet('asdf1', 'モック1');
    var sheet = spreadsheet.mockCreateSheet('シート１');

    var values = [
      [1,2,3],
      [4,5,6],
      [7,8,9],
    ];

    sheet.getRange(1, 1, 3, 3).setValues(values);
    var newSheet1 = sheet.copyTo(spreadsheet);

    var newSheet2 = spreadsheet.getSheetByName(newSheet1.getName());
    var newValues = newSheet2.getRange(1, 1, 3, 3).getValues();

    t.equal(newValues.toString(), values.toString(), 'コピー元シートと先のデータが一致していること');

    var spreadsheet2 = new Spreadsheet('asdf2', 'モック2');
    var newSheet3 = sheet.copyTo(spreadsheet2);

    var newSheet4 = spreadsheet.getSheetByName(newSheet3.getName());
    var newValues2 = newSheet4.getRange(1, 1, 3, 3).getValues();

    t.equal(newValues2.toString(), values.toString(), '他のスプレッドシートにもコピーができて、元シートとデータが一致していること');

  });

  test('テスト:getActiveSheet()', function (t) {
    var spreadsheet = new Spreadsheet('asdf1', 'モック1');
    spreadsheet.mockCreateSheet('sheet1');
    spreadsheet.mockCreateSheet('sheet2');
    spreadsheet.mockCreateSheet('sheet3');

    var sheet = spreadsheet.getActiveSheet();
    t.equal(sheet, spreadsheet.getSheets()[0], 'デフォルトのアクティブシートは１番目のシートであること');
  });

  test('テスト:setActiveSheet()', function (t) {
    var spreadsheet = new Spreadsheet('asdf1', 'モック1');
    spreadsheet.mockCreateSheet('sheet1');
    var newSheet = spreadsheet.mockCreateSheet('sheet2');
    spreadsheet.mockCreateSheet('sheet3');

    spreadsheet.setActiveSheet(newSheet);
    var sheet = spreadsheet.getActiveSheet();
    t.equal(sheet, newSheet, '指定したシートがアクティブになっていること');
  });

  test('テスト:moveActiveSheet()', function (t) {
    var spreadsheet = new Spreadsheet('asdf1', 'モック1');
    spreadsheet.mockCreateSheet('sheet1');
    var newSheet = spreadsheet.mockCreateSheet('sheet2');
    spreadsheet.mockCreateSheet('sheet3');

    spreadsheet.setActiveSheet(newSheet);
    spreadsheet.moveActiveSheet(1);
    t.equal(newSheet, spreadsheet.getSheets()[0], '指定したシートが指定位置に移動していること');
    t.equal(spreadsheet.getActiveSheet(), spreadsheet.getSheets()[0], '移動したシートがアクティブになっていること');

    var isError;

    isError = false;
    try {
      spreadsheet.moveActiveSheet(0);
    } catch(e) {
      isError = true;
    }
    t.equal(isError, true, 'シートを移動できる位置は0〜シート数の間だけ。それ未満は例外が発生すること');

    isError = false;
    try {
      spreadsheet.moveActiveSheet(4);
    } catch(e) {
      isError = true;
    }

    t.equal(isError, true, 'シートを移動できる位置は0〜シート数の間だけ。それを超えると例外が発生すること');
  });

  test('テスト:deleteSheet()', function (t) {
    var spreadsheet = new Spreadsheet('asdf1', 'モック1');
    var sheet1 = spreadsheet.mockCreateSheet('sheet1');
    var sheet2 = spreadsheet.mockCreateSheet('sheet2');
    var sheet3 = spreadsheet.mockCreateSheet('sheet3');
    var sheet4 = spreadsheet.mockCreateSheet('sheet4');

    var nameArray;

    spreadsheet.deleteSheet(sheet2);
    nameArray = spreadsheet.getSheets().map(function (v) { return v.getName() });
    t.equal(nameArray.toString(), ['sheet1','sheet3','sheet4'].toString(), '2番目のシートが削除されていること');

    spreadsheet.deleteSheet(sheet2);
    nameArray = spreadsheet.getSheets().map(function (v) { return v.getName() });
    t.equal(nameArray.toString(), ['sheet1','sheet3','sheet4'].toString(), '存在しないシートを削除しようとしても変化が起きないこと');

    spreadsheet.deleteSheet(sheet1);
    nameArray = spreadsheet.getSheets().map(function (v) { return v.getName() });
    t.equal(nameArray.toString(), ['sheet3','sheet4'].toString(), '端(最初のシート)が削除できること');

    spreadsheet.deleteSheet(sheet4);
    nameArray = spreadsheet.getSheets().map(function (v) { return v.getName() });
    t.equal(nameArray.toString(), ['sheet3'].toString(), '端(最後のシート)が削除できること');
  });

  test('テスト:deleteSheet() active の動きについて', function (t) {
    var spreadsheet = new Spreadsheet('asdf1', 'モック1');
    var sheet1 = spreadsheet.mockCreateSheet('sheet1');
    var sheet2 = spreadsheet.mockCreateSheet('sheet2');
    var sheet3 = spreadsheet.mockCreateSheet('sheet3');

    var nameArray;

    spreadsheet.setActiveSheet(sheet3);
    t.equal(spreadsheet.active, 3, 'アクティブシートは３番目であること');

    spreadsheet.deleteSheet(sheet3);
    t.equal(spreadsheet.active, 2, '３番目のシートを削除したらアクティブシートは2になること');
  });
}

module.exports.gastTestRunner = gastTestRunner;
