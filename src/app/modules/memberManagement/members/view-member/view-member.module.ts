import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ViewMemberRoutingModule } from './view-member-routing.module';
import { ViewMemberComponent } from './view-member/view-member.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatCardModule, MatTableModule, MatPaginatorModule, MatDialogModule, MatTabsModule } from '@angular/material';
import { CdkTableModule } from '@angular/cdk/table';
import { ReactiveFormsModule } from '@angular/forms';
import { EditProfileDialogComponent } from './edit-profile-dialog/edit-profile-dialog.component';
import { AddTransactionDialogComponent } from './add-transaction-dialog/add-transaction-dialog.component';
import { EditMemberDialogComponent } from './edit-member-details-dialog/edit-member-dialog.component';
import { SendVerificationDialogComponent } from './send-email-verifcation-dialog/send-email-verifcation-dialog.component';
// import { TransactionDialogComponent } from './transaction-dialog/transaction-dialog.component';
import { ExtendedExpiryDialogComponent } from './extended-expiry-dialog/extended-expiry-dialog.component';
import { SendOtpDialogComponent } from './send-otp-dialog/send-otp-dialog.component';
import { ChangeHistoryDialogComponent } from './change-history-dialog/change-history-dialog.component';
import { SearchTransactionIdDialogComponent } from './search-transaction-id-dialog/search-transaction-id-dialog.component';
import { ProgressComponent } from './progress/progress.component';
import { MalihuScrollbarModule } from 'ngx-malihu-scrollbar';
import { ManualTxnViewDialogComponent } from './manual-txn-view-dialog/manual-txn-view-dialog.component';
import {AddEnquiryDialogComponent} from './add-enquiry-dialog/add-enquiry-dialog.component';
import { SendEmailVerificationErrorComponent } from './send-email-verification-error/send-email-verification-error.component';
import { SelectTransactionDialogComponent } from './select-transaction-dialog/select-transaction-dialog.component';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { MemberEwalletDetailsComponent } from './member-ewallet-details/member-ewallet-details.component';

@NgModule({
  declarations: [ViewMemberComponent,
    EditProfileDialogComponent,
    AddTransactionDialogComponent,
    EditMemberDialogComponent,
    SendVerificationDialogComponent,
    SendOtpDialogComponent,
    ChangeHistoryDialogComponent,
    // EditMemberDialogComponent,
    // SendEmailVerificationDialogComponent,
    // TransactionDialogComponent,
    ExtendedExpiryDialogComponent,
    SearchTransactionIdDialogComponent,
    ProgressComponent,
    ManualTxnViewDialogComponent,
    AddEnquiryDialogComponent,
    SendEmailVerificationErrorComponent,
    SelectTransactionDialogComponent,
    MemberEwalletDetailsComponent
  ],
  imports: [
    CommonModule,
    ViewMemberRoutingModule,
    SharedModule,
    MatCardModule,
    MatTableModule,
    CdkTableModule,
    MatPaginatorModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatTabsModule,
    MalihuScrollbarModule,
    MatAutocompleteModule,
  ],
  
  entryComponents: [
    EditProfileDialogComponent,
    AddTransactionDialogComponent,
    EditMemberDialogComponent,
    SendVerificationDialogComponent,
    SendOtpDialogComponent,
    ChangeHistoryDialogComponent,
    ProgressComponent,
    ExtendedExpiryDialogComponent,
    // EditMemberDialogComponent,
    // TransactionDialogComponent,
    // SendEmailVerificationDialogComponent,
    SearchTransactionIdDialogComponent,
    ManualTxnViewDialogComponent,
    AddEnquiryDialogComponent,
    SendEmailVerificationErrorComponent,
    SelectTransactionDialogComponent
  ],
})
export class ViewMemberModule { }
