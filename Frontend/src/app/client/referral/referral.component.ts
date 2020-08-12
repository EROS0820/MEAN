import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import { StorageService } from 'src/app/services/storage.service';
import { HttpService } from 'src/app/services/http.service';
import {environment} from "../../../environments/environment";
import { GenealogyTreeService } from 'src/app/services/side_services/genealogy-tree.service';
import { SocketService } from 'src/app/services/socket.service';
import { CountryCurrencyPriceService } from 'src/app/services/country-currency-price.service';
import Currency from "../../model/currency";
import { ShareService } from 'src/app/services/share.service';
import { EncashmentService } from 'src/app/services/side_services/encashment.service';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { ModalComponent } from './modal/modal.component';

@Component({
  selector: 'app-referral',
  templateUrl: './referral.component.html',
  styleUrls: ['./referral.component.css']
})
export class ReferralComponent implements OnInit {

  displayedColumns: string[] = [ 'referraledId', 'name', 'type', 'amount', 'ita', 'profit', 'date'];
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
  total_btc_balance = 0;
  total_ita = 0;
  requested_order = 0;
  requested_withdrawal = 0;
  users_from_tree: any = [];
  middle_userid: any;
  count: any = [];
  referral_current = 0;
  total_referral = 0;
  search_result = 0;
  today_profit = 0;
  parent_id = 0;

  constructor(
    private storageService: StorageService,
    private api: HttpService,
    private genealogyTreeService: GenealogyTreeService,
    public socket: SocketService,
    private ccp: CountryCurrencyPriceService,
    public share: ShareService,
    private encash: EncashmentService,
    public dialog: MatDialog
  ) { 
    this.currentUser =  this.storageService.getUser()
  }

  ngOnInit() {
    // this.dataSource.filterPredicate = function(data, filter: string): boolean {
    //   return data.name.toLowerCase().includes(filter) || data.position.toString() === filter;
    // };
    if (this.currentUser) {
      this.dataSource.paginator = this.paginator;
      this.userid = this.currentUser['id'];
      this.getUsersFromTree();
      this.getTotalEarningBalance(this.userid);
      this.getCurrencyValue();
      this.getTotalLcBalance(this.userid);
    }
    ELEMENT_DATA = [];
  }
  openDialog() {
    const dialogRef = this.dialog.open(ModalComponent, {
      data: ELEMENT_DATA,
      width: '1500px'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log("modal")
    });
  }
  getUsersFromTree() {
    this.genealogyTreeService.getUsersFromTree()
      .pipe().subscribe(res=> {
      this.users_from_tree = res;
      this.getReferral()
    })
  }
  getTotalLcBalance(buyerId) {
    this.api.get(this.uri + '/getBtcBalance/' + buyerId).then((response: number) => {
      this.total_btc_balance = response['value'];
    });
  }
  getTotalEarningBalance(userid) {
    this.genealogyTreeService.getTotalEarningBalance(userid).pipe().subscribe(res => {
      if (res) {
        console.log("res: ", res); 
        this.total_earning = res['total_earning']; 
        this.current_balance = res['current_balance']
        this.total_ita = res['total_ita']
        this.referral_current = res['referral_profit']
        this.total_referral = res['referral_profit']
      }
    });
  }
  getReferral() {
    ELEMENT_DATA = []
    this.dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
    this.dataSource.paginator = this.paginator;
    this.api.get(this.uri + '/getReferral/' + this.currentUser['id']).then((response) => {
      console.log('responseValue', response['value'])
      if (response['value'] != null) {
        response['value'].forEach((element) => {
          if (element.create_time.slice(0, 10) == new Date().toISOString().slice(0, 10)) {
            this.today_profit += element.profit;
          }
          this.search_result += element.profit;
          this.genealogyTreeService.getUsers().pipe().subscribe((res: any)=>{
            console.log("users: ", res);
            res.forEach(user => {
              if (user.userid == element.referraledId) {
                let type = ''
                let name = user.first_name + ' ' + user.last_name
                if (element.type == "N") {
                  type = "New Member"
                } else if (element.type == "R") {
                  type = "Repeat Order"
                } else if (element.type == "C") {
                  type = "Consumerism Fund"
                }
                ELEMENT_DATA.push({referraledId: element.referraledId, type: type, amount: element.amount, ita: element.ita, profit: element.profit, name: name, date: element.create_time})
                console.log("element_data", ELEMENT_DATA)
              }
            });
            this.dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
            this.dataSource.paginator = this.paginator;
          });
        });
      }
      // this.dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
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
    if (confirm("Are you sure to Submit?")) {
      this.genealogyTreeService.addReferralProfit(this.userid, -2000)
      .pipe()
      .subscribe(res => {
        this.genealogyTreeService.updateLCBalance(this.userid, this.total_btc_balance + 2000 * (this.socket.btc_usd * this.currencyValue))
      .pipe().subscribe(res => {this.total_btc_balance = res['btc']});
      });
      this.encash.setOrder("/setOrder", {userid: this.userid, amount: 2000 * (this.socket.btc_usd * this.currencyValue)})
        .pipe()
        .subscribe(res => {});
    }
  }
  applyFilter(event: Event) {
    this.dataSource.filterPredicate = function(data, filter: string): boolean {
      return data.date.toLowerCase().includes(filter);
    };
    const filterValue = (event.target as HTMLInputElement).value;
    console.log("fileterValue: ", filterValue)
    this.dataSource.filter = filterValue.trim().toLowerCase();
    console.log("datasourceFilter: ", this.dataSource.filter)
    console.log("dataSource: ", this.dataSource)
    console.log("filtered Data: ", this.dataSource.filteredData)
    this.search_result = 0;
    this.dataSource.filteredData.forEach(item => {
      this.search_result += item.profit;
    });
  }

}

export interface PeriodicElement {
  type: string;
  ita: number;
  profit: number;
  date: string;
  name: string;
  amount: number;
  referraledId: number;
}

let ELEMENT_DATA: PeriodicElement[] = [];