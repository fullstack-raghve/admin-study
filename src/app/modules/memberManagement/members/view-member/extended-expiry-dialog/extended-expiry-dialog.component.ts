import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { MatPaginator, MatSort, MatTableDataSource, MatTabsModule, MatSnackBar } from '@angular/material';
import { HttpService } from 'src/app/services/http-service';
import { environment } from 'src/environments/environment';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { FormControl, FormGroup, Validators, FormBuilder, FormGroupDirective, FormArray, NgForm } from '@angular/forms';
import { SnackBarComponent } from 'src/app/shared/components/snack-bar/snack-bar.component';
import * as moment from 'moment';
import { Sort } from '@angular/material/sort';

export interface expiryData {
  slno: number;
  pointsAccrued: number;
  points: string;
  dateOfExpiry: string;
}
@Component({
  selector: 'extended-expiry-dialog.component',
  templateUrl: './extended-expiry-dialog.component.html',
  styleUrls: ['./extended-expiry-dialog.component.scss']
})
export class ExtendedExpiryDialogComponent implements OnInit {
  public brandOid;
  public expiryDisable;
  public minDate: Date = new Date();
  public reedemType;
  public freeProductType;
  public loyaltyBrandOid;
  public customerOid;
  public show: boolean = false;
  public scrollbarOptions: boolean = false;
  public editButton;
  // public isDisable = true;
  public editable: boolean[];
  public minDates: Date[];
  public paginationData;
  public resultsLength;
  public extendExpiryFormGroup: FormGroup;
  public expiryRewardSearchGroup: FormGroup;
  displayedColumns: string[] = ['slNo', 'txnId', 'rewardType', 'noOfRewards', 'expiryDate', 'days', 'date'];
  dataSource: MatTableDataSource<expiryData>;
  public sortColumn = "expiryDate";
  public sortDirection = "asc";
  // expiryDate: Date;
  checkVal: boolean;
  public noRecords: boolean = false;
  public searchStoreVal: boolean = false;

  constructor(private dialogRef: MatDialogRef<MatDialog>, private https: HttpService, private fb: FormBuilder, private snackBar: MatSnackBar) {

    dialogRef.disableClose = true;
    this.dataSource = new MatTableDataSource();
    this.getPaginationUpdate();
  }

  ngOnInit() {
    console.log(this.freeProductType);
    
    this.buildForm();
    this.buildSearchForm();
    this.viewRewardExpiry();
  }

  getPaginationUpdate(){
    this.paginationData = {
      pageIndex: 0,
      length: 10,
      pageSize: this.paginationData !== undefined ? this.paginationData.pageSize : "10"
    }
    console.log(this.paginationData);
    
  }
  public buildSearchForm() {
    this.expiryRewardSearchGroup = this.fb.group({
      year: [''],
      month: [''],
      searchVal: ['']
    });
  }

  public buildForm() {
    this.extendExpiryFormGroup = this.fb.group({
      expiryItems: this.fb.array([])
    });
    this.buildFormB();
  }

  public buildFormB() {
    const control = <FormArray>this.extendExpiryFormGroup.controls['expiryItems'];
    for (let i = 0; i < this.paginationData.pageSize; i++) {
      const newForm = this.fb.group({
        expiryDays: [''],
        expiryDate: ['']
      });
      control.push(newForm);

    }
  }

  paginationDetail = new BehaviorSubject(
    {
      length: 10,
      pageIndex: 0,
      pageSize: 10
    });

  public viewRewardExpiry() {
    this.searchStoreVal = true;
    let formdata = this.expiryRewardSearchGroup.value;
    let body = {
      "page": this.paginationData !== undefined ? this.paginationData.pageIndex : "0",
      "pageSize": this.paginationData !== undefined ? this.paginationData.pageSize : "10",
      "order": {
        "column": this.sortColumn,
        "dir": this.sortDirection
      },
      "keySearch": formdata.searchVal,
      "rewardType": this.reedemType,
      "fieldSearch": [{
        "fieldName": "userOid",
        "fieldValue": this.customerOid
      },
      {
        "fieldName": "loyaltyBrandOid",
        "fieldValue": this.loyaltyBrandOid
      },
      {
        "fieldName": "year",
        "fieldValue": null != formdata.year ? formdata.year : ""
      },
      {
        "fieldName": "month",
        "fieldValue": null != formdata.month ? formdata.month : ""
      },
      {
        "fieldName":"freeProductType",
        "fieldValue": this.freeProductType != undefined ? this.freeProductType : ''
      }
      ]
    }

    let GET_REWARDS_EXPIRY = environment.APIEndpoint + "api/rpa/memberTransactions/v1/get/rewardExpiry";
    this.https.postJson(GET_REWARDS_EXPIRY, body)
      .subscribe(
        (response) => {
          this.searchStoreVal = false;
          console.log("changeHistory = " + response);
          this.editable = [];
          this.minDates = [];
          for (let i = 0; i < response["items"].length; i++) {
            this.editable[i] = false;
            this.minDates[i] = new Date(response["items"][i].expiryDate);
            this.minDates[i].setDate(this.minDates[i].getDate() + 1);
          }
          this.dataSource = new MatTableDataSource(response["items"]);
          this.resultsLength = response["totalCount"];
          console.log(this.resultsLength);
          
          if (this.resultsLength == 0) {
            this.noRecords = true;
          } else {
            this.noRecords = false;
          }
          this.dialogRef.disableClose = false;
          this.getPaginationUpdate();
          this.buildForm();

        },
        (error) => {
          console.log(error);
          this.searchStoreVal = true;
        }
      );
  }

  public addDays(date, days) {
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }

  toggle() {
    this.show = !this.show;
    if (this.show)
      this.editButton = "Hide";
    else
      this.editButton = "Show";
  }

  status = true;
  openFilter() {
    this.status = !this.status;
  }

  enableEditable(index) {
    for (let i = 0; i < this.editable.length; i++) {
      this.editable[i] = false;
    }
    this.editable[index] = true;
  }

  disableEditable(index) {
    this.editable[index] = false;
  }


  onCloseClick(): void {
    this.dialogRef.close();
  }

  getUpdate(event) {
    this.paginationDetail.next(event);
    this.paginationData = event;
    this.getPaginationUpdate();
    this.viewRewardExpiry();
  }

  updateExpiry(index, txnRewardOid) {
    const control = this.extendExpiryFormGroup.get('expiryItems') as FormArray;
    let days = control.at(index).get('expiryDays').value;
    let date = control.at(index).get('expiryDate').value;

    if (isNaN(days)) {
      this.snackBar.openFromComponent(SnackBarComponent, {
        duration: 10000,
        data: {
          status: "failure",
          message: "Days should be valid number"
        }
      });
    } else {
      let body = {
        "redeemType": this.reedemType,
        "txnRewardOid": txnRewardOid,
        "days": days,
        "date": date != '' ? moment(date).format('YYYY-MM-DD') : ''
      };

      if ((days == undefined || days <= 0) && (date == undefined || date == '')) {
        this.snackBar.openFromComponent(SnackBarComponent, {
          duration: 10000,
          data: {
            status: "failure",
            message: "Select valid date or enter days"
          }
        });
      } else {
        let EXTEND_EXPIRY = environment.APIEndpoint + "api/rpa/memberTransactions/v1/extendExpiry";
        this.https.postJson(EXTEND_EXPIRY, body)
          .subscribe((response) => {
            this.snackBar.openFromComponent(SnackBarComponent, {
              duration: 10000,
              data: {
                status: "success",
                message: "Expiry extended successfully"
              }
            });
            this.dialogRef.close();
          }
            , err => {
              console.log("error Status = " + err);
              if (err.error.errorType == 'VALIDATION') {
                this.snackBar.openFromComponent(SnackBarComponent, {
                  duration: 10000,
                  data: {
                    status: "failure",
                    message: err.error.errorDetails[0].description
                  }
                });
              } else {
                this.snackBar.openFromComponent(SnackBarComponent, {
                  duration: 10000,
                  data: {
                    status: "failure",
                    message: "Your request cannot be saved at this time. Please try again later"
                  }
                });
              }
              this.dialogRef.close();
            });

      }
    }
  }

  sortExpiryData(sort: Sort) {

    if (!sort.active || sort.direction === '') {
      this.sortColumn = "expiryDate";
      this.sortDirection = "asc";
    } else {
      this.sortColumn = sort.active;
      this.sortDirection = sort.direction;
    }

    this.viewRewardExpiry();

  }
  resetForm() {
    this.buildForm();
    this.viewRewardExpiry();
  }
}