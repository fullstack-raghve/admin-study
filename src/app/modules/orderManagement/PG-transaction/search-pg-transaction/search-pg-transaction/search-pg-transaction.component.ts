import { OnInit, ViewChild, Output, Input, Component, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder, FormGroupDirective, FormArray, NgForm } from '@angular/forms';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { environment } from 'src/environments/environment';
import * as moment from 'moment';
import { HttpService } from 'src/app/services/http-service';
import { BehaviorSubject } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonFunctions } from 'src/app/services/common-functions';


export interface UserData {
  calendarId: number;
  txnId: string;
  paymentStatus: string;
  numberOfStores: string;
  lastModifiedDate: string;
  endDate: string;
}
@Component({
  selector: 'app-search-pg-transaction',
  templateUrl: './search-pg-transaction.component.html',
  styleUrls: ['./search-pg-transaction.component.scss']
})
export class SearchPgTransactionComponent implements OnInit {

  public breadCrumbData: Array<Object> = [{
    title: 'Order Management',
    link: ''
  }
  ];

  @ViewChild("searchEnquiriesForm") searchEnquiriesForm;
  searchTxnFormGroup: FormGroup;
  releaseTitle = new FormControl('', [Validators.required]);
  displayedColumns: string[] = ['paymentStatus','statusMessage', 'txnId', 'paymentMode', 'cardName', 'pgTxnId','creationTime','modifyTime'];
  dataSource: MatTableDataSource<UserData>;
  public paginationData: any;
  public resultsLength = 0;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  constructor(private fb: FormBuilder, private https: HttpService,private router: Router,private commonFunctions: CommonFunctions) {
    this.buildSearchEnquiryForm();
    this.dataSource = new MatTableDataSource();
  }
  public searchStoreVal: boolean = false;
  public noRecords: boolean = false;
  public loadingResponse: boolean = false;
  paymentStatus = ["PAYMENT_INITIATED", "PAYMENT_SUCCESS","PAYMENT_FAILED","REFUNDED"]
  status = true;
  public searchData : any;
  paginationDetail = new BehaviorSubject(
    {
      length: 10,
      pageIndex: 0,
      pageSize: 10
    });

  ngOnInit() {
    this.paginationData = {
      pageIndex: 0,
      pageSize: 10,
      length: this.resultsLength,
      previousPageIndex: 0
    };
    // this.dataSource.paginator = this.paginator;
    // this.dataSource.sort = this.sort;
    this.dataSource = new MatTableDataSource();
    if(sessionStorage.getItem('PgTransaction')){
      this.searchData = JSON.parse(sessionStorage.getItem('PgTransaction'));
      this.commonFunctions.checkFilterContainsData(this.searchData) ?  this.openFilter(): '';
    }
    this.buildSearchEnquiryForm();

    if(sessionStorage.getItem('CheckType')=='Calendar'){
      if (sessionStorage.searchValue) {
        this.searchTxnFormGroup.controls['searchVal'].setValue(sessionStorage.getItem('searchValue'));
      }
      if (sessionStorage.paginationData) {
        let obj = JSON.parse(sessionStorage.paginationData);
        this.paginationDetail = new BehaviorSubject({
          length: obj.length,
          pageIndex: obj.pageIndex,
          pageSize: obj.pageSize
        });
        this.paginationDetail.next(obj);
        this.paginationData = obj;
        this.searchVal();
        this.paginator.pageIndex = obj.pageIndex;
      } else {
        this.searchVal();
      }    
    }else{
      sessionStorage.clear();
      this.searchVal();
      sessionStorage.setItem('CheckType','Calendar');
    }
    
  }
  openFilter() {
    this.status = !this.status;
  }

  myTrim(x) {
    return x.replace(/^\s+|\s+$/gm, '');
  }

  
  searchKey(){
    // this.paginationData = {
    //   pageIndex: 0,
    //   pageSize: 10,
    //   length: this.resultsLength,
    //   previousPageIndex: 0
    // };
    this.getUpdate(this.paginationData);
    this.paginator.pageIndex = this.paginationData.pageIndex;
  }

  indexResetFormdataSearch(){
    
    let formData = this.searchTxnFormGroup.value;
    if (formData.searchVal!= '' && formData.searchVal!= null){
      this.paginationData.pageIndex = 0;
    }
    if (formData.txnId!='' && formData.txnId!=null){
      this.paginationData.pageIndex = 0;
    }
    if (formData.paymentStatus!='' && formData.paymentStatus!=null){
      this.paginationData.pageIndex = 0;
    }
    if (formData.startDate!='' && formData.startDate!=null){
      this.paginationData.pageIndex = 0;
    }
    if (formData.endDate!='' && formData.endDate!=null){
      this.paginationData.pageIndex = 0;
    }
  }

  searchVal() {
    this.searchStoreVal = true;
    this.loadingResponse = true;
    let formdata = this.searchTxnFormGroup.value;
    sessionStorage.setItem('searchValue',  this.myTrim(formdata.searchVal));
    let data =
    {
      "page": this.paginationData !== undefined ? this.paginationData.pageIndex : "0",
      "pageSize": this.paginationData !== undefined ? this.paginationData.pageSize : "10",
      "order": {
        "column": "modifiedTime",
        "dir": "desc"
      },
      "keySearch": sessionStorage.getItem('searchValue'),
      "fieldSearch": [
        {
          "fieldName": "txnId",
          "fieldValue": this.myTrim(formdata.txnId)
        },
        {
          "fieldName": "paymentStatus",
          "fieldValue": this.myTrim(formdata.paymentStatus)
        },
        {
          "fieldName": "startDate",
          "fieldValue": formdata.startDate != '' && formdata.startDate != null? moment(formdata.startDate).format('YYYY-MM-DD') : '',
        },
        {
          "fieldName": "endDate",
          "fieldValue": formdata.endDate != '' && formdata.endDate != null? moment(formdata.endDate).format('YYYY-MM-DD') : '',
        }
      ]
    }
    this.setSearchData();
    this.https.postJson(environment.APIEndpoint + 'api/rpa/order/v1/getPgTransactionDetails', data).subscribe(res => {
      this.searchStoreVal = false;
      this.loadingResponse = false;
      this.dataSource.data = res["items"];
      this.resultsLength = res["totalCount"];
      if (this.resultsLength == 0) {
        this.noRecords = true;
      } else {
        this.noRecords = false;
      }
      this.dataSource = new MatTableDataSource(res["items"]);
      this.dataSource.sort = this.sort;
    }, err => {
      console.log(err);
      this.searchStoreVal = false;
      this.loadingResponse = false;
    })
  }

 
  public buildSearchEnquiryForm() {
    let data = this.searchData;
    let form = {
      txnId: [data != undefined ? data.txnId : ''],
      searchVal: [data != undefined ? data.searchVal : ''],
      startDate: [data != undefined ? data.startDate : ''],
      paymentStatus: [data != undefined ? data.paymentStatus : ''],
      endDate: [data != undefined ? data.endDate : '']
    }
    this.searchTxnFormGroup = this.fb.group(form);
  }

 

  getUpdate(event) {
    sessionStorage.setItem('paginationData', JSON.stringify(event));
    this.paginationDetail.next(event);
    this.paginationData = event;
    this.searchVal();
  }

  public resetForm() {
    this.searchData = undefined;
    this.noRecords = false;
    this.buildSearchEnquiryForm();
    // this.paginationData = {
    //   pageIndex: 0,
    //   pageSize: 10,
    //   length: this.resultsLength,
    //   previousPageIndex: 0
    // };
    this.searchVal();
    this.getUpdate(this.paginationData);
    this.paginator.pageIndex = this.paginationData.pageIndex;
  }
 
  public setSearchData(){
    let formdata = this.searchTxnFormGroup.value;
    let selectedData = {
      txnId:formdata.txnId,
      paymentStatus:formdata.paymentStatus,
      startDate: formdata.startDate,
      endDate: formdata.endDate,
      searchVal: formdata.searchVal
    }
    sessionStorage.setItem('PgTransaction', JSON.stringify(selectedData))
  }
}
