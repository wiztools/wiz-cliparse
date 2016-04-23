var expect = require('chai').expect;
var Program = require('../lib/program');

var prg = new Program('mycmd', 'description of mycmd.');
prg.addOpt('a', null, 'all option.');
prg.addOpt('b', 'back', 'back description.');
var cmd = prg.addCmd('cmd', 'cmd description.');
cmd.addOpt('t', 'trace', 'trace description.');

describe("test parse", function(){
  it('success parse', function(done){
    var args = ['-a', '--back', 'cmd', '--trace', 'arg1', 'arg2'];
    var res = prg.parse(args);
    expect('cmd').to.equals(res.cmd);
    expect(new Set(['a', 'b', 'back'])).to.deep.equals(res.gopts);
    expect(new Set(['t', 'trace'])).to.deep.equals(res.opts);
    expect(['arg1', 'arg2']).to.deep.equals(res.args);
    done();
  });

  it('failure parse', function(){
    // unrecognized command:
    expect(
      function() {
        prg.parse(['nocmd', '--trace', 'arg1', 'arg2']);
      }
    ).to.throw('Unrecognized command: nocmd.');

    // unrecognized gopt:
    expect(
      function() {
        prg.parse(['-x']);
      }
    ).to.throw('Unrecognized global option: x.');

    // unrecognized opt:
    expect(
      function() {
        prg.parse(['cmd', '-x']);
      }
    ).to.throw('Unrecognized option x for command cmd.');
  });
});
