import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SearchCampaignRoutingModule } from './search-campaign-routing.module';
import { SearchCampaignComponent } from './search-campaign/search-campaign.component';

import {
  MatPaginator, MatSort, MatTable, MatTableModule, MatTabHeader,
  MatHeaderRow, MatHeaderCell, MatHeaderCellDef, MatHeaderRowDef,
  MatSortHeader, MatRow, MatRowDef,  MatCell, MatCellDef, MatSortModule, MatInputModule
} from '@angular/material';
//import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material';
import {MatDialogModule} from '@angular/material/dialog';
import { SharedModule } from '../../../../shared/shared.module';
import { MatCardModule } from '@angular/material/card';
import {CdkTableModule} from '@angular/cdk/table';
import { ReactiveFormsModule } from '@angular/forms';
import {MatTooltipModule} from '@angular/material';


@NgModule({
  declarations: [SearchCampaignComponent],
  imports: [
    MatInputModule,
    CommonModule,
    SearchCampaignRoutingModule,
    SharedModule,
    MatCardModule,
    MatTableModule,
    CdkTableModule,
    MatPaginatorModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatTooltipModule
  ]
})

export class SearchCampaignModule { }
