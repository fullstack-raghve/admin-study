import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SearchComboRoutingModule } from './search-combo-routing.module';
import { SearchComboComponent } from './search-combo/search-combo.component';
import { SharedModule } from '../../../../shared/shared.module';
import { CdkTableModule } from '@angular/cdk/table';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { MatCardModule, MatTableModule, MatPaginatorModule, MatDialogModule } from '@angular/material';
@NgModule({
  declarations: [SearchComboComponent],
  imports: [
    CommonModule,
    SearchComboRoutingModule,
    SharedModule,
    MatCardModule,
    MatTableModule,
    CdkTableModule,
    MatPaginatorModule,
    ReactiveFormsModule,
    NgxMatSelectSearchModule,
    MatAutocompleteModule,
    MatDialogModule,
  ]
})
export class SearchComboModule { }
