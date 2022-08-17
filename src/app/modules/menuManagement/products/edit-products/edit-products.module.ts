import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EditProductsRoutingModule } from './edit-products-routing.module';
import { EditProductsComponent } from './edit-products/edit-products.component';
import { SharedModule } from '../../../../shared/shared.module';
import { MatCardModule } from '@angular/material/card';
import { FormsModule }   from '@angular/forms';
import { MalihuScrollbarModule } from 'ngx-malihu-scrollbar';
import { MatExpansionModule } from '@angular/material/expansion';
// import { DieatryImageDialog } from '../dieatry-image-dialog/dieatry-image-dialog.component';
// import { AlergionImageDialog } from '../alergion-image-dialog/alergion-image-dialog.component';
@NgModule({
  declarations: [EditProductsComponent
  ],
  imports: [
    CommonModule,
    EditProductsRoutingModule,
    SharedModule,
    MatCardModule,
    FormsModule,
    MatExpansionModule,
    MalihuScrollbarModule.forRoot(),
],
  // entryComponents: [  
  //   DieatryImageDialog,
  //   AlergionImageDialog
  // ],
})
export class EditProductsModule { }
