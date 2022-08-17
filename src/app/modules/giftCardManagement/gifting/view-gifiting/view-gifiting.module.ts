import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ViewGifitingRoutingModule } from './view-gifiting-routing.module';
import { ViewGifitingComponent } from './view-gifiting/view-gifiting.component';
import { SharedModule } from '../../../../../../src/app/shared/shared.module';
import {MatTableModule} from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import {MatPaginatorModule} from '@angular/material/paginator';
// import { ViewGiftingTncDialogComponent } from './view-gifting-tnc-dialog/view-gifting-tnc-dialog.component';
@NgModule({
  declarations: [ViewGifitingComponent, ],
  imports: [
    CommonModule,
    ViewGifitingRoutingModule,
    SharedModule,
    MatTableModule,MatCardModule,MatPaginatorModule
  ]
})
export class ViewGifitingModule { }
