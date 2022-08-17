import { OnInit, ViewChild, Output, Input, Component, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder, FormGroupDirective, FormArray, NgForm } from '@angular/forms';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { HttpService } from 'src/app/services/http-service';
import { environment } from 'src/environments/environment';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import * as moment from 'moment';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
export interface UserData {
    cityCode: string;
    cityName: string;
    arabCityName: string;
    countryName: string;
    createdTime: string;
    lastModifiedOn: string;
    modifiedBy: string;
    status: string;
}
export interface Country {
    countryId: number;
    countryName: string;
}

@Component({
    selector: 'search-cities',
    templateUrl: './search-cities.component.html',
    styleUrls: ['./search-cities.component.scss']
})
export class SearchCitiesComponent implements OnInit {
    public breadCrumbData: Array<Object> = [{
        title: 'Configurations',
        link: ''
    }, {
        title: 'City',
        link: '/search-cities'
    }
    ];
    public countryList;
    Countries: Country[] = [];
    countryCtrl = new FormControl();
    filteredcountries: Observable<Country[]>;
    public noRecords: boolean = false;
    public searchStoreVal: boolean = false;
    displayedColumns: string[] = ['cityCode', 'cityName', 'arabCityName', 'countryName', 'createdTime', 'modifiedTime', 'modifiedBy', 'status'];
    dataSource: MatTableDataSource<UserData>;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    public paginationData;
    public resultsLength = 0;
    public countries: any = [];
    searchCityForm: FormGroup;
    constructor(private fb: FormBuilder,private router:Router,
        private https: HttpService) {
        this.dataSource = new MatTableDataSource();

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
        console.log("menuIds");
        this.buildSearchForm();
        this.getAllCountries();
        this.dataSource = new MatTableDataSource();
        // this.dataSource.paginator = this.paginator;
        // this.searchVal();
        if(sessionStorage.getItem('CheckType')=='BrandCategory'){
            if (sessionStorage.searchValue) {
              this.searchCityForm.controls['searchVal'].setValue(sessionStorage.getItem('searchValue'));
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
        this.searchCityForm = this.fb.group({
            cityName: ["", Validators.pattern('[a-zA-Z0-9\u0600-\u06FF \"\'&(),.:?_-]*')],
            cityCode: ["", Validators.pattern('[a-zA-Z0-9]{1,10}$')],
            country: [""],
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
        if (this.searchCityForm.invalid == false) {
            let formdata = this.searchCityForm.value;
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
                        "fieldName": "cityName",
                        "fieldValue": formdata.cityName,
                    },
                    {
                        "fieldName": "cityCode",
                        "fieldValue": formdata.cityCode
                    },
                    {
                        "fieldName": "country.oid",
                        // "fieldValue": this.countryId != undefined ? this.countryId : "" 
                        "fieldValue": formdata.country
                    },
                    {
                        "fieldName": "status",
                        "fieldValue": formdata.status
                    }
                ]
            }
            let SEARCH_COUNTRY = "api/rpa/master/city/v1/search"
            this.https.postJson(environment.APIEndpoint + SEARCH_COUNTRY, data).subscribe(res => {
                this.searchStoreVal = false;
                this.dataSource = new MatTableDataSource(res["items"]);
                this.dataSource.sort = this.sort;
                this.resultsLength = res["totalCount"]
                if (this.resultsLength == 0) {
                    this.noRecords = true;
                } else {
                    this.noRecords = false;
                }
                // if (this.paginationData !== undefined && this.paginationData.pageIndex * this.paginationData.pageSize > this.resultsLength) {
                //     this.paginationData.pageIndex = 0;
                //     this.paginator.pageIndex = 0;
                //     this.searchVal();
                // }
            }, err => {
                console.log(err);
                this.searchStoreVal = false;
            })
        }


    }
    getAllCountries() {
        let GET_ALL_COUNTRIES = environment.APIEndpoint + "api/rpa/master/country/v1/get/countries";
        this.https.getJson(GET_ALL_COUNTRIES)
            .subscribe((response) => {
                console.log(response);
                this.countries = response;

            })
    }
    public reset() {
        this.countryCtrl.reset('');
        this.countryId = ''
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
        localStorage.setItem('CitiesViewID',ID);
        this.router.navigate(['/view-cities'])
      }
      getAllCountriesAuto() {
        // console.log(this.KioskForm.get('brands').value);
        let GET_ALL_COUNTRIES = environment.APIEndpoint + "api/rpa/master/country/v1/get/countries";
        this.https.getJson(GET_ALL_COUNTRIES)
        .subscribe((response) => {
        // console.log(response);
        this.countryList = response;
        for (let i = 0; i <= this.countryList.length - 1; i++) {
        let objMallkey = {
        countryId: this.countryList[i]['countryId'],
        countryName: this.countryList[i]['countryName'],
        }
        console.log(objMallkey);
        this.Countries.push(objMallkey);
        }
        this.filteredcountries = this.countryCtrl.valueChanges
        .pipe(
        startWith(''),
        map(country => country ? this._filterCountries(country) : this.Countries.slice())
        );
        },
        (error) => {
        console.log(error);
        });
        }
        private _filterCountries(value: string): Country[] {
        const filterValue = value.toLowerCase();
        return this.Countries.filter(country => country.countryName.toLowerCase().indexOf(filterValue) === 0);
        }
        
        public countryId;
        
        getAllcountry(countryId){
        this.countryId = countryId;
        console.log(this.countryId);
        }
}
