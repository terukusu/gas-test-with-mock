var MockHttpResponse = require('./MockHttpResponse');

function gastTestRunner(test) {

  test('テスト: コンストラクタ MockHttpResponse()', function (t) {
    var res = new MockHttpResponse(502, {bar: 'hoge'}, 'asdf');
    t.equal(res.getResponseCode(), 502, 'コンストラクタで設定した値がプロパティに設定されていること: 502');
    t.equal(res.getHeaders().toString(), ({bar: 'hoge'}).toString(), 'コンストラクタで設定した値がプロパティに設定されていること: {bar: \'hoge\'}');
    t.equal(res.getContentText(), 'asdf', 'コンストラクタで設定した値がプロパティに設定されていること: asdf');
  });
}

module.exports.gastTestRunner = gastTestRunner;
