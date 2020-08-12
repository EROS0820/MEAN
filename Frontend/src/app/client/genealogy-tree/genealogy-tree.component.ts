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
import { MatDialog } from '@angular/material/dialog';
import { SignupModalComponent } from './signup-modal/signup-modal.component';

@Component({
  selector: 'app-genealogy-tree',
  templateUrl: './genealogy-tree.component.html',
  styleUrls: ['./genealogy-tree.component.css']
})
export class GenealogyTreeComponent implements OnInit {
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
  itaIndex = 0;
  add_id = 0;
  total_ita = 0;
  userFilterId = 0;
  upgradeFlag = false
  constructor(private storageService: StorageService,
              private binarySeller: BinarySellerService,
              private genealogyTreeService: GenealogyTreeService,
              private ccp: CountryCurrencyPriceService,
              private api: HttpService,
              public share: ShareService,
              public dialog: MatDialog,
              public socket: SocketService, ) {
    this.currentUser =  this.storageService.getUser()
  }

  ngOnInit(): void {
    if(this.currentUser) {
      this.userFilterId = this.currentUser['id']
      this.userid = this.currentUser['id'];
      this.selectedIdLeft = this.selectedIdRight = this.preSelectedMiddleId = this.userid;
      this.initBinaryUser(this.currentUser);
      this.getTotalLcBalance(this.userid);
      this.getAvailable(this.userid)
      this.getTotalEarningBalance(this.userid);
      this.getProducts('');
      this.getUsers();
      this.getCurrencyValue();
    }
  }
  isMobileMenu(): boolean {
    if ($(window).width() > 991) {
      return false;
    }
    return true;
  }
  initBinaryUser(starter) {
    this.binary_user.push(
      {'starter': starter}, 
      {'layer1_left': []}, 
      {'layer1_right': []}, 
      {'layer2_left_1': []},
      {'layer2_left_2':[]}, 
      {'layer2_right_1': []}, 
      {'layer2_right_2': []},
      {'layer3_left_1': []}, 
      {'layer3_left_2': []}, 
      {'layer3_left_3': []}, 
      {'layer3_left_4': []},
      {'layer3_right_1': []}, 
      {'layer3_right_2': []}, 
      {'layer3_right_3': []}, 
      {'layer3_right_4': []});
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
  getUsers() {
    this.genealogyTreeService.getUsers().pipe().subscribe(res=>{this.users =res; this.getUsersFromTree();});
  }
  getUserById(id) {
    for(let user of this.users) {
      if(user.userid == id) {
        return user;
      }
    }
  }
  getTotalEarningBalance(userid) {
    this.genealogyTreeService.getTotalEarningBalance(userid).pipe().subscribe(res => 
      {if(res) {
        this.total_earning = res['total_earning']; 
        this.current_balance = res['current_balance']
        this.total_ita = res['total_ita']
      }
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
  getLcBalance(buyerId) {
    this.api.get(this.uri + '/getLcBalance/' + buyerId).then((response: number) => {
      this.lcBalance = response['value'];
    });
  }
  updateLCBalance(buyerId, payResult) {
    this.genealogyTreeService.updateLCBalance(buyerId, payResult)
      .pipe().subscribe(res => {this.lcBalance = res['lc']});
  }
  getUsersFromTree() {
    this.genealogyTreeService.getUsersFromTree()
      .pipe().subscribe(res=> {
      this.users_from_tree = res;
      if(res) {
        this.checkTree();
        this.getUsersFromTreeByStarter();
      }
    })
  }
  getUsersFromTreeByStarter() {
    this.left_points = 0;
    this.right_points = 0;
    this.total_left_consumers = 0;
    this.total_right_consumers = 0;
    this.initTree();
  }

  initTree() {
    console.log("treeinit")
    for(let user of this.users_from_tree) {
      if((user.upper_id == this.binary_user[0]['starter']['id'])||(user.upper_id == this.binary_user[0]['starter']['userid'])) {
        if(user.status == 'pass') {
          if(user.position == 'Left') {
            this.binary_user[1]['layer1_left'] = this.getUserById(user.user_id);
            this.temp = [{}];
            this.temp = this.getDownTree(this.getUserById(user.user_id));
            if(this.temp) {
              for(let i=0; i<this.temp.length; i++) {
                if(this.temp[i]['status'] == 'pass') {
                  if(this.temp[i]['position'] == 'Left') {
                    this.binary_user[3]['layer2_left_1'] = this.getUserById(this.temp[i]['user_id']);
                    this.temper = [{}];
                    this.temper = this.getDownTree(this.binary_user[3]['layer2_left_1']);
                    if(this.temper) {
                      for(let i = 0; i<this.temper.length; i++) {
                        if(this.temper[i]['status'] == 'pass') {
                          if(this.temper[i]['position'] == 'Left') {
                            this.binary_user[7]['layer3_left_1'] =this.getUserById(this.temper[i]['user_id']);
                          }
                          else {
                            this.binary_user[8]['layer3_left_2'] = this.getUserById(this.temper[i]['user_id']);
                          }
                        }
                      }
                    }
                  }
                  else {
                    this.binary_user[4]['layer2_left_2'] = this.getUserById(this.temp[i]['user_id']);
                    this.temper =[ {}];
                    this.temper = this.getDownTree(this.binary_user[4]['layer2_left_2']);
                    if(this.temper) {
                      for(let i=0; i<this.temper.length; i++) {
                        if(this.temper[i]['status'] == 'pass') {
                          if(this.temper[i]['position'] == 'Left') {
                            this.binary_user[9]['layer3_left_3'] =this.getUserById(this.temper[i]['user_id']);
                          }
                          else {
                            this.binary_user[10]['layer3_left_4'] = this.getUserById(this.temper[i]['user_id']);
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
          else{
            this.binary_user[2]['layer1_right'] = this.getUserById(user.user_id);
            this.temp = this.getDownTree(this.getUserById(user.user_id));
            if(this.temp) {
              for(let i=0; i<this.temp.length; i++) {
                if(this.temp[i]['status'] == 'pass') {
                  if(this.temp[i]['position'] == 'Left') {
                    this.binary_user[5]['layer2_right_1'] = this.getUserById(this.temp[i]['user_id']);
                    this.temper = [{}];
                    this.temper = this.getDownTree(this.binary_user[5].layer2_right_1);
                    if(this.temper) {
                      for(let i=0; i<this.temper.length; i++) {
                        if(this.temper[i]['status'] == 'pass') {
                          if(this.temper[i]['position'] == 'Left') {
                            this.binary_user[11]['layer3_right_1'] =this.getUserById(this.temper[i]['user_id']);
                          }
                          else {
                            this.binary_user[12]['layer3_right_2'] = this.getUserById(this.temper[i]['user_id']);
                          }
                        }
                      }
                    }
                  }
                  else {
                    this.binary_user[6]['layer2_right_2'] = this.getUserById(this.temp[i]['user_id']);
                    this.temper = [{}];
                    this.temper = this.getDownTree(this.binary_user[6]['layer2_right_2']);
                    if(this.temper) {
                      for(let i=0; i<this.temper.length; i++) {
                        if(this.temper[i]['status'] == 'pass') {
                          if(this.temper[i]['position'] == 'Left') {
                            this.binary_user[13]['layer3_right_3'] =this.getUserById(this.temper[i]['user_id']);
                          }
                          else {
                            this.binary_user[14]['layer3_right_4'] = this.getUserById(this.temper[i]['user_id']);
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
    for (let i = 1 ; i < this.users_from_tree.length ; i++) {
      if (this.users_from_tree[i].upper_id == this.selectedIdLeft && this.users_from_tree[i].status == "pass") {
        if (this.users_from_tree[i].position == "Left") {
          this.left_points += this.users_from_tree[i].total_ita;
          this.left_points += this.users_from_tree[i].purchase_ita;
          this.total_left_consumers += 1;
          this.selectedIdLeft = this.users_from_tree[i].user_id;
          break;
        }
      }
    }
    if (this.total_left_consumers == 1) {this.getLeftPoints(this.selectedIdLeft, 2);}

    for (let i = 1 ; i < this.users_from_tree.length ; i++) {
      if (this.users_from_tree[i].upper_id == this.selectedIdRight && this.users_from_tree[i].status == "pass") {
        if (this.users_from_tree[i].position == "Right") {
          this.right_points += this.users_from_tree[i].total_ita;
          this.right_points += this.users_from_tree[i].purchase_ita;
          this.total_right_consumers += 1;
          this.selectedIdRight = this.users_from_tree[i].user_id;
          break;
        }
      }
    }
    if (this.total_right_consumers == 1) {this.getRightPoints(this.selectedIdRight, 2);}
    this.getPointsConsumers();
    console.log("binaryUser", this.binary_user)
  }

  getLeftPoints(selectedId, limit) {
    let item = [0, 0]
    let k = 0; 
    for (let i = 1 ; i < this.users_from_tree.length ; i++) {
      if (this.users_from_tree[i].upper_id == selectedId && this.users_from_tree[i].status == "pass") {
        this.left_points += this.users_from_tree[i].total_ita;
        if (limit <= 9) {
          this.left_points += this.users_from_tree[i].purchase_ita;
        }
        this.total_left_consumers += 1;
        item[k] = this.users_from_tree[i].user_id;
        k++;
        if (k == 2) {break;}
      }
    }
    if (item[0] != 0) {this.getLeftPoints(item[0], limit+1);}
    if (item[1] != 0) {this.getLeftPoints(item[1], limit+1);}
  }

  getRightPoints(selectedId, limit) {
    let item = [0, 0]
    let k = 0; 
    for (let i = 1 ; i < this.users_from_tree.length ; i++) {
      if (this.users_from_tree[i].upper_id == selectedId && this.users_from_tree[i].status == "pass") {
        this.right_points += this.users_from_tree[i].total_ita;
        if (limit <= 9) {
          this.right_points += this.users_from_tree[i].purchase_ita;
        }
        this.total_right_consumers += 1;
        item[k] = this.users_from_tree[i].user_id;
        k++;
        if (k == 2) {break;}
      }
    }
    if (item[0] != 0) {this.getRightPoints(item[0], limit+1);}
    if (item[1] != 0) {this.getRightPoints(item[1], limit+1);}
  }

  getPointsConsumers() {
    
    if(this.left_points - this.right_points > 0) {
      this.left_points = this.left_points - this.right_points;
      if (this.selectIdIndex == 0) {
        this.origin_left_points = this.left_points;
        this.origin_right_points = 0;
      }
      
      if (this.left_points > 35886) {
        this.left_points = 35886;
      } 
      if (this.total_earning >= 8000) {
        this.left_points = 0;
      }
      this.right_points = 0;
    }
    else{
      this.right_points = this.right_points - this.left_points;
      if (this.selectIdIndex == 0) {
        this.origin_right_points = this.right_points;
        this.origin_left_points = 0;
      }
      if (this.right_points > 35886) {
        this.right_points = 35886;
      } 
      if (this.total_earning >= 8000) {
        this.right_points = 0;
      }
      this.left_points = 0;
    }
  }
  initSubTree(subTree) {
    this.binary_user.forEach((value, index) => {
      for(let key in value)
        this.binary_user[index][key] = [];
    })
    this.binary_user[0]['starter'] =Object.assign({}, subTree);
    this.getUsersFromTreeByStarter();
  }
  showKidsTree(subTree, position) {
    console.log("subTree, position", subTree, position)
    this.origin_position = position;
    this.preSelectedId[this.selectIdIndex] = this.preSelectedMiddleId;
    this.selectIdIndex++;
    this.preSelectedMiddleId = this.selectedIdLeft = this.selectedIdRight = subTree.userid;
    const binary = [];
    this.binary_user.slice().forEach((item) => {
      binary.push(Object.assign({}, item));
    });
    this.binary_users.push(binary);
    this.binary_depth = this.binary_depth + 1;
    this.initSubTree(subTree);
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

  //Check if the current logged in user exists and status is pass in tree model.
  checkTree() {
    for (let user of this.users_from_tree) {
      if(user.user_id == this.currentUser['id']) {
        if(user.status == 'pass') {
          this.flg_tree = true;
        }
      }
    }
  }
  goPrevious() {
    this.preSelectedMiddleId = this.selectedIdLeft = this.selectedIdRight = this.preSelectedId[this.selectIdIndex-1];
    this.selectIdIndex--;
    this.binary_depth = this.binary_depth - 1;
    this.initSubTree(this.binary_users[this.binary_depth][0]['starter']);
    this.binary_users.splice(this.binary_users.length-1, 1);
  }
  getUpperUser(binaryUser, absolute_position, relative_position, userKey) {
    this.origin_position = absolute_position;
    this.origin_rel_position = relative_position;
    this.placement_id = '';
    this.absolute_position = '';
    this.relative_position = '';
    for(let user of this.binary_user) {
      for(let key in user) {
        if(key == userKey) {
          if (!user[key].userid) {
            this.searchFlag = true;
          } else {
            this.searchFlag = false;
          }
        }
        if(this.flg_tree&&key == binaryUser) {
          if(user[key]['id']) {
            this.placement_id = user[key]['id'];
          }
          else if(user[key]['userid']) {
            this.placement_id = user[key]['userid'];
          }
          if(this.placement_id) {
            this.absolute_position = absolute_position;
            this.relative_position = relative_position;
          }
        }
      }
    }

  }
  checkBinaryAvailable(event) {
    this.msg_consumer_status = '';
    const consumer_id = event.target.value;
    for(let user of this.users_from_tree) {
      if(user['user_id']) {
        if(user['user_id'].toString() == consumer_id) {
          this.msg_consumer_status = "Customer is not available.";
          this.selected_consumer_id = 0;
          return ;
        }
      }
    }
    if(this.users){
      for(let user of this.users) {
        if((user['userid'].toString() == consumer_id)) {
          this.add_id = consumer_id;
          this.msg_consumer_status = "Customer is  available.";
          this.selected_consumer_id = consumer_id;
        }
      }
      if(this.selected_consumer_id != consumer_id) {
        this.msg_consumer_status = "Customer is not registered user.";
        this.selected_consumer_id = 0;
        this.selected_seller_id = 0;
      }
    }
  }
  searchProductBySellerId(event) {
    this.selected_seller_id = event.target.value;
    this.getProducts(this.selected_seller_id);
  }
  addToCart(_id, product) {
    if (this.upgradeFlag) {
      console.log("ddd")
      this.getLcBalance(this.userid);
      this.placement_id = this.userid;
      console.log("user from tree", this.users_from_tree)
      this.users_from_tree.forEach(element => {
        if (element.user_id == this.currentUser['id']) {
          console.log("origin_rel_position", element.position, element)
          this.origin_rel_position = element.position;
        }
      });
    } else {
      this.getLcBalance(this.selected_consumer_id);
    }
    console.log("1", this.lcBalance)
    if(this.lcBalance) {
      console.log("2")
      this.msg = '';
      this.selected_product_id = _id;
      this.selected_product = product;
      this.total_ordered_count++;
      this.total_item_amount += this.qty[this.selected_product_id]*this.selected_product['market_price'];
      if (this.upgradeFlag) {
        this.add_id = this.userid
        this.total_ordered_product.push({'starter_id': this.currentUser['id'], 'consumer_id': this.userid, 'seller_id': this.selected_seller_id,  'product_id': _id,'qty': this.qty[_id]});
      } else {
        this.total_ordered_product.push({'starter_id': this.currentUser['id'], 'consumer_id': this.selected_consumer_id, 'seller_id': this.selected_seller_id,  'product_id': _id,'qty': this.qty[_id]});
      }
      this.qty[_id] = 0;
      console.log("first", this.total_item_amount, this.total_item_amount-this.product_to_order)
      console.log("second", this.lcBalance-this.total_item_amount/(this.socket.btc_usd * this.socket.lc_btc *this.currencyValue))
      console.log("sss", this.total_item_amount/(this.socket.btc_usd * this.socket.lc_btc *this.currencyValue))
      console.log("aaa", this.lcBalance)
      if((this.total_item_amount <= 3000) && (this.total_item_amount-this.product_to_order>0)&&(this.lcBalance-this.total_item_amount/(this.socket.btc_usd * this.socket.lc_btc *this.currencyValue)>0)) {
        
        this.selectedIdLeft = this.placement_id;
        this.selectedIdRight = this.placement_id;
        this.middleSelectedUserId = this.placement_id;
        console.log("placementId", this.placement_id)
        this.genealogyTreeService.setBalance(0, 0, 0, 0, "N").pipe().subscribe(res => {console.log('setBalance0', res); this.getCurPoints();});
        
        
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
          break;
        }
      }
    }

    if (this.total_cur_right_consumers == 1) {this.getCurRightPoints(this.selectedIdRight, 1);}
    
    if(this.cur_left_points - this.cur_right_points > 0) {
      console.log("curent1: ", this.cur_left_points, this.cur_right_points)
      this.cur_left_points = this.cur_left_points - this.cur_right_points;
      this.cur_right_points = 0;
    }
    else{
      console.log("curent2: ", this.cur_left_points, this.cur_right_points)
      this.cur_right_points = this.cur_right_points - this.cur_left_points;
      this.cur_left_points = 0;
    }

    
    this.genealogyTreeService.getTotalEarningBalance(this.middleSelectedUserId).pipe().subscribe(res => {
      console.log("res==", res)
      this.itaIndex++;
      let itaAmount = this.total_item_amount;
      if (this.itaIndex > 10) {
        itaAmount = 0;
      }
      if(res['total_earning'] < 8000) {
        console.log("original+", this.origin_rel_position)
        if (this.origin_rel_position == "Right") {
          if (this.cur_left_points - (this.cur_right_points + this.total_item_amount) >= 0) {
            this.genealogyTreeService.setBalance((this.cur_right_points + this.total_item_amount) * 0.209, itaAmount, this.middleSelectedUserId, this.add_id, "N")
              .pipe().subscribe(res => {console.log('setBalance11', res); this.nextPoints()});
          } else {
            this.genealogyTreeService.setBalance(this.cur_left_points * 0.209, itaAmount, this.middleSelectedUserId, this.add_id, "N")
            .pipe().subscribe(res => {console.log('setBalance22', res); this.nextPoints()});
          }
        } else if (this.origin_rel_position == "Left") {
          if (this.cur_right_points - (this.cur_left_points + this.total_item_amount) >= 0) {
            this.genealogyTreeService.setBalance((this.cur_left_points + this.total_item_amount) * 0.209, itaAmount, this.middleSelectedUserId, this.add_id, "N")
            .pipe().subscribe(res => {console.log('setBalance33', res); this.nextPoints()});
          } else {
            this.genealogyTreeService.setBalance(this.cur_right_points * 0.209, itaAmount, this.middleSelectedUserId, this.add_id, "N")
            .pipe().subscribe(res => {console.log('setBalance44', res); this.nextPoints()});
            
          }
        }
      } else {
        this.genealogyTreeService.setBalance(0, itaAmount, this.middleSelectedUserId, this.add_id, "N")
            .pipe().subscribe(res => {console.log('setBalance55', res); this.nextPoints()});
      }
    });
  }

  nextPoints() {
    for (let i = 0 ; i < this.users_from_tree.length ; i++) {
      if (this.users_from_tree[i].user_id == this.middleSelectedUserId) {
        this.middleSelectedUserId = this.users_from_tree[i].upper_id;
        console.log("middleSelectedID", this.middleSelectedUserId)
        console.log("this.originRelPosition", this.origin_rel_position)
        this.origin_rel_position = this.users_from_tree[i].position;
        console.log("this.originRelPosition22", this.origin_rel_position)
        break;
      }
    }
    console.log("nextPoints")
    if (this.middleSelectedUserId != 0) {
      console.log("contine")
      this.selectedIdLeft = this.middleSelectedUserId;
      this.selectedIdRight = this.middleSelectedUserId;
      this.getCurPoints()
    } else {
      console.log("final++")
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
    this.payResult = this.lcBalance - this.total_item_amount/(this.socket.btc_usd * this.socket.lc_btc *this.currencyValue);
    if (this.upgradeFlag) {
      this.user_to_tree.push({user_id: this.userid, upper_id: this.placement_id, absolute_position: this.absolute_position, position: this.relative_position, seller_id: this.selected_seller_id, starter_id: this.userid})
    } else {
      this.user_to_tree.push({user_id: this.selected_consumer_id, upper_id: this.placement_id, absolute_position: this.absolute_position, position: this.relative_position, seller_id: this.selected_seller_id, starter_id: this.userid})
    }
    if(this.payResult>0) {
      if (this.upgradeFlag) {
        this.updateLCBalance(this.userid, this.payResult);
      } else {
        this.updateLCBalance(this.selected_consumer_id, this.payResult);
        this.genealogyTreeService.createTree(this.user_to_tree)
          .pipe().subscribe(res => {return res;});
      }
      this.genealogyTreeService.createOrder(this.total_ordered_product)
        .pipe().subscribe(res => {
        if(res['status']) {
          this.check_pay_button = false;
        }
      });
    }
    this.check_pay_button = false;
    this.total_item_amount = 0;
  }

  openDialog() {
    const dialogRef = this.dialog.open(SignupModalComponent, {
      width: '1500px'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log("modal", result)
    });
  }

  signupBtn() {
    this.openDialog()
  }

  upgradBtn() {
    this.upgradeFlag = !this.upgradeFlag
  }

  userFilter() {
    if (this.userFilterId < this.userid) {
      alert("You can search users under you")
    } else {
      console.log(this.getUserById(this.userFilterId))
      this.users_from_tree.forEach(element => {
        if (this.userFilterId == element.user_id) {
          this.showKidsTree(this.getUserById(this.userFilterId), element.position)
        }
      });
    }
  }
}
