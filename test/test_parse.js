"use strict";

var expect = require('chai').expect;
var Program = require('../lib/program');

describe("test parse", function(){
  it('success parse', function(done){
    var prg = new Program('mycmd', 'short description of mycmd.', '[usage]');
    prg.addOpt('a', null, 'all option.');
    prg.addOpt('b', 'back', 'back description.');
    var cmd = prg.addCmd('cmd', 'cmd description.', 'usage');
    cmd.addOpt('t', 'trace', 'trace description.');

    var args = ['-a', '--back', 'cmd', '--trace', 'arg1', 'arg2'];
    var res = prg.parse(args);

    expect('cmd').to.equal(res.cmd);
    expect(new Set(['a', 'b', 'back']).toString())
      .to.equal(res.gopts.toString());
    expect(new Set(['t', 'trace']).toString())
      .to.equal(res.opts.toString());
    expect(['arg1', 'arg2']).to.deep.equal(res.args);
    done();
  });

  it('failure parse', function(){
    var prg = new Program('mycmd', 'short description of mycmd.');
    prg.addOpt('a', null, 'all option.');
    prg.addOpt('b', 'back', 'back description.');
    var cmd = prg.addCmd('cmd', 'cmd description.', 'usage');
    cmd.addOpt('t', 'trace', 'trace description.');

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

  it('multi-short option test', function(){
    var prg = new Program('mycmd', 'short description of mycmd.');
    prg.addOpt('a', null, 'all option.');
    prg.addOpt('b', 'back', 'back description.');
    var cmd = prg.addCmd('cmd', 'cmd description.', 'usage');

    var args = ['-ab', 'cmd'];
    var res = prg.parse(args);
    expect(res.gopts.has('a')).to.be.ok;
    expect(res.gopts.has('back')).to.be.ok;
  });

  it('test mandatory option', function(){
    var prg = new Program('mycmd', 'short description of mycmd.');
    prg.addOpt('a', null, 'all option.', {isMandatory: true});
    prg.addOpt('b', 'back', 'back description.');
    var cmd = prg.addCmd('cmd', 'cmd description.', 'usage');

    var args = ['-b', 'cmd'];
    expect(
      function() {
        var res = prg.parse(args);
      }
    ).to.throw('Mandatory option missing: a.');
  });

  it('test +ve global opt argument', function(){
    var prg = new Program('mycmd', 'short description of mycmd.');
    prg.addOpt('a', null, 'all option.', {isMandatory: true, hasArg: true});

    var args = ['-a', 'a-value'];
    var res = prg.parse(args);
    expect(res.goptArg.get('a')).to.equal('a-value');
  });

  it('test -ve global opt argument', function(){
    var prg = new Program('mycmd', 'short description of mycmd.');
    prg.addOpt('a', null, 'all option.', {isMandatory: true, hasArg: true});

    var args = ['-a'];
    expect(
      function() {
        var res = prg.parse(args);
      }
    ).to.throw('Argument expected for option: a.');
  });

  it('test +ve command opt argument', function(){
    var prg = new Program('mycmd', 'short description of mycmd.');
    var cmd = prg.addCmd('cmd', 'cmd description.', 'usage');
    cmd.addOpt('x', null, 'except opt.', {hasArg: true});

    var args = ['cmd', '-x', 'x-value'];
    var res = prg.parse(args);
    expect(res.optArg.get('x')).to.equal('x-value');
  });

  it('test -ve command opt argument', function(){
    var prg = new Program('mycmd', 'short description of mycmd.');
    var cmd = prg.addCmd('cmd', 'cmd description.', 'usage');
    cmd.addOpt('x', null, 'except opt.', {hasArg: true});

    var args = ['cmd', '-x'];
    expect(
      function() {
        var res = prg.parse(args);
      }
    ).to.throw('Argument expected for option: x.');
  });

  it('test -ve global opt argument with short cmd followed by another', function(){
    var prg = new Program('mycmd', 'short description of mycmd.');
    prg.addOpt('x', null, 'except opt.', {hasArg: true});
    prg.addOpt('y', null, 'y for yellow.');

    var args = ['-xy'];
    expect(
      function() {
        var res = prg.parse(args);
      }
    ).to.throw('Argument expected for option: x.');
  });

  it('test default arg global opt', function(){
    var prg = new Program('mycmd', 'short description of mycmd.');
    prg.addOpt('x', null, 'except opt.', {hasArg: true, defaultArg: 'X Me!'});
    prg.addOpt('y', null, 'y for yellow.');

    var args = ['-xy'];
    var res = prg.parse(args);
    expect('X Me!').to.equal(res.goptArg.get('x'));
  });

  it('test default arg global opt with arg', function(){
    var prg = new Program('mycmd', 'short description of mycmd.');
    prg.addOpt('x', null, 'except opt.', {hasArg: true, defaultArg: 'X Me!'});
    prg.addOpt('y', null, 'y for yellow.');

    var args = ['-yx', 'Ping Me!'];
    var res = prg.parse(args);
    expect('Ping Me!').to.equal(res.goptArg.get('x'));
  });

  it('test default arg command opt', function(){
    var prg = new Program('mycmd', 'short description of mycmd.');
    var cmd = prg.addCmd('mycmd', 'usage', 'mycmd usage.');
    cmd.addOpt('x', null, 'except opt.', {hasArg: true, defaultArg: 'X Me!'});
    cmd.addOpt('y', null, 'y for yellow.');

    var args = ['mycmd', '-xy'];
    var res = prg.parse(args);
    expect('X Me!').to.equal(res.optArg.get('x'));
  });

  it('test multi-arg opts', function(){
    var prg = new Program('mycmd', 'short description of mycmd.');
    prg.addOpt('x', null, 'except opt.', {hasArg: true, multiArg: true});

    var args = ['-x', 'one', '-x', 'two'];
    var res = prg.parse(args);
    expect(['one', 'two']).to.deep.equal(res.goptArg.get('x'));
  });

  it('test multi-arg with default', function(){
    var prg = new Program('mycmd', 'short description of mycmd.');
    prg.addOpt('x', null, 'except opt.', {hasArg: true, multiArg: true, defaultArg: 'X Me!'});

    var args = ['-x'];
    var res = prg.parse(args);
    expect(['X Me!']).to.deep.equal(res.goptArg.get('x'));
  });

  it('test no command arguments', function(){
    var prg = new Program('mycmd', 'short description of mycmd.');
    prg.addOpt('t', null, 'trace description.')

    var args = ['arg1', '-t', 'arg2'];
    var res = prg.parse(args);
    expect(['arg1', 'arg2']).to.deep.equal(res.args);
    expect(res.gopts.has('t')).to.be.ok;
  });
});
