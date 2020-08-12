import { Component, OnInit,Input } from '@angular/core';
import { HttpService } from '../../services/http.service';
import { ShareService } from '../../services/share.service';
import { SocketService } from '../../services/socket.service';
import { CountryCurrencyPriceService } from '../../services/country-currency-price.service';
import Currency from '../../model/currency';
@Component({
  selector: 'app-successfulorder',
  templateUrl: './successfulorder.component.html',
  styleUrls: ['./successfulorder.component.css']
})
export class SuccessfulorderComponent implements OnInit {
	orders = [];
	orders_again=[];
	lcafterconversion:any;
	forecastedfee:any;
	liveprofiting:any;
	phpvalue:any;
	profitpercent:any;
	multiplier:any;
	lc_btc:any;
	btc_usd:any;
	currencyValue=52.15;
	interval: any;
	currencyBS : any;
	curCode = 'PHP';
	userid:any;
	lcbalance:any;
	lcresponse:any;
	mymarketPB: any;
	mytotalMP : any;
	performingCB : any;
	
  constructor(public api: HttpService, private share: ShareService, public socket: SocketService, private ccp: CountryCurrencyPriceService) { 
	this.userid=JSON.parse(localStorage.getItem('user'))['id'];
	console.log(this.userid)
	this.api.getToBackend('/getLcBalance/'+this.userid, this.share.user.token).then((result: any) => {
		console.log(result);
		this.lcbalance=result['value'];
	})
	  
  }
  
  ngOnInit() {
	console.log("userToken: ", this.share.user.token)
	
	this.api.getToBackend('/getEverybalance', this.share.user.token).then((response:any) => {
		this.lcresponse = response.result;
		console.log("important",this.lcresponse)
		
  	this.api.getToBackend('/getSuccessfulOrders', this.share.user.token).then((result: any) => {
		  //console.log(result);
		this.orders = result;
		console.log("result???",result);
		var self=this;
		this.orders.forEach(function (ele) {
			let tmp=[];
			
			
			tmp['lcamount']=ele.lcamount;
			tmp['rate']=ele.rate;
			tmp['btc_paid']=ele.btc_paid;

			tmp['btc_receive']=ele.btc_receive;
			tmp['type']=ele.type;
			tmp['fee']=ele.fee;
			tmp['date']=ele.date;
			tmp['lcafterconversion']=ele.lcamount-ele.fee;
			tmp['lcpreviousbalance']=self.lcbalance-tmp['lcafterconversion'];
			
			if (tmp['lcafterconversion']<tmp['lcpreviousbalance']) {
				tmp['performancestatus']="Computing Live";
				//tmp['date_end']=dateAsYYYYMMDDHHNNSS(new Date());
				
			} else {
				tmp['performancestatus']="Computation Ended";
				tmp['date_end']=dateAsYYYYMMDDHHNNSS(new Date());
			}
			// if (tmp['performancestatus']=="Computing Live") {
				console.log("multi",self.socket.multiplier)
				tmp['forecastedfee']=tmp['lcafterconversion']*self.socket.multiplier.CF;
				tmp['liveprofiting']=((tmp['lcafterconversion']-tmp['forecastedfee'])*self.socket.lc_btc-ele.btc_paid)*self.socket.btc_usd*self.currencyValue;
				console.log("lol",self.socket.btc_usd * self.socket.lc_btc * self.currencyValue)
				tmp['phpvalue']=ele.lcamount*self.socket.btc_usd * self.socket.lc_btc * self.currencyValue;
				tmp['profitpercent']=(tmp['liveprofiting']/tmp['phpvalue'])*100;
				if(ele.paid=='unpaid'){
					self.api.postToBackend('/paidrequest', {
						paid: "paid",
						_id: ele._id
					}, self.share.user.token)
					.then(result => {
					})
					.catch(err => {
						console.log(err);
					});
					self.lcresponse.forEach(function (lcrep) {
						if(lcrep.performingCB>0){
							console.log("consolelog",lcrep)
							self.api.getToBackend('/getcurrencyBS',self.share.user.token ).then((response:any) => {
								self.currencyBS = response.result[0].currencyBS;
								let amount = ele.lcamount*self.socket.btc_usd * self.socket.lc_btc * self.currencyValue * 0.27 / self.currencyBS * lcrep.performingCB;
								
								
								console.log("amount",amount,self.currencyBS)
								self.mytotalMP = lcrep.mytotalMP + amount;
								self.mymarketPB = lcrep.mymarketPB + amount;
								self.performingCB = lcrep.performingCB - amount;
								self.currencyBS = self.currencyBS - amount;
								
								self.api.postToBackend('/updatesuccessfulrecord', {
									mytotalMP:self.mytotalMP,
									performingCB: self.performingCB,
									mymarketPB: self.mymarketPB,
									userid:lcrep.userid
								}, self.share.user.token)
								.then(result => {
								})
								.catch(err => {
									console.log(err);
								});
								self.api.postToBackend('/currencyBS', {
									currencyBS: self.currencyBS
								}, self.share.user.token)
								.then(result => {
								})
								.catch(err => {
									console.log(err);
								});
							})
						}
					})
					
				}
			// } 
		
			self.orders_again.push(tmp);
			
		});
		
		console.log(this.orders_again);
	  })
	}) 
	   //this.getOrders();
  }
  getOrders() {
    this.api.getToBackend('/getSuccessfulProductsOrders', this.share.user.token).then((result: any) => {
      this.orders = result
      console.log('1111111111111111111111', result)
    })
  }

}
function dateAsYYYYMMDDHHNNSS(date): string {
	return date.getFullYear()
			  + '-' + leftpad(date.getMonth() + 1, 2)
			  + '-' + leftpad(date.getDate(), 2)
			  + ' ' + leftpad(date.getHours(), 2)
			  + ':' + leftpad(date.getMinutes(), 2)
			  + ':' + leftpad(date.getSeconds(), 2);
  }
  
  function leftpad(val, resultLength = 2, leftpadChar = '0'): string {
	return (String(leftpadChar).repeat(resultLength)
		  + String(val)).slice(String(val).length);
  }