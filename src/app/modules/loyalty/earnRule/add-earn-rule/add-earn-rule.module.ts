import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddEarnRuleRoutingModule } from './add-earn-rule-routing.module';
import { AddEarnRuleComponent } from './add-earn-rule/add-earn-rule.component';
import { SharedModule } from '../../../../shared/shared.module';
import { MatCardModule } from '@angular/material/card';
import { FormsModule } from '@angular/forms';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTabsModule } from '@angular/material/tabs';
import { EditorModule } from '@tinymce/tinymce-angular';
// import { AddMultiselectComponent } from '../../../../shared/components/add-multiselect/add-multiselect.component';
//import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
//import { MatSelectModule } from '@angular/material/select';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
@NgModule({
  declarations: [AddEarnRuleComponent],
  imports: [
    CommonModule,
    AddEarnRuleRoutingModule,
    SharedModule,
    MatCardModule,
    FormsModule,
    MatExpansionModule,
    MatTabsModule,
    EditorModule,
    MatAutocompleteModule
    //    MatSelectModule,
    //    NgxMatSelectSearchModule
  ]
})
export class AddEarnRuleModule { }
