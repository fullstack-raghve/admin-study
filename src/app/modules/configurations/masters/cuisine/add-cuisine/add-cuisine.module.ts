import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddCuisineRoutingModule } from './add-cuisine-routing.module';
import { AddCuisineComponent } from './add-cuisine/add-cuisine.component';
import { SharedModule } from '../../../../../shared/shared.module';
import { MatCardModule } from '@angular/material/card';
import { FormsModule }   from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
@NgModule({
  declarations: [AddCuisineComponent],
  imports: [
    CommonModule,
    AddCuisineRoutingModule,
    SharedModule,
    MatCardModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class AddCuisineModule { }
