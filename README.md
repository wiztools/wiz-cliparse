# WizTools.org Cli Parse

## Install

    npm install https://github.com/wiztools/wiz-cliparse.git

## Use

```js
var Program = require('wiz-cliparse');

// Defining the program and its global options:
var prg = new Program('mycli', 'my cli tool.');
prg.addOpt('v', 'verbose', 'enable verbose output.');

// Adding commands and their options:
var cmdA = prg.addCmd('abc', 'abc command.');
cmdA.addOpt('c', 'comprehensive', 'comprehensive details.');
var cmdX = prg.addCmd('xyz', 'xyz command.');

// Parsing:

// 1. Success:
var res = prg.parse(['-v', 'abc', '-c', 'arg1', 'arg2']);
console.log(res.gopts.has('v')); // prints `true`
console.log(res.cmd); // prints `abc`
console.log(res.opts.has('c')); // prints `true`
console.log(res.args); // prints `['arg1', 'arg2']`

// 2. Failures:
// Will throw error:
prg.parse(['-x']); // Unrecognized global option: x.
prg.parse(['def']); // Unrecognized command: def.
prg.parse(['abc', '--frugal']); // Unrecognized option frugal for command abc.
```
