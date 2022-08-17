import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ViewCalendarRoutingModule } from './view-calendar-routing.module';
import { ViewCalendarComponent } from './view-calendar/view-calendar.component';
import { SharedModule } from '../../../../shared/shared.module';
import { MatCardModule } from '@angular/material/card';
import { FormsModule }   from '@angular/forms';
import { MatTableModule } from '@angular/material';
import { MatPaginatorModule , MatInputModule} from '@angular/material';

@NgModule({
  declarations: [ViewCalendarComponent],
  imports: [
    CommonModule,
    ViewCalendarRoutingModule,
    SharedModule,
    MatCardModule,
    FormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatInputModule,
  ]
})
export class ViewCalendarModule { }
