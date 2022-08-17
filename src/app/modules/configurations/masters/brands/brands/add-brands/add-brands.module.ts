import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddBrandsRoutingModule } from './add-brands-routing.module';
import { AddBrandsComponent } from './add-brands/add-brands.component';
import { SharedModule } from '../../../../../../shared/shared.module';
import { MatCardModule } from '@angular/material/card';
import { FormsModule }   from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
@NgModule({
  declarations: [AddBrandsComponent],
  imports: [
    CommonModule,
    AddBrandsRoutingModule,
    SharedModule,
    MatCardModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class AddBrandsModule { }
