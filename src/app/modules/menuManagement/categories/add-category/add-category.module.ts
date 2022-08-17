import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddCategoryRoutingModule } from './add-category-routing.module';
import { AddCategoryComponent} from './add-category/add-category.component';
import { SharedModule } from '../../../../shared/shared.module';
import { MatCardModule } from '@angular/material/card';
import { FormsModule }   from '@angular/forms';

@NgModule({
  declarations: [AddCategoryComponent],
  imports: [
    CommonModule,
    AddCategoryRoutingModule,
    SharedModule,
    MatCardModule,
    FormsModule,
],
})
export class AddCategoryModule { }
