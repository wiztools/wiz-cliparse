var expect = require('chai').expect;
var Program = require('../lib/program');

describe("test parse", function(){
  var args = ['-a', '--back', 'cmd', '--trace', 'arg1', 'arg2'];
  it('checks parse', function(done){
    var prg = new Program('mycmd', 'description of mycmd.');
    prg.addOpt('a', null, 'all option.');
    prg.addOpt('b', 'back', 'back description.');
    var cmd = prg.addCmd('cmd', 'cmd description.');
    cmd.addOpt('t', 'trace', 'trace description.');
    var res = prg.parse(args);
    expect('cmd').to.equals(res.cmd);
    expect(new Set(['a', 'b', 'back'])).to.deep.equals(res.gopts);
    expect(new Set(['t', 'trace'])).to.deep.equals(res.opts);
    expect(['arg1', 'arg2']).to.deep.equals(res.args);
    done();
  });
});
