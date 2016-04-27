"use strict";

var sprintf = require("sprintf-js").sprintf;

const padding = 20;

var getDispOpt = function(opt) {
  if(opt.short && opt.long) return `-${opt.short}, --${opt.long}`;
  if(opt.short && (!opt.long)) return `-${opt.short}`;
  if((!opt.short) && opt.long) return `--${opt.long}`;
}

var dispOpt = function(opts, out) {
  if(opts.length > 0) {
    out();
    out(`  Options:`);
    out();
    for(let opt of opts) {
      let optCmd = getDispOpt(opt);
      out(sprintf(`    %-${padding}s %s`, optCmd, opt.description));
    }
  }
}

var renderTopHelp = function(prg, out) {
  if(prg.shortDesc) {
    out('  ' + prg.shortDesc);
    out();
  }
  out(`  Usage: ${prg.cmd} ${prg.usage}`);
  if(prg.longDesc) {
    out();
    out('  ' + prg.longDesc);
  }

  if(prg.cmds.length > 0) {
    out();
    out(`  Commands:`);
    out();
    for(let cmd of prg.cmds) {
      out(sprintf(`    %-${padding}s %s`, cmd.name, cmd.shortDesc));
    }
  }

  // display options:
  dispOpt(prg.opts, out);

  // Space before exit:
  out();
}

var renderCmdHelp = function(cmd, out) {
  out(sprintf(`  %s: %s`, cmd.name, cmd.shortDesc));
  if(cmd.usage) {
    out();
    out(`  Usage: ${cmd.name} ${cmd.usage}`);
  }

  if(cmd.longDesc) {
    out();
    out('  ' + cmd.longDesc);
  }

  // display options:
  dispOpt(cmd.opts, out);

  // Space before exit:
  out();
}

exports.renderHelp = function(prg, res, out) {
  if(!out) {
    out = console.log;
  }
  out();
  if(prg.cmds.length === 0 || res.args.length === 0) {
    renderTopHelp(prg, out);
  }
  else {
    let cmdStr = res.args[0];
    let cmd = prg.getCmd(cmdStr);
    if(cmd) {
      renderCmdHelp(cmd, out);
    }
    else {
      out.log(`No command by the name: ${cmdStr}.`);
    }
  }
}
