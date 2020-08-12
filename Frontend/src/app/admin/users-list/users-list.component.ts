import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../services/http.service';
import { ShareService } from '../../services/share.service';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.css']
})
export class UsersListComponent implements OnInit {

  constructor(private api: HttpService, private share: ShareService) { }

  search_text;
  find_users = [];
  selectID = 0;

  ngOnInit() {
  }

  find(){
  	if(this.search_text) {
  		this.api.postToBackend('/admin/searchUsers', { search: this.search_text }, this.share.admin_user.token).then((result: any) => {
  			this.find_users = result;
  			if(Array.isArray(result) && result.length > 0) {
  				this.selectID = result[0].userid;	
  			}
  			
  		})
  	}
  }

  doSelect(id) {
  	this.selectID = id;
  }
}
