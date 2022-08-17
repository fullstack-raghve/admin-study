import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule, MatTableModule, MatPaginatorModule, MatDialogModule } from '@angular/material';
import { CdkTableModule } from '@angular/cdk/table';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { SearchRecipientRoutingModule } from './search-recipient-routing.module';
import { SearchRecipientComponent } from './search-recipient/search-recipient.component';

@NgModule({
  declarations: [SearchRecipientComponent,],
  imports: [
    CommonModule,
    SearchRecipientRoutingModule,
    MatCardModule,MatTableModule,MatPaginatorModule,MatDialogModule,CdkTableModule,ReactiveFormsModule,SharedModule,SearchRecipientRoutingModule
  ]
})
export class SearchRecipientModule { }
