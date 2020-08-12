import { Component, OnChanges, SimpleChanges, Input } from '@angular/core';
import { HttpService } from '../../services/http.service';
import { ShareService } from '../../services/share.service';
import { SocketService } from '../../services/socket.service';

@Component({
  selector: 'app-convert2form',
  templateUrl: './convert2form.component.html',
  styleUrls: ['./convert2form.component.css']
})
export class Convert2formComponent implements OnChanges {
  @Input() btc_balance;
  @Input() lc_balance;
  @Input() lc_btc;
  mydata : any;
  mytotalMP : any;
  performingCB : any;
  currencyBS : any;
  defaultvalue : any;

  constructor(private api: HttpService, public share: ShareService, public socket: SocketService) { 
    this.api.getToBackend('/getDecimalEditing', this.share.user.token).then((result: any) => {
      this.dec_num = result.value;
    });               
                                                                  
  }
  rate: any = '0.00000001';
  amount_lc: any = 1000;
  showResult = false;
  showError = false;
  buttonlock = false;
  dec_num = 0;
  result = {
    message: ''
  };
  error = {
    message: ''
  };
  btc_stocks = 0;
  conversion_limit = 0;

  initValue = '';
  oldValue = '';

  ngOnChanges(changes: SimpleChanges) {
    if (changes.lc_btc) {
      this.rate = (+changes.lc_btc.currentValue).toFixed(15);
      this.oldValue = this.rate;
      this.initValue = this.rate;
    }
    this.api.getToBackend('/getBTCStocks', this.share.user.token).then((result: any) => {
      this.btc_stocks = result.value;
      console.log(this.btc_stocks);
    });
    this.api.getToBackend('/getConversionLimit', this.share.user.token).then((result: any) => {
      this.conversion_limit = result.value;
      console.log(this.conversion_limit);
    });
  }

  validInput() {
    this.dec_num = this.socket.DecimalEditing;
    var splitLen = 15 - this.dec_num + 2;
    var x = +(this.rate.substr(0, splitLen));
    var y = +(this.initValue.substr(0, splitLen));

    if (this.rate.length < splitLen) {
      this.rate = this.oldValue;
    } else if (x != y) {
      this.rate = this.oldValue;
    } else {
      this.oldValue = this.rate;
      //this.rate = this.oldValue;
    }
  }
  addRate(v) {
    if (+this.rate + v * Math.pow(10, -8) > 0) {
      this.rate = (+this.rate + v * Math.pow(10, -8)).toFixed(15);
      this.oldValue = this.rate;
      this.initValue = this.rate;
    }
  }

  getReceive() {
    return this.amount_lc * +this.rate * (1 - this.socket.multiplier.CF);
  }

  send() {
    this.showError = false;
    this.showResult = false;
    this.api.postToBackend('/recordOrder', {
      rate: this.rate,
      amount_lc: this.amount_lc,
      type: 'ltob'
    }, this.share.user.token).then(res => {
      this.showResult = true;
      this.result.message = 'successfully';
  
    }).catch(err => {
      this.showError = true;
      this.error.message = JSON.parse(err._body).payload;
    });
    this.buttonlock = true;
    setTimeout(() => {
      this.buttonlock = false;
    }, 30000);
    
  }

}
