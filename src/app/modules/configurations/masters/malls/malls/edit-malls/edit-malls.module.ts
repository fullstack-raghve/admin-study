import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EditMallsRoutingModule } from './edit-malls-routing.module';
import { EditMallsComponent } from './edit-malls/edit-malls.component';
import { SharedModule } from '../../../../../../shared/shared.module';
import { MatCardModule } from '@angular/material/card';
import { FormsModule }   from '@angular/forms';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
@NgModule({
  declarations: [EditMallsComponent],
  imports: [
    CommonModule,
    EditMallsRoutingModule,
    SharedModule,
    MatCardModule,
    FormsModule,
    MatAutocompleteModule
  ]
})
export class EditMallsModule { }
