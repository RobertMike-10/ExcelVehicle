import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'price'
})
export class PricePipe implements PipeTransform {

  transform(value: string): string {
    let newStr: string = "CAD$";
    return newStr + value;
  }

}
