import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ViewPartnerRoutingModule } from './view-partner-routing.module';
import { ViewPartnerComponent } from './view-partner/view-partner.component';
import { SharedModule } from '../../../../../shared/shared.module';
import { MatCardModule } from '@angular/material/card';

@NgModule({
  declarations: [ ViewPartnerComponent ],
  imports: [
    CommonModule,
    ViewPartnerRoutingModule,
    SharedModule,
    MatCardModule
  ]
})
export class ViewPartnerModule { }
