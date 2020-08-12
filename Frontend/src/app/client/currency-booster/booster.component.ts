import { Component, OnInit, Input } from '@angular/core';
import {FormGroup, FormControl, Validators} from '@angular/forms';
import { HttpService } from '../../services/http.service';
import { ShareService } from '../../services/share.service';
import {StorageService} from "../../services/storage.service";
import { SocketService } from '../../services/socket.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Location } from '@angular/common';
import { CountryCurrencyPriceService } from 'src/app/services/country-currency-price.service';
import { sendRequest } from 'selenium-webdriver/http';
import Currency from '../../model/currency';

@Component({
  selector: 'app-booster',
  templateUrl: './booster.component.html',
  styleUrls: ['./booster.component.css']
})
export class BoosterComponent implements OnInit {

  @Input() btc_balance;
  @Input() lc_balance;

  public uri = environment.backendUrl;
  public userarray=[];
  public userid;
  public orders;
  public sumb=0;
  public search;
  public  suml=0;
  public tabledata;
  public table;
  public chequesum=0;

  lcresponse: any;
  Lcbalance: any;
  boosterLcvalue: any;
  currentUser: any;
  booster: any;
  crypto_check: boolean = false;
  modalState : any;
  transferStatus : any;
  buybooster : any;
  mymarketprofitbalance : any;
  currencyBS : any;
  totalpaidCB : any;
  mytotalMP : any;
  currencyBLS : any;
  performingCB : any;
  currencyBAITM : any;
  marketvalue : any;
  myboosterbalance : any;
  mymarketPB : any;
  lcvaluePB : any;
  currency100 : any;
  performingCal : any;
  date = new Date();
  days: any;
  month: any;
  months: any;
  day: any;
  year: any;
  hours: any;
  minute: any;
  second: any;
  seconds: any;
  minutes: any;
  hour: any;
  perfectdate: any;
  listboosterdatas: any;
  boostertransferrecords: any;
  textvalue = 0;
  textidvalue: any;
  otheramount: any;
  boostersentrecords: any;
  searchidnum = '';
  searchid = '';
  currencyValue : any;
  curCode = 'PHP';
  userInfo : any;
  cCode : any;
  changevalue : any;
  currency: Currency = new Currency;
  interval: any;


  constructor(private api: HttpService,private location: Location,private ccp: CountryCurrencyPriceService,private modalService: NgbModal,public share: ShareService, public socket:SocketService, public http:HttpClient,private storageService: StorageService,) { }

  ngOnInit() {
    this.userInfo = this.ccp.getUserInfo();

    // user country code
    this.cCode = this.userInfo['countryCode'];
    // get user country currency code
    this.curCode = this.currency[`${this.cCode}`];
    
    
    // get user country currency value
    this.currencyValue = this.ccp.getCurrencyValue(this.curCode);
    // periodly update
    this.interval = setInterval(async () => {
      this.currencyValue = await this.ccp.getCurrencyValue(this.curCode);
	}, 1200000);
          this.cCode = this.userInfo['countryCode'];
          this.curCode = this.currency[`${this.cCode}`];
          this.currencyValue = this.ccp.getCurrencyValue(this.curCode);
          this.date.setTime(Date.now());
          this.day = this.date.getDate();
          this.year = this.date.getFullYear();
          this.second = this.date.getSeconds();
          this.minute = this.date.getMinutes();
          this.hour = this.date.getHours();
          if(this.day<10){
            this.days = "0"+this.day;
          }
          else{
            this.days = this.day;
          }
          this.month = this.date.getMonth();
          if(this.month<10){
            this.months="0"+this.month;
          }
          else{
            this.months=this.month;
          }
          if(this.hour<10){
            this.hours="0"+this.hour;
          }
          else{
            this.hours=this.hour;
          }
          if(this.minute<10){
            this.minutes="0"+this.minute;
          }
          else{
            this.minutes=this.minute;
          }
          if(this.second<10){
            this.seconds="0"+this.second;
          }
          else{
            this.seconds=this.second;
          }
          this.perfectdate=this.months+"-"+this.days+"-"+this.year+"/"+this.hours+":"+this.minutes+":"+this.seconds;
    this.booster = "1,000.00 PHP";
    this.currencyBLS = 3000000;
    this.currentUser =  this.storageService.getUser();
    this.api.getToBackend('/getcurrencyBS', this.share.user.token).then((response:any) => {
      
      console.log("currency",response.result)
      this.currencyBS = response.result[0].currencyBS;
      this.api.getToBackend('/getLCBalance', this.share.user.token).then((response:any) => {
        this.lcresponse = response.result;
        this.Lcbalance = this.lcresponse[0].lc;
        this.totalpaidCB = this.lcresponse[0].totalpaidCB;
        this.mytotalMP = this.lcresponse[0].mytotalMP;
        this.performingCB = this.lcresponse[0].performingCB;
        this.currencyBAITM = this.currencyBLS - this.currencyBS;
        this.marketvalue = this.totalpaidCB * 10;
        this.myboosterbalance = this.marketvalue - this.mytotalMP;
        this.mymarketPB = this.lcresponse[0].mymarketPB;
        this.lcvaluePB = this.mymarketPB / this.socket.btc_usd / this.socket.lc_btc / this.currencyValue.__zone_symbol__value;
        if(this.currencyBS>this.currencyBLS){
          $("#buyBooster").hide();
        }
      })
    })
  	
    this.api.getToBackend('/getListofboosterdata', this.share.user.token).then((response:any) => {
      this.listboosterdatas=response.result;
    })
    this.api.getToBackend('/getBoostertransferrecord', this.share.user.token).then((response:any) => {
      this.boostertransferrecords=response.result;
    })
    this.api.getToBackend('/getBoostersentrecord', this.share.user.token).then((response:any) => {
      this.boostersentrecords=response.result;
    })
    // this.api.getToBackend('/getReferredCount', this.share.user.token).then((response:any) => {
    //   this.referred_count = response.result;
    // })
  }
  get sortData() {
    if(this.listboosterdatas)
    {return this.listboosterdatas.sort((a, b) => {
      return <any>new Date(b.transaction_time) - <any>new Date(a.transaction_time);
    });}
  }
  get sentData() {
    if(this.boostersentrecords)
    {return this.boostersentrecords.sort((a, b) => {
      return <any>new Date(b.transaction_time) - <any>new Date(a.transaction_time);
    });}
  }
  get transferData() {
    if(this.boostertransferrecords)
    {return this.boostertransferrecords.sort((a, b) => {
      return <any>new Date(b.transaction_time) - <any>new Date(a.transaction_time);
    });}
  }


  openWindowCustomClass(content) {
    this.modalService.open(content, { windowClass: 'dark-modal' });
  }

  sendBooster(){
    this.totalpaidCB = this.totalpaidCB - this.textvalue;
    console.log("text",this.textidvalue)
    this.api.postToBackend('/getothereid',{text:this.textidvalue},this.share.user.token).then((response:any) => {
      this.otheramount = response.result[0].totalpaidCB+this.textvalue;
      this.api.postToBackend('/updatesenddata', {
        text:this.textidvalue,
        mytotalpaidCB: this.totalpaidCB,
        receivertotalpaidCB: this.otheramount,
      }, this.share.user.token)
      .then(result => {
      })
      .catch(err => {
        console.log(err);
      });
      this.api.postToBackend('/boostersentrecord', {
        from:this.currentUser['id'],
        to:this.textidvalue,
        amount:this.textvalue,
        time:this.perfectdate
      }, this.share.user.token)
      .then((result:any) => {
        var sentobject={
          amount: this.textvalue,
          to:this.textidvalue,
          transaction_time: this.perfectdate,
          from: this.currentUser['id']
        }
        this.boostersentrecords.unshift(sentobject);
      })
      .catch(err => {
        console.log(err);
      });
    })

  }

  openTransferCustomClass(content1){
    this.modalService.open(content1, { windowClass: 'dark-modal' });
  }

  calculator(){
    this.Lcbalance = this.Lcbalance - (1000 / this.socket.btc_usd / this.socket.lc_btc / this.currencyValue.__zone_symbol__value);
    this.performingCB = this.performingCB + 600;
    this.totalpaidCB = this.totalpaidCB + 600;
    this.currencyBS = this.currencyBS + 1000;
    this.marketvalue = this.totalpaidCB * 10;
    this.currency100 = 100 / this.currencyBS;
    this.performingCal = this.currency100 * this.performingCB;
    this.mytotalMP = this.mytotalMP + this.performingCal;
    this.mymarketPB = this.mymarketPB + this.performingCal;
    this.myboosterbalance = this.marketvalue - this.mytotalMP;
    this.lcvaluePB = this.mymarketPB / this.socket.btc_usd / this.socket.lc_btc / this.currencyValue.__zone_symbol__value;
    this.api.postToBackend('/currencyBS', {
      currencyBS: this.currencyBS
    }, this.share.user.token)
    .then(result => {
    })
    .catch(err => {
      console.log(err);
    });
    this.api.postToBackend('/calculator', {
      mytotalMP: this.mytotalMP,
      mymarketPB: this.mymarketPB,
      performingCB: this.performingCB,
      Lcbalance: this.Lcbalance,
      totalpaidCB: this.totalpaidCB
    }, this.share.user.token)
    .then(result => {
    })
    .catch(err => {
      console.log(err);
    });
    if(this.listboosterdatas.length>0){
      console.log("success", this.listboosterdatas)
      this.api.postToBackend('/listofbooster', {
        id:this.currentUser['id'],
        amount:600,
        time:this.perfectdate,
        pre_id: this.listboosterdatas[0]['_id'],
      }, this.share.user.token)
      .then((result:any) => {
        var tempobject={
          amount: 600,
          transaction_time: this.perfectdate,
          userid: this.currentUser['id']
        }
        this.listboosterdatas[0].amount=800;
        this.listboosterdatas.unshift(tempobject);
      })
      .catch(err => {
        console.log(err);
      });
    }
    if(this.listboosterdatas.length==0){
      this.api.postToBackend('/listofbooster', {
        id:this.currentUser['id'],
        amount:600,
        time:this.perfectdate,
        pre_id: 0,
      }, this.share.user.token)
      .then((result:any) => {
        console.log("result=====", result)
      })
      .catch(err => {
        console.log(err);
      });
    }
  }

  transfer(){
    this.Lcbalance = this.Lcbalance + this.lcvaluePB;
    this.api.postToBackend('/boostertransferrecord', {
      amount:this.mymarketPB,
      LCValue:this.lcvaluePB,
      time:this.perfectdate
    }, this.share.user.token)
    .then((result:any) => {
      console.log("boostertransferrecord",result.loaddata)
      var transferobject={
        amount: this.mymarketPB,
        transaction_time: this.perfectdate,
        LCValue: this.lcvaluePB
      }
      this.boostertransferrecords.unshift(transferobject);
      
      this.mymarketPB = 0;
    })
    .catch(err => {
      console.log(err);
    });
    this.api.postToBackend('/transfer', {
      Lcbalance: this.Lcbalance,
      mymarketPB: 0
    }, this.share.user.token)
    .then(result => {
      console.log("transfer",result)
    })
    .catch(err => {
      console.log(err);
    });
  }
}