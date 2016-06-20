'use strict';

var Opt = require('./opt');
var lib = require('./lib');

var Command = function(name, shortDesc, usage, longDesc) {
  this.name = name;
  this.shortDesc = shortDesc;
  this.usage = usage;
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
