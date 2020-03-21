function MockHttpResponse(status, header, content) {
  this.responseCode = status;
  this.headers = header;
  this.content = content;
}

MockHttpResponse.prototype.getHeaders = function() {
  return this.headers;
}

MockHttpResponse.prototype.getContentText = function(encoding) {
  if(!encoding) {
    encoding = 'utf-8';
  }
  return this.content.toString(encoding);
}

MockHttpResponse.prototype.getResponseCode = function() {
  return this.responseCode;
}

module.exports = MockHttpResponse;
