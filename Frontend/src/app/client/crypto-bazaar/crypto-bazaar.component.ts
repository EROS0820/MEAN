import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpService } from '../../services/http.service';
import { HttpClient } from '@angular/common/http';
import { ShareService } from '../../services/share.service';
import { SocketService } from '../../services/socket.service';
import { CountryCurrencyPriceService } from 'src/app/services/country-currency-price.service';
import { Router } from '@angular/router';
import { NotificationsService } from 'angular2-notifications';
import { environment } from '../../../environments/environment';
import Currency from '../../model/currency';
import { FileUploader, ParsedResponseHeaders, FileItem } from 'ng2-file-upload';

@Component({
  selector: 'app-crypto-bazaar',
  templateUrl: './crypto-bazaar.component.html',
  styleUrls: ['./crypto-bazaar.component.css']
})
export class CryptoBazaarComponent implements OnInit {

  @ViewChild('agent_savings') agent_savings: ElementRef;
  @ViewChild('assigned_savings') assigned_savings: ElementRef;
  @ViewChild('control_cc_price') control_cc_price: ElementRef;
  @ViewChild('control_lc_price') control_lc_price: ElementRef;
  @ViewChild('indirect_savings') indirect_savings: ElementRef;
  @ViewChild('initial_lc_price') initial_lc_price: ElementRef;
  @ViewChild('lc_btc') lc_btc: ElementRef;
  @ViewChild('lc_cc') lc_cc: ElementRef;
  @ViewChild('personal_savings') personal_savings: ElementRef;
  @ViewChild('total_indirect_savings') total_indirect_savings: ElementRef;
  @ViewChild('total_product_costs') total_product_costs: ElementRef;

  constructor(private api: HttpService, public share: ShareService,
    private ccp: CountryCurrencyPriceService, private fb: FormBuilder,
    private http: HttpClient, private router: Router,
    public socket: SocketService,
    private notify: NotificationsService) {
    this.createForm();
  }

  uri = environment.backendUrl;
  orders;
  sum = 0;
  loading = false;
  showSuccess = false;
  success = { message: '' };
  bazaar_flag;

  btc_conversion_submitted = 0;
  userInfo: any;
  lc_balance = 0;
  currency: Currency = new Currency;
  cCode = 'PH';
  curCode = 'PHP';
  currencyValue = 0;

  angForm: FormGroup;
  bzp_angForm: FormGroup;
  bzp_id = 0;

  auto_control_cc_price = 0;
  auto_initial_lc_price = 0;
  auto_control_lc_price = 0;
  auto_indirect_savings = 8;
  auto_assigned_savings: number;
  auto_agent_savings: number;
  auto_personal_savings = 0;

  imgURL: any;
  bzp_image_name = '';

  public bz_uploader: FileUploader = new FileUploader({
    url: this.uri + '/images/bazaar/' + this.share.user.id, itemAlias: 'bz_photo'
  });

  public bzp_uploader: FileUploader = new FileUploader({
    url: this.uri + '/images/bazaarProd', itemAlias: 'bzp_photo', headers: [{name: 'Accept', value: 'application/json'}]
  });

  preview(files) {
    if (files.length === 0) {
      return;
    }
    // console.log(files);
    const reader = new FileReader();
    reader.readAsDataURL(files[0]);
    reader.onload = (_event) => {
      this.imgURL = reader.result;
    };
  }

  onSuccessItem(item: FileItem, response: string, status: number, headers: ParsedResponseHeaders): any {
    const data = JSON.parse(response);
    // console.log(data);
    this.bzp_image_name = data['name'];
    console.log(this.bzp_image_name);
  }

  onErrorItem(item: FileItem, response: string, status: number, headers: ParsedResponseHeaders): any {
    const error = JSON.parse(response);
    console.log(error);
  }

  createForm() {
    // create bazaar form
    this.angForm = this.fb.group({
      bz_name: ['', [Validators.required, Validators.minLength(3)]],
      city: ['', [Validators.required, Validators.minLength(4)]],
      address: ['', [Validators.required, Validators.minLength(7)]],
      shop_rule: ['', [Validators.required, Validators.minLength(20)]],
      bz_photo: ['', Validators.required]
    });
    // create bazaar product form
    this.bzp_angForm = this.fb.group({
      bp_name: ['', [Validators.required, Validators.minLength(3)]],
      availability: ['', [Validators.required, Validators.min(5), Validators.pattern('[0-9]*')]],
      initial_cc_price: ['', [Validators.required, Validators.min(0), Validators.pattern('[0-9]*')]],
      assigned_savings: ['', [Validators.required, Validators.min(23), Validators.max(36), Validators.pattern('[0-9]*')]],
      agent_savings: ['', [Validators.required, Validators.min(8), Validators.max(10), Validators.pattern('[0-9]*')]],
      product_description: ['', Validators.required],
      bzp_photo: ['', Validators.required]
    });
  }

  cc_lc_Change(initial_cc_price: number) {
    this.auto_control_cc_price = initial_cc_price;
    this.auto_initial_lc_price = initial_cc_price;
    this.auto_control_lc_price = initial_cc_price;
  }

  saving_Change(saving_value: number, flag: number) {
    if (flag === 0) {
      this.auto_assigned_savings = saving_value;
    } else {
      this.auto_agent_savings = saving_value;
    }
    this.auto_personal_savings = this.auto_assigned_savings - this.auto_agent_savings - this.auto_indirect_savings;
  }

  async ngOnInit() {

    this.api.get(this.uri + '/getBazaarInfo/' + this.share.user.id).then((response: object) => {
     // console.log('*******',response);
     // console.log('$$$$$$$$$',response['bz_flag']);
      if (response['bz_flag'] === 0) {
        this.bazaar_flag = false;
      } else {
        this.bazaar_flag = true;
      }
    });

    // Sum Start
  	this.api.getToBackend('/getSuccessfulOrders', this.share.user.token).then((result: any) => {
  		this.orders = result
      for(let i=0; i<this.orders.length; i++){
          if(this.orders[i].btc_paid){
             this.sum+= this.orders[i].btc_paid;
          }
      }
      // console.log('sum',this.sum);
  	})
    // Sum Ends

    this.bz_uploader.onAfterAddingFile = (file) => {
      file.withCredentials = false;
    };
    this.bzp_uploader.onAfterAddingFile = (file) => {
      file.withCredentials = false;
    };
    this.bzp_uploader.onErrorItem = (item, response, status, headers) => this.onErrorItem(item, response, status, headers);
    this.bzp_uploader.onSuccessItem = (item, response, status, headers) => this.onSuccessItem(item, response, status, headers);

    // get user country code
    this.userInfo = await this.ccp.getUserInfo();
    this.cCode = this.userInfo['countryCode'];
    // get user country currency code
    this.curCode = this.currency[`${this.cCode}`];
    // get user country currency value
    this.currencyValue = await this.ccp.getCurrencyValue(this.curCode);

    this.api.get(this.uri + '/getBtcConversionSubmitted/' + this.share.user.id).then((response: any) => {
      // console.log(response);
      this.btc_conversion_submitted = response;
      if (this.btc_conversion_submitted >= this.socket.CycleBtcConversionTarget) {
        this.notify.info('INFO', 'You are reward member!', { timeOut: 3000 });
      }
    });
    this.api.get(this.uri + '/getLcBalance/' + this.share.user.id).then((response: number) => {
      this.lc_balance = response['value'];
    });

  }

  // create bazaar submit
  submitFunc() {
    this.loading = true;
    const bazaar_uri = this.uri + '/bazaarCreate/' + this.share.user.id;
    console.log(this.angForm.value);
    this.http.post(`${bazaar_uri}`, this.angForm.value).subscribe(res => {
      this.loading = false;
       console.log(res);
      if (res['status'] === 'success') {
        this.angForm.reset();
        this.bazaar_flag = true;
        this.router.navigate(['/cryptobazaar']);
      }
    });
  }

  // create bazaar product submit
  submitProd(total_lc_amount: number) {
    this.showSuccess = false;
    this.loading = true;
    // console.log('rate ' + this.socket.lc_btc + ' amount_lc ' + total_lc_amount);
    this.api.postToBackend('/recordOrder', {
      rate: this.socket.lc_btc,
      amount_lc: parseFloat(total_lc_amount.toString().replace(/,/g, '')),
      type: 'bzpost'
    }, this.share.user.token).then(res => {
      console.log('order res ' + res);
      this.loading = false;
      this.notify.success('INFO', 'Processing Success!', { timeOut: 5000 });
      const bz_prod_uri = this.uri + '/bzprodCreate/' + this.share.user.id;

      this.bzp_angForm.value.agent_savings = parseInt(this.agent_savings.nativeElement.value, 10);
      this.bzp_angForm.value.assigned_savings = parseInt(this.assigned_savings.nativeElement.value, 10);
      this.bzp_angForm.value.control_cc_price = parseFloat(this.control_cc_price.nativeElement.value).toFixed(8);
      this.bzp_angForm.value.control_lc_price = parseFloat(this.control_lc_price.nativeElement.value).toFixed(8);
      this.bzp_angForm.value.indirect_savings = parseInt(this.indirect_savings.nativeElement.value, 10);
      this.bzp_angForm.value.initial_lc_price = parseFloat(this.initial_lc_price.nativeElement.value).toFixed(8);
      this.bzp_angForm.value.lc_btc = parseFloat(this.lc_btc.nativeElement.value).toFixed(8);
      this.bzp_angForm.value.lc_cc = parseFloat(this.lc_cc.nativeElement.value).toFixed(8);
      this.bzp_angForm.value.personal_savings = parseInt(this.personal_savings.nativeElement.value, 10);
      this.bzp_angForm.value.total_indirect_savings = parseFloat(this.total_indirect_savings.nativeElement.value).toFixed(8);
      this.bzp_angForm.value.total_product_costs = parseFloat(this.total_product_costs.nativeElement.value).toFixed(8);
      this.bzp_angForm.value.bzp_photo = this.bzp_image_name;
      this.bzp_angForm.value.user_country = this.share.user.user_country;

      this.http.post(`${bz_prod_uri}`, this.bzp_angForm.value).subscribe(async rs => {
        console.log('product add res ' +  rs);
        if (rs['status'] === 'success') {
          this.bzp_angForm.reset();
          this.success.message = 'Product Successfully Added!';
          this.showSuccess = true;
          this.notify.success('INFO', 'Product Successfully Added!', { timeOut: 5000 });
        }
      });
    }).catch(err => {
      this.notify.error('ERROR', JSON.parse(err._body).payload, { timeOut: 5000 });
    });
  }

}
