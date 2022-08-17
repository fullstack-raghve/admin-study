import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EditComboRoutingModule } from './edit-combo-routing.module';
import { EditComboComponent } from './edit-combo/edit-combo.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatCardModule, MatTableModule, MatPaginatorModule, MatDialogModule,MatTabsModule, MatExpansionModule } from '@angular/material';
import { CdkTableModule } from '@angular/cdk/table';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MalihuScrollbarModule } from 'ngx-malihu-scrollbar';
import { EditorModule } from '@tinymce/tinymce-angular';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import {MatAutocompleteModule} from '@angular/material/autocomplete';

@NgModule({
  declarations: [EditComboComponent],

  imports: [
    CommonModule,
    EditComboRoutingModule,
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
export class EditComboModule { }
