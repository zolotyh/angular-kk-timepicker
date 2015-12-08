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
    const $input = angular.element(element[0].querySelector('.js-input'))
      , factory = this.factory;

    let cacheValue = '';

    let settings:any = {
      addZero: true,
      default: function(){
        return new Date();
      }
    };

    const keyHandler = () => {
      console.log(123);
    };

    element.on('focus', () => {
      console.log('focus');
      angular.element(this).on('keyup', keyHandler);
    });

    element.on('blur', () => {
      console.log('blur');
      angular.element(this).off('keyup', keyHandler);
    });

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

    $input.on('change', () => {
      const value:string = factory.convert($input.val(), settings);
      scope.date = factory.parseString(value, settings);
      if (scope.date) {
        changeModel();
      }
    });

    $input.on('focus', () => {
      cacheValue = $input.val();
      scope.closePopover();
      $input.val('');
    });

    $input.on('blur', () => {
      if (!$input.val() && cacheValue) {
        $input.val(cacheValue);
      }
    });

    $input.on('keyup', () => {
      cacheValue = '';
    });

    modelCtrl.$render = () => {
      scope.date = factory.parseString(modelCtrl.$viewValue, settings);
      $input.val(modelCtrl.$viewValue);
    };


    scope.togglePopover = () => {
      scope.popoverIsOpen = !scope.popoverIsOpen;
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
    settings: '='
  };
  replace:boolean = true;
  require:string = 'ngModel';
  templateUrl:string = 'directives/kk.timepicker.tpl.html';
}

angular.module('kk.timepicker').directive('kkTimepicker',
[ 'kkTimepickerFactory', (kkTimepickerFactory:TimepickerFactoryInterface) => new Timepicker(kkTimepickerFactory)]);

export default Timepicker;
