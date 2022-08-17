import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CreateRolesPermissionRoutingModule } from './create-roles-permission-routing.module';
import { CreateRolesPermissionComponent } from './create-roles-permission/create-roles-permission.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatCardModule, MatTableModule, MatPaginatorModule, MatDialogModule } from '@angular/material';
import { CdkTableModule } from '@angular/cdk/table';
import { ReactiveFormsModule } from '@angular/forms';
// import { DialogComponent } from '../../add-user/add-user/add-user.component';

@NgModule({
  declarations: [
    CreateRolesPermissionComponent,
    // DialogComponent
   ],
  imports: [
    CommonModule,
    CreateRolesPermissionRoutingModule,
    SharedModule,
    MatCardModule,
    MatTableModule,
    CdkTableModule,
    MatPaginatorModule,
    ReactiveFormsModule,
    MatDialogModule
  ]
})
export class CreateRolesPermissionModule { }
