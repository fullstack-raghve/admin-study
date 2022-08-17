import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddProductTagRoutingModule } from './add-product-tag-routing.module';
import { AddProductTagComponent } from './add-product-tag/add-product-tag.component';
import { SharedModule } from '../../../../../../shared/shared.module';
import { MatCardModule } from '@angular/material/card';
import {MatTableModule} from '@angular/material/table';
import {CdkTableModule} from '@angular/cdk/table';
import { FormsModule, ReactiveFormsModule }   from '@angular/forms';
import {MatAutocompleteModule} from '@angular/material/autocomplete';

@NgModule({
  declarations: [AddProductTagComponent],
  imports: [
    CommonModule,
    AddProductTagRoutingModule,
    SharedModule,
    MatCardModule,
    MatTableModule,
    CdkTableModule,
    FormsModule,
    ReactiveFormsModule,
    MatAutocompleteModule

  ]
})
export class AddProductTagModule { }
