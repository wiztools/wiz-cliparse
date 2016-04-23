exports.getOpt = function(arr, str) {
  for(o of arr) {
    if(o.short === str || o.long === str) {
      return o;
    }
  }
  return null;
}
