function isGoogleAppsScriptServer() {
  // Apps Script 環境にはモック用メソッドは用意されていないので
  // それで Apps Script 環境であることを判定する
  return (typeof(SpreadsheetApp) !== 'undefined' && SpreadsheetApp.mockClear === undefined);
}

module.exports.isGoogleAppsScriptServer = isGoogleAppsScriptServer;
