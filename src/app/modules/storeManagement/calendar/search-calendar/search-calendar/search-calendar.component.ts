import { OnInit, ViewChild, Output, Input, Component, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder, FormGroupDirective, FormArray, NgForm } from '@angular/forms';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { environment } from 'src/environments/environment';
import * as moment from 'moment';
import { HttpService } from 'src/app/services/http-service';
import { BehaviorSubject } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';


export interface UserData {
  calendarId: number;
  calendarTitle: string;
  calendarType: string;
  numberOfStores: string;
  lastModifiedDate: string;
  status: string;
}


@Component({
  selector: 'search-calendar',
  templateUrl: './search-calendar.component.html',
  styleUrls: ['./search-calendar.component.scss']
})
export class SearchCalendarComponent implements OnInit {
  public breadCrumbData: Array<Object> = [{
    title: 'Store Management',
    link: ''
  }
  ];

  @ViewChild("searchEnquiriesForm") searchEnquiriesForm;
  searchCalendarFormGroup: FormGroup;
  releaseTitle = new FormControl('', [Validators.required]);
  displayedColumns: string[] = ['calendarId', 'calendarTitle', 'calendarType', 'numberOfStores', 'lastModifiedDate', 'status'];
  dataSource: MatTableDataSource<UserData>;
  public paginationData: any;
  public resultsLength = 0;
  public countryList: any;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  constructor(private fb: FormBuilder, private https: HttpService,private router: Router) {
    this.buildSearchEnquiryForm();
    this.dataSource = new MatTableDataSource();
  }
  public searchStoreVal: boolean = false;
  public noRecords: boolean = false;
  status = true;
  paginationDetail = new BehaviorSubject(
    {
      length: 10,
      pageIndex: 0,
      pageSize: 10
    });

  ngOnInit() {
    // this.dataSource.paginator = this.paginator;
    // this.dataSource.sort = this.sort;
    this.dataSource = new MatTableDataSource();
    this.getCountryList();
    if(sessionStorage.getItem('CheckType')=='Calendar'){
      if (sessionStorage.searchValue) {
        this.searchCalendarFormGroup.controls['searchVal'].setValue(sessionStorage.getItem('searchValue'));
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

  getCountryList() {
    let GET_ALL_COUNTRIES = environment.APIEndpoint + "api/rpa/master/country/v1/get/countries";
    this.https.getJson(GET_ALL_COUNTRIES)
      .subscribe((response) => {
        this.countryList = response;
      })
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
    let formdata = this.searchCalendarFormGroup.value;
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
          "fieldName": "calendarTitle",
          "fieldValue": this.myTrim(formdata.calendarTitle)
        },
        {
          "fieldName": "calendarType",
          "fieldValue": this.myTrim(formdata.calendarType)
        },
        {
          "fieldName": "country.oid",
          "fieldValue": formdata.countryId
        },
        {
          "fieldName": "status",
          "fieldValue": formdata.status
        }
      ]
    }
    this.https.postJson(environment.APIEndpoint + 'api/rpa/calendar/v1/search', data).subscribe(res => {
      this.searchStoreVal = false;
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
      this.searchStoreVal = true;
    })
  }

 
  public buildSearchEnquiryForm() {
    let form = {
      calendarTitle: [""],
      searchVal: [""],
      countryId: [""],
      calendarType: [""],
      status: [""]
    }
    this.searchCalendarFormGroup = this.fb.group(form);
  }

 

  getUpdate(event) {
    sessionStorage.setItem('paginationData', JSON.stringify(event));
    this.paginationDetail.next(event);
    this.paginationData = event;
    this.searchVal();
  }

  public resetForm() {
    this.noRecords = false;
    this.buildSearchEnquiryForm();
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
    localStorage.setItem('CalendarViewID',ID);
    this.router.navigate(['/view-calendar'])
  }
}
