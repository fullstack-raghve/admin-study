import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddCorporateAccountRoutingModule } from './add-corporate-account-routing.module';
import { AddCorporateAccountComponent } from './add-corporate-account/add-corporate-account.component';
import { SharedModule } from 'src/app/shared/shared.module';

import { MatCardModule } from '@angular/material/card';
import { FormsModule }   from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';
import { EditorModule } from '@tinymce/tinymce-angular';
import { MalihuScrollbarModule } from 'ngx-malihu-scrollbar';
@NgModule({
  declarations: [AddCorporateAccountComponent],
  imports: [
    CommonModule,
    AddCorporateAccountRoutingModule,
    SharedModule,
    MatCardModule,
    MatTabsModule,
    EditorModule,
    MalihuScrollbarModule,MatDialogModule

  ]
  
})
export class AddCorporateAccountModule { }
