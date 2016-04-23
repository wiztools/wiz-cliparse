var opt = require('./opt');

var command = function(name, description) {
  this.name = name;
  this.description = description;
  this.opts = [];
}

command.prototype.addOpt = function(short, long, description) {
  var opt = new opt.Opt(short, long, description);
  this.opts.push(opt);
}

exports.Command = command;
