import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SearchKioskRoutingModule } from './search-kiosk-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatCardModule, MatTableModule, MatPaginatorModule, MatDialogModule } from '@angular/material';
import { CdkTableModule } from '@angular/cdk/table';
import { ReactiveFormsModule } from '@angular/forms';
import { SearchKioskComponent } from './search-kiosk/search-kiosk.component';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import {MatAutocompleteModule} from '@angular/material/autocomplete';




@NgModule({
  declarations: [SearchKioskComponent],
  imports: [
    CommonModule,
    SearchKioskRoutingModule,
    SharedModule,
    MatCardModule,
    MatTableModule,
    CdkTableModule,
    MatPaginatorModule,
    ReactiveFormsModule,
    MatDialogModule,
    NgxMatSelectSearchModule,
    MatAutocompleteModule
  ]
})
export class SearchKioskModule { }
