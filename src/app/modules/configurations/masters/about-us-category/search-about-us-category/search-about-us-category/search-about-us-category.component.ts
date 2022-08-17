import { OnInit, ViewChild, Component } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { HttpService } from 'src/app/services/http-service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';

export interface AboutUsData {
  aboutUsCategoryId: string;
  arabContentFor: string;
  contentFor: string;
  lastModifiedOn: string;
  modifiedBy: string;
  status: string;
}


@Component({
  selector: 'search-about-us-category',
  templateUrl: './search-about-us-category.component.html',
  styleUrls: ['./search-about-us-category.component.scss']
})
export class SearchAboutUsCategoryComponent implements OnInit {

  displayedColumns: string[] = ['aboutUsCategoryId', 'contentFor', 'arabContentFor', 'modifiedTime', 'modifiedBy', 'status'];
  dataSource: MatTableDataSource<AboutUsData>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  public paginationData;
  public resultsLength = 0;
  public menuIds = localStorage.getItem("navigationArray");
  searchAboutUsForm: FormGroup;
  public btnId: number = 96;
  public showBtn: boolean = false;
  buildFlag = false;
  public breadCrumbData: Array<Object> = [
    {
      title: 'Configurations',
      link: '/search-country'
    },
    {
      title: 'About Us Category',
      link: '/search-country'
    }
  ];
  public noRecords: boolean = false;
  public searchStoreVal: boolean = false;
  constructor(private fb: FormBuilder,private router:Router,
    private https: HttpService) {
    this.buildForm();
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
    // this.dataSource = new MatTableDataSource();
    // this.dataSource.paginator = this.paginator;
    // this.searchVal();
    if (this.menuIds.indexOf('96'))
      this.showBtn = true;
      if(sessionStorage.getItem('CheckType')=='ABSCategory'){
        if (sessionStorage.searchValue) {
          this.searchAboutUsForm.controls['searchVal'].setValue(sessionStorage.getItem('searchValue'));
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
        sessionStorage.setItem('CheckType','ABSCategory');
      }
  }

  buildForm() {
    this.searchAboutUsForm = this.fb.group({
      aboutUsTitle: ["", Validators.pattern('[a-zA-Z0-9\u0600-\u06FF.\"&\'(),-:.?_  ]*')],
      status: '',
      searchVal: [""]
    });
  }

  getUpdate(event) {
    sessionStorage.setItem('paginationData', JSON.stringify(event));
    this.paginationDetail.next(event);
    this.paginationData = event;
    this.searchVal();
  }
  removeWhiteSpace(value) {
    return value.trim();
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
    let formdata = this.searchAboutUsForm.value;
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
          "fieldName": "status",
          "fieldValue": formdata.status
        },
        {
          "fieldName": "contentFor",
          "fieldValue": this.removeWhiteSpace(formdata.aboutUsTitle)
        }
      ]
    }
    this.https.postJson(environment.APIEndpoint + "api/rpa/master/aboutus/category/v1/search", data).subscribe(res => {
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
    }, err => {
      this.searchStoreVal = true;
    });
  }

  reset() {
    this.noRecords = false;
    this.buildForm();
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
    localStorage.setItem('ABSViewID',ID);
    this.router.navigate(['/view-about-us-category'])
  }
}
