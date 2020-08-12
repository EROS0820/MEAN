import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {map} from "rxjs/operators";
import {HttpService} from "../http.service";
@Injectable({
  providedIn: 'root'
})
export class UnilevelService {
  constructor(private http: HttpClient,
              private httpService:HttpService) { }
//   setOrder(url, data) {
//     return this.http.post(this.httpService.initUrl(url), data)
//     .pipe(map(res=> {return res}));
//   }
//   setRequested(userid, column) {
//     return this.http.post(this.httpService.initUrl('/setRequested'), {userid: userid, column: column})
//     .pipe(map(res => {return res;}));
//   }
//   addEncashment(userid, type, amount, receivable_lc, total_lc) {
//     return this.http.post(this.httpService.initUrl('/encashment/create'), {user_id: userid, type: type, amount: amount, receivable_lc: receivable_lc, total_lc: total_lc})
//     .pipe(map(res => {return res;}));
//   }
//   getEncashment(userid) {
//     return this.http.get(this.httpService.initUrl('/encashment/getEncashment/' + userid))
//       .pipe(map(res => {return res;}));
//   }
  setProfit(userid, ita, name, add_id, type) {
    return this.http.post(this.httpService.initUrl('/unilevel/setProfit'), {user_id: userid, ita: ita, name: name, add_id: add_id, type: type})
    .pipe(map(res => {return res;}));
  }
  getUnilevel(userid) {
    return this.http.get(this.httpService.initUrl('/unilevel/getUnilevel/' + userid))
      .pipe(map(res => {return res;}));
  }
}
