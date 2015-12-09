///<reference path="../../typings/jasmine/jasmine.d.ts" />
///<reference path="../../typings/angularjs/angular-mocks.d.ts" />
///<reference path="../../typings/angularjs/angular.d.ts" />
///<reference path="../../typings/jquery/jquery.d.ts" />

describe('factory: kkTimepickerFactory', function() {
  beforeEach(angular.mock.module('kk.timepicker'));

  it('should be defined', inject(function(kkTimepickerFactory: any) {
    expect(kkTimepickerFactory).toBeDefined();
  }));

  describe('method pad testing', function(){
    it('should return 01 on  1', inject(function(kkTimepickerFactory: any) {
      expect(kkTimepickerFactory.pad(1)).toBe('01');
    }));
    it('should return 10 on input 10', inject(function(kkTimepickerFactory: any) {
      expect(kkTimepickerFactory.pad(10)).toBe('10');
    }));
  });

  describe('method getHours', function(){
    const date = new Date();

    const settings = {
      addZero: true
    };

    it('should return 09 on 21:00 if 12 hours format has enabled', inject(function(kkTimepickerFactory: any) {
      date.setHours(21);
      expect(kkTimepickerFactory.getHours(date, settings)).toBe('09');
    }));

    it('should return 10 on 22:00 if 12 hours format has enabled', inject(function(kkTimepickerFactory: any) {
      date.setHours(22);
      expect(kkTimepickerFactory.getHours(date, settings)).toBe('10');
    }));

    it('should return 12 on 00:00 if 12 hours format has enabled', inject(function(kkTimepickerFactory: any) {
      date.setHours(0);
      expect(kkTimepickerFactory.getHours(date, settings)).toBe('12');
    }));

    it('should return 12 on 12:00 if 12 hours format has enabled', inject(function(kkTimepickerFactory: any) {
      date.setHours(12);
      expect(kkTimepickerFactory.getHours(date, settings)).toBe('12');
    }));

    it('should return 11 on 23:00 if 12 hours format has enabled', inject(function(kkTimepickerFactory: any) {
      date.setMinutes(59);
      date.setHours(23);
      expect(kkTimepickerFactory.getHours(date, settings)).toBe('11');
    }));

    it('should return 23 on 23:00 if 24 hours format has enabled', inject(function(kkTimepickerFactory: any) {
      const localSettings = {
        use24HoursFormat : true
      };
      date.setMinutes(59);
      date.setHours(23);
      expect(kkTimepickerFactory.getHours(date, localSettings)).toBe('23');
    }));
    it('should return 7 on 07:00 if 24 hours format has enabled and addZero is disabled', inject(function(kkTimepickerFactory: any) {
      const localSettings = {
        use24HoursFormat : true
      };
      date.setMinutes(59);
      date.setHours(7);
      expect(kkTimepickerFactory.getHours(date, localSettings)).toBe('7');
    }));
  });

  describe('method getFlag', () => {
    const date = new Date();

    it('should return AM on 00:00', inject(function(kkTimepickerFactory: any) {
      date.setHours(0);
      expect(kkTimepickerFactory.getFlag(date, {})).toBe('AM');
    }));

    it('should return AM on 11:00', inject(function(kkTimepickerFactory: any) {
      date.setHours(11);
      expect(kkTimepickerFactory.getFlag(date, {})).toBe('AM');
    }));
    it('should return AM on 00:00', inject(function(kkTimepickerFactory: any) {
      date.setHours(0);
      expect(kkTimepickerFactory.getFlag(date, {})).toBe('AM');
    }));

    it('should return AM on 00:00', inject(function(kkTimepickerFactory: any) {
      date.setHours(24);
      expect(kkTimepickerFactory.getFlag(date, {})).toBe('AM');
    }));

    it('should return PM on 12:00', inject(function(kkTimepickerFactory: any) {
      date.setHours(12);
      expect(kkTimepickerFactory.getFlag(date, {})).toBe('PM');
    }));

    it('should return PM on 20:00', inject(function(kkTimepickerFactory: any) {
      date.setHours(20);
      expect(kkTimepickerFactory.getFlag(date, {})).toBe('PM');
    }));
  });

  describe('method getMinutes', () => {
    const date = new Date();

    it('should return 59 on 00:59', inject(function(kkTimepickerFactory: any) {
      date.setMinutes(59);
      expect(kkTimepickerFactory.getMinutes(date, {})).toBe('59');
    }));

    it('should return 10 on set 70 minutes', inject(function(kkTimepickerFactory: any) {
      date.setMinutes(70);
      expect(kkTimepickerFactory.getMinutes(date, {})).toBe('10');
    }));

    it('should return 00 on set 0 minutes', inject(function(kkTimepickerFactory: any) {
      date.setMinutes(0);
      expect(kkTimepickerFactory.getMinutes(date, {})).toBe('00');
    }));

    it('should return 05 on set 5 minutes', inject(function(kkTimepickerFactory: any) {
      date.setMinutes(5);
      expect(kkTimepickerFactory.getMinutes(date, {})).toBe('05');
    }));
  });

  describe('method parseString', () => {
    it('should return null if string is null', inject(function(kkTimepickerFactory: any) {
      expect(kkTimepickerFactory.parseString('', {})).toBe(null);
    }));
    it('should return 0:00 if string is 0', inject(function(kkTimepickerFactory: any) {
      expect(kkTimepickerFactory.parseString('0', {}).getHours()).toBe(0);
      expect(kkTimepickerFactory.parseString('0', {}).getMinutes()).toBe(0);
    }));
    it('should return 01:01 if string is 1:1', inject(function(kkTimepickerFactory: any) {
      expect(kkTimepickerFactory.parseString('1:1', {}).getHours()).toBe(1);
      expect(kkTimepickerFactory.parseString('1:1', {}).getMinutes()).toBe(1);
    }));
    it('should return match strings', inject(function(kkTimepickerFactory: any) {
      expect(kkTimepickerFactory.parseString('10:12PM', {})).toBeDefined();
      expect(kkTimepickerFactory.parseString('10:12PM', {}).getMinutes()).toBe(12);
      expect(kkTimepickerFactory.parseString('10:12PM', {}).getHours()).toBe(22);
      expect(kkTimepickerFactory.parseString('10 : 12     PM', {}).getHours()).toBe(22);
      expect(kkTimepickerFactory.parseString('10 : 12     PM', {}).getMinutes()).toBe(12);
      expect(kkTimepickerFactory.parseString('0:20AM', {}).getMinutes()).toBe(20);
      expect(kkTimepickerFactory.parseString('0:20AM', {}).getHours()).toBe(0);
      expect(kkTimepickerFactory.parseString('20:20', {}).getHours()).toBe(20);
      expect(kkTimepickerFactory.parseString('90:20', {})).toBe(null);
      expect(kkTimepickerFactory.parseString('20:20AM', {}).getHours()).toBe(8);
      expect(kkTimepickerFactory.parseString('20:20PM', {}).getHours()).toBe(20);
      expect(kkTimepickerFactory.parseString('9:9', {}).getHours()).toBe(9);
      expect(kkTimepickerFactory.parseString('9:9', {}).getMinutes()).toBe(9);
      expect(kkTimepickerFactory.parseString('9:9PM', {}).getHours()).toBe(21);
    }));
  });

  describe('method formatString', () => {
    it('should format 12:00AM', inject(function(kkTimepickerFactory: any) {
      const date = new Date(0);
      date.setHours(0);
      date.setMinutes(0);

      expect(kkTimepickerFactory.formatString(date, {})).toBe('12:00 AM');
    }));

    it('should format 12:00AM when addZero enabled', inject(function(kkTimepickerFactory: any) {
      const date = new Date(0);
      date.setHours(0);
      date.setMinutes(0);

      expect(kkTimepickerFactory.formatString(date, {addZero: true})).toBe('12:00 AM');
    }));

    it('should format 1:35AM when addZero enabled', inject(function(kkTimepickerFactory: any) {
      const date = new Date(0);
      date.setHours(1);
      date.setMinutes(35);

      expect(kkTimepickerFactory.formatString(date, {addZero: false})).toBe('1:35 AM');
    }));

    it('should format 01:35AM when addZero enabled', inject(function(kkTimepickerFactory: any) {
      const date = new Date(0);
      date.setHours(1);
      date.setMinutes(35);

      expect(kkTimepickerFactory.formatString(date, {addZero: true})).toBe('01:35 AM');
    }));

    it('should format 12:35PM when addZero enabled', inject(function(kkTimepickerFactory: any) {
      const date = new Date(0);
      date.setHours(12);
      date.setMinutes(35);
      expect(kkTimepickerFactory.formatString(date, {addZero: true})).toBe('12:35 PM');
    }));

    it('should format 16:35PM when addZero enabled', inject(function(kkTimepickerFactory: any) {
      const date = new Date(0);
      date.setHours(16);
      date.setMinutes(35);
      expect(kkTimepickerFactory.formatString(date, {addZero: true})).toBe('04:35 PM');
    }));

    it('should format 24:35AM when addZero enabled', inject(function(kkTimepickerFactory: any) {
      const date = new Date(0);
      date.setHours(24);
      date.setMinutes(35);

      expect(kkTimepickerFactory.formatString(date, {addZero: true})).toBe('12:35 AM');
    }));

    it('should format 23:35 when use use24HoursFormat and addZero enabled', inject(function(kkTimepickerFactory: any) {
      const date = new Date(0);
      date.setHours(23);
      date.setMinutes(35);

      expect(kkTimepickerFactory.formatString(date, {addZero: true, use24HoursFormat: true})).toBe('23:35');
    }));

    it('should format 01:35AM when addZero enabled', inject(function(kkTimepickerFactory: any) {
      const date = new Date(0);
      date.setHours(1);
      date.setMinutes(35);

      expect(kkTimepickerFactory.formatString(date, {addZero: true, use24HoursFormat: true})).toBe('01:35');
    }));
  });

  describe('method checkValidity', () => {
    it('should return valid if input = 00   : 59 AM', inject(function(kkTimepickerFactory: any) {
      const date = '00   : 59 AM';
      expect(kkTimepickerFactory.checkValidity(date)).toBe(true);
    }));
    it('should return valid if input = 00   : 59 AMd', inject(function(kkTimepickerFactory: any) {
      const date = '00   : 59 AMd';
      expect(kkTimepickerFactory.checkValidity(date)).toBe(false);
    }));
  });

});
