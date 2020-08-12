import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SocketService } from 'src/app/services/socket.service';
import { ShareService } from 'src/app/services/share.service';
import { HttpService } from 'src/app/services/http.service';
import { environment } from '../../../../environments/environment';
import { FileUploader, ParsedResponseHeaders, FileItem } from 'ng2-file-upload';
import Currency from '../../../model/currency';
import { CountryCurrencyPriceService } from 'src/app/services/country-currency-price.service';
import { NotificationsService } from 'angular2-notifications';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-bazaar-product-edit',
  templateUrl: './bazaar-product-edit.component.html',
  styleUrls: ['./bazaar-product-edit.component.css']
})
export class BazaarProductEditComponent implements OnInit {

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

  uri = environment.backendUrl;
  bzp_angForm: FormGroup;

  auto_control_cc_price = 0;
  auto_initial_lc_price = 0;
  auto_control_lc_price = 0;
  auto_indirect_savings = 8;
  auto_assigned_savings: number;
  auto_agent_savings: number;
  auto_personal_savings = 0;
  original_availability = 0;
  bz_pro_id = 0;

  userInfo: any;
  currency: Currency = new Currency;
  cCode = 'PH';
  curCode = 'PHP';
  currencyValue = 0;

  imgURL: any;
  bzp_image_name = '';

  loading = false;

  public bzp_uploader: FileUploader = new FileUploader({
    url: this.uri + '/images/bazaarProd', itemAlias: 'bzp_photo', headers: [{name: 'Accept', value: 'application/json'}]
  });

  constructor(private router: ActivatedRoute, public socket: SocketService, public share: ShareService,
    private api: HttpService, private fb: FormBuilder, private ccp: CountryCurrencyPriceService,
    private notify: NotificationsService, private http: HttpClient) {
      this.createForm();
  }

  createForm() {
    // create bazaar product form
    this.bzp_angForm = this.fb.group({
      bp_name: ['', [Validators.required, Validators.minLength(3)]],
      availability: ['', [Validators.required, Validators.min(5), Validators.pattern('[0-9]*')]],
      initial_cc_price: ['', [Validators.required, Validators.min(0), Validators.pattern('[0-9]*')]],
      assigned_savings: ['', [Validators.required, Validators.min(18), Validators.max(36), Validators.pattern('[0-9]*')]],
      agent_savings: ['', [Validators.required, Validators.min(1), Validators.max(5), Validators.pattern('[0-9]*')]],
      product_description: ['', Validators.required],
      bzp_photo: ['', Validators.required],
      bzp_type: ['', Validators.required]
    });
  }

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
    // console.log(this.bzp_image_name);
  }

  onErrorItem(item: FileItem, response: string, status: number, headers: ParsedResponseHeaders): any {
    const error = JSON.parse(response);
    console.log(error);
  }

  async ngOnInit() {
    this.bzp_uploader.onAfterAddingFile = (file) => {
      file.withCredentials = false;
    };
    // for response after image uploading
    this.bzp_uploader.onErrorItem = (item, response, status, headers) => this.onErrorItem(item, response, status, headers);
    this.bzp_uploader.onSuccessItem = (item, response, status, headers) => this.onSuccessItem(item, response, status, headers);
    // get product info from db
    this.api.postToBackend('/productEdit', { bzp_id : this.router.params['_value'].id }, this.share.user.token).then(res => {
      // console.log(res);
      if (Object.keys(res).length === 1) {
        this.imgURL = 'assets/' + res[0]['bzp_photo'];
        // fill input value with product information
        this.bzp_angForm.get('bp_name').setValue(res[0]['bp_name']);
        this.bzp_angForm.get('availability').setValue(res[0]['availability']);
        this.bzp_angForm.get('initial_cc_price').setValue(res[0]['initial_cc_price']);
        this.bzp_angForm.get('assigned_savings').setValue(res[0]['assigned_savings']);
        this.bzp_angForm.get('agent_savings').setValue(res[0]['agent_savings']);
        this.bzp_angForm.get('product_description').setValue(res[0]['product_description']);
        this.bzp_angForm.get('bzp_type').setValue(res[0]['bzp_type']);
        this.cc_lc_Change(res[0]['initial_cc_price']);
        this.auto_assigned_savings = res[0]['assigned_savings'];
        this.auto_agent_savings = res[0]['agent_savings'];
        this.auto_personal_savings = res[0]['assigned_savings'] - res[0]['agent_savings'] - this.auto_indirect_savings;
        this.original_availability = res[0]['availability'];
        this.bz_pro_id = res[0]['bz_pro_id'];
        this.bzp_image_name = res[0]['bzp_photo'];
      }
    });
    // get user country code
    this.userInfo = await this.ccp.getUserInfo();
    this.cCode = this.userInfo['countryCode'];
    // get user country currency code
    this.curCode = this.currency[`${this.cCode}`];
    // get user country currency value
    this.currencyValue = await this.ccp.getCurrencyValue(this.curCode);
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

  // update bazaar product submit
  submitProd(total_lc_amount: number) {
    
    console.log("socket",this.socket);
    this.loading = true;

    const bz_prod_uri = this.uri + '/bzprodUpdate/' + this.bz_pro_id;

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
    this.bzp_angForm.value.flag = false;
    const new_availability = parseInt(this.bzp_angForm.value.availability, 10);

    if (this.original_availability === new_availability) {
      // updating produt post
      this.http.post(`${bz_prod_uri}`, this.bzp_angForm.value).subscribe(res => {
        this.loading = false;
        if (res['status'] === 'success') {
          this.notify.success('INFO', 'Product Update Success!', { timeOut: 5000 });
          this.ngOnInit();
        }
      });
    } else {
      this.bzp_angForm.value.flag = true;
      this.api.postToBackend('/recordOrder', {
        rate: this.socket.lc_btc,
        amount_lc: total_lc_amount,
        type: 'bzpost'
      }, this.share.user.token).then(res => {
        this.loading = false;
        this.notify.success('INFO', 'Processing Success!', { timeOut: 5000 });
        // updating produt post
        this.http.post(`${bz_prod_uri}`, this.bzp_angForm.value).subscribe(rs => {
          if (rs['status'] === 'success') {
            this.notify.success('INFO', 'Product Update Success!', { timeOut: 5000 });
            this.ngOnInit();
          }
        });
      }).catch(err => {
        this.notify.error('ERROR', JSON.parse(err._body).payload);
      });
    }
  }

}
