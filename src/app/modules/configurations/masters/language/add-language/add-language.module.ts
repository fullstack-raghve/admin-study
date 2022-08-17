import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddLanguageRoutingModule } from './add-language-routing.module';
import { AddLanguageComponent } from './add-language/add-language.component';
import { SharedModule } from '../../../../../shared/shared.module';
import { MatCardModule } from '@angular/material/card';
import { FormsModule }   from '@angular/forms';
@NgModule({
  declarations: [AddLanguageComponent],
  imports: [
    CommonModule,
    AddLanguageRoutingModule,
    SharedModule,
    MatCardModule,
    FormsModule
  ]
})
export class AddLanguageModule { }
