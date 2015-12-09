///<reference path="../../typings/jasmine/jasmine.d.ts" />
///<reference path="../../typings/angularjs/angular-mocks.d.ts" />
///<reference path="../../typings/angularjs/angular.d.ts" />
///<reference path="../../typings/jquery/jquery.d.ts" />

describe('directive: kk-timepicker', function() {
  let element: JQuery
  , scope:ng.IScope;

  beforeEach(angular.mock.module('kk.timepicker'));


  beforeEach(inject(function($rootScope:ng.IScope, $compile:ng.ICompileService) {
    scope = $rootScope;
    element = angular.element('<input type="text" kk-timepicker ng-model="test" />');

    $compile(element)(scope);
    scope.$digest();

  }));

  it('test should run', function() {
    expect(element.hasClass('kk-timepicker')).toBe(true);
  });


});
