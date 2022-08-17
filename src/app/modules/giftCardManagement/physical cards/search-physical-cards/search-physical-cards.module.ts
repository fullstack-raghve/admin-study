import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatCardModule, MatTableModule, MatPaginatorModule, MatDialogModule } from '@angular/material';
import { CdkTableModule } from '@angular/cdk/table';
import { ReactiveFormsModule } from '@angular/forms';
import { SearchPhysicalCardsRoutingModule } from './search-physical-cards-routing.module';
import { SearchPhysicalCardsComponent } from './search-physical-cards/search-physical-cards.component';

@NgModule({
  declarations: [SearchPhysicalCardsComponent],
  imports: [
    CommonModule,
    SearchPhysicalCardsRoutingModule,
    SharedModule, MatCardModule, MatTableModule, MatPaginatorModule, MatDialogModule, CdkTableModule, ReactiveFormsModule
  ]
})
export class SearchPhysicalCardsModule { }
