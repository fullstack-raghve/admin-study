import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EditCuisineRoutingModule } from './edit-cuisine-routing.module';
import { EditCuisineComponent } from './edit-cuisine/edit-cuisine.component';
import { SharedModule } from '../../../../../shared/shared.module';
import { MatCardModule } from '@angular/material/card';
import { FormsModule }   from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
@NgModule({
  declarations: [EditCuisineComponent],
  imports: [
    CommonModule,
    EditCuisineRoutingModule,
    SharedModule,
    MatCardModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class EditCuisineModule { }
