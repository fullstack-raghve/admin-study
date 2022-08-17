import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ViewEnquiriesRoutingModule } from './view-enquiries-routing.module';
import { ViewEnquiriesComponent } from './view-enquiries/view-enquiries.component';
import { SharedModule } from '../../../../shared/shared.module';
import { FormsModule }   from '@angular/forms';
import {MatChipsModule} from '@angular/material/chips';
import { MatCardModule, MatTableModule, MatPaginatorModule, MatDialogModule, MatTabsModule } from '@angular/material';
@NgModule({
  declarations: [ViewEnquiriesComponent],
  imports: [
    CommonModule,
    ViewEnquiriesRoutingModule,
    SharedModule,
    MatCardModule,
    FormsModule,
    MatChipsModule,
    MatCardModule,
    MatTableModule,
    MatPaginatorModule,
    MatDialogModule,
    MatTabsModule,
  ]
})
export class ViewEnquiriesModule { }
