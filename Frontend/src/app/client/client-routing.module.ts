import { NgModule } from '@angular/core';
import { Injectable } from '@angular/core';
import { Routes, RouterModule, CanActivate, Router } from '@angular/router';
import { ClientLayoutComponent } from './client-layout/client-layout.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { WithdrawalComponent } from './withdrawal/withdrawal.component';
import { Convert1Component } from './convert1/convert1.component';
import { Convert2Component } from './convert2/convert2.component';
import { PhpBtcComponent } from './php-btc/php-btc.component';
import { OpenorderComponent } from './openorder/openorder.component';
import { SuccessfulorderComponent } from './successfulorder/successfulorder.component';
import { AboutComponent } from './about/about.component';
import { FaqComponent } from './faq/faq.component';
import { BoosterComponent } from './currency-booster/booster.component';
import { StorageService } from '../services/storage.service';
import { TxhistoryComponent } from './txhistory/txhistory.component';
import { HowItWorksComponent } from './how-it-works/how-it-works.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { CryptoBazaarComponent } from './crypto-bazaar/crypto-bazaar.component';
import { AddFundComponent } from './add-fund/add-fund.component';
import { BazaarProductComponent } from './bazaar/bazaar-product/bazaar-product.component';
import { PreCheckoutOrdersComponent } from './bazaar/pre-checkout-orders/pre-checkout-orders.component';
import { BazaarProductEditComponent } from './bazaar/bazaar-product-edit/bazaar-product-edit.component';
import { PersonalAgentSavingsComponent } from './bazaar/personal-agent-savings/personal-agent-savings.component';
import { OpenOrdersComponent } from './bazaar/open-orders/open-orders.component';
import { BazaarHomeComponent } from './bazaar/bazaar-home/bazaar-home.component';
import { UnclaimedOrdersComponent } from './bazaar/unclaimed-orders/unclaimed-orders.component';
import { ClaimedOrdersComponent } from './bazaar/claimed-orders/claimed-orders.component';
import { PromoItemsComponent } from './bazaar/promo-items/promo-items.component';
import { TopRewardsComponent } from './bazaar/top-rewards/top-rewards.component';
import { RefillableProductComponent } from './bazaar/refillable-product/refillable-product.component';
import { ChequeBarrowerComponent } from './bazaar/cheque-barrower/cheque-barrower.component';
import { ChequeLedgerComponent } from './bazaar/cheque-ledger/cheque-ledger.component';
import {NavDashboardComponent} from './nav-dashboard/nav-dashboard.component';
import {BinarySellerComponent} from "./binary-seller/binary-seller.component";
import {GenealogyTreeComponent} from "./genealogy-tree/genealogy-tree.component";
import {PreOrderComponent} from "./pre-order/pre-order.component";
import {SellerComponent} from "./seller/seller.component";
import {EncashmentComponent} from "./encashment/encashment.component"
import {ProductPurchasingComponent} from "./product-purchasing/product-purchasing.component"
import {UnilevelComponent} from "./unilevel/unilevel.component"
import {ReferralComponent} from "./referral/referral.component"
import {CapitalistBrokerComponent} from "./capitalist-broker/capitalist-broker.component"

@Injectable()
export class Guard implements CanActivate {
	constructor(private storage: StorageService, private router: Router) { }
	canActivate() {
		if (!this.storage.getUser() /* check user logged or not */) {
			this.router.navigate(['/login']);
			return false;
		}
		return true;
	}
}

const routes: Routes = [
	{
		path: '',
		component: ClientLayoutComponent,
		children: [
			{
				path: '',
				redirectTo: 'home',
				pathMatch: 'full'
			},
			{
				path: 'login',
				component: LoginComponent
			},
			{
				path: 'home',
				component: HomeComponent
			},
			{
				path: 'register',
				component: RegisterComponent
			},
			{
				path: 'register/:id',
				component: RegisterComponent
			},
			{
				path: 'dashboard',
				canActivate: [Guard],
				component: DashboardComponent
			},
			{
				path: 'withdrawal',
				canActivate: [Guard],
				component: WithdrawalComponent
			},
			{
				path: 'convert-btc-to-lc',
				canActivate: [Guard],
				component: Convert1Component
			},
			{
				path: 'convert-lc-to-btc',
				canActivate: [Guard],
				component: Convert2Component
			},
			{
				path: 'open-order',
				canActivate: [Guard],
				component: OpenorderComponent
			},
			{
				path: 'php-btc',
				canActivate: [Guard],
				component: PhpBtcComponent
			},
			{
				path: 'successful-order',
				canActivate: [Guard],
				component: SuccessfulorderComponent
			},
			{
				path: 'currency-booster',
				canActivate: [Guard],
				component: BoosterComponent
			},
			{
				path: 'txhistory',
				canActivate: [Guard],
				component: TxhistoryComponent
			},
			{
				path: 'about',
				component: AboutComponent
			},
			{
				path: 'faq',
				component: FaqComponent
			},
			{
				path: 'how',
				component: HowItWorksComponent
			},
			{
				path: 'contact',
				component: ContactUsComponent
			},
			{
				path: 'forgot',
				component: ForgotPasswordComponent
			},
			{
				path: 'cryptobazaar',
				component: CryptoBazaarComponent
			},
			{
				path: 'add-fund',
				component: AddFundComponent
			},
			{
				path: 'cryptobazaar/home/shop/:id',
				component: BazaarProductComponent
			},
			{
				path: 'cryptobazaar/home/shop/:id/product/edit/:id',
				component: BazaarProductEditComponent
			},
			{
				path: 'cryptobazaar/refillable/product/edit/:id',
				component: BazaarProductEditComponent
			},
			{
				path: 'cryptobazaar/promo/product/edit/:id',
				component: BazaarProductEditComponent
			},
			{
				path: 'cryptobazaar/home/shop/:id/precheckout',
				component: PreCheckoutOrdersComponent
			},
			{
				path: 'cryptobazaar/promo/precheckout',
				component: PreCheckoutOrdersComponent
			},
			{
				path: 'cryptobazaar/pandasavings',
				component: PersonalAgentSavingsComponent
			},
			{
				path: 'cryptobazaar/openorders',
				component: OpenOrdersComponent
      		},
      		{
				path: 'cryptobazaar/chequebarrower',
				component: ChequeBarrowerComponent
      		},
      		{
				path: 'cryptobazaar/chequeledger',
				component: ChequeLedgerComponent
			},
			{
				path: 'cryptobazaar/home',
				component: BazaarHomeComponent
			},
			{
				path: 'cryptobazaar/unclaimed',
				component: UnclaimedOrdersComponent
			},
			{
				path: 'cryptobazaar/claimed',
				component: ClaimedOrdersComponent
			},
			{
				path: 'cryptobazaar/refillable',
				component: RefillableProductComponent
			},
			{
				path: 'cryptobazaar/promo',
				component: PromoItemsComponent
			},
			{
				path: 'cryptobazaar/rewards',
				component: TopRewardsComponent
			},
      {
        path: 'nav-dashboard',
        component: NavDashboardComponent
      },
      {
        path: 'genealogy-tree',
        component: GenealogyTreeComponent
      },
      {
        path: 'pre-order',
        component: PreOrderComponent
      },
      {
        path: 'binary-seller',
        component: BinarySellerComponent
      },
      // {
      //   path: 'pro-purchasing',
      //   component: ProductPurchasingComponent
      // },
      {
        path: 'encashment',
        component: EncashmentComponent
	  },
	  {
        path: 'unilevel',
        component: UnilevelComponent
	  },
	  {
        path: 'referral',
        component: ReferralComponent
	  },
	  {
        path: 'capitalist-broker',
        component: CapitalistBrokerComponent
	  },
	  {
        path: 'product-purchasing',
        component: ProductPurchasingComponent
      },
      // {
      //   path: 'buyer',
      //   component: BuyerComponent
      // },
      {
        path: 'seller',
        component: SellerComponent
      },
      // {
      //   path: 'addictive-unilever',
      //   component: AddictiveUnileverComponent
      // }
		]
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class ClientRoutingModule { }
