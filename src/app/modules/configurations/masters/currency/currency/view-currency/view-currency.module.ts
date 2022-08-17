import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ViewCurrencyRoutingModule } from './view-currency-routing.module';
import { ViewCurrencyComponent } from './view-currency/view-currency.component';
import { SharedModule } from '../../../../../../shared/shared.module';
import { MatCardModule } from '@angular/material/card';
import { FormsModule }   from '@angular/forms';
@NgModule({
  declarations: [ViewCurrencyComponent],
  imports: [
    CommonModule,
    ViewCurrencyRoutingModule,
    SharedModule,
    MatCardModule,
    FormsModule
  ]
})
export class ViewCurrencyModule { }
