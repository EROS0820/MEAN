import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { Observable } from 'rxjs';
import { ShareService } from '../services/share.service';
import { environment } from '../../environments/environment';
import { NotificationsService } from 'angular2-notifications';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})

export class SocketService {
  socket;
  btc_balance = 0;
  lc_balance = 0;
  q_bonus = 0;
  lc_btc = 0;
  dec_num = 0;
  btc_usd = 0;
  last_transaction: any;
  last_btol_conversions: any = [];
  last_ltob_conversions: any = [];
  status_ltob = false;
  status_btol = false;
  online_user = 0;
  total_user = 0;
  btc_received_count = 0;
  btc_sent_count = 0;
  btc_received_today_count = 0;
  btc_sent_today_count = 0;
  multiplier;
  BtcConversionTarget = 0;
  RefillProductAvailavility = 0;
  LcMaintainingBalance = 0;
  TimeRunningLimit = 0;
  CycleBtcConversionTarget = 0;
  DecimalEditing = 0;


  constructor(private share: ShareService, private notify: NotificationsService, private router: Router) {
    this.connect();
  }

  reconnect() {
    this.socket.disconnect();
    console.log('reconnect');
    // console.log(this.share.user);
    setTimeout(() => {
      this.connect();
    }, 100);
  }

  connect() {
    if (this.share.user) {
      this.socket = io(environment.backendUrl, { query: { token: this.share.user.token } });
    } else {
      this.socket = io(environment.backendUrl);
    }

    this.onMessage()
      .subscribe((message) => {
        switch (message.event) {
          case 'balance':
            this.btc_balance = message.data.btc;
            this.lc_balance = message.data.lc;
            break;
          case 'btc_balance':
            if (message.data.reason !== '') {
              if (this.btc_balance > message.data.amount) {
                this.notify.error('BTC Balance changed!', message.data.reason, { timeOut: 3000 });
              } else {
                this.notify.success('BTC Balance changed!', message.data.reason, { timeOut: 3000 });
              }
            }
            this.btc_balance = message.data.amount;
            break;

          case 'q_bonus':
            this.share.qualifier_bonus = message.data;
            break;
          case 'lc_balance':
            if (message.data.reason !== '') {
              if (this.lc_balance > message.data.amount) {
                this.notify.error('LC Balance changed!', message.data.reason, { timeOut: 3000 });
              } else {
                this.notify.success('LC Balance changed!', message.data.reason, { timeOut: 3000 });
              }
            }
            this.lc_balance = message.data.amount;
            break;
          case 'lc_btc changed':
            if (this.lc_btc > message.data) {
              // tslint:disable-next-line: max-line-length
              this.notify.info('1 LC Price changed!', '1 LC price has decreased from ' + this.lc_btc + ' to ' + message.data, { timeOut: 3000 });
            } else {
              // tslint:disable-next-line: max-line-length
              this.notify.info('1 LC Price changed!', '1 LC price has increased from ' + this.lc_btc + ' to ' + message.data, { timeOut: 3000 });
            }
            this.lc_btc = message.data;
            break;
          case 'transaction created':
            this.last_transaction = message.data;
            break;
          case 'last transaction':
            this.last_transaction = message.data;
            break;
          case 'last btol conversions':
            this.last_btol_conversions = message.data;
            this.status_btol = true;
            break;
          case 'last ltob conversions':
            this.last_ltob_conversions = message.data;
            this.status_ltob = true;
            break;
          case 'convert created':
            const record = message.data;
            if (record.type === 'btol') {
              this.last_btol_conversions.unshift(record);
            } else {
              this.last_ltob_conversions.unshift(record);
            }
            if (this.last_btol_conversions.length >= 8) { this.last_btol_conversions.pop(); }
            if (this.last_ltob_conversions.length >= 8) { this.last_ltob_conversions.pop(); }
            break;
          case 'lc_btc':
            this.lc_btc = message.data;
            break;
          case 'decimal_editing':
            this.dec_num = message.data;
            break;
          case 'online_user':
            this.online_user = message.data;
            break;
          case 'total_user':
            this.total_user = message.data;
            break;
          case 'btc_received_count':
            this.btc_received_count = message.data;
            break;
          case 'btc_sent_count':
            this.btc_sent_count = message.data;
            break;
          case 'btc_received_today_count':
            this.btc_received_today_count = message.data;
            break;
          case 'btc_sent_today_count':
            this.btc_sent_today_count = message.data;
            break;
          case 'btc_usd':
            {
              this.btc_usd = message.data;
              if (this.router.url === '/home') {
                this.notify.info('INFO', '1 BTC = ' + this.btc_usd + ' USD', { timeOut: 5000 });
              }
              break;
            }
          case 'multiplier':
            this.multiplier = message.data;
            break;
          case 'multiplier changed':
            this.multiplier = message.data;
            break;
          case 'update_decimal_editing':
            this.DecimalEditing = message.data;
            break;
          case 'bazaar_value_settings':
            {
              this.BtcConversionTarget = message.data['BtcConversionTarget'];
              this.RefillProductAvailavility = message.data['RefillProductAvailavility'];
              this.LcMaintainingBalance = message.data['LcMaintainingBalance'];
              this.TimeRunningLimit = message.data['TimeRunningLimit'];
              this.CycleBtcConversionTarget = message.data['CycleBtcConversionTarget'];
              this.DecimalEditing = message.data['DecimalEditing'];
            }
            break;
          default:
            // code...
            break;
        }

        if (message.event !== 'btc_usd') {
          // console.log('========from socket===========');
          // console.log(message);
          // console.log('========from socket===========');
        }
      });
  }

  onMessage(): Observable<any> {
    return new Observable<any>(observer => {
      this.socket.on('message', (data: any) => observer.next(data));
    });
  }
}
