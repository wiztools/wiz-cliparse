# WizTools.org Cli Parse

[![Build Status](https://travis-ci.org/wiztools/wiz-cliparse.svg?branch=master)](https://travis-ci.org/wiztools/wiz-cliparse)

## Intro

A Node library to parse commands of structure:

    cmd [global-options] [command] [command-options] [arguments]

Can be used for simple argument parsing too:

    cmd [options] [arguments]

Was primarily written after getting disillusioned by existing libraries like [commander.js](https://github.com/tj/commander.js/). This aims to be the cli parsing library that Node deserves.

## Install

    npm install wiz-cliparse --save

## Use

```js
var Program = require('wiz-cliparse');

// Defining the program and its global options:
var prg = new Program('mycli',
  '[global-options] [command] [command-options] [arguments]', // usage. for rendering help o/p. optional.
  'short description.', // required.
  'long description.'); // optional.
prg.addOpt('v',              // short form. Usage: -v
  'verbose',                 // long form. Usage: --verbose
  'enable verbose output.'); // description.

// Adding commands and their options:
var cmdA = prg.addCmd('abc', // command name.
  '[-c, --comprehensive]',   // usage. for rendering help o/p. optional.
  'abc command short description.', // required.
  'abc command long description.'); // optional.
cmdA.addOpt('c', 'comprehensive', 'comprehensive details.');
var cmdX = prg.addCmd('xyz', null, 'xyz command.');

// Parsing:

// 1. Success:
var res = prg.parseSync(['-v', 'abc', '-c', 'arg1', 'arg2']);
console.log(res.gopts.has('v')); // prints `true`
console.log(res.cmd); // prints `abc`
console.log(res.opts.has('c')); // prints `true`
console.log(res.opts.has('comprehensive')); // prints `true`
console.log(res.args); // prints `['arg1', 'arg2']`

// 2. Failures:
// Will throw error:
prg.parseSync(['-x']); // Unrecognized global option: x.
prg.parseSync(['def']); // Unrecognized command: def.
prg.parseSync(['abc', '--frugal']); // Unrecognized option frugal for command abc.
```

### Parse result object

Has following elements:

1. `cmd` (String): The command that was called.
2. `gopts` (Set): Global options. Has both the short and long options.
3. `opts` (Set): Command options. Has both the short and long options.
4. `goptArg` (Map): A map of arguments to global options.
5. `optArg` (Map): A map of arguments to command options.
6. `args` (Array): List of arguments.

### Synchronous parse with callback

For developers who don't like using `try/catch`:

```js
prg.parseSyncCb(['abc'], function(res, err){
  if(err) { // Error object
    console.error(err.message);
  }
  else {
    // do your logic here!
  }
});
```

### Asynchronous parse

```js
prg.parse(['abc'], function(res, err){
  if(err) { // Error object
    console.error(err.message);
  }
  else {
    // do your logic here!
  }
});
```

### Parsing cli arguments

```js
var cliArg = process.argv.slice(2);
prg.parse(cliArg, /*...your code...*/);
```

### Combining short options together

It is possible to combine multiple short options as one. For example, instead of giving `-a -b`, it can be given as `-ab`.

### Options conf

Options can have configurations:

```js
prg.addOpt('x', 'exception', 'print exception trace.',
  {
    isMandatory: true,
    hasArg: true,
    defaultArg: 'X',
    multiArg: true
  });
```

Both global and command option can have these configurations:

1. `isMandatory`: Is a mandatory option.
2. `hasArg`: Option has argument.
3. `defaultArg`: Default value to assign when an when an option supporting argument is not passed argument.
4. `multiArg`: Support multiple arguments like `-H value1 -H value2`.

`defaultArg` and `multiArg` will be ignored if `hasArg` is not set to `true`.

### Retrieving argument value of an option

For global option:

```js
if(res.gopts.has('s')) {
  var arg = res.goptArg.get('s'); // or:
  arg = res.goptArg.get('long');
}
```

For command option:

```js
if(res.opts.has('s')) {
  var arg = res.optArg.get('s'); // or:
  arg = res.optArg.get('long');
}
```

### Configure and display `help`

To add help option `-h, --help`:

```js
prg.addHelpOpt();
```

To add help command:

```js
prg.addHelpCmd();
```

To add both help option and command:

```js
prg.addHelp();
```

All the three above commands accept a optional `description` string to override the default short description.

#### Display `help`

```js
// ...
prg.addHelp();
// ...
var res = prg.parseSync(/*...*/);

// From option:
if(res.gopts.has('h') || res.cmd === 'help') {
  prg.printHelp(res); // or:
  prg.printHelp(res, console.error); // if you want to print help in STDERR.
  process.exit();
}
```

This prints context sensitive help also. For example, `cmd help mycmd`, will print detailed help about `mycmd`. The order of printing help:

1. Short description.
2. Usage (if available).
3. Long description (if available).
4. Options (if available).
