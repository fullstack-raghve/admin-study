import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EditBrandCategoryRoutingModule } from './edit-brand-category-routing.module';
import { EditBrandCategoryComponent } from './edit-brand-category/edit-brand-category.component';
import { SharedModule } from '../../../../../shared/shared.module';

import {MatDialogModule} from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
// import {MatTableModule} from '@angular/material/table';
import { ReactiveFormsModule } from '@angular/forms';
@NgModule({
  declarations: [EditBrandCategoryComponent],
  imports: [
    CommonModule,
    EditBrandCategoryRoutingModule,
    SharedModule,
    MatCardModule,
    ReactiveFormsModule,
    MatDialogModule
  ]
})
export class EditBrandCategoryModule { }
