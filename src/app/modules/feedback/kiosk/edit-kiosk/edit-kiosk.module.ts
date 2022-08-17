import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EditKioskRoutingModule } from './edit-kiosk-routing.module';
import { EditKioskComponent } from './edit-kiosk/edit-kiosk.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatCardModule, MatTableModule, MatPaginatorModule, MatDialogModule } from '@angular/material';
import { CdkTableModule } from '@angular/cdk/table';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { KioskSelectedUserComponent } from '../kiosk-selected-user/kiosk-selected-user.component';
import {MatAutocompleteModule} from '@angular/material/autocomplete';


@NgModule({
  declarations: [EditKioskComponent],
  imports: [
    CommonModule,
    EditKioskRoutingModule,
    SharedModule,
    MatCardModule,
    MatTableModule,
    CdkTableModule,
    MatPaginatorModule,
    ReactiveFormsModule,
    MatDialogModule,
    FormsModule,
    MatAutocompleteModule
  ],

})
export class EditKioskModule { }
