import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GenerateCodeRoutingModule } from './generate-code-routing.module';
import { GenerateCodeComponent } from './generate-code/generate-code.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatCardModule, MatTableModule, MatPaginatorModule, MatDialogModule } from '@angular/material';
import { CdkTableModule } from '@angular/cdk/table';
import { ReactiveFormsModule } from '@angular/forms';
@NgModule({
  declarations: [GenerateCodeComponent],
  imports: [
    CommonModule,
    GenerateCodeRoutingModule, SharedModule, MatCardModule, MatTableModule, MatPaginatorModule, MatDialogModule, CdkTableModule, ReactiveFormsModule
  ]
})
export class GenerateCodeModule { }
