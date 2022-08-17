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
  selector: 'dieatry-image-dialog',
  templateUrl: './dieatry-image-dialog.component.html',
  styleUrls: ['./dieatry-image-dialog.component.scss']
})
export class DieatryImageDialog implements OnInit {

  @ViewChild('uploadImgEl') uploadImgElRef: ElementRef;
  public imgBaseUrl = localStorage.getItem("imgBaseUrl");
  public imageUploading: boolean = false;
  public showImageError: boolean = false;
  public dieatryImagePath = '';
  imageErr: boolean;
  imageErrMsg: string;
  imgUploadDieatry: boolean;
  dieatryImageGroup: FormGroup;
  public dieatryDetails = {};

  constructor(private dialogRef: MatDialogRef<DieatryImageDialog>,
    private uploadFile: UploadFile,
    private fb: FormBuilder,
    public snackBar: MatSnackBar,
    public dialog: MatDialog) {
    this.buildDieatryImageForm();
    dialogRef.disableClose = true;
  }

  ngOnInit() {
  }
  public buildDieatryImageForm() {
    this.imageErr = false;
    this.imageErrMsg = "";
    this.dieatryImagePath = '';
    let form = {
      name: ['', Validators.compose([Validators.required, Validators.minLength(2)])]
    };
    this.dieatryImageGroup = this.fb.group(form);
  }

  public uploadImageDieatry(event: FileList) {
    this.imageErr = false;
    this.imageErrMsg = "";
    this.imgUploadDieatry = true;
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
              this.dieatryImagePath = response['message'];
              console.log(this.dieatryImagePath);
              this.imgUploadDieatry = false;
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
    this.dieatryImagePath = "";
  }
  createContact(formData) {
    if (this.dieatryImageGroup.invalid) {
    } else {
      this.dieatryDetails = {
        imgPath: this.dieatryImagePath,
        name: formData.name
      };
      this.dialogRef.componentInstance.dieatryDetails = this.dieatryDetails;
      this.dialogRef.close(this.dieatryDetails);
    }
  }
  onCloseClick(): void {
    this.dialogRef.close();
  }
}

