"use strict";

var Opt = require('./opt');
var lib = require('./lib');
var Command = require('./command');
var async = require('async');

var Program = function(cmd, description) {
  this.cmd = cmd;
  this.description = description;
  this.opts = [];
  this.cmds = [];
}

Program.prototype.addOpt = function(short, long, description) {
  var opt = new Opt(short, long, description);
  this.opts.push(opt);
}

Program.prototype.addCmd = function(cmd, description) {
  var cmd = new Command(cmd, description);
  this.cmds.push(cmd);
  return cmd;
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

var cleanOpt = function(opt) {
  if(opt.startsWith('--')) {
    return opt.substr(2);
  }
  else if(opt.startsWith('-')) {
    return opt.substr(1);
  }
  return opt;
}

Program.prototype.parseSync = function(arr) {
  var res = {
    cmd: null,
    gopts: [],
    opts: [],
    args: []
  };
  var cmdStr = null;

  for(let item of arr){
    if(item.startsWith('--') || item.startsWith('-')) {
      if(cmdStr == null) {
        res.gopts.push(cleanOpt(item));
      }
      else {
        res.opts.push(cleanOpt(item));
      }
    }
    else {
      if(cmdStr == null) {
        cmdStr = item;
      }
      else {
        res.args.push(item);
      }
    }
  }
  res.cmd = cmdStr;

  // Now validate:
  // 1. Global opts:
  var gopts = new Set();
  for(let oStr of res.gopts) {
    let o = this.getOpt(oStr);
    if(!o) {
      throw `Unrecognized global option: ${oStr}.`;
    }
    if(o.short) gopts.add(o.short);
    if(o.long) gopts.add(o.long);
  }

  // 2. Command:
  if(cmdStr != null) {
    var cmd = this.getCmd(cmdStr);
    if(!cmd) { // not a valid command!
      throw `Unrecognized command: ${cmdStr}.`;
    }
  }

  // 3. Command opts:
  var opts = new Set();
  for(let oStr of res.opts) {
    let o = cmd.getOpt(oStr);
    if(!o) {
      throw `Unrecognized option ${oStr} for command ${cmdStr}.`;
    }
    if(o.short) opts.add(o.short);
    if(o.long) opts.add(o.long);
  }

  return {
    cmd: cmdStr,
    gopts: gopts,
    opts: opts,
    args: res.args
  };
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
