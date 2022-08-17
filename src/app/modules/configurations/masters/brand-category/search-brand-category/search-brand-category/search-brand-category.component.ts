import { OnInit, ViewChild, Output, Input, Component, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder, FormGroupDirective, FormArray, NgForm } from '@angular/forms';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { environment } from 'src/environments/environment';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { HttpService } from 'src/app/services/http-service';
import { Router } from '@angular/router';

export interface UserData {
    categoryCode: string;
    image: string;
    categoryTitle: string;
    arabCategoryTitle: string;
    createdTime: string;
    lastModifiedOn: string;
    modifiedBy: string;
    status: string;
}

@Component({
    selector: 'search-brand-category',
    templateUrl: './search-brand-category.component.html',
    styleUrls: ['./search-brand-category.component.scss']
})
export class SearchBrandCategoryComponent implements OnInit {
    public breadCrumbData: Array<Object> = [{
        title: 'Configurations',
        link: ''
    }, {
        title: 'Brand Category',
        link: '/search-brand-category'
    }
    ];
    public noRecords: boolean = false;
  public searchStoreVal: boolean = false;
    displayedColumns: string[] = ['categoryCode', 'image', 'categoryTitle','arabCategoryTitle','createdTime', 'modifiedTime','modifiedBy', 'status'];
    dataSource: MatTableDataSource<UserData>;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    searchBrandForm: FormGroup;
    public paginationData;
    public resultsLength = 0;
    public filePathUrl = localStorage.getItem('imgBaseUrl');
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
        if(sessionStorage.getItem('CheckType')=='BrandCategory'){
            if (sessionStorage.searchValue) {
              this.searchBrandForm.controls['searchVal'].setValue(sessionStorage.getItem('searchValue'));
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
            sessionStorage.setItem('CheckType','BrandCategory');
          }
    }
    public buildSearchForm() {
        this.searchBrandForm = this.fb.group({
            categoryCode: ["", Validators.pattern("^[A-Za-z0-9]{1,10}$")],
            categoryName: ["",],
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
        if (this.searchBrandForm.invalid == false) {
            let formdata = this.searchBrandForm.value;
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
                        "fieldName": "categoryTitle",
                        "fieldValue": formdata.categoryName,
                    },
                    {
                        "fieldName": "categoryCode",
                        "fieldValue": formdata.categoryCode
                    },
                    {
                        "fieldName": "status",
                        "fieldValue": formdata.status
                    }
                ]
            }
            let SEARCH_BRAND = "api/rpa/master/brandCategory/v1/search"
            this.https.postJson(environment.APIEndpoint + SEARCH_BRAND, data).subscribe(res => {
                this.searchStoreVal = false;
                console.log(res);
                this.dataSource = new MatTableDataSource(res["items"]);
                this.dataSource.sort = this.sort;
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
    localStorage.setItem('BrandCategoryViewID',ID);
    this.router.navigate(['/view-brand-category'])
  }
}
