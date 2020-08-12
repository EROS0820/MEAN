import { Component, OnInit, ViewChild } from '@angular/core';
import {  MatTable } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { DialogBoxComponent } from './dialog-box/dialog-box.component';
import {StorageService} from "../../services/storage.service";
import {PreOrderService} from "../../services/side_services/pre-order.service";
import Currency from "../../model/currency";
import {CountryCurrencyPriceService} from "../../services/country-currency-price.service";
import {SocketService} from "../../services/socket.service";

export interface PreOrderData {
  order_id: string,
  product_name: string;
  market_price: string;
  seller_price: string,
  userid: string,
  availability: string,
  qty: string,
}

@Component({
  selector: 'app-pre-order',
  templateUrl: './pre-order.component.html',
  styleUrls: ['./pre-order.component.css']
})
export class PreOrderComponent implements OnInit {

  displayedColumns: string[] = ['product_name', 'market_price', 'seller_price', 'userid', 'availability','qty', 'total_amount', 'action'];
  dataSource: PreOrderData[] = [];
  currentUser: any;
  total_ita: number = 0;
  userInfo: any;
  currency: Currency = new Currency;
  cCode = 'PH';
  curCode = 'PHP';
  lcCode = 'LC';
  currencyValue = 0;
  consumer_id = 0;
  seller_id = 0;
  claim_code = '';
  @ViewChild(MatTable) table: MatTable<any>;


  constructor(public dialog: MatDialog,
              private storageService: StorageService,
              private preOrderService: PreOrderService,
              private ccp: CountryCurrencyPriceService,
              public socket: SocketService,
              ) {
    this.currentUser =  this.storageService.getUser()
  }

  ngOnInit() {
    this.getCurrencyValue();
  }

  openDialog(action,obj) {
    obj.action = action;
    const dialogRef = this.dialog.open(DialogBoxComponent, {
      width: '250px',
      data:obj
    });

    dialogRef.afterClosed().subscribe(result => {
        this.deleteRowData(result.data);
    });
  }
  deleteRowData(row_obj){
    this.preOrderService.getPreOrder( this.currentUser['id'], 'ordered', 'consumer_id')
      .pipe().subscribe(res => {
        console.log('cancelRESPONSE++++++++', res.body);
        if (!res.body) {
          alert("already released");
          location.reload();
        } else {
          const lc_total_amount = (row_obj.market_price * row_obj.qty)/(this.socket.btc_usd * this.socket.lc_btc *this.currencyValue);
          this.dataSource = this.dataSource.filter((value,key)=>{
            return value.order_id != row_obj.order_id;
          });
          console.log("row_obj.orderId: ", row_obj.order_id)
          
          this.preOrderService.deletePreOrder(row_obj.order_id)
            .pipe().subscribe(res => {
              console.log("consumerid: ", res['consumer_id'])
              this.preOrderService.removeTree(res['consumer_id'])
                .pipe()
                .subscribe(res => {
                });
              this.updateLcBalance(res['consumer_id'], lc_total_amount);
              // check rest ordered and if there is no ordered, delete all data for this consumer ******************************
            });
          this.getPreOrder();
        }
      });
  }

  initAll() {
    if(this.currentUser) {
      this.getPreOrder();
    }
  }
  getPreOrder(status = 'ordered') {
    return this.preOrderService.getPreOrder( this.currentUser['id'], status, 'consumer_id')
      .pipe().subscribe(res => {console.log('here component>>>>>>>>>', res);
        this.initDataSource(res.body);
      });
  }
  initDataSource(preOrders) {
    const orders = [];
    for(let order of preOrders) {
      const row_order = {order_id: '' , product_name: '', market_price: '', seller_price: '', userid: '', availability: '', qty: ''};
      row_order.order_id = order['product'][0]['_id'];
      row_order.product_name = order['product_name'];
      row_order.market_price = order['market_price'];
      row_order.seller_price = order['seller_price'];
      row_order.userid = order['product'][0]['consumer_id'];
      row_order.availability = '200';
      row_order.qty = order['product'][0]['qty'];
      orders.push(row_order);
      this.total_ita = this.total_ita + order['market_price']*order['product'][0]['qty'];
      this.consumer_id = order['product'][0]['consumer_id'];
      this.seller_id = order['product'][0]['seller_id'];
    }
    this.dataSource = orders;
    return this.dataSource;
  }

  async getCurrencyValue() {
    this.userInfo = await this.ccp.getUserInfo();
    // user country code
    this.cCode = this.userInfo['countryCode'];
    // get user country currency code
    this.curCode = this.currency[`${this.cCode}`];
    // get user country currency value
    this.currencyValue = await this.ccp.getCurrencyValue(this.curCode);
    this.initAll();
  }

  updateLcBalance(buyerId, total_amount) {
    console.log("buyerId, total_amount: ", buyerId, total_amount)
    this.preOrderService.updateLCBalance(buyerId, total_amount)
      .pipe().subscribe(res => {return res});
  }

  makeRandom(lengthOfCode: number, possible: string) {
    let text = "";
    for (let i = 0; i < lengthOfCode; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    this.claim_code =  text;
  }
  placeOrder() {
    let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890,./;'[]\=-)(*&^%$#@!~`";
    const lengthOfCode = 7;
    this.makeRandom(lengthOfCode, possible);
    return this.preOrderService.placeOrder(this.consumer_id, this.seller_id, this.claim_code)
      .pipe().subscribe(res => {
        if(res['status']) {
          console.log('Generated claim code successfully');
        }
        else {
          this.claim_code = '';
          console.log('Failed to Generated claim code')
        }
      })
  }
}
