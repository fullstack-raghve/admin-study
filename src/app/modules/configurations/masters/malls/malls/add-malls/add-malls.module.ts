import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddMallsRoutingModule } from './add-malls-routing.module';
import { AddMallsComponent } from './add-malls/add-malls.component';
import { SharedModule } from '../../../../../../shared/shared.module';
import { MatCardModule } from '@angular/material/card';
import { FormsModule }   from '@angular/forms';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
@NgModule({
  declarations: [AddMallsComponent],
  imports: [
    CommonModule,
    AddMallsRoutingModule,
    SharedModule,
    MatCardModule,
    FormsModule,
    MatAutocompleteModule
  ]
})
export class AddMallsModule { }
