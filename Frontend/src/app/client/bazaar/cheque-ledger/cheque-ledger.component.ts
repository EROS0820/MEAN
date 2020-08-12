import { Component, OnInit, Input } from '@angular/core';
import {FormGroup, FormControl, Validators} from '@angular/forms';
import { HttpService } from '../../../services/http.service';
import { ShareService } from '../../../services/share.service';
import { SocketService } from '../../../services/socket.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-cheque-ledger',
  templateUrl: './cheque-ledger.component.html',
  styleUrls: ['./cheque-ledger.component.css']
})
export class ChequeLedgerComponent implements OnInit {

  form:FormGroup;
  @Input() btc_balance;
  @Input() lc_balance;
  public isLoading:boolean= true;
  @Input() lc_btc;
  public totalCheque;
  public dueAmount;
  public dueCheque;
  public undueAmount;
  public undueCheque;
  constructor(private api: HttpService,public share: ShareService, public socket:SocketService, public http:HttpClient) { }
  public uri = environment.backendUrl;
  public userid;
  public chequeid;
  public orders;
  public search;
  public sumb=0;
  public  suml=0;
  public tabledata;
  public table;
  public chequesum=0;
  public submited:boolean= false;
  ngOnInit() {

    this.socket.connect();
    this.getUserId();
// this id to get successfull order
    this.api.getToBackend('/getSuccessfulOrders', this.share.user.token).then((result: any) => {
      this.orders = result
      // console.log(this.orders)
        let date= new Date();

        var days=7; // Days you want to subtract
        var last = new Date(date.getTime() - (days * 24 * 60 * 60 * 1000));
        var day =last.getDate();
        var month=last.getMonth()+1;
        var year=last.getFullYear();
// console.log('day', day,month,year)
      for (let i=0; i<this.orders.length;i++){
        let orderdate= this.orders[i].date.split('T')[0].split('-')
        //  console.log(orderdate);

          if(this.orders[i].type == 'ltob' && orderdate[0]==year && orderdate[1]>=month && orderdate[2]>=day){
            this.suml=this.suml+this.orders[i].lcamount;
          }
          if(this.orders[i].type == 'btol' && orderdate[0]==year && orderdate[1]==month && orderdate[2]>=day){
            this.sumb=this.sumb+this.orders[i].btc_paid;
          }
      }
      this.btc_balance=this.socket.btc_balance;
      this.lc_balance= this.socket.lc_balance;
      console.log(this.lc_balance);
      this.isLoading= false;
  	})
  }

  getTableData(userid){
    this.http.get<{status:any, response:any}>(this.uri + '/ledger/'+userid)
    .subscribe(result=>{
      this.tabledata=[];
          console.log(result);
          this.tabledata=result.response;
          this.table=this.tabledata;
          let due=0;
          let undue=0;
          let dueamount=0;
          for (let i=0;i<this.tabledata.length;i++){
              this.chequesum+=this.tabledata[i].amount;
              var isLarger = new Date() < new Date(result.response[i].releasing_time);
              if(isLarger){
              due+=1;
              dueamount+=result.response[i].amount;
            }
              else{
              undue+=1
            }
          }
          this.btc_balance=this.socket.btc_balance;
          this.lc_balance= this.socket.lc_balance;
          this.dueAmount = dueamount;
          this.dueCheque= due;
          this.undueAmount= this.chequesum-this.dueAmount;
          this.undueCheque=undue
          this.totalCheque= due+undue;
          this.tabledata=this.tabledata.reverse();
          console.log(this.tabledata);
          this.isLoading = false;
    })
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

  chequedetail(id){
    this.chequeid=id;
    console.log(this.chequeid);
  }

  acceptCheque(){
    this.http.get<{status:any, response:any}>(this.uri + '/barrowerById/' + this.chequeid)
    .subscribe(capital=>{
      console.log('result', capital)
      this.api.get(this.uri + '/getCoinBalance/' + capital.response.from).then((response) => {
        console.log("response: ", response['value'])
        this.api.postToBackend('/putCoinBalance', {userid: capital.response.from, phpBalance: response['value'].php + capital.response.amount, btcBalance: response['value'].brc}).then((response) => {
          console.log("hhh", response)
        });
      });
      this.api.postToBackend('/deleteCapital', {
        _id: capital.response.capitalId,
      }).then(res => {
        console.log("deleteCapital: ", res)
      })
    })
    this.http.get(this.uri + '/acceptbarrower/'+this.chequeid)
    .subscribe(result=> {
      alert("Accepted Successfully");
      this.getTableData(this.userid);
    })
  }

  declineCheque(){
    this.http.get<{status:any, response:any}>(this.uri + '/barrowerById/' + this.chequeid)
    .subscribe(capital=>{
      console.log('result', capital.response)
      this.api.postToBackend('/updatePending', {
        _id: capital.response.capitalId,
        pending: false
      }).then(res => {
        console.log("updatedPending: ", res)
      })
    })
    alert("Declined Successfully");
    this.http.get(this.uri + '/declinebarrower/'+this.chequeid)
    .subscribe(result=> {
      this.getTableData(this.userid);
    })
  }

  getUserId(){
        // this is for getting userid
        this.api.get(this.uri + '/getBazaarInfo/' + this.share.user.id).then((response: object) => {
          this.userid=response['userid']
          this.getTableData(this.userid);
        });
  }

}
