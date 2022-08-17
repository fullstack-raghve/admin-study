import { Component, OnInit, Inject, Input, ViewChild } from '@angular/core';
import { Validators, FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { MatPaginator, MatSort, MatTableDataSource, MatTabsModule, MatSnackBar } from '@angular/material';
import { HttpService } from 'src/app/services/http-service';
import { environment } from 'src/environments/environment';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { ActivatedRoute } from '@angular/router';
import { SnackBarComponent } from 'src/app/shared/components/snack-bar/snack-bar.component';
import { formatDate } from '@angular/common';
import { Router } from '@angular/router';
import { Globals } from 'src/app/services/global';
import { Sort } from '@angular/material/sort';
import * as moment from 'moment';
import { SelectionModel } from '@angular/cdk/collections';
export interface TransactionData {
  transactionId: number;
  transactionType: string;
  brandName: string;
  storeName: string;
  totalAmount: string;
  transactionDate: string;
  status: string;
}
@Component({
  selector: 'app-select-transaction-dialog',
  templateUrl: './select-transaction-dialog.component.html',
  styleUrls: ['./select-transaction-dialog.component.scss']
})
export class SelectTransactionDialogComponent implements OnInit {
  public resultsLength;
  @Input('txnReqId') txnReqId: string;
  status = true;
  public noRecords: boolean = false;
  public searchStoreVal: boolean = false;
  public manualPoints: boolean = false;
  @Input('txnRequestStatus') txnRequestStatus: string;
  @ViewChild("invalidCommentForm") invalidCommentForm;
  displayedTransactionColumns: string[] = ['select', 'transactionId', 'transactionType', 'brandName', 'storeName', 'totalAmount', 'transactionDate', 'discountAmount', 'couponUsed', 'txnStatus'];
  public paginationData;
  public txnHistoryLength;
  public sortTxnColumn = "txnDate";
  public sortTxnDirection = "desc";
  public sortTxnRewardColumn = "createdTime";
  public sortTxnRewardDirection = "desc";
  public sortEnquiryColumn = "createdTime";
  @ViewChild(MatPaginator) paginator1: MatPaginator;
  @Input('memberId') memberId;
  @Input('selectedBrandId') selectedBrandId;
  @ViewChild(MatSort) sort: MatSort;
  public sortEnquiryDirection = "desc";
  dataSource3: MatTableDataSource<object>;
  txnHistoryFormGroup: FormGroup;
  public tranactionId;
  public tranactionType;
  public brandList = [];
  brandIdVal;
  public brandFilterd = [];
  brandnameVal;
  brandValOid:boolean = true;
  constructor(@Inject(MAT_DIALOG_DATA) data, private https: HttpService, private dialogRef: MatDialogRef<MatDialog>,
    private activatedRoute: ActivatedRoute,
    private http: HttpService, public snackBar: MatSnackBar, private fb: FormBuilder, private router: Router) {
    dialogRef.disableClose = true;
    if (data != null) {
      this.tranactionId = data.transactionId;
      this.tranactionType = data.dataKey;
      console.log(this.tranactionId);
      console.log(this.tranactionType);

    }

  }
  public selection = new SelectionModel<TransactionData>(true, []);
  ngOnInit() {
    console.log(this.memberId);
    console.log(this.selectedBrandId);
    this.buildTransactionForm();
    this.transactionHistory();
    this.getAllBrands();
    this.brandIdVal = this.selectedBrandId;
  }
  public buildTransactionForm() {
    
    this.txnHistoryFormGroup = this.fb.group({
      txnId: ["", Validators.pattern("[a-zA-Z0-9 ]*")],
      txnType: '',
      brandOid: [''],
      storeOid: '',
      txnStatus: '',
      billAmount: '',
      paymentMethod: '',
      txnDate: '',
      txnSearchVal: [""]
    });
  }
  onCloseClick(): void {
    let obj = {
      'buttonName': 'CANCEL',
      'tableData': this.selection.selected,
      'totalCount': this.resultsLength
    }
    this.dialogRef.close(obj);
  }

  openFilter() {
    this.status = !this.status;
    this.manualPoints = false;
  }
  sortTxnData(sort: Sort) {

    if (!sort.active || sort.direction === '') {
      this.sortTxnColumn = "txnDate";
      this.sortTxnDirection = "desc";
    } else {
      this.sortTxnColumn = sort.active;
      this.sortTxnDirection = sort.direction;
    }

    this.transactionHistory();
  }
  public getAllBrands() {
    let GET_ALL_ONLINE_BRANDS = environment.APIEndpoint + "api/rpa/master/brand/v1/get/brands";
    this.https.getJson(GET_ALL_ONLINE_BRANDS)
      .subscribe((response) => {
        console.log(response);
        this.brandList = response;
        // this.brandFilterd = this.brandList.filter(function (item){
        //   console.log(item.selectedBrandId);
        //   return item.selectedBrandId
        // })
        // this.brandList.forEach(brand => {
        //   if (brand.this.selectedBrandId == this.txnHistoryFormGroup.get('brandOid').value) {
        //     this.brandnameVal = brand.brandName;
        //   }
        // });
        this.brandList.forEach(brand=>{
          if(brand.brandId==this.selectedBrandId && brand.brandName!=""){
            this.txnHistoryFormGroup.get('brandOid').patchValue(brand.brandName);
          }
        })
      })
  }
  public transactionHistory() {
    console.log(this.selectedBrandId);
    
    this.searchStoreVal = true;
    let formdata = this.txnHistoryFormGroup.value;
    let data =
    {
      "page": this.paginationData !== undefined ? this.paginationData.pageIndex : "0",
      "pageSize": this.paginationData !== undefined ? this.paginationData.pageSize : "10",
      "order": {
        "column": this.sortTxnColumn,
        "dir": this.sortTxnDirection
      },
      "keySearch": formdata.txnSearchVal,
      "fieldSearch": [
        {
          "fieldName": "userOid",
          "fieldValue": this.memberId
        },
        {
          "fieldName": "txnId",
          "fieldValue": formdata.txnId
        },
        {
          "fieldName": "txnType",
          "fieldValue": formdata.txnType
        },
        {
          "fieldName": "brandOid",
          "fieldValue": this.selectedBrandId ? this.selectedBrandId : ''
        },
        {
          "fieldName": "storeOid",
          "fieldValue": formdata.storeOid
        },
        {
          "fieldName": "billAmount",
          "fieldValue": formdata.billAmount
        },
        {
          "fieldName": "txnStatus",
          "fieldValue": formdata.txnStatus
        },
        {
          "fieldName": "paymentMethod",
          "fieldValue": formdata.paymentMethod
        },
        {
          "fieldName": "fromDate",
          "fieldValue": null != formdata.txnDate && formdata.txnDate != '' ? moment(formdata.txnDate).format('YYYY-MM-DD') : ''
        },
        {
          "fieldName": "toDate",
          "fieldValue": null != formdata.txnDate && formdata.txnDate != '' ? moment(formdata.txnDate).format('YYYY-MM-DD') : ''
        }
      ]
    }
    this.https.postJson(environment.APIEndpoint + 'api/rpa/memberMgmt/v1/getTransactionHistory', data)
      .subscribe(
        (res) => {
          this.searchStoreVal = false;
          this.dataSource3 = new MatTableDataSource(res["items"]);
          this.dataSource3.sort = this.sort;
          this.txnHistoryLength = res["totalCount"];
          if (this.txnHistoryLength == 0) {
            this.noRecords = true;
          } else {
            this.noRecords = false;
          }
          if (this.paginationData !== undefined && this.paginationData.pageIndex * this.paginationData.pageSize > this.txnHistoryLength) {
            this.paginationData.pageIndex = 0;
            this.paginator1.pageIndex = 0;
            this.transactionHistory();
          }
        },
        (err) => {
          console.log(err);
          this.searchStoreVal = true;
        });
  }
  paginationDetail = new BehaviorSubject(
    {
      length: 10,
      pageIndex: 0,
      pageSize: 10
    });
  getTxnHistoryUpdate(event) {
    this.paginationDetail.next(event);
    this.paginationData = event;
    this.transactionHistory();
  }


  // istxnSelected(value: any): boolean {
  //   console.log(value);

  //   if (value.txnId == this.tranactionId )
  //     return true;
  //   else
  //     return false;
  // }
  // isAllSelected() {
  //   const numSelected = this.selection.selected.length;
  //   const numRows = this.dataSource3.data.length;
  //   return numSelected === numRows;
  // }
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource3.data.length;
    console.log(numSelected);
    return numSelected === numRows;
  }

  // masterToggle() {
  //   this.isAllSelected() ?
  //     this.selection.clear() :
  //     this.dataSource3.data.forEach(row => this.selection.select(this.tranactionId));
  // }
  selectionChange(ev){
    console.log(ev);
  }
}
