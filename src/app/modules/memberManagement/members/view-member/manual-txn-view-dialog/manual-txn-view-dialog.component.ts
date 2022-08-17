import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { HttpService } from 'src/app/services/http-service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'manual-txn-view-dialog',
  templateUrl: './manual-txn-view-dialog.component.html',
  styleUrls: ['./manual-txn-view-dialog.component.scss']
})
export class ManualTxnViewDialogComponent implements OnInit {
  public manualDebitCreditDetails: any=[];
  public txnId: any;
  public alignCss=[];

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private https: HttpService, private dialogRef: MatDialogRef<MatDialog>) {
    dialogRef.disableClose = true;
  }

  ngOnInit() {
    this.txnId = this.data.txnOid;
    this.getManualDebitCredit();
  }
  public getManualDebitCredit(){
    let request = {
        "debitCreditPointId": this.txnId
    }
    let GET_MANUAL_DEBIT_CREDIT = environment.APIEndpoint + "api/rpa/memberTransactions/v1/get/manualDebitCredit";
    this.https.postJson(GET_MANUAL_DEBIT_CREDIT, request).subscribe((response) =>{
        console.log(response);
        this.manualDebitCreditDetails = response;
        for(let des of this.manualDebitCreditDetails['debitCreditPointsLocales']){
          this.alignCss.push(des.langDirection == 'RTL' ? 'text-right' : '');
      }
    })
  }

  onCloseClick(): void {
    this.dialogRef.close();
  }
}
