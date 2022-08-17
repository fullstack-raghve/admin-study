import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddSearchGiftCardsRoutingModule } from './add-search-gift-cards-routing.module';
import { AddSearchGiftCardsComponent } from './add-search-gift-cards/add-search-gift-cards.component';
import { SharedModule } from '../../../../shared/shared.module';
import { MatCardModule, MatTableModule, MatPaginatorModule, MatDialogModule } from '@angular/material';
import { CdkTableModule } from '@angular/cdk/table';
import { ReactiveFormsModule } from '@angular/forms';
// import { AddSearchGiftCardCardStatusDialogComponent } from './add-search-gift-card-card-status-dialog/add-search-gift-card-card-status-dialog.component';

@NgModule({
  declarations: [AddSearchGiftCardsComponent, ],
  imports: [
    CommonModule,
    AddSearchGiftCardsRoutingModule, SharedModule, MatCardModule, MatTableModule, MatPaginatorModule, MatDialogModule, CdkTableModule, ReactiveFormsModule
  ]
})
export class AddSearchGiftCardsModule { }
