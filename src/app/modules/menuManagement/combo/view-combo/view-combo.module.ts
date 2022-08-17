import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ViewComboRoutingModule } from './view-combo-routing.module';
import { ViewComboComponent } from './view-combo/view-combo.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatCardModule, MatTableModule, MatPaginatorModule, MatDialogModule,MatTabsModule, MatExpansionModule, MatAutocompleteModule } from '@angular/material';
import { CdkTableModule } from '@angular/cdk/table';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MalihuScrollbarModule } from 'ngx-malihu-scrollbar';
import { EditorModule } from '@tinymce/tinymce-angular';

@NgModule({
  declarations: [ViewComboComponent],
  imports: [
    CommonModule,
    ViewComboRoutingModule,
    SharedModule,
    MatCardModule,
    MatTableModule,
    CdkTableModule,
    MatPaginatorModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatTabsModule,
    MatExpansionModule,
    MalihuScrollbarModule.forRoot(),  
    MatAutocompleteModule,
    FormsModule,
    EditorModule,
    // SelectionModel,
  ]
})
export class ViewComboModule { }
