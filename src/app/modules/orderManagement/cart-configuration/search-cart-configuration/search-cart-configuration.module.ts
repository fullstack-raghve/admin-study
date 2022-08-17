import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { MatTableModule } from '@angular/material';
import { SharedModule } from '../../../../shared/shared.module';
import { MatCardModule } from '@angular/material/card';
import { CdkTableModule } from '@angular/cdk/table';
import { MatPaginatorModule , MatInputModule} from '@angular/material';
import { ReactiveFormsModule } from '@angular/forms';
import { SearchCartConfigurationComponent } from './search-cart-configuration/search-cart-configuration.component';
import {MatAutocompleteModule} from '@angular/material/autocomplete';

import { SearchCartConfigurationRoutingModule } from './search-cart-configuration-routing.module';
@NgModule({
  declarations: [SearchCartConfigurationComponent],
  imports: [
    CommonModule,
    SearchCartConfigurationRoutingModule,
    SharedModule,
    MatCardModule,
    MatTableModule,
    CdkTableModule,
    MatPaginatorModule,
    ReactiveFormsModule,
    MatAutocompleteModule
  ]
})
export class SearchCartConfigurationModule { }
