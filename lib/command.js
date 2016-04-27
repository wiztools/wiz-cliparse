var Opt = require('./opt');
var lib = require('./lib');

var Command = function(name, usage, shortDesc, longDesc) {
  this.name = name;
  this.usage = usage;
  this.shortDesc = shortDesc;
  this.longDesc = longDesc;
  this.opts = [];
}

Command.prototype.addOpt = function(short, long, description, conf) {
  var opt = new Opt(short, long, description, conf);
  this.opts.push(opt);
  return opt;
}

Command.prototype.getOpt = function(str) {
  return lib.getOpt(this.opts, str);
}

module.exports = Command;
