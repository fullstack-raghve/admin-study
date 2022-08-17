import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EditCartConfigurationRoutingModule } from './edit-cart-configuration-routing.module';
import { EditCartConfigurationComponent } from './edit-cart-configuration/edit-cart-configuration.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatCardModule, MatTableModule, MatPaginatorModule } from '@angular/material';
import { CdkTableModule } from '@angular/cdk/table';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [EditCartConfigurationComponent],
  imports: [
    CommonModule,
    EditCartConfigurationRoutingModule,
    SharedModule,
    MatCardModule,
    MatTableModule,
    CdkTableModule,
    MatPaginatorModule,
    ReactiveFormsModule,
  ]
})
export class EditCartConfigurationModule { }
