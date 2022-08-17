import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateTime'
})
export class DateTimePipe implements PipeTransform {
  transform(value: any): any {
      if (value) {
          return `${value.substr(8,2)}/${value.substr(5,2)}/${value.substr(0,4)} ${value.substr(11)}`;
      } else {
          return null;
      }
  }
}
