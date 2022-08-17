import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatRippleModule} from '@angular/material/core';

import { AddEventsRoutingModule } from './add-events-routing.module';
import { AddEventsComponent } from './add-events/add-events.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatAutocompleteModule, MatCardModule, MatDialogModule, MatPaginatorModule, MatTabsModule, MatTooltipModule } from '@angular/material';
import { FormsModule } from '@angular/forms';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { EmojiModule } from '@ctrl/ngx-emoji-mart/ngx-emoji';
import { PickerModule } from '@ctrl/ngx-emoji-mart';
import {
   MatTableModule
} from '@angular/material';
import { CdkTableModule } from '@angular/cdk/table';
import { MalihuScrollbarModule } from 'ngx-malihu-scrollbar';

@NgModule({
  declarations: [AddEventsComponent],
  imports: [
    CommonModule,
    AddEventsRoutingModule,
    SharedModule,
    MatCardModule,
    FormsModule,
    MatTabsModule,
    MatAutocompleteModule,
    MatTableModule,
    CdkTableModule,
    MatPaginatorModule,
    MatDialogModule,
    MatTooltipModule,
    MatRippleModule,
    MalihuScrollbarModule.forRoot(),
    PickerModule,
    EmojiModule,
    NgxMatSelectSearchModule

  ]
})
export class AddEventsModule { }
