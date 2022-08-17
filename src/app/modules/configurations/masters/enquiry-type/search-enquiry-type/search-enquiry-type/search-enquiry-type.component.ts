import { OnInit, ViewChild, Output, Input, Component, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder, FormGroupDirective, FormArray, NgForm } from '@angular/forms';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { environment } from 'src/environments/environment';
import { HttpService } from 'src/app/services/http-service';
import { Router } from '@angular/router';

export interface EnquiryData {
  enquiryCode: string;
  enquiryTitle: string;
  arabEnquiryTitle: string;
  createdOn: string;
  lastModifiedOn: string;
  lastModifiedBy: string;
  status: string;
}

@Component({
  selector: 'search-enquiry-type',
  templateUrl: './search-enquiry-type.component.html',
  styleUrls: ['./search-enquiry-type.component.scss']
})
export class SearchEnquiryTypeComponent implements OnInit {
  displayedColumns: string[] = ['enquiryCode', 'enquiryTitle', 'arabEnquiryTitle', 'createdTime', 'modifiedTime', 'modifiedBy', 'status'];
  dataSource: MatTableDataSource<EnquiryData>;
  public noRecords: boolean = false;
  public searchStoreVal: boolean = false;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  public paginationData;
  public resultsLength = 0;
  searchEnquiryTypeForm: FormGroup;
  public breadCrumbData: Array<Object> = [
    {
      title: 'Configurations',
      link: '/search-country'
    }, {
      title: 'Enquiry Type',
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
  }

  public status: boolean = true;
  openFilter() {
    this.status = !this.status;
  }
  ngOnInit() {
    console.log("menuIds");
    this.buildSearchForm();
    this.dataSource = new MatTableDataSource();
    // this.dataSource.paginator = this.paginator;
    // this.searchVal();
    if(sessionStorage.getItem('CheckType')=='EnquiryType'){
      if (sessionStorage.searchValue) {
        this.searchEnquiryTypeForm.controls['searchVal'].setValue(sessionStorage.getItem('searchValue'));
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
      sessionStorage.setItem('CheckType','EnquiryType');
    }
  }

  //public buildSearchForm(){
  //  this.searchEnquiryTypeForm= this.fb.group({
  //    enquiryCode: ["",Validators.pattern('^[a-zA-Z0-9]*')],
  //  enquiryTitle: ["",Validators.pattern('^[a-zA-Z0-9\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF \"&\'(),-:.?_ ]*')],
  //status: [""],
  //searchVal: [""]
  //});
  //}

  public buildSearchForm() {
    let form = {
      enquiryCode: ["", Validators.pattern('^[a-zA-Z0-9]*')],
      enquiryTitle: ["", Validators.pattern('^[a-zA-Z0-9\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF \"&\'(),-:.?_ ]*')],
      status: [""],
      searchVal: [""]
    }
    this.searchEnquiryTypeForm = this.fb.group(form);
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
    if (this.searchEnquiryTypeForm.invalid == false) {
      let formdata = this.searchEnquiryTypeForm.value;
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
            "fieldName": "enquiryCode",
            "fieldValue": formdata.enquiryCode,
          },
          {
            "fieldName": "enquiryTitle",
            "fieldValue": formdata.enquiryTitle
          },
          {
            "fieldName": "status",
            "fieldValue": formdata.status
          }
        ]
      }
      let SEARCH_ENQUIRY_TYPE = "api/rpa/master/enquiry/type/v1/search"
      this.https.postJson(environment.APIEndpoint + SEARCH_ENQUIRY_TYPE, data).subscribe(res => {
        this.searchStoreVal = false;
        this.dataSource = new MatTableDataSource(res["items"]);
        this.dataSource.sort = this.sort;
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
    localStorage.setItem('EnquiryViewID',ID);
    this.router.navigate(['/view-enquiry-type'])
}

}
