import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EditRolesPermissionRoutingModule } from './edit-roles-permission-routing.module';
import { EditRolesPermissionComponent } from './edit-roles-permission/edit-roles-permission.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatCardModule, MatTableModule, MatPaginatorModule, MatDialogModule } from '@angular/material';
import { CdkTableModule } from '@angular/cdk/table';
import { ReactiveFormsModule } from '@angular/forms';
import { MalihuScrollbarModule } from 'ngx-malihu-scrollbar';
@NgModule({
  declarations: [EditRolesPermissionComponent],
  imports: [
    CommonModule,
    EditRolesPermissionRoutingModule,
    SharedModule,
    MatCardModule,
    MatTableModule,
    CdkTableModule,
    MatPaginatorModule,
    ReactiveFormsModule,
    MatDialogModule,
    MalihuScrollbarModule.forRoot(),
  ]
})
export class EditRolesPermissionModule { }
