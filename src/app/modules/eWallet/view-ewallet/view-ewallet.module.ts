import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ViewEWalletRoutingModule } from './view-ewallet-routing.module';
import { ViewEWalletComponent } from './view-ewallet.component';
import { SharedModule } from '../../../shared/shared.module';
import { MatCardModule } from '@angular/material/card';

@NgModule({
  declarations: [ViewEWalletComponent],
  imports: [
    CommonModule,
    ViewEWalletRoutingModule,
    SharedModule,
    MatCardModule
  ]
})
export class ViewEWalletModule { }
