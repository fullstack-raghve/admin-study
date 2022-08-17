import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ViewSearchGiftCardsRoutingModule } from './view-search-gift-cards-routing.module';
import { ViewSearchGiftCardsComponent } from './view-search-gift-cards/view-search-gift-cards.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatCardModule, MatTableModule, MatPaginatorModule, MatDialogModule } from '@angular/material';
import { CdkTableModule } from '@angular/cdk/table';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [ViewSearchGiftCardsComponent],
  imports: [
    CommonModule,
    ViewSearchGiftCardsRoutingModule,SharedModule,MatCardModule, MatTableModule, MatPaginatorModule, MatDialogModule ,CdkTableModule,ReactiveFormsModule
  ]
})
export class ViewSearchGiftCardsModule { }
