import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ViewBrandCategoryRoutingModule } from './view-brand-category-routing.module';
import { ViewBrandCategoryComponent } from './view-brand-category/view-brand-category.component';
import { SharedModule } from '../../../../../shared/shared.module';

import {MatDialogModule} from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
// import {MatTableModule} from '@angular/material/table';
import { ReactiveFormsModule } from '@angular/forms';
@NgModule({
  declarations: [ViewBrandCategoryComponent],
  imports: [
    CommonModule,
    ViewBrandCategoryRoutingModule,
    SharedModule,
    MatCardModule,
    ReactiveFormsModule,
    MatDialogModule
  ]
})
export class ViewBrandCategoryModule { }
