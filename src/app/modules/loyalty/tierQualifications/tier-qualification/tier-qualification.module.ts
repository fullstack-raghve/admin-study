import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TierQualificationRoutingModule } from './tier-qualification-routing.module';
import { TierQualificationComponent } from './tier-qualification/tier-qualification.component';
import { SharedModule } from '../../../../shared/shared.module';
import { MatCardModule } from '@angular/material/card';
import { FormsModule }   from '@angular/forms';
import { loyaltyTtiers } from './loyalty-tiers/loyalty-tiers.component';



@NgModule({
  declarations: [TierQualificationComponent, loyaltyTtiers],
  imports: [
    CommonModule,
    TierQualificationRoutingModule,
    SharedModule,
    MatCardModule,
    FormsModule,
  ],
  entryComponents: [
    loyaltyTtiers
  ]
})
export class TierQualificationModule { }
