import { Component, OnInit } from '@angular/core';
import {StorageService} from "../../services/storage.service";
import {first, map} from "rxjs/operators";
import {BinarySellerService} from "../../services/side_services/binary-seller.service";
import {environment} from "../../../environments/environment";
import {GenealogyTreeService} from "../../services/side_services/genealogy-tree.service";
import {CountryCurrencyPriceService} from "../../services/country-currency-price.service";
import Currency from "../../model/currency";
import {HttpService} from "../../services/http.service";
import {ShareService} from "../../services/share.service";
import {SocketService} from "../../services/socket.service";

@Component({
  selector: 'app-product-purchasing',
  templateUrl: './product-purchasing.component.html',
  styleUrls: ['./product-purchasing.component.css']
})
export class ProductPurchasingComponent implements OnInit {
  userInfo: any;
  currency: Currency = new Currency;
  cCode = 'PH';
  curCode = 'PHP';
  currencyValue = 0;
  products:any = [];
  left_points = 0;
  right_points = 0;
  origin_left_points = 0;
  origin_right_points = 0;
  cur_left_points = 0;
  cur_right_points = 0;
  origin_position: any;
  origin_rel_position: any;
  total_left_consumers = 0;
  total_right_consumers = 0;
  total_cur_left_consumers = 0;
  total_cur_right_consumers = 0;
  total_lc_balance = 0;
  requested_order = 0;
  requested_withdrawal = 0;
  available_order = 0;
  available_withdrawal = 0;
  current_balance = 0;
  total_earning = 0;
  currentUser = [];
  upload_url = 'http://localhost:8080/upload/image/';
  userid: any;
  binary_user = [];
  binary_users: any = [];
  binary_depth: number = 0;
  absolute_position: any = '';
  relative_position: any = '';
  placement_id: any = 0;
  msg_consumer_status = '';
  msg = '';
  check_pay_button = false;
  selected_consumer_id = 0;
  selected_seller_id = 0;
  users:any = [];
  flg_tree: boolean = false;
  users_from_tree: any = [];
  user_to_tree: any = [];
  temp = [{}];
  temper = [{}];
  productBySellerId: any = [];
  selected_product = {};
  selected_product_id: any = '';
  total_ordered_product: any = [];
  total_ordered_count = 0;
  total_item_amount = 0;
  qty = [];
  product_to_order = 60;
  lcBalance = 0;
  uri = environment.backendUrl;
  payResult = 0;
  selectedIdLeft: any;
  selectedIdRight: any;
  preSelectedId: any = [];
  preSelectedMiddleId: any;
  selectIdIndex = 0;
  middleSelectedUserId: any;
  searchFlag = false;
  accessFlag = false;
  total_ita = 0;
  limitCount = 0;
  itaIndex = 0;
  add_id = 0;
  constructor(private storageService: StorageService,
              private binarySeller: BinarySellerService,
              private genealogyTreeService: GenealogyTreeService,
              private ccp: CountryCurrencyPriceService,
              private api: HttpService,
              public share: ShareService,
              public socket: SocketService, ) {
    this.currentUser =  this.storageService.getUser()
  }

  ngOnInit(): void {
    console.log("currentUser: ", this.currentUser)
    if(this.currentUser) {
      this.userid = this.currentUser['id'];
      this.getTotalLcBalance(this.userid);
      this.getAvailable(this.userid)
      this.getTotalEarningBalance(this.userid);
      this.getProducts('');
      this.getCurrencyValue();
      this.getUsersFromTree();
    }
  }
  getProducts(userid) {
    return this.binarySeller.getProducts('/binary-seller/getProducts', userid)
      .pipe(first()).subscribe(res=>{
        if(res) {
          this.productBySellerId = res;
          for(let product of this.productBySellerId) {
            this.qty[product['_id']] = 0;
          }
        }
      });
  }
  getTotalEarningBalance(userid) {
    this.genealogyTreeService.getTotalEarningBalance(userid).pipe().subscribe(res => {if(res) {this.total_earning = res['total_earning']; this.current_balance = res['current_balance']}});
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
  getTotalLcBalance(buyerId) {
    this.api.get(this.uri + '/getLcBalance/' + buyerId).then((response: number) => {
      this.total_lc_balance = response['value'];
    });
  }
  getAvailable(buyerId) {
    this.api.get(this.uri + '/getAvailable/' + buyerId).then((response: number) => {
      this.available_order = response['value'][0].available_order;
      this.available_withdrawal = response['value'][0].available_withdrawal;
      this.requested_order = response['value'][0].requested_order;
      this.requested_withdrawal = response['value'][0].requested_withdrawal;
    });
  }

  updateLCBalance(buyerId, payResult) {
    console.log("payResult: ", payResult)
    this.genealogyTreeService.updateLCBalance(buyerId, payResult)
      .pipe().subscribe(res => {console.log("resUpdateLCBalance: ", res['lc']); this.lcBalance = res['lc']});
  }

  getUsersFromTree() {
    this.genealogyTreeService.getUsersFromTree()
      .pipe().subscribe(res=> {
      this.users_from_tree = res;
      console.log("userTree: ", this.users_from_tree)
      this.users_from_tree.forEach(element => {
        if (element.user_id == this.currentUser['id']) {
          this.accessFlag = true;
          this.total_ita = element.total_ita;
          this.origin_rel_position = element.position;
          return;
        }
      });
    })
  }


  searchProductBySellerId(event) {
    this.selected_seller_id = event.target.value;
    this.getProducts(this.selected_seller_id);
  }
  addToCart(_id, product) {
    if(this.total_lc_balance) {
      this.msg = '';
      this.selected_product_id = _id;
      this.selected_product = product;
      this.total_ordered_count++;
      this.total_item_amount += this.qty[this.selected_product_id]*this.selected_product['market_price'];
      this.total_ordered_product.push({'starter_id': -1, 'consumer_id': this.currentUser['id'], 'seller_id': this.selected_seller_id,  'product_id': _id,'qty': this.qty[_id]});
      this.qty[_id] = 0;
      console.log('fisrt, second: ', this.total_item_amount-this.product_to_order, this.total_lc_balance-this.total_item_amount/(this.socket.btc_usd * this.socket.lc_btc *this.currencyValue))
      if((this.total_item_amount-this.product_to_order>0)&&(this.total_lc_balance-this.total_item_amount/(this.socket.btc_usd * this.socket.lc_btc *this.currencyValue)>0)) {
        console.log('firstone')
        // this.check_pay_button = true;
        this.selectedIdLeft = this.userid;
        this.selectedIdRight = this.userid;
        this.middleSelectedUserId = this.userid;
        this.add_id = this.userid;
        this.genealogyTreeService.setBalance(0, 0, 0, 0, "R").pipe().subscribe(res => {console.log('setBalance0', res); 
        this.genealogyTreeService.getPrevTotalIta(this.userid)
          .pipe().subscribe(res => {
            console.log('here')
            // if (res['total_ita'] > 2400) {
              this.getCurPoints();
            // } else {
            //   this.check_pay_button = true;
            // }
        })
      });
      }
      else{
        this.msg = "The buyer does not have enough balance or something else";
      }
    }
    else {
      this.msg = "The buyer does not have  balance or something else";
    }

  }

  getCurPoints() {
    this.cur_left_points = 0;
    this.cur_right_points = 0;
    this.total_cur_left_consumers = 0;
    this.total_cur_right_consumers = 0;
    for (let i = 1 ; i < this.users_from_tree.length ; i++) {
      if (this.users_from_tree[i].upper_id == this.selectedIdLeft && this.users_from_tree[i].status == "pass") {
        if (this.users_from_tree[i].position == "Left") {
          this.cur_left_points += this.users_from_tree[i].total_ita;
          this.cur_left_points += this.users_from_tree[i].purchase_ita;
          this.total_cur_left_consumers += 1;
          this.selectedIdLeft = this.users_from_tree[i].user_id;
          console.log("nextUserId: ", this.selectedIdLeft)
          break;
        }
      }
    }
    if (this.total_cur_left_consumers == 1) {this.getCurLeftPoints(this.selectedIdLeft, 1);}

    for (let i = 1 ; i < this.users_from_tree.length ; i++) {
      if (this.users_from_tree[i].upper_id == this.selectedIdRight && this.users_from_tree[i].status == "pass") {
        if (this.users_from_tree[i].position == "Right") {
          this.cur_right_points += this.users_from_tree[i].total_ita;
          this.cur_right_points += this.users_from_tree[i].purchase_ita;
          this.total_cur_right_consumers += 1;
          this.selectedIdRight = this.users_from_tree[i].user_id;
          console.log("rightID:", this.selectedIdRight)
          break;
        }
      }
    }

    if (this.total_cur_right_consumers == 1) {this.getCurRightPoints(this.selectedIdRight, 1);}
    console.log("left/right: ", this.cur_left_points, this.cur_right_points)
    if(this.cur_left_points - this.cur_right_points > 0) {
      this.cur_left_points = this.cur_left_points - this.cur_right_points;
      this.cur_right_points = 0;
    }
    else{
      this.cur_right_points = this.cur_right_points - this.cur_left_points;
      this.cur_left_points = 0;
    }

    this.itaIndex++;
    let itaAmount = this.total_item_amount;
    if (this.itaIndex > 10) {
      itaAmount = 0;
    }
    console.log("left/right After: ", this.cur_left_points, this.cur_right_points, this.origin_rel_position, this.middleSelectedUserId)

    if (this.origin_rel_position == "Right") {
      if (this.cur_left_points - (this.cur_right_points + this.total_item_amount) >= 0) {
        this.genealogyTreeService.setBalance((this.cur_right_points + this.total_item_amount) * 0.05, itaAmount, this.middleSelectedUserId, this.add_id, "R")
        .pipe().subscribe(res => {console.log('setBalance11', res); this.limitCount++; this.nextPoints()});
      } else {
        this.genealogyTreeService.setBalance(this.cur_left_points * 0.05, itaAmount, this.middleSelectedUserId, this.add_id, "R")
        .pipe().subscribe(res => {console.log('setBalance22', res); this.limitCount++; this.nextPoints()});
      }
    } else if (this.origin_rel_position == "Left") {
      if (this.cur_right_points - (this.cur_left_points + this.total_item_amount) >= 0) {
        this.genealogyTreeService.setBalance((this.cur_left_points + this.total_item_amount) * 0.05, itaAmount, this.middleSelectedUserId, this.add_id, "R")
        .pipe().subscribe(res => {console.log('setBalance33', res); this.limitCount++; this.nextPoints()});
      } else {
        this.genealogyTreeService.setBalance(this.cur_right_points * 0.05, itaAmount, this.middleSelectedUserId, this.add_id, "R")
        .pipe().subscribe(res => {console.log('setBalance44', res); this.limitCount++; this.nextPoints()});
        
      }
    }
  }

  nextPoints() {
    for (let i = 0 ; i < this.users_from_tree.length ; i++) {
      if (this.users_from_tree[i].user_id == this.middleSelectedUserId) {
        this.middleSelectedUserId = this.users_from_tree[i].upper_id;
        this.origin_rel_position = this.users_from_tree[i].position;
        console.log("middleSelectedUserId: ",this.middleSelectedUserId)
        break;
      }
    }
    if (this.middleSelectedUserId != 0 && this.limitCount <= 10) {
      this.selectedIdLeft = this.middleSelectedUserId;
      this.selectedIdRight = this.middleSelectedUserId;
      this.getCurPoints()
    } else {
      this.check_pay_button = true;
    }
  }

  getCurLeftPoints(selectedId, limit) {
    let item = [0, 0]
    let k = 0; 
    for (let i = 1 ; i < this.users_from_tree.length ; i++) {
      if (this.users_from_tree[i].upper_id == selectedId && this.users_from_tree[i].status == "pass") {
        this.cur_left_points += this.users_from_tree[i].total_ita;
        if (limit <= 9) {
          this.cur_left_points += this.users_from_tree[i].purchase_ita;
        }
        item[k] = this.users_from_tree[i].user_id;
        k++;
        if (k == 2) {break;}
      }
    }
    if (item[0] != 0) {this.getCurLeftPoints(item[0], limit+1);}
    if (item[1] != 0) {this.getCurLeftPoints(item[1], limit+1);}
  }

  getCurRightPoints(selectedId, limit) {
    let item = [0, 0]
    let k = 0; 
    for (let i = 1 ; i < this.users_from_tree.length ; i++) {
      if (this.users_from_tree[i].upper_id == selectedId && this.users_from_tree[i].status == "pass") {
        this.cur_right_points += this.users_from_tree[i].total_ita;
        if (limit <= 9) {
          this.cur_right_points += this.users_from_tree[i].purchase_ita;
        }
        item[k] = this.users_from_tree[i].user_id;
        k++;
        if (k == 2) {break;}
      }
    }
    if (item[0] != 0) {this.getCurRightPoints(item[0], limit+1);}
    if (item[1] != 0) {this.getCurRightPoints(item[1], limit+1);}
  }

  plusToCart(_id){
    this.qty[_id] = this.qty[_id] + 1;
  }
  subtractFromCart(_id){
    if(this.qty[_id]>0){
      this.qty[_id] = this.qty[_id] - 1;
      return;
    }
    this.qty[_id] = 0;
  }
  payNow() {
    this.payResult = this.total_lc_balance - this.total_item_amount/(this.socket.btc_usd * this.socket.lc_btc *this.currencyValue);
    if(this.payResult>0) {
      this.genealogyTreeService.updateCurrentBalance(this.userid, -this.total_item_amount)
        .pipe().subscribe(res => {
          console.log("resCUrrentBalance: ", res)
          this.current_balance = this.current_balance - this.total_item_amount;
      })
      this.genealogyTreeService.createOrder(this.total_ordered_product)
        .pipe().subscribe(res => {
        if(res['status']) {
        }
      });
    }
    this.current_balance = this.current_balance - this.total_item_amount;
    this.check_pay_button = false;
    this.total_item_amount = 0;
  }
}
