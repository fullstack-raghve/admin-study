import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ViewProductsRoutingModule } from './view-products-routing.module';
import { ViewProductsComponent } from './view-products/view-products.component';
import { SharedModule } from '../../../../shared/shared.module';
import { MatCardModule, MatTableModule, MatPaginatorModule, MatDialogModule, MatTabsModule } from '@angular/material';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { MatExpansionModule } from '@angular/material/expansion';
import { MalihuScrollbarModule } from 'ngx-malihu-scrollbar';
import { AddOnsComponent } from './addOns-dialog/addOns-dialog.component';
import { BeveragesDialogComponent } from './beverages-dialog/beverages-dialog.component';
import { BreadsDialogComponent } from './breads-dialog/breads-dialog.component';
import { StoreDialogComponent } from './store-dialog/store-dialog.component';
// import { ViewStoreDialogComponent } from '../../../../shared/components/view-store-dialog/view-store-dialog.component';
import { ViewVariantStoreDialogComponent } from './view-store-dialog/view-store-dialog.component';
import { VariantsAddStoreDialogComponent } from './add-store-variant/add-store-variant.component';
import { CdkTableModule } from '@angular/cdk/table';
// import {SelectionModel} from '@angular/cdk/collections';
import { Observable, pipe } from 'rxjs';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {VarientDialogComponent} from  '../view-products/varient-dialog/varient-dialog.component';
import { CrossSellAddOnsComponent } from './crossSell-addOns-dialog/crossSell-addOns-dialog.component';
@NgModule({
  declarations: [
    ViewProductsComponent,
    AddOnsComponent,
    BeveragesDialogComponent,
    BreadsDialogComponent,
    StoreDialogComponent,
    // ViewStoreDialogComponent,
    ViewVariantStoreDialogComponent,
    VarientDialogComponent,
    CrossSellAddOnsComponent,
    VariantsAddStoreDialogComponent],
  imports: [
    CommonModule,
    ViewProductsRoutingModule,
    MatDialogModule,
    SharedModule,
    MatCardModule,
    MatExpansionModule,
    MatTabsModule,
    MalihuScrollbarModule,
    MatPaginatorModule,
    MatTableModule,
    MatAutocompleteModule,
    FormsModule,
    // SelectionModel,
    CdkTableModule
  ],
  entryComponents: [
    AddOnsComponent,
    BeveragesDialogComponent,
    BreadsDialogComponent,
    StoreDialogComponent,
    // ViewStoreDialogComponent,
    ViewVariantStoreDialogComponent,
    VariantsAddStoreDialogComponent,
    CrossSellAddOnsComponent,
    VarientDialogComponent
  ],
})
export class ViewProductsModule { }
