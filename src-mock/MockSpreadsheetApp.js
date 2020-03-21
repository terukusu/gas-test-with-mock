var Spreadsheet = require('./MockSpreadsheet');

var spreadsheets = {};

function openById(sheetId) {
  return spreadsheets[sheetId];
}

function mockCreateWithIdAndName(sheetId, name) {
  spreadsheets[sheetId] = new Spreadsheet(sheetId, name);
}

function mockClear() {
  spreadsheets = {};
}

function mockGetSpreadsheets() {
  return spreadsheets;
}

module.exports = {
  openById: openById,
  mockCreateWithIdAndName: mockCreateWithIdAndName,
  mockClear: mockClear,
  mockGetSpreadsheets: mockGetSpreadsheets,
}
