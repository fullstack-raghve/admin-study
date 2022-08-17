import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SearchPgTransactionRoutingModule } from './search-pg-transaction-routing.module';
import { SearchPgTransactionComponent } from './search-pg-transaction/search-pg-transaction.component';
import { MatTableModule } from '@angular/material';
import { SharedModule } from '../../../../shared/shared.module';
import { MatCardModule } from '@angular/material/card';
import { CdkTableModule } from '@angular/cdk/table';
import { MatPaginatorModule , MatInputModule} from '@angular/material';
import { ReactiveFormsModule } from '@angular/forms';
@NgModule({
  declarations: [SearchPgTransactionComponent],
  imports: [
    CommonModule,
    SearchPgTransactionRoutingModule,
    SharedModule,
    MatCardModule,
    MatTableModule,
    CdkTableModule,
    MatPaginatorModule,
    ReactiveFormsModule,
  ]
})
export class SearchPgTransactionModule { }
