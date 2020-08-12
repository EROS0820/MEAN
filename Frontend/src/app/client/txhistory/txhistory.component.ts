import { Component, OnInit, Input } from '@angular/core';
import {FormGroup, FormControl, Validators} from '@angular/forms';
import { HttpService } from '../../services/http.service';
import { ShareService } from '../../services/share.service';
import { SocketService } from '../../services/socket.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { sendRequest } from 'selenium-webdriver/http';

@Component({
  selector: 'app-txhistory',
  templateUrl: './txhistory.component.html',
  styleUrls: ['./txhistory.component.css']
})
export class TxhistoryComponent implements OnInit {

  @Input() btc_balance;
  @Input() lc_balance;

  public uri = environment.backendUrl;
  public userarray=[];
  public userid;
  public orders;
  public sumb=0;
  public search;
  public  suml=0;
  public tabledata;
  public table;
  public chequesum=0;
  constructor(private api: HttpService,public share: ShareService, public socket:SocketService, public http:HttpClient) { }
  transactions = [];
  overall_received = 0;
  overall_sent = 0;
  overall_reward = 0;
  display = [];
  type;
  referred_count = 0;

  crypto_check: boolean = false;
  ngOnInit() {
    this.socket.connect();
        // this is for getting userid
        this.api.get(this.uri + '/getBazaarInfo/' + this.share.user.id).then((response: object) => {
          this.userid=response['userid']
          console.log("userID", this.userid)
          this.getTableData(this.userid);
          console.log(this.btc_balance,'nswkdwns');
        });
  	this.type = 'all';
  	this.api.getToBackend('/getAllTransactions', this.share.user.token).then((response:any) => {
  		this.transactions = response;
  		this.display = this.transactions;
  		response.map(transaction => {
  			if(transaction.type == 'sent') {
  				this.overall_sent += transaction.amount;
  			}
  			if(transaction.type == 'received') {
  				this.overall_received += transaction.amount;
  			}
        if(transaction.type == 'reward') {
          this.overall_reward += transaction.amount;
        }
  		})
  	})
    this.api.getToBackend('/getReferredCount', this.share.user.token).then((response:any) => {
      this.referred_count = response.result;
    })
  }

  getTableData(userid){
    console.log('hit')
    this.http.get<{status:any, response:any}>(this.uri + '/txhistory/'+userid)
    .subscribe(result=>{
          console.log("result++", result);
          this.tabledata=result.response;
          this.table=this.tabledata.reverse();
          for (let i=0;i<this.tabledata.length;i++){
            this.userarray.push(this.tabledata[i].from);
            console.log(this.btc_balance,'nswkdwns123');
            console.log(this.tabledata);
        }
        let uniqueArray, arrayfun;
        arrayfun =function uniq(a) {
          var seen = {};
          return a.filter(function(item) {
              return seen.hasOwnProperty(item) ? false : (seen[item] = true);
          });
      }
      uniqueArray=arrayfun(this.userarray);
      this.getBTCBalance(uniqueArray);
        this.btc_balance=this.socket.btc_balance;
    })
  }

  show(type) {
  	this.type = type;
  	this.display = this.transactions.filter(transaction => {
  		if(type == 'all') return true;
  		return transaction.type == type;
    })
    this.crypto_check=false;
  }

  crypto(){
    this.type='null';
    this.crypto_check=true;
  }
  searchcheque(){
    if(this.search.toString().trim()!='')
    {
          this.tabledata=this.table.filter(i => i.cheque_code.toLowerCase().indexOf(this.search.toString().trim()) != -1)

    }
   else{
     this.tabledata=this.table;
   }
  }

  increaseBTC(reciver, sender, amount, agentid, agentamount, chequeid){
    const user={
      reciverid:reciver,
      senderid:sender,
      amount:amount,
      agentid:agentid,
      agentamount:agentamount,
      chequeid:chequeid
    }
    this.http.post(this.uri + '/increase_crypto_btc',user)
    .subscribe(result=>{
      console.log(result);
    })
  }
getBTCBalance(userlist){
  const user={
    userarray:userlist
  }
  this.http.post<{status:any,response:any}>(this.uri +'/userlist',user)
  .subscribe(result=>{
    console.log(result,'user list array btc bal..');
    for (let i=0; i<this.tabledata.length;i++){
      for(let j=0;j<result.response.length;j++){
        console.log(result.response[j].userid,'testing user');
        if(this.tabledata[i].from==result.response[j].userid){
          this.tabledata[i].btc_balance=result.response[j].btc;
          break;
        }
      }
    }

    for (let i=0;i<this.tabledata.length;i++){
      var isLarger = new Date() >= new Date(this.tabledata[i].releasing_time);
      if(isLarger){
        if(this.tabledata[i].btc_balance<=0){
        this.tabledata[i].statuss='On Deduction';
        if(!this.tabledata[i].status)
        this.decreaseBTC(this.tabledata[i].from,this.tabledata[i].amount, this.tabledata[i]._id);
      }else{
          this.tabledata[i].statuss="Paid";
          if(!this.tabledata[i].status)
          this.increaseBTC(this.tabledata[i].payto,this.tabledata[i].from ,this.tabledata[i].amount,this.tabledata[i].agent_id, this.tabledata[i].agent_profit, this.tabledata[i]._id);
        }
      }
      else
      this.tabledata[i].statuss='Waiting';
  }
  })
}
  decreaseBTC(sender, amount,chequeid){
    const user={
      senderid:sender,
      amount:amount,
      chequeid:chequeid
    }

    this.http.post(this.uri + '/decrease_crypto_btc',user)
    .subscribe(result=>{
      console.log(result);
    })
  }
}
