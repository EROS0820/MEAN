import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SocketService } from 'src/app/services/socket.service';
import { HttpService } from 'src/app/services/http.service';
import { environment } from '../../../../environments/environment';
import { ShareService } from 'src/app/services/share.service';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-top-rewards',
  templateUrl: './top-rewards.component.html',
  styleUrls: ['./top-rewards.component.css']
})
export class TopRewardsComponent implements OnInit {

  uri = environment.backendUrl;
  rewardDatas: any = {};
  len = 0;
  searchText;
  rewardTime: any;
  timeStr: string;
  lcamount = 0;
  perstockshare = 1;
  totallc = 0;
  constructor(
    private router: Router,
    public socket: SocketService,
    private api: HttpService,
    public share: ShareService, private storage: StorageService) {

    }

  ngOnInit() {
    this.api.get(this.uri + '/getRewardTimer').then((res: any) => {
      // this.rewardTime = res['time'] === 0? 1: res['time'];
      this.rewardTime = res['time'];

          this.downTime();
          setInterval(() => {
            this.downTime();
          }, 1000);

    });
    this.initQualifiersData();
  }

  initQualifiersData() {
    this.len = 0;
    this.totallc = 0;
    this.rewardDatas = {};
    this.api.get(this.uri + '/getQBonus').then((res: any) => {
      this.share.qualifier_bonus = res;
      this.storage.saveQBonus(res);
      if (this.share.qualifier_bonus > 0) {
        this.api.get(this.uri + '/getQualifiersData').then((response: any) => {
          if (Object.keys(response).length > 0) {
            this.len = Object.keys(response).length;
            for (let i = 0; i < Object.keys(response).length; i++) {
              const tmp = parseFloat(response[i]['btcpaid']);
              if (tmp < this.socket.CycleBtcConversionTarget || response[i]['btcpaid'] === 0) {
                delete response[i];
                this.len--;
              } else {
                this.totallc += parseFloat(response[i]['lc']);
              }
            }
            this.rewardDatas = response;
          }
        });
      }
    });
  }

  convertTime(secs) {
    const sec_num = parseInt(secs, 10);
    const hours   = Math.floor(sec_num / 3600);
    const minutes = Math.floor(sec_num / 60) % 60;
    const seconds = sec_num % 60;

    return [hours, minutes, seconds]
      .map(v => v < 10 ? '0' + v : v)
      .filter((v, i) => v !== '00' || i > 0)
      .join(':');
  }

  setQBonus4Each() {
    for (let i = 0; i < this.rewardDatas.length; i ++) {
      this.rewardDatas[i]['lc'] += (this.share.qualifier_bonus / this.totallc) * this.rewardDatas[i]['lc'];
    }

    this.api.postToBackend('/setQBonusEachUser', { qualifiers: this.rewardDatas }, this.share.user.token);
    this.api.postToBackend('/setQBonus', { amount: 0 }, this.share.user.token).then((response: any) =>
      {
        this.share.qualifier_bonus = 0;
        this.storage.saveQBonus(0);
         this.initQualifiersData();
      }
    );
  }

  downTime() {
    if (this.rewardTime === 0 || this.rewardTime < 0) {
       this.rewardTime = this.socket.TimeRunningLimit * 60;
    } else {
      this.rewardTime--;
      if (this.rewardTime === 0) {
        console.log(Object.keys(this.rewardDatas).length);
        if (Object.keys(this.rewardDatas).length > 0) {
          this.setQBonus4Each();
        }
      }
    }
    this.timeStr = this.convertTime(this.rewardTime);
  }

  goToBazaarHome() {
    this.router.navigate(['cryptobazaar']);
  }

}
