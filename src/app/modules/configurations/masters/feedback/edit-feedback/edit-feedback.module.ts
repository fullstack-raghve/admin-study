import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EditFeedbackRoutingModule } from './edit-feedback-routing.module';
import { EditFeedbackComponent } from './edit-feedback/edit-feedback.component';
import { SharedModule } from '../../../../../shared/shared.module';
import { MatCardModule } from '@angular/material/card';
import { FormsModule }   from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import {MatAutocompleteModule} from '@angular/material/autocomplete';

@NgModule({
  declarations: [EditFeedbackComponent],
  imports: [
    CommonModule,
    EditFeedbackRoutingModule,
    SharedModule,
    MatCardModule,
    FormsModule,
    ReactiveFormsModule,
    MatAutocompleteModule
  ]
})
export class EditFeedbackModule { }
