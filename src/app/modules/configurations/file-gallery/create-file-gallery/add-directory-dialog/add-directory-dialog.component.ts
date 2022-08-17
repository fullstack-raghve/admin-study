import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { FormControl, FormGroup, Validators, FormBuilder, FormGroupDirective, FormArray, NgForm } from '@angular/forms';
import { HttpService } from 'src/app/services/http-service';
import { SnackBarComponent } from 'src/app/shared/components/snack-bar/snack-bar.component';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'add-directory-dialog.component',
  templateUrl: './add-directory-dialog.component.html',
  styleUrls: ['./add-directory-dialog.component.scss']
})

export class AddDirectoryDialogComponent implements OnInit {
  addDirectoryFormGroup: FormGroup;
  addDirectoryBtnDisplay: boolean = true;
  responseMsg: any;

  constructor(private dialogRef: MatDialogRef<MatDialog>, private fb: FormBuilder, private https: HttpService, private snackBar: MatSnackBar,
    private router: Router) {
    dialogRef.disableClose = true;
     this.defineFormGroup();
  }
  
  ngOnInit() {
  }

  onCloseClick(): void {
    this.dialogRef.close();
  }

  public defineFormGroup() {
    let form = {
      directoryName: ["", Validators.required]
    }
    this.addDirectoryFormGroup = this.fb.group(form);
  }

  public addDirectory() {
    let formdata = this.addDirectoryFormGroup.value;
    let data = {
      directoryName: formdata.directoryName,
    }

    this.https.postJson(environment.APIEndpoint + 'api/rpa/master/fileGallery/v1/createDirectory', data)
      .subscribe(
        (response) => {
          if (response['status'] == 'failure') {
            this.responseMsg = response['message'];
          } else {
            this.dialogRef.close();
          }
        },
        (err) => {
        });
  }
}
