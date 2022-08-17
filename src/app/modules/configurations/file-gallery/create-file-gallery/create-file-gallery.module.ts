import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../../shared/shared.module';
import { MatCardModule } from '@angular/material/card';
import { FormsModule }   from '@angular/forms';
import { CreateFileGalleryComponent } from './create-file-gallery/create-file-gallery.component';
import { CreateFileGalleryRoutingModule } from './create-file-gallery-routing.module';
import { AddDirectoryDialogComponent } from './add-directory-dialog/add-directory-dialog.component';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig } from '@angular/material';
import { NgImageSliderModule } from 'ng-image-slider';
import { MatPaginatorModule , MatInputModule} from '@angular/material';

@NgModule({
  declarations: [CreateFileGalleryComponent,AddDirectoryDialogComponent],
  imports: [
    CommonModule,
    CreateFileGalleryRoutingModule,
    SharedModule,
    MatCardModule,
    FormsModule,
    MatPaginatorModule,
    NgImageSliderModule
  ],
  entryComponents: [
    AddDirectoryDialogComponent
  ]
})
export class CreateFileGalleryModule { }
