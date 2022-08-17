import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SearchCalendarRoutingModule } from './search-calendar-routing.module';
import { SearchCalendarComponent } from './search-calendar/search-calendar.component';
import { MatTableModule } from '@angular/material';
import { SharedModule } from '../../../../shared/shared.module';
import { MatCardModule } from '@angular/material/card';
import { CdkTableModule } from '@angular/cdk/table';
import { MatPaginatorModule , MatInputModule} from '@angular/material';
import { ReactiveFormsModule } from '@angular/forms';
@NgModule({
  declarations: [SearchCalendarComponent],
  imports: [
    CommonModule,
    SearchCalendarRoutingModule,
    SharedModule,
    MatCardModule,
    MatTableModule,
    CdkTableModule,
    MatPaginatorModule,
    ReactiveFormsModule,
  ]
})
export class SearchCalendarModule { }
