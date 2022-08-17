import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ViewGiftCardRoutingModule } from './view-gift-card-routing.module';
import { ViewGiftCardComponent } from './view-gift-card/view-gift-card.component';
import { SharedModule } from 'src/app/shared/shared.module';
// import { ViewGiftCardProductDialogComponent } from './view-gift-card-product-dialog/view-gift-card-product-dialog.component';

@NgModule({
  declarations: [ViewGiftCardComponent,],
  imports: [
    CommonModule,
    ViewGiftCardRoutingModule,
    SharedModule
  ]
})
export class ViewGiftCardModule { }
