import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddCalendarRoutingModule } from './add-calendar-routing.module';
import { AddCalendarComponent } from './add-calendar/add-calendar.component';
import { SharedModule } from '../../../../shared/shared.module';
import { MatCardModule } from '@angular/material/card';
import { FormsModule }   from '@angular/forms';
import { MatTableModule } from '@angular/material';
import { MatPaginatorModule , MatInputModule} from '@angular/material';
import {MatDialogModule} from '@angular/material/dialog';

@NgModule({
  declarations: [AddCalendarComponent],
  imports: [
    CommonModule,
    AddCalendarRoutingModule,
    SharedModule,
    MatCardModule,
    FormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatInputModule,
    MatDialogModule
  ]
})
export class AddCalendarModule { }
