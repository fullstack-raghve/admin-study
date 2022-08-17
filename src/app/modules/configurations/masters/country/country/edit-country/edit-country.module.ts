import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EditCountryRoutingModule } from './edit-country-routing.module';
import { EditCountryComponent } from './edit-country/edit-country.component';
import { SharedModule } from '../../../../../../shared/shared.module';
import { MatCardModule } from '@angular/material/card';
import {MatTableModule} from '@angular/material/table';
import {CdkTableModule} from '@angular/cdk/table';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
@NgModule({
  declarations: [EditCountryComponent],
  imports: [
    CommonModule,
    EditCountryRoutingModule,
    SharedModule,
    MatCardModule,
    MatTableModule,
    CdkTableModule,
    MatAutocompleteModule
  ]
})
export class EditCountryModule { }
