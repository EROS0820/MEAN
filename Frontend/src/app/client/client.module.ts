import { NgModule } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ClientRoutingModule } from './client-routing.module';
import { ClientLayoutComponent } from './client-layout/client-layout.component';
import { HomeComponent } from './home/home.component';
import { HeaderComponent } from './header/header.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { WithdrawalComponent } from './withdrawal/withdrawal.component';
import { Convert1Component } from './convert1/convert1.component';
import { Convert2Component } from './convert2/convert2.component';
import { PhpBtcComponent } from './php-btc/php-btc.component';
import { OpenorderComponent } from './openorder/openorder.component';
import { SuccessfulorderComponent } from './successfulorder/successfulorder.component';
import { SubheaderComponent } from './subheader/subheader.component';
import { AboutComponent } from './about/about.component';
import { FaqComponent } from './faq/faq.component';
import { RetypepasswordDirective } from '../directives/retypepassword.directive';
import { SocketService } from '../services/socket.service';
import { ChangeLCComponent } from './change-lc/change-lc.component';
import { TxtypePipe } from './txtype.pipe';
import { BalancetypePipe } from './balancetype.pipe';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LastConvertComponent } from './last-convert/last-convert.component';
import { RewardComponent } from './reward/reward.component';
import { TxhistoryComponent } from './txhistory/txhistory.component';
import { Convert1formComponent } from './convert1form/convert1form.component';
import { Convert2formComponent } from './convert2form/convert2form.component';
import { HowItWorksComponent } from './how-it-works/how-it-works.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { CryptoBazaarComponent } from './crypto-bazaar/crypto-bazaar.component';
import { AddFundComponent } from './add-fund/add-fund.component';
import { BazaarHomeComponent } from './bazaar/bazaar-home/bazaar-home.component';
import { PreCheckoutOrdersComponent } from './bazaar/pre-checkout-orders/pre-checkout-orders.component';
import { OpenOrdersComponent } from './bazaar/open-orders/open-orders.component';
import { UnclaimedOrdersComponent } from './bazaar/unclaimed-orders/unclaimed-orders.component';
import { ClaimedOrdersComponent } from './bazaar/claimed-orders/claimed-orders.component';
import { IndirectSavingsComponent } from './bazaar/indirect-savings/indirect-savings.component';
import { PersonalAgentSavingsComponent } from './bazaar/personal-agent-savings/personal-agent-savings.component';
import { PromoItemsComponent } from './bazaar/promo-items/promo-items.component';
import { TopRewardsComponent } from './bazaar/top-rewards/top-rewards.component';
import { FileUploadModule } from 'ng2-file-upload';
import { DataTablesModule } from 'angular-datatables';
import { BazaarProductComponent } from './bazaar/bazaar-product/bazaar-product.component';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { BazaarProductEditComponent } from './bazaar/bazaar-product-edit/bazaar-product-edit.component';
import { DebounceClickDirective } from './debounce-click.directive';
import { CountdownModule } from 'ngx-countdown';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { RefillableProductComponent } from './bazaar/refillable-product/refillable-product.component';
import { ChequeBarrowerComponent } from './bazaar/cheque-barrower/cheque-barrower.component';
import { ChequeLedgerComponent } from './bazaar/cheque-ledger/cheque-ledger.component';
import { NavDashboardComponent } from './nav-dashboard/nav-dashboard.component';
import { BinarySellerComponent} from './binary-seller/binary-seller.component';
import {  MatDividerModule} from '@angular/material/divider';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatListModule } from '@angular/material/list';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FileUploadComponent } from './file-upload/file-upload.component';
import { ProgressComponent } from './progress/progress.component';
import { DialogEditProductDialogComponent } from './dialog-edit-product-dialog/dialog-edit-product-dialog.component';
import { DialogConfirmationComponent } from './dialog-confirmation/dialog-confirmation.component';
import { GenealogyTreeComponent } from './genealogy-tree/genealogy-tree.component';
import {MatCardModule} from "@angular/material/card";
import { PreOrderComponent } from './pre-order/pre-order.component';
import { SellerComponent } from './seller/seller.component';
import { BoosterComponent } from './currency-booster/booster.component';
import {MatTableModule} from "@angular/material/table";
import { DialogBoxComponent } from './pre-order/dialog-box/dialog-box.component';
import { ModalComponent } from './referral/modal/modal.component';
import { EncashmentComponent } from './encashment/encashment.component';
import { ProductPurchasingComponent } from './product-purchasing/product-purchasing.component';
import { UnilevelComponent } from './unilevel/unilevel.component';
import { ReferralComponent } from './referral/referral.component';
import { CapitalistBrokerComponent } from './capitalist-broker/capitalist-broker.component';
import { DemoMaterialModule } from './material-module';
import { ModalChequeComponent } from './capitalist-broker/modal-cheque/modal-cheque.component';
import { SignupModalComponent } from './genealogy-tree/signup-modal/signup-modal.component';

@NgModule({
  imports: [
    CommonModule,
    ClientRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    DataTablesModule,
    Ng2SearchPipeModule,
    FileUploadModule,
    CountdownModule,
    MatButtonModule,
    MatCheckboxModule,
    MatToolbarModule,
    MatIconModule,
    MatMenuModule,
    MatSidenavModule,
    FlexLayoutModule,
    MatExpansionModule,
    MatListModule,
    MatFormFieldModule,
    MatDialogModule,
    MatInputModule,
    MatDividerModule,
    BsDatepickerModule.forRoot(),
    MatCardModule,
    MatTableModule,
    DemoMaterialModule

  ],
  declarations: [
    ClientLayoutComponent,
    HomeComponent,
    HeaderComponent,
    LoginComponent,
    RegisterComponent,
    WithdrawalComponent,
    Convert1Component,
    Convert2Component,
    PhpBtcComponent,
    OpenorderComponent,
    SuccessfulorderComponent,
    SubheaderComponent,
    AboutComponent,
    FaqComponent,
    RetypepasswordDirective,
    ChangeLCComponent,
    TxtypePipe,
    BalancetypePipe,
    DashboardComponent,
    LastConvertComponent,
    RewardComponent,
    TxhistoryComponent,
    Convert1formComponent,
    Convert2formComponent,
    HowItWorksComponent,
    ContactUsComponent,
    BoosterComponent,
    ForgotPasswordComponent,
    CryptoBazaarComponent,
    AddFundComponent,
    BazaarHomeComponent,
    PreCheckoutOrdersComponent,
    OpenOrdersComponent,
    UnclaimedOrdersComponent,
    ClaimedOrdersComponent,
    IndirectSavingsComponent,
    PersonalAgentSavingsComponent,
    PromoItemsComponent,
    TopRewardsComponent,
    BazaarProductComponent,
    BazaarProductEditComponent,
    DebounceClickDirective,
    RefillableProductComponent,
    ChequeBarrowerComponent,
    ChequeLedgerComponent,
    NavDashboardComponent,
    BinarySellerComponent,
    FileUploadComponent,
    ProgressComponent,
    DialogEditProductDialogComponent,
    DialogConfirmationComponent,
    GenealogyTreeComponent,
    PreOrderComponent,
    SellerComponent,
    DialogBoxComponent,
    EncashmentComponent,
    ProductPurchasingComponent,
    UnilevelComponent,
    ReferralComponent,
    CapitalistBrokerComponent,
    ModalComponent,
    SignupModalComponent,
    ModalChequeComponent
  ],
  entryComponents: [DialogEditProductDialogComponent,
    DialogConfirmationComponent,
    DialogBoxComponent,
    ModalComponent,
    ModalChequeComponent,
    SignupModalComponent
  ],
  exports: [
    MatButtonModule,
    MatCheckboxModule,
    MatToolbarModule,
    MatIconModule,
    MatMenuModule,
    MatSidenavModule,
    FlexLayoutModule,
    MatExpansionModule,
    MatListModule,
    
  ],
  providers: [
    SocketService, DecimalPipe
  ]
})
export class ClientModule { }
