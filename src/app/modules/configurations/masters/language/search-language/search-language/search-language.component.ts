import { OnInit, ViewChild, Output, Input, Component, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder, FormGroupDirective, FormArray, NgForm } from '@angular/forms';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { HttpService } from 'src/app/services/http-service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';

export interface UserData {
  langCode: string;
  langName: string;
  lastModifiedOn: string;
  modifiedBy: string;
  status: string;
}

@Component({
  selector: 'search-language',
  templateUrl: './search-language.component.html',
  styleUrls: ['./search-language.component.scss']
})
export class SearchLanguageComponent implements OnInit {
  public noRecords: boolean = false;
  public searchStoreVal: boolean = false;
  displayedColumns: string[] = ['langCode', 'langName', 'lastModifiedOn', 'modifiedBy', 'status'];
  dataSource: MatTableDataSource<UserData>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  public paginationData;
  public resultsLength = 0;
  public menuIds = localStorage.getItem("navigationArray");
  searchLanguageForm: FormGroup;
  public btnId: number = 96;
  public showBtn: boolean = false;

  public breadCrumbData: Array<Object> = [{
    title: 'Configurations',
    link: ''
  }, {
    title: 'Language',
    link: '/search-country'
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

  }


  status = true;
  openFilter() {
    this.status = !this.status;
  }
  ngOnInit() {
    this.buildSearchForm();
    this.dataSource.sort = this.sort;
    console.log("menuIds");
   
    // this.searchVal();
    // this.dataSource.paginator = this.paginator;
    if (this.menuIds.indexOf('96'))
      this.showBtn = true;
      if(sessionStorage.getItem('CheckType')=='Language'){
        if (sessionStorage.searchValue) {
          this.searchLanguageForm.controls['searchVal'].setValue(sessionStorage.getItem('searchValue'));
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
        sessionStorage.setItem('CheckType','Language');
      }
  }
  public buildSearchForm() {
    this.searchLanguageForm = this.fb.group({
      languageCode: [""],
      languageName: [""],
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
    let formdata = this.searchLanguageForm.value;
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
          "fieldName": "langCode",
          "fieldValue": formdata.languageCode
        },
        {
          "fieldName": "langName",
          "fieldValue": formdata.languageName,
        },
        {
          "fieldName": "status",
          "fieldValue": formdata.status
        }
      ]
    }
    let SEARCH_LANGUAGE = "api/rpa/master/language/v1/search"
    this.https.postJson(environment.APIEndpoint + SEARCH_LANGUAGE, data).subscribe(res => {
      this.searchStoreVal = false;
      this.dataSource = res["items"];
      console.log(this.dataSource);
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
  MoveToView(ID){
    localStorage.setItem('LanguageViewID',ID);
    this.router.navigate(['/view-language'])
  }
}
