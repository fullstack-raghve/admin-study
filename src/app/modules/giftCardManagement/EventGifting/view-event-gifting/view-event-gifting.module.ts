import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ViewEventGiftingRoutingModule } from './view-event-gifting-routing.module';
import { ViewEventGiftingComponent } from './view-event-gifting/view-event-gifting.component';

@NgModule({
  declarations: [ViewEventGiftingComponent],
  imports: [
    CommonModule,
    ViewEventGiftingRoutingModule
  ]
})
export class ViewEventGiftingModule { }
