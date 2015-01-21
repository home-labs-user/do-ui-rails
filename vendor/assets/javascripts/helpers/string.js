String.prototype.lTrim = function(){
  pattern = /^\s{1,}/;
  return this.replace(pattern, "");
}


String.prototype.rTrim = function(){
  pattern = /\s+$/;
  return this.replace(pattern, "");
}
