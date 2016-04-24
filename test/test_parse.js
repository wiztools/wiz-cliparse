var expect = require('chai').expect;
var Program = require('../lib/program');

var prg = new Program('mycmd', 'usage of mycmd.');
prg.addOpt('a', null, 'all option.');
prg.addOpt('b', 'back', 'back description.');
var cmd = prg.addCmd('cmd', 'cmd description.');
cmd.addOpt('t', 'trace', 'trace description.');

describe("test parse", function(){
  it('success parse', function(done){
    var args = ['-a', '--back', 'cmd', '--trace', 'arg1', 'arg2'];
    var res = prg.parseSync(args);
    expect('cmd').to.equal(res.cmd);
    expect(new Set(['a', 'b', 'back']).toString())
      .to.equal(res.gopts.toString());
    expect(new Set(['t', 'trace']).toString())
      .to.equal(res.opts.toString());
    expect(['arg1', 'arg2']).to.deep.equal(res.args);
    done();
  });

  it('failure parse', function(){
    // unrecognized command:
    expect(
      function() {
        prg.parseSync(['nocmd', '--trace', 'arg1', 'arg2']);
      }
    ).to.throw('Unrecognized command: nocmd.');

    // unrecognized gopt:
    expect(
      function() {
        prg.parseSync(['-x']);
      }
    ).to.throw('Unrecognized global option: x.');

    // unrecognized opt:
    expect(
      function() {
        prg.parseSync(['cmd', '-x']);
      }
    ).to.throw('Unrecognized option x for command cmd.');
  });
});
