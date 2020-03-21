var Range = require('./MockRange');

function MockSheet(spreadsheet, name) {
  this.parent = spreadsheet;
  this.name = name;
  this.data = [];
}

MockSheet.prototype.getRange = function (row, col, numRows, numColumns) {
  return new Range(this.data, row, col, numRows, numColumns);
}

MockSheet.prototype.getLastColumn = function () {
  var lastColumn = -1;
  for(var i = 0; i < this.data.length; i++) {
    var row = this.data[i];

    if (!row) {
      continue;
    }

    for(var j = lastColumn; j < row.length; j++) {
      var cell = row[j];
      lastColumn = (cell && cell.value != null) ? j : lastColumn;
    }
  }

  return lastColumn + 1;
}

MockSheet.prototype.getLastRow = function () {
  if (this.data.length == 0) {
    return 0;
  }

  var lastRow = -1;

  for(var i = 0; i < this.data.length; i++) {
    var row = this.data[i];

    if (!row) {
      continue;
    }

    for(var j = 0; j < row.length; j++) {
      var cell = this.data[i][j];
      lastRow = (cell && cell.value != null) ? i : lastRow;
    }
  }

  return lastRow + 1;
}

MockSheet.prototype.copyTo = function(spreadsheet) {

  var newSheet = spreadsheet.mockCreateSheet(this.getName() + ' のコピー');
  var lastRow = this.getLastRow();
  var lastCol = this.getLastColumn();
  var values = this.getRange(1, 1, lastRow, lastCol).getValues();

  var range = newSheet.getRange(1, 1, lastRow, lastCol);
  range.setValues(values);

  return newSheet;
}

MockSheet.prototype.getParent = function() {
  return this.parent;
}

MockSheet.prototype.getName = function() {
  return this.name;
}

MockSheet.prototype.setName = function(name) {
  this.name = name;
  return this;
}

module.exports = MockSheet;
