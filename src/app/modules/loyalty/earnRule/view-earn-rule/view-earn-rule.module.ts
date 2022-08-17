import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ViewEarnRuleRoutingModule } from './view-earn-rule-routing.module';
import { ViewEarnRuleComponent } from './view-earn-rule/view-earn-rule.component';
import { SharedModule } from '../../../../shared/shared.module';
import { MatCardModule } from '@angular/material/card';
import { FormsModule }   from '@angular/forms';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTabsModule } from '@angular/material/tabs';

@NgModule({
  declarations: [ViewEarnRuleComponent],
  imports: [
    CommonModule,
    ViewEarnRuleRoutingModule,
    SharedModule,
    MatCardModule,
    FormsModule,
    MatExpansionModule,
    MatTabsModule,
  ]
})
export class ViewEarnRuleModule { }
