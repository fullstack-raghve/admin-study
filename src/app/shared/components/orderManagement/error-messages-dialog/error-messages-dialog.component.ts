import { Component, OnInit } from '@angular/core';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material';
import { CommonFunctions } from 'src/app/services/common-functions';
import { Common } from 'src/app/services/common';
import { environment } from 'src/environments/environment';
import { HttpService } from 'src/app/services/http-service';

@Component({
  selector: 'app-error-messages-dialog',
  templateUrl: './error-messages-dialog.component.html',
  styleUrls: ['./error-messages-dialog.component.scss']
})

export class ErrorMessagesDialogComponent implements OnInit {
  public errorMessagesList:any = [];
  public pageLoader:boolean = false;
  
  constructor(private https: HttpService, 
    private dialogRef: MatDialogRef<MatDialog>, 
    private commonService: Common, 
    private commonFunctions: CommonFunctions) { 
    dialogRef.disableClose = true;
  }

  ngOnInit() {
    this.getAllErrorMessages();
  }

  onCloseClick(): void {
    this.dialogRef.close();
  }

  getAllErrorMessages() {
    this.commonService.getAllErrorMeaasges().subscribe(
      (response) => {
        this.processErrorMessageData(response);
      }, err => {
      });
  }

  processErrorMessageData(response){
    if(response != [] && response != undefined && response != null){
      this.errorMessagesList = response;
    }else {
      this.errorMessagesList = [];
    }
  }

  deleteMsg(id){
    this.pageLoader = true;
    const DELETE_ERR_MSG = environment.APIEndpoint + 'api/rpa/order/v1/delete/DeliveryStatus';
    let request = {
      "deliveryDetailOid":id
    }
    this.https.postJson(DELETE_ERR_MSG, request).subscribe((response) => {
      this.pageLoader = false;
      this.getAllErrorMessages();
    },(error) => {
      this.pageLoader = false;
    });
  }
}
