import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/services/http.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-add-fund',
  templateUrl: './add-fund.component.html',
  styleUrls: ['./add-fund.component.css']
})
export class AddFundComponent implements OnInit {

  userInfo: String;
  amount: Number;
  uri = environment.backendUrl;

  constructor(
    private api: HttpService
  ) { }

  ngOnInit() {
    this.userInfo = "aa";
    this.amount = 100;
  }

  sendRequest() {
    console.log("sendrequest", this.userInfo, this.amount)
    this.api.postToBackend('/coinPayRequest', {userInfo: this.userInfo, amount: this.amount}).then((response: number) => {
      console.log('response: ', response)
    });
  }

}
