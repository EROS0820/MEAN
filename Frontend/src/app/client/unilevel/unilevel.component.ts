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
import { ShareService } from 'src/app/services/share.service';
import { UnilevelService } from 'src/app/services/side_services/unilevel.service';
import { EncashmentService } from 'src/app/services/side_services/encashment.service';

@Component({
  selector: 'app-unilevel',
  templateUrl: './unilevel.component.html',
  styleUrls: ['./unilevel.component.css']
})
export class UnilevelComponent implements OnInit {

  displayedColumns: string[] = [ 'level', 'name', 'type', 'ita', 'profit', 'date'];
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
  users_from_tree: any = [];
  middle_userid: any;
  count: any = [];
  unilevel_current = 0;
  total_unilevel = 0;
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
    private unilevelService: UnilevelService,
    private encash: EncashmentService
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
  getUsersFromTree() {
    this.genealogyTreeService.getUsersFromTree()
      .pipe().subscribe(res=> {
      this.users_from_tree = res;
      this.getUnilevel()
    })
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
        this.unilevel_current = res['profit']
        this.total_unilevel = res['profit']
      }
    });
  }
  getUnilevel() {
    ELEMENT_DATA = []
    this.dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
    this.dataSource.paginator = this.paginator;
    this.unilevelService.getUnilevel(this.userid)
      .pipe()
      .subscribe((result: any) => {
        console.log("result:-=-==--=-=- ", result)
        result.forEach((element, i) => {
          console.log("date: ", element.create_time.slice(0,10))
          console.log("now Date: ", new Date().toISOString().slice(0, 10))
          if (element.create_time.slice(0, 10) == new Date().toISOString().slice(0, 10)) {
            this.today_profit += element.profit;
          }
          this.search_result += element.profit;
          this.middle_userid = element.add_id;
          this.parent_id = element.user_id;
          console.log('parentID, middle_useriD', this.parent_id, this.middle_userid)
          this.count[i] = 0;
          this.getLevel(i);
          this.genealogyTreeService.getUsers().pipe().subscribe((res: any)=>{
            console.log("users: ", res);
            res.forEach(user => {
              if (user.userid == element.user_id) {
                console.log("count: ", this.count)
                let type = ''
                if (element.type == "N") {
                  type = "New Member"
                } else if (element.type == "R") {
                  type = "Repeat Purchase"
                }
                ELEMENT_DATA.push({position: i+1, type: type, ita: element.ita, profit: element.profit, level: this.count[i], name: element.name, date: element.create_time})
                console.log("element_data", ELEMENT_DATA)
              }
            });
            this.dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
            this.dataSource.paginator = this.paginator;
          });
        });
    });
    
  }
  getLevel(index) {
    console.log('middleuseid: ', this.middle_userid)
    for (let tree of this.users_from_tree) {
      if (tree.user_id == this.middle_userid) {
        this.count[index]++;
        this.middle_userid = tree.upper_id;
        console.log("middle_userid", this.middle_userid)
        break;
      }
    }
    if (this.middle_userid < this.parent_id) {
      console.log("middleUserid, parentId", this.middle_userid, this.parent_id)
      this.count[index]--;
      return;
    } else if (this.middle_userid != this.parent_id) {
      console.log("middle_userid, parentId", this.middle_userid, this.parent_id)
      this.getLevel(index);
    }
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
      this.genealogyTreeService.addProfit(this.userid, -5000)
      .pipe()
      .subscribe(res => {
        this.genealogyTreeService.updateLCBalance(this.userid, this.total_lc_balance + 5000/(this.socket.btc_usd * this.socket.lc_btc * this.currencyValue))
      .pipe().subscribe(res => {this.total_lc_balance = res['lc']});
      });
      this.encash.setOrder("/setOrder", {userid: this.userid, amount: 5000/(this.socket.btc_usd * this.socket.lc_btc * this.currencyValue)})
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
  position: number;
  ita: number;
  profit: number;
  date: string;
  name: string;
  level: number;
}

let ELEMENT_DATA: PeriodicElement[] = [];
