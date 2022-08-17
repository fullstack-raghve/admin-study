import { OnInit, ViewChild, Output, Input, Component, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder, FormGroupDirective, FormArray, NgForm } from '@angular/forms';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { environment } from 'src/environments/environment';
import { HttpService } from 'src/app/services/http-service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Router } from '@angular/router';

export interface EnquiryData {
    partnerCode: string;
    partnerTitle: string;
    arabPartnerTitle: string;
    createdOn: string;
    lastModifiedOn: string;
    lastModifiedBy: string;
    status: string;
}

@Component({
    selector: 'search-partner',
    templateUrl: './search-partner.component.html',
    styleUrls: ['./search-partner.component.scss']
})
export class SearchPartnerComponent implements OnInit {
    displayedColumns: string[] = ['partnerCode', 'partnerTitle', 'arabPartnerTitle', 'createdTime', 'modifiedTime', 'modifiedBy', 'status'];
    dataSource: MatTableDataSource<EnquiryData>;
    public noRecords: boolean = false;
    public searchStoreVal: boolean = false;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    searchPartnerForm: FormGroup;
    public paginationData;
    public resultsLength = 0;
    public breadCrumbData: Array<Object> = [
        {
            title: 'Configurations',
            link: ''
        }, {
            title: 'Partner',
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
        this.buildSearchPartnerForm();
        // this.searchVal();
        this.dataSource = new MatTableDataSource();
        // this.dataSource.paginator = this.paginator;
        // this.dataSource.sort = this.sort;
        if(sessionStorage.getItem('CheckType')=='Partner'){
            if (sessionStorage.searchValue) {
              this.searchPartnerForm.controls['searchVal'].setValue(sessionStorage.getItem('searchValue'));
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
            sessionStorage.setItem('CheckType','Partner');
          }
    }

    public buildSearchPartnerForm() {
        let form = {
            partnerCode: ["", Validators.pattern('^[a-zA-Z0-9]*')],
            partnerTitle: ["", Validators.pattern('^[a-zA-Z0-9\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF \"&\'(),-:.?_ ]*')],
            status: [""],
            searchVal: [""]
        }
        this.searchPartnerForm = this.fb.group(form);
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
        let formdata = this.searchPartnerForm.value;
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
                    "fieldName": "partnerCode",
                    "fieldValue": formdata.partnerCode,
                },
                {
                    "fieldName": "partnerTitle",
                    "fieldValue": formdata.partnerTitle
                },
                {
                    "fieldName": "status",
                    "fieldValue": formdata.status
                }
            ]
        }

        let SEARCH_PARTNER = "api/rpa/master/partner/v1/search"
        this.https.postJson(environment.APIEndpoint + SEARCH_PARTNER, data).subscribe(res => {
            this.searchStoreVal = false;
            console.log(res);
            this.dataSource = new MatTableDataSource(res["items"]);
            this.dataSource.sort = this.sort;
            console.log('data : ' + res);
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

    resetForm() {
        this.noRecords = false;
        this.buildSearchPartnerForm();
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
        localStorage.setItem('PartnerViewID',ID);
        this.router.navigate(['/view-partner'])
    }
}
