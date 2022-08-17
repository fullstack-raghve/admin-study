import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ViewCurrencyConversionRoutingModule } from './view-currency-conversion-routing.module';
import { ViewCurrencyConversionComponent } from './view-currency-conversion/view-currency-conversion.component';
import { SharedModule } from '../../../../../shared/shared.module';
import { MatCardModule } from '@angular/material/card';
import { FormsModule }   from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
@NgModule({
  declarations: [ViewCurrencyConversionComponent],
  imports: [
    CommonModule,
    ViewCurrencyConversionRoutingModule,
    SharedModule,
    MatCardModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class ViewCurrencyConversionModule { }
