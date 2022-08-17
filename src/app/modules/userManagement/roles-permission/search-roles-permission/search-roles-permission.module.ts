import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SearchRolesPermissionRoutingModule } from './search-roles-permission-routing.module';
import { SearchRolesPermissionComponent } from './search-roles-permission/search-roles-permission.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatCardModule, MatTableModule, MatPaginatorModule, MatDialogModule } from '@angular/material';
import { CdkTableModule } from '@angular/cdk/table';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    SearchRolesPermissionComponent
  ],
  imports: [
    CommonModule,
    SearchRolesPermissionRoutingModule,
    SharedModule,
    MatCardModule,
    MatTableModule,
    CdkTableModule,
    MatPaginatorModule,
    ReactiveFormsModule,
    MatDialogModule
  ]
})
export class SearchRolesPermissionModule { }
