import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddComboRoutingModule } from './add-combo-routing.module';
import { AddComboComponent } from './add-combo/add-combo.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatCardModule, MatTableModule, MatPaginatorModule, MatDialogModule,MatTabsModule } from '@angular/material';
import { CdkTableModule } from '@angular/cdk/table';
import { ReactiveFormsModule } from '@angular/forms';
import { MalihuScrollbarModule } from 'ngx-malihu-scrollbar';
import { FormsModule }   from '@angular/forms';
import { EditorModule } from '@tinymce/tinymce-angular';
import { MatExpansionModule } from '@angular/material/expansion';
// import { CategoryPopupComponent } from '../categoryPopup/categoryPopup.component';
// import { ProductPopupComponent } from '../productPopup/productPopup.component';
// import {VarientDialogComponent} from '../varientDialog/varientDialog.component';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
@NgModule({
  declarations: [AddComboComponent,],
 
  imports: [
    CommonModule,
    AddComboRoutingModule,
    SharedModule,
    MatCardModule,
    MatTableModule,
    CdkTableModule,
    MatPaginatorModule,
    ReactiveFormsModule,
    MatDialogModule,
    MalihuScrollbarModule,
    MatTabsModule,
    FormsModule,
    EditorModule,
    MatExpansionModule,
    NgxMatSelectSearchModule,
    MatAutocompleteModule
  ]
})
export class AddComboModule { }
