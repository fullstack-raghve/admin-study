import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EditClientOnBoardingRoutingModule } from './edit-client-on-boarding-routing.module';
import { EditClientOnBoardingComponent } from './edit-client-on-boarding/edit-client-on-boarding.component';
import { SharedModule } from '../../../../shared/shared.module';
import { MatCardModule } from '@angular/material/card';
import { FormsModule }   from '@angular/forms';


@NgModule({
  declarations: [EditClientOnBoardingComponent],
  imports: [
    CommonModule,
    EditClientOnBoardingRoutingModule,
    SharedModule,
    MatCardModule,
    FormsModule,
  ]
})
export class EditClientOnBoardingModule { }
