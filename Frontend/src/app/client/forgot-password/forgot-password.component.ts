import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ForgotpwService } from 'src/app/services/forgotpw.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {

  angForm: FormGroup;

  constructor(private fb: FormBuilder, private router: Router, private fps: ForgotpwService) {
    this.createForm();
  }

  ngOnInit() {
  }

  createForm() {
    this.angForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  recovery(email) {
    this.fps.recovery(email);
    this.router.navigate(['/login']);
  }

}
