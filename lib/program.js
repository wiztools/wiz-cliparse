"use strict";

var Opt = require('./opt');
var lib = require('./lib');
var Command = require('./command');
var hlp = require('./help');
var parse = require('./parse');
var async = require('async');

var Program = function(cmd, usage, shortDesc, longDesc) {
  this.cmd = cmd;
  this.usage = usage;
  this.shortDesc = shortDesc;
  this.longDesc = longDesc;
  this.opts = [];
  this.cmds = [];
}

Program.prototype.addOpt = function(short, long, description, conf) {
  var opt = new Opt(short, long, description, conf);
  this.opts.push(opt);
  return opt;
}

Program.prototype.addCmd = function(cmd, usage, shortDesc, longDesc) {
  var cmd = new Command(cmd, usage, shortDesc, longDesc);
  this.cmds.push(cmd);
  return cmd;
}

const helpDesc = 'output usage information.';

Program.prototype.addHelpOpt = function(description) {
  if(!description) {
    description = helpDesc;
  }
  return this.addOpt('h', 'help', description);
}

Program.prototype.addHelpCmd = function(description) {
  if(!description) {
    description = helpDesc;
  }
  var cmd = new Command('help', null, description);
  this.cmds.push(cmd);
  return cmd;
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

Program.prototype.parseSync = function(arr) {
  return parse(this, arr);
}

Program.prototype.parseSyncCb = function(arr, cb) {
  try {
    var res = this.parseSync(arr);
    cb(res);
  }
  catch(err) {
    cb(null, err);
  }
}

Program.prototype.parse = function(arr, cb) {
  var pll = function(){
    try {
      var res = this.parseSync(arr);
      cb(res);
    }
    catch(err) {
      cb(null, err);
    }
  }
  async.parallel([pll]);
}

module.exports = Program;
