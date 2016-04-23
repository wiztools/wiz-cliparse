var expect = require('chai').expect;
var program = require('../lib/program');

describe("test parse", function(){
  var args = ['-a', '--back', 'cmd', '-trace', 'arg1', 'arg2'];
  it('checks parse', function(done){
    var prg = new program.Program();
    var res = prg.parse(args);
    expect('cmd').to.equals(res.cmd);
    expect(['-a', '--back']).to.deep.equals(res.gopts);
    expect(['-trace']).to.deep.equals(res.opts);
    expect(['arg1', 'arg2']).to.deep.equals(res.args);
    done();
  });
});
