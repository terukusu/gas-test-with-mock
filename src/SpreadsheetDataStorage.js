var TEMPLATE_NAME='TEMPLATE'

/**
 * コンストラクタ。
 *
 * @param {string} sheetId Google Spreadsheet のIDです。
 */
function SpreadsheetDataStorage(sheetId) {
  this.sheetId = sheetId;
  this.spreadsheet = SpreadsheetApp.openById(sheetId);
}

/**
 * 指定された名前のシートにデータを書き込みます。
 * データは二次元配列です。
 *
 * @param {string} name シートの名前
 * @param {Array} name データ。2次元配列
 */
SpreadsheetDataStorage.prototype.writeData = function(name, data) {
  var sheet = this.createSheetIfNotExist(name);

  if (data.length == 0 || data[0].length == 0) {
    // nothing todo
    return;
  }

  var matrix = [];
  data.forEach(function(v) {
    var row = ['=row()-1'];
    Array.prototype.push.apply(row, v);
    matrix.push(row);
  });

  var range = sheet.getRange(sheet.getLastRow() + 1, 1, matrix.length, matrix[0].length);
  range.setValues(matrix);

  // 改行モード設定。セルデータは改行して全表示
  // range.setWrapStrategy(SpreadsheetApp.WrapStrategy.WRAP);

  // 書式設定
  var firstRow = matrix[0];
  firstRow.forEach(function(v, i) {
    if (getClassName(v) === 'Date') {
      sheet.getRange(2, i + 1, sheet.getLastRow() - 1, 1).setNumberFormat("yyyy/MM/dd HH:mm:ss");
    }
  });

  // 罫線設定
  sheet.getRange(1, 1, sheet.getLastRow(), sheet.getLastColumn()).setBorder(true, true, true, true, true, true);
}

/**
 * 名前を指定してシートを取得します。
 *
 * @param {string} name シートの名前です。
 * @return {Sheet} 指定された名前のシートです。該当するものが無ければ undefined
 */
SpreadsheetDataStorage.prototype.getSheetByName = function(name) {
  return this.spreadsheet.getSheetByName(name);
}

/**
 * 名前を指定してシートを取得します。
 * 該当するシートが存在しない場合はテンプレートを元に新たに作成します。
 *
 * @param {string} name シートの名前です。
 */
SpreadsheetDataStorage.prototype.createSheetIfNotExist = function(name) {
  var sheet = this.getSheetByName(name);

  if (!sheet) {
    var templateSheet = this.spreadsheet.getSheetByName(TEMPLATE_NAME);
    sheet = templateSheet.copyTo(this.spreadsheet);
    sheet.setName(name);

    this.spreadsheet.setActiveSheet(sheet);
    this.spreadsheet.moveActiveSheet(1);
  }

  return sheet;
}

/**
 * 指定した名前のシートからデータを全件読み込みます。
 *
 * @param {string} name シート名
 */
SpreadsheetDataStorage.prototype.readData = function(name) {
  var sheet = this.getSheetByName(name);
  if (!sheet) {
    throw Error('sheet not found: name='+name);
  }

  var range = sheet.getRange(1, 1, sheet.getLastRow(), sheet.getLastColumn());
  var values = range.getValues();

  return values;
}

/**
 * 指定した名前のシートから指定カラムのデータを読み込みます。
 *
 * @param {string} name シート名
 * @param {Array} columns カラム名のリスト
 * @return {Array} データを含む２次元配列。1行目はヘッダ行です。
 */
SpreadsheetDataStorage.prototype.readDataByColumn = function(name, columns) {
  var sheet = this.getSheetByName(name);
  if (!sheet) {
    throw Error('sheet not found: name='+name);
  }

  var lastRow = sheet.getLastRow();

  var result = Array(lastRow);

  columns.forEach(function(column) {
    var col = this.getColumnIndex(name, column);
    var values = sheet.getRange(1, col, lastRow, 1).getValues();
    for (var i = 0; i < values.length; i++) {
      result[i] = result[i] ? result[i] : [];
      result[i].push(values[i][0]);
    };
  }, this);

  return result;
}

/**
 * カラム名のリストを取得します。
 *
 * @param {string} name シート名
 * @return {Array} カラム名文字列の配列
 */
SpreadsheetDataStorage.prototype.getColumns = function(name) {
  var sheet = this.getSheetByName(name);
  if (!sheet) {
    throw Error('sheet not found: name='+name);
  }
  var columns = sheet.getRange(1,1,1,sheet.getLastColumn()).getValues();
  return columns;
}

/**
 * 指定されたカラム名に該当するカラムインデックスを取得します。
 * カラムヘッダーに含まれる改行は無視されます。
 * 返すインデックスは1始まり。
 *
 * @param {string} name シートの名前
 * @param {string} columnName カラム名
 * @param {Number} headerRow カラムヘッダーの行
 * @return {Number} 指定されたカラム名に該当するカラムインデックス。見つからなければ -1
 */
SpreadsheetDataStorage.prototype.getColumnIndex = function(name, columnName, headerRow) {

  var sheet = this.getSheetByName(name);
  if (!sheet) {
    throw Error('sheet not found: name='+name);
  }

  if (headerRow == null) {
    headerRow = 1;
  }

  var data = sheet.getRange(headerRow, 1, 1, sheet.getLastColumn()).getValues();

  for (var i = 0; i < data[0].length; i++) {
    var tmpHeader = data[0][i];
    if (typeof tmpHeader === "string") {
      tmpHeader = tmpHeader.replace(/\r?\n|^\s+|\s+$/g,"");
    }

    if (tmpHeader === columnName) {
      return i+1;
    }
  }

  return -1;
}

/**
 * 指定された名前のストレージが存在するかを取得します。
 *
 * @param {string} name ストレージ名(ここではシート名)
 * @return {Boolean} 指定された名前のストレージが存在するときだけ true
 */
SpreadsheetDataStorage.prototype.isExists = function(name) {
  return (this.getSheetByName(name) != null);
}

function getClassName(object) {
  if (object == null) {
    return undefined;
  }

  var reg = /\[object (.+)\]/;
  var str = Object.prototype.toString.call(object);
  return str.match(reg)[1];
}

module.exports = SpreadsheetDataStorage;
