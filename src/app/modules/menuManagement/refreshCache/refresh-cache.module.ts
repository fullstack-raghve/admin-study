import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RefreshCacheRoutingModule } from './refresh-cache-routing.module';
import { RefreshCacheComponent } from './refresh-cache/refresh-cache.component';
import { MatTableModule } from '@angular/material';
import { MatDialogModule } from '@angular/material/dialog';
import { SharedModule } from '../../../shared/shared.module';
import { MatCardModule } from '@angular/material/card';
import {CdkTableModule} from '@angular/cdk/table';
import { MatPaginatorModule } from '@angular/material';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [RefreshCacheComponent],
  imports: [
    CommonModule,
    RefreshCacheRoutingModule,
    SharedModule,
    MatCardModule,
    MatTableModule,
    CdkTableModule,
    MatPaginatorModule,
    ReactiveFormsModule,
    MatDialogModule
  ]
})
export class RefreshCacheModule { }
