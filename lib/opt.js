var Opt = function(short, long, description, conf) {
  this.short = short;
  this.long = long;
  this.description = description;

  // Set option configs:
  this.isMandatory = false;
  this.hasArg = false;
  this.defaultArg = null;
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
  }
}

module.exports = Opt;
