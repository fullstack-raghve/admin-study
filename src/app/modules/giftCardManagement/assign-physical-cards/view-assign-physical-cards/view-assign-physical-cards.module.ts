import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ViewAssignPhysicalCardsRoutingModule } from './view-assign-physical-cards-routing.module';
import { ViewAssignPhysicalCardsComponent } from './view-assign-physical-cards/view-assign-physical-cards.component';
import { SharedModule } from 'src/app/shared/shared.module';
@NgModule({
  declarations: [ViewAssignPhysicalCardsComponent],
  imports: [
    CommonModule,
    ViewAssignPhysicalCardsRoutingModule,SharedModule
  ]
})
export class ViewAssignPhysicalCardsModule { }
