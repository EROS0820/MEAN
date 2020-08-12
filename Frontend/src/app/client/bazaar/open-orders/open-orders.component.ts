import { Component, OnInit } from '@angular/core';
import { SocketService } from 'src/app/services/socket.service';
import { HttpService } from 'src/app/services/http.service';
import { ShareService } from 'src/app/services/share.service';
import Currency from '../../../model/currency';
import { CountryCurrencyPriceService } from 'src/app/services/country-currency-price.service';
import { NotificationsService } from 'angular2-notifications';
import { Router } from '@angular/router';

@Component({
  selector: 'app-open-orders',
  templateUrl: './open-orders.component.html',
  styleUrls: ['./open-orders.component.css']
})
export class OpenOrdersComponent implements OnInit {

  searchText;
  openOders: any = {};

  userInfo: any;
  currency: Currency = new Currency;
  cCode = 'PH';
  curCode = 'PHP';
  currencyValue = 0;

  constructor(public socket: SocketService, private api: HttpService, public share: ShareService,
    private ccp: CountryCurrencyPriceService, private notify: NotificationsService, private router: Router) { }

  async ngOnInit() {
    // get user country code
    this.userInfo = await this.ccp.getUserInfo();
    this.cCode = this.userInfo['countryCode'];
    // get user country currency code
    this.curCode = this.currency[`${this.cCode}`];
    // get user country currency value
    this.currencyValue = await this.ccp.getCurrencyValue(this.curCode);
    this.api.postToBackend('/userOpenOrders', { userid: this.share.user.id }, this.share.user.token).then(res => {
      // console.log(res);
      this.openOders = res;
      this.comparePrice();
      setTimeout(() => {
        this.ngOnInit();
      }, 60000);
    });
  }

  comparePrice() {
    for (let index = 0; index < Object.keys(this.openOders).length; index ++) {
      // tslint:disable-next-line: max-line-length
      const controlled_lc_price = this.openOders[index].Pro_Info[0]['initial_cc_price'] / (this.socket.btc_usd * this.socket.lc_btc * this.currencyValue);
      if (this.openOders[index]['buy_controlled_lc_price'] >= controlled_lc_price) {
        this.api.postToBackend('/updateOrderToUnclaim',
        {
          userid: this.share.user.id,
          lctobtc: this.socket.lc_btc,
          orderid: this.openOders[index]['orderid'],
          bz_pro_id: this.openOders[index]['bz_pro_id'],
          quantity: this.openOders[index].Pro_Info[0]['availability'] - this.openOders[index]['quantity']
        }, this.share.user.token).then(res => {
          console.log(res);
          if (res['status'] === 'success') {
            this.notify.success('INFO', 'Order status update', { timeOut: 5000 });
            this.ngOnInit();
          } else {
            this.notify.error('INFO', 'Refresh page, please.', { timeOut: 5000 });
          }
        });
      }
    }
  }

  cancelPrecheckout(userid: number, orderid: number, lcamount: number) {
    // console.log('user ' + userid + ' orderid ' + orderid + ' lc ' + lcamount);
    this.api.postToBackend('/cancelPrecheckout', {
      userid: userid,
      orderid: orderid,
      lcamount: lcamount + this.socket.lc_balance
    }, this.share.user.token).then(res => {
      // console.log(res);
      if (res['status'] === 'success') {
        this.notify.info('INFO', res['payload'], { timeOut: 5000 });
        this.notify.success('INFO', 'Cancel Order Success', { timeOut: 5000 });
        this.socket.lc_balance += lcamount;
        this.ngOnInit();
      } else {
        this.notify.info('INFO', 'Retry Cancel Please', { timeOut: 5000 });
      }
    });
  }

  goToBazaarHome() {
    this.router.navigate(['cryptobazaar']);
  }
}
