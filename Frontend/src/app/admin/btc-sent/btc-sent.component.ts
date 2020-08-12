import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-btc-sent',
  templateUrl: './btc-sent.component.html',
  styleUrls: ['./btc-sent.component.css']
})
export class BtcSentComponent implements OnInit {

  constructor(public adminsocket: AdminService) { }

  ngOnInit() {
  }

}
