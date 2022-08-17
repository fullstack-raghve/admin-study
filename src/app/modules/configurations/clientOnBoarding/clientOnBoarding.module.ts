import { NgModule } from '@angular/core';

import { clientOnBoardingRoutingModule } from './clientOnBoarding-routing.module';
import { clientOnBoardingComponent } from './clientOnBoarding/clientOnBoarding.component';

import { SharedModule } from '../../../shared/shared.module';
import { FormsModule ,ReactiveFormsModule }   from '@angular/forms';

@NgModule({
  declarations: [clientOnBoardingComponent],
  imports: [
    clientOnBoardingRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule
  ],
})
export class clientOnBoardingModule { }
