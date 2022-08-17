import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddLocationRoutingModule } from './add-location-routing.module';
import { AddLocationComponent } from './add-location/add-location.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatAutocompleteModule, MatCardModule, MatDialogModule, MatPaginatorModule, MatTableModule, MatTabsModule, MatTooltipModule } from '@angular/material';
import { FormsModule } from '@angular/forms';
import { CdkTableModule } from '@angular/cdk/table';

@NgModule({
  declarations: [AddLocationComponent],
  imports: [
    CommonModule,
    AddLocationRoutingModule,
    SharedModule,
    MatCardModule,
    FormsModule,
    MatTabsModule,
    MatAutocompleteModule,
    MatCardModule,
    MatTableModule,
    CdkTableModule,
    MatPaginatorModule,
    MatDialogModule,
    MatTooltipModule
  ]
})
export class AddLocationModule { }
