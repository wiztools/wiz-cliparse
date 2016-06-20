'use strict';

var Opt = require('./opt');
var lib = require('./lib');

var Command = function(name, shortDesc, usage, longDesc, conf) {
  this.name = name;
  this.shortDesc = shortDesc;
  this.usage = usage;
  this.longDesc = longDesc;
  this.opts = [];

  this.ignoreMandatoryOptCheck = false;
  if(conf) {
    if(conf.ignoreMandatoryOptCheck === true) {
      this.ignoreMandatoryOptCheck = true;
    }
  }
}

Command.prototype.addOpt = function(short, long, description, conf) {
  return lib.addOpt(this, short, long, description, conf);
}

Command.prototype.getOpt = function(str) {
  return lib.getOpt(this.opts, str);
}

module.exports = Command;
