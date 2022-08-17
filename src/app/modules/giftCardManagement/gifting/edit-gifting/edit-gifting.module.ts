import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EditGiftingRoutingModule } from './edit-gifting-routing.module';
import { EditGiftingComponent } from './edit-gifting/edit-gifting.component';

import { SharedModule } from 'src/app/shared/shared.module';
import {MatTableModule} from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import {MatStepperModule} from '@angular/material/stepper';
import {MatPaginatorModule} from '@angular/material/paginator';

@NgModule({
  declarations: [EditGiftingComponent],
  imports: [
    CommonModule,
    EditGiftingRoutingModule,
    SharedModule,
    MatTableModule,MatStepperModule,MatPaginatorModule,
    MatCardModule
  ]
})
export class EditGiftingModule { }
