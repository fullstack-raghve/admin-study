import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddBurnRuleRoutingModule } from './add-burn-rule-routing.module';
import { AddBurnRuleComponent } from './add-burn-rule/add-burn-rule.component';
import { SharedModule } from '../../../../shared/shared.module';
import { MatCardModule } from '@angular/material/card';
import { FormsModule }   from '@angular/forms';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTabsModule } from '@angular/material/tabs';
import { EditorModule } from '@tinymce/tinymce-angular';
import {MatDialogModule} from '@angular/material/dialog';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
@NgModule({
  declarations: [AddBurnRuleComponent],
  imports: [
    CommonModule,
    AddBurnRuleRoutingModule,
    SharedModule,
    MatCardModule,
    FormsModule,
    MatExpansionModule,
    MatTabsModule,
    EditorModule,
    MatDialogModule,
    MatAutocompleteModule
  ]
})
export class AddBurnRuleModule { }
