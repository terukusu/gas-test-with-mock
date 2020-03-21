var MockUtilities = require('./MockUtilities');
var crypto = require('crypto');

function gastTestRunner(test) {
  // テスト用のキーペア。流出しても何の害もないもの
  var privateKey = '-----BEGIN RSA PRIVATE KEY-----\n'
    + 'MIIEpAIBAAKCAQEA17uhYmU7CSrMClouauq4MibSIltdfP9oP1woglQfU0m8cq+c\n'
    + '+n8qOiO8SrhmhCZvr9Wnx8j82ugKOF+IW5Ylo/uWfDkSapqREcpjW2STPoV80cFD\n'
    + '3JiIxP25GHWsnVVejam9ml/4taNWNt1WvEnZb+qfGJ70PJlFmOmMmY6nIi58luwx\n'
    + 'VyNEKzyxv8KTvKzw7PsGW3SGC6+P3w1fg0bmRYqCGcUFB77+ulCs3vouu3RxB6GO\n'
    + 'yXV64D4c2T+IlfNuxKHy6/onu0aKVbOV+wTJwxEa6DW7H/GpxaFwy64vDyHHfo7W\n'
    + 'MRqWsJJULPGnaewemvr8efqYtFlztEoc9zjwwQIDAQABAoIBAQCoAkESHyJV5lWX\n'
    + 'blod/ARNUnxuM1dghIxMY9pMfXUT6SXw7yFC2IwrUS9PxcJZApISj0MmTTnWxcVH\n'
    + '1+aa5RkVV1cAEXZtPUjjYQn14CLoGw91T50pDEXfnHVtPh+bPCPyEZJOypUn6De5\n'
    + 'bLEi3CSRi1gx1YECPJ++EYzk/frdm4ZwBB/qA9DltEu/i4qRJ3AkpFjpQTq8b5Oy\n'
    + 'dKesusnGQEFg4Atm2a4AUhz3E4EiQCJdjxiEf4DTt0EyuUDguyhlCnGx5cZ+38ZN\n'
    + 'G7CQcKBuaQxFR1srgUQsBrzBu6GTpLb0LqVHMBOidqUYZK5F6taFumUUWaxQbxsr\n'
    + 'vzanya0BAoGBAO0BirUNq4F4CUmDY3uvNsPjGTPq4C+Xz6Vj/bPTSbLhjqG2LNhw\n'
    + 'YwUPO7dqPatCoMlFqpWNecHT/qIwHJBOUJAjXiAyiVJe35VJ6dFZGe6r+zVPo4Uv\n'
    + '/oyborBbhXrg1/wU/JeOJecnf1nhp5KMTI9fsocFzHFMG0AedzcGVLtxAoGBAOkF\n'
    + 'pWEcX1L7KT96fD68Wf7u56M2l2W6MwGtsZRBwU9VTr5zoLMZiIBC8ufByUw25etu\n'
    + 'mGQJhP4skv9IZ7kYohtLciUm4KXoklPlF23PDvMw1tCp3MSU4EgEb/5vi42ZHiOq\n'
    + 'WNJhyLp1A8CFsbQ6lcWCaYDw9DF/ltt1eFyLPsJRAoGANm0mN1G+UusH5vPfQqYI\n'
    + 'A5ABV6TWetd3/dkqh8M7p3KY2JYHUmTsuFq5MfOZ2dxhJBd1hwaIMXTHguNdi94Q\n'
    + 'LimREf/I/TuASL5CjarSg7bG54U0Xf+ZixyqjalWy9Mahm8jWoJwPdcaLb/eRY8m\n'
    + 'fb5SNyOjwVji4SSd5+ryRmECgYEAwkFsrtoiNWEf78VCUmJefAHZpNxbtfhVkS6l\n'
    + 'fTyb1HD/ZhGqg+PjQVmOedm44Apb/bqC29J7xhCOsrY/kbSRX0Oz8njIikapxbqT\n'
    + 'n30fr2ili+ovGsopdqAMZQXERtTApWbbCPdviNEHwbUygVbdiHvBTDaSu7jroCP7\n'
    + 'pNqIBSECgYBztuzPoSOFsN73gOyV2G0syOaxbj197NcSL8ybbsm19isRXtOr7Og5\n'
    + '1LQ3hoP1ebPQZOnnWrHOdXY809fSEgOZl2t33QXE0aW7qDyc8ZR61Uh7SgobiP+B\n'
    + 'sotuHRGf1KssTblaJp3O8seyTwYl1SRaPVHwz86Ly2B48oXjI04uGA==\n'
    + '-----END RSA PRIVATE KEY-----\n';

  var publicKey = '-----BEGIN PUBLIC KEY-----\n'
    + 'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA17uhYmU7CSrMClouauq4\n'
    + 'MibSIltdfP9oP1woglQfU0m8cq+c+n8qOiO8SrhmhCZvr9Wnx8j82ugKOF+IW5Yl\n'
    + 'o/uWfDkSapqREcpjW2STPoV80cFD3JiIxP25GHWsnVVejam9ml/4taNWNt1WvEnZ\n'
    + 'b+qfGJ70PJlFmOmMmY6nIi58luwxVyNEKzyxv8KTvKzw7PsGW3SGC6+P3w1fg0bm\n'
    + 'RYqCGcUFB77+ulCs3vouu3RxB6GOyXV64D4c2T+IlfNuxKHy6/onu0aKVbOV+wTJ\n'
    + 'wxEa6DW7H/GpxaFwy64vDyHHfo7WMRqWsJJULPGnaewemvr8efqYtFlztEoc9zjw\n'
    + 'wQIDAQAB\n'
    + '-----END PUBLIC KEY-----\n';

  test('テスト: base64Encode()', function (t) {
    var encoded = MockUtilities.base64Encode('Hello World');
    t.equal(encoded, 'SGVsbG8gV29ybGQ=', '文字列が正しくbase64エンコード(base64url)されたていること');
  });

  test('テスト: computeRsaSha256Signature()', function (t) {
    var data = 'Hello World日本語も含まれてるでー';

    var sign = crypto.createSign('RSA-SHA256');
    sign.update(data, 'utf-8');
    var expectedSignature = sign.sign(privateKey, 'latin1');
    var expectedSignatureBase64 = new Buffer(expectedSignature, 'latin1').toString('base64');

    var signature = MockUtilities.computeRsaSha256Signature(data, privateKey);
    var signatureBase64 = new Buffer(signature, 'latin1').toString('base64');

    t.equal(signatureBase64, expectedSignatureBase64, '署名が期待している値と一致していること');

    var verify = crypto.createVerify('RSA-SHA256');
    verify.write(data);
    verify.end();
    var isVerified = verify.verify(publicKey, signature, 'latin1')

    t.equal(isVerified, true, '署名が検証できること');
  });
}

module.exports.gastTestRunner = gastTestRunner;
