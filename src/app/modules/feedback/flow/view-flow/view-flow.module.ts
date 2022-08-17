import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ViewFlowRoutingModule } from './view-flow-routing.module';
import { ViewFlowComponent } from './view-flow/view-flow.component';
import { SharedModule } from '../../../../shared/shared.module';
import { DndModule } from 'ngx-drag-drop';
import {MatTabsModule} from '@angular/material/tabs';
import { DragAndDropComponent } from './dragAndDropArea/dragAndDropArea.component';
import {DragDropModule} from '@angular/cdk/drag-drop';
import { Ng5SliderModule } from 'ng5-slider';
import {DumpFlowDialogComponent} from './dump-flow-dialog/dump-flow-dialog.component';
@NgModule({
  declarations: [
    ViewFlowComponent,
    DragAndDropComponent ,
    DumpFlowDialogComponent
  ],
  imports: [
    CommonModule,
    ViewFlowRoutingModule,
    SharedModule,
    DndModule,
    MatTabsModule,
    DragDropModule,
    Ng5SliderModule
  ],
  entryComponents:[DumpFlowDialogComponent]
})
export class ViewFlowModule { }
