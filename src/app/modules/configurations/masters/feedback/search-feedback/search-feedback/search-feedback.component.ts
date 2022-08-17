import { OnInit, ViewChild, Output, Input, Component, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder, FormGroupDirective, FormArray, NgForm } from '@angular/forms';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { environment } from 'src/environments/environment';
import { HttpService } from 'src/app/services/http-service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import * as moment from 'moment';
import { Router } from '@angular/router';

import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

export interface FeedBackData {
  feedbackId: number;
  feedbackTitle: string;
  brandName: string;
  feedbackRating: string;
  feedbackFor: string;
  feedbackType: string;
  modifiedTime: string;
  modifiedBy: string;
  status: string;
}
export interface Brand {
  brandId: number;
  brandName: string;
}
@Component({
  selector: 'search-feedback',
  templateUrl: './search-feedback.component.html',
  styleUrls: ['./search-feedback.component.scss']
})
export class SearchFeedbackComponent implements OnInit {
  displayedColumns: string[] = ['feedBackId', 'feedBackTitle', 'brandName', 'feedBackRating', 'feedBackFor', 'feedBackType', 'modifiedTime', 'modifiedBy', 'status'];
  dataSource: MatTableDataSource<FeedBackData>;
  public noRecords: boolean = false;
  public searchStoreVal: boolean = false;
  searchFeedbackFormGroup: FormGroup;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  public paginationData;
  public resultsLength = 0;
  brandList;
  Brands: Brand[] = [];
  brandCtrl = new FormControl();
  filteredbrands: Observable<Brand[]>;
  public brandIdValue;
  public breadCrumbData: Array<Object> = [
    {
      title: 'Configurations',
      link: '/search-country'
    }, {
      title: 'Feedback',
      link: ''
    }
  ];
  paginationDetail = new BehaviorSubject(
    {
      length: 10,
      pageIndex: 0,
      pageSize: 10
    });
  constructor(private fb: FormBuilder,private router:Router,
    private https: HttpService) {
    this.dataSource = new MatTableDataSource();
    this.buildSearchFeedBackForm();
  }

  public status: boolean = true;
  openFilter() {
    this.status = !this.status;
  }
  ngOnInit() {
    // this.dataSource.paginator = this.paginator;
    // this.dataSource.sort = this.sort;
    // this.searchVal();
    this.getAllBrands();
    if(sessionStorage.getItem('CheckType')=='Feedback'){
      if (sessionStorage.searchValue) {
        this.searchFeedbackFormGroup.controls['searchVal'].setValue(sessionStorage.getItem('searchValue'));
      }
      if (sessionStorage.paginationData ) {
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
      sessionStorage.setItem('CheckType','Feedback');
    }
  }

  getAllBrands() {
    // console.log(this.KioskForm.get('brands').value);

    let GET_ALL_ONLINE_BRANDS = environment.APIEndpoint + "api/rpa/master/brand/v1/get/regionBrands";
    this.https.getJson(GET_ALL_ONLINE_BRANDS)
      .subscribe((response) => {
        // console.log(response);
        this.brandList = response;

        for (let i = 0; i <= this.brandList.length - 1; i++) {
          let objMallkey = {
            brandId: this.brandList[i]['brandId'],
            brandName: this.brandList[i]['brandName'],
          }
          console.log(objMallkey);
          this.Brands.push(objMallkey);
        }
        this.filteredbrands = this.brandCtrl.valueChanges
          .pipe(
            startWith(''),
            map(brand => brand ? this._filterBrands(brand) : this.Brands.slice())
          );
        console.log(this.brandList['brandName']);
        console.log(this.brandList['brandId']);
      },
        (error) => {
          console.log(error);
        });
  }
  private _filterBrands(value: string): Brand[] {
    const filterValue = value.toLowerCase();
    return this.Brands.filter(brand => brand.brandName.toLowerCase().indexOf(filterValue) === 0);
  }
  public buildSearchFeedBackForm() {
    let form = {

      searchVal: [""],
      feedBackId: [""],
      feedBackTitle: ["", Validators.pattern('[a-zA-Z0-9\u0600-\u06FF \"&\'(),-:.?_ ]*')],
      status: [""],

    }
    this.searchFeedbackFormGroup = this.fb.group(form);
  }
  getUpdate(event) {
    sessionStorage.setItem('paginationData', JSON.stringify(event));
    this.paginationDetail.next(event);
    this.paginationData = event;
    this.searchVal();
  }
  searchKey(){
    this.paginationData = {
      pageIndex: 0,
      pageSize: 10,
      length: this.resultsLength,
      previousPageIndex: 0
    };
    this.getUpdate(this.paginationData);
    this.paginator.pageIndex = this.paginationData.pageIndex;
  }
  searchVal() {
    this.searchStoreVal = true;
    if (this.searchFeedbackFormGroup.invalid == false) {

      let formdata = this.searchFeedbackFormGroup.value;
      sessionStorage.setItem('searchValue', formdata.searchVal);
      let data =
      {
        "page": this.paginationData !== undefined ? this.paginationData.pageIndex : "0",
        "pageSize": this.paginationData !== undefined ? this.paginationData.pageSize : "10",
        "order": {
          "column": "modifiedTime",
          "dir": "desc"
        },
        "keySearch": formdata.searchVal,
        "fieldSearch": [
          {
            "fieldName": "oid",
            "fieldValue": formdata.feedBackId,
          },
          {
            "fieldName": "feedBackTitle",
            "fieldValue": formdata.feedBackTitle
          },
          {
            "fieldName": "status",
            "fieldValue": formdata.status
          },
          {
            "fieldName": "brandOid",
            "fieldValue": this.brandIdValue != undefined ? this.brandIdValue : ""
          }
        ]
      }

      let FEEDBACK_SEARCH = "api/rpa/feedback/v1/search"
      this.https.postJson(environment.APIEndpoint + FEEDBACK_SEARCH, data).subscribe(res => {
        this.searchStoreVal = false;
        this.dataSource = new MatTableDataSource(res["items"]);
        this.dataSource.sort = this.sort;
        this.resultsLength = res["totalCount"];
        if (this.resultsLength == 0) {
          this.noRecords = true;
        } else {
          this.noRecords = false;
        }

      }, err => {
        console.log(err);
        this.searchStoreVal = true;
      })
    }
  }
  getBrandValue(val) {
    console.log(val);
    this.brandIdValue = val.brandId;
    if(val.brandName == 'ALL'){
      this.brandIdValue = 0;
    }
    else{
      this.brandIdValue = val.brandId; 
    }
  }

  resetForm() {
    this.brandCtrl.reset('');
    this.brandIdValue = '';
    this.noRecords = false;
    this.buildSearchFeedBackForm();
    // this.searchVal();
    this.paginationData = {
      pageIndex: 0,
      pageSize: 10,
      length: this.resultsLength,
      previousPageIndex: 0
    };
    this.getUpdate(this.paginationData);
    this.paginator.pageIndex = this.paginationData.pageIndex;
  }
  MoveToView(ID){
    localStorage.setItem('FeedbackViewID',ID);
    this.router.navigate(['/view-feedback'])
  }
}
