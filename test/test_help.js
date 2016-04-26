"use strict";

var Program = require('../lib/program');

var drawLine = function() {
  let str = '';
  for(let i=0; i<25; i++) {
    str += '-';
  }
  console.log(str);
}

describe('visual check of help', function(){
  var prg = new Program('mycmd', '[global-options] [command] [command-options]');
  prg.addOpt('h', null, 'help option.');

  var res = prg.parseSync(['-h']);
  prg.help(res, console.log);
  drawLine();
});

describe('visual check of help with command', function(){
  var prg = new Program('mycmd', '[global-options] [command] [command-options]');
  prg.addOpt('h', null, 'help option.');
  prg.addHelpCmd();
  var cmd = prg.addCmd('dummy', 'dummy cmd desc.');
  cmd.addOpt('a', 'all', 'description of all option.');

  var res = prg.parseSync(['help', 'dummy']);
  prg.help(res, console.log);
  drawLine();
});
