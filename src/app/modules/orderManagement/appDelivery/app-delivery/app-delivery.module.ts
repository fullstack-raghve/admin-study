import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppDeliveryRoutingModule } from './app-delivery-routing.module';
import { AppDeliveryComponent } from './app-delivery/app-delivery.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatCardModule, MatTableModule, MatPaginatorModule, MatDialogModule, MatTabsModule } from '@angular/material';
import { CdkTableModule } from '@angular/cdk/table';
import { ReactiveFormsModule } from '@angular/forms';
import { GlobalPopupComponent } from '../global-popup/global-popup.component';

@NgModule({
  declarations: [AppDeliveryComponent,GlobalPopupComponent],
  imports: [
    CommonModule,
    AppDeliveryRoutingModule,
    SharedModule,
    MatCardModule,
    MatTableModule,
    CdkTableModule,
    MatPaginatorModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatTabsModule
  ],
  entryComponents: [
    GlobalPopupComponent
  ]
})
export class AppDeliveryModule { }
