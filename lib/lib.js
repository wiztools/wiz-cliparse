'use strict';

var Opt = require('./opt');

exports.getOpt = function(arr, str) {
  for(let o of arr) {
    if(o.short === str || o.long === str) {
      return o;
    }
  }
  return null;
}

exports.cleanOpt = function(opt) {
  if(opt.startsWith('--')) {
    return opt.substr(2);
  }
  else if(opt.startsWith('-')) {
    return opt.substr(1);
  }
  return opt;
}

exports.mandatoryOptsCheck = function(allOpts, userInputOpts) {
  // if any option with ignoreMandatoryOptCheck option is input'd by the user,
  // mandatory check will NOT be performed:
  for(let o of allOpts) {
    if(o.ignoreMandatoryOptCheck) {
      let oStr = o.long? o.long: o.short;
      if(userInputOpts.has(oStr)) {
        return;
      }
    }
  }

  // throw error when mandatory opt is not present:
  for(let o of allOpts) {
    if(o.isMandatory) {
      let oStr = o.long? o.long: o.short;
      if(oStr) {
        if(!userInputOpts.has(oStr)) {
          throw `Mandatory option missing: ${oStr}.`;
        }
      }
    }
  }
}

exports.addOpt = function(obj, short, long, description, conf) {
  var opt = new Opt(short, long, description, conf);
  obj.opts.push(opt);
  return opt;
}
