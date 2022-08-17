import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ViewAmenitiesRoutingModule } from './view-amenities-routing.module';
import { ViewAmenitiesComponent } from './view-amenities/view-amenities.component';
import { SharedModule } from '../../../../shared/shared.module';
import { MatCardModule } from '@angular/material/card';
import { FormsModule }   from '@angular/forms';
@NgModule({
  declarations: [ViewAmenitiesComponent],
  imports: [
    CommonModule,
    ViewAmenitiesRoutingModule,
    SharedModule,
    MatCardModule,
    FormsModule,
  ]
})
export class ViewAmenitiesModule { }
