import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ViewBrandRoutingModule } from './view-brand-routing.module';
import { ViewBrandComponent } from './view-brand/view-brand.component';
import { SharedModule } from '../../../../../shared/shared.module';
import { MatCardModule } from '@angular/material/card';
import { FormsModule }   from '@angular/forms';
@NgModule({
  declarations: [ViewBrandComponent],
  imports: [
    CommonModule,
    ViewBrandRoutingModule,
    SharedModule,
    MatCardModule,
    FormsModule
  ]
})
export class ViewBrandModule { }
