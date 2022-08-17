import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ViewMallsRoutingModule } from './view-malls-routing.module';
import { ViewMallsComponent } from './view-malls/view-malls.component';
import { SharedModule } from '../../../../../../shared/shared.module';
import { MatCardModule } from '@angular/material/card';
import { FormsModule }   from '@angular/forms';
@NgModule({
  declarations: [ViewMallsComponent],
  imports: [
    CommonModule,
    ViewMallsRoutingModule,
    SharedModule,
    MatCardModule,
    FormsModule
  ]
})
export class ViewMallsModule { }
