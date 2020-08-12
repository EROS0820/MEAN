import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../services/http.service';
import { Router, ActivatedRoute } from '@angular/router';

import { StorageService } from '../../services/storage.service';
import { ShareService } from '../../services/share.service';
import { SocketService } from '../../services/socket.service';
import { CountryCurrencyPriceService } from '../../services/country-currency-price.service';
import Currency from '../../model/currency';
import {GenealogyTreeService} from "../../services/side_services/genealogy-tree.service";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  constructor(
    private http: HttpService,
    private router: Router,
    private route: ActivatedRoute,
    private storage: StorageService,
    private share: ShareService,
    private socket: SocketService,
    private ccp: CountryCurrencyPriceService,
    private gtree: GenealogyTreeService
    ) { }

  loading = false;
  showError = false;
  error = {
    message: ''
  };

  user: User = {
    first_name: '',
    last_name: '',
    email: '',
    phonenumber: '',
    password: '',
    re_password: '',
    agent_id: '',
    user_country: '',
    currency_val: ''
  };

  userInfo: any;
  currency: Currency = new Currency;
  cCode = 'PH';
  curCode = 'PHP';
  currencyValue = 0;

  submit() {
    this.loading = true;
    this.http.postToBackend('/register', this.user)
      .then((result: any) => {
        const user = result.payload;
        this.initializeGenealogyTree(user);
        this.storage.saveUser(user);
        this.share.updateUser(user);
        this.socket.reconnect();
        this.loading = false;
        this.router.navigate(['/home']);
      })
      .catch(err => {
        if (err.status === 422) {
          this.showError = true;
          this.loading = false;
          this.error.message = 'Please enter required field';
        } else {
          this.showError = true;
          this.loading = false;
          this.error.message = JSON.parse(err._body).payload;
        }
      });
  }

  async ngOnInit() {
    // get user country code
    this.userInfo = await this.ccp.getUserInfo();
    // user country code
    this.user.user_country = this.userInfo['country'];
    this.cCode = this.userInfo['countryCode'];
    // get user country currency code
    this.curCode = this.currency[`${this.cCode}`];
    // get user country currency value
    this.currencyValue = await this.ccp.getCurrencyValue(this.curCode);
    this.user.currency_val = this.currencyValue + ' ' + this.curCode;

    const id = +this.route.snapshot.paramMap.get('id');
    if (id > 0) {
      this.storage.saveAgentID(String(id));
      this.user.agent_id = String(id);
    } else {
      this.user.agent_id = this.storage.getAgentID();
    }
    if (this.storage.getUser()) {
      this.router.navigate(['/home']);
    }

  }
  initializeGenealogyTree(user) {
    console.log('her in user data of register', user);
    if(user.id == 1) {
      return this.gtree.initializeTree(user)
        .pipe().subscribe(res=>{
          if(res['code'] == 201) {
            console.log('successfully initialized tree in register component', res['data']);
          }
        })
    }
  }
}

interface User {
  first_name: String;
  last_name: String;
  email: String;
  password: String;
  re_password: String;
  phonenumber: String;
  agent_id: String;
  user_country: String;
  currency_val: String;
}
