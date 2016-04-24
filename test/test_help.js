var Program = require('../lib/program');

var prg = new Program('mycmd', '[global-options] [command] [command-options]');
prg.addOpt('a', null, 'all option.');
prg.addOpt('b', 'back', 'back description.');
var cmd = prg.addCmd('cmd', 'cmd description.');
cmd.addOpt('t', 'trace', 'trace description.');

describe('visual check of help', function(){
  prg.help(console.log);
});
