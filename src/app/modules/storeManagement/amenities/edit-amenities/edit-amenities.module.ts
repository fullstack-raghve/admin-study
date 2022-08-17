import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EditAmenitiesRoutingModule } from './edit-amenities-routing.module';
import { EditAmenitiesComponent } from './edit-amenities/edit-amenities.component';
import { SharedModule } from '../../../../shared/shared.module';
import { MatCardModule } from '@angular/material/card';
import { FormsModule }   from '@angular/forms';
@NgModule({
  declarations: [EditAmenitiesComponent],
  imports: [
    CommonModule,
    EditAmenitiesRoutingModule,
    SharedModule,
    MatCardModule,
    FormsModule,
  ]
})
export class EditAmenitiesModule { }
