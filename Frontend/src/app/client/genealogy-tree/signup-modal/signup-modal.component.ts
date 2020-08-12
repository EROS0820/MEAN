import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../../services/http.service';
import { Router, ActivatedRoute } from '@angular/router';

import { StorageService } from '../../../services/storage.service';
import { ShareService } from '../../../services/share.service';
import { SocketService } from '../../../services/socket.service';
import { CountryCurrencyPriceService } from '../../../services/country-currency-price.service';
import Currency from '../../../model/currency';
import {GenealogyTreeService} from "../../../services/side_services/genealogy-tree.service";
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-signup-modal',
  templateUrl: './signup-modal.component.html',
  styleUrls: ['./signup-modal.component.css']
})
export class SignupModalComponent implements OnInit {

  currentUser = [];
  positionFlag: Boolean = false
  emailFlag: Boolean = false
  
  constructor(
      private http: HttpService,
      private router: Router,
      private route: ActivatedRoute,
      private storage: StorageService,
      private share: ShareService,
      private socket: SocketService,
      private ccp: CountryCurrencyPriceService,
      private gtree: GenealogyTreeService,
      public dialogRef: MatDialogRef<SignupModalComponent>,
      ) {
        this.currentUser =  this.storage.getUser()
      }
  
    loading = false;
    showError = false;
    error = {
      message: ''
    };
  
    user: User = {
      first_name: '',
      last_name: '',
      email: '',
      phonenumber: '',
      password: '',
      re_password: '',
      linked_id: '',
      position: '',
      user_country: '',
      currency_val: ''
    };
  
    userInfo: any;
    currency: Currency = new Currency;
    cCode = 'PH';
    curCode = 'PHP';
    currencyValue = 0;

    emailInput() {
      this.http.getToBackend('/register/' + this.user.email)
        .then((res: any) => {
          console.log("res", res.payload)
          if (res.payload.length > 0) {
            console.log("11", res.payload[0])
            this.emailFlag = true
            alert("This email is already exist")
          } else {
            this.emailFlag = false
            console.log("22", res.payload[0])
          }
        })
    }
  
    submit() {
      if (!this.emailFlag && !this.positionFlag) {
        this.loading = true;
        this.http.postToBackend('/register', this.user)
          .then((result: any) => {
            this.loading = false;
            console.log("user", result.payload)
            this.gtree.getPrevTotalIta(this.currentUser['id'])
              .pipe().subscribe((res: any) => {
                console.log('here', res)
                this.gtree.createTree([{
                  user_id: result.payload.id,
                  upper_id: this.user.linked_id,
                  starter_id: this.currentUser['id'],
                  absolute_position: res.absolute_position,
                  position: this.user.position,
                  status: 'pass'
                }]).pipe().subscribe(res1 => {
                  console.log('res1', res1)
                  this.dialogRef.close(res1);
                })
            })
          })
          .catch(err => {
            if (err.status === 422) {
              this.showError = true;
              this.loading = false;
              this.error.message = 'Please enter required field';
            } else {
              this.showError = true;
              this.loading = false;
              this.error.message = JSON.parse(err._body).payload;
            }
          });
      } else {
        alert("can not submit")
      }
    }
  
    async ngOnInit() {
      // get user country code
      this.userInfo = await this.ccp.getUserInfo();
      // user country code
      this.user.user_country = this.userInfo['country'];
      this.cCode = this.userInfo['countryCode'];
      // get user country currency code
      this.curCode = this.currency[`${this.cCode}`];
      // get user country currency value
      this.currencyValue = await this.ccp.getCurrencyValue(this.curCode);
      this.user.currency_val = this.currencyValue + ' ' + this.curCode;
  
      const id = +this.route.snapshot.paramMap.get('id');
      // if (id > 0) {
      //   this.storage.saveAgentID(String(id));
      //   this.user.agent_id = String(id);
      // } else {
      //   this.user.agent_id = this.storage.getAgentID();
      // }
      // if (this.storage.getUser()) {
      //   this.router.navigate(['/home']);
      // }
  
    }
    initializeGenealogyTree(user) {
      console.log('her in user data of register', user);
      if(user.id == 1) {
        return this.gtree.initializeTree(user)
          .pipe().subscribe(res=>{
            if(res['code'] == 201) {
              console.log('successfully initialized tree in register component', res['data']);
            }
          })
      }
    }

    positionChange(event) {
      console.log("event: ", event.value)
      if (event.value == 1) {
        this.user.position = 'Left'
      } else if (event.value == 2) {
        this.user.position = 'Right'
      }
      this.gtree.positionExist(this.user.linked_id, this.user.position)
      .pipe().subscribe((res: any)=>{
        console.log('res', res)
        if (res && res.user_id) {
          console.log("change1")
          this.positionFlag = true
          alert("User is already exist under this position")
        } else {
          this.positionFlag = false
          console.log("change2")
        }
      })
    }
}

interface User {
    first_name: String;
    last_name: String;
    email: String;
    password: String;
    re_password: String;
    phonenumber: String;
    linked_id: String;
    position: String;
    user_country: String;
    currency_val: String;
}
