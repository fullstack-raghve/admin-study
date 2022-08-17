import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddGiftCardRoutingModule } from './add-gift-card-routing.module';
import { AddGiftCardComponent } from './add-gift-card/add-gift-card.component';
import { SharedModule } from 'src/app/shared/shared.module';
@NgModule({
  declarations: [AddGiftCardComponent],
  imports: [
    CommonModule,
    AddGiftCardRoutingModule,
    SharedModule
  ]
})
export class AddGiftCardModule { }
