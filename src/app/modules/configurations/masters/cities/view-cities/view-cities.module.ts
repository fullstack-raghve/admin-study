import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ViewCitiesRoutingModule } from './view-cities-routing.module';
import { ViewCitiesComponent } from './view-cities/view-cities.component';
import { SharedModule } from '../../../../../shared/shared.module';
import { MatCardModule } from '@angular/material/card';
@NgModule({
  declarations: [ViewCitiesComponent],
  imports: [
    CommonModule,
    ViewCitiesRoutingModule,
    SharedModule,
    MatCardModule,
  ]
})
export class ViewCitiesModule { }
