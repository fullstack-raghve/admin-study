import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EditBrandsRoutingModule } from './edit-brands-routing.module';
import { EditBrandsComponent } from './edit-brands/edit-brands.component';
import { SharedModule } from '../../../../../../shared/shared.module';
import { MatCardModule } from '@angular/material/card';
@NgModule({
  declarations: [EditBrandsComponent],
  imports: [
    CommonModule,
    EditBrandsRoutingModule,
    SharedModule,
    MatCardModule
  ]
})
export class EditBrandsModule { }
