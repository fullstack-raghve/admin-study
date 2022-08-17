import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddAboutUsCategoryRoutingModule } from './add-about-us-category-routing.module';
import { AddAboutUsCategoryComponent } from './add-about-us-category/add-about-us-category.component';
import { SharedModule } from '../../../../../shared/shared.module';
import { MatCardModule } from '@angular/material/card';
import { FormsModule }   from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
@NgModule({
  declarations: [AddAboutUsCategoryComponent],
  imports: [
    CommonModule,
    AddAboutUsCategoryRoutingModule,
    SharedModule,
    MatCardModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class AddAboutUsCategoryModule { }
