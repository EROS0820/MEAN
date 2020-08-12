import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../services/http.service';
import { ShareService } from '../../services/share.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-edit-multiplier',
  templateUrl: './edit-multiplier.component.html',
  styleUrls: ['./edit-multiplier.component.css']
})
export class EditMultiplierComponent implements OnInit {

  constructor(private api: HttpService, private share: ShareService, private toastr: ToastrService) { }

  ASmulti = 0;
  CFmulti = 0;
  showSuccess = false;
  success = { message: '' };
  showError = false;
  error = { message: '' };

  ngOnInit() {
    this.api.getToBackend('/admin/getMultiplier', this.share.admin_user.token).then((response: any) => {
      // console.log(response);
      this.ASmulti = response.AS;
      this.CFmulti = response.CF;
    });
  }

  save() {
    this.showError = false;
    this.showSuccess = false;
    // tslint:disable-next-line: max-line-length
    this.api.postToBackend('/admin/setMultiplier', { AS: this.ASmulti, CF: this.CFmulti }, this.share.admin_user.token).then((response: any) => {
      if (response.status === 'success') {
        this.success.message = 'Successfully saved!';
        this.toastr.info('Multiplier Setting Success!', 'INFO');
        this.showSuccess = true;
      }
      if (response.status === 'error') {
        this.showError = true;
        this.error.message = response.payload;
        this.toastr.error('Invalid Value!', 'ERROR');
      }
      console.log(response);
    });
  }

}
