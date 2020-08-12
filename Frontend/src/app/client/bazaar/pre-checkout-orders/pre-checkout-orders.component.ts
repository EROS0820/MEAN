import { Component, OnInit } from '@angular/core';
import { SocketService } from 'src/app/services/socket.service';
import { CountryCurrencyPriceService } from 'src/app/services/country-currency-price.service';
import { environment } from '../../../../environments/environment';
import Currency from '../../../model/currency';
import { ShareService } from 'src/app/services/share.service';
import { HttpClient } from '@angular/common/http';
import { BazaarService } from 'src/app/bazaar.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { HttpService } from 'src/app/services/http.service';
import { NotificationsService } from 'angular2-notifications';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pre-checkout-orders',
  templateUrl: './pre-checkout-orders.component.html',
  styleUrls: ['./pre-checkout-orders.component.css']
})
export class PreCheckoutOrdersComponent implements OnInit {

  userInfo: any;
  currency: Currency = new Currency;
  cCode = 'PH';
  curCode = 'PHP';
  currencyValue = 0;

  uri = environment.backendUrl;
  pre_check_out_info: any = {};
  cart_count = 0;

  buy_controlled_cc_price: number;
  buy_controlled_lc_price: number;
  traditional_unilevel:number;
  quantity: number;
  total_payable_cc = 0;
  total_payable_lc = 0;

  payItem: FormGroup;

  loading = false;
  showSuccess = false;
  success = { message: '' };
  claim: any;
  bazaar_shop_id = 0;

  constructor(public socket: SocketService, private ccp: CountryCurrencyPriceService, private api: HttpService,
    public share: ShareService, private http: HttpClient, private bzs: BazaarService, private fb: FormBuilder,
    private notify: NotificationsService, private router: Router) {
      this.payItem = this.fb.group({});
    }

  async ngOnInit() {
    this.buy_controlled_cc_price = 0;
    this.quantity = 0;
    // get cart count
    this.getCartCount();
    // get user country code
    this.userInfo = await this.ccp.getUserInfo();
    this.cCode = this.userInfo['countryCode'];
    // get user country currency code
    this.curCode = this.currency[`${this.cCode}`];
    // get user country currency value
    this.currencyValue = await this.ccp.getCurrencyValue(this.curCode);
    // get pre checkout order product information
    this.pre_check_out_info = await this.bzs.getPreCheckoutInfo(this.share.user.id);
    // console.log(this.pre_check_out_info);
    if (this.pre_check_out_info.length) {
      this.api.postToBackend('/claim', { shop_id: this.pre_check_out_info[0].Pro_Info[0].userid, userid: this.share.user.id }
      , this.share.user.token).then(res => {
          // console.log(Object.keys(res).length);
          if (Object.keys(res).length === 0) {
            this.claim = false;
          } else {
            // console.log(res);
            this.claim = res[0]['claim'];
            this.bazaar_shop_id = res[0]['shop_id'];
          }
      });
    }
  }

  async getCartCount(): Promise<any> {
    const res = await this.http.get(`${this.uri}/getCartCount/${this.share.user.id}`).toPromise();
    this.cart_count = res['total'];
  }

  buy_controlled_cc_price_change(event: any, lc_to_cc_post_priced: number) {
    this.buy_controlled_cc_price = parseFloat(event.target.value);
    // Buy @ Controlled LC Price = Buy @ Controlled CC Price / 1 LC To CC @ Post Priced
    this.buy_controlled_lc_price = this.buy_controlled_cc_price / lc_to_cc_post_priced;
    // Total Payable CC Value = Quantity * Buy @ Controlled CC Price
    this.total_payable_cc = this.buy_controlled_cc_price * this.quantity;
    // Total Payable LC = Quantity * Buy @ Controlled LC Price
    this.total_payable_lc = this.quantity * this.buy_controlled_lc_price;
      
  }

  quantity_change(event: any) {
    this.quantity = parseInt(event.target.value, 10);
    this.total_payable_cc = parseFloat((this.buy_controlled_cc_price * this.quantity).toFixed(7));
    this.total_payable_lc = this.quantity * this.buy_controlled_lc_price;
    //Traditional Unilevel
    this.traditional_unilevel= parseFloat(((this.total_payable_cc*0.1821)/15).toFixed(7));
  }

  submitPay(shop_id: number, bz_pro_id: number, tps: number, tas: number, cart_id: number) {
    if (this.bazaar_shop_id !== 0) {
      if (this.bazaar_shop_id !== shop_id && this.claim) {
        this.notify.error('INFO', 'Shop to bazaar id number ' + this.bazaar_shop_id, { timeOut: 5000 });
        this.ngOnInit();
        return;
      }
    }
    this.payItem.value.shop_id = shop_id;
    this.payItem.value.bz_pro_id = bz_pro_id;
    this.payItem.value.quantity = this.quantity;
    this.payItem.value.buy_controlled_cc_price = this.buy_controlled_cc_price;
    this.payItem.value.total_payable_cc_price = this.total_payable_cc;
    this.payItem.value.total_payable_lc = this.total_payable_lc;
    this.payItem.value.buy_controlled_lc_price = this.buy_controlled_lc_price;
    this.payItem.value.tps = tps;
    this.payItem.value.tas = tas;
    this.payItem.value.rate = this.socket.lc_btc;
    this.payItem.value.type = 'bzppay';
    this.payItem.value.claim = this.claim;
    this.payItem.value.cart_count = this.cart_count;
    this.payItem.value.cart_id = cart_id;
    // console.log(this.payItem.value);

    this.showSuccess = false;
    this.loading = true;

    this.api.postToBackend('/recordOrder', this.payItem.value, this.share.user.token).then(res => {
      this.loading = false;
      if (res['status'] === 'success') {
        this.notify.success('INFO', 'Pay Processing Success!', { timeOut: 5000 });
        this.success.message = 'Payment Success!';
        this.showSuccess = true;
        this.ngOnInit();
      }
    }).catch(err => {
      this.notify.error('ERROR', JSON.parse(err._body).payload);
    });
  }

  cancelProduct(cid: number) {
    this.loading = true;
    this.api.postToBackend('/removeProductFromCart', { cart_id: cid }, this.share.user.token).then(res => {
      this.loading = false;
      if (res) {
        this.notify.success('INFO', 'Product Removed from your cart.', { timeOut: 5000 });
        this.ngOnInit();
      }
    }).catch(err => {
      this.notify.error('ERROR', JSON.parse(err._body).payload);
    });
  }

  goToBazaarHome() {
    this.router.navigate(['cryptobazaar']);
  }

}
