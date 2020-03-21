var spawnSync = require('child_process').spawnSync;

var MockHttpResponse = require('./MockHttpResponse');

// Apps Script の FetchUrlApp.fetch() 互換のパラメータデフォルト値
var DEFAULT_PARAMS = {
  method: 'GET',
  contentType: 'application/x-www-form-urlencoded',
  headers: {},
  escaping: true,
  validateHttpsCertificates: true,
  followRedirects: true,
}

function fetch(url, params) {

  params = mergeDefaultParams(params);

  // FetchUrlApp用のパラメータから Node の request モジュール向けにパラメータを変換
  var req = {
    // url: params.escaping ? encodeURI(url) : url,
    url: url,
    method: params.method,
    headers: params.headers,
    rejectUnauthorized: params.validateHttpsCertificates,
    followAllRedirects: params.followRedirects,
  };

  req.headers['Content-Type'] = params.contentType;

  if (params.contentType.toUpperCase().indexOf('JSON') >= 0) {
    req.json = params.payload;
  } else if (params.contentType.toUpperCase().indexOf('FORM') >= 0) {
    req.form = params.payload;
  }

  var res = spawnSync(process.execPath, [require.resolve('./MockHttpClientWorker')], {input: JSON.stringify(req) + '\r\n'});

  if (res.status !== 0) {
    throw new Error(res.stderr.toString());
  }

  if (res.error) {
    if (typeof res.error === 'string') res.error = new Error(res.error);
    throw res.error;
  }

  var response = JSON.parse(res.stdout);

  if (response.success) {
    return new MockHttpResponse(response.response.statusCode, response.response.headers, response.response.body);
  } else {
    var err;
    if (response.error) {
      err = new Error(JSON.stringify(response.error));
    } else {
      err = new Error(JSON.stringify(response));
    }

    if (response.error.code) {
      err.code = response.error.code;
    }
    throw err;
  }
}

/**
 * Apps Script の FetchUrlApp.fetch(url, params) の paramsに
 * 値が未指定のパラメータにはデフォルト値を設定します。
 * パラーメータを表す連想配列は新たに生成されるので引数で渡されたものが変更される事は有りません。
 *
 * @param {Object} params Apps Script の FetchUrlApp.fetch(url, params) と互換のパラメータ
 * @return {Object} 値が未指定のパラメータにはデフォルト値を設定された連想配列。
 */
function mergeDefaultParams(params) {
  params = params ? Object.keys(params).reduce((ctx, key) => {ctx[key] = params[key]; return ctx}, {}) : {};

  // デフォルト値とマージ
  Object.keys(DEFAULT_PARAMS).forEach(function(key) {
    if (params[key] === undefined) {
      if (typeof(DEFAULT_PARAMS[key]) === 'object') {
        params[key] = Object.keys(DEFAULT_PARAMS[key]).reduce(function(c, v) {
          c[v] = DEFAULT_PARAMS[key][v];
          return c;
        }, {});
      } else {
        params[key] = DEFAULT_PARAMS[key];
      }
    } else {
      if (typeof(DEFAULT_PARAMS[key]) === 'object') {
        Object.keys(DEFAULT_PARAMS[key]).reduce(function(c, v) {
          if (c[v] === undefined) {
            c[v] = DEFAULT_PARAMS[key][v];
          }
          return c;
        }, params[key]);
      }
    }
  });

  return params;
}

function mockSetDefaultParam(key, value) {
  DEFAULT_PARAMS[key] = value;
}

module.exports = {
  fetch: fetch,
  mockSetDefaultParam: mockSetDefaultParam,
}
