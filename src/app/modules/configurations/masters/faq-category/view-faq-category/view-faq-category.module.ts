import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ViewFaqCategoryRoutingModule } from './view-faq-category-routing.module';
import { ViewFaqCategoryComponent } from './view-faq-category/view-faq-category.component';
import { SharedModule } from '../../../../../shared/shared.module';
import { MatCardModule } from '@angular/material/card';
import { FormsModule }   from '@angular/forms'; 
@NgModule({
  declarations: [ViewFaqCategoryComponent],
  imports: [
    CommonModule,
    ViewFaqCategoryRoutingModule,
    SharedModule,
    MatCardModule,
    FormsModule
  ]
})
export class ViewFaqCategoryModule { }
