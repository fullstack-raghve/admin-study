import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from 'src/app/shared/shared.module';
import { MatAutocompleteModule, MatCardModule, MatDialogModule, MatPaginatorModule, MatTabsModule, MatTooltipModule } from '@angular/material';
import { FormsModule } from '@angular/forms';

import {
   MatTableModule
} from '@angular/material';
import { CdkTableModule } from '@angular/cdk/table';

import { ViewEventsRoutingModule } from './view-events-routing.module';
import { ViewEventsComponent } from './view-events/view-events.component';

@NgModule({
  declarations: [ViewEventsComponent],
  imports: [
    CommonModule,
    ViewEventsRoutingModule,
    SharedModule,
    MatCardModule,
    FormsModule,
    MatTabsModule,
    MatAutocompleteModule,
    SharedModule,
    MatCardModule,
    MatTableModule,
    CdkTableModule,
    MatPaginatorModule,
    MatDialogModule,
    MatTooltipModule
  ]
})
export class ViewEventsModule { }
