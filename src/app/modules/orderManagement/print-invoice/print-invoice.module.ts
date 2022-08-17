import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PrintInvoiceRoutingModule } from './print-invoice-routing.module';
import { PrintInvoiceComponent } from './print-invoice/print-invoice.component';
import { MatCardModule } from '@angular/material/card';
import {MatExpansionModule} from '@angular/material/expansion';
@NgModule({
  declarations: [PrintInvoiceComponent],
  imports: [
    CommonModule,
    PrintInvoiceRoutingModule,
    MatCardModule,
    MatExpansionModule
  ]
})
export class PrintInvoiceModule { }
