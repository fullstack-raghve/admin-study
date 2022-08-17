import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EditEWalletRoutingModule } from './edit-ewallet-routing.module';
import { EditEWalletComponent } from './edit-ewallet.component';
import { SharedModule } from '../../../shared/shared.module';

@NgModule({
  declarations: [EditEWalletComponent],
  imports: [
    CommonModule,
    EditEWalletRoutingModule,
    SharedModule
  ]
})
export class EditEWalletModule { }
