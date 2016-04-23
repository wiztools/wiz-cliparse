var opt = require('./opt');
var cmd = require('./command');
var result = require('./result');

var program = function(cmd, description) {
  this.cmd = cmd;
  this.description = description;
  this.opts = [];
  this.cmds = [];
}

program.prototype.addOpt = function(short, long, description) {
  var opt = new opt.Opt(short, long, description);
  this.opts.push(opt);
}

program.prototype.addCmd = function(cmd, description) {
  var cmd = new cmd.Command(cmd, description);
  this.cmds.push(cmd);
}

program.prototype.parse = function(arr) {
  var res = new result.Result();

  var cmd = null;
  for(item of arr){
    if(item.startsWith('--') || item.startsWith('-')) {
      if(cmd == null) {
        res.gopts.push(item);
      }
      else {
        res.opts.push(item);
      }
    }
    else {
      if(cmd == null) {
        cmd = item;
      }
      else {
        res.args.push(item);
      }
    }
  }
  res.cmd = cmd;

  // Now validate:
  // TBD!

  return res;
}

exports.Program = program;
