import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../services/http.service';
import { Router } from '@angular/router';
import { ShareService } from '../../services/share.service';
import { StorageService } from '../../services/storage.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loading = false;
  showError = false;
  error = {
    message: ''
  };
  user: User = {
    email: '',
    password: ''
  };
  constructor(
    private http: HttpService,
    private router: Router,
    private storage: StorageService,
    private share: ShareService) { }

  ngOnInit() {
    if (this.share.admin_user) {
      this.router.navigate(['admin/dashboard']);
    }
  }

  submit() {
    this.loading = true;
    this.http.postToBackend('/admin/login', this.user)
      .then((result: any) => {
        console.log(result);
        const user = result.payload;
        /* Save User To Local Storage */
        this.storage.saveAdminUser(user);
        this.share.updateAdminUser(user);
        this.loading = false;
        this.router.navigate(['admin/dashboard'] );
      })
      .catch(err => {
        console.log(err);
        this.loading = false;
        this.showError = true;
        this.error.message = JSON.parse(err._body).payload;
      });
  }

}

interface User {
  email: String;
  password: String;
}
