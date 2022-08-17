import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EditFlowRoutingModule } from './edit-flow-routing.module';
import { EditFlowComponent } from './edit-flow/edit-flow.component';
import { SharedModule } from '../../../../shared/shared.module';
import { DndModule } from 'ngx-drag-drop';
import {MatTabsModule} from '@angular/material/tabs';
import { DragAndDropComponent } from './dragAndDropArea/dragAndDropArea.component';
import {DragDropModule} from '@angular/cdk/drag-drop';
import { Ng5SliderModule } from 'ng5-slider';
import { SelectAutocompleteModule } from 'mat-select-autocomplete';
@NgModule({
  declarations: [
    EditFlowComponent,
    DragAndDropComponent
  ],
  imports: [
    CommonModule,
    EditFlowRoutingModule,
    SharedModule,
    DndModule,
    MatTabsModule,
    DragDropModule,
    Ng5SliderModule,
    SelectAutocompleteModule
  ]
})
export class EditFlowModule { }
