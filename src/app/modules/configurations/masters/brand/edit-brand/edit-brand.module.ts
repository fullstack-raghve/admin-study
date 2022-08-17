import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EditBrandRoutingModule } from './edit-brand-routing.module';
import { EditBrandComponent } from './edit-brand/edit-brand.component';
import { SharedModule } from '../../../../../shared/shared.module';
import { MatCardModule } from '@angular/material/card';
import { FormsModule }   from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
@NgModule({
  declarations: [EditBrandComponent],
  imports: [
    CommonModule,
    EditBrandRoutingModule,
    SharedModule,
    MatCardModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class EditBrandModule { }
