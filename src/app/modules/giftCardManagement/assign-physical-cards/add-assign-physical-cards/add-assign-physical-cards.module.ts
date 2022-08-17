import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddAssignPhysicalCardsRoutingModule } from './add-assign-physical-cards-routing.module';
import { AddAssignPhysicalCardsComponent } from './add-assign-physical-cards/add-assign-physical-cards.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [AddAssignPhysicalCardsComponent],
  imports: [
    CommonModule,
    AddAssignPhysicalCardsRoutingModule,SharedModule
  ]
})
export class AddAssignPhysicalCardsModule { }
