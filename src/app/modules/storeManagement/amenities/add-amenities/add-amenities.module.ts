import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddAmenitiesRoutingModule } from './add-amenities-routing.module';
import { AddAmenitiesComponent } from './add-amenities/add-amenities.component';
import { SharedModule } from '../../../../shared/shared.module';
import { MatCardModule } from '@angular/material/card';
import { FormsModule }   from '@angular/forms';
@NgModule({
  declarations: [AddAmenitiesComponent],
  imports: [
    CommonModule,
    AddAmenitiesRoutingModule,
    SharedModule,
    MatCardModule,
    FormsModule,
  ]
})
export class AddAmenitiesModule { }
