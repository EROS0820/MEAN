import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../services/http.service';
import { ShareService } from '../../services/share.service';
import { SocketService } from '../../services/socket.service';

@Component({
  selector: 'app-openorder',
  templateUrl: './openorder.component.html',
  styleUrls: ['./openorder.component.css']
})
export class OpenorderComponent implements OnInit {

  isDisabledCancel: Boolean = false;
  constructor(private api: HttpService, private share: ShareService, private socket: SocketService) { }
  orders = [];
  ngOnInit() {
    this.api.getToBackend('/getOpenOrders', this.share.user.token).then((result: any) => {
      this.orders = result;
      console.log(result);
    });
  }

  cancel(order) {
    this.isDisabledCancel = true;
    if (confirm('Do you realy cancel this order?'))  {
      this.isDisabledCancel = true;
      this.api.postToBackend('/cancelOrder', order, this.share.user.token).then((result: any) => {
        this.isDisabledCancel = false;
        this.orders = result;
      });
    }
  }
}