import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog} from '@angular/material/dialog';
import { MatTable ,MatTableDataSource} from '@angular/material/table';
import { DialogBoxComponent } from '../pre-order/dialog-box/dialog-box.component';
import {StorageService} from "../../services/storage.service";
import {PreOrderService} from "../../services/side_services/pre-order.service";
import Currency from "../../model/currency";
import {CountryCurrencyPriceService} from "../../services/country-currency-price.service";
import {GenealogyTreeService} from "../../services/side_services/genealogy-tree.service";
import {SocketService} from "../../services/socket.service";
import { EncashmentService } from 'src/app/services/side_services/encashment.service';
import { UnilevelService } from 'src/app/services/side_services/unilevel.service';
import { HttpService } from 'src/app/services/http.service';

export interface PreOrderData {
  starter_id: string,
  order_id: string,
  code: string,
  product_id: string,
  product_name: string;
  market_price: string;
  seller_price: string,
  userid: string,
  seller_id: string,
  availability: string,
  qty: string
}

@Component({
  selector: 'app-seller',
  templateUrl: './seller.component.html',
  styleUrls: ['./seller.component.css']
})
export class SellerComponent implements OnInit {
  dataSource;
  displayedColumns: string[] = ['product_name', 'market_price', 'seller_price', 'userid', 'availability','qty', 'total_amount', 'action'];
  currentUser: any;
  total_ita: number = 0;
  userInfo: any;
  currency: Currency = new Currency;
  cCode = 'PH';
  curCode = 'PHP';
  lcCode = 'LC';
  currencyValue = 0;
  msg_order_status: string = '';
  preOrders: {} = [];
  consumer_total_amount = 0;
  flg_code = null;
  flg_release = true;
  available_qty = 0;
  userid: any;
  @ViewChild(MatTable) table: MatTable<any>;
  private left_points: number = 0;
  private right_points: number = 0;
  private current_balance: number = 0;
  private users_from_tree: any = [];
  temp = [{}];
  temper = [{}];
  users: any = [];
  sub_users: any = [];
  sub_user_index = 0;
  flagId: any;
  purchase_ita = 0;
  constructor(public dialog: MatDialog,
              private storageService: StorageService,
              private preOrderService: PreOrderService,
              private ccp: CountryCurrencyPriceService,
              private genealogyTreeService: GenealogyTreeService,
              public socket: SocketService,
              private encash: EncashmentService,
              private unilevelService: UnilevelService,
              private api: HttpService
  ) {
    this.currentUser =  this.storageService.getUser()
  }

  ngOnInit() {
    this.getCurrencyValue();
  }
  initAll() {
    if(this.currentUser) {
      this.getUsers();
      this.getPreOrder();
    }
  }
  getPreOrder(status = 'ordered') {
    return this.preOrderService.getPreOrder(this.currentUser['id'], status, 'seller_id')
      .pipe().subscribe(res => {
        this.preOrders = res.body;
        this.initDataSource(res.body);
      });
  }
  initDataSource(preOrders) {
    this.total_ita = 0;
    const orders:PreOrderData[] = [];
    for(let order of preOrders) {
      const row_order = {starter_id: '', order_id: '', code: '' , product_id: '', product_name: '', market_price: '', consumer_id: '', seller_price: '', userid: '', seller_id: '', availability: '', qty: ''};
      row_order.starter_id = order['product'][0]['starter_id']
      row_order.consumer_id = order['product'][0]['consumer_id']
      row_order.order_id = order['product'][0]['_id'];
      row_order.code = order['product'][0]['code'];
      row_order.product_id = order['_id'];
      row_order.product_name = order['product_name'];
      row_order.market_price = order['market_price'];
      row_order.seller_price = order['seller_price'];
      row_order.userid = order['product'][0]['consumer_id'];
      row_order.seller_id = order['product'][0]['seller_id'];
      row_order.availability = order['availability'];
      row_order.qty = order['product'][0]['qty'];
      orders.push(row_order);
      this.total_ita = this.total_ita + order['market_price']*order['product'][0]['qty'];
      console.log(orders)
    }

    this.dataSource = new MatTableDataSource(orders);
    if(!this.dataSource.length) {
      this.msg_order_status = "There is no available data";
    }
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
  getClaimedProducts(event) {
    const code =  (event.target as HTMLInputElement).value;
    this.flg_code = code;
    this.dataSource.filter = code.trim().toLocaleLowerCase();
  }
  unClaimedProduct() {
    this.flg_release = true;
    this.getPreOrder('ordered');
  }
  claimedProduct() {
    this.flg_release = false;
    this.getPreOrder('released');
  }
  openDialog(action,obj) {
    obj.action = action;
    const dialogRef = this.dialog.open(DialogBoxComponent, {
      width: '250px',
      data:obj
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result.event == 'Update'){
        this.updateRowData(result.data);
      }else if(result.event == 'Release'){
        this.deleteRowData(result.data);
      }
    });
  }
  updateRowData(row_obj){
    this.dataSource = this.dataSource.filter((value,key)=>{
      // if(value.id == row_obj.id){
      //   value.name = row_obj.name;
      // }
      return true;
    });
  }
  deleteRowData(row_obj){
    console.log("row_obj: ", row_obj)
    this.flagId = row_obj.starter_id;
    this.userid = row_obj.userid;
    this.getPrevTotalIta(row_obj);
    this.dataSource.data = this.dataSource.data.filter((value,key)=>{
      return value.order_id != row_obj.order_id;
    });
    this.preOrderService.releasePreOrder(row_obj.order_id)
      .pipe().subscribe(res => {
      if(res['status'] == 'success') {
        this.available_qty = row_obj.availability - row_obj.qty;
        this.updateSeller(row_obj);
        this.preOrderService.getPreOrder(this.currentUser['id'], 'ordered', 'seller_id')
          .pipe().subscribe(result => {
            if(result.status == 200) {
              this.preOrders = [{}];
              this.preOrders = result.body;
              this.checkUserStatus(row_obj);
              this.genealogyTreeService.setAvailable(row_obj.userid, true)
                .pipe()
                .subscribe(res => {
                  this.encash.setRequested(row_obj.userid, 'requested_order')
                    .pipe()
                    .subscribe(res => {
                      let type=''
                      let userid = null
                      if (this.flagId != -1) {
                        type = 'N'
                        userid = row_obj.starter_id
                      } else if (this.flagId == -1) {
                        console.log("rowobject: ", row_obj)
                        type = 'R'
                        userid = row_obj.consumer_id
                      }
                      console.log("saveReferral +++++++++++++++++++++", userid, type, row_obj.market_price * row_obj.qty, row_obj.userid)
                      this.genealogyTreeService.getUserByReferral(userid).subscribe(res => {
                        console.log("resReferralId", res)
                        if (res) {
                          console.log("referral Exist")
                          this.api.postToBackend('/saveReferral', {
                            userid: res,
                            type: type,
                            ita: row_obj.market_price * row_obj.qty,
                            referraledId: userid,
                            amount: 0
                          })
                          this.genealogyTreeService.addReferralProfit(res, row_obj.market_price * row_obj.qty * 0.1875)
                          .pipe()
                          .subscribe(res => {
                          })
                        } else {
                          console.log("referral not Exist")
                          this.api.postToBackend('/saveReferral', {
                            userid: userid,
                            type: type,
                            ita: row_obj.market_price * row_obj.qty,
                            referraledId: row_obj.userid,
                            amount: 0
                          })
                          this.genealogyTreeService.addReferralProfit(row_obj.starter_id, row_obj.market_price * row_obj.qty * 0.1875)
                          .pipe()
                          .subscribe(res => {
                          })
                        }
                      })
                });
              });
            }
          });
        // this.genealogyTreeService.addProfit(row_obj.userid, row_obj.market_price * row_obj.qty * 0.0391)
        //     .pipe()
        //     .subscribe(res => {
              
        //     })
        // this.unilevelService.setProfit(row_obj.userid, row_obj.market_price * row_obj.qty)
        // .pipe().subscribe(res => {

        // });
      }
    });
  }
  getPrevTotalIta(row_obj) {
    this.consumer_total_amount = row_obj.market_price * row_obj.qty;
    return this.genealogyTreeService.getPrevTotalIta(row_obj.userid)
      .pipe().subscribe(res => {
        if (this.flagId == -1) {
          if (res['total_ita'] < 2400) {
            this.consumer_total_amount = this.consumer_total_amount + res['total_ita'];
          } else {
            this.purchase_ita = row_obj.market_price * row_obj.qty;
          }
        } else {
          this.consumer_total_amount = this.consumer_total_amount + res['total_ita'];
        }
        this.updateTreeIta(row_obj.userid);
      });
  }
  updateTreeIta(consumer_id) {
    if(this.consumer_total_amount) {
      this.updateTreeStatus(consumer_id, 'total_ita', this.consumer_total_amount);
    }
    if (this.purchase_ita != 0) {
      this.updateTreeStatus(consumer_id, 'purchase_ita', this.purchase_ita);
    }
  }
  updateSeller(row_obj) {
    this.genealogyTreeService.updateAvailability(row_obj.product_id, this.available_qty)
      .pipe().subscribe(res => {console.log('Updated availability', res)});
    // if(this.currencyValue){
    //   this.genealogyTreeService.updateSellerLCBalance(row_obj.seller_id, row_obj.qty*row_obj.market_price/(this.socket.btc_usd * this.socket.lc_btc *this.currencyValue))
    //     .pipe().subscribe(res => {console.log('Updated seller balance', res)});
    // }
  }
  checkUserStatus(row_obj) {
    const consumer_id = row_obj.userid;
    const starter_id = row_obj.starter_id;
    if(this.preOrders) {
      for(let i in this.preOrders) {
        if(this.preOrders[i]['product'][0]['consumer_id'] == consumer_id) {
          if((this.preOrders[i]['product'][0]['status']) == 'ordered') {
            return;
          }
        }
      }
    }
    this.updateTreeStatus(consumer_id, 'status', 'pass');
    this.updateTotalEarningBalance(starter_id);
  }
  updateTreeStatus(consumer_id, column, value) {
    this.preOrderService.updateTreeStatus(consumer_id, column, value)
      .pipe().subscribe(res => { return res;});
  }
  updateTotalEarningBalance(starter_id) {
    this.sub_users = [];
    this.getUsersFromTree(starter_id);
  }
  getUsersFromTree(starter_id) {
    this.genealogyTreeService.getUsersFromTree()
      .pipe().subscribe(res=> {
      this.users_from_tree = res;
      if(res) {
        this.sub_user_index = 0;
        this.getPointsConsumers(starter_id);
      }
    })
  }
  getPointsConsumers(starter_id) {
    this.initPointsConsumers();
    if(this.left_points - this.right_points > 0) {
      this.left_points = this.left_points - this.right_points;
      this.current_balance = this.right_points*0.209;
    }
    else{
      this.right_points = this.right_points - this.left_points;
      this.current_balance = this.left_points*0.209;
    }
    this.genealogyTreeService.getBalance()
      .pipe()
      .subscribe((res: any[]) => {
        for (let i = 0 ; i < res.length ; i++) {
          if (res) {
            let name = ''
            for (let user of this.users) {
              if (user.userid == res[i].add_id) {
                name = user.first_name + ' ' + user.last_name
                break;
              }
            }
            this.genealogyTreeService.updateTotalEarningBalance(res[i].user_id, res[i].balance_plus)
            .pipe().subscribe(balance => {
              // if((this.sub_users.length>0) && (this.sub_users.length > this.sub_user_index)) {
              //   this.getPointsConsumers(this.sub_users[this.sub_user_index]);
              //   this.sub_user_index = this.sub_user_index + 1;
              // }
              console.log("unileve If console", res[i])
              if (res[i].add_id != 0) {
                this.genealogyTreeService.addProfit(res[i].user_id, res[i].ita * 0.0391)
                .pipe()
                .subscribe(addprofit => {
                  console.log("unilevel---------", i, res[i], res[i].user_id, res[i].ita, name, res[i].add_id, res[i].type)
                  // this.unilevelService.setProfit(res[i].user_id, res[i].ita, name, res[i].add_id, res[i].type)
                  this.unilevelService.setProfit(res[i].user_id, res[i].ita, name, res[i].add_id, res[i].type)
                  .pipe().subscribe(setprofit => {
                    console.log("setProfit-------", i, setprofit)
                  });
                })
              }
            })
          }
        }
      });
    // if (starter_id == this.genealogyTreeService.getBalance().pipe().subscribe(res => {console.log('GETBALANCE', res)})) {
    //   this.genealogyTreeService.updateTotalEarningBalance(starter_id, this.socket.getBalance().balancePlus)
    //   .pipe().subscribe(res => {
    //     if((this.sub_users.length>0) && (this.sub_users.length > this.sub_user_index)) {
    //       this.getPointsConsumers(this.sub_users[this.sub_user_index]);
    //       this.sub_user_index = this.sub_user_index + 1;
    //     }
    //   })
    // } else {
    // this.genealogyTreeService.updateTotalEarningBalance(starter_id, this.current_balance)
    //   .pipe().subscribe(res => {
    //     if((this.sub_users.length>0) && (this.sub_users.length > this.sub_user_index)) {
    //       this.getPointsConsumers(this.sub_users[this.sub_user_index]);
    //       this.sub_user_index = this.sub_user_index + 1;
    //     }
    //   })
    // }
  }
  initPointsConsumers() {
    this.left_points =  0;
    this.right_points =  0;
    this.current_balance = 0;
  }
  getDownTree(upper_user) {
    let users = [];
    if(upper_user) {
      for(let user of this.users_from_tree) {
        if((user.upper_id == upper_user['userid'])||(user.upper_id == upper_user['user_id'])) {
          users.push(user);
        }
      }
    }
    return users;
  }
  getUserById(id) {
    for(let user of this.users) {
      if(user.userid == id) {
        return user;
      }
    }
  }
  getUsers() {
    this.genealogyTreeService.getUsers().pipe().subscribe(res=>{this.users =res;});
  }
}

