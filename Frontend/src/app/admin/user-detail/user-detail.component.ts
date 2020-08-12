import { Component, OnChanges, SimpleChanges, Input } from '@angular/core';
import { HttpService } from '../../services/http.service';
import { ShareService } from '../../services/share.service';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.css']
})
export class UserDetailComponent implements OnChanges {

  @Input() userid;
  
  userDetails = {};

  constructor(private api: HttpService, private share: ShareService) { }

  ngOnChanges(changes: SimpleChanges) {
  	if(changes.userid) {
  		const userid = changes.userid.currentValue;
      if(userid)
  		this.api.getToBackend('/admin/getUserDetail/' + userid, this.share.admin_user.token).then((result: any) => {
  			this.userDetails = result;
        console.log(result);
  		})
  	}
  }

}
