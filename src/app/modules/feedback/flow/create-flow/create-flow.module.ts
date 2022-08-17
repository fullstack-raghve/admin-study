import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CreateFlowRoutingModule } from './create-flow-routing.module';
import { CreateFlowComponent } from './create-flow/create-flow.component';
import { SharedModule } from '../../../../shared/shared.module';
import { DndModule } from 'ngx-drag-drop';
import {MatTabsModule} from '@angular/material/tabs';
import { DragAndDropComponent } from './dragAndDropArea/dragAndDropArea.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { Ng5SliderModule } from 'ng5-slider';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { SelectAutocompleteModule } from 'mat-select-autocomplete';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';

@NgModule({
  declarations: [CreateFlowComponent, DragAndDropComponent],
  imports: [
    CommonModule,
    CreateFlowRoutingModule,
    SharedModule,
    DndModule,
    MatTabsModule,
    DragDropModule,
    Ng5SliderModule,
    CKEditorModule,
    SelectAutocompleteModule,
    NgxMatSelectSearchModule
  ]
})
export class CreateFlowModule { }
