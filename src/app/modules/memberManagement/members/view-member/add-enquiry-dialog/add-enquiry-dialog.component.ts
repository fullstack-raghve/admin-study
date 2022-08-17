import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { FormControl, FormGroup, Validators, FormBuilder, FormGroupDirective, FormArray, NgForm } from '@angular/forms';
import { HttpService } from 'src/app/services/http-service';
import { SnackBarComponent } from 'src/app/shared/components/snack-bar/snack-bar.component';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'add-enquiry-dialog',
  templateUrl: './add-enquiry-dialog.component.html',
  styleUrls: ['./add-enquiry-dialog.component.scss']
})
export class AddEnquiryDialogComponent implements OnInit {

  public addEnquiryFormGroup: FormGroup;
  public customerOid;
  public showError: boolean;
  public loading: boolean;
  public enquiryList = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<MatDialog>,
    private fb: FormBuilder,
    private https: HttpService,
    private router: Router,
    private http: HttpService,
    public snackBar: MatSnackBar,
  ) {
    dialogRef.disableClose = true;
    this.buildEnquiryForm();
  }

  ngOnInit() {
    this.customerOid = this.data.customerOid;
    this.getEnquiryTypeData();
  }

  public buildEnquiryForm() {
    let form = {
      enquiryType: ["", Validators.required],
      valueApplicable:  ['', Validators.compose([Validators.required, Validators.maxLength(50), Validators.pattern('^[0-9a-zA-Z"&,.: \"\'? _% -]{1,40}$')])],
      description: ["", Validators.required]
    }
    this.addEnquiryFormGroup = this.fb.group(form);
  }

  public getEnquiryTypeData() {
    let GET_ENQUIRY_TYPE = environment.APIEndpoint + 'api/rpa/master/enquiry/type/v1/get/list'
    this.http.getJson(GET_ENQUIRY_TYPE).subscribe((response) => {
      this.enquiryList = response;
    })
  }

  createEnquiry(formData) {
    if (this.addEnquiryFormGroup.invalid === true) {
      this.showError = false;
    } else {
      this.showError = true;
      const requestBody = {
        customerOid: this.customerOid,
        enquiryTypeId: formData.enquiryType,
        enquiryDescription: formData.description,
        isTransaction: false,
        valueApplicable: formData.valueApplicable
      };
      const CREATE_ENQUIRY = environment.APIEndpoint + 'api/rpa/enquiry/v1/create';
      this.http.postJson(CREATE_ENQUIRY, requestBody)
        .subscribe((response) => {
          console.log(response);
          this.snackBar.openFromComponent(SnackBarComponent, {
            duration: 10000,
            data: {
              status: 'success',
              message: 'Enquiry has been Created successfully'
            }
          });
          this.loading = false;
          this.dialogRef.close();
        }
          , err => {
            this.loading = false;
            console.log('error Status = ' + err);
            if (err.error.errorType === 'VALIDATION') {
              this.snackBar.openFromComponent(SnackBarComponent, {
                duration: 10000,
                data: {
                  status: 'failure',
                  message: err.error.errorDetails[0].description
                }
              });
            } else {
              this.snackBar.openFromComponent(SnackBarComponent, {
                duration: 10000,
                data: {
                  status: 'failure',
                  message: 'Your request cannot be saved at this time. Please try again later'
                }
              });
            }
          });
    }
  }

  onCloseClick(): void {
    this.dialogRef.close();
  }
}
