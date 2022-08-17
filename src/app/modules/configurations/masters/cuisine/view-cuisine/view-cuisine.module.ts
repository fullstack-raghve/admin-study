import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ViewCuisineRoutingModule } from './view-cuisine-routing.module';
import { ViewCuisineComponent } from './view-cuisine/view-cuisine.component';
import { SharedModule } from '../../../../../shared/shared.module';
import { MatCardModule } from '@angular/material/card';
@NgModule({
  declarations: [ViewCuisineComponent],
  imports: [
    CommonModule,
    ViewCuisineRoutingModule,
    SharedModule,
    MatCardModule
  ]
})
export class ViewCuisineModule { }
