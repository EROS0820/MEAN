import { Component, OnInit, ViewChild } from '@angular/core';
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
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';

@Component({
  selector: 'app-nav-dashboard',
  templateUrl: './nav-dashboard.component.html',
  styleUrls: ['./nav-dashboard.component.css']
})
export class NavDashboardComponent implements OnInit {

  displayedColumns: string[] = [ 'sequence', 'name', 'amount', 'type', 'date', 'profit', 'remain'];
  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);

  @ViewChild(MatPaginator) paginator: MatPaginator;

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
  search_result = 0;
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
    if(this.currentUser) {
      console.log("currentUser: ", this.currentUser)
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
    ELEMENT_DATA = [];
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
    this.genealogyTreeService.getUsers().pipe().subscribe(res=>{this.users =res; this.getUsersFromTree();console.log("userById", this.getUserById(this.currentUser['id']))});
  }
  getUserById(id) {
    for(let user of this.users) {
      if(user.userid == id) {
        return user;
      }
    }
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
      if (user.user_id == this.currentUser['id']) {
        console.log("current", user)
      }
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
}

export interface PeriodicElement {
  type: string;
  position: number;
  amount: number;
  profit: number;
  date: string;
  name: string;
  remain: string;
  sequence: number;
}

let ELEMENT_DATA: PeriodicElement[] = [];
