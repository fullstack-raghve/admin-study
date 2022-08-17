import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ViewStoreRoutingModule } from './view-store-routing.module';
import { ViewStoreComponent } from './view-store/view-store.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatCardModule, MatTableModule, MatPaginatorModule, MatDialogModule, MatTabsModule } from '@angular/material';
import { CdkTableModule } from '@angular/cdk/table';
import { ReactiveFormsModule } from '@angular/forms';
import { MalihuScrollbarModule } from 'ngx-malihu-scrollbar';
import { NgxQRCodeModule } from 'ngx-qrcode2';

@NgModule({
  declarations: [ViewStoreComponent],
  imports: [
    CommonModule,
    ViewStoreRoutingModule,
    SharedModule,
    NgxQRCodeModule,
    MatCardModule,
    MatTableModule,
    CdkTableModule,
    MatPaginatorModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatTabsModule,
    MalihuScrollbarModule.forRoot(),
],
entryComponents: [
   ViewStoreComponent,
 ],
 schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class ViewStoreModule { }
