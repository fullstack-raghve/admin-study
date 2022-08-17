import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SearchCorporateAccountRoutingModule } from './search-corporate-account-routing.module';
import { SearchCorporateAccountComponent } from './search-corporate-account/search-corporate-account.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatCardModule, MatTableModule, MatPaginatorModule, MatDialogModule } from '@angular/material';
import { CdkTableModule } from '@angular/cdk/table';
import { ReactiveFormsModule } from '@angular/forms';
@NgModule({
  declarations: [SearchCorporateAccountComponent],
  imports: [
    CommonModule,
    SearchCorporateAccountRoutingModule,
    SharedModule,
    MatCardModule,
    MatTableModule,
    MatPaginatorModule,
    MatDialogModule,
    CdkTableModule,
    ReactiveFormsModule
  ]
})
export class SearchCorporateAccountModule { }
