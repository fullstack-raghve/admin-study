import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddTaxationRoutingModule } from './addTaxationRouting.module';
import { AddTaxationComponent } from './add-taxation/addTaxation.component';
import { SharedModule } from '../../../../../../shared/shared.module';
import { MatCardModule } from '@angular/material/card';
import {MatTableModule} from '@angular/material/table';
import {CdkTableModule} from '@angular/cdk/table';
import { FormsModule, ReactiveFormsModule }   from '@angular/forms';
import {MatAutocompleteModule} from '@angular/material/autocomplete';

@NgModule({
  declarations: [AddTaxationComponent],
  imports: [
    CommonModule,
    AddTaxationRoutingModule,
    SharedModule,
    MatCardModule,
    MatTableModule,
    CdkTableModule,
    FormsModule,
    ReactiveFormsModule,
    MatAutocompleteModule

  ]
})
export class AddTaxationModule { }
