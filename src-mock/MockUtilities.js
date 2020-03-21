var util = require('util');
var formatDate_ = require('date-format');
var crypto = require('crypto');

function formatString(format, etc) {
  return util.format.apply(util, arguments);
}

function formatDate(date, tz, format) {
  return formatDate_(format, date);
}

function base64Encode(data) {
  var encoding = 'latin1';
  var reEncoded = Buffer.from(data, 'latin1').toString('latin1');

  if (data !== reEncoded) {
    encoding = 'utf-8';
  }

  var base64 = Buffer.from(data, encoding).toString('base64');

  return base64;
}

function base64EncodeWebSafe(data) {
  var base64 = base64Encode(data);

  // base64url にする
  //
  var base64url = base64.replace(/[\+\/=\r\n]/g, (m) => ({'+':'-','/':'_','=':'','\r':'','\n':''})[m]);

  return base64url;
}

function computeRsaSha256Signature(data, privateKey) {
  var sign = crypto.createSign('RSA-SHA256');
  sign.update(data, 'utf-8');
  var signature = sign.sign(privateKey, 'latin1');
  return signature;
}

module.exports = {
  formatString: formatString,
  formatDate: formatDate,
  base64Encode: base64Encode,
  base64EncodeWebSafe: base64EncodeWebSafe,
  computeRsaSha256Signature: computeRsaSha256Signature,
}
