import { Component, OnInit } from '@angular/core';
import Currency from '../../../model/currency';
import { SocketService } from 'src/app/services/socket.service';
import { HttpService } from 'src/app/services/http.service';
import { ShareService } from 'src/app/services/share.service';
import { CountryCurrencyPriceService } from 'src/app/services/country-currency-price.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-claimed-orders',
  templateUrl: './claimed-orders.component.html',
  styleUrls: ['./claimed-orders.component.css']
})
export class ClaimedOrdersComponent implements OnInit {

  searchText;
  disable_flag = false;

  claimOrders: any = {};
  overallProductPurchased = 0;

  userInfo: any;
  currency: Currency = new Currency;
  cCode = 'PH';
  curCode = 'PHP';
  currencyValue = 0;

  getSalesInventory: any = {};
  max_lctobtc = 0;
  min_lctobtc = 0;
  total_purchase = 0;

  bsValue = new Date();
  bsRangeValue: Date[];
  minDate = new Date();

  start: string;
  end: string;

  constructor(public socket: SocketService, private api: HttpService, public share: ShareService,
    private ccp: CountryCurrencyPriceService, private router: Router) {
      this.minDate.setDate(this.minDate.getDate() - 7);
      this.bsRangeValue = [this.minDate, this.bsValue];
    }

  async ngOnInit() {
    this.claimOrders = {};
    // get user country code
    this.userInfo = await this.ccp.getUserInfo();
    console.log(this.userInfo,'wdw')
    this.cCode = this.userInfo['countryCode'];
    // get user country currency code
    this.curCode = this.currency[`${this.cCode}`];
    // get user country currency value
    this.currencyValue = await this.ccp.getCurrencyValue(this.curCode);
    this.api.postToBackend('/buyerClaimOrders', { userid: this.share.user.id }, this.share.user.token).then(res => {
      // console.log(res);
      if (Object.keys(res).length >= 1) {
        for (let i = 0; i < Object.keys(res).length; i++) {
          this.overallProductPurchased = this.overallProductPurchased + res[i]['lcamount'] - res[i]['tps'];
        }
      }
      this.claimOrders = res;
    });
    setTimeout(() => {
      this.ngOnInit();
    }, 60000);
  }

  convertDateStandard(value: Date) {
    return value.getFullYear() + '-' + ('00' + (value.getMonth() + 1)).slice(-2) + '-' + ('00' + value.getDate()).slice(-2);
  }

  onDateValueChange(value: object): void {
    this.start = this.convertDateStandard(value[0]);
    this.end = this.convertDateStandard(value[1]);
    this.get_sales_inventory(this.start, this.end);
  }

  buyer_seller(flag: boolean) {
    this.disable_flag = !flag;
    this.searchText = '';
    if (this.disable_flag) {
      this.start = this.convertDateStandard(this.minDate);
      this.end = this.convertDateStandard(this.bsValue);
      this.get_sales_inventory(this.start, this.end);
    } else {
      this.ngOnInit();
    }
  }

  get_sales_inventory(start: string, end: string) {
    this.getSalesInventory = {};
    this.total_purchase = 0;
    this.min_lctobtc = 0;
    this.max_lctobtc = 0;
      this.api.postToBackend('/getSalesInventory', {
        shop_id: this.share.user.id,
        startDate: start,
        endDate: end }, this.share.user.token).then(res => {
        // console.log(res);
        this.getSalesInventory = res;
        if (Object.keys(res).length > 1) {
          for (let i = 0; i < Object.keys(res).length; i++) {
            this.total_purchase += res[i]['lcamount'];
            if (this.max_lctobtc < res[i]['lctobtc']) {
              this.max_lctobtc = res[i]['lctobtc'];
            }
            if (this.min_lctobtc > res[i]['lctobtc']) {
              this.min_lctobtc = res[i]['lctobtc'];
            }
          }
        } else if (Object.keys(res).length === 1) {
          this.max_lctobtc = res[0]['lctobtc'];
          this.min_lctobtc = res[0]['lctobtc'];
          this.total_purchase = res[0]['lcamount'];
        }
      });
  }

  goToOtherPage(url: string) {
    this.router.navigate([url] );
  }

  printComponent() {
    this.get_sales_inventory(this.start, this.end);
    window.print();
  }

}
