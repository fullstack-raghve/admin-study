import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddProductsRoutingModule } from './add-products-routing.module';
import { AddProductsComponent} from './add-products/add-products.component';
import { SharedModule } from '../../../../shared/shared.module';
import { MatCardModule } from '@angular/material/card';
import { FormsModule }   from '@angular/forms';
import { MalihuScrollbarModule } from 'ngx-malihu-scrollbar';
import { EditorModule } from '@tinymce/tinymce-angular';
import { MatExpansionModule } from '@angular/material/expansion';
import { DieatryImageDialog } from '../dieatry-image-dialog/dieatry-image-dialog.component';
import { AlergionImageDialog } from '../alergion-image-dialog/alergion-image-dialog.component';
@NgModule({
  declarations: [
    AddProductsComponent,
    // DieatryImageDialog,
    // AlergionImageDialog
  ],
  imports: [
    CommonModule,
    AddProductsRoutingModule,
    SharedModule,
    MatCardModule,
    FormsModule,
    EditorModule,
    MatExpansionModule,
    MalihuScrollbarModule.forRoot(),
],
// entryComponents: [
//   DieatryImageDialog,
//   AlergionImageDialog
// ]
})
export class AddProductsModule { }
