import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EditCouponsRoutingModule } from './edit-coupons-routing.module';
import { EditCouponsComponent } from './edit-coupons/edit-coupons.component';

import { SharedModule } from '../../../../shared/shared.module';
import { MatCardModule } from '@angular/material/card';
import { FormsModule }   from '@angular/forms';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTabsModule } from '@angular/material/tabs';
import { EditorModule } from '@tinymce/tinymce-angular';
import {MatDialogModule} from '@angular/material/dialog';
import {MatButtonToggleModule} from '@angular/material/button-toggle';

@NgModule({
  declarations: [EditCouponsComponent],
  imports: [
    CommonModule,
    EditCouponsRoutingModule,
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
export class EditCouponsModule { }
