import { OnInit, ViewChild, Component } from '@angular/core';
import { FormGroup, FormBuilder} from '@angular/forms';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { HttpService } from 'src/app/services/http-service';
import { environment } from 'src/environments/environment';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import * as moment from 'moment';
import { Router } from '@angular/router';
import { CommonFunctions } from 'src/app/services/common-functions';

export interface UserData {
    prId: string;
    releaseTitle: string;
    brand: string;
    startDate: string;
    endDate: string;
    lastModifiedOn: string;
    status: string;
}

@Component({
    selector: 'search-press-release',
    templateUrl: './search-press-release.component.html',
    styleUrls: ['./search-press-release.component.scss']
})

export class SearchPressReleaseComponent implements OnInit {
    public breadCrumbData: Array<Object> = [{
        title: 'Press Release',
        link: ''
    }];
    public noRecords: boolean = false;
    public searchStoreVal: boolean = false;
    public loadingResponse: boolean = false;
    displayedColumns: string[] = ['pressReleaseId', 'pressReleaseTitle', 'brandName', 'publishFromDate', 'publishToDate', 'createdOn', 'modifiedTime', 'status'];
    dataSource: MatTableDataSource<UserData>;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    public paginationData;
    public resultsLength = 0;
    public countries: any = [];
    searchPressForm: FormGroup;
    public brandList: any = [];
    public minDate: Date = new Date();
    public searchData : any;

    constructor(private fb: FormBuilder,
        private commonFunctions: CommonFunctions,
        private https: HttpService,
        public router: Router) {
        this.dataSource = new MatTableDataSource();
    }

    status = true;
    openFilter() {
        this.status = !this.status;
    }

    ngOnInit() {
        this.getAllCountries();
        this.getAllBrands();
        this.paginationData = this.commonFunctions.initPaginationData(this.resultsLength);
        if(sessionStorage.getItem('pressRelease')){
            this.searchData = JSON.parse(sessionStorage.getItem('pressRelease'));
            this.commonFunctions.checkFilterContainsData(this.searchData) ?  this.openFilter(): '';
        }
        this.buildSearchForm();

        if (sessionStorage.getItem('CheckType') == 'PressRelease') {
            if (sessionStorage.searchValue) {
                this.searchPressForm.controls['searchVal'].setValue(sessionStorage.getItem('searchValue'));
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
            sessionStorage.setItem('CheckType', 'PressRelease');
        }
    }

    public buildSearchForm() {
    let data = this.searchData;
    this.searchPressForm = this.fb.group({
        releaseTitle: [data != undefined ? data.releaseTitle : ''],
        country: [data != undefined ? data.country : ''],
        status: [data != undefined ? data.status : ''],
        fromDate: [data != undefined ? data.fromDate : ''],
        endDate: [data != undefined ? data.endDate : ''],
        brands: [data != undefined ? data.brands : ''],
        searchVal: [data != undefined ? data.searchVal : ''],
        livePressRelease: [data != undefined ? data.livePressRelease : ''],
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

    indexResetFormdataSearch() {
        let formData = this.searchPressForm.value;
        if (formData.searchVal != '' && formData.searchVal != null) {
            this.paginationData.pageIndex = 0;
        }
        if (formData.releaseTitle != '' && formData.releaseTitle != null) {
            this.paginationData.pageIndex = 0;
        }
        if (formData.brands != '' && formData.brands != null) {
            this.paginationData.pageIndex = 0;
        }
        if (formData.country != '' && formData.country != null) {
            this.paginationData.pageIndex = 0;
        }
        if (formData.fromDate != '' && formData.fromDate != null) {
            this.paginationData.pageIndex = 0;
        }
        if (formData.endDate != '' && formData.endDate != null) {
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

    searchVal() {
        this.searchStoreVal = true;
        this.loadingResponse = true;
        let formdata = this.searchPressForm.value;
        sessionStorage.setItem('searchValue', formdata.searchVal);
        if (!this.searchPressForm.invalid) {
            let formdata = this.searchPressForm.value;

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
                        "fieldName": "releaseTitle",
                        "fieldValue": formdata.releaseTitle,
                    },
                    {
                        "fieldName": "brand.oid",
                        "fieldValue": formdata.brands
                    },
                    {
                        "fieldName": "countries.oid",
                        "fieldValue": formdata.country,
                    },
                    {
                        "fieldName": "publishFromDate",
                        "fieldValue": formdata.fromDate != '' ? moment(formdata.fromDate).format('YYYY-MM-DD') : '',
                    },
                    {
                        "fieldName": "publishToDate",
                        "fieldValue": formdata.endDate != '' ? moment(formdata.endDate).format('YYYY-MM-DD') : '',
                    },
                    {
                        "fieldName": "status",
                        "fieldValue": formdata.status
                    },
                    {
                        "fieldName": "livePressRelease",
                        "fieldValue": formdata.livePressRelease == false ? '' : formdata.livePressRelease
                    },
                ]
            }
            this.setSearchData();
            let SEARCH_PRESS_RELEASE = "api/rpa/pressrelease/v1/search"
            this.https.postJson(environment.APIEndpoint + SEARCH_PRESS_RELEASE, data).subscribe(res => {
                this.searchStoreVal = false;
                this.loadingResponse = false;
                this.dataSource = new MatTableDataSource(res["items"]);
                this.dataSource.sort = this.sort;
                this.resultsLength = res["totalCount"];
                if (this.resultsLength == 0) {
                    this.noRecords = true;
                } else {
                    this.noRecords = false;
                }
            }, err => {
                this.searchStoreVal = false;
                this.loadingResponse = false
            });
        }
    }

    getAllCountries() {
        let GET_ALL_COUNTRIES = environment.APIEndpoint + "api/rpa/master/country/v1/get/countries";
        this.https.getJson(GET_ALL_COUNTRIES)
            .subscribe((response) => {
                this.countries = response;
            });
    }

    getAllBrands() {
        let GET_ALL_ONLINE_BRANDS = environment.APIEndpoint + "api/rpa/master/brand/v1/get/brands";
        this.https.getJson(GET_ALL_ONLINE_BRANDS)
            .subscribe((response) => {
                this.brandList = response;
            });
    }

    reset() {
        this.searchData = undefined;
        this.noRecords = false;
        this.buildSearchForm();
        this.getUpdate(this.paginationData);
        this.paginator.pageIndex = this.paginationData.pageIndex;
        this.searchVal();
    }

    viewPressRelease(ID) {
        localStorage.setItem('PressReleaseId', ID);
        this.router.navigate(['/view-press-release']);
    }

    public setSearchData(){
        let formdata = this.searchPressForm.value;
        let selectedData = {
          releaseTitle: formdata.releaseTitle,
          brands: formdata.brands,
          country: formdata.country,
          fromDate: formdata.fromDate,
          endDate: formdata.endDate,
          status: formdata.status,
          livePressRelease: formdata.livePressRelease,
          searchVal: formdata.searchVal
        }
        sessionStorage.setItem('pressRelease', JSON.stringify(selectedData))
      }
}
