import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EditVariantsRoutingModule } from './edit-variants-routing.module';
import { EditVariantsComponent } from './edit-variants/edit-variants.component';
import { SharedModule } from '../../../../shared/shared.module';
import { MatCardModule } from '@angular/material/card';
import { FormsModule }   from '@angular/forms';
import { MatTableModule, MatTable } from '@angular/material';

@NgModule({
  declarations: [EditVariantsComponent],
  imports: [
    CommonModule,
    EditVariantsRoutingModule,
    SharedModule,
    MatCardModule,
    FormsModule,
    MatTableModule
  ]
})
export class EditVariantsModule { }
