'use strict'

Date.prototype.yyyymmdd = function() {
  var mm = this.getMonth() + 1; // getMonth() is zero-based
  var dd = this.getDate();

  return [this.getFullYear(),
          (mm>9 ? '' : '0') + mm,
          (dd>9 ? '' : '0') + dd
         ].join('');
};

Date.prototype.toStringYMDhms = function() {
  var mm = this.getMonth() + 1; // getMonth() is zero-based
  var dd = this.getDate();

  return [this.getFullYear(),
          (mm>9 ? '' : '0') + mm,
          (dd>9 ? '' : '0') + dd
         ].join('.') + " "+
         [(this.getHours()  >9 ? '' : '0') + this.getHours(),
          (this.getMinutes()>9 ? '' : '0') + this.getMinutes(),
          (this.getSeconds()>9 ? '' : '0') + this.getSeconds(),
         ].join(':');
};
