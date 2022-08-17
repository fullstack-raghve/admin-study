import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ViewRolesPermissionRoutingModule } from './view-roles-permission-routing.module';
import { ViewRolesPermissionComponent } from './view-roles-permission/view-roles-permission.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatCardModule, MatTableModule, MatPaginatorModule, MatDialogModule } from '@angular/material';
import { CdkTableModule } from '@angular/cdk/table';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [ViewRolesPermissionComponent],
  imports: [
    CommonModule,
    ViewRolesPermissionRoutingModule,
    SharedModule,
    MatCardModule,
    MatTableModule,
    CdkTableModule,
    MatPaginatorModule,
    ReactiveFormsModule,
    MatDialogModule
  ]
})
export class ViewRolesPermissionModule { }
