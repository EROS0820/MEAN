import { Injectable } from '@angular/core';
/* Mock Service */
import { MockService } from './mock.service';
import { environment } from '../../environments/environment';
import { Http, Headers } from '@angular/http';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  // tslint:disable-next-line: deprecation
  constructor(private mock: MockService, private http: Http) { }

  public initUrl(url) {
    return environment.backendUrl + url;
  }

  post(url, data) {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(this.mock.API['post'][url]);
      }, 300);
    });
  }

  postToBackend(url, data, token = false) {
    // tslint:disable-next-line: deprecation
    let headers = new Headers({});
    if (!token) {
      // tslint:disable-next-line: deprecation
      headers = new Headers({
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      });
    } else {
      // tslint:disable-next-line: deprecation
      headers = new Headers({
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `bearer ${token}`
      });
    }
    return new Promise((resolve, reject) => {
      this.http
        .post(this.initUrl(url), data, { headers })
        .toPromise()
        .then(response => {
          resolve(response.json());
        })
        .catch(err => {
          reject(err);
        });
    });
  }

  getToBackend(url, token = false) {
    // tslint:disable-next-line: deprecation
    let headers = new Headers({});
    if (!token) {
      // tslint:disable-next-line: deprecation
      headers = new Headers({
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      });
    } else {
      // tslint:disable-next-line: deprecation
      headers = new Headers({
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `bearer ${token}`
      });
    }
    return new Promise((resolve, reject) => {
      this.http
        .get(this.initUrl(url), { headers })
        .toPromise()
        .then(response => {
          resolve(response.json());
        })
        .catch(err => {
          reject(err);
        });
    });
  }

  get(url) {
    return new Promise(resolve => {
      this.http
        .get(url)
        .toPromise()
        .then(response => {
          resolve(response.json());
        });
    });
  }
}
