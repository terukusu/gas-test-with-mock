var Sheet = require('./MockSheet');

function MockSpreadsheet(id, name) {
  if (!id) {
    throw new Error('arg id should be specified.');
  }
  if (!name) {
    throw new Error('arg name should be specified.');
  }

  this.id = id;
  this.name = name;
  this.sheets = [];
  // 1 origin
  this.active = 1;
}

MockSpreadsheet.prototype.deleteSheet = function (sheet) {
  var index = this.sheets.indexOf(sheet);
  if (index >= 0) {
    this.sheets.splice(index,1);
  }

  this.active = Math.min(this.active, this.sheets.length);
}

MockSpreadsheet.prototype.getActiveSheet = function () {
  return this.sheets[this.active - 1];
}

MockSpreadsheet.prototype.getId = function() {
  return this.id;
}

MockSpreadsheet.prototype.getName = function() {
  return this.name;
}

MockSpreadsheet.prototype.getSheetByName = function (name) {
  for(var i = 0; i < this.sheets.length; i++) {
    if (this.sheets[i].name === name) {
      return this.sheets[i];
    }
  }

  return undefined;
}

MockSpreadsheet.prototype.getSheets = function() {
  return this.sheets;
}

MockSpreadsheet.prototype.moveActiveSheet = function (pos) {
  if (pos < 1 || pos > this.sheets.length) {
    throw new Error('Array index out of bounds: ' + pos);
  }

  var tmpSheet;
  if (this.active != pos) {
    tmpSheet = this.sheets.splice(this.active - 1, 1)[0];
    this.sheets.splice(pos - 1, 0, tmpSheet);

    this.active = pos;
  }

  return this;
}

MockSpreadsheet.prototype.setActiveSheet = function (sheet) {
  var index = this.sheets.indexOf(sheet);
  if (index < 0) {
    throw new Error('sheet not found: ' + sheet.getName());
  }

  this.active = index + 1;
}

MockSpreadsheet.prototype.mockCreateSheet = function(name) {
  var sheet = this.getSheetByName(name);
  sheet = sheet ? sheet : new Sheet(this, name);
  this.sheets.push(sheet);

  return sheet;
}

MockSpreadsheet.prototype.mockClear = function() {
  return this.sheets = [];
}

module.exports = MockSpreadsheet;
