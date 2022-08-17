import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ViewNotificationsRoutingModule } from './view-notifications-routing.module';
import { ViewNotificationComponent } from './view-notification/view-notification.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatCardModule, MatTableModule, MatPaginatorModule, MatDialogModule } from '@angular/material';
import { CdkTableModule } from '@angular/cdk/table';
import { ReactiveFormsModule } from '@angular/forms';
import {MatTabsModule} from '@angular/material/tabs';

@NgModule({
  declarations: [ViewNotificationComponent],
  imports: [
    CommonModule,
    ViewNotificationsRoutingModule,
    SharedModule,
    MatCardModule,
    MatTableModule,
    CdkTableModule,
    MatPaginatorModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatTabsModule
  ]
})
export class ViewNotificationsModule { }
