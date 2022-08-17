import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SearchSearchGiftCardRoutingModule } from './search-search-gift-card-routing.module';
import { SearchSearchGiftCardsComponent } from './search-search-gift-cards/search-search-gift-cards.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatCardModule, MatTableModule, MatPaginatorModule, MatDialogModule } from '@angular/material';
import { CdkTableModule } from '@angular/cdk/table';
import { ReactiveFormsModule } from '@angular/forms';
import {DragDropModule} from '@angular/cdk/drag-drop';
@NgModule({
  declarations: [SearchSearchGiftCardsComponent],
  imports: [
    CommonModule,
    SearchSearchGiftCardRoutingModule,SharedModule ,MatCardModule, MatTableModule, MatPaginatorModule, MatDialogModule,CdkTableModule , ReactiveFormsModule,DragDropModule
  ]
})
export class SearchSearchGiftCardModule { }
