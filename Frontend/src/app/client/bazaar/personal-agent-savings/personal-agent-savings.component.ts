import { Component, OnInit } from '@angular/core';
import { ShareService } from 'src/app/services/share.service';
import { Router } from '@angular/router';
import { HttpService } from 'src/app/services/http.service';
import { CountryCurrencyPriceService } from 'src/app/services/country-currency-price.service';
import Currency from '../../../model/currency';

@Component({
  selector: 'app-personal-agent-savings',
  templateUrl: './personal-agent-savings.component.html',
  styleUrls: ['./personal-agent-savings.component.css']
})
export class PersonalAgentSavingsComponent implements OnInit {

  savings: any = {};
  flag = true;
  tps_tas_sum = 0;

  userInfo: any;
  currency: Currency = new Currency;
  cCode = 'PH';
  curCode = 'PHP';

  constructor(private router: Router, private share: ShareService, private api: HttpService, private ccp: CountryCurrencyPriceService) { }

  async ngOnInit() {
    // get user country code
    this.userInfo = await this.ccp.getUserInfo();
    this.cCode = this.userInfo['countryCode'];
    // get user country currency code
    this.curCode = this.currency[`${this.cCode}`];
    this.getData(this.flag);
  }

  getData(cond: boolean) {
    if (cond) {
      this.api.postToBackend('/getPersonalSavings', { userid: this.share.user.id }, this.share.user.token).then(res => {
        this.savings = res;
        if (Object.keys(res).length > 0) {
          for (let i = 0; i < Object.keys(res).length; i++) {
            this.tps_tas_sum += res[i]['tps'];
          }
        }
      });
    } else {
      this.savings = {};
      this.tps_tas_sum = 0;
    }
  }

  personal_agent(cond: boolean) {
    this.flag = !cond;
    this.getData(this.flag);
  }

  goToBazaarHome() {
    this.router.navigate(['cryptobazaar']);
  }

}
