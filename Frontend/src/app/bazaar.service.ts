import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BazaarService {

  uri = environment.backendUrl;
  constructor(private http: HttpClient) { }

  async getBazaars(country) {
    const res = await this.http.get(`${this.uri}/getBazaars/${country}`).toPromise();
    return res;
  }

  async getBazaarProducts(userid) {
    const res = await this.http.get(`${this.uri}/getBazaarProducts/${userid}`).toPromise();
    return res;
  }

  async getPreCheckoutInfo(userid) {
    const res = await this.http.get(`${this.uri}/getPreCheckoutInfo/${userid}`).toPromise();
    return res;
  }
}
