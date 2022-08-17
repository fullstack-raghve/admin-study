import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ViewCategoryRoutingModule } from './view-category-routing.module';
import { ViewCategoryComponent } from './view-category/view-category.component';
import { SharedModule } from '../../../../shared/shared.module';
import { MatCardModule } from '@angular/material/card';
import { FormsModule }   from '@angular/forms';

@NgModule({
  declarations: [ViewCategoryComponent],
  imports: [
    CommonModule,
    ViewCategoryRoutingModule,
    SharedModule,
    MatCardModule,
    FormsModule
  ]
})
export class ViewCategoryModule { }
