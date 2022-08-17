import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EditBurnRuleRoutingModule } from './edit-burn-rule-routing.module';
import { EditBurnRuleComponent } from './edit-burn-rule/edit-burn-rule.component';
import { SharedModule } from '../../../../shared/shared.module';
import { MatCardModule } from '@angular/material/card';
import { FormsModule }   from '@angular/forms';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTabsModule } from '@angular/material/tabs';
import { EditorModule } from '@tinymce/tinymce-angular';
import {MatDialogModule} from '@angular/material/dialog';
@NgModule({
  declarations: [EditBurnRuleComponent],
  imports: [
    CommonModule,
    EditBurnRuleRoutingModule,
    SharedModule,
    MatCardModule,
    FormsModule,
    MatExpansionModule,
    MatTabsModule,
    EditorModule,
    MatDialogModule,
  ]
})
export class EditBurnRuleModule { }
