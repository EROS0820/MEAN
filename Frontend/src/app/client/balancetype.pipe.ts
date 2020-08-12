import { Pipe, PipeTransform } from '@angular/core';
import { DecimalPipe } from '@angular/common';

@Pipe({
  name: 'btc'
})
export class BalancetypePipe implements PipeTransform {

  constructor(private dp: DecimalPipe) {

  }

  transform(value: any, args?: any): any {
    return this.dp.transform(value, '0.8-8');
  }

}
