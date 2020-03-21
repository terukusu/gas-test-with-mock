var Cell = require('./MockCell');

function MockRange(matrix, row, col, numRows, numColumns) {
  if (!matrix) {
    throw new Error('arg matrix shuold be specified.');
  }
  if (!row) {
    throw new Error('row should be > 0: actual=' + row);
  }
  if (!col) {
    throw new Error('col should be > 0: actual=' + col);
  }
  if (!numRows) {
    throw new Error('numRows should be > 0: actual=' + numRows);
  }
  if (!numColumns) {
    throw new Error('numColumns should be > 0: actual=' + numColumns);
  }
  this.row = row;
  this.col = col;
  this.numRows = numRows;
  this.numColumns = numColumns;
  this.matrix = matrix;
}

MockRange.prototype.getValues = function() {
  var result = [];
  for (var i = 0; i < this.numRows; i++) {
    var targetRow = this.row - 1 + i;

    if (targetRow < this.matrix.length) {
      var resultRow = [];
      result.push(resultRow);

      for (var j = 0; j < this.numColumns; j++) {
        var targetCol = this.col - 1 + j;
        if (targetCol < this.matrix[targetRow].length) {
          resultRow.push(this.matrix[targetRow][targetCol].value);
        } else {
          resultRow.push(undefined);
        }
      }
    } else {
      result.push(Array(this.numColumns));
    }
  }

  return result;
}

MockRange.prototype.getValue = function() {
  if (this.row - 1 < this.matrix.length && this.matrix[this.row - 1]) {
    var cell = this.matrix[this.row - 1][this.col - 1];
    return cell ? cell.value : undefined;
  }

  return undefined;
}

MockRange.prototype.setValues = function(data) {
  if (data.length !== this.numRows) {
    throw new Error('The number of rows of data not match with range.: expected=' + this.numRows + ', actual=' + data.length);
  }

  if ((data.length === 0 && this.numColumns > 0) || (data.length > 0 && data[0].length !== this.numColumns)) {
    throw new Error('The number of columns of data not match with range.: expected=' + this.numRows + ', actual=' + data[0].length);
  }

  this.init();

  for (var i = 0; i < this.numRows; i++) {
    var resultRow = this.matrix[this.row - 1 + i];
    for (var j = 0; j < this.numColumns; j++) {
      resultRow[this.col - 1 + j].value = data[i][j];
    }
  }
}

MockRange.prototype.setValue = function(data) {
  this.init();
  this.matrix[this.row - 1][this.col - 1].value = data;
}

/**
 * 指定レンジのセルでセルオブジェクトが存在しない箇所があればセルオブジェクトを生成します。
 *
 */
MockRange.prototype.init = function () {
  for (var i = 0; i < this.numRows; i++) {
    var resultRow = this.matrix[this.row - 1 + i];

    if (!resultRow) {
        resultRow = Array(this.col -1 + this.numColumns);
        this.matrix[this.row - 1 + i] = resultRow;
    }

    for (var j = 0; j < this.numColumns; j++) {
      if (!resultRow[this.col - 1 + j]) {
        resultRow[this.col - 1 + j] = new Cell();
      }
    }
  }
}

/**
 * デバッグ用。このレンジが参照しているマトリクス全体をセルの値の２次元配列としてダンプします
 */
MockRange.prototype.dumpMatrix = function () {
  var result = Array(this.matrix.length);
  for (var i = 0; i < this.matrix.length; i++) {
    if (this.matrix[i]) {
      result[i] = Array(this.matrix[i].length);
      for (var j = 0; j < this.matrix[i].length; j++) {
        if (this.matrix[i][j]) {
          result[i][j] = this.matrix[i][j].value;
        }
      }
    }
  }

  return result;
}

MockRange.prototype.setNumberFormat = function (numberFormat) {
  this.init();
  for (var i = 0; i < this.numRows; i++) {
    var resultRow = this.matrix[this.row - 1 + i];
    for (var j = 0; j < this.numColumns; j++) {
      resultRow[this.col - 1 + j].setNumberFormat(numberFormat);
    }
  }
}

MockRange.prototype.setBorder = function (top, left, bottom, right, vertical, horizontal) {
  this.init();
  for (var i = 0; i < this.numRows; i++) {
    var resultRow = this.matrix[this.row - 1 + i];
    for (var j = 0; j < this.numColumns; j++) {
      resultRow[this.col - 1 + j].setBorder(top, left, bottom, right, vertical, horizontal);
    }
  }
}

module.exports = MockRange;
