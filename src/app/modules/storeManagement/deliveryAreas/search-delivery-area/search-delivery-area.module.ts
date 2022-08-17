import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SearchDeliveryAreaRoutingModule } from './search-delivery-area-routing.module';
import { SearchDeliveryAreaComponent } from './search-delivery-area/search-delivery-area.component';

import { MatTableModule } from '@angular/material';
import { SharedModule } from '../../../../shared/shared.module';
import { MatCardModule } from '@angular/material/card';
import { CdkTableModule } from '@angular/cdk/table';
import { MatPaginatorModule , MatInputModule} from '@angular/material';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [SearchDeliveryAreaComponent],
  imports: [
    CommonModule,
    SearchDeliveryAreaRoutingModule,
    SharedModule,
    MatCardModule,
    MatTableModule,
    CdkTableModule,
    MatPaginatorModule,
    ReactiveFormsModule
  ]
})
export class SearchDeliveryAreaModule { }
