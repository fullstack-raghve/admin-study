import { OnInit, ViewChild, Output, Input, Component, EventEmitter, AfterViewInit } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder, FormGroupDirective, FormArray, NgForm } from '@angular/forms';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { HttpService } from 'src/app/services/http-service';
import { environment } from 'src/environments/environment';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Sort } from '@angular/material/sort';
import { Router } from '@angular/router';
export interface UserData {
  segmentId: string;
  segmentType: string;
  segmentName: string;
  lastModifiedOn: string;
  fileValidateStatus: string;
  status: string;
}

@Component({
  selector: 'search-customer-segments',
  templateUrl: './search-customer-segments.component.html',
  styleUrls: ['./search-customer-segments.component.scss']
})
export class SearchCustomerSegmentsComponent implements OnInit, AfterViewInit {


  public breadCrumbData: Array<Object> = [{
    title: 'Marketing',
    link: ''
  }, {
    title: 'Customer Segments',
    link: '/search-customer-segments'
  }
  ];
  public loadingResponse: boolean = false;
  public searchStoreVal: boolean = false;
  public noRecords: boolean = false;
  @ViewChild("searchCustomerSegmentsForm") searchCustomerSegmentsForm;
  searchCustomerSegmentsFormGroup: FormGroup;
  public resultsLength;
  public paginationData;
  public resData;
  public searchVal;
  releaseTitle = new FormControl('', [Validators.required]);
  displayedColumns: string[] = ['segmentId', 'segmentType', 'segmentName', 'modifiedTime', 'fileValidateStatus', 'status'];
  dataSource: MatTableDataSource<UserData>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  sortColumn: string;
  sortDirection: string;
  paginationDetail = new BehaviorSubject(
    {
      length: 10,
      pageIndex: 0,
      pageSize: 10
    });
  constructor(private fb: FormBuilder, private router: Router,
    private https: HttpService,) {
    this.dataSource = new MatTableDataSource();
    this.buildSearchCustomerForm();


  }
  status = true;
  openFilter() {
    this.status = !this.status;
  }
  public buildSearchCustomerForm() {
    let form = {
      segmentId: [""],
      segmentName: [""],
      templateName: ["",],
      segmentType: [''],
      fileValidateStatus: [''],
      searchVal: [""],
      status: [""],

    }
    this.searchCustomerSegmentsFormGroup = this.fb.group(form);
  }
  ngOnInit() {
    // this.dataSource.paginator = this.paginator;
    // //this.dataSource.sort = this.sort;
    // this.getSearchData();
    this.paginationData = {
      pageIndex: 0,
      pageSize: 10,
      length: this.resultsLength,
      previousPageIndex: 0
    };
    if (sessionStorage.getItem('CheckType') == 'Coupons') {
      if (sessionStorage.searchValue) {
        this.searchCustomerSegmentsFormGroup.controls['searchVal'].setValue(sessionStorage.getItem('searchValue'));
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
        this.getSearchData();
        this.paginator.pageIndex = obj.pageIndex;
      } else {
        this.getSearchData();
      }
    } else {
      sessionStorage.clear();
      this.getSearchData();
      sessionStorage.setItem('CheckType', 'Coupons');
    }

  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }
  getUpdate(event) {
    sessionStorage.setItem('paginationData', JSON.stringify(event));
    this.paginationDetail.next(event);
    this.paginationData = event;
    this.getSearchData();
  }

  indexResetFormdataSearch() {

    let formData = this.searchCustomerSegmentsFormGroup.value;
    if (formData.searchVal != '' && formData.searchVal != null) {
      this.paginationData.pageIndex = 0;
    }
    if (formData.segmentName != '' && formData.segmentName != null) {
      this.paginationData.pageIndex = 0;
    }
    if (formData.fileValidateStatus != '' && formData.fileValidateStatus != null) {
      this.paginationData.pageIndex = 0;
    }
    if (formData.segmentType != '' && formData.segmentType != null) {
      this.paginationData.pageIndex = 0;
    }
    if (formData.status != '' && formData.status != null) {
      this.paginationData.pageIndex = 0;
    }
  }

  searchKey() {
    // this.paginationData = {
    //   pageIndex: 0,
    //   pageSize: 10,
    //   length: this.resultsLength,
    //   previousPageIndex: 0
    // };
    this.getUpdate(this.paginationData);
    this.paginator.pageIndex = this.paginationData.pageIndex;
  }
  public getSearchData() {
    this.searchStoreVal = true;
    this.loadingResponse = true;
    let formData = this.searchCustomerSegmentsFormGroup.value;
    sessionStorage.setItem('searchValue', formData.searchVal);
    let searchData = {
      "page": this.paginationData !== undefined ? this.paginationData.pageIndex : "0",
      "pageSize": this.paginationData !== undefined ? this.paginationData.pageSize : "10",
      "order": {
        "column": "modifiedTime",
        "dir": "desc"
      },
      "keySearch": formData.searchVal!=undefined ? formData.searchVal : "",
      "fieldSearch": [
        {
          "fieldName": "segmentName",
          "fieldValue": formData.segmentName ? formData.segmentName : ""
        },
        {
          "fieldName": "fileValidateStatus",
          "fieldValue": formData.fileValidateStatus!=undefined ? formData.fileValidateStatus : ""
        },
        {
          "fieldName": "segmentType",
          "fieldValue": formData.segmentType!=undefined ? formData.segmentType : ""
          },
        {
          "fieldName": "status",
          "fieldValue": formData.status ? formData.status : ""
        }
      ]
    }
    this.https.postJson(environment.APIEndpoint + "api/rpa/customer/segment/v1/search", searchData).subscribe(res => {
      console.log(res);
      this.searchStoreVal = false;
      this.loadingResponse = false;
      this.resData = res["items"]
      this.resultsLength = res["totalCount"];
      if (this.resultsLength == 0) {
        this.noRecords = true;
      } else {
        this.noRecords = false;
      }
      this.dataSource = new MatTableDataSource(this.resData);
      this.dataSource.sort = this.sort;

    }, err => {
      console.log(err);
      this.searchStoreVal = false;
      this.loadingResponse = false;
    })
  }

  public resetForm() {
    this.noRecords = false;
    this.buildSearchCustomerForm();
    this.getSearchData();
    // this.paginationData = {
    //   pageIndex: 0,
    //   pageSize: 10,
    //   length: this.resultsLength,
    //   previousPageIndex: 0
    // };
    this.getUpdate(this.paginationData);
    this.paginator.pageIndex = this.paginationData.pageIndex;
  }

  sortData(sort: Sort) {

    if (!sort.active || sort.direction === '') {
      this.sortColumn = "modifiedTime";
      this.sortDirection = "desc";
    } else {
      this.sortColumn = sort.active;
      this.sortDirection = sort.direction;
    }

    this.getSearchData();
  }
  MoveToView(ID) {
    localStorage.setItem('CustomerSegmentViewID', ID);
    this.router.navigate(['/view-customer-segments'])
  }
}
