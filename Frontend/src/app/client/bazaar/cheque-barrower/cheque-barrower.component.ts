import { Component, OnInit, Input } from '@angular/core';
import {FormGroup, FormControl, Validators} from '@angular/forms';
import { HttpService } from '../../../services/http.service';
import { ShareService } from '../../../services/share.service';
import { SocketService } from '../../../services/socket.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
@Component({
  selector: 'app-cheque-barrower',
  templateUrl: './cheque-barrower.component.html',
  styleUrls: ['./cheque-barrower.component.css']
})
export class ChequeBarrowerComponent implements OnInit {

  form:FormGroup;
  @Input() btc_balance;
  @Input() lc_balance;
  @Input() lc_btc;
  public totalCheque;
  public dueAmount;
  public dueCheque;
  public undueAmount;
  public isLoading: boolean = true;
  public undueCheque;
  constructor(private api: HttpService,public share: ShareService, public socket:SocketService, public http:HttpClient) { }
  public uri = environment.backendUrl;
  public userid;
  public agentid;
  public orders;
  public sumb=0;
  public  suml=0;
  public tabledata=[];
  public chequesum=0;
  public submited:boolean= false;
  ngOnInit() {
    this.socket.connect();
  // This is for getting User Id
    this.getUserId();

    this.form= new FormGroup({
      payto:new FormControl(null,{validators:[Validators.required]}),
      btc_amount:new FormControl(null,{validators:[Validators.required]}),
      releasing_date:new FormControl(null,{validators:[Validators.required]}),
      from:new FormControl(null),
      btc_balance:new FormControl(null),
      lc_balance:new FormControl(null),
      t_btc:new FormControl(null),
      t_lc:new FormControl(null),
      agentid:new FormControl(null),
      type:new FormControl(null)
    })

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
      // console.log(this.sumb,this.suml,'ssss');

  	})
  }
  submit(){
    this.submited= true;
    if(this.form.invalid){
      console.log(this.form)
      console.log('hit')
      return;
    }
    if(this.form.value.payto == this.userid){
      return alert("You can't Pay to yourself.")
    }
    alert("You have Successfully Created Cheque");
    this.form.value.from= this.userid;
    this.form.value.t_btc=this.sumb;
    this.form.value.t_lc=this.suml;
    this.form.value.type='O';
    this.form.value.btc_balance= this.socket.btc_balance.toFixed(12);
    this.form.value.lc_balance= this.socket.lc_balance.toFixed(2);
    console.log(this.form.value);
    this.http.post(this.uri + '/barrower/',this.form.value)
    .subscribe(result=>{
      console.log(result);
      this.getTableData();
      this.submited= false;
      this.form.markAsPristine();
      this.form.markAsUntouched();
      this.form.updateValueAndValidity();
      this.form.reset();
    })
  }

  getTableData(){
    this.http.get<{status:any, response:any}>(this.uri + '/barrower')
    .subscribe(result=>{
      this.tabledata=[];
      let due=0;
      let undue=0;
      let dueamount=0;
          for (let i=0; i<result.response.length; i++){
            if( (result.response[i].from == this.userid) && !result.response[i].accepted){
              this.tabledata.push(result.response[i]);
              this.chequesum+=result.response[i].amount;
              var isLarger = new Date() < new Date(result.response[i].releasing_time);
              if(isLarger){
              due+=1;
              dueamount+=result.response[i].amount;
            }
              else
              undue+=1
            }
          }
          console.log(dueamount)
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

  delete(id){
    this.http.get<{status:any, response:any}>(this.uri + '/barrowerById/' + id)
    .subscribe(capital=>{
      console.log('result', capital.response.capitalId)
      alert("Deleted Successfully");
      console.log("deleteID", id)
      this.http.delete(this.uri + '/barrower/'+id)
      .subscribe(result=> {
        this.api.postToBackend('/updatePending', {
          _id: capital.response.capitalId,
          pending: false
        }).then(res => {
          console.log("updatedPending: ", res)
          this.getTableData();
        })
      })
    })
  }

  // this is for getting userid
  getUserId(){
    this.api.get(this.uri + '/getBazaarInfo/' + this.share.user.id).then((response: object) => {
      this.userid=response['userid'];
      this.agentid=response['agent_id'];
      console.log(this.userid);
          // This is used to get user Created Transactions
      this.getTableData();
    });
  }

}
