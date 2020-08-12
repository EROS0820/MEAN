import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import { ShareService } from '../../services/share.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  constructor(
    public adminsocket: AdminService,
    public share: ShareService
  ) { }

  ngOnInit() { }

}
