import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EditCitiesRoutingModule } from './edit-cities-routing.module';
import { EditCitiesComponent } from './edit-cities/edit-cities.component';
import { SharedModule } from '../../../../../shared/shared.module';
import { MatCardModule } from '@angular/material/card';
import { FormsModule }   from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
@NgModule({
  declarations: [EditCitiesComponent],
  imports: [
    CommonModule,
    EditCitiesRoutingModule,
    SharedModule,
    MatCardModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class EditCitiesModule { }
