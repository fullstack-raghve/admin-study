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

export interface City {
    cityId: number;
    cityName: string;
}

export interface UserData {
    mallCode: string;
    mallName: string;
    arabMallName: string;
    countryName: string;
    cityName: string;
    createdTime: string;
    lastModifiedOn: string;
    modifiedBy: string;
    status: string;
}
@Component({
    selector: 'search-malls',
    templateUrl: './search-malls.component.html',
    styleUrls: ['./search-malls.component.scss']
})
export class SearchMallsComponent implements OnInit {
    searchMallForm: FormGroup;
    public breadCrumbData: Array<Object> = [{
        title: 'Configurations',
        link: ''
    }, {
        title: 'Mall',
        link: '/search-malls'
    }
    ];

    public cityId;
    public cityList;
    Cities: City[] = [];
    cityCtrl = new FormControl();
    filteredCities: Observable<City[]>;

    public noRecords: boolean = false;
    public searchStoreVal: boolean = false;
    displayedColumns: string[] = ['mallCode', 'mallName', 'arabMallName', 'countryName', 'cityName', 'createdTime', 'modifiedTime', 'modifiedBy', 'status'];
    dataSource: MatTableDataSource<UserData>;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    @ViewChild('searchForm') searchForm;
    public showCountryError: boolean = false;
    public paginationData;
    public resultsLength = 0;
    public countries: any = [];
    public cities: any = [];

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
        this.getAllCountries();
        this.dataSource = new MatTableDataSource();
        // this.dataSource.paginator = this.paginator;
        // this.searchVal();
        if(sessionStorage.getItem('CheckType')=='Malls'){
            if (sessionStorage.searchValue) {
              this.searchMallForm.controls['searchVal'].setValue(sessionStorage.getItem('searchValue'));
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
            sessionStorage.setItem('CheckType','Malls');
          }

    }
    public buildSearchForm() {
        this.searchMallForm = this.fb.group({
            mallName: ["",],
            mallCode: ["", Validators.pattern('[a-zA-Z0-9]{1,10}$')],
            country: [""],
            city: [""],
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
        let formdata = this.searchMallForm.value;
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
                    "fieldName": "mallCode",
                    "fieldValue": formdata.mallCode,
                },
                {
                    "fieldName": "mallName",
                    "fieldValue": formdata.mallName
                },
                {
                    "fieldName": "city.country.oid",
                    "fieldValue": formdata.country
                },

                {
                    "fieldName": "city.oid",
                    "fieldValue": this.cityId != undefined ? this.cityId : ""
                },

                {
                    "fieldName": "status",
                    "fieldValue": formdata.status
                }
            ]
        }
        let SEARCH_MALL = "api/rpa/master/mall/v1/search"
        this.https.postJson(environment.APIEndpoint + SEARCH_MALL, data).subscribe(res => {
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
    getAllCountries() {
        let GET_ALL_COUNTRIES = environment.APIEndpoint + "api/rpa/master/country/v1/get/countries";
        this.https.getJson(GET_ALL_COUNTRIES)
            .subscribe((response) => {
                console.log(response);
                this.countries = response;
                console.log(this.countries.countryId);
                
                // this.getAllCitiesA(this.countries.countryId)
            })
    }
    getAllCities(countryId) {
        let GET_ALL_CITIES = environment.APIEndpoint + "api/rpa/master/city/v1/get/cities";
        this.https.getJson(GET_ALL_CITIES + "?countryIds=" + countryId)
            .subscribe((response) => {
                console.log(response);
                this.cities = response;

            })
    }
    reset() {
        this.cityCtrl.reset('');
        this.cityId = '';
        this.noRecords = false;
        this.buildSearchForm();
        this.showCountryError = false;
        this.cities = [];
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
    checkCountryId() {
        if (this.cities.length == 0)
            this.showCountryError = true;
        else
            this.showCountryError = false;
    }

    public countryID;
    getCountryId(countryId){
        this.countryID = countryId;
        if (this.countryID){
            this.getAllCitiesA(this.countryID);
        }
    }

    getAllCitiesA(countryId) {
        console.log(countryId);
        this.countryID = countryId;
        let GET_ALL_CITIES = environment.APIEndpoint + "api/rpa/master/city/v1/get/cities";
        this.https.getJson(GET_ALL_CITIES + "?countryIds=" +  this.countryID)
            .subscribe((response) => {
                // console.log(response);
                this.cityList = [];
                this.Cities = [];
                this.cityList = response;
                for (let i = 0; i <= this.cityList.length - 1; i++) {
                    let objMallkey = {
                        cityId: this.cityList[i]['cityId'],
                        cityName: this.cityList[i]['cityName'],
                    }
                    // console.log(objMallkey);
                    this.Cities.push(objMallkey);
                }
                this.filteredCities = this.cityCtrl.valueChanges
                    .pipe(
                        startWith(''),
                        map(city => city ? this._filterCities(city) : this.Cities.slice())
                    );
            },
                (error) => {
                    console.log(error);
                });
    }
    private _filterCities(value: string): City[] {
        const filterValue = value.toLowerCase();
        return this.Cities.filter(city => city.cityName.toLowerCase().indexOf(filterValue) === 0);
    }


    getAllcity(countryId) {
        this.cityId = countryId;
        console.log(this.cityId);
    }
    MoveToView(ID){
        localStorage.setItem('MallViewID',ID);
        this.router.navigate(['/view-malls'])
    }
}
