"use strict";

var Opt = require('./opt');
var lib = require('./lib');
var Command = require('./command');
var async = require('async');

var Program = function(cmd, usage) {
  this.cmd = cmd;
  this.usage = usage;
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

Program.prototype.help = function(out) {
  if(!out) {
    out = console.log;
  }
  out();
  out(`  Usage: ${this.cmd} ${this.usage}`);

  if(this.cmds.length > 0) {
    out();
    out(` Commands:`);
    out();
    for(let cmd of this.cmds) {
      out(`    ${cmd.name}: ${cmd.description}`);
    }
  }

  if(this.opts.length > 0) {
    out();
    out(`  Global options:`);
    out();
    for(let opt of this.opts) {
      out(`    -${opt.short}, --${opt.long}    ${opt.description}`);
    }
  }

  // Space before exit:
  out();
}

Program.prototype.parseSync = function(arr) {
  var res = {
    cmd: null,
    gopts: new Set(),
    opts: new Set(),
    args: []
  };

  var cmd = null;
  for(let item of arr) {
    // console.log('item: ' + item);
    let set = cmd? res.gopts: res.opts;

    if(item.startsWith('--')) { // long option
      let cleaned = lib.cleanOpt(item);
      let o = cmd? cmd.getOpt(cleaned): this.getOpt(cleaned);
      if(o) {
        set.add(o.short);
        set.add(o.long);
      }
      else {
        if(cmd) throw `Unrecognized option ${item} for command ${res.cmd}.`;
        else throw `Unrecognized global option: ${item}.`;
      }
    }
    else if(item.startsWith('-')) { // short option
      let shortOpts = lib.cleanOpt(item).split(''); // each char in short opt represents a opt
      for(let oStr of shortOpts) {
        let o = cmd? cmd.getOpt(oStr): this.getOpt(oStr);
        if(o) {
          set.add(o.short);
          set.add(o.long);
        }
        else {
          if(cmd) throw `Unrecognized option ${oStr} for command ${res.cmd}.`;
          else throw `Unrecognized global option: ${oStr}.`;
        }
      }
    }
    else { // command || args
      if(!cmd) {
        cmd = this.getCmd(item);
        if(cmd) {
          res.cmd = item;
        }
        else {
          throw `Unrecognized command: ${item}.`;
        }
      }
      else {
        res.args.push(item);
      }
    }
  }
  return res;
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
