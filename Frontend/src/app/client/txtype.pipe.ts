import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'txtype'
})
export class TxtypePipe implements PipeTransform {

  transform(value: any, args?: any): any {
  	if(value == 'btol') return 'BTC to LC converted';
  	if(value == 'ltob') return "LC to BTC converted";
  	if(value == 'received') return "Received";
  	if(value == 'sent') return "Sent";
    return value;
  }

}
