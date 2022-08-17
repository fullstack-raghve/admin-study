import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddCartConfigurationRoutingModule } from './add-cart-configuration-routing.module';
import { AddCartConfigurationComponent } from './add-cart-configuration/add-cart-configuration.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatCardModule, MatTableModule, MatPaginatorModule } from '@angular/material';
import { CdkTableModule } from '@angular/cdk/table';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [AddCartConfigurationComponent],
  imports: [
    CommonModule,
    AddCartConfigurationRoutingModule,
    SharedModule,
    MatCardModule,
    MatTableModule,
    CdkTableModule,
    MatPaginatorModule,
    ReactiveFormsModule,
  ]
})
export class AddCartConfigurationModule { }
