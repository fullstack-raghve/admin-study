import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ViewDeliveryAreaRoutingModule } from './view-delivery-area-routing.module';
import { ViewDeliveryAreaComponent } from './view-delivery-area/view-delivery-area.component';

import { SharedModule } from '../../../../shared/shared.module';
import { MatCardModule } from '@angular/material/card';
import { FormsModule }   from '@angular/forms';
import { MatTableModule } from '@angular/material';
import { MatPaginatorModule , MatInputModule} from '@angular/material';
import {MatDialogModule} from '@angular/material/dialog';
@NgModule({
  declarations: [ViewDeliveryAreaComponent],
  imports: [
    CommonModule,
    ViewDeliveryAreaRoutingModule,
    SharedModule,
    MatCardModule,
    FormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatInputModule,
    MatDialogModule
  ]
})
export class ViewDeliveryAreaModule { }
