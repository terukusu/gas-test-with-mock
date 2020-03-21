var http = require('http');
var https = require('https');
var url = require('url');
var concat = require('concat-stream');

var SERVER_KEY = '-----BEGIN RSA PRIVATE KEY-----\n'
+'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\n'
+'-----END RSA PRIVATE KEY-----\n';

var SERVER_CERT = '-----BEGIN CERTIFICATE-----\n'
+'MIIFtTCCA52gAwIBAgIJAJBOO2rbZU7hMA0GCSqGSIb3DQEBBQUAMEUxCzAJBgNV\n'
+'BAYTAkFVMRMwEQYDVQQIEwpTb21lLVN0YXRlMSEwHwYDVQQKExhJbnRlcm5ldCBX\n'
+'aWRnaXRzIFB0eSBMdGQwHhcNMTcxMjAzMTMwMDM3WhcNMTgxMjAzMTMwMDM3WjBF\n'
+'MQswCQYDVQQGEwJBVTETMBEGA1UECBMKU29tZS1TdGF0ZTEhMB8GA1UEChMYSW50\n'
+'ZXJuZXQgV2lkZ2l0cyBQdHkgTHRkMIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIIC\n'
+'CgKCAgEAr+6P57W7XcWC9FAaFF0ZPt2Rn5CLT6RfF0LcZJehI+m7/tSaQZWED2Fs\n'
+'jD2KfJZYgHLDOnNzNUBPmL3C4RNnwmnt4AXfD63mZ1xtdrfrcpsECdazpBHxC/9N\n'
+'Ow/2t9r0JnfNP44SIn7s5FbeGvd/vKTOWFjfNXBWSHmWwYi06ovJNaAzDKvzIDDT\n'
+'GOAbR+AxzYtZy+tsBW9d5SfHZzs3abIuIcNkVqknbFqmQm3Tj3h+AN8oxbbKmkzL\n'
+'Apyw2JHHUFAokaAm7jlKu7JE2UzttZ/rHuXkSRumuzdhFVwJpfkbJceKWqVDA0Zl\n'
+'Rf7Zvn3cgPadT9LWMuGLq3Gc9qbtMWw56Rn0Oi7P4Rjd6qp3emq4Aowr8TezfeUr\n'
+'lZEf7KDRJd2pPqgG1qJL7X32YFQ7SBxSRRax5+URanEKaOVcCuc+gmVhRBcv1lK3\n'
+'/KwbgVePgDAv/CshzXZOBnya3dVsl/kk1Fqti2AumYf8P/fhQqszP4EwurULtLzc\n'
+'MPmM05omlm9RY1jmIBsXaCM/8hOzU7yMWcgBvVlFPs6o6jzXUg1AYNafu58f0hqi\n'
+'/+McFGhlOmly4hfMlY8OA0GrE/WRf6Rf0zqTL1vXuAxupzvihTVzyGpeQV/lp3Rl\n'
+'EsThsnUplLYDiT8LibevnRrt6Nt/dXyECGt+ctYC0lIDZPK+jbUCAwEAAaOBpzCB\n'
+'pDAdBgNVHQ4EFgQU2PyDex7D+RwjtemSoDAb6J+crNswdQYDVR0jBG4wbIAU2PyD\n'
+'ex7D+RwjtemSoDAb6J+crNuhSaRHMEUxCzAJBgNVBAYTAkFVMRMwEQYDVQQIEwpT\n'
+'b21lLVN0YXRlMSEwHwYDVQQKExhJbnRlcm5ldCBXaWRnaXRzIFB0eSBMdGSCCQCQ\n'
+'Tjtq22VO4TAMBgNVHRMEBTADAQH/MA0GCSqGSIb3DQEBBQUAA4ICAQAAwa2yXQqI\n'
+'RmEYsrtWwbWz+2eyso5h7rqW9Oczj9+VUFgpBGk4DYIZuLjQBm9s+Tt8xcgqaeJk\n'
+'14uoCfhRH0KxnYh1lfuAASURcUdC3E8Q2G0v+V9w7xBgLQBm04Zjy4BzNlsl3jMf\n'
+'H+vNTJ/4eXGNubei0pXjdArGjiiwwVnrfXMj56cqEyU7Q397FEJFhju6b2YpyZue\n'
+'hwpSt3q7MA6fIZjboUvmyya7d4IP/10n4rz2B00qhDHqqh3E5+iVRxWOlIdshD0S\n'
+'4mD5Pft/Tl4nJtgJb535pR6uywQNXtSkJgMMPcnO+RqXbCRUNMIdF7RZHGUNx7BD\n'
+'ToayRcIU7/SCY3Fhjvzdz4I4WeUD7VYYLJIJoWVP5d5wDLy8zur/ZIlxtguekczu\n'
+'HONxtlw/vw0mNNY4j45Fum6sisiXI4IV+txonbRfudXz93Fm9GAM6t7R3g3Sn2gX\n'
+'DatAvllM+gL3rkf4pKweFfVw4qFPXeyg8Lp1Va9Uzk6n0rx5sWIsl6YLAafaX4RO\n'
+'xU07xKA6ar1ZUnFTYs6ra0IBUL+7F9JOvZ650UMIcFvz8ne4vxHrsb9DLBUPdnxP\n'
+'OvaIvxdXrO5CiC/CH2O1bnBgGdDvh/kHVNzxI9Vjr5hu6krtq/cfM4fmHowk9hTV\n'
+'1mr3PeStNm0qkAAXR1dF7nfDpDJzDrJbgw==\n'
+'-----END CERTIFICATE-----\n';

var defaults = {
  port: 10080,
  ssl: false,
  responseCode: 200,
  contentText: 'OK',
  headers: {'Content-Type': 'text/plain'},
};

var optionsJson;
process.stdin.on('data', (data) => {
  optionsJson += data.toString();
  try {
    var options = JSON.parse(data);
    startServer(options);
  } catch(e) {
    console.log(e);
  }
});

function startServer(options) {
  Object.keys(defaults).forEach(function(key) {
    options[key] = options[key] !== undefined ? options[key] : defaults[key];
  });

  var requestHandler = function (request, response) {
    try {
      // テストで確認する必要がありそうなデータは標準出力に出力しておく
      var requestSummary = ['headers','method','url'].reduce(
        (c,v) => {
          c[v] = request[v];
          return c
        }, {});

      requestSummary.query = url.parse(request.url,true).query;

      var reqBody = '';
      request.on('data', (data) => reqBody += data.toString());
      request.on('end', () => {
        requestSummary.body = reqBody;
        process.stdout.write(JSON.stringify(requestSummary));
      });

      response.writeHead(options.responseCode, options.headers);
      response.write(options.contentText);
      response.end();

    } catch (e) {
      console.log(e);
      // do nothing
    }

    server.close();
    request.connection.end();
    request.connection.destroy();
  }

  var server;

  if (options.ssl) {
    server = https.createServer({key: SERVER_KEY, cert: SERVER_CERT}, requestHandler);
  } else {
    server = http.createServer(requestHandler);
  }

  server.listen(options.port);
}
