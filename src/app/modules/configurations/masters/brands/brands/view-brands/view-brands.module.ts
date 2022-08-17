import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ViewBrandsRoutingModule } from './view-brands-routing.module';
import { ViewBrandsComponent } from './view-brands/view-brands.component';
import { SharedModule } from '../../../../../../shared/shared.module';
import { MatCardModule } from '@angular/material/card';
@NgModule({
  declarations: [ViewBrandsComponent],
  imports: [
    CommonModule,
    ViewBrandsRoutingModule,
    SharedModule,
    MatCardModule
  ]
})
export class ViewBrandsModule { }
