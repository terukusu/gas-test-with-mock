var Sheet = require('./MockSheet');

function gastTestRunner(test) {

  test('テスト:生成', function (t) {
    var dummy = {};
    var sheet = new Sheet(dummy, 'シート１');
    t.equal(sheet.getName(), 'シート１', '指定した名前が設定されていること');
    t.equal(sheet.getParent(), dummy, '指定したダミースプレッドシートが親にされていること');
  });

  test('テスト: getRange()', function (t) {
    var dummy = {};
    var sheet = new Sheet(dummy, 'シート１');
    var range = sheet.getRange(2,2,3,3);

    t.equal(range.matrix, sheet.data, 'レンジが自身のデータを参照していること');
    t.equal([range.row, range.col,range.numRows,range.numColumns].toString(), [2,2,3,3].toString(), 'レンジの行、桁、高さ、幅が指定した値と一致していること');
  });

  test('テスト: getLastColumn()', function (t) {
    var dummy = {};
    var sheet = new Sheet(dummy, 'シート１');
    var range = sheet.getRange(2,2,3,2);
    var matrix = [
      [1,2],
      [4,5],
      [7,8],
    ];

    t.equal(sheet.getLastColumn(), 0, '空のシートなのでラストカラムは0で有ること');

    range.setValues(matrix);

    t.equal(sheet.getLastColumn(), 3, 'ラストカラムは値が存在する最大のカラムであること');

  });

  test('テスト: getLastRow()', function (t) {
    var dummy = {};
    var sheet = new Sheet(dummy, 'シート１');
    var range = sheet.getRange(2,2,3,2);
    var matrix = [
      [1,2],
      [4,5],
      [7,8],
    ];

    t.equal(sheet.getLastRow(), 0, '空のシートなのでラストロウは0で有ること');

    range.setValues(matrix);

    t.equal(sheet.getLastRow(), 4, 'ラストロウは値が存在する最大のロウであること');

  });

  test('テスト: copyTo()', function (t) {
    var dummy = {};
    var sheet = new Sheet(dummy, 'シート１');
    var range = sheet.getRange(2,2,3,2);
    var matrix = [
      [1,2],
      [4,5],
      [7,8],
    ];

    t.equal(sheet.getLastRow(), 0, '空のシートなのでラストロウは0で有ること');

    range.setValues(matrix);

    t.equal(sheet.getLastRow(), 4, 'ラストロウは値が存在する最大のロウであること');

  });
}

module.exports.gastTestRunner = gastTestRunner;
