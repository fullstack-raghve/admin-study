import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Change_passwordRoutingModule } from './change-password-routing.module';
import { change_passwordComponent } from './change-password/change-password.component';
import { SharedModule } from '../../../shared/shared.module';
import { MatCardModule } from '@angular/material/card';
import { FormsModule }   from '@angular/forms';
@NgModule({
  declarations: [change_passwordComponent],
  imports: [
    CommonModule,
    Change_passwordRoutingModule,
    SharedModule,
    MatCardModule,
    FormsModule
  ]
})
export class Change_passwordModule { }
