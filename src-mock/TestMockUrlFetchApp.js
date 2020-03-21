var concat = require('concat-stream');
var spawn = require('child_process').spawn;
var spawnSync = require('child_process').spawnSync;
var url = require('url');
var MockUrlFetchApp = require('./MockUrlFetchApp');

global.Logger = require('./MockLogger');

function gastTestRunner(test) {

  test('テスト: fetch() GET', function (t) {

    // テスト用のHTTPサーバーの設定
    var serverOptions = JSON.stringify({
      port: 10080,
      responseCode: 200,
      contentText: 'OK'
    });

    // テスト用のHTTPサーバーを起動
    var p = spawn(process.execPath, [require.resolve('./MockHttpServerWorker')]);
    p.unref();
    process.on('exit', function() {
      p.kill();
    });
    p.stdin.write(serverOptions);
    p.stdin.end();

    var res = MockUrlFetchApp.fetch('http://localhost:10080/').getContentText();
    t.equal(res, 'OK', '期待したレスポンスボディがサーバーから取得できていること');

    p.stdout.pipe(concat((outJson) => {
      // HTTPサーバーの標準出力にはクライアントから送られたデータが色々出てくるので
      // その情報を元にテストを行うことができる。
      var out = JSON.parse(outJson);
      // サーバーに送られた情報はここでテストできる
      t.equal(out.method, 'GET', 'HTTPメソッドがGETで有ること');
    }));

    test('テスト: fetch() POST', function (t) {

      // テスト用のHTTPサーバーを起動
      var serverOptions = JSON.stringify({
        port: 10080,
        responseCode: 200,
        contentText: 'OK',
      });

      var p = spawn(process.execPath, [require.resolve('./MockHttpServerWorker')]);
      p.unref();
      process.on('exit', function() {
        p.kill();
      });
      p.stdin.write(serverOptions);
      p.stdin.end();

      var reqParam = {
        method: 'POST',
        contentType: 'application/json',
        payload: {'hoge':'a', 'fuga':'b'},
        validateHttpsCertificates: false,
      };

      var res = MockUrlFetchApp.fetch('http://localhost:10080/?asdf=xxx', reqParam).getContentText();
      t.equal(res, 'OK', '期待したレスポンスボディがサーバーから取得できていること');

      p.stdout.pipe(concat((outJson) => {
        // HTTPサーバーの標準出力にはクライアントから送られたデータが出てくるので
        // その情報を元にテストを行うことができる。
        var out = JSON.parse(outJson.toString());
        t.equal(out.method, 'POST', 'HTTPメソッドがPOSTで有ること');

        var body = JSON.parse(out.body);
        t.equal(body.hoge, 'a', 'POSTボディが送信されていること');
        t.equal(body.fuga, 'b', 'POSTボディが送信されていること');
      }));
    });
  });

  test('テスト: fetch() GET with SSL', function (t) {

    // テスト用のHTTPサーバーの設定
    var serverOptions = JSON.stringify({
      port: 10080,
      responseCode: 200,
      contentText: 'OK',
      ssl: true,
    });

    // テスト用のHTTPサーバーを起動
    var p = spawn(process.execPath, [require.resolve('./MockHttpServerWorker')]);
    p.unref();
    process.on('exit', function() {
      p.kill();
    });
    p.stdin.write(serverOptions);
    p.stdin.end();

    var reqParam = {
      validateHttpsCertificates: false,
    };

    var res = MockUrlFetchApp.fetch('https://localhost:10080/', reqParam).getContentText();
    t.equal(res, 'OK', '期待したレスポンスボディがサーバーから取得できていること');

    p.stdout.pipe(concat((outJson) => {
      // HTTPサーバーの標準出力にはクライアントから送られたデータが色々出てくるので
      // その情報を元にテストを行うことができる。
      var out = JSON.parse(outJson);
      // サーバーに送られた情報はここでテストできる
      t.equal(out.method, 'GET', 'HTTPメソッドがGETで有ること');
    }));

    test('テスト: fetch() POST with SSL', function (t) {

      // テスト用のHTTPサーバーを起動
      var serverOptions = JSON.stringify({
        port: 10080,
        responseCode: 200,
        contentText: 'OK',
        ssl: true,
      });

      var p = spawn(process.execPath, [require.resolve('./MockHttpServerWorker')]);
      p.unref();
      process.on('exit', function() {
        p.kill();
      });
      p.stdin.write(serverOptions);
      p.stdin.end();

      var reqParam = {
        method: 'POST',
        contentType: 'application/json',
        payload: {'hoge':'a', 'fuga':'b'},
        validateHttpsCertificates: false,
      };

      var res = MockUrlFetchApp.fetch('https://localhost:10080/?asdf=xxx', reqParam).getContentText();
      t.equal(res, 'OK', '期待したレスポンスボディがサーバーから取得できていること');

      p.stdout.pipe(concat((outJson) => {
        // HTTPサーバーの標準出力にはクライアントから送られたデータが出てくるので
        // その情報を元にテストを行うことができる。
        var out = JSON.parse(outJson.toString());
        t.equal(out.method, 'POST', 'HTTPメソッドがPOSTで有ること');

        var body = JSON.parse(out.body);
        t.equal(body.hoge, 'a', 'POSTボディが送信されていること');
        t.equal(body.fuga, 'b', 'POSTボディが送信されていること');
      }));
    });

    test('テスト: fetch() POST with リダイレクト', function (t) {

      // テスト用のHTTPサーバーを起動
      var serverOptions = JSON.stringify({
        port: 10080,
        responseCode: 302,
        contentText: 'OK',
        headers: {
          Location: 'https://www.google.co.jp/',
        },
        ssl: true,
      });

      var p = spawn(process.execPath, [require.resolve('./MockHttpServerWorker')]);
      p.unref();
      process.on('exit', function() {
        p.kill();
      });
      p.stdin.write(serverOptions);
      p.stdin.end();

      var reqParam = {
        method: 'POST',
        contentType: 'application/json',
        payload: {'hoge':'a', 'fuga':'b'},
        validateHttpsCertificates: false,
        followRedirects: true,
      };

      var res = MockUrlFetchApp.fetch('https://localhost:10080/?asdf=xxx', reqParam).getContentText();
      t.equal(res.indexOf('window.google') >= 0, true, 'リダイレクトに追随してコンテンツを取得できること');
    });

    // TODO form-url-encoded や
  });
}

module.exports.gastTestRunner = gastTestRunner;
