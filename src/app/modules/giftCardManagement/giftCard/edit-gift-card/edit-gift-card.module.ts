import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EditGiftCardRoutingModule } from './edit-gift-card-routing.module';
import { EditGiftCardComponent } from './edit-gift-card/edit-gift-card.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [EditGiftCardComponent],
  imports: [
    CommonModule,
    EditGiftCardRoutingModule,
    SharedModule
  ]
})
export class EditGiftCardModule { }
  