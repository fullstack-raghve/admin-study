import { OnInit, ViewChild, Output, Input, Component, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder, FormGroupDirective, FormArray, NgForm } from '@angular/forms';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { BehaviorSubject } from 'rxjs';
import { HttpService } from 'src/app/services/http-service';
import { environment } from 'src/environments/environment';

export interface UserData {
  displayOrder: string;
  name: string;
  status: string;
}

@Component({
  selector: 'search-category',
  templateUrl: './search-category.component.html',
  styleUrls: ['./search-category.component.scss']
})
export class SearchCategoryComponent implements OnInit {
  public breadCrumbData: Array<Object> = [{
    title: 'Menu Management',
    link: ''
  }, {
    title: 'Categories',
    link: '/search-category'
  }
  ];
  public searchStoreVal: boolean = false;
  public noRecords: boolean = false;
  @ViewChild("searchCategoriesForm") searchCategoriesForm;
  searchCategoryFormGroup: FormGroup;
  releaseTitle = new FormControl('', [Validators.required]);
  displayedColumns: string[] = ['sortOrder', 'categoryName', 'parentCategoryName', 'status'];
  dataSource: MatTableDataSource<UserData>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  public paginationData;
  public resultsLength = 0;
  buildFlag = false;
  constructor(private fb: FormBuilder, private https: HttpService) {
    this.buildSearchForm();
    this.dataSource = new MatTableDataSource();

  }
  public status: boolean = true;

  openFilter() {
    this.status = !this.status;
  }
  ngOnInit() {
    this.dataSource = new MatTableDataSource();
    this.dataSource.paginator = this.paginator;
    this.searchVal();
  }

  public buildSearchForm() {
    this.searchCategoryFormGroup = this.fb.group({
      status: [""],
      searchVal: [""]
    });
  }
  paginationDetail = new BehaviorSubject(
    {
      length: 10,
      pageIndex: 0,
      pageSize: 10
    });
  getUpdate(event) {
    this.paginationDetail.next(event);
    this.paginationData = event;
    this.searchVal();
  }

  searchVal() {
    this.searchStoreVal = true;
    if (this.searchCategoryFormGroup.invalid == false) {
      let formdata = this.searchCategoryFormGroup.value;
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
        ]
      }
      let SEARCH_ABOUTUS = "api/rpa/productcategory/v1/search"
      this.https.postJson(environment.APIEndpoint + SEARCH_ABOUTUS, data).subscribe(res => {
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
        console.log(err);
        this.searchStoreVal = true;
      })
    }
  }

  reset() {
    this.noRecords = false;
    this.buildSearchForm();
    this.searchVal();
  }
}

