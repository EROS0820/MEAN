import { NgModule, Injectable } from '@angular/core';
import { Routes, RouterModule, CanActivate, Router } from '@angular/router';
import { AdminLayoutComponent } from './admin-layout/admin-layout.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './login/login.component';
import { LogoutComponent } from './logout/logout.component';
import { StorageService } from '../services/storage.service';
import { OrderTableComponent } from './order-table/order-table.component';
import { BtcReceivedComponent } from './btc-received/btc-received.component';
import { BtcSentComponent } from './btc-sent/btc-sent.component';
import { UsersListComponent } from './users-list/users-list.component';
import { EditMultiplierComponent } from './edit-multiplier/edit-multiplier.component';
import { BazaarValueSettingsComponent } from './bazaar-value-settings/bazaar-value-settings.component';

@Injectable()
export class AdminGuard implements CanActivate {
	constructor(private storage: StorageService, private router: Router) { }
	canActivate() {
		if (!this.storage.getAdminUser() /* check user logged or not */) {
			this.router.navigate(['/admin/login'] );
			return false;
		}
		return true;
	}
}

const routes: Routes = [
	{
		path: '',
		component: AdminLayoutComponent,
		canActivate: [AdminGuard],
		children: [
			{
				path: '',
				redirectTo: 'dashboard',
				pathMatch: 'full'
			},
			{
				path: 'dashboard',
				component: DashboardComponent
			},
			{
				path: 'btc-received',
				component: BtcReceivedComponent
			},
			{
				path: 'btc-sent',
				component: BtcSentComponent
			},
			{
				path: 'users-list',
				component: UsersListComponent
			},
			{
				path: 'btc-to-lc-success',
				component: OrderTableComponent,
				data: { display: 'btc-to-lc-success' }
			},
			{
				path: 'lc-to-btc-success',
				component: OrderTableComponent,
				data: { display: 'lc-to-btc-success' }
			},
			{
				path: 'all-conversion',
				component: OrderTableComponent,
				data: { display: 'all-conversion' }
			},
			{
				path: 'cancelled-conversion',
				component: OrderTableComponent,
				data: { display: 'cancelled-conversion' }
			},
			{
				path: 'open-orders',
				component: OrderTableComponent,
				data: { display: 'open-orders' }
			},
			{
				path: 'edit-multiplier',
				component: EditMultiplierComponent
			},
			{
				path: 'bazaar-value-settings',
				component: BazaarValueSettingsComponent
			}
		]
	},
	{
		path: 'login',
		component: LoginComponent
	},
	{
		path: 'logout',
		component: LogoutComponent
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class AdminRoutingModule { }
