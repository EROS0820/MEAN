import { Injectable } from '@angular/core'
import { BitcoinService } from '../services/bitcoin.service'
import { ShareService } from '../services/share.service'
declare const Pusher: any;
const options = {
  ws_host: 'slanger1.chain.so',
  encrypted: true,
  ws_port: 443,
  wss_port: 443
};

@Injectable({
  providedIn: 'root'
})
export class PusherService {

  myevents:any = [];
  pusher:any = false;
  blockchain_channel:any = false;

  constructor(private bitcoin: BitcoinService, private share: ShareService) { 
    // console.log(111);
    // this.pusher = new Pusher('e9f5cc20074501ca7395', options);
    // let blockchain_channel = this.pusher.subscribe('blockchain_update_doge');
    // blockchain_channel.bind('tx_update', (data) => {
    //     console.log(data);       
    //     if(data.type == "address") {
    //        if("balance_update" in this.myevents) {
    //         this.myevents.balance_update(data)
    //        }        
    //     }
    // });
  }

  on(event_name, handler) {
  	this.myevents[event_name] = handler;

  }

  listen() {
  	Pusher.host = 'slanger1.chain.so'; // our server
    Pusher.ws_port = 443; // we enforce SSL here
    Pusher.wss_port = 443; // ...

    // use the key 'e9f5cc20074501ca7395' to access our server
    // initialize our websocket client
    this.pusher = new Pusher('e9f5cc20074501ca7395', { encrypted: true, disabledTransports: ['sockjs'], disableStats: true });
    let _this = this;
    this.pusher.connection.bind('state_change', function(states) {
		if("state_change" in _this.myevents) {
			_this.myevents.state_change(states)
		}    	
    });

    let blockchain_channel = this.pusher.subscribe('address_btctest_' + this.share.user.wallet);
    
    blockchain_channel.bind('balance_update', function(data) {
     	
        if(data.type == "address") {
       		if("balance_update" in _this.myevents) {
	      		_this.myevents.balance_update(data)
		 	}      	
      	
      	}
  	});

  }
}
