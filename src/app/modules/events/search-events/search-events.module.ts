import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatCardModule, MatTableModule, MatPaginatorModule, MatDialogModule } from '@angular/material';

import { SearchEventsRoutingModule } from './search-events-routing.module';
import { SearchEventsComponent } from './search-events/search-events.component';

@NgModule({
  declarations: [SearchEventsComponent],
  imports: [
    CommonModule,
    SearchEventsRoutingModule,
    SharedModule,
    MatCardModule, 
    MatTableModule, 
    MatPaginatorModule, 
    MatDialogModule 
  ]
 
})
export class SearchEventsModule { }
