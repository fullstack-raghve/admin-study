import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddPartnerRoutingModule } from './add-partner-routing.module';
import { AddPartnerComponent } from './add-partner/add-partner.component';
import { SharedModule } from '../../../../../shared/shared.module';
import { MatCardModule } from '@angular/material/card';
import { FormsModule }   from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [AddPartnerComponent],
  imports: [
    CommonModule,
    AddPartnerRoutingModule,
    SharedModule,
    MatCardModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class AddPartnerModule { }
