'use strict';

var lib = require('./lib');

var argSetMulti = function(opt, arg, key, map) {
  if(opt.multiArg) {
    let existing = map.get(key);
    if(!existing) {
      map.set(key, [arg]);
    }
    else if(existing instanceof Array) {
      existing.push(arg);
    }
  }
  else {
    map.set(key, arg);
  }
}

var optArgProcess = function(oStr, opt, cmd, res, incrArrCountFn, userInputArg) {
  let argSet = function(arg) {
    let map = cmd? res.optArg: res.goptArg;
    if(opt.short) {
      argSetMulti(opt, arg, opt.short, map);
    }
    if(opt.long) {
      argSetMulti(opt, arg, opt.long, map);
    }
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

module.exports = function(prg, arr) {
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
      let o = cmd? cmd.getOpt(oStr): prg.getOpt(oStr);
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
        let o = cmd? cmd.getOpt(oStr): prg.getOpt(oStr);
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
      if(!cmd && prg.cmds.length > 0) {
        cmd = prg.getCmd(item);
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
  // 1. Command opts:
  if(cmd) {
    lib.mandatoryOptsCheck(cmd.opts, res.opts);
  }

  // 2. Global opts:
  // Global mandatory opts check need to be done only when the given command
  // has ignoreMandatoryOptCheck set to false.
  if(cmd) {
    if(cmd.ignoreMandatoryOptCheck === false) {
      lib.mandatoryOptsCheck(prg.opts, res.gopts);
    }
  }
  else {
    lib.mandatoryOptsCheck(prg.opts, res.gopts);
  }

  // Finally!
  return res;
}
