///<reference path="./timepicker.d.ts" />
///<reference path="../factories/timepickerFactory.d.ts" />
///<reference path="../../typings/tsd.d.ts" />

import '../factories/timepickerFactory';

class Timepicker implements TimepickerInterface {
  constructor(factory: TimepickerFactoryInterface) {
    this.factory = factory;
  };
  factory: TimepickerFactoryInterface;
  link:ng.IDirectiveLinkFn = (
    scope:TimepickerScope,
    element:ng.IAugmentedJQuery,
    attrs:ng.IAttributes,
    modelCtrl: ng.INgModelController
  ) => {
    const $input:JQuery = angular.element(element[0].querySelector('.js-input'))
      , $nativeInput:JQuery = angular.element(element[0].querySelector('.js-native-input'))
      , UP = 38
      , DOWN = 40
      , factory = this.factory;

    scope.touch = 'ontouchstart' in window;

    let settings:any = {
      addZero: true,
      default: function(){
        return new Date();
      }
    };

    settings = angular.extend(settings, scope.settings);

    scope.$watch('date', (newValue, oldValue) => {
      if (newValue === oldValue && !modelCtrl.$viewValue) {
        scope.date = settings.default();
        const value:string = factory.formatString(scope.date, settings);
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


    modelCtrl.$formatters.push((value:string) => {
      return factory.convert(value, settings) || value;
    });

    modelCtrl.$parsers.push((value:string) => {
      return factory.convert(value, settings) || value;
    });


    const error = 'timeStringParse';

    modelCtrl.$validators[error] = (modelValue: any) =>
      !!factory.convert(modelValue, settings);

    const changeModel = () => {
      const value = factory.formatString(scope.date, settings);
      $input.val(value);
      modelCtrl.$setViewValue(value);
    };

    const calcSelection = (cursorStart:number, value:string) => {
      let start:number;
      let end:number;

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

    $input.on('focusin', (e:JQueryEventObject) => {
      const input:any = $input[0];
      const value = $input.val();


      const valueIsValid = factory.checkValidity(value);

      if (!valueIsValid) {return; }

      setTimeout(() => {
        const cursorStart = input.selectionStart;
        const selection = calcSelection(cursorStart, value);
        input.setSelectionRange(selection.start, selection.end);
      });


    });

    $input.on('keydown', (keyDownEvent: JQueryEventObject) => {
      const switchPosition = (value:number) => {
        const inputValue = $input.val();
        const input:any = $input[0];
        const cursorStart = input.selectionStart;
        if (cursorStart <= 2) {
          scope.addHours(value);
        } else if (cursorStart > 2 && cursorStart < 6) {
          scope.addMinutes(value);
        } else {
          scope.changeFlag(value);
        }
        const selection = calcSelection(cursorStart, inputValue);
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

    $input.on('blur', () => { $input.off('kydown.kktimepicker'); });

    $input.on('change', () => {
      const value:string = factory.convert($input.val(), settings);
      scope.date = factory.parseString(value, settings);
      if (scope.date) {
        changeModel();
      }
    });

    modelCtrl.$render = () => {
      console.log(modelCtrl);
        setTimeout(() => {
          const value = modelCtrl.$viewValue;
          scope.date = factory.parseString(value, settings);

          if (scope.touch) {
            $nativeInput.val(factory.convert(value, {use24HoursFormat: true, addZero: true}));
          } else {
            $input.val(value);
          }
        });

    };

    $nativeInput.on('change', (event: Event) => {
      if (scope.touch) {
        modelCtrl.$setViewValue($nativeInput.val());
      }
    });


    scope.togglePopover = () => {
      if (!scope.touch && !scope.ngDisabled) {
        scope.popoverIsOpen = !scope.popoverIsOpen;
      }
    };

    scope.addMinutes = (value:number) => {
      if (!scope.date) { scope.date = settings.default(); }
      const current = scope.date.getMinutes();
      scope.date.setMinutes(current + value);
      changeModel();
    };

    scope.changeFlag = () => {
      if (!scope.date) { scope.date = settings.default(); }
      const current = scope.date.getHours();
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

    scope.addHours = (value:number) => {
      if (!scope.date) { scope.date = settings.default(); }
      const current = scope.date.getHours();
      scope.date.setHours(current + value);
      scope.hours = factory.getHours(scope.date, settings);
      changeModel();
    };

    scope.changeTimeFromPopover = (value:string, type:string) => {
      if (!scope.date) { scope.date = settings.default(); }

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
        const parsedValue = parseInt(value, 10);

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

    scope.closePopover = () => { scope.popoverIsOpen = false; scope.$digest(); };

    angular.element(document).on('click', scope.closePopover);

    scope.$on('$destroy', () => { angular.element(document).off('click', scope.closePopover); });
  };
  scope: any = {
    settings: '=',
    ngDisabled: '='
  };
  priority:number = 101;
  replace:boolean = true;
  require:string = 'ngModel';
  templateUrl:string = 'directives/kk.timepicker.tpl.html';
}

angular.module('kk.timepicker').directive('kkTimepicker',
[ 'kkTimepickerFactory', (kkTimepickerFactory:TimepickerFactoryInterface) => new Timepicker(kkTimepickerFactory)]);

export default Timepicker;
