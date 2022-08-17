import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddCurrencyConversionRoutingModule } from './add-currency-conversion-routing.module';
import { AddCurrencyConversionComponent } from './add-currency-conversion/add-currency-conversion.component';
import { SharedModule } from '../../../../../shared/shared.module';
import { MatCardModule } from '@angular/material/card';
import { FormsModule }   from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import {MatAutocompleteModule} from '@angular/material/autocomplete';

@NgModule({
  declarations: [AddCurrencyConversionComponent],
  imports: [
    CommonModule,
    AddCurrencyConversionRoutingModule,
    SharedModule,
    MatCardModule,
    FormsModule,
    ReactiveFormsModule,
    MatAutocompleteModule
  ]
})
export class AddCurrencyConversionModule { }
