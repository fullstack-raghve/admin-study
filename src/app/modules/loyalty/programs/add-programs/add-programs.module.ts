import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddProgramsRoutingModule } from './add-programs-routing.module';
import { AddProgramsComponent } from './add-programs/add-programs.component';
import { SharedModule } from '../../../../shared/shared.module';
import { MatCardModule } from '@angular/material/card';
import { FormsModule }   from '@angular/forms';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTabsModule } from '@angular/material/tabs';
import { EditorModule } from '@tinymce/tinymce-angular';
import {MatAutocompleteModule} from '@angular/material/autocomplete';

@NgModule({
  declarations: [AddProgramsComponent],
  imports: [
    CommonModule,
    AddProgramsRoutingModule,
    SharedModule,
    MatCardModule,
    FormsModule,
    MatExpansionModule,
    MatTabsModule,
    EditorModule,
    MatAutocompleteModule
  ]
})
export class AddProgramsModule { }
