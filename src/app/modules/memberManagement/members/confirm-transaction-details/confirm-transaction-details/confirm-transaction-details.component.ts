import { Component, OnInit } from '@angular/core';
import { AddTransactionDialogComponent } from '../../view-member/add-transaction-dialog/add-transaction-dialog.component';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { TxnAddedSuccessfullyDialogComponent } from '../../view-member/txn-added-successfully-dialog/txn-added-successfully-dialog.component';
import { environment } from 'src/environments/environment';
import { HttpService } from 'src/app/services/http-service';
import { Router, ActivatedRoute } from '@angular/router';
import { SnackBarComponent } from 'src/app/shared/components/snack-bar/snack-bar.component';

@Component({
  selector: 'confirm-transaction-details',
  templateUrl: './confirm-transaction-details.component.html',
  styleUrls: ['./confirm-transaction-details.component.scss']
})
export class ConfirmTransactionDetailsComponent implements OnInit {

  public customerOid = 0;
  public txnId: String;
  public txnDetails;
  public lineItems = [];
  loadingResponse: boolean = false;
  public breadCrumbData: Array<Object> = [{
    title: 'Member Management',
    link: ''
  },
  {
    title: 'View Members',
    link: ''
  },
  {
    title: 'Transaction',
    link: ''
  }
  ];
  constructor(public dialog: MatDialog, private https: HttpService, private activatedRoute: ActivatedRoute, public router: Router) {
    this.activatedRoute.params.subscribe(
      (params) => {
        this.customerOid = params.customerOid;
        this.txnId = params.txnId
      }
    );
    this.getTxnDetails();
  }

  ngOnInit() {
  }
  openTxnDialog(response) {
    const dialogRef = this.dialog.open(TxnAddedSuccessfullyDialogComponent);
    dialogRef.componentInstance.response = response;
    dialogRef.componentInstance.customerOid = this.customerOid;
    dialogRef.componentInstance.txnId = this.txnId;
  }

  public getTxnDetails() {

    let data = {
      customerOid: this.customerOid,
      txnId: this.txnId
    }

    this.https.postJson(environment.APIEndpoint + 'api/rpa/addTxn/v1/checkTransaction', data)
      .subscribe(
        (response) => {
          console.log(JSON.stringify(response));
          this.txnDetails = response;
          this.lineItems = response['itemDetails'];
        },
        (err) => {

        });
  }

  public confirmTxn() {
    this.loadingResponse = true;
    let data = {
      customerOid: this.customerOid,
      txnId: this.txnId
    }

    this.https.postJson(environment.APIEndpoint + 'api/rpa/addTxn/v1/claimTransaction', data)
      .subscribe(
        (response) => {
          this.loadingResponse = false;
          this.openTxnDialog(response);
        },
        (err) => {
          console.log(err);
          this.loadingResponse = false;
        });
  }



  previousPage(ID){
    console.log(ID);
    
    localStorage.setItem('memberCustomerId',ID);
    this.router.navigate(['/view-member']);
  }
}
