"use strict";

var expect = require('chai').expect;
var Program = require('../lib/program');

describe("test parse", function(){
  it('success parse', function(done){
    var prg = new Program('mycmd', 'usage of mycmd.');
    prg.addOpt('a', null, 'all option.');
    prg.addOpt('b', 'back', 'back description.');
    var cmd = prg.addCmd('cmd', 'cmd description.');
    cmd.addOpt('t', 'trace', 'trace description.');

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
    var prg = new Program('mycmd', 'usage of mycmd.');
    prg.addOpt('a', null, 'all option.');
    prg.addOpt('b', 'back', 'back description.');
    var cmd = prg.addCmd('cmd', 'cmd description.');
    cmd.addOpt('t', 'trace', 'trace description.');

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

  it('multi-short option test', function(){
    var prg = new Program('mycmd', 'usage of mycmd.');
    prg.addOpt('a', null, 'all option.');
    prg.addOpt('b', 'back', 'back description.');
    var cmd = prg.addCmd('cmd', 'cmd description.');

    var args = ['-ab', 'cmd'];
    var res = prg.parseSync(args);
    expect(res.gopts.has('a')).to.be.ok;
    expect(res.gopts.has('back')).to.be.ok;
  });

  it('test mandatory option', function(){
    var prg = new Program('mycmd', 'usage of mycmd.');
    prg.addOpt('a', null, 'all option.', {isMandatory: true});
    prg.addOpt('b', 'back', 'back description.');
    var cmd = prg.addCmd('cmd', 'cmd description.');

    var args = ['-b', 'cmd'];
    expect(
      function() {
        var res = prg.parseSync(args);
      }
    ).to.throw('Mandatory option missing: a.');
  });

  it('test +ve global opt argument', function(){
    var prg = new Program('mycmd', 'usage of mycmd.');
    prg.addOpt('a', null, 'all option.', {isMandatory: true, hasArg: true});

    var args = ['-a', 'a-value'];
    var res = prg.parseSync(args);
    expect(res.goptArg.get('a')).to.equal('a-value');
  });

  it('test -ve global opt argument', function(){
    var prg = new Program('mycmd', 'usage of mycmd.');
    prg.addOpt('a', null, 'all option.', {isMandatory: true, hasArg: true});

    var args = ['-a'];
    expect(
      function() {
        var res = prg.parseSync(args);
      }
    ).to.throw('Argument expected for option: a.');
  });

  it('test +ve command opt argument', function(){
    var prg = new Program('mycmd', 'usage of mycmd.');
    var cmd = prg.addCmd('cmd', 'cmd description.');
    cmd.addOpt('x', null, 'except opt.', {hasArg: true});

    var args = ['cmd', '-x', 'x-value'];
    var res = prg.parseSync(args);
    expect(res.optArg.get('x')).to.equal('x-value');
  });

  it('test -ve command opt argument', function(){
    var prg = new Program('mycmd', 'usage of mycmd.');
    var cmd = prg.addCmd('cmd', 'cmd description.');
    cmd.addOpt('x', null, 'except opt.', {hasArg: true});

    var args = ['cmd', '-x'];
    expect(
      function() {
        var res = prg.parseSync(args);
      }
    ).to.throw('Argument expected for option: x.');
  });

  it('test -ve global opt argument with short cmd followed by another', function(){
    var prg = new Program('mycmd', 'usage of mycmd.');
    prg.addOpt('x', null, 'except opt.', {hasArg: true});
    prg.addOpt('y', null, 'y for yellow.');

    var args = ['-xy'];
    expect(
      function() {
        var res = prg.parseSync(args);
      }
    ).to.throw('Argument expected for option: x.');
  });
});
