import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ViewProductRoutingModule } from './view-product-routing.module';
import { ViewProductComponent } from './view-product/view-product.component';
import { MatTableModule } from '@angular/material';
import { MatDialogModule } from '@angular/material/dialog';
import { SharedModule } from '../../../../shared/shared.module';
import { MatCardModule } from '@angular/material/card';
import { CdkTableModule } from '@angular/cdk/table';
import { MatPaginatorModule } from '@angular/material';
import { ReactiveFormsModule } from '@angular/forms';
@NgModule({
    declarations: [ViewProductComponent],
    imports: [
        CommonModule,
        ViewProductRoutingModule,
        SharedModule,
        MatCardModule,
        MatTableModule,
        CdkTableModule,
        MatPaginatorModule,
        ReactiveFormsModule,
        MatDialogModule
    ],
})
export class ViewProductDetailsModule {

}



