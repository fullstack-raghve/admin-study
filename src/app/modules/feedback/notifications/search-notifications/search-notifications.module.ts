import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SearchNotificationsRoutingModule } from './search-notifications-routing.module';
import { SearchNotificationsComponent } from './search-notifications/search-notifications.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatCardModule, MatTableModule, MatPaginatorModule, MatDialogModule } from '@angular/material';
import { CdkTableModule } from '@angular/cdk/table';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [SearchNotificationsComponent],
  imports: [
    CommonModule,
    SearchNotificationsRoutingModule,
    SharedModule,
    MatCardModule,
    MatTableModule,
    CdkTableModule,
    MatPaginatorModule,
    ReactiveFormsModule,
    MatDialogModule,
  ]
})
export class SearchNotificationsModule { }
