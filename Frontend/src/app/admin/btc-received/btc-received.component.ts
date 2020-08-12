import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-btc-received',
  templateUrl: './btc-received.component.html',
  styleUrls: ['./btc-received.component.css']
})
export class BtcReceivedComponent implements OnInit {

  constructor(public adminsocket: AdminService) { }

  ngOnInit() {
  }

}
