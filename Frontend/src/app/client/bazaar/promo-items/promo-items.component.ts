import { Component, OnInit } from '@angular/core';
import { ShareService } from 'src/app/services/share.service';
import { BazaarService } from 'src/app/bazaar.service';
import { SocketService } from 'src/app/services/socket.service';
import Currency from '../../../model/currency';
import { CountryCurrencyPriceService } from 'src/app/services/country-currency-price.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { NotificationsService } from 'angular2-notifications';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpService } from 'src/app/services/http.service';

@Component({
  selector: 'app-promo-items',
  templateUrl: './promo-items.component.html',
  styleUrls: ['./promo-items.component.css']
})
export class PromoItemsComponent implements OnInit {

  userInfo: any;
  currency: Currency = new Currency;
  cCode = 'PH';
  curCode = 'PHP';
  currencyValue = 0;

  bazaar_products: any = {};
  searchText;
  bz_shop_name: string;
  cart_count = 0;
  uri = environment.backendUrl;

  constructor(public share: ShareService, private bzs: BazaarService, public socket: SocketService,
    private ccp: CountryCurrencyPriceService, private http: HttpClient, private notify: NotificationsService,
    private route: ActivatedRoute, private api: HttpService, private router: Router) { }

  async ngOnInit() {
    // get cart count
    this.getCartCount();
    // get user country code
    this.userInfo = await this.ccp.getUserInfo();
    this.cCode = this.userInfo['countryCode'];
    // get user country currency code
    this.curCode = this.currency[`${this.cCode}`];
    // get user country currency value
    this.currencyValue = await this.ccp.getCurrencyValue(this.curCode);
    // get promo products
    this.api.postToBackend('/getPromoProducts', { user_country : this.share.user.user_country }, this.share.user.token).then(res => {
      this.bazaar_products = res;
      // console.log(this.bazaar_products);
    });
  }

  async getCartCount(): Promise<any> {
    const res = await this.http.get(`${this.uri}/getCartCount/${this.share.user.id}`).toPromise();
    this.cart_count = res['total'];
  }

  addToCart(bz_pro_id) {
    this.http.post(`${this.uri}/addToCart`, { bz_pro_id: bz_pro_id, userid: this.share.user.id }).subscribe(res => {
      if (res['status'] === 'success') {
        this.cart_count++;
        this.notify.success('INFO', res['payload'], { timeOut: 5000 });
      } else if (res['status'] === 'already') {
        this.notify.error('INFO', res['payload'], { timeOut: 5000 });
      }
    });
  }

  product_delete(bz_pro_id: number) {
    this.api.postToBackend('/deleteProduct', { bz_pro_id: bz_pro_id }, this.share.user.token).then(res => {
      if (res['status'] === 'success') {
        this.notify.success('INFO', res['payload'], { timeOut: 5000 });
        this.ngOnInit();
      } else if (res['status'] === 'error') {
        this.notify.error('INFO', res['payload'], { timeOut: 5000 });
      }
    });
  }

  goToBazaarHome() {
    this.router.navigate(['cryptobazaar']);
  }
}
