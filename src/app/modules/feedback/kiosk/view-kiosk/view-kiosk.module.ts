import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ViewKioskRoutingModule } from './view-kiosk-routing.module';
import { ViewKioskComponent } from './view-kiosk/view-kiosk.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule, MatCardModule, MatTableModule, MatPaginatorModule } from '@angular/material';
import { SharedModule } from 'src/app/shared/shared.module';
import { CdkTableModule } from '@angular/cdk/table';
import { ViewImgComponent } from './view-img/view-img.component';
@NgModule({
  declarations: [ViewKioskComponent, ViewImgComponent],
  imports: [
    CommonModule,
    ViewKioskRoutingModule,
    SharedModule,
    MatCardModule,
    MatTableModule,
    CdkTableModule,
    MatPaginatorModule,
    ReactiveFormsModule,
    MatDialogModule,
  ],
  entryComponents:[
    ViewImgComponent
  ]
})
export class ViewKioskModule { }
