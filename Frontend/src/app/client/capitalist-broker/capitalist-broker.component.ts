import { Component, OnInit, ViewChild } from '@angular/core';
import {StorageService} from "../../services/storage.service";
import {ShareService} from "../../services/share.service";
import {SocketService} from "../../services/socket.service";
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {interval} from 'rxjs'
import { HttpService } from 'src/app/services/http.service';
import { environment } from 'src/environments/environment';
import { CountryCurrencyPriceService } from 'src/app/services/country-currency-price.service';
import Currency from 'src/app/model/currency';
import { GenealogyTreeService } from 'src/app/services/side_services/genealogy-tree.service';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { ModalChequeComponent } from './modal-cheque/modal-cheque.component';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-capitalist-broker',
  templateUrl: './capitalist-broker.component.html',
  styleUrls: ['./capitalist-broker.component.css']
})
export class CapitalistBrokerComponent implements OnInit {
  displayedColumns: string[] = ['userid', 'amount', 'profit', 'days', 'total_fund', 'btc_price', 'btc_fund', 'create_time', 'maturity_time', 'action'];
  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);

  @ViewChild(MatPaginator) paginator: MatPaginator;

  userInfo: any;
  currency: Currency = new Currency;
  cCode = 'PH';
  curCode = 'PHP';
  currencyValue = 0;
  interval: any;

  currentUser = [];
  userid: any;
  year: any;
  month: any;
  day: any;
  hour: any;
  minutes: any;
  seconds: any;
  dayOfWeek: any;

  profit = 0.001;
  days = 5;

  phpBalance: any = 0;
  btcBalance: any = 0;
  inputAmount = null;
  uri = environment.backendUrl;
  capitalFlag = true;
  date = new Date;
  total_earning = null;
  bookedFund = 0;
  tHandle = 0;
  maxFund = 0
  
  constructor(private storageService: StorageService,
              public share: ShareService,
              private api: HttpService,
              private ccp: CountryCurrencyPriceService,
              private genealogyTreeService: GenealogyTreeService,
              public socket: SocketService,
              public http:HttpClient,
              public dialog: MatDialog
              ) {
    this.currentUser =  this.storageService.getUser()
  }

  async ngOnInit() {
    // get user country code
    this.userInfo = await this.ccp.getUserInfo();
    // user country code
    this.cCode = this.userInfo['countryCode'];
    // get user country currency code
    this.curCode = this.currency[`${this.cCode}`];
    // get user country currency value
    this.currencyValue = await this.ccp.getCurrencyValue(this.curCode);
    // periodly update
    this.interval = setInterval(async () => {
      this.currencyValue = await this.ccp.getCurrencyValue(this.curCode);
    }, 1200000);
    const source = interval(1000);
    const subscribe = source.subscribe(val => {
      
          this.date.setTime(Date.now());
          this.date.setDate(this.date.getDate() + this.days)
          this.seconds = this.date.getSeconds();
          this.minutes = this.date.getMinutes();
          this.hour = this.date.getHours();

          this.year = this.date.getFullYear();
          switch (this.date.getMonth()) {
            case 0:
              this.month = 'January'
              break;
            case 1:
              this.month = 'February'
              break;
            case 2:
              this.month = 'March'
              break;
            case 3:
              this.month = 'April'
              break;
            case 4:
              this.month = 'May'
              break;
            case 5:
              this.month = 'June'
              break;
            case 6:
              this.month = 'July'
              break;
            case 7:
              this.month = 'August'
              break;
            case 8:
              this.month = 'September'
              break;
            case 9:
              this.month = 'October'
              break;
            case 10:
              this.month = 'November'
              break;
            case 11:
              this.month = 'December'
              break;
          }
          this.day = this.date.getDate();
          switch (this.date.getDay()) {
            case 0:
              this.dayOfWeek = "Sunday";
              break;
            case 1:
              this.dayOfWeek = "Monday";
              break;
            case 2:
              this.dayOfWeek = "Tuesday";
              break;
            case 3:
              this.dayOfWeek = "Wednesday";
              break;
            case 4:
              this.dayOfWeek = "Thursday";
              break;
            case 5:
              this.dayOfWeek = "Friday";
              break;
            case 6:
              this.dayOfWeek = "Saturday";
          }
          // console.log("day", this.year, this.month, this.day, this.dayOfWeek, this.hour, this.minutes, this.seconds)
    });
    if(this.currentUser) {
      this.userid = this.currentUser['id'];
      this.getTotalEarningBalance(this.currentUser['id'])
    }
    this.api.get(this.uri + '/getCoinBalance/' + this.currentUser['id']).then((response) => {
      console.log("values: ", response['value'])
      this.btcBalance = response['value'].btc;
      this.phpBalance = response['value'].php;
      console.log("response: ", response['value'])
    });
  }

  getCapital() {
    this.bookedFund = 0
    this.tHandle = 0
    this.http.get<{status:any, response:any}>(this.uri + '/txhistory/'+this.userid)
    .subscribe(result=>{
      console.log("-----", result)
      result.response.forEach(element => {
        if (element.type == 'B' && element.accepted) {
          this.bookedFund += element.amount
          this.tHandle ++
        }
      });
    })
    ELEMENT_DATA = [];
    this.api.get(this.uri + '/getCapital').then((response) => {
      console.log('responseValue', response['value'])
      let amount
      let profit
      if (this.total_earning > 20000) {
        amount = 500000
        profit = 0.007
      } else if (this.total_earning > 10001 && this.total_earning <= 20000) {
        amount = 100000
        profit = 0.005
      } else if (this.total_earning > 1501 && this.total_earning <= 10000) {
        amount = 15000
        profit = 0.003
      } else if (this.total_earning > 100 && this.total_earning <= 1500) {
        amount = 3000
        profit = 0.002
      }
      if (response['value']) {
        response['value'].forEach(element => {
          if (element.amount <= amount && element.profit <= profit) {
            console.log("element:::", element)
            // if (element.pending) {
            //   this.http.get<{status:any, response:any}>(this.uri + '/barrowerPending/'+element._id)
            //   .subscribe(result=>{
            //     console.log("++++", result)
            //     console.log("id", result.response[0].from, this.userid)
            //     if (result.response[0].from == this.userid) {
            //       this.tHandle ++
            //     }
            //   })
            // }
            ELEMENT_DATA.push({
              _id: element._id,
              userid: element.userid,
              amount: element.amount,
              profit: element.profit,
              days: element.days,
              total_fund: element.total_fund,
              btc_price: element.btc_price,
              btc_fund: element.btc_fund,
              create_time: element.create_time,
              maturity_time: element.maturity_time,
              pending: element.pending
            })
            console.log("ELEMENT", ELEMENT_DATA)
          }
        });
      }
      this.dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
      this.dataSource.paginator = this.paginator;
    })
  }

  getTotalEarningBalance(userid) {
    this.genealogyTreeService.getTotalEarningBalance(userid).pipe().subscribe(res => {
      if(res) {
      this.total_earning = res['total_earning'];
      if (this.total_earning > 100 && this.total_earning <= 1500) {
        this.maxFund = 3000
      } else if (this.total_earning > 1501 && this.total_earning <= 10000) {
        this.maxFund = 15000
      } else if (this.total_earning > 10001 && this.total_earning <= 20000) {
        this.maxFund = 100000
      } else if (this.total_earning > 20000) {
        this.maxFund = 500000
      }
      this.getCapital()
      }
    });
  }

  openDialog(element) {
    const dialogRef = this.dialog.open(ModalChequeComponent, {
      data: {
        _id: element._id,
        userid: element.userid,
        maturity_fund: element.amount,
        maturity_time: element.maturity_time
      },
      width: '1500px'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log("modal", result)
      if (result.event && result.event == "done") {
        this.api.postToBackend('/updatePending', {
          _id: result._id,
          pending: true
        }).then(res => {
          console.log("updatedPending: ", res)
          this.getCapital()
        })
      }
    });
  }

  addProfit() {
    if (this.profit < 0.007) {
      this.profit += 0.001
    }
  }

  minusProfit() {
    if (this.profit > 0.001) {
      this.profit -= 0.001
    }
  }

  addDays() {
    if (this.days < 60) {
      this.days += 1
    }
  }

  minusDays() {
    if (this.days > 5) {
      this.days -= 1
    }
  }

  submitBtn() {
    if (this.inputAmount < 1000) {
      alert("Please input more than 1000")
      return;
    }
    if (this.phpBalance < this.inputAmount) {
      alert("PHP Balance is not enough to offer your amount")
    }
    if (confirm("Are you sure you want to offer fund?")) {
      this.phpBalance -= this.inputAmount;
      this.api.postToBackend('/putCoinBalance', {userid: this.currentUser['id'], phpBalance: this.phpBalance, btcBalance: this.btcBalance}).then((response) => {
        console.log("hhh", response)
      });
      this.api.postToBackend('/saveCapital', {
        userid: this.currentUser['id'],
        amount: this.inputAmount,
        profit: this.profit,
        days: this.days,
        total_fund: this.inputAmount + this.profit * this.days * this.inputAmount,
        btc_price: this.socket.btc_usd * this.currencyValue,
        btc_fund: (this.inputAmount + this.profit * this.days * this.inputAmount)/(this.socket.btc_usd * this.currencyValue),
        maturity_time: this.date
      }).then(res => {
        this.getCapital()
        alert("successfully funded")
      })
    }
  }

  capitalBtn() {
    this.capitalFlag = true;
  }

  brokerBtn() {
    this.capitalFlag = false;
  }

  acceptBtn(element) {
    if (element.userid != this.userid) {
      if (element.amount + this.bookedFund > this.maxFund) {
        alert("You can not fund anymore, please check your max fund")
      } else {
        console.log("element:", element)
        this.openDialog(element)
      }
    } else {
      alert("You created this record")
    }
  }

  cancelBtn(element) {
    console.log("userid, elementID", this.userid, element.userid)
    if (element.userid == this.userid) {
      console.log("cancelEleemnt", element)
      this.http.get<{status:any, response:any}>(this.uri + '/barrowerPending/'+element._id)
      .subscribe(result=>{
        console.log("result, ", Object.keys(result.response).length)
        if (Object.keys(result.response).length > 0) {
          this.delete(element._id)
        }
      })
      this.api.postToBackend('/deleteCapital', {
        _id: element._id,
      }).then(res => {
        console.log("deleteCapital: ", res)
        this.phpBalance += element.amount
        this.api.postToBackend('/putCoinBalance', {
          userid: this.userid, 
          phpBalance: this.phpBalance, 
          btcBalance: this.btcBalance
        }).then((response) => {
          console.log("hhh", response)
        });
        this.getCapital()
      })
    } else {
      alert("This is created by the other user")
    }
  }

  pendingBtn(element) {
    if (element.userid != this.userid) {
      this.http.get<{status:any, response:any}>(this.uri + '/barrowerPending/'+element._id)
        .subscribe(result=>{
          console.log("result, ", result.response)
          if (this.userid == result.response[0].from) {
            console.log("pending: ", element)
            this.api.postToBackend('/updatePending', {
              _id: element._id,
              pending: false
            }).then(res => {
              console.log("updatedPending: ", res)
              this.delete(element._id)
            })
          } else {
            alert("This is created by the other user")
          }
        })
    } else {
      alert("You created this record")
    }
  }
  delete(id){
    console.log('elementID', id)
    this.http.delete(this.uri + '/barrowerCapital/'+id)
    .subscribe(result=> {
      console.log("delete: ", result)
      this.getCapital()
    })
  }
}

export interface PeriodicElement {
    _id: string;
    userid: number;
    amount: number;
    profit: number;
    days: number;
    total_fund: number;
    btc_price: number;
    btc_fund: number;
    create_time: string;
    maturity_time: string;
    pending: boolean;
  }
  
  let ELEMENT_DATA: PeriodicElement[] = [];
