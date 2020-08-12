import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { NotificationsService } from 'angular2-notifications';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class CountryCurrencyPriceService {

  // set endpoint and your API key
  endpoint = 'latest';
   access_key = '2c0eb0162ea5734e3b5cd2adfdaca3bb';// 2c0eb0162ea5734e3b5cd2adfdaca3bb
  // access_key = '153a4be0cf014a5490c028f985274b77';

  baseURL = 'http://data.fixer.io/api/';
  private currentPriceUrl = 'http://api.coindesk.com/v1/bpi/currentprice.json';

  // tslint:disable-next-line: deprecation
  constructor(private http: Http, private notify: NotificationsService, private router: Router) { }

  async getUserInfo(): Promise<string> {
    const res = await this.http.get('http://ip-api.com/json').toPromise();
    return res.json();
  }

  async getCurrencyValue(currency_code): Promise<any> {
   // console.log(this.baseURL + this.endpoint + '?access_key=' + this.access_key + '&base=' + 'USD');
    //const response = await this.http.get(this.baseURL + this.endpoint + '?access_key=' + this.access_key + '&base=' + 'USD')
    //  .toPromise();
    const  response = ({
        "success": true,
        "timestamp": 1519296206,
        "base": "EUR",
        "date": "2019-10-02",
        "rates": {
            "AUD": 1.566015,
            "CAD": 1.560132,
            "UAH": 8.986788,
            "RUB": 7.29282,
            "CHF": 1.154727,
            "CNY": 7.827874,
            "GBP": 0.882047,
            "JPY": 132.360679,
            "USD": 1.23396,
            "PHP": 52.15,

        }
    });
    if (this.router.url === '/home') {
       this.notify.success('INFO', '1 USD = ' + response.rates[currency_code] + ' ' + currency_code, { timeOut: 5000 });
    }
    // return response.rates[currency_code];
    return response.rates["PHP"];
  }

  async getPrice(currency: string): Promise<number> {
    const response = await this.http.get(this.currentPriceUrl).toPromise();
    return response.json().bpi[currency].rate;
  }
}


// import { Injectable } from '@angular/core';
// import { Http } from '@angular/http';
// import { NotificationsService } from 'angular2-notifications';
// import { Router } from '@angular/router';

// @Injectable({
//   providedIn: 'root'
// })
// export class CountryCurrencyPriceService {

//   // set endpoint and your API key
//   endpoint = 'latest';
//   access_key = '2c0eb0162ea5734e3b5cd2adfdaca3bb';
//   baseURL = 'http://data.fixer.io/api/';
//   private currentPriceUrl = 'http://api.coindesk.com/v1/bpi/currentprice.json';

//   // tslint:disable-next-line: deprecation
//   constructor(private http: Http, private notify: NotificationsService, private router: Router) { }

//   async getUserInfo(): Promise<string> {
//     const res = await this.http.get('http://ip-api.com/json').toPromise();
//     return res.json();
//   }

//   async getCurrencyValue(currency_code): Promise<any> {
//     const response = await this.http.get(this.baseURL + this.endpoint + '?access_key=' + this.access_key + '&base=' + 'USD')
//       .toPromise();
//     if (this.router.url === '/home') {
//       this.notify.success('INFO', '1 USD = ' + response.json().rates[currency_code] + ' ' + currency_code, { timeOut: 5000 });
//     }
//     return response.json().rates[currency_code];
//   }

//   async getPrice(currency: string): Promise<number> {
//     const response = await this.http.get(this.currentPriceUrl).toPromise();
//     return response.json().bpi[currency].rate;
//   }
// }
