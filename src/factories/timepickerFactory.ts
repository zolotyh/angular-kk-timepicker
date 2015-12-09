///<reference path="../../typings/tsd.d.ts" />
///<reference path="./timepickerFactory.d.ts" />

class TimepickerFactory implements TimepickerFactoryInterface {
  private timeRegExp: RegExp = new RegExp('^([0-2]?[0-9]|2[0-3]|3[0-3])\s{0,}?[:]?\s{0,}([0-5][0-9]|[0-9])?\s{0,}?(am|pm|AM|PM)?$');

  checkValidity(value:string) {
    return !!value.split(' ').join('').match(this.timeRegExp);
  }

  formatDigit (digit: number, addZero: boolean) {
    return addZero ? this.pad(digit) : '' + digit;
  };

  getFlag(date:Date, settings: any) {
    const hours = date.getHours();
    return hours < 12 ? 'AM' : 'PM';
  }

  getMinutes(date:Date, settings: any) {
    return this.formatDigit(date.getMinutes(), true);
  }

  getHours(date:Date, settings: any) {
    const hours = date.getHours();


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
    return this.formatDigit(hours , settings.addZero);

  }

  pad(value:number) {
    return value < 10 ? '0' + value : '' + value;
  }

  isNaN(value:number) {
    return value !== value;
  }

  convert (value: any, settings: any) {
    const date = this.parseString(value, settings);
    return date ? this.formatString(date, settings) : '';
  }

  formatString(date:Date, settings: any) {
    let flag:string;
    let hours:number;
    let value = date.getHours();

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

    const hoursStr  = settings.addZero ?  this.pad(hours) : hours;
    const minutes = this.pad(date.getMinutes());

    if (settings.use24HoursFormat) {
      return `${hoursStr}:${minutes}`;
    } else {
      return `${hoursStr}:${minutes} ${flag}`;
    }
  }

  parseString(str:string, settings: any) {
    if (!str) {return null; }

    str = str.split(' ').join('');

    const parseResults = str.match(this.timeRegExp);


    if (!parseResults) { return null; }

    const hours = parseResults[1] || '';
    const minutes = parseResults[2] || '';
    const flag = parseResults[3] || '';
    const date = new Date(0);

    let hoursValue = parseInt(hours, 10);
    let minutesValue = parseInt(minutes, 10);

    hoursValue = this.isNaN(hoursValue) ? 0 : hoursValue;
    minutesValue = this.isNaN(minutesValue) ? 0 : minutesValue;


    // hack @todo needs to remake reg exp
    if (hoursValue > 24) { return null; }
    if (minutesValue > 59) { return null; }

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
}

angular.module('kk.timepicker').factory('kkTimepickerFactory', () => new TimepickerFactory());


export default TimepickerFactory;
