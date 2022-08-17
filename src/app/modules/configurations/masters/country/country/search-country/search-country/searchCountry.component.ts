import { OnInit, ViewChild, Output, Input, Component, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder, FormGroupDirective, FormArray, NgForm } from '@angular/forms';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { HttpService } from 'src/app/services/http-service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { environment } from 'src/environments/environment';
import * as moment from 'moment';
import { Router } from '@angular/router';

export interface CountryData {
  countryCode: string;
  countryName: string;
  arabCountryName: string;
  currency: string;
  storeFlag: string;
  createdTime: string;
  lastModifiedOn: string;
  modifiedBy: string;
  status: string;
}
@Component({
  selector: 'app-search-country',
  templateUrl: './searchCountry.component.html',
  styleUrls: ['./searchCountry.component.scss']
})
export class SearchCountryComponent implements OnInit {
  displayedColumns: string[] = ['countryCode', 'countryName', 'arabCountryName', 'currencyCode', 'storeFlag', 'createdTime', 'modifiedTime', 'modifiedBy', 'status'];
  dataSource: MatTableDataSource<CountryData>;
  public noRecords: boolean = false;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  public paginationData;
  public resultsLength = 0;
  public menuIds = localStorage.getItem("navigationArray");
  searchCountryForm: FormGroup;
  public searchStoreVal: boolean = false;
  public btnId: number = 96;
  public showBtn: boolean = false;
  public isDate;
  public breadCrumbData: Array<Object> = [
    {
      title: 'Configurations',
      link: '/search-country'
    }, {
      title: 'Country',
      link: '/search-country'
    }
  ];
  constructor(private fb: FormBuilder,private router: Router,
    private https: HttpService) {
    this.dataSource = new MatTableDataSource();

  }

  public status: boolean = true;
  openFilter() {
    this.status = !this.status;
  }
   paginationDetail = new BehaviorSubject(
    {
      length: 10,
      pageIndex: 0,
      pageSize: 10
    });
  ngOnInit() {
    console.log("menuIds");
    this.buildSearchForm();
    this.dataSource = new MatTableDataSource();
    // this.dataSource.paginator = this.paginator;
    // this.searchVal();

    if(sessionStorage.getItem('CheckType')=='Country'){
      if (sessionStorage.searchValue) {
        this.searchCountryForm.controls['searchVal'].setValue(sessionStorage.getItem('searchValue'));
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
      sessionStorage.setItem('CheckType','Country');
    }

    if (this.menuIds.indexOf('96'))
      this.showBtn = true;
  }
  public buildSearchForm() {
    this.searchCountryForm = this.fb.group({
      countryName: ["", Validators.pattern('[a-zA-Z\u0600-\u06FF \"\'&(),.:?_-]*')],
      countryCode: ["", Validators.pattern('[a-zA-Z]{1,2}$')],
      storeFlag: [""],
      status: [""],
      searchVal: [""]
    });
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
    console.log(this.paginationData);
    this.searchStoreVal = true;
    if (this.searchCountryForm.invalid == false) {
      let formdata = this.searchCountryForm.value;
      sessionStorage.setItem('searchValue', formdata.searchVal);
      // if(formdata.searchVal!=''){
      //     this.isDate=moment(formdata.searchVal,'DD/MM/YYYY').format('YYYY-MM-DD');
      //     formdata.searchVal=this.isDate==='Invalid date'? formdata.searchVal:this.isDate;
      //     console.log(this.isDate);
      // }
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
            "fieldName": "countryName",
            "fieldValue": formdata.countryName,
          },
          {
            "fieldName": "countryCode",
            "fieldValue": formdata.countryCode
          },
          {
            "fieldName": "storeFlag",
            "fieldValue": formdata.storeFlag
          },

          {
            "fieldName": "status",
            "fieldValue": formdata.status
          }
        ]
      }
      let SEARCH_COUNTRY = "api/rpa/master/country/v1/search"
      this.https.postJson(environment.APIEndpoint + SEARCH_COUNTRY, data).subscribe(res => {
        this.searchStoreVal = false;
        this.dataSource = new MatTableDataSource(res["items"]);
        this.dataSource.sort = this.sort;
        console.log(this.dataSource);
        this.resultsLength = res["totalCount"]
        if (this.resultsLength == 0) {
          this.noRecords = true;
        } else {
          this.noRecords = false;
        }
      }, err => {
        console.log(err);
        this.searchStoreVal = false;
      })

    }

  }

  resetForm() {
    this.noRecords = false;
    this.buildSearchForm();
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
    localStorage.setItem('CountryViewID',ID);
    this.router.navigate(['/view-country'])
  }

}
