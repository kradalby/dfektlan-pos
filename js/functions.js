/* Functions that is practical */

/* Proper remove function for arrays */
Array.prototype.remove = function(from, to) {
  var rest = this.slice((to || from) + 1 || this.length);
  this.length = from < 0 ? this.length + from : from;
  return this.push.apply(this, rest);
};

/* Proper clear function for arrays */
Array.prototype.clear = function() {
  while (this.length > 0) {
    this.pop();
  }
};

/* Because python is awesome */
function dir(object) {
    var stuff = [];
    for (var s in object) {
        stuff.push(s);
    }
    stuff.sort();
    return stuff;
}

function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds){
      break;
    }
  }
}
