import { Component, OnInit, ViewChild } from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import { StorageService } from 'src/app/services/storage.service';
import { HttpService } from 'src/app/services/http.service';
import {environment} from "../../../environments/environment";
import { GenealogyTreeService } from 'src/app/services/side_services/genealogy-tree.service';
import { SocketService } from 'src/app/services/socket.service';
import { CountryCurrencyPriceService } from 'src/app/services/country-currency-price.service';
import Currency from "../../model/currency";
import { EncashmentService } from 'src/app/services/side_services/encashment.service';
import { ShareService } from 'src/app/services/share.service';

@Component({
  selector: 'app-encashment',
  templateUrl: './encashment.component.html',
  styleUrls: ['./encashment.component.css']
})
export class EncashmentComponent implements OnInit {

  displayedColumns: string[] = ['position', 'type', 'amount', 'receivable', 'total', 'date'];
  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);

  @ViewChild(MatPaginator) paginator: MatPaginator;

  available_order = 0;
  available_withdrawal = 0;
  currentUser = [];
  userid: any;
  uri = environment.backendUrl;
  current_balance = 0;
  total_earning = 0;
  userInfo: any;
  currency: Currency = new Currency;
  cCode = 'PH';
  curCode = 'PHP';
  currencyValue = 0;
  total_lc_balance = 0;
  total_ita = 0;
  requested_order = 0;
  requested_withdrawal = 0;

  constructor(
    private storageService: StorageService,
    private api: HttpService,
    private genealogyTreeService: GenealogyTreeService,
    public socket: SocketService,
    private ccp: CountryCurrencyPriceService,
    private encash: EncashmentService,
    public share: ShareService
  ) { 
    this.currentUser =  this.storageService.getUser()
  }

  ngOnInit() {
    if (this.currentUser) {
      this.dataSource.paginator = this.paginator;
      this.userid = this.currentUser['id'];
      this.getAvailable(this.userid);
      this.getTotalEarningBalance(this.userid);
      this.getCurrencyValue();
      this.getTotalLcBalance(this.userid);
      this.getEncashment()
    }
    ELEMENT_DATA = [];
  }
  getAvailable(buyerId) {
    this.api.get(this.uri + '/getAvailable/' + buyerId).then((response: number) => {
      console.log(response['value'][0].available_order, response['value'][0].available_withdrawal)
      this.available_order = response['value'][0].available_order;
      this.available_withdrawal = response['value'][0].available_withdrawal;
      this.requested_order = response['value'][0].requested_order;
      this.requested_withdrawal = response['value'][0].requested_withdrawal;
    });
  }
  getTotalLcBalance(buyerId) {
    this.api.get(this.uri + '/getLcBalance/' + buyerId).then((response: number) => {
      this.total_lc_balance = response['value'];
    });
  }
  getTotalEarningBalance(userid) {
    this.genealogyTreeService.getTotalEarningBalance(userid).pipe().subscribe(res => {
      if (res) {
        console.log("res: ", res); 
        this.total_earning = res['total_earning']; 
        this.current_balance = res['current_balance']
        this.total_ita = res['total_ita']
      }
    });
  }
  getEncashment() {
    this.encash.getEncashment(this.userid)
      .pipe()
      .subscribe((result: any) => {
        console.log("result:-=-==--=-=- ", result)
        result.forEach((element, i) => {
          console.log("element: ", i, element)
          console.log("type: ", element.type)
          ELEMENT_DATA.push({position: i+1, type: element.type, amount: element.amount, receivable_lc: element.receivable_lc, total_lc: element.total_lc, date: element.create_time})
          console.log("ElementData:", ELEMENT_DATA)
          this.dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
        });
    });
  }
  async getCurrencyValue() {
    this.userInfo = await this.ccp.getUserInfo();
    // user country code
    this.cCode = this.userInfo['countryCode'];
    // get user country currency code
    this.curCode = this.currency[`${this.cCode}`];
    // get user country currency value
    this.currencyValue = await this.ccp.getCurrencyValue(this.curCode);
  }
  submitBtn() {
    this.genealogyTreeService.updateCurrentBalance(this.userid, -3000)
      .pipe().subscribe(res => {
        this.current_balance -= 3000;
        this.total_earning -= 3000;
    })
    this.genealogyTreeService.updateLCBalance(this.userid, this.total_lc_balance + 3000/(this.socket.btc_usd * this.socket.lc_btc * this.currencyValue))
      .pipe().subscribe(res => {console.log("resUpdateLCBalance: ", res['lc']); this.total_lc_balance = res['lc']});
    this.encash.setOrder("/setOrder", {userid: this.userid, amount: this.current_balance/(this.socket.btc_usd * this.socket.lc_btc * this.currencyValue)})
      .pipe()
      .subscribe(res => {
        this.genealogyTreeService.setAvailable(this.userid, false)
          .pipe()
          .subscribe(res => {
            this.available_order = 1
            this.available_withdrawal = 0
            this.encash.setRequested(this.userid, 'requested_withdrawal')
              .pipe()
              .subscribe(res => {
                this.requested_withdrawal += 1;
            });
        });
    });
    this.encash.addEncashment(
        this.userid, 
        "cash", 
        3000, 
        3000/(this.socket.btc_usd * this.socket.lc_btc * this.currencyValue), 
        this.current_balance/(this.socket.btc_usd * this.socket.lc_btc * this.currencyValue))
      .pipe()
      .subscribe(result => {
        console.log("result: ", result)
    });
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

}

export interface PeriodicElement {
  type: string;
  position: number;
  amount: number;
  receivable_lc: number;
  total_lc: number;
  date: string;
}

let ELEMENT_DATA: PeriodicElement[] = [];
