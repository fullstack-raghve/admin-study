import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EditCategoryRoutingModule } from './edit-category-routing.module';
import { EditCategoryComponent} from './edit-category/edit-category.component';
import { SharedModule } from '../../../../shared/shared.module';
import { MatCardModule } from '@angular/material/card';
import { FormsModule }   from '@angular/forms';
@NgModule({
  declarations: [EditCategoryComponent],
  imports: [
    CommonModule,
    EditCategoryRoutingModule,
    SharedModule,
    MatCardModule,
    FormsModule,
],
})
export class EditCategoryModule { }
