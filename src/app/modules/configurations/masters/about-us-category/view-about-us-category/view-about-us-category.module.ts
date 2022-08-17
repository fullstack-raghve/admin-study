import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ViewAboutUsCategoryRoutingModule } from './view-about-us-category-routing.module';
import { ViewAboutUsCategoryComponent } from './view-about-us-category/view-about-us-category.component';
import { SharedModule } from '../../../../../shared/shared.module';
import { MatCardModule } from '@angular/material/card';
@NgModule({
  declarations: [ViewAboutUsCategoryComponent],
  imports: [
    CommonModule,
    ViewAboutUsCategoryRoutingModule,
    SharedModule,
    MatCardModule,
  ]
})
export class ViewAboutUsCategoryModule { }
