import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EditCurrencyRoutingModule } from './edit-currency-routing.module';
import { EditCurrencyComponent } from './edit-currency/edit-currency.component';
import { SharedModule } from '../../../../../../shared/shared.module';
import { MatCardModule } from '@angular/material/card';
import { FormsModule }   from '@angular/forms';
@NgModule({
  declarations: [EditCurrencyComponent],
  imports: [
    CommonModule,
    EditCurrencyRoutingModule,
    SharedModule,
    MatCardModule,
    FormsModule
  ]
})
export class EditCurrencyModule { }
