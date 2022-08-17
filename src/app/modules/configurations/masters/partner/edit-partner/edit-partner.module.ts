import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EditPartnerRoutingModule } from './edit-partner-routing.module';
import { EditPartnerComponent } from './edit-partner/edit-partner.component';
import { SharedModule } from '../../../../../shared/shared.module';
import { MatCardModule } from '@angular/material/card';
import { FormsModule }   from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [EditPartnerComponent],
  imports: [
    CommonModule,
    EditPartnerRoutingModule,
    SharedModule,
    MatCardModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class EditPartnerModule { }
