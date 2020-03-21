var Cell = require('./MockCell');

function gastTestRunner(test) {
  test('instantiate', function (t) {
    var cell = new Cell();
    t.notEqual(cell, null, 'instance should not be null or undefined.')
    t.equal(cell.value, undefined, 'default value should be undefined.')

    var value = 'asdf';
    cell = new Cell(value);
    t.equal(cell.value, value, 'value property should be equal to the value passed to the constructor.')
  })

  test('test get/setInnerValue', function (t) {
    var cell = new Cell();

    var key1 = 'key1';
    var value1 = 'value1';
    cell.setInnerValue(key1, value1);
    t.equal(cell.getInnerValue(key1), value1, 'the value crresponds to the key1 should be equal.');

    var key2 = 'key2';
    var value2 = 'value2';
    cell.setInnerValue(key2, value2);
    t.equal(cell.getInnerValue(key2), value2, 'the value crresponds to the key2 should be equal.');
    t.equal(cell.getInnerValue(key1), value1, 'the value crresponds to the key2 should still be equal.');
  })

  test('test get/setNumberFormat', function (t) {
    var cell = new Cell();

    var value1 = 'YYYY/mm/dd hh:mm:ss';
    cell.setNumberFormat(value1);
    t.equal(cell.getNumberFormat(), value1, 'the numberFormat property should be equal.');

    var value2 = undefined;
    cell.setNumberFormat(value2);
    t.equal(cell.getNumberFormat(), value2, 'the numberFormat accept undefined value.');

  })
}

// テストメソッドをエクスポート
module.exports.gastTestRunner = gastTestRunner;
