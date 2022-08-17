import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ViewCartConfigurationRoutingModule } from './view-cart-configuration-routing.module';
import { ViewCartConfigurationComponent } from './view-cart-configuration/view-cart-configuration.component';
import { MatCardModule, MatTableModule, MatPaginatorModule } from '@angular/material';
import { SharedModule } from 'src/app/shared/shared.module';
import { CdkTableModule } from '@angular/cdk/table';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [ViewCartConfigurationComponent],
  imports: [
    CommonModule,
    ViewCartConfigurationRoutingModule,
    SharedModule,
    MatCardModule,
    MatTableModule,
    CdkTableModule,
    MatPaginatorModule,
    ReactiveFormsModule,
  ]
})
export class ViewCartConfigurationModule { }
