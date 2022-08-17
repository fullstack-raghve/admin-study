import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchGiftingRoutingModule } from './search-gifting-routing.module';
import { SearchGiftingComponent } from './search-gifting/search-gifting.component';
import { MatCardModule, MatTableModule, MatPaginatorModule, MatDialogModule } from '@angular/material';
import { CdkTableModule } from '@angular/cdk/table';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
@NgModule({
  declarations: [SearchGiftingComponent],
  imports: [
    CommonModule,
    SearchGiftingRoutingModule,
    SharedModule,
    MatCardModule,
    MatTableModule,
    MatPaginatorModule,
    MatDialogModule,
    CdkTableModule,
    ReactiveFormsModule
  ]
})
export class SearchGiftingModule { }
