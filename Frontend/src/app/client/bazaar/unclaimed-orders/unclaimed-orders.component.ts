import { Component, OnInit } from '@angular/core';
import Currency from '../../../model/currency';
import { SocketService } from 'src/app/services/socket.service';
import { HttpService } from 'src/app/services/http.service';
import { ShareService } from 'src/app/services/share.service';
import { CountryCurrencyPriceService } from 'src/app/services/country-currency-price.service';
import { NotificationsService } from 'angular2-notifications';
import { Router } from '@angular/router';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-unclaimed-orders',
  templateUrl: './unclaimed-orders.component.html',
  styleUrls: ['./unclaimed-orders.component.css']
})
export class UnclaimedOrdersComponent implements OnInit {

  searchText;
  disable_flag = false;
  release_click = false;

  unclaimOrders: any = {};

  userInfo: any;
  currency: Currency = new Currency;
  cCode = 'PH';
  curCode = 'PHP';
  currencyValue = 0;

  constructor(private socket: SocketService, private api: HttpService, private share: ShareService,
    private ccp: CountryCurrencyPriceService, private notify: NotificationsService,
    private router: Router, private storage: StorageService) { }

  async ngOnInit() {
    this.release_click = false;
    this.unclaimOrders = {};
    // get user country code
    this.userInfo = await this.ccp.getUserInfo();
    this.cCode = this.userInfo['countryCode'];
    // get user country currency code
    this.curCode = this.currency[`${this.cCode}`];
    // get user country currency value
    this.currencyValue = await this.ccp.getCurrencyValue(this.curCode);
    this.api.postToBackend('/buyerUnclaimOrders', { userid: this.share.user.id }, this.share.user.token).then(res => {
      // console.log(res);
      this.unclaimOrders = res;
    });
  }

  buyer() {
    this.disable_flag = !this.disable_flag;
    this.searchText = '';
    this.ngOnInit();
  }

  seller() {
    this.disable_flag = !this.disable_flag;
    this.searchText = '';
    this.unclaimOrders = {};
    this.api.postToBackend('/sellerUnclaimOrders', { userid: this.share.user.id }, this.share.user.token).then(res => {
      // console.log(res);
      this.unclaimOrders = res;
    });
  }

  reset_seller() {
    this.searchText = '';
    this.unclaimOrders = {};
    this.release_click = false;
    this.api.postToBackend('/sellerUnclaimOrders', { userid: this.share.user.id }, this.share.user.token).then(res => {
      this.unclaimOrders = res;
    });
  }

  releaseItem(lcamount: number, tps: number, buyerid: number, tas: number, orderid: number) {
    this.release_click = true;
    // qualifier bonus part
    if (lcamount >= this.socket.CycleBtcConversionTarget) {
      const oldVal = this.storage.getQBonus();
      let newVal = lcamount * 0.04;
      if (oldVal !== null) {
        newVal = newVal + parseFloat(oldVal);
      }
      this.share.qualifier_bonus = newVal;
      this.storage.saveQBonus(String(newVal));
      this.api.postToBackend('/setQBonus', { userid: this.share.user.id, amount: newVal }, this.share.user.token).then(res => {
        console.log(res);
      });
    }
    // shop owner balance increase
    this.api.postToBackend('/increaseLcBalance', { userid: this.share.user.id, amount: lcamount }, this.share.user.token).then(res => {
      console.log(res);
      // buyer balance increase
      this.api.postToBackend('/increaseLcBalance', { userid: buyerid, amount: tps }, this.share.user.token);
    });

    // agent balance increase: need to check agent id is correct
    this.api.postToBackend('/increaseLcBalanceAgent', { userid: buyerid, amount: tas }, this.share.user.token).then(res => {
      if (res['status'] === 'error') {
        this.notify.error('INFO', res['payload'], { timeOut: 5000 });
      }
      this.release_click = false;
    });

    // update order status unclaim -> claim
    this.api.postToBackend('/updateOrderToClaim', { userid: buyerid, orderid: orderid }, this.share.user.token).then(res => {
      if (res['status'] === 'success') {
        this.notify.info('INFO', res['payload'], { timeOut: 5000 });
        this.reset_seller();
      }
    });
  }

  goToBazaarHome() {
    this.router.navigate(['cryptobazaar']);
  }

}
