import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ContactService } from 'src/app/services/contact.service';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.css']
})
export class ContactUsComponent implements OnInit {

  angForm: FormGroup;

  constructor(private fb: FormBuilder, private cs: ContactService) {
    this.createForm();
  }

  ngOnInit() {
  }

  createForm() {
    this.angForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      title: ['', [Validators.required, Validators.minLength(7)]],
      message: ['', [Validators.required, Validators.minLength(30)]]
    });
  }

  contact(email, title, message) {
    this.cs.sendMessage(email, title, message);
    this.angForm.reset();
  }

}
