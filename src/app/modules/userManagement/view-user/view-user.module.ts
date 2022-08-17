import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ViewUserRoutingModule } from './view-user-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatCardModule, MatTableModule, MatPaginatorModule, MatDialogModule, MatTabsModule } from '@angular/material';
import { CdkTableModule } from '@angular/cdk/table';
import { ReactiveFormsModule } from '@angular/forms';
import { ViewUserComponent } from './view-user/view-user.component';
import { MalihuScrollbarModule } from 'ngx-malihu-scrollbar';

@NgModule({
  declarations: [ ViewUserComponent ],
  imports: [
    CommonModule,
    ViewUserRoutingModule,
    SharedModule,
    MatCardModule,
    MatTableModule,
    CdkTableModule,
    MatPaginatorModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatTabsModule,
    MalihuScrollbarModule.forRoot(),
  ],
  entryComponents: [
    ViewUserComponent,
  ],
})
export class ViewUserModule { }
