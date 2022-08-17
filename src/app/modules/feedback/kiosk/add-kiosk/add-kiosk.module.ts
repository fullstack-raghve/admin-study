import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddKioskRoutingModule } from './add-kiosk-routing.module';
import { AddKioskComponent } from './add-kiosk/add-kiosk.component';
import { SharedModule } from '../../../../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule, MatPaginatorModule } from '@angular/material';
import { KioskSelectedUserComponent } from '../kiosk-selected-user/kiosk-selected-user.component';
import {MatAutocompleteModule} from '@angular/material/autocomplete';

@NgModule({
  declarations: [AddKioskComponent],
  imports: [
    CommonModule,
    AddKioskRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatPaginatorModule,
    MatAutocompleteModule
  ],

})
export class AddKioskModule { }
