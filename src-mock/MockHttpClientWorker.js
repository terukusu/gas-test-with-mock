const request = require('request');
const concat = require('concat-stream');

function respond(data) {
  process.stdout.write(JSON.stringify(data), function() {
    process.exit(0);
  });
}

process.stdin.pipe(concat(function (stdin) {
  var req = JSON.parse(stdin.toString());
  request(req, function (error, response, body) {
    respond({
      success: (error == undefined),
      error: error,
      response: response
    });
  });
}));
