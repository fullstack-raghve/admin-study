import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EditCurrencyConversionRoutingModule } from './edit-currency-conversion-routing.module';
import { EditCurrencyConversionComponent } from './edit-currency-conversion/edit-currency-conversion.component';
import { SharedModule } from '../../../../../shared/shared.module';
import { MatCardModule } from '@angular/material/card';
import { FormsModule }   from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import {MatAutocompleteModule} from '@angular/material/autocomplete';

@NgModule({
  declarations: [EditCurrencyConversionComponent],
  imports: [
    CommonModule,
    EditCurrencyConversionRoutingModule,
    SharedModule,
    MatCardModule,
    FormsModule,
    ReactiveFormsModule,
    MatAutocompleteModule
  ]
})
export class EditCurrencyConversionModule { }
