import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddCountryRoutingModule } from './addCountryRouting.module';
import { AddCountryComponent } from './add-country/addCountry.component';
import { SharedModule } from '../../../../../../shared/shared.module';
import { MatCardModule } from '@angular/material/card';
import {MatTableModule} from '@angular/material/table';
import {CdkTableModule} from '@angular/cdk/table';
import { FormsModule, ReactiveFormsModule }   from '@angular/forms';
import {MatAutocompleteModule} from '@angular/material/autocomplete';

@NgModule({
  declarations: [AddCountryComponent],
  imports: [
    CommonModule,
    AddCountryRoutingModule,
    SharedModule,
    MatCardModule,
    MatTableModule,
    CdkTableModule,
    FormsModule,
    ReactiveFormsModule,
    MatAutocompleteModule

  ]
})
export class AddCountryModule { }
