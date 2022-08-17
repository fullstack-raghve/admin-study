import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { EditCorporateAccountRoutingModule } from './edit-corporate-account-routing.module';
import { EditCorporateAccountComponent } from './edit-corporate-account/edit-corporate-account.component';
import { EditHistoryDialogComponent } from './edit-history-dialog/edit-history-dialog.component';
import { MatTableModule } from '@angular/material'  
import { MatPaginatorModule } from '@angular/material';
@NgModule({
  declarations: [EditCorporateAccountComponent,EditHistoryDialogComponent],
  imports: [
    CommonModule,
    EditCorporateAccountRoutingModule,
    SharedModule,
    MatTableModule,
    MatPaginatorModule
  ],
  entryComponents: [EditHistoryDialogComponent]
})
export class EditCorporateAccountModule { }
