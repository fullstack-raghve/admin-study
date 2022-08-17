import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ViewCountryRoutingModule } from './view-country-routing.module';
import { ViewCountryComponent } from './view-country/view-country.component';
import { SharedModule } from '../../../../../../shared/shared.module';
import { MatCardModule } from '@angular/material/card';
import {MatTableModule} from '@angular/material/table';
import {CdkTableModule} from '@angular/cdk/table';

@NgModule({
  declarations: [ViewCountryComponent],
  imports: [
    CommonModule,
    ViewCountryRoutingModule,
    SharedModule,
    MatCardModule,
    MatTableModule,
    CdkTableModule

  ]
})
export class ViewCountryModule { }
