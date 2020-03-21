function  log (obj) {
  console.log.apply(console, arguments);
}

module.exports.log = log;
