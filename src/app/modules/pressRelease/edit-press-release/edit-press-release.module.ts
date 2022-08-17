import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditPressReleaseRoutingModule } from './edit-press-release-routing.module';
import { EditPressReleaseComponent } from './edit-press-release/edit-press-release.component';
import { SharedModule } from '../../../shared/shared.module';
import { MatCardModule } from '@angular/material/card';
import { FormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { SelectAutocompleteModule } from 'mat-select-autocomplete';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';

@NgModule({
  declarations: [EditPressReleaseComponent],
  imports: [
    CommonModule,
    EditPressReleaseRoutingModule,
    SharedModule,
    MatCardModule,
    MatAutocompleteModule,
    FormsModule,
    SelectAutocompleteModule,
    NgxMatSelectSearchModule,
  ]
})
export class EditPressReleaseModule { }
