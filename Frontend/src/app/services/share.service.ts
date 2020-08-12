import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class ShareService {
  user: any = false;
  admin_user: any = false;
  qualifier_bonus = 0;

  constructor(private storage: StorageService) {
    this.user = this.storage.getUser();
    this.admin_user = this.storage.getAdminUser();
    this.qualifier_bonus = (this.storage.getQBonus()) === null ? 0 : this.storage.getQBonus();
  }

  updateUser(user) {
    this.user = user;
  }

  updateAdminUser(user) {
    this.admin_user = user;
  }
}
