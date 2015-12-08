///<reference path="../factories/timepickerFactory.d.ts" />

interface TimepickerScope extends ng.IScope {
  // use scope only from controller
  default: any;
  date: Date;
  value: string;
  popoverIsOpen: boolean;
  hours:string;
  minutes:string;
  flag:string;
  settings:any;
  togglePopover():void;
  closePopover():void;
  addHours(value:number):void;
  addMinutes(value:number):void;
  changeFlag(value:number):void;
  changeTimeFromPopover(value:string, type:string):void;
}


interface TimepickerInterface  extends ng.IDirective {
  factory: TimepickerFactoryInterface;
}

interface Attributes extends ng.IAttributes {

}
