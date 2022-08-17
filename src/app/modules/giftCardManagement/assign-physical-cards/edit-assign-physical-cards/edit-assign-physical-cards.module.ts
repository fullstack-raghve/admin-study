import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EditAssignPhysicalCardsRoutingModule } from './edit-assign-physical-cards-routing.module';
import { EditAssignPhysicalCardsComponent } from './edit-assign-physical-cards/edit-assign-physical-cards.component';

@NgModule({
  declarations: [EditAssignPhysicalCardsComponent],
  imports: [
    CommonModule,
    EditAssignPhysicalCardsRoutingModule
  ]
})
export class EditAssignPhysicalCardsModule { }
