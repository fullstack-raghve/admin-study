import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SearchAmenitiesRoutingModule } from './search-amenities-routing.module';
import { SearchAmenitiesComponent } from './search-amenities/search-amenities.component';
import { MatTableModule } from '@angular/material';
import { SharedModule } from '../../../../shared/shared.module';
import { MatCardModule } from '@angular/material/card';
import { CdkTableModule } from '@angular/cdk/table';
import { MatPaginatorModule , MatInputModule} from '@angular/material';
import { ReactiveFormsModule } from '@angular/forms';
@NgModule({
  declarations: [SearchAmenitiesComponent],
  imports: [
    CommonModule,
    SearchAmenitiesRoutingModule,
    SharedModule,
    MatCardModule,
    MatTableModule,
    CdkTableModule,
    MatPaginatorModule,
    ReactiveFormsModule,
  ]
})
export class SearchAmenitiesModule { }
