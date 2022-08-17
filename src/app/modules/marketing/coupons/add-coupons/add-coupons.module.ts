import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddCouponsRoutingModule } from './add-coupons-routing.module';
import { AddCouponsComponent } from './add-coupons/add-coupons.component';
import { SharedModule } from '../../../../shared/shared.module';
import { MatCardModule } from '@angular/material/card';
import { FormsModule }   from '@angular/forms';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTabsModule } from '@angular/material/tabs';
import { EditorModule } from '@tinymce/tinymce-angular';
import {MatDialogModule} from '@angular/material/dialog';
import {MatButtonToggleModule} from '@angular/material/button-toggle';

@NgModule({
  declarations: [AddCouponsComponent],
  imports: [
    CommonModule,
    AddCouponsRoutingModule,
    SharedModule,
    MatCardModule,
    FormsModule,
    MatExpansionModule,
    MatTabsModule,
    EditorModule,
    MatDialogModule,
    MatButtonToggleModule
  ]
})
export class AddCouponsModule { }
