import { OnInit, ViewChild, Output, Input, Component, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder, FormGroupDirective, FormArray, NgForm } from '@angular/forms';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { HttpService } from 'src/app/services/http-service';
import { environment } from 'src/environments/environment';
import { BehaviorSubject } from 'rxjs';
import { Router} from '@angular/router';
import { CommonFunctions } from 'src/app/services/common-functions';

export interface UserData {
  aboutUsId: string;
  countryName: string;
  contentFor: string;
  lastModifiedOn: string;
  status: string;
}
@Component({
  selector: 'search-about-us',
  templateUrl: './search-about-us.component.html',
  styleUrls: ['./search-about-us.component.scss']
})
export class SearchAboutUsComponent implements OnInit {
  public breadCrumbData: Array<Object> = [{
    title: 'About Us',
    link: ''
  }
  ];
  public noRecords: boolean = false;
  public searchStoreVal: boolean = false;
  @ViewChild("searchAboutUsForm") searchAboutUsForm;
  searchAboutUsFormGroup: FormGroup;
  releaseTitle = new FormControl('', [Validators.required]);
  displayedColumns: string[] = ['aboutUsId', 'countryName', 'contentFor', 'createdOn', 'modifiedTime', 'status'];
  dataSource: MatTableDataSource<UserData>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  public paginationData;
  public countryList = [];
  public resultsLength = 0;
  buildFlag = false;
  public searchData : any;

  constructor(private fb: FormBuilder, private https: HttpService,private commonFunctions: CommonFunctions, public router: Router) {
    this.dataSource = new MatTableDataSource();
  }

  public status: boolean = true;
  openFilter() {
    this.status = !this.status;
  }
  ngOnInit() {
    this.getCountryList();
    this.dataSource = new MatTableDataSource();
    this.paginationData = this.commonFunctions.initPaginationData(this.resultsLength);
    if(sessionStorage.getItem('aboutUs')){
      this.searchData = JSON.parse(sessionStorage.getItem('aboutUs'));
      this.commonFunctions.checkFilterContainsData(this.searchData) ?  this.openFilter(): '';
    }   
    this.buildSearchForm();

    if(sessionStorage.getItem('CheckType')=='AboutUsMain')
    {
      if (sessionStorage.searchValue) {
      this.searchAboutUsFormGroup.controls['searchVal'].setValue(sessionStorage.getItem('searchValue'));
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
      sessionStorage.setItem('CheckType','AboutUsMain');
    }
    this.searchVal();
  }

  getCountryList() {
    let GET_ALL_COUNTRIES = environment.APIEndpoint + "api/rpa/master/country/v1/get/countries";
    this.https.getJson(GET_ALL_COUNTRIES)
      .subscribe((response) => {
        this.countryList = response;

      })
  }

  public buildSearchForm() {
    let data = this.searchData;
    this.searchAboutUsFormGroup = this.fb.group({
      countryId: [data != undefined ? data.countryId : ''],
      status: [data != undefined ? data.status : ''],
      searchVal: [data != undefined ? data.searchVal : '']
    });
  }

  paginationDetail = new BehaviorSubject(
    {
      length: 10,
      pageIndex: 0,
      pageSize: 10
    });

  getUpdate(event) {
    sessionStorage.setItem('paginationData', JSON.stringify(event));
    this.paginationDetail.next(event);
    this.paginationData = event;
    this.searchVal();
  }

  searchVal() {
    this.searchStoreVal = true;
    let formdata = this.searchAboutUsFormGroup.value;
    sessionStorage.setItem('searchValue', formdata.searchVal); 
    if (this.searchAboutUsFormGroup.invalid == false) {
      let formdata = this.searchAboutUsFormGroup.value;
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
            "fieldName": "country.oid",
            "fieldValue": formdata.countryId,
          },
          {
            "fieldName": "status",
            "fieldValue": formdata.status
          },
        ]
      }
      this.setSearchData();
      this.https.postJson(environment.APIEndpoint + "api/rpa/aboutus/v1/search", data).subscribe(res => {
        this.searchStoreVal = false;
        this.resultsLength = res["totalCount"];
        if (this.resultsLength == 0) {
          this.noRecords = true;
        } else {
          this.noRecords = false;
        }
        this.dataSource = new MatTableDataSource(res["items"]);
        this.dataSource.sort = this.sort;
        this.buildFlag = true;
      },
        (error) => {
          this.searchStoreVal = true;
        });
    }
  }

  reset() {
    this.searchData = undefined;
    this.noRecords = false;
    this.buildSearchForm();
    this.getUpdate(this.paginationData);
    this.paginator.pageIndex = this.paginationData.pageIndex;
    this.searchVal();
  }
  viewAboutUs(ID){
    localStorage.setItem('viewAboutUsId',ID);
    this.router.navigate(['/view-about-us']);
  }

  public setSearchData(){
    let formdata = this.searchAboutUsFormGroup.value;
    let selectedData = {
      countryId: formdata.countryId,
      status: formdata.status,
      searchVal: formdata.searchVal
    }
    sessionStorage.setItem('aboutUs', JSON.stringify(selectedData))
  }

  indexResetFormdataSearch() {
    let formData = this.searchAboutUsFormGroup.value;
    if (formData.searchVal != '' && formData.searchVal != null) {
        this.paginationData.pageIndex = 0;
    }
    if (formData.countryId != '' && formData.countryId != null) {
        this.paginationData.pageIndex = 0;
    }
    if (formData.status != '' && formData.status != null) {
        this.paginationData.pageIndex = 0;
    }
  }
}
