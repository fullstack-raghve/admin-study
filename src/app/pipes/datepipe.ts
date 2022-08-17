import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'ddmmyyyy'
})
export class ToDateObjPipe implements PipeTransform {

    transform(value: any): any {

        if (value) {
            // const temp = value.toString().replace(' ', 'T');
            // return new Date(temp);
            return `${value.substr(8,2)}/${value.substr(5,2)}/${value.substr(0,4)}`;
        } else {
            return null;
        }
    }
}