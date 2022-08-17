import { OnInit, ViewChild, Output, Input, Component, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder, FormGroupDirective, FormArray, NgForm } from '@angular/forms';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { HttpService } from 'src/app/services/http-service';
import { environment } from 'src/environments/environment';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import * as moment from 'moment';
import { Router } from '@angular/router';

export interface CurrencyData {
  currencyCode: string;
  currencyTitle: string;
  createdTime: string;
  lastModifiedOn: string;
  modifiedBy: string;
  status: string;
}
@Component({
  selector: 'search-currency',
  templateUrl: './search-currency.component.html',
  styleUrls: ['./search-currency.component.scss']
})
export class SearchCurrencyComponent implements OnInit {
  searchCurrencyForm: FormGroup;
  public breadCrumbData: Array<Object> = [{
    title: 'Configurations',
    link: ''
  }, {
    title: 'Currency',
    link: '/search-currency'
  }
  ];
  public noRecords: boolean = false;
  public searchStoreVal: boolean = false;
  displayedColumns: string[] = ['currencyCode', 'currencyName', 'createdTime', 'modifiedTime', 'modifiedBy', 'status'];
  dataSource: MatTableDataSource<CurrencyData>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  public paginationData;
  public resultsLength = 0;
  public isDate;
  constructor(private fb: FormBuilder,private router:Router,
    private https: HttpService) {
    this.dataSource = new MatTableDataSource();
  }
  status = true;
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
    this.buildSearchForm();
    this.dataSource = new MatTableDataSource();
    // this.dataSource.paginator = this.paginator;
    // this.searchVal();
    if(sessionStorage.getItem('CheckType')=='Currency'){
      if (sessionStorage.searchValue) {
        this.searchCurrencyForm.controls['searchVal'].setValue(sessionStorage.getItem('searchValue'));
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
      sessionStorage.setItem('CheckType','Currency');
    }
  }
  public buildSearchForm() {
    this.searchCurrencyForm = this.fb.group({
      currencyName: ["", Validators.pattern('[a-zA-Z\u0600-\u06FF \"\'&(),.:?_-]*')],
      currencyCode: ["", Validators.pattern('[a-zA-Z0-9]{1,3}$')],
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
    this.searchStoreVal = true;
    console.log(this.paginationData);
    if (this.searchCurrencyForm.invalid == false) {
      let formdata = this.searchCurrencyForm.value;
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
            "fieldName": "currencyName",
            "fieldValue": formdata.currencyName,
          },
          {
            "fieldName": "currencyCode",
            "fieldValue": formdata.currencyCode
          },

          {
            "fieldName": "status",
            "fieldValue": formdata.status
          }
        ]
      }
      let SEARCH_CURRENCY = "api/rpa/master/currency/v1/search"
      this.https.postJson(environment.APIEndpoint + SEARCH_CURRENCY, data).subscribe(res => {
        this.searchStoreVal = false;
        this.dataSource = new MatTableDataSource(res["items"]);
        this.dataSource.sort = this.sort;
        this.resultsLength = res["totalCount"]
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
  reset() {
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
  isValidDate(dateString) {
    var regEx = /^\d{2}\\d{2}\\d{4}$/;
    return dateString.match(regEx) != null;
  }
  MoveToView(ID){
    localStorage.setItem('CurrencyViewID',ID);
    this.router.navigate(['/view-currency'])
  }

}
export function isDate(value: any): value is Date {
  return value instanceof Date && !isNaN(+value);
}
