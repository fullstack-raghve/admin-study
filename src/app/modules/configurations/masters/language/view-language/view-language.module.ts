import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ViewLanguageRoutingModule } from './view-language-routing.module';
import { ViewLanguageComponent } from './view-language/view-language.component';
import { SharedModule } from '../../../../../shared/shared.module';
import { MatCardModule } from '@angular/material/card';
import { FormsModule }   from '@angular/forms';
@NgModule({
  declarations: [ViewLanguageComponent],
  imports: [
    CommonModule,
    ViewLanguageRoutingModule,
    SharedModule,
    MatCardModule,
    FormsModule
  ]
})
export class ViewLanguageModule { }
