import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatAutocompleteModule, MatCardModule, MatDialogModule, MatPaginatorModule, MatTableModule, MatTabsModule, MatTooltipModule } from '@angular/material';
import { FormsModule } from '@angular/forms';
import { EditEventsRoutingModule } from './edit-events-routing.module';
import { EditEventsComponent } from './edit-events/edit-events.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { CdkTableModule } from '@angular/cdk/table';


@NgModule({
  declarations: [EditEventsComponent],
  imports: [
    CommonModule,
    EditEventsRoutingModule,
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
export class EditEventsModule { }
