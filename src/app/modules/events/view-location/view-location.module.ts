import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';

import { ViewLocationRoutingModule } from './view-location-routing.module';
import { ViewLocationComponent } from './view-location/view-location.component';
import { MatAutocompleteModule, MatCardModule, MatDialogModule, MatPaginatorModule, MatTableModule, MatTabsModule, MatTooltipModule } from '@angular/material';
import { FormsModule } from '@angular/forms';
import { CdkTableModule } from '@angular/cdk/table';
@NgModule({
  declarations: [ViewLocationComponent],
  imports: [
    CommonModule,
    ViewLocationRoutingModule,

    MatCardModule,
    FormsModule,
    MatTabsModule,
    MatAutocompleteModule,
    SharedModule,
    MatTableModule,
    CdkTableModule,
    MatPaginatorModule,
    MatDialogModule,
    MatTooltipModule
  ]
})
export class ViewLocationModule { }
