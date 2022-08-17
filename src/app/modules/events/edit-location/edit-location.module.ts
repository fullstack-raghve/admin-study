import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';

import { EditLocationRoutingModule } from './edit-location-routing.module';
import { EditLocationComponent } from './edit-location/edit-location.component';
import { MatAutocompleteModule, MatCardModule, MatDialogModule, MatPaginatorModule, MatTableModule, MatTabsModule, MatTooltipModule } from '@angular/material';
import { FormsModule } from '@angular/forms';
import { CdkTableModule } from '@angular/cdk/table';
@NgModule({
  declarations: [EditLocationComponent],
  imports: [
    CommonModule,
    EditLocationRoutingModule,

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
export class EditLocationModule { }
