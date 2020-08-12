import { Component, OnInit } from '@angular/core';
import { StorageService } from '../../services/storage.service'
import { ShareService } from '../../services/share.service'
import { Router } from '@angular/router';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.css']
})
export class LogoutComponent implements OnInit {

  constructor(
  	private storage: StorageService,
    private router: Router,
    public share: ShareService,
    private adminsocket: AdminService
  ) { }

  ngOnInit() {
  	this.storage.destroyAdminUser();
    this.share.updateAdminUser(false);
    this.adminsocket.disconnect();
    this.router.navigate(['/admin/login'] );
  }

}
