import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CreateEWalletRoutingModule } from './create-ewallet-routing.module';
import { CreateEWalletComponent } from './create-ewallet.component';
import { SharedModule } from '../../../shared/shared.module';

@NgModule({
  declarations: [CreateEWalletComponent],
  imports: [
    CommonModule,
    CreateEWalletRoutingModule,
    SharedModule
  ]
})
export class CreateEWalletModule { }
