var Opt = require('./opt');
var lib = require('./lib');

var Command = function(name, description) {
  this.name = name;
  this.description = description;
  this.opts = [];
}

Command.prototype.addOpt = function(short, long, description) {
  var opt = new Opt(short, long, description);
  this.opts.push(opt);
}

Command.prototype.getOpt = function(str) {
  return lib.getOpt(this.opts, str);
}

module.exports = Command;
