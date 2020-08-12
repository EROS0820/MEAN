import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { ShareService } from '../services/share.service';
import { Observable } from 'rxjs';
import { HttpService } from './http.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  socket;
  btc_usd = 0;
  lc_btc = 0;
  orders = [];
  btc_received = [];
  btc_sent = [];
  conversion_fee = 0;
  adder = 0;
  subtracter = 0;
  converted_lc = 0;
  converted_btc = 0;
  transfer_fee = 0;
  remain_btc = 0;
  received_btc = 0;
  sent_btc = 0;
  network_fee = 0;
  receive_btc = 0;

  constructor(private share: ShareService, private api: HttpService) {
    this.socket = io(environment.backendUrl, { query: { token: this.share.admin_user.token } });
    this.onMessage().subscribe((message) => {
      if (message.event === 'lc_btc') {
        this.lc_btc = message.data;
      }
      if (message.event === 'btc_usd') {
        this.btc_usd = message.data;
      } else {
        // console.log('========from socket===========');
        // console.log(message);
        // console.log('========from socket===========');
      }
    });

    this.api.get('https://api.blockcypher.com/v1/btc/main/addrs/' + this.share.admin_user.wallet + '/balance').then((result: any) => {
      this.remain_btc = result.balance * 1e-8;
      this.received_btc = result.total_received * 1e-8;
      this.sent_btc = result.total_sent * 1e-8;
    });

    this.api.getToBackend('/admin/getBTCReceived', this.share.admin_user.token).then((response: any) => {
      this.btc_received = response;
      this.network_fee = 0;
      response.map((record) => {
        console.log(record);
        if (record.fee) {
          this.network_fee += +record.fee;
        }
        console.log(this.network_fee);
      });
    });

    this.api.getToBackend('/admin/getBTCSent', this.share.admin_user.token).then((response: any) => {
      this.btc_sent = response;
      this.transfer_fee = response.length * 0.0001;
    });

    this.api.getToBackend('/admin/getAllOrders', this.share.admin_user.token).then((response: any) => {
      this.orders = response;
      this.conversion_fee = 0;
      this.converted_lc = 0;
      this.converted_btc = 0;
      this.receive_btc = 0;
      response.map((order) => {
        if (order.status === 'successful') { this.conversion_fee += order.fee; }
        if (order.status === 'successful' && order.type === 'ltob') {
          this.converted_lc += order.lcamount;
          this.receive_btc += order.btc_receive;
        }
        if ((order.status === 'successful' || order.status === 'closed') && order.type === 'btol') {
          this.converted_btc += order.lcamount * order.rate; }
      });
    });

    this.api.getToBackend('/admin/getAdder', this.share.admin_user.token).then((response: any) => {
      this.adder = response.payload;
    });
    this.api.getToBackend('/admin/getSubtracter', this.share.admin_user.token).then((response: any) => {
      this.subtracter = response.payload;
    });
  }

  disconnect() {
    this.socket.disconnect();
  }

  onMessage(): Observable<any> {
    return new Observable<any>(observer => {
      this.socket.on('message', (data: any) => observer.next(data));
    });
  }
}
