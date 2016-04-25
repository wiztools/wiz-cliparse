"use strict";

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
