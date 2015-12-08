[![Build Status](https://travis-ci.org/zolotyh/angular-kk-timepicker.svg?branch=master)](https://travis-ci.org/zolotyh/angular-kk-timepicker)
[![Coverage
Status](https://coveralls.io/repos/zolotyh/angular-kk-timepicker/badge.svg?branch=master&service=github)](https://coveralls.io/github/zolotyh/angular-kk-timepicker?branch=master)

# angular-kk-timepicker

angular.module('kk.timepicker')

```
<kk-timepicker settings="settings" ng-model="time"></kk-timepicker>
```

```
angular.module('timepickerTest', ['kk.timepicker'])
.controller('indexCtrl', function($scope){
  $scope.settings = {
    default: function(){
      var date = new Date();
      return date;
    }
  };
});
```

#demo and documentation:

http://zolotyh.github.io/angular-kk-timepicker/




