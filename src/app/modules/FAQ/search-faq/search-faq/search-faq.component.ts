import { OnInit, ViewChild, Component } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { HttpService } from 'src/app/services/http-service';
import { environment } from 'src/environments/environment';
import { BehaviorSubject } from 'rxjs';
import { Sort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { CommonFunctions } from 'src/app/services/common-functions';
import * as moment from 'moment';

export interface UserData {
  countryName: string;
  faqId: number;
  question: string;
  arabQuestion: string;
  faqCategory: string;
  lastModifiedOn: string;
  status: string;
}

@Component({
  selector: 'search-faq',
  templateUrl: './search-faq.component.html',
  styleUrls: ['./search-faq.component.scss']
})
export class SearchFaqComponent implements OnInit {

  public breadCrumbData: Array<Object> = [{
    title: 'FAQ',
    link: ''
  }
  ];
  public noRecords: boolean = false;
  public searchStoreVal: boolean = false;
  @ViewChild("searchFaqForm") searchFaqForm;
  searchFaqFormGroup: FormGroup;
  releaseTitle = new FormControl('', [Validators.required]);
  displayedColumns: string[] = ['countryName', 'faqId', 'question', 'arabQuestion', 'faqCategory', 'modifiedTime', 'status'];
  dataSource: MatTableDataSource<UserData>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  public paginationData;
  public resultsLength = 0;
  buildFlag = false;
  public faqCategoryList = [];
  public countries: any = [];
  public sortColumn = "modifiedTime";
  public sortDirection = "desc";
  public searchData : any;

  constructor(private fb: FormBuilder, private https: HttpService, public router: Router,private commonFunctions: CommonFunctions) {
    this.dataSource = new MatTableDataSource();
  }

  public status: boolean = true;

  openFilter() {
    this.status = !this.status;
  }

  ngOnInit() {
    this.getAllCountries();
    this.dataSource = new MatTableDataSource();
    this.paginationData = this.commonFunctions.initPaginationData(this.resultsLength);
    if(sessionStorage.getItem('FAQMain')){
      this.searchData = JSON.parse(sessionStorage.getItem('FAQMain'));
      this.commonFunctions.checkFilterContainsData(this.searchData) ?  this.openFilter(): '';
    }   
    this.buildSearchForm();

    if (sessionStorage.getItem('CheckType') == 'FAQModule') {
      if (sessionStorage.searchValue) {
        this.searchFaqFormGroup.controls['searchVal'].setValue(sessionStorage.getItem('searchValue'));
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
    } else {
      sessionStorage.clear();
      this.searchVal();
      sessionStorage.setItem('CheckType', 'FAQModule');
    }
    this.searchVal();
  }

  getAllCountries() {
    let GET_ALL_COUNTRIES = environment.APIEndpoint + "api/rpa/master/country/v1/get/countries";
    this.https.getJson(GET_ALL_COUNTRIES)
      .subscribe((response) => {
        console.log(response);
        this.countries = response;

      })
  }

  getAllCategories() {
    this.https.getJson(environment.APIEndpoint + "api/rpa/faq/category/v1/get/faq/categories")
      .subscribe((response) => {
        this.faqCategoryList = response;
      })
  }

  public buildSearchForm() {
    this.getAllCategories();
    let data = this.searchData;
    this.searchFaqFormGroup = this.fb.group({
      faqId: [data != undefined ? data.faqId : ''],
      question: [data != undefined ? data.question : '', Validators.pattern('[a-zA-Z\u0600-\u06FF \"&\'(),-:.?_ ]*')],
      faqCategory: [data != undefined ? data.faqCategory : ''],
      country: [data != undefined ? data.country : ''],
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

  sortData(sort: Sort) {
    if (!sort.active || sort.direction === '') {
      this.sortColumn = "modifiedTime";
      this.sortDirection = "desc";
    } else {
      this.sortColumn = sort.active;
      this.sortDirection = sort.direction;
    }
    this.searchVal(); 
  }

  
  searchVal() {
    if (this.searchFaqFormGroup.invalid == false) {
      let formdata = this.searchFaqFormGroup.value;
      sessionStorage.setItem('searchValue', formdata.searchVal); 
      let data =
      {
        "page": this.paginationData !== undefined ? this.paginationData.pageIndex : "0",
        "pageSize": this.paginationData !== undefined ? this.paginationData.pageSize : "10",
        "order": {
          "column": this.sortColumn,
          "dir": this.sortDirection
        },
        "keySearch": sessionStorage.getItem('searchValue'),
        "fieldSearch": [
          {
            "fieldName": "oid",
            "fieldValue": formdata.faqId,
          },
          {
            "fieldName": "question",
            "fieldValue": formdata.question
          },
          {
            "fieldName": "faqCategory.oid",
            "fieldValue": formdata.faqCategory
          },
          {
            "fieldName": "country.oid",
            "fieldValue": formdata.country
          },
          {
            "fieldName": "status",
            "fieldValue": formdata.status
          }
        ]
      }
      this.setSearchData();
      this.https.postJson(environment.APIEndpoint + "api/rpa/faq/v1/search", data).subscribe(res => {
        this.resultsLength = res["totalCount"];
        this.dataSource = new MatTableDataSource(res["items"]);
        this.noRecords = res["items"].length == 0 ? true : false ;
        this.dataSource.sort = this.sort;
        this.buildFlag = true;
      }, err => {
        console.log(err)
      })

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

  viewFaqModule(ID) {
    localStorage.setItem('FaqViewId', ID);
    this.router.navigate(['/view-faq']);
  }

  public setSearchData(){
    let formdata = this.searchFaqFormGroup.value;
    let selectedData = {
      faqId: formdata.faqId,
      question: formdata.question,
      faqCategory: formdata.faqCategory,
      country: formdata.country,
      status: formdata.status,
      searchVal: formdata.searchVal
    }
    sessionStorage.setItem('FAQMain', JSON.stringify(selectedData)) 
  }

  indexResetFormdataSearch() {
    let formData = this.searchFaqFormGroup.value;
    if (formData.searchVal != '' && formData.searchVal != null) {
        this.paginationData.pageIndex = 0;
    }
    if (formData.faqId != '' && formData.faqId != null) {
        this.paginationData.pageIndex = 0;
    }
    if (formData.question != '' && formData.question != null) {
        this.paginationData.pageIndex = 0;
    }
    if (formData.faqCategory != '' && formData.faqCategory != null) {
        this.paginationData.pageIndex = 0;
    }
    if (formData.country != '' && formData.country != null) {
        this.paginationData.pageIndex = 0;
    }
    if (formData.status != '' && formData.status != null) {
        this.paginationData.pageIndex = 0;
    }
    if (formData.searchVal != '') {
        let isDate = moment(formData.searchVal, 'DD/MM/YYYY').format('YYYY-MM-DD');
        formData.searchVal = isDate === 'Invalid date' ? formData.searchVal : isDate;
    }
  }
}
