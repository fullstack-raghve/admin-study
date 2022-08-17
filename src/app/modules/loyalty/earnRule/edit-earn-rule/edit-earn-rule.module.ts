import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EditEarnRuleRoutingModule } from './edit-earn-rule-routing.module';
import { EditEarnRuleComponent } from './edit-earn-rule/edit-earn-rule.component';
import { SharedModule } from '../../../../shared/shared.module';
import { MatCardModule } from '@angular/material/card';
import { FormsModule }   from '@angular/forms';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTabsModule } from '@angular/material/tabs';
import { EditorModule } from '@tinymce/tinymce-angular';
import {MatAutocompleteModule} from '@angular/material/autocomplete';

@NgModule({
  declarations: [EditEarnRuleComponent],
  imports: [
    CommonModule,
    EditEarnRuleRoutingModule,
    SharedModule,
    MatCardModule,
    FormsModule,
    MatExpansionModule,
    MatTabsModule,
    EditorModule,
    MatAutocompleteModule
  ]
})
export class EditEarnRuleModule { }
