import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddCurrencyRoutingModule } from './add-currency-routing.module';
import { AddCurrencyComponent } from './add-currency/add-currency.component';
import { SharedModule } from '../../../../../../shared/shared.module';
import { MatCardModule } from '@angular/material/card';
import { FormsModule }   from '@angular/forms';
@NgModule({
  declarations: [AddCurrencyComponent],
  imports: [
    CommonModule,
    AddCurrencyRoutingModule,
    SharedModule,
    MatCardModule,
    FormsModule
  ]
})
export class AddCurrencyModule { }
