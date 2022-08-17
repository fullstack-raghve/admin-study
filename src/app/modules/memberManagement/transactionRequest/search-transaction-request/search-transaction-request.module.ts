import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SearchTransactionRequestRoutingModule } from './search-transaction-request-routing.module';
import { SearchTransactionRequestComponent } from './search-transaction-request/search-transaction-request.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatCardModule, MatTableModule, MatPaginatorModule, MatDialogModule } from '@angular/material';
import { CdkTableModule } from '@angular/cdk/table';
import { ReactiveFormsModule } from '@angular/forms';
import { InvalidTxnViewDialogComponent } from './invalid-transaction-view-dialog/invalid-txn-view-dialog.component';
import { ReasonInvalidCommentsComponent } from './reason-invalid-comments/reason-invalid-comments.component';
import {MatAutocompleteModule} from '@angular/material/autocomplete';

@NgModule({
  declarations: [SearchTransactionRequestComponent, InvalidTxnViewDialogComponent, ReasonInvalidCommentsComponent],
  imports: [
    CommonModule,
    MatAutocompleteModule,
    SearchTransactionRequestRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    CdkTableModule,
    MatCardModule,MatTableModule,MatPaginatorModule,MatDialogModule
  ],
  entryComponents: [
    InvalidTxnViewDialogComponent,
    ReasonInvalidCommentsComponent
  ]
})
export class SearchTransactionRequestModule { }
