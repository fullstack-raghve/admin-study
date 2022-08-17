import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddClientOnBoardingRoutingModule } from './add-client-on-boarding-routing.module';
import { AddClientOnBoardingComponent } from './add-client-on-boarding/add-client-on-boarding.component';
import { SharedModule } from '../../../../shared/shared.module';
import { MatCardModule } from '@angular/material/card';
import { FormsModule }   from '@angular/forms';
@NgModule({
  declarations: [AddClientOnBoardingComponent],
  imports: [
    CommonModule,
    AddClientOnBoardingRoutingModule,
    SharedModule,
    MatCardModule,
    FormsModule,
  ]
})
export class AddClientOnBoardingModule { }
