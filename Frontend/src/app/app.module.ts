import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { routes } from './app.routes';
import { Guard } from './client/client-routing.module';
import { AdminGuard } from './admin/admin-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { ToastrModule } from 'ngx-toastr';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(routes),
    // tslint:disable-next-line: deprecation
    HttpModule,
    HttpClientModule,
    FormsModule,
    SimpleNotificationsModule.forRoot(),
    ToastrModule.forRoot(),
  ],
  providers: [Guard, AdminGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
