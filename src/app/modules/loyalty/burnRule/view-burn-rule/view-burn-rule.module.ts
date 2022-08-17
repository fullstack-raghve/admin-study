import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ViewBurnRuleRoutingModule } from './view-burn-rule-routing.module';
import { ViewBurnRuleComponent } from './view-burn-rule/view-burn-rule.component';
import { SharedModule } from '../../../../shared/shared.module';
import { MatCardModule } from '@angular/material/card';
import { FormsModule }   from '@angular/forms';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTabsModule } from '@angular/material/tabs';
import { EditorModule } from '@tinymce/tinymce-angular';
import {MatDialogModule} from '@angular/material/dialog';

@NgModule({
  declarations: [ViewBurnRuleComponent],
  imports: [
    CommonModule,
    ViewBurnRuleRoutingModule,
    SharedModule,
    MatCardModule,
    FormsModule,
    MatExpansionModule,
    MatTabsModule,
    EditorModule,
    MatDialogModule,
  ]
})
export class ViewBurnRuleModule { }
