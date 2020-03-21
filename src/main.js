var SpreadSheetDataStorage = require('./SpreadSheetDataStorage');

global.callApi = function (sheetId, name) {
  var storage = new SpreadSheetDataStorage(sheetId);
  //storage.getSheetByName(name);
}
