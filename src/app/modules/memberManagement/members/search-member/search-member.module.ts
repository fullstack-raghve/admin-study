import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SearchMemberRoutingModule } from './search-member-routing.module';
import { SearchMemberComponent } from './search-member/search-member.component';
import { MatTableModule } from '@angular/material';
import { MatDialogModule } from '@angular/material/dialog';
import { SharedModule } from '../../../../shared/shared.module';
import { MatCardModule } from '@angular/material/card';
import { CdkTableModule } from '@angular/cdk/table';
import { MatPaginatorModule , MatInputModule} from '@angular/material';
import { ReactiveFormsModule } from '@angular/forms';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
@NgModule({
  declarations: [SearchMemberComponent],
  imports: [
    CommonModule,
    SearchMemberRoutingModule,
    SharedModule,
    MatCardModule,
    MatTableModule,
    CdkTableModule,
    MatPaginatorModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    MatDialogModule
  ]
})
export class SearchMemberModule { }
