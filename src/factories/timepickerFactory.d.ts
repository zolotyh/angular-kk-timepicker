interface TimepickerFactoryInterface {
  pad(value:number):string;
  getHours(date: Date, settings: any):string;
  getMinutes(date: Date, settings: any):string;
  getFlag(date: Date, settings: any):string;
  parseString(stringTime:string, settings: any):Date;
  formatString(date:Date, localSettings: any):string;
  convert(value:any, settings:any):string;
  isNaN(value:number):boolean;
}
