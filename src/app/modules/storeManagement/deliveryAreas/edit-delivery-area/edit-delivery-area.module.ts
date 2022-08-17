import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EditDeliveryAreaRoutingModule } from './edit-delivery-area-routing.module';
import { EditDeliveryAreaComponent } from './edit-delivery-area/edit-delivery-area.component';


import { SharedModule } from '../../../../shared/shared.module';
import { MatCardModule } from '@angular/material/card';
import { FormsModule }   from '@angular/forms';
import { MatTableModule } from '@angular/material';
import { MatPaginatorModule , MatInputModule} from '@angular/material';
import {MatDialogModule} from '@angular/material/dialog';
import {DragDropModule} from '@angular/cdk/drag-drop';
import { MalihuScrollbarModule } from 'ngx-malihu-scrollbar';
@NgModule({
  declarations: [EditDeliveryAreaComponent],
  imports: [
    CommonModule,
    EditDeliveryAreaRoutingModule,
    SharedModule,
    MatCardModule,
    FormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatInputModule,
    MatDialogModule,
    DragDropModule,
    MalihuScrollbarModule
  ]
})
export class EditDeliveryAreaModule { }
