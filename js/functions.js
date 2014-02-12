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

if(!Date.prototype.adjustDate){
    Date.prototype.adjustDate = function(days){
        var date;

        days = days || 0;

        if(days === 0){
            date = new Date( this.getTime() );
        } else if(days > 0) {
            date = new Date( this.getTime() );

            date.setDate(date.getDate() + days);
        } else {
            date = new Date(
                this.getFullYear(),
                this.getMonth(),
                this.getDate() - Math.abs(days),
                this.getHours(),
                this.getMinutes(),
                this.getSeconds(),
                this.getMilliseconds()
            );
        }

        this.setTime(date.getTime());

        return this;
    };
}