import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EditUserRoutingModule } from './edit-user-routing.module';
import { EditUserComponent } from './edit-user/edit-user.component';
import { MatCardModule, MatTableModule, MatPaginatorModule, MatDialogModule, MatTabsModule } from '@angular/material';
import { CdkTableModule } from '@angular/cdk/table';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { MalihuScrollbarModule } from 'ngx-malihu-scrollbar';
import {MatAutocompleteModule} from '@angular/material/autocomplete';

@NgModule({
  declarations: [EditUserComponent],
  imports: [
    CommonModule,
    EditUserRoutingModule,
    // EditUserComponent,
    SharedModule,
    CommonModule,
    MatCardModule,
    MatTableModule,
    CdkTableModule,
    MatPaginatorModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatDialogModule,
    MatTabsModule,
    MalihuScrollbarModule.forRoot(),
  ]
})
export class EditUserModule { }
