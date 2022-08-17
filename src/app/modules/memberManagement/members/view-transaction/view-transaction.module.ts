
import { NgModule,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ViewTransactionRoutingModule } from './view-transaction-routing.module';
import { ViewTransactionComponent } from './view-transaction/view-transaction.component';

import {
  MatPaginator, MatSort, MatTable, MatTableModule, MatTabHeader,
  MatHeaderRow, MatHeaderCell, MatHeaderCellDef, MatHeaderRowDef,
  MatSortHeader, MatRow, MatRowDef,  MatCell, MatCellDef,MatTabsModule
} from '@angular/material';
import {MatDialogModule} from '@angular/material/dialog';
import { SharedModule } from '../../../../shared/shared.module';
import { MatCardModule } from '@angular/material/card';
import {CdkTableModule} from '@angular/cdk/table';
import { MatPaginatorModule , MatInputModule} from '@angular/material';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule }   from '@angular/forms';
import { TransactionFeedbackComponent } from './transaction-feedback/transaction-feedback.component';
// import { NgxStarRatingModule } from 'ngx-star-rating';



@NgModule({
  declarations: [ViewTransactionComponent, TransactionFeedbackComponent],
  imports: [
    CommonModule,
    ViewTransactionRoutingModule,
    SharedModule,
    MatCardModule,
    // NgxStarRatingModule,
    MatTableModule,
    CdkTableModule,
    MatPaginatorModule,
    ReactiveFormsModule,
    FormsModule,
    MatDialogModule,
    MatTabsModule
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
  entryComponents: [
    TransactionFeedbackComponent
  ],
  // bootstrap:    [ AppComponent ]

})
export class ViewTransactionModule { }
