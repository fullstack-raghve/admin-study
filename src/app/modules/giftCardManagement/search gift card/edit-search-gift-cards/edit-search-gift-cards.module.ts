import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditSearchGiftCardsRoutingModule } from './edit-search-gift-cards-routing.module';
import { EditSearchGiftCardsComponent } from './edit-search-gift-cards/edit-search-gift-cards.component';
import { SharedModule } from '../../../../../app/shared/shared.module';
import { MatCardModule, MatTableModule, MatPaginatorModule, MatDialogModule } from '@angular/material';
import { CdkTableModule } from '@angular/cdk/table';
import { ReactiveFormsModule } from '@angular/forms';
// import { EditSearchGiftCardRedeemedDialogComponent } from './edit-search-gift-cards/edit-search-gift-card-redeemed-dialog/edit-search-gift-card-redeemed-dialog.component';

@NgModule({
  declarations: [EditSearchGiftCardsComponent, ],
  imports: [
    CommonModule,
    EditSearchGiftCardsRoutingModule,SharedModule,MatCardModule, MatTableModule, MatPaginatorModule, MatDialogModule,CdkTableModule,ReactiveFormsModule
  ]
})
export class EditSearchGiftCardsModule { }
