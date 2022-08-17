
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DeliveryChargesRoutingModule } from './delivery-charges-routing.module';
import { DeliveryChargesComponent } from './delivery-charges/delivery-charges.component';
import {MatDialogModule} from '@angular/material/dialog';
import { SharedModule } from '../../../../shared/shared.module';
import { MatCardModule } from '@angular/material/card';
import {CdkTableModule} from '@angular/cdk/table';
import { MatPaginatorModule , MatInputModule} from '@angular/material';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [DeliveryChargesComponent],
  imports: [
    CommonModule,
    DeliveryChargesRoutingModule,
    SharedModule,
    MatCardModule,
    CdkTableModule,
    MatPaginatorModule,
    ReactiveFormsModule,
    MatDialogModule
  ],
})
export class DeliveryChargesModule { }
