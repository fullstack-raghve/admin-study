import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EditAboutUsCategoryRoutingModule } from './edit-about-us-category-routing.module';
import { EditAboutUsCategoryComponent } from './edit-about-us-category/edit-about-us-category.component';
import { SharedModule } from '../../../../../shared/shared.module';
import { MatCardModule } from '@angular/material/card';
import { FormsModule }   from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
@NgModule({
  declarations: [EditAboutUsCategoryComponent],
  imports: [
    CommonModule,
    EditAboutUsCategoryRoutingModule,
    SharedModule,
    MatCardModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class EditAboutUsCategoryModule { }
