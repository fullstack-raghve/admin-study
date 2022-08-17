import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddEventGiftingRoutingModule } from './add-event-gifting-routing.module';
import { AddEventGiftingComponent } from './add-event-gifting/add-event-gifting.component';

@NgModule({
  declarations: [AddEventGiftingComponent],
  imports: [
    CommonModule,
    AddEventGiftingRoutingModule
  ]
})
export class AddEventGiftingModule { }
