'use strict';

var Opt = function(short, long, description, conf) {
  this.short = short;
  this.long = long;
  this.description = description;

  // Set option configs:
  this.isMandatory = false;
  this.hasArg = false;
  this.defaultArg = null;
  this.multiArg = false;
  this.noMandatoryOptCheck = false;

  if(conf) {
    if(conf.isMandatory === true) {
      this.isMandatory = true;
    }
    if(conf.hasArg === true) {
      this.hasArg = true;
    }
    if(conf.defaultArg) {
      this.defaultArg = conf.defaultArg;
    }
    if(conf.multiArg === true) {
      this.multiArg = true;
    }
    if(conf.noMandatoryOptCheck === true) {
      this.noMandatoryOptCheck = true;
    }
  }
}

module.exports = Opt;
