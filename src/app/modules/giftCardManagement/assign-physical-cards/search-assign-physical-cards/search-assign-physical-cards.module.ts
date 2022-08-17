import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SearchAssignPhysicalCardsRoutingModule } from './search-assign-physical-cards-routing.module';
import { SearchAssignPhysicalCardsComponent } from './search-assign-physical-cards/search-assign-physical-cards.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatCardModule, MatTableModule, MatPaginatorModule, MatDialogModule } from '@angular/material';
import { CdkTableModule } from '@angular/cdk/table';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import {MatAutocompleteModule} from '@angular/material/autocomplete';

@NgModule({
  declarations: [SearchAssignPhysicalCardsComponent],
  imports: [
    CommonModule,NgxMatSelectSearchModule,MatAutocompleteModule,
    SearchAssignPhysicalCardsRoutingModule,SharedModule,MatCardModule, MatTableModule, MatPaginatorModule, MatDialogModule,CdkTableModule,ReactiveFormsModule
  ]
})
export class SearchAssignPhysicalCardsModule { }
