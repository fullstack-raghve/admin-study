import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddBrandRoutingModule } from './add-brand-routing.module';
import { AddBrandComponent } from './add-brand/add-brand.component';
import { SharedModule } from '../../../../../shared/shared.module';
import { MatCardModule } from '@angular/material/card';
import { FormsModule }   from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [AddBrandComponent],
  imports: [
    CommonModule,
    AddBrandRoutingModule,
    SharedModule,
    MatCardModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class AddBrandModule { }
