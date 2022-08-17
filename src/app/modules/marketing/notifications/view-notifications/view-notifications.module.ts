import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ViewNotificationsRoutingModule } from './view-notifications-routing.module';
import { ViewNotificationsComponent } from './view-notifications/view-notifications.component';
import { SharedModule } from '../../../../shared/shared.module';
import { MatCardModule } from '@angular/material/card';
import { FormsModule }   from '@angular/forms';
import { MatExpansionModule } from '@angular/material/expansion';
import {  MatDialogModule,MatTableModule } from '@angular/material';

@NgModule({
  declarations: [ViewNotificationsComponent],
  imports: [
    CommonModule,
    ViewNotificationsRoutingModule,
    SharedModule,
    MatCardModule,
    FormsModule,
    MatExpansionModule,
    MatTableModule,
    MatDialogModule
  ]
})
export class ViewNotificationsModule { }
