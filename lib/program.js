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

Program.prototype.addOpt = function(short, long, description, conf) {
  var opt = new Opt(short, long, description, conf);
  this.opts.push(opt);
}

Program.prototype.addCmd = function(cmd, description) {
  var cmd = new Command(cmd, description);
  this.cmds.push(cmd);
  return cmd;
}

Program.prototype.addHelpCmd = function(description) {
  if(!description) {
    description = 'output usage information';
  }
  var cmd = new Command('help', description);
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

var optArgProcess = function(oStr, opt, cmd, res, incrArrCountFn, userInputArg) {
  let argSet = function(arg) {
    let map = cmd? res.optArg: res.goptArg;
    if(opt.short) map.set(opt.short, arg);
    if(opt.long) map.set(opt.long, arg);
  }

  let oArg = userInputArg();
  if(oArg) {
    if(!oArg.startsWith('-')) {
      argSet(oArg);
      incrArrCountFn();
    }
    else if(opt.defaultArg) {
      argSet(opt.defaultArg);
    }
    else {
      throw `Argument expected for option: ${oStr}.`;
    }
  }
  else if(opt.defaultArg) {
    argSet(opt.defaultArg);
  }
  else {
    throw `Argument expected for option: ${oStr}.`;
  }
}

Program.prototype.parseSync = function(arr) {
  var res = {
    cmd: null,
    gopts: new Set(),
    opts: new Set(),
    goptArg: new Map(),
    optArg: new Map(),
    args: []
  };

  var cmd = null;
  for(let i=0; i<arr.length; i++) {
    let item = arr[i];
    let set = cmd? res.opts: res.gopts;

    let incrArrCountFn = function(){i++;}

    if(item.startsWith('--')) { // long option
      let oStr = lib.cleanOpt(item);
      let o = cmd? cmd.getOpt(oStr): this.getOpt(oStr);
      if(o) {
        if(o.short) set.add(o.short);
        if(o.long) set.add(o.long);

        if(o.hasArg) {
          let userInputArg = function() {
            if((i+1)<arr.length) return arr[i+1];
            return null;
          }
          optArgProcess(oStr, o, cmd, res, incrArrCountFn, userInputArg);
        }
      }
      else {
        if(cmd) throw `Unrecognized option ${item} for command ${res.cmd}.`;
        else throw `Unrecognized global option: ${item}.`;
      }
    }
    else if(item.startsWith('-')) { // short option
      let shortOpts = lib.cleanOpt(item).split(''); // each char in short opt represents a opt
      for(let j=0; j<shortOpts.length; j++) {
        let oStr = shortOpts[j];
        let o = cmd? cmd.getOpt(oStr): this.getOpt(oStr);
        if(o) {
          if(o.short) set.add(o.short);
          if(o.long) set.add(o.long);

          if(o.hasArg) {
            let userInputArg = function() {
              if(((j+1)==shortOpts.length) && ((i+1)<arr.length)) {
                return arr[i+1];
              }
              return null;
            }
            optArgProcess(oStr, o, cmd, res, incrArrCountFn, userInputArg);
          }
        }
        else {
          if(cmd) throw `Unrecognized option ${oStr} for command ${res.cmd}.`;
          else throw `Unrecognized global option: ${oStr}.`;
        }
      }
    }
    else { // command || args
      if(!cmd && this.cmds.length > 0) {
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

  // isMandatory option check:
  // 1. Global opts:
  lib.mandatoryOptsCheck(this.opts, res.gopts);

  // 2. Command opts:
  if(cmd) {
    lib.mandatoryOptsCheck(cmd.opts, res.opts);
  }

  // Finally!
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
