import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EditFaqCategoryRoutingModule } from './edit-faq-category-routing.module';
import { EditFaqCategoryComponent } from './edit-faq-category/edit-faq-category.component';
import { SharedModule } from '../../../../../shared/shared.module';
import { MatCardModule } from '@angular/material/card';
import { FormsModule }   from '@angular/forms'; 
@NgModule({
  declarations: [EditFaqCategoryComponent],
  imports: [
    CommonModule,
    EditFaqCategoryRoutingModule,
    SharedModule,
    MatCardModule,
    FormsModule
  ]
})
export class EditFaqCategoryModule { }
