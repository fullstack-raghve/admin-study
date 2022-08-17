import { Component, OnInit, ViewChild, ChangeDetectorRef, ElementRef } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SnackBarComponent } from 'src/app/shared/components/snack-bar/snack-bar.component';
import { MatChipInputEvent, MatSnackBar } from '@angular/material';
import { UploadFile } from 'src/app/services/uploadFile.service';
import {
  Validators,
  FormBuilder,
  FormGroup,
  FormArray,
  FormControl
} from "@angular/forms";

@Component({
  selector: 'alergion-image-dialog',
  templateUrl: './alergion-image-dialog.component.html',
  styleUrls: ['./alergion-image-dialog.component.scss']
})
export class AlergionImageDialog implements OnInit {

  @ViewChild('uploadImgEl') uploadImgElRef: ElementRef;
  public imgBaseUrl = localStorage.getItem("imgBaseUrl");
  public imageUploading: boolean = false;
  public showImageError: boolean = false;
  public alergionImagePath = '';
  imageErr: boolean;
  imageErrMsg: string;
  imgUploadAlergion: boolean;
  alergionImageGroup: FormGroup;
  public dieatryDetails = {};

  constructor(private dialogRef: MatDialogRef<AlergionImageDialog>,
    private uploadFile: UploadFile,
    private fb: FormBuilder,
    public snackBar: MatSnackBar,
    public dialog: MatDialog) {
    this.buildAlergionImageForm();
    dialogRef.disableClose = true;
  }

  ngOnInit() {
  }
  public buildAlergionImageForm() {
    this.imageErr = false;
    this.imageErrMsg = "";
    this.alergionImagePath = '';
    let form = {
      name: ['', Validators.compose([Validators.required, Validators.minLength(2)])]
    };
    this.alergionImageGroup = this.fb.group(form);
  }

  public uploadAlergionImage(event: FileList) {
    this.imageErr = false;
    this.imageErrMsg = "";
    this.imgUploadAlergion = true;
    if (
      event[0].type == "image/jpeg" ||
      event[0].type == "image/png" ||
      event[0].type == "image/jpg"
    ) {
      if (event[0].size < 1000000) {
        this.uploadFile
          .upload(event.item(0), "product", "images")
          .subscribe(
            response => {
              this.alergionImagePath = response['message'];
              console.log(this.alergionImagePath);
              this.imgUploadAlergion = false;
              this.uploadImgElRef.nativeElement.value = ''
              this.snackBar.openFromComponent(SnackBarComponent, {
                duration: 1500,
                data: {
                  status: "success",
                  message: " image successfully uploaded"
                }
              });
            },
            err => { }
          );
      } else {
        this.imageErr = true;
        this.imageErrMsg = "Max upload file size is 1Mb";
      }
    } else {
      this.imageErr = true;
      this.imageErrMsg = "Supported format is JPG, JPEG and PNG";
    }
  }

  public removeImage() {
    this.alergionImagePath = "";
  }

  createAlergion(formData) {
    if (this.alergionImageGroup.invalid) {
    } else {
      this.dieatryDetails = {
        imgPath: this.alergionImagePath,
        name: formData.name
      };
      this.dialogRef.componentInstance.dieatryDetails = this.dieatryDetails;
      this.dialogRef.close(this.dieatryDetails);
      // console.log('rajini' + this.dieatryDetails);
    }
  }
  onCloseClick(): void {
    this.dialogRef.close();
  }
}

