import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ViewVariantsRoutingModule } from './view-variants-routing.module';
import { ViewVariantsComponent } from './view-variants/view-variants.component';
import { SharedModule } from '../../../../shared/shared.module';
import { MatCardModule } from '@angular/material/card';
import { FormsModule }   from '@angular/forms';

@NgModule({
  declarations: [ViewVariantsComponent],
  imports: [
    CommonModule,
    ViewVariantsRoutingModule,
    SharedModule,
    MatCardModule,
    FormsModule
  ]
})
export class ViewVariantsModule { }
