'use strict';

var Opt = require('./opt');
var lib = require('./lib');
var Command = require('./command');
var hlp = require('./help');
var parse = require('./parse');

var Program = function(cmd, shortDesc, usage, longDesc) {
  this.cmd = cmd;
  this.shortDesc = shortDesc;
  this.usage = usage;
  this.longDesc = longDesc;
  this.opts = [];
  this.cmds = [];
}

Program.prototype.addOpt = function(short, long, description, conf) {
  return lib.addOpt(this, short, long, description, conf);
}

Program.prototype.addCmd = function(cmd, shortDesc, usage, longDesc, conf) {
  var cmd = new Command(cmd, shortDesc, usage, longDesc, conf);
  this.cmds.push(cmd);
  return cmd;
}

const helpDesc = 'output usage information.';

Program.prototype.addHelpOpt = function(description) {
  if(!description) {
    description = helpDesc;
  }
  return this.addOpt('h', 'help', description, {noMandatoryOptCheck: true});
}

Program.prototype.addHelpCmd = function(description) {
  if(!description) {
    description = helpDesc;
  }
  return this.addCmd('help', description, null, null, {noMandatoryOptCheck: true});
}

Program.prototype.addHelp = function(description) {
  this.addHelpOpt(description);
  this.addHelpCmd(description);
}

Program.prototype.getOpt = function(str) {
  return lib.getOpt(this.opts, str);
}

Program.prototype.getCmd = function(str) {
  for(let c of this.cmds) {
    if(c.name === str) {
      return c;
    }
  }
  return null;
}

Program.prototype.printHelp = function(res, out) {
  hlp.renderHelp(this, res, out);
}

Program.prototype.parse = function(arr) {
  if(!arr) {
    arr = process.argv.slice(2);
  }
  return parse(this, arr);
}

Program.prototype.parseCb = function(arr, cb) {
  try {
    var res = this.parse(arr);
    cb(res);
  }
  catch(err) {
    cb(null, err);
  }
}

module.exports = Program;
