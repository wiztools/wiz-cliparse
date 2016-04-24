exports.getOpt = function(arr, str) {
  for(o of arr) {
    if(o.short === str || o.long === str) {
      return o;
    }
  }
  return null;
}

exports.cleanOpt = function(opt) {
  if(opt.startsWith('--')) {
    return opt.substr(2);
  }
  else if(opt.startsWith('-')) {
    return opt.substr(1);
  }
  return opt;
}
