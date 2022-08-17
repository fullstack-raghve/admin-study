import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SearchVariantsRoutingModule } from './search-variants-routing.module';
import { SearchVariantsComponent } from './search-variants/search-variants.component';
import { MatTableModule } from '@angular/material';
import { MatDialogModule } from '@angular/material/dialog';
import { SharedModule } from '../../../../shared/shared.module';
import { MatCardModule } from '@angular/material/card';
import { CdkTableModule } from '@angular/cdk/table';
import { MatPaginatorModule , MatInputModule} from '@angular/material';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [SearchVariantsComponent],
  imports: [
    CommonModule,
    SearchVariantsRoutingModule,
    SharedModule,
    MatCardModule,
    MatTableModule,
    CdkTableModule,
    MatPaginatorModule,
    ReactiveFormsModule,
    MatDialogModule
  ]
})
export class SearchVariantsModule { }
