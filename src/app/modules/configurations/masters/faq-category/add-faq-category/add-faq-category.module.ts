import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddFaqCategoryRoutingModule } from './add-faq-category-routing.module';
import { AddFaqCategoryComponent } from './add-faq-category/add-faq-category.component';
import { SharedModule } from '../../../../../shared/shared.module';
import { MatCardModule } from '@angular/material/card';
import { FormsModule }   from '@angular/forms';
@NgModule({
  declarations: [AddFaqCategoryComponent],
  imports: [
    CommonModule,
    AddFaqCategoryRoutingModule,
    SharedModule,
    MatCardModule,
    FormsModule
  ]
})
export class AddFaqCategoryModule { }
