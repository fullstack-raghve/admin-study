import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ViewClientOnBoardingRoutingModule } from './view-client-on-boarding-routing.module';
import { ViewClientOnBoardingComponent } from './view-client-on-boarding/view-client-on-boarding.component';
import { SharedModule } from '../../../../shared/shared.module';
import { MatCardModule } from '@angular/material/card';
import { MalihuScrollbarModule } from 'ngx-malihu-scrollbar';
@NgModule({
  declarations: [ViewClientOnBoardingComponent],
  imports: [
    CommonModule,
    ViewClientOnBoardingRoutingModule,
    SharedModule,
    MatCardModule,
    MalihuScrollbarModule.forRoot(),
  ]
})
export class ViewClientOnBoardingModule { }
