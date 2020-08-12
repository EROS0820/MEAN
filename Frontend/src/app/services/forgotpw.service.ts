import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { NotificationsService } from 'angular2-notifications';

@Injectable({
  providedIn: 'root'
})
export class ForgotpwService {

  uri = environment.backendUrl + '/forgot';

  constructor(private http: HttpClient, private notify: NotificationsService) { }

  recovery(email) {
    const obj = {
      email: email
    };
    this.http.post(`${this.uri}`, obj).subscribe(res => {
      if (res['result']) {
        this.notify.info('INFO', res['result'], { timeOut: 5000 });
      } if (res['invalid']) {
        this.notify.error('INFO', res['invalid'], { timeOut: 5000 });
      } else {
        console.log(res);
      }
    });
  }
}

