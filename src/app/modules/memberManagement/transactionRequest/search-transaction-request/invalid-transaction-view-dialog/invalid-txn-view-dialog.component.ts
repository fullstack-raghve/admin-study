import { Component, OnInit, Inject, Input } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { HttpService } from 'src/app/services/http-service';
import { environment } from 'src/environments/environment';



@Component({
  selector: 'invalid-txn-view-dialog',
  templateUrl: './invalid-txn-view-dialog.component.html',
  styleUrls: ['./invalid-txn-view-dialog.component.scss']
})
export class InvalidTxnViewDialogComponent implements OnInit {
  public manualDebitCreditDetails: any = [];
  public txnId: any;
  public alignCss = [];
  @Input('txnReqId') txnReqId: string;
  viewTxnDetails;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private https: HttpService, private dialogRef: MatDialogRef<MatDialog>) {
    dialogRef.disableClose = true;
  }

  ngOnInit() {
    this.getManualDebitCredit();
  }
  public getManualDebitCredit() {
    let request = {
      "transactionRequestOid": this.txnReqId
    }
    let VIEW_TRANSACTION_REQ = environment.APIEndpoint + "api/rpa/transaction/request/v1/view";
    this.https.postJson(VIEW_TRANSACTION_REQ, request).subscribe((response) => {
      console.log(response);
      this.viewTxnDetails = response;
    })
  }

  onCloseClick(): void {
    this.dialogRef.close();
  }
}
