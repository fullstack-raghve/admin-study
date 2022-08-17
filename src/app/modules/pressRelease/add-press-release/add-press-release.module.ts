import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddPressReleaseRoutingModule } from './add-press-release-routing.module';
import { AddPressReleaseComponent } from './add-press-release/add-press-release.component';
import { SharedModule } from '../../../shared/shared.module';
import { MatCardModule } from '@angular/material/card';
import { FormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
// import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { SelectAutocompleteModule } from 'mat-select-autocomplete';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';

@NgModule({
  declarations: [AddPressReleaseComponent],
  imports: [
    CommonModule,
    AddPressReleaseRoutingModule,
    SharedModule,
    MatCardModule,
    // NgxMaterialTimepickerModule,
    FormsModule,
    MatAutocompleteModule,
    NgxMatSelectSearchModule,
    SelectAutocompleteModule,
  ]
})
export class AddPressReleaseModule { }
