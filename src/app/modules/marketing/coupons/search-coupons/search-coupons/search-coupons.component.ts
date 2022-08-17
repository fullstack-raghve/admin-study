import { OnInit, ViewChild, Output, Input, Component, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder, FormGroupDirective, FormArray, NgForm } from '@angular/forms';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { BehaviorSubject } from 'rxjs';
import { HttpService } from 'src/app/services/http-service';
import { environment } from 'src/environments/environment';
import * as moment from 'moment';
import { Sort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { CommonFunctions } from 'src/app/services/common-functions';

export interface UserData {
  couponId: number;
  couponTitle: string;
  discountType: string;
  discountValue: string;
  startDate: string;
  endDate: string;
  modifiedTime: string;
  status: string;
}

@Component({
  selector: 'search-coupons',
  templateUrl: './search-coupons.component.html',
  styleUrls: ['./search-coupons.component.scss']
})
export class SearchCouponsComponent implements OnInit {

  public breadCrumbData: Array<Object> = [{
    title: 'Marketing',
    link: ''
  }, {
    title: 'Coupons',
    link: '/search-coupons'
  }
  ];
  public searchStoreVal: boolean = false;
  public noRecords: boolean = false;
  @ViewChild("searchProgramsForm") searchProgramsForm;
  searchProgramsFormGroup: FormGroup;
  releaseTitle = new FormControl('', [Validators.required]);
  displayedColumns: string[] = ['couponId', 'couponTitle', 'discountType', 'discountValue', 'startDate', 'endDate', 'modifiedUserId','createdOn', 'modifiedTime', 'status'];
  public paginationData;
  public resultsLength = 0;
  public sortColumn = "createdTime";
  public sortDirection = "desc";
  dataSource: MatTableDataSource<UserData>;
  public minDate: Date = new Date();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  paginationDetail = new BehaviorSubject(
    {
      length: 10,
      pageIndex: 0,
      pageSize: 10
    });
  constructor(
    private commonFunctions: CommonFunctions,
    private fb: FormBuilder,
    private https: HttpService,
    private router: Router) {
    this.buildCreateProductsForm();

    this.dataSource = new MatTableDataSource();
  }
  status = true;


  ngOnInit() {
    this.paginationData = this.commonFunctions.initPaginationData(this.resultsLength);

    // this.dataSource.paginator = this.paginator;
    // this.dataSource.sort = this.sort;
    // this.searchVal();
    if (sessionStorage.getItem('CheckType') == 'Coupons') {
      if (sessionStorage.searchValue) {
        this.searchProgramsFormGroup.controls['searchVal'].setValue(sessionStorage.getItem('searchValue'));
      }
      if (sessionStorage.paginationData) {
        let obj = JSON.parse(sessionStorage.paginationData);
        // this.paginationDetail = new BehaviorSubject({
        //   length: obj.length,
        //   pageIndex: obj.pageIndex,
        //   pageSize: obj.pageSize
        // });
        this.getUpdate(obj);
        this.paginator.pageIndex = obj.pageIndex;
      } else {
        this.searchVal();
      }
    } else {
      sessionStorage.clear();
      this.searchVal();
      sessionStorage.setItem('CheckType', 'Coupons');
    }
  }
  public buildCreateProductsForm() {
    let form = {
      rewardsType: ["", Validators.required],
      liveOrUpcoming: ["", Validators.required],
      approvalStatus: ["", Validators.required],
      searchVal: ["", Validators.required],
      status: [""],
      couponTitle: ["", Validators.compose([Validators.pattern('^[a-zA-Z0-9\u0600-\u06FF \"&\'(),-:.?_ ]*')])],
      discountType: [""],
      notificationType: [""],
      startDate: [""],
      endDate: [""],
      couponType: [''],
      couponId: ["", Validators.compose([Validators.pattern('^[0-9]*')])]
    }
    this.searchProgramsFormGroup = this.fb.group(form);
  }
  openFilter() {
    this.status = !this.status;
  }

  myTrim(x) {
    return x.replace(/^\s+|\s+$/gm, '');
  }
  getUpdate(event) {
    sessionStorage.setItem('paginationData', JSON.stringify(event));
    this.paginationDetail.next(event);
    this.paginationData = event;
    this.searchVal();
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
  searchVal() {
    this.searchStoreVal = true;
    let formdata = this.searchProgramsFormGroup.value;
    sessionStorage.setItem('searchValue', formdata.searchVal);
    let data =
    {
      "page": this.paginationData !== undefined ? this.paginationData.pageIndex : "0",
      "pageSize": this.paginationData !== undefined ? this.paginationData.pageSize : "10",
      "order": {
        "column": this.sortColumn,
        "dir": this.sortDirection
      },
      "keySearch": this.myTrim(formdata.searchVal),
      "fieldSearch": [
        {
          "fieldName": "co.oid",
          "fieldValue": this.myTrim(formdata.couponId)
        },
        {
          "fieldName": "co.couponTitle",
          "fieldValue": this.myTrim(formdata.couponTitle)
        },
        {
          "fieldName": "co.discountType",
          "fieldValue": this.myTrim(formdata.discountType)
        },
        {
          "fieldName": "co.notificationType",
          "fieldValue": this.myTrim(formdata.notificationType)
        },
        {
          "fieldName": "co.startDate",
          "fieldValue": formdata.startDate != '' ? moment(formdata.startDate).format('YYYY-MM-DD') : ''

        },
        {
          "fieldName": "co.endDate",
          "fieldValue": formdata.endDate != '' ? moment(formdata.endDate).format('YYYY-MM-DD') : ''
        },
        {
          "fieldName": "co.couponType",
          "fieldValue": formdata.couponType
        },
        {
          "fieldName": "co.status",
          "fieldValue": formdata.status
        }
      ]
    }
    this.https.postJson(environment.APIEndpoint + 'api/rpa/coupon/v1/search', data).subscribe(res => {
      this.searchStoreVal = false;
      this.dataSource.data = res["items"];
      this.resultsLength = res["totalCount"];
      this.dataSource = new MatTableDataSource(res["items"]);
      this.dataSource.sort = this.sort;
      if (this.resultsLength == 0) {
        this.noRecords = true;
      } else {
        this.noRecords = false;
      }
      // this.dataSource.sort = this.sort;
      // if (this.paginationData !== undefined && this.paginationData.pageIndex * this.paginationData.pageSize > this.resultsLength) {
      //   this.paginationData.pageIndex = 0;
      //   this.paginator.pageIndex = 0;
      //   this.searchVal();
      // }
    }, err => {
      console.log(err);
      this.searchStoreVal = true;
    })
  }

  public resetForm() {
    this.noRecords = false;
    this.buildCreateProductsForm();
    this.searchVal();
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
      this.sortColumn = "createdTime";
      this.sortDirection = "desc";
    } else {
      this.sortColumn = sort.active;
      this.sortDirection = sort.direction;
    }

    this.searchVal();
  }

  MoveToView(ID) {
    localStorage.setItem('UserViewID', ID);
    this.router.navigate(['/view-user'])
  }
  MoveToViewCoupons(ID) {
    localStorage.setItem('CouponViewID', ID);
    this.router.navigate(['/view-coupons'])
  }
}
