import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpService } from 'src/app/services/http.service';
import { StorageService } from 'src/app/services/storage.service';
import { environment } from 'src/environments/environment';
import { SocketService } from 'src/app/services/socket.service';
import { CountryCurrencyPriceService } from 'src/app/services/country-currency-price.service';
import Currency from '../../model/currency';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import { GenealogyTreeService } from 'src/app/services/side_services/genealogy-tree.service';

@Component({
  selector: 'app-php-btc',
  templateUrl: './php-btc.component.html',
  styleUrls: ['./php-btc.component.css']
})
export class PhpBtcComponent implements OnInit {

  displayedColumns: string[] = [ 'sequence', 'btc-php', 'lc-php', 'amount-php', 'receivable-btc', 'previous-balance', 'present-balance', 'btc-previous-balance', 'btc-current-balance', 'date'];
  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);

  @ViewChild(MatPaginator) paginator: MatPaginator;

  currentUser = [];
  uri = environment.backendUrl;
  phpBalance: any = 0;
  btcBalance: any = 0;
  lcBalance: any;

  userInfo: any;
  currency: Currency = new Currency;
  cCode = 'PH';
  curCode = 'PHP';
  currencyValue = 0;
  interval: any;

  phpValue: number;
  btcValue: number;
  lcValue: number;
  totalFund: number = 0;
  todayFund: number = 0;
  searchResult: number = 0;


  constructor(
    private api: HttpService,
    private storageService: StorageService,
    public socket: SocketService,
    private ccp: CountryCurrencyPriceService,
    private genealogyTreeService: GenealogyTreeService
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
    this.api.get(this.uri + '/getCoinBalance/' + this.currentUser['id']).then((response) => {
      this.btcBalance = response['value'].btc;
      this.lcBalance = response['value'].lc;
      this.phpBalance = response['value'].php;
      console.log("response: ", response['value'])
    });
    ELEMENT_DATA = [];
    this.getConvert();
  }

  phpChange() {
    this.btcValue = this.phpValue / ( this.socket.btc_usd * this.currencyValue );
    this.lcValue = this.phpValue / ( this.socket.btc_usd * this.socket.lc_btc * this.currencyValue )
  }

  btcChange() {
    this.phpValue = this.socket.btc_usd * this.currencyValue * this.btcValue;
    this.lcValue = this.btcValue / this.socket.lc_btc;
  }

  lcChange() {
    this.phpValue = this.socket.btc_usd * this.socket.lc_btc * this.currencyValue * this.lcValue;
    this.btcValue = this.lcValue * this.socket.lc_btc;
  }

  sendRequest() {
    console.log("sendRequest")
    this.phpBalance -= this.phpValue;
    this.btcBalance += this.btcValue;
    if (confirm('Are you sure to convert')) {
      this.api.postToBackend('/putCoinBalance', {userid: this.currentUser['id'], phpBalance: this.phpBalance, btcBalance: this.btcBalance}).then((response) => {
        console.log("hhh", response)
      });
      this.api.postToBackend('/saveBalance', {
        userid: this.currentUser['id'],
        btcphp: this.socket.btc_usd * this.currencyValue,
        lcphp: this.socket.btc_usd * this.socket.lc_btc * this.currencyValue,
        amountPHP: this.phpValue,
        receivableBTC: this.btcValue,
        previousBalance: this.phpBalance + this.phpValue,
        presentBalance: this.phpBalance,
        btcPreviousBalance: this.btcBalance - this.btcValue,
        btcCurrentBalance: this.btcBalance
      }).then(res => {
        alert("successfully converted")
      })
      this.genealogyTreeService.getUserByReferral(this.currentUser['id'])
      .pipe()
      .subscribe(res => {
        console.log("resReferralUser: ", res)
        this.api.postToBackend('/saveReferral', {
          userid: res,
          type: 'C',
          ita: 0,
          referraledId: this.currentUser['id'],
          amount: this.phpValue
        })
      });
    }
  }

  getConvert() {
    this.api.get(this.uri + '/getConvertBalance/' + this.currentUser['id']).then((response) => {
      console.log("convert", response)
      response['value'].forEach((element, i) => {
        if (element.create_time.slice(0, 10) == new Date().toISOString().slice(0, 10)) {
          this.todayFund += element.amountPHP;
        }
        console.log("element: ", element)
        ELEMENT_DATA.push({
          position: i+1, 
          sequence: i+1, 
          btcphp: element.btcphp, 
          lcphp: element.lcphp, 
          amountPHP: element.amountPHP, 
          receivableBTC: element.receivableBTC, 
          previousBalance: element.previousBalance,
          presentBalance: element.presentBalance,
          btcPreviousBalance: element.btcPreviousBalance,
          btcCurrentBalance: element.btcCurrentBalance,
          date: element.create_time
        })
        this.totalFund += element.amountPHP;
        this.searchResult += element.amountPHP;
      });
      this.dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
    });
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
    this.searchResult = 0;
    this.dataSource.filteredData.forEach(item => {
      this.searchResult += item.amountPHP;
    });
  }
}

export interface PeriodicElement {
  position: number;
  sequence: number;
  btcphp: number;
  lcphp: number;
  amountPHP: number;
  receivableBTC: number;
  previousBalance: number;
  presentBalance: number;
  btcPreviousBalance: number;
  btcCurrentBalance: number;
  date: string;
}

let ELEMENT_DATA: PeriodicElement[] = [];
