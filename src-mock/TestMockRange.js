var Range = require('./MockRange');
var Cell = require('./MockCell');

function gastTestRunner(test) {
  test('instantiate', function (t) {
    var range;
    var error;

    try {
      error = undefined;
      var matrix = [[new Cell(1),new Cell(2)],[new Cell(3),new Cell(4)]];
      range = new Range(matrix, 1, 1, 1, 1);
    } catch(e) {
      error = e;
    }
    t.equal(error, null, 'shuld be able to instantiate with right args.');
    t.equal(range.matrix.toString(), matrix.toString(), 'matrix shlud be equal.');

    try {
      error = undefined;
      range = new Range();
    } catch(e){
      error = e;
    }
    t.notEqual(error, null, 'shuld not be able to instantiate with invalid args.');

    try {
      error = undefined;
      range = new Range([]);
    } catch(e){
      error = e;
    }
    t.notEqual(error, null, 'shuld not be able to instantiate with invalid args.');

    try {
      error = undefined;
      range = new Range([], 0, 1, 1, 1);
    } catch(e){
      error = e;
    }
    t.notEqual(error, null, 'shuld not be able to instantiate with invalid args.');

    try {
      error = undefined;
      range = new Range([], 1, 0, 1, 1);
    } catch(e){
      error = e;
    }
    t.notEqual(error, null, 'shuld not be able to instantiate with invalid args.');

    try {
      error = undefined;
      range = new Range([], 1, 1, 0, 1);
    } catch(e){
      error = e;
    }
    t.notEqual(error, null, 'shuld not be able to instantiate with invalid args.');

    try {
      error = undefined;
      range = new Range([], 1, 1, 1, 0);
    } catch(e){
      error = e;
    }
    t.notEqual(error, null, 'shuld not be able to instantiate with invalid args.');
  })

  test('test getValues()', function (t) {
    var matrix = [
      [new Cell(1),new Cell(2),new Cell(3)],
      [new Cell(4),new Cell(5),new Cell(6)],
      [new Cell(7),new Cell(8),new Cell(9)],
    ];

    var range;
    var values;

    // データが有る範囲全面
    range = new Range(matrix, 1, 1, 3, 3);
    values = range.getValues();
    t.equal(values.toString(), [[1,2,3],[4,5,6],[7,8,9]].toString(), 'values shuld be equal to [[1,2,3],[4,5,6],[7,8,9]]');

    // 右下角 2x2
    range = new Range(matrix, 2, 2, 2, 2);
    values = range.getValues();
    t.equal(values.toString(), [[5,6],[8,9]].toString(), 'values shuld be equal to [[5,6],[8,9]]');

    // 左上角 2x2
    range = new Range(matrix, 1, 1, 2, 2);
    values = range.getValues();
    t.equal(values.toString(), [[1,2],[4,5]].toString(), 'values shuld be equal to [[1,2],[4,5]]');

    // 真ん中 1x1
    range = new Range(matrix, 2, 2, 1, 1);
    values = range.getValues();
    t.equal(values.toString(), [[5]].toString(), 'values shuld be equal to [[5]]');

    // 下２行 2x3
    range = new Range(matrix, 2, 1, 2, 3);
    values = range.getValues();
    t.equal(values.toString(), [[4,5,6],[7,8,9]].toString(), 'values shuld be equal to [[4,5,6],[7,8,9]]');

    // 右２列 3x2
    range = new Range(matrix, 1, 2, 3, 2);
    values = range.getValues();
    t.equal(values.toString(), [[2,3],[5,6],[8,9]].toString(), 'values shuld be equal to [[2,3],[5,6],[8,9]]');

    // 右一列ハミ出し 3x2
    range = new Range(matrix, 1, 3, 3, 2);
    values = range.getValues();
    t.equal(values.toString(), [[3,undefined],[6,undefined],[9,undefined]].toString(), 'values shuld be equal to [[3,undefined],[6,undefined],[9,undefined]]');

    // 下一列ハミ出し 2x3
    range = new Range(matrix, 3, 1, 2, 3);
    values = range.getValues();
    t.equal(values.toString(), [[7,8,9],[undefined,undefined,undefined]].toString(), 'values shuld be equal to [[7,8,9],[undefined,undefined,undefined]]');

    // 左右一列ずつハミ出し 3x3
    range = new Range(matrix, 2, 2, 3, 3);
    values = range.getValues();
    t.equal(values.toString(), [[5,6,undefined],[8,9,undefined],[undefined,undefined,undefined]].toString(), 'values shuld be equal to [[5,6,undefined],[8,9,undefined],[undefined,undefined,undefined]]');
  })

  test('test getValue()', function (t) {
    var newMatrix = function () {
      return [
        [new Cell(1),new Cell(2),new Cell(3)],
        [new Cell(4),new Cell(5),new Cell(6)],
        [new Cell(7),new Cell(8),new Cell(9)],
      ];
    }

    var range;
    var value;

    range = new Range(newMatrix(), 2, 2, 2, 2);
    value = range.getValue();
    t.equal(value, 5, 'レンジの左上角の値が取得される');

    range = new Range([], 2, 1, 1, 1);
    value = range.getValue();
    t.equal(value, undefined, 'レンジがマトリックスの外を指している場合は値はundefined');
  });

  test('test setValues()', function (t) {
    var newMatrix = function () {
      return [
        [new Cell(1),new Cell(2),new Cell(3)],
        [new Cell(4),new Cell(5),new Cell(6)],
        [new Cell(7),new Cell(8),new Cell(9)],
      ];
    }

    var newValues1 = [
      [11,12,13],
      [14,15,16],
      [17,18,19],
    ]

    var newValues2 = [
      [11,12],
      [13,14]
    ]

    var range;

    // 全面書き換え
    range = new Range(newMatrix(), 1, 1, 3, 3);
    range.setValues(newValues1);
    values = range.getValues(1,1,3,3);
    t.equal(values.toString(), newValues1.toString(), 'values should be equal to [[11,12,13],[14,15,16],[17,18,19]]');

    // からの状態から値を設定
    range = new Range([], 1, 1, 3, 3);
    range.setValues(newValues1);
    values = range.getValues(1,1,3,3);
    t.equal(values.toString(), newValues1.toString(), 'values should be equal to [[11,12,13],[14,15,16],[17,18,19]]');

    // からの状態から値を設定
    range = new Range([], 1, 1, 3, 3);
    range.setValues(newValues1);
    values = range.getValues(1,1,3,3);
    t.equal(values.toString(), newValues1.toString(), 'values should be equal to [[11,12,13],[14,15,16],[17,18,19]]');

    // 1箇所値を変更。真ん中
    range = new Range(newMatrix(), 2, 2, 1, 1);
    range.setValues([[20]]);
    values = range.dumpMatrix();
    t.equal(values.toString(), [[1,2,3],[4,20,6],[7,8,9]].toString(), 'values should be equal to [[1,2,3],[4,20,6],[7,8,9]]');

    // 1箇所値を変更。右下はみ出し
    range = new Range(newMatrix(), 4, 4, 1, 1);
    range.setValues([[20]]);
    values = range.dumpMatrix();
    t.equal(values.toString(), [[1,2,3],[4,5,6],[7,8,9],[undefined,undefined,undefined,20]].toString(), 'values should be equal to [[1,2,3],[4,5,6],[7,8,9],[undefined,undefined,undefined,20]]');

    // 右下に2x2の値を設定
    range = new Range(newMatrix(), 2, 2, 2, 2);
    range.setValues(newValues2);
    values = range.dumpMatrix();
    t.equal(values.toString(), [[1,2,3],[4,11,12],[7,13,14]].toString(), 'values should be equal to [[1,2,3],[4,11,12],[7,13,14]]');
  })

  test('test setValue()', function (t) {
    var newMatrix = function () {
      return [
        [new Cell(1),new Cell(2),new Cell(3)],
        [new Cell(4),new Cell(5),new Cell(6)],
        [new Cell(7),new Cell(8),new Cell(9)],
      ];
    }

    var range;
    var value;
    var matrix;

    matrix = newMatrix();
    range = new Range(matrix, 2, 2, 2, 2);
    value = range.setValue(3);
    values = new Range(matrix, 1, 1, 3, 3).getValues();
    t.equal(values.toString(), [[1,2,3],[4,3,6],[7,8,9]].toString(), 'レンジの左上角の値が更新される。他の場所は変わらず。');

    range = new Range([], 2, 1, 1, 1);
    value = range.getValue();
    t.equal(value, undefined, 'レンジがマトリックスの外を指している場合は値はundefined');
  });
}

// テストメソッドをエクスポート
module.exports.gastTestRunner = gastTestRunner;
