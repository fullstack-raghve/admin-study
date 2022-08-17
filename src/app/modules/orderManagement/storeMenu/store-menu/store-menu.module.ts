import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StoreMenuRoutingModule } from './store-menu-routing.module';
import { StoreMenuComponent } from './store-menu/store-menu.component';
import { MatCardModule, MatTableModule, MatPaginatorModule, MatDialogModule, MatTabsModule } from '@angular/material';
import { CdkTableModule } from '@angular/cdk/table';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [StoreMenuComponent],
  imports: [
    CommonModule,
    StoreMenuRoutingModule,
    SharedModule,
    MatCardModule,
    MatTableModule,
    CdkTableModule,
    MatPaginatorModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatTabsModule
  ]
})
export class StoreMenuModule { }
