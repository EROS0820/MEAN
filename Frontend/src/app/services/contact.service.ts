import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { NotificationsService } from 'angular2-notifications';

@Injectable({
  providedIn: 'root'
})
export class ContactService {

  uri = environment.backendUrl + '/contact';

  constructor(private http: HttpClient, private notify: NotificationsService) { }

  sendMessage(email, title, message) {
    const obj = {
      email: email,
      title: title,
      message: message
    };
    this.http.post(`${this.uri}`, obj).subscribe(res => {
      if (res['result']) {
        this.notify.info('INFO', res['result'], { timeOut: 5000 });
      } else {
        console.log(res);
      }
    });
  }
}
