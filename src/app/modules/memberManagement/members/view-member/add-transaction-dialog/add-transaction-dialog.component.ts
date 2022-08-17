import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { FormControl, FormGroup, Validators, FormBuilder, FormGroupDirective, FormArray, NgForm } from '@angular/forms';
import { HttpService } from 'src/app/services/http-service';
import { SnackBarComponent } from 'src/app/shared/components/snack-bar/snack-bar.component';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'add-transaction-dialog.component',
  templateUrl: './add-transaction-dialog.component.html',
  styleUrls: ['./add-transaction-dialog.component.scss']
})
export class AddTransactionDialogComponent implements OnInit {
  public enterBarCode: any = '';
  public responseMsg = '';
  addTxnFormGroup: FormGroup;
  addTransBtnDisplay: boolean = true;
  loadingResponse: boolean = false;
  errormesVal: boolean = false;
  resetDisplay: boolean = false;
  public customerOid;
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
      txnId: ["", Validators.required]
    }
    this.addTxnFormGroup = this.fb.group(form);
  }

  public addTransaction() {
    this.loadingResponse = true;
    let formdata = this.addTxnFormGroup.value;
    let data = {
      customerOid: this.customerOid,
      txnId: formdata.txnId
    }

    this.https.postJson(environment.APIEndpoint + 'api/rpa/addTxn/v1/checkTransaction', data)
      .subscribe(
        (response) => {
          this.loadingResponse = false;
          console.log(JSON.stringify(response));
          if (response['status'] == 'failure') {
            this.responseMsg = response['message'];
            this.errormesVal = true;
            if (this.responseMsg) {
              this.addTransBtnDisplay = false;
              this.resetDisplay = true;
            }
          } else {
            this.router.navigate(['/confirm-transaction-details/' + this.customerOid + '/' + formdata.txnId]);
            this.dialogRef.close();
            this.errormesVal = false;
          }
        },
        (err) => {
          console.log(err);
        });
  }
  resetVal(){
    this.defineFormGroup();
    this.errormesVal = false;
    this.resetDisplay = false;
    this.addTransBtnDisplay = true;
  }
}
