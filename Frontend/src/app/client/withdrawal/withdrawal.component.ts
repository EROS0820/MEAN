import { Component, OnInit } from '@angular/core';
import { ShareService } from '../../services/share.service';
import { HttpService } from '../../services/http.service';
import { SocketService } from '../../services/socket.service';

@Component({
  selector: 'app-withdrawal',
  templateUrl: './withdrawal.component.html',
  styleUrls: ['./withdrawal.component.css']
})
export class WithdrawalComponent implements OnInit {
  loading = false;
  sendData = {
    target: '',
    amount: '0'
  };
  showResult = false;
  showError = false;
  result = {
    message: ''
  };
  error = {
    message: ''
  };

  constructor(
    private api: HttpService,
    private share: ShareService,
    public socket: SocketService) {
  }

  ngOnInit() {
  }


  send() {
    this.loading = true;
    this.showError = false;
    this.showResult = false;
    this.error.message = '';
    this.result.message = '';

    this.api
      .postToBackend('/send', {
        to: this.sendData.target,
        amount: this.sendData.amount
      }, this.share.user.token)
      .then(result => {
        this.loading = false;
        this.showResult = true;
        this.result.message = 'successfully';
      })
      .catch(err => {
        this.loading = false;
        this.showError = true;
        if (err.status === 401) {
          this.error.message = 'user token expired';
        } else {
          const ResponseObject = JSON.parse(err._body).payload;
          // console.log(JSON.parse(err._body));
          // console.log(ResponseObject);
          this.error.message = ResponseObject;
          // if ('response' in ResponseObject) {
          //   this.error.message = ResponseObject.response.text;
          // } else {
          //   this.error.message = ResponseObject;
          // }
        }
      });
  }

  addFee() {
    return (+this.sendData.amount + 0.0001).toFixed(8);
  }
}
