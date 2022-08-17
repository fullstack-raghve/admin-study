import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SearchCardTemplateRoutingModule } from './search-card-template-routing.module';
import { SearchCardTemplateComponent } from './search-card-template/search-card-template.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatCardModule, MatTableModule, MatPaginatorModule, MatDialogModule } from '@angular/material';
import { CdkTableModule } from '@angular/cdk/table';
import { ReactiveFormsModule } from '@angular/forms';
@NgModule({
  declarations: [SearchCardTemplateComponent],
  imports: [
    CommonModule,
    SearchCardTemplateRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    CdkTableModule,
    MatCardModule,MatTableModule,MatPaginatorModule,MatDialogModule
  ]
})
export class SearchCardTemplateModule { }
