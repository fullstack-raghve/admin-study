import { Component, OnInit, ViewChild, ChangeDetectorRef, ElementRef } from '@angular/core';
import { FormControl, Validators, FormBuilder, FormGroup, FormArray, AbstractControl } from '@angular/forms';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent, MatSnackBar } from '@angular/material';
import { HttpService } from 'src/app/services/http-service';
import { environment } from 'src/environments/environment';
import { Router, ActivatedRoute } from '@angular/router';
import { productsDialog } from '../../../../../shared/components/products-dialog/products-dialog.component';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { UploadFile } from 'src/app/services/uploadFile.service';
import { SnackBarComponent } from 'src/app/shared/components/snack-bar/snack-bar.component';

@Component({
  selector: 'app-bulk-upload',
  templateUrl: './bulk-upload.component.html',
  styleUrls: ['./bulk-upload.component.scss']
})
export class BulkUploadComponent implements OnInit {
  bulkUploadForm: FormGroup;
  public imgUpload = false;
  public imageUploading: boolean = false;
  public ruleImagePath = '';
  public showImageError: boolean = false;
  public imgPathUrl = localStorage.getItem("imgBaseUrl");
  public filePathUrl = localStorage.getItem("imgBaseUrl");
  corporateDetails = [];
  public imagePath: string = '';
  public manualFilePath: any = [];
  public manualFileName = '';
  public manualErrorFile = '';
  public skuFilePath = '';
  public skuFileName = '';
  public skuErrorFile = '';
  public manualErrorFileName = '';
  public skuErrorFileName = '';
  public submitForm = true;
  public manualFileRequired = false;
  public validCouponCode = false;
  public validCouponRequired = false;
  public skuRequired = false;
  public validSkuFile = true;
  fileName;
  @ViewChild('uploadImgEl') uploadImgElRef: ElementRef;
  uploadedFile: File;
  filePathName: string;
  constructor(private fb: FormBuilder, private http: HttpService, private https: HttpService, private uploadFile: UploadFile,
    private router: Router, private changeDetectorRef: ChangeDetectorRef,
    public snackBar: MatSnackBar, private activatedRoute: ActivatedRoute, private dialogRef: MatDialogRef<MatDialog>,
    public dialog: MatDialog, ) {
    this.buildBulkUploadForm();
    dialogRef.disableClose = true;
  }

  ngOnInit() {
    this.getCorporateId()
  }
  public buildBulkUploadForm() {
    this.bulkUploadForm = this.fb.group({
      corporateName:['', Validators.compose([Validators.required])],
      // imgPath:[""]
    });
  }
  onCloseClick() {
    this.dialogRef.close();
  }
  createbulkUploadForm(formData) {
    console.log(formData);
    console.log(this.imagePath);

    if (formData.corporateName != null && formData.corporateName != "" && this.bulkUploadForm.valid) {
      if (this.uploadedFile != undefined && this.uploadedFile != null) {

        // uploading file while clicking update botton directly
        if (this.uploadedFile.size < 3000000) {
          if (this.uploadedFile.type == "application/vnd.ms-excel" || this.uploadedFile.type == "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
            this.uploadFile.upload(this.uploadedFile, 'brandCategory', 'images')
            this.imageUploading = true;
            let new_file = new File([this.imagePath], 'file');
            console.log(new_file);
            this.uploadFile.uploadRecipientBulk(this.uploadedFile, this.uploadedFile.type, formData.corporateName)
              .subscribe((response) => {
                this.imagePath = response['Saved Location'];
                this.imageUploading = false;
                this.showImageError = false;
                this.uploadImgElRef.nativeElement.value = ''
                console.log(this.imagePath);
                console.log("res ::: " + response)

                this.snackBar.openFromComponent(SnackBarComponent, {
                  duration: 1500,
                  data: {
                    status: "success",
                    message: " Updated Successfully"
                  }

                });
                this.dialogRef.close();
              },

                (error) => {
                  console.log(typeof (error));

                  console.log(JSON.stringify(error));
                  this.snackBar.openFromComponent(SnackBarComponent, {
                    duration: 10000,
                    data: {
                      status: 'failure',
                      message: error.error['Error_message'][0]
                    }
                  });
                }
              )
          }

        }
      }
      else {
        this.snackBar.openFromComponent(SnackBarComponent, {
          duration: 1500,
          data: {
            status: "failure",
            message: "Please select a file"
          }

        });




      }
    }
  }   // corporate id 
  getCorporateId() {
    let data = {
      "searchText": ""
    }
    this.https.postJson1('https://ie5x8oge7g.execute-api.ap-south-1.amazonaws.com/corporateaccounts_sit/rest/api/v1/corporateaccounts/Get_Corporate', data).subscribe(res => {
      console.log(res);
      this.corporateDetails = res['Output'];
      console.log(this.corporateDetails);


    });
  }

  public uploadImage(event: FileList) {
    this.filePathName = '';
    if (event[0].size < 1000000) {

      if (event[0].type == "text/csv" || event[0].type == "application/vnd.ms-excel" || event[0].type == "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
        this.uploadedFile = event[0];
        console.log(this.uploadedFile);
        this.filePathName = this.uploadedFile['name']
        console.log(this.filePathName);
      }
      else {
        this.snackBar.openFromComponent(SnackBarComponent, {
          duration: 10000,
          data: {
            status: "failure",
            message: "Supported format is xls and xlsx"
          }
        });
      }
    } 
    else {

      this.snackBar.openFromComponent(SnackBarComponent, {
        duration: 10000,
        data: {
          status: "failure",
          message: "Max upload file size is 1Mb"
        }
      });
    }
  }
}
