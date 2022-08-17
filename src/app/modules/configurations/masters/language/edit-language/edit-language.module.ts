import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EditLanguageRoutingModule } from './edit-language-routing.module';
import { EditLanguageComponent } from './edit-language/edit-language.component';
import { SharedModule } from '../../../../../shared/shared.module';
import { MatCardModule } from '@angular/material/card';
import { FormsModule }   from '@angular/forms';
@NgModule({
  declarations: [EditLanguageComponent],
  imports: [
    CommonModule,
    EditLanguageRoutingModule,
    SharedModule,
    MatCardModule,
    FormsModule
  ]
})
export class EditLanguageModule { }
