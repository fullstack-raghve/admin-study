import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddCitiesRoutingModule } from './add-cities-routing.module';
import { AddCitiesComponent } from './add-cities/add-cities.component';
import { SharedModule } from '../../../../../shared/shared.module';
import { MatCardModule } from '@angular/material/card';
import { FormsModule }   from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
@NgModule({
  declarations: [AddCitiesComponent],
  imports: [
    CommonModule,
    AddCitiesRoutingModule,
    SharedModule,
    MatCardModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class AddCitiesModule { }
