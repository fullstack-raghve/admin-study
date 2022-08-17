import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddGiftingRoutingModule } from './add-gifting-routing.module';
import { AddGiftingComponent } from './add-gifting/add-gifting.component';
import { SharedModule } from 'src/app/shared/shared.module';
import {MatTableModule} from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import {MatStepperModule} from '@angular/material/stepper';
import {MatPaginatorModule} from '@angular/material/paginator';
@NgModule({
  declarations: [AddGiftingComponent],
  imports: [
    CommonModule,
    AddGiftingRoutingModule,
    MatCardModule,
    SharedModule,
    MatTableModule,MatStepperModule,MatPaginatorModule

  ]
})
export class AddGiftingModule { }
