import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddVariantsRoutingModule } from './add-variants-routing.module';
import { AddVariantsComponent } from './add-variants/add-variants.component';
import { SharedModule } from '../../../../shared/shared.module';
import { MatCardModule } from '@angular/material/card';
import { FormsModule }   from '@angular/forms';
import { MatTableModule, MatTable } from '@angular/material';
@NgModule({
  declarations: [AddVariantsComponent],
  imports: [
    CommonModule,
    AddVariantsRoutingModule,
    SharedModule,
    MatCardModule,
    FormsModule,
    MatTableModule
  ]
})
export class AddVariantsModule { }
