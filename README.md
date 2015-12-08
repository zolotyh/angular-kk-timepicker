# angular-kk-timepicker

angular.module('kk.timepicker')

```
<kk-timepicker settings="settings" ng-model="time"></kk-timepicker>
```

```
angular.module('timepickerTest', ['kk.timepicker'])
.controller('indexCtrl', function($scope){
  var ctrl = this;
  ctrl.settings = {
    default: function(){
      var date = new Date();
      date.setHours(1);
      date.setMinutes(2);
      return date;
    }
  };
});
```

#demo and documentation:

http://zolotyh.github.io/angular-kk-timepicker/




