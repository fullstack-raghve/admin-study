import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SearchGiftCardRoutingModule } from './search-gift-card-routing.module';
import { SearchGiftCardComponent } from './search-gift-card/search-gift-card.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatCardModule, MatTableModule, MatPaginatorModule, MatDialogModule } from '@angular/material';
import { CdkTableModule } from '@angular/cdk/table';
import { ReactiveFormsModule } from '@angular/forms';
@NgModule({
  declarations: [SearchGiftCardComponent],
  imports: [
    CommonModule,
    SearchGiftCardRoutingModule,
    SharedModule,
    MatCardModule,MatTableModule,MatPaginatorModule,MatDialogModule,
    CdkTableModule,
    ReactiveFormsModule
  ]
})
export class SearchGiftCardModule { }
