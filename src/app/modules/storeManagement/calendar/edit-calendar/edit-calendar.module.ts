import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EditCalendarRoutingModule } from './edit-calendar-routing.module';
import { EditCalendarComponent } from './edit-calendar/edit-calendar.component';
import { SharedModule } from '../../../../shared/shared.module';
import { MatCardModule } from '@angular/material/card';
import { FormsModule }   from '@angular/forms';
import { MatTableModule } from '@angular/material';
import { MatPaginatorModule , MatInputModule} from '@angular/material';
import {MatDialogModule} from '@angular/material/dialog';

@NgModule({
  declarations: [EditCalendarComponent],
  imports: [
    CommonModule,
    EditCalendarRoutingModule,
    SharedModule,
    MatCardModule,
    FormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatInputModule,
    MatDialogModule
  ]
})
export class EditCalendarModule { }
