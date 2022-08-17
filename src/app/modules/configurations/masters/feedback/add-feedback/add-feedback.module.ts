import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddFeedbackRoutingModule } from './add-feedback-routing.module';
import { AddFeedbackComponent } from './add-feedback/add-feedback.component';
import { SharedModule } from '../../../../../shared/shared.module';
import { MatCardModule } from '@angular/material/card';
import { FormsModule }   from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import {MatAutocompleteModule} from '@angular/material/autocomplete';

@NgModule({
  declarations: [AddFeedbackComponent],
  imports: [
    CommonModule,
    AddFeedbackRoutingModule,
    SharedModule,
    MatCardModule,
    FormsModule,
    ReactiveFormsModule,
    MatAutocompleteModule
  ]
})
export class AddFeedbackModule { }
