import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddBrandCategoryRoutingModule } from './add-brand-category-routing.module';
import { AddBrandCategoryComponent } from './add-brand-category/add-brand-category.component';
import { SharedModule } from '../../../../../shared/shared.module';

import {MatDialogModule} from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
// import {MatTableModule} from '@angular/material/table';
import { ReactiveFormsModule } from '@angular/forms';
@NgModule({
  declarations: [AddBrandCategoryComponent],
  imports: [
    CommonModule,
    AddBrandCategoryRoutingModule,
    SharedModule,
    MatCardModule,
    ReactiveFormsModule,
    MatDialogModule
  ]
})
export class AddBrandCategoryModule { }
