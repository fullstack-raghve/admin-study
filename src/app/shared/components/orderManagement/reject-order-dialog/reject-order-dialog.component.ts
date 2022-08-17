import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { HttpService } from 'src/app/services/http-service';
import { environment } from 'src/environments/environment';
import { FormBuilder, Validators, FormControl, FormGroup } from '@angular/forms';
import { SnackBarComponent } from 'src/app/shared/components/snack-bar/snack-bar.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reject-order-dialog',
  templateUrl: './reject-order-dialog.component.html',
  styleUrls: ['./reject-order-dialog.component.scss']
})
export class RejectOrderDialogComponent implements OnInit {

  @ViewChild("rejectOrderForm") rejectOrderForm;

  public rejectOrderFormGroup: FormGroup;
  public orderId: number;
  popUpType: any;
  public pageLoader:boolean = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<MatDialog>,
    private https: HttpService,
    public snackBar: MatSnackBar,
    private router: Router,
    private fb: FormBuilder) {
      dialogRef.disableClose = true;
     }

  ngOnInit() {
    this.orderId = this.data.orderId;
    this.popUpType = this.data.type;
    this.buildRejectForm();
  }

  buildRejectForm() {
    this.rejectOrderFormGroup = this.fb.group({
      reasonForReject: ["", Validators.required],
      reasonDescription: ["", Validators.required],
    });
  }

  rejectOrder(formData) {
    this.pageLoader = true;
    if (this.rejectOrderFormGroup.invalid === true) {
      this.pageLoader = false;
    } else {
      const REJECT_ORDER = environment.APIEndpoint + 'api/rpa/order/v2/updateOrderStatus';
      let request = {
        orderId: this.orderId,
        orderStatus: this.popUpType,
        rejectedReason: formData.reasonForReject,
        rejectedReasonDesc: formData.reasonDescription
      }
      this.https.postJson(REJECT_ORDER, request).subscribe((response) => {
        this.pageLoader = false;
        this.dialogRef.close(this.popUpType);
        // if (this.popUpType == 'reject') {
        // }else{
        //   this.dialogRef.close(this.popUpType);
        // }
        this.snackBar.openFromComponent(SnackBarComponent, {
        duration: 1000,
        data: {
          status: "success",
          message: "Order rejected successfully."
        }
      });
      }, (err) => {
        this.pageLoader = false;
        if (err.error.errorType == 'VALIDATION') {
          this.snackBar.openFromComponent(SnackBarComponent, {
            duration: 10000,
            data: {
              status: "failure",
              message: err.error.errorDetails[0].description
            }
          });
        } else {
          this.pageLoader = false;
          this.snackBar.openFromComponent(SnackBarComponent, {
            duration: 10000,
            data: {
              status: "failure",
              message: "Your request cannot be saved at this time. Please try again later"
            }
          });
        }
        this.dialogRef.close(false);
      })
    }
  }

  onCloseClick(): void {
    this.dialogRef.close();
  }
}
