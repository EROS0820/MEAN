import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminLayoutComponent } from './admin-layout/admin-layout.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AppSidebarModule, AppFooterModule } from '@coreui/angular';
import { LoginComponent } from './login/login.component';
import { LogoutComponent } from './logout/logout.component';
import { OrderTableComponent } from './order-table/order-table.component';
import { BtcReceivedComponent } from './btc-received/btc-received.component';
import { BtcSentComponent } from './btc-sent/btc-sent.component';
import { UsersListComponent } from './users-list/users-list.component';
import { UserDetailComponent } from './user-detail/user-detail.component';
import { EditMultiplierComponent } from './edit-multiplier/edit-multiplier.component';
import { BazaarValueSettingsComponent } from './bazaar-value-settings/bazaar-value-settings.component';

@NgModule({
  imports: [
    CommonModule,
    AdminRoutingModule,
    AppSidebarModule,
    AppFooterModule,
    FormsModule,
  ],
  declarations: [
  AdminLayoutComponent, DashboardComponent,
  LoginComponent, LogoutComponent, OrderTableComponent,
  BtcReceivedComponent, BtcSentComponent, UsersListComponent,
  UserDetailComponent, EditMultiplierComponent, BazaarValueSettingsComponent]
})
export class AdminModule { }
