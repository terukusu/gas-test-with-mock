function MockCell(value) {
  this.value = value;
}

MockCell.prototype.setNumberFormat = function (numberFormat) {
  this.setInnerValue('numberFormat', numberFormat);
}

MockCell.prototype.getNumberFormat = function () {
  return this.getInnerValue('numberFormat');
}

MockCell.prototype.setBorder = function (top, left, bottom, right, vertical, horizontal) {
  this.setInnerValue('border', [top, left, bottom, right, vertical, horizontal]);
}

MockCell.prototype.getBorder = function () {
  return this.getInnerValue('border');
}

MockCell.prototype.setInnerValue = function (key, value) {
  this[key] = value;
}

MockCell.prototype.getInnerValue = function (key) {
  return this[key];
}

module.exports = MockCell;
