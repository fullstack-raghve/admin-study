import { OnInit, ViewChild, Output, Input, Component, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder, FormGroupDirective, FormArray, NgForm } from '@angular/forms';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { HttpService } from 'src/app/services/http-service';
import { environment } from 'src/environments/environment';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Sort } from '@angular/material/sort';
import { Router } from '@angular/router';
export interface UserData {
  templateId: string;
  templateName: string;
  templateType: string;
  lastModifiedOn: string;
  status: string;
}
@Component({
  selector: 'search-template',
  templateUrl: './search-template.component.html',
  styleUrls: ['./search-template.component.scss']
})
export class SearchTemplateComponent implements OnInit {

  public breadCrumbData: Array<Object> = [{
    title: 'Marketing',
    link: ''
  }, {
    title: 'Templates',
    link: '/search-template'
  }
  ];

  @ViewChild("searchTemplateForm") searchTemplateForm;
  searchTemplateFormGroup: FormGroup;
  public resultsLength;
  public paginationData;
  public resData;
  public searchVal;
  public searchStoreVal: boolean = false;
  public noRecords: boolean = false;
  releaseTitle = new FormControl('', [Validators.required]);
  displayedColumns: string[] = ['templateId', 'templateName', 'templateType', 'modifiedUserId', 'lastModifiedOn', 'status'];
  dataSource: MatTableDataSource<UserData>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  public sortColumn = "modifiedTime";
  public sortDirection = "desc";
  constructor(private fb: FormBuilder, private router:Router,
    private https: HttpService, ) {
    this.buildCreateTemplateForm();

  }
  status = true;
  paginationDetail = new BehaviorSubject(
    {
      length: 10,
      pageIndex: 0,
      pageSize: 10
    });
  openFilter() {
    this.status = !this.status;
  }
  ngOnInit() {
    this.paginationData = {
      pageIndex: 0,
      pageSize: 10,
      length: this.resultsLength,
      previousPageIndex: 0
    };
    this.dataSource = new MatTableDataSource();
    // this.dataSource.paginator = this.paginator;
    // this.dataSource.sort = this.sort;
    // this.getSearchData();

    if(sessionStorage.getItem('CheckType')=='template'){
      if (sessionStorage.searchValue) {
        this.searchTemplateFormGroup.controls['searchVal'].setValue(sessionStorage.getItem('searchValue'));
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
        this.getSearchData();
        this.paginator.pageIndex = obj.pageIndex;
      } else {    
        this.getSearchData();
      }
    }else{
      sessionStorage.clear();
      this.getSearchData();
      sessionStorage.setItem('CheckType','template');
    }
  }

 
  getUpdate(event) {
    sessionStorage.setItem('paginationData', JSON.stringify(event));
    this.paginationDetail.next(event);
    this.paginationData = event;
    this.getSearchData();
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
  public getSearchData() {
    this.searchStoreVal = true;
    let formData = this.searchTemplateFormGroup.value;
    sessionStorage.setItem('searchValue', formData.searchVal);
    let searchData = {
      "page": this.paginationData !== undefined ? this.paginationData.pageIndex : "0",
      "pageSize": this.paginationData !== undefined ? this.paginationData.pageSize : "10",
      "order": {
        "column": this.sortColumn,
        "dir": this.sortDirection
      },
      "keySearch": formData.searchVal ? formData.searchVal : "",
      "fieldSearch": [
        {
          "fieldName": "templateName",
          "fieldValue": formData.templateName ? formData.templateName : ""
        },
        {
          "fieldName": "templateType",
          "fieldValue": formData.templateType ? formData.templateType : ""
        },
        {
          "fieldName": "oid",
          "fieldValue": formData.templateId ? formData.templateId : ""
        },
        {
          "fieldName": "status",
          "fieldValue": formData.status ? formData.status : ""
        }
      ]
    }
    this.https.postJson(environment.APIEndpoint + "api/rpa/marketing/template/v1/search", searchData).subscribe(res => {
      this.searchStoreVal = false;
      console.log(res);
      this.resData = res["items"]
      this.resultsLength = res["totalCount"];
      if (this.resultsLength == 0) {
        this.noRecords = true;
      } else {
        this.noRecords = false;
      }
      this.dataSource = new MatTableDataSource(this.resData);
      this.dataSource.sort = this.sort;
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
  public buildCreateTemplateForm() {
    let form = {
      templateId: [""],
      templateType: [""],
      templateName: [""],
      searchVal: [""],
      status: [false],

    }
    this.searchTemplateFormGroup = this.fb.group(form);
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
  reset() {
    this.noRecords = false;
    this.buildCreateTemplateForm();
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

  MoveToView(ID){
    localStorage.setItem('UserViewID',ID);
    this.router.navigate(['/view-user'])
  }
  MoveToTemplateView(ID){
    localStorage.setItem('TemplateViewID',ID);
    this.router.navigate(['/view-template'])
  }
}
