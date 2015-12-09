(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

require('./module');

require('./factories/timepickerFactory');

require('./directives/timpicker');
},{"./directives/timpicker":2,"./factories/timepickerFactory":3,"./module":4}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

require('../factories/timepickerFactory');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } } ///<reference path="./timepicker.d.ts" />
///<reference path="../factories/timepickerFactory.d.ts" />
///<reference path="../../typings/tsd.d.ts" />

var Timepicker = function Timepicker(factory) {
    var _this = this;

    _classCallCheck(this, Timepicker);

    this.link = function (scope, element, attrs, modelCtrl) {
        var $input = angular.element(element[0].querySelector('.js-input')),
            $nativeInput = angular.element(element[0].querySelector('.js-native-input')),
            UP = 38,
            DOWN = 40,
            factory = _this.factory;
        scope.touch = 'ontouchstart' in window;
        var settings = {
            addZero: true,
            default: function _default() {
                return new Date();
            }
        };
        settings = angular.extend(settings, scope.settings);
        scope.$watch('date', function (newValue, oldValue) {
            if (newValue === oldValue && !modelCtrl.$viewValue) {
                scope.date = settings.default();
                var value = factory.formatString(scope.date, settings);
                modelCtrl.$setViewValue(value);
                $input.val(value);
            }
            if (modelCtrl.$viewValue) {
                scope.date = factory.parseString(modelCtrl.$viewValue, settings);
            }
            if (!newValue) {
                return;
            }
            scope.hours = factory.getHours(scope.date, settings);
            scope.minutes = factory.getMinutes(scope.date, settings);
            scope.flag = factory.getFlag(scope.date, settings);
        }, true);
        modelCtrl.$formatters.push(function (value) {
            return factory.convert(value, settings) || value;
        });
        modelCtrl.$parsers.push(function (value) {
            return factory.convert(value, settings) || value;
        });
        var error = 'timeStringParse';
        modelCtrl.$validators[error] = function (modelValue) {
            return !!factory.convert(modelValue, settings);
        };
        var changeModel = function changeModel() {
            var value = factory.formatString(scope.date, settings);
            $input.val(value);
            modelCtrl.$setViewValue(value);
        };
        var calcSelection = function calcSelection(cursorStart, value) {
            var start = undefined;
            var end = undefined;
            if (cursorStart <= 2) {
                start = 0;
                end = 2;
            } else if (cursorStart > 2 && cursorStart < 6) {
                start = 3;
                end = 5;
            } else {
                start = 6;
                end = value.length;
            }
            return {
                start: start,
                end: end
            };
        };
        $input.on('focusin', function (e) {
            var input = $input[0];
            var value = $input.val();
            var valueIsValid = factory.checkValidity(value);
            if (!valueIsValid) {
                return;
            }
            setTimeout(function () {
                var cursorStart = input.selectionStart;
                var selection = calcSelection(cursorStart, value);
                input.setSelectionRange(selection.start, selection.end);
            });
        });
        $input.on('keydown', function (keyDownEvent) {
            var switchPosition = function switchPosition(value) {
                var inputValue = $input.val();
                var input = $input[0];
                var cursorStart = input.selectionStart;
                if (cursorStart <= 2) {
                    scope.addHours(value);
                } else if (cursorStart > 2 && cursorStart < 6) {
                    scope.addMinutes(value);
                } else {
                    scope.changeFlag(value);
                }
                var selection = calcSelection(cursorStart, inputValue);
                input.setSelectionRange(selection.start, selection.end);
            };
            if (keyDownEvent.which === DOWN) {
                switchPosition(-1);
                keyDownEvent.preventDefault();
            } else if (keyDownEvent.which === UP) {
                switchPosition(1);
                keyDownEvent.preventDefault();
            }
        });
        $input.on('blur', function () {
            $input.off('kydown.kktimepicker');
        });
        $input.on('change', function () {
            var value = factory.convert($input.val(), settings);
            scope.date = factory.parseString(value, settings);
            if (scope.date) {
                changeModel();
            }
        });
        modelCtrl.$render = function () {
            console.log(modelCtrl);
            setTimeout(function () {
                var value = modelCtrl.$viewValue;
                scope.date = factory.parseString(value, settings);
                if (scope.touch) {
                    $nativeInput.val(factory.convert(value, { use24HoursFormat: true, addZero: true }));
                } else {
                    $input.val(value);
                }
            });
        };
        $nativeInput.on('change', function (event) {
            if (scope.touch) {
                modelCtrl.$setViewValue($nativeInput.val());
            }
        });
        scope.togglePopover = function () {
            if (!scope.touch && !scope.ngDisabled) {
                scope.popoverIsOpen = !scope.popoverIsOpen;
            }
        };
        scope.addMinutes = function (value) {
            if (!scope.date) {
                scope.date = settings.default();
            }
            var current = scope.date.getMinutes();
            scope.date.setMinutes(current + value);
            changeModel();
        };
        scope.changeFlag = function () {
            if (!scope.date) {
                scope.date = settings.default();
            }
            var current = scope.date.getHours();
            if (current === 0) {
                scope.date.setHours(12);
                changeModel();
            } else if (current === 12) {
                scope.date.setHours(0);
                changeModel();
            } else {
                scope.addHours(12);
            }
        };
        scope.addHours = function (value) {
            if (!scope.date) {
                scope.date = settings.default();
            }
            var current = scope.date.getHours();
            scope.date.setHours(current + value);
            scope.hours = factory.getHours(scope.date, settings);
            changeModel();
        };
        scope.changeTimeFromPopover = function (value, type) {
            if (!scope.date) {
                scope.date = settings.default();
            }
            if (type === 'flag') {
                if (value.toUpperCase() === 'AM' && scope.date.getHours() > 12) {
                    scope.addHours(12);
                    return;
                }
                if (value.toUpperCase() === 'PM' && scope.date.getHours() <= 12) {
                    scope.addHours(12);
                    return;
                }
            } else {
                var parsedValue = parseInt(value, 10);
                if (factory.isNaN(parsedValue)) {
                    value = '';
                    return;
                }
                if (type === 'minute') {
                    scope.date.setMinutes(parsedValue);
                }
                if (type === 'hour') {
                    scope.date.setHours(parsedValue);
                }
                changeModel();
            }
        };
        scope.closePopover = function () {
            scope.popoverIsOpen = false;scope.$digest();
        };
        angular.element(document).on('click', scope.closePopover);
        scope.$on('$destroy', function () {
            angular.element(document).off('click', scope.closePopover);
        });
    };
    this.scope = {
        settings: '=',
        ngDisabled: '='
    };
    this.priority = 101;
    this.replace = true;
    this.require = 'ngModel';
    this.templateUrl = 'directives/kk.timepicker.tpl.html';
    this.factory = factory;
};

angular.module('kk.timepicker').directive('kkTimepicker', ['kkTimepickerFactory', function (kkTimepickerFactory) {
    return new Timepicker(kkTimepickerFactory);
}]);
exports.default = Timepicker;
},{"../factories/timepickerFactory":3}],3:[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, "__esModule", {
    value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

///<reference path="../../typings/tsd.d.ts" />
///<reference path="./timepickerFactory.d.ts" />

var TimepickerFactory = (function () {
    function TimepickerFactory() {
        _classCallCheck(this, TimepickerFactory);

        this.timeRegExp = new RegExp('^([0-2]?[0-9]|2[0-3]|3[0-3])\s{0,}?[:]?\s{0,}([0-5][0-9]|[0-9])?\s{0,}?(am|pm|AM|PM)?$');
    }

    _createClass(TimepickerFactory, [{
        key: 'checkValidity',
        value: function checkValidity(value) {
            return !!value.split(' ').join('').match(this.timeRegExp);
        }
    }, {
        key: 'formatDigit',
        value: function formatDigit(digit, addZero) {
            return addZero ? this.pad(digit) : '' + digit;
        }
    }, {
        key: 'getFlag',
        value: function getFlag(date, settings) {
            var hours = date.getHours();
            return hours < 12 ? 'AM' : 'PM';
        }
    }, {
        key: 'getMinutes',
        value: function getMinutes(date, settings) {
            return this.formatDigit(date.getMinutes(), true);
        }
    }, {
        key: 'getHours',
        value: function getHours(date, settings) {
            var hours = date.getHours();
            // return 24 format
            if (settings.use24HoursFormat) {
                return this.formatDigit(hours, settings.addZero);
            }
            // if 12 hours
            if (hours === 12 || hours === 0) {
                return '12';
            }
            // if more then 12 ours
            if (hours > 12) {
                return this.formatDigit(hours - 12, settings.addZero);
            }
            // other
            return this.formatDigit(hours, settings.addZero);
        }
    }, {
        key: 'pad',
        value: function pad(value) {
            return value < 10 ? '0' + value : '' + value;
        }
    }, {
        key: 'isNaN',
        value: function isNaN(value) {
            return value !== value;
        }
    }, {
        key: 'convert',
        value: function convert(value, settings) {
            var date = this.parseString(value, settings);
            return date ? this.formatString(date, settings) : '';
        }
    }, {
        key: 'formatString',
        value: function formatString(date, settings) {
            var flag = undefined;
            var hours = undefined;
            var value = date.getHours();
            if (!settings.use24HoursFormat) {
                if (value === 12 || value === 0) {
                    flag = this.getFlag(date, settings);
                    hours = 12;
                } else if (value > 12) {
                    hours = value - 12;
                    flag = this.getFlag(date, settings);
                } else {
                    hours = value;
                    flag = this.getFlag(date, settings);
                }
            } else {
                hours = value;
                flag = this.getFlag(date, settings);
            }
            var hoursStr = settings.addZero ? this.pad(hours) : hours;
            var minutes = this.pad(date.getMinutes());
            if (settings.use24HoursFormat) {
                return hoursStr + ':' + minutes;
            } else {
                return hoursStr + ':' + minutes + ' ' + flag;
            }
        }
    }, {
        key: 'parseString',
        value: function parseString(str, settings) {
            if (!str) {
                return null;
            }
            str = str.split(' ').join('');
            var parseResults = str.match(this.timeRegExp);
            if (!parseResults) {
                return null;
            }
            var hours = parseResults[1] || '';
            var minutes = parseResults[2] || '';
            var flag = parseResults[3] || '';
            var date = new Date(0);
            var hoursValue = parseInt(hours, 10);
            var minutesValue = parseInt(minutes, 10);
            hoursValue = this.isNaN(hoursValue) ? 0 : hoursValue;
            minutesValue = this.isNaN(minutesValue) ? 0 : minutesValue;
            // hack @todo needs to remake reg exp
            if (hoursValue > 24) {
                return null;
            }
            if (minutesValue > 59) {
                return null;
            }
            if (hoursValue >= 12) {
                if (flag.toLowerCase() === 'am') {
                    date.setHours(hoursValue - 12);
                } else {
                    date.setHours(hoursValue);
                }
            } else {
                if (flag.toLowerCase() === 'pm') {
                    date.setHours(hoursValue + 12);
                } else {
                    date.setHours(hoursValue);
                }
            }
            date.setMinutes(minutesValue);
            return date;
        }
    }]);

    return TimepickerFactory;
})();

angular.module('kk.timepicker').factory('kkTimepickerFactory', function () {
    return new TimepickerFactory();
});
exports.default = TimepickerFactory;
},{}],4:[function(require,module,exports){
'use strict';

///<reference path="../typings/tsd.d.ts" />
angular.module('kk.timepicker', []);
},{}]},{},[1]);
