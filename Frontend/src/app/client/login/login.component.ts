import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../services/http.service';
import { Router } from '@angular/router';
import { ShareService } from '../../services/share.service';
import { StorageService } from '../../services/storage.service';
import { SocketService } from '../../services/socket.service';

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
    private share: ShareService,
    private socket: SocketService) { }

  ngOnInit() {
    if (this.share.user) {
      this.router.navigate(['home']);
    }
  }

  submit() {
    this.loading = true;
    this.http.postToBackend('/login', this.user)
      .then((result: any) => {
        console.log("result",result)
        const user = result.payload;
        /* Save User To Local Storage */
        this.storage.saveUser(user);
        this.share.updateUser(user);
        this.socket.reconnect();
        this.loading = false;
        this.router.navigate(['home']);
      })
      .catch(err => {
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
