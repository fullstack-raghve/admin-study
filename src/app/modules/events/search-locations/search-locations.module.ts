import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatCardModule, MatTableModule, MatPaginatorModule, MatDialogModule } from '@angular/material';

import { SearchLocationsRoutingModule } from './search-locations-routing.module';
import { SearchLocationsComponent } from './search-locations/search-locations.component';

@NgModule({
  declarations: [SearchLocationsComponent],
  imports: [
    CommonModule,
    SearchLocationsRoutingModule,
    SharedModule,
    MatCardModule, 
    MatTableModule, 
    MatPaginatorModule, 
    MatDialogModule 
  ]
})
export class SearchLocationsModule { }
