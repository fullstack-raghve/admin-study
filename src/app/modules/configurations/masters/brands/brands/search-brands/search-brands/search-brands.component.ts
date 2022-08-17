import {  OnInit, ViewChild, Output, Input, Component, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder, FormGroupDirective, FormArray, NgForm } from '@angular/forms';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import { HttpService } from 'src/app/services/http-service';
import { environment } from 'src/environments/environment';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
export interface UserData {
  brandCode: string;
  brandName: string;
  brandCategory: string;
  lastModifiedOn: string;
  status: string;
}
@Component({
  selector: 'search-brands',
  templateUrl: './search-brands.component.html',
  styleUrls: ['./search-brands.component.scss']
})
export class SearchBrandsComponent implements OnInit {
    public breadCrumbData: Array<Object> = [{
        title: 'Configurations',
        link: ''
    }, {
        title: 'Brand',
        link: '/search-brands'
    }];
    displayedColumns: string[] = ['brandCode', 'brandName', 'categoryName', 'modifiedTime', 'status'];
    dataSource: MatTableDataSource<UserData>;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    searchBrandForm:FormGroup;
    public paginationData;
    public  resultsLength = 0;
    public brandCategories;
    constructor(private fb: FormBuilder,
        private https: HttpService) {
            this.dataSource = new MatTableDataSource();
    }

    status = true;
    openFilter() {
        this.status = !this.status;
    }
    ngOnInit()
    {
        this.buildSearchBrandForm();
        this.getBrandCategories();
        this.searchVal();
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    }
    public buildSearchBrandForm(){
        let form = {
            brandName: [""],
            brandCode: [""],
            brandCategory: [""],
            status: [""],
            searchVal: [""]
          }
          this.searchBrandForm=this.fb.group(form);
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
        let formdata = this.searchBrandForm.value;
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
                    "fieldName": "brandName",
                    "fieldValue": formdata.brandName,
                },
                {
                    "fieldName": "brandCode",
                    "fieldValue": formdata.brandCode
                },
                {
                    "fieldName": "brandCategories",
                    "fieldValue": formdata.brandCategory.toString()
                },
                {
                    "fieldName": "status",
                    "fieldValue": formdata.status
                }
            ]
        }
        
        let SEARCH_BRAND="api/rpa/master/brand/v1/search"
        this.https.postJson(environment.APIEndpoint + SEARCH_BRAND, data).subscribe(res => {
            console.log(res);
            this.dataSource = new MatTableDataSource(res["items"]);
            this.dataSource.sort = this.sort;
            console.log('data : '+res);
            this.resultsLength = res["totalCount"]

        }, err => {
            console.log(err)
        })
    }
    

    resetForm(){
        this.buildSearchBrandForm();
        this.searchVal();
       }

    getBrandCategories(){
        let GET_BRAND_CATEGORIES = "api/rpa/master/brandCategory/v1/get/categories"
        this.https.getJson(environment.APIEndpoint+GET_BRAND_CATEGORIES).subscribe(
            (response)=>{
                this.brandCategories = response;
                console.log(response);
                
            }
        );
    }
}
