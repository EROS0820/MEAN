import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpService } from 'src/app/services/http.service';
import { ShareService } from 'src/app/services/share.service';
import { SocketService } from 'src/app/services/socket.service';
import Currency from '../../../model/currency';
import { CountryCurrencyPriceService } from 'src/app/services/country-currency-price.service';

@Component({
  selector: 'app-refillable-product',
  templateUrl: './refillable-product.component.html',
  styleUrls: ['./refillable-product.component.css']
})
export class RefillableProductComponent implements OnInit {

  refillableProducts: any = {};
  searchText;

  userInfo: any;
  currency: Currency = new Currency;
  cCode = 'PH';
  curCode = 'PHP';
  currencyValue = 0;

  constructor(private router: Router, private api: HttpService, private share: ShareService,
    public socket: SocketService, private ccp: CountryCurrencyPriceService) { }

  async ngOnInit() {
    // get user country code
    this.userInfo = await this.ccp.getUserInfo();
    this.cCode = this.userInfo['countryCode'];
    // get user country currency code
    this.curCode = this.currency[`${this.cCode}`];
    // get user country currency value
    this.currencyValue = await this.ccp.getCurrencyValue(this.curCode);
    // get refillable data
    this.api.postToBackend('/getRefillableProducts', {
      userid : this.share.user.id,
      refillProductAvailavility: this.socket.RefillProductAvailavility }, this.share.user.token).then((response: any) => {
      this.refillableProducts = response;
    });
  }

  goToBazaarHome() {
    this.router.navigate(['cryptobazaar']);
  }

}
