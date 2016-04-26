# WizTools.org Cli Parse

## Intro

A Node library to parse commands of structure:

    cmd [global-options] [command] [command-options] [arguments]

Was primarily written after getting disillusioned by existing libraries like [commander.js](https://github.com/tj/commander.js/). The aim of the library is to get the fundamentals right, and then add features.

## Install

    npm install https://github.com/wiztools/wiz-cliparse.git

## Use

```js
var Program = require('wiz-cliparse');

// Defining the program and its global options:
var prg = new Program('mycli', '[global-options] [command] [command-options] [arguments]');
prg.addOpt('v', 'verbose', 'enable verbose output.');

// Adding commands and their options:
var cmdA = prg.addCmd('abc', 'abc command.');
cmdA.addOpt('c', 'comprehensive', 'comprehensive details.');
var cmdX = prg.addCmd('xyz', 'xyz command.');

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
    defaultArg: 'X'
  });
```

Both global and command option can have these configurations:

1. `isMandatory`: Is a mandatory option.
2. `hasArg`: Option has argument.
3. `defaultArg`: Default value to assign when an when an option supporting argument is not passed argument.

`hasArg` and `defaultArg` work in tandem. `hasArg` without `defaultArg` will expect argument to be present to the option. Parse will fail otherwise. When `defaultArg` is supplied, and the user has not input an argument, the value in `defaultArg` will be associated with the option. `defaultArg` without `hasArg` set to `true` will be ignored.

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
