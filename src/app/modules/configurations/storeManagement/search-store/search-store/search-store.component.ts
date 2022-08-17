import { OnInit, ViewChild, Output, Input, Component, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder, FormGroupDirective, FormArray, NgForm } from '@angular/forms';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { HttpService } from '../../../../../services/http-service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../../../environments/environment';
import { SnackBarComponent } from 'src/app/shared/components/snack-bar/snack-bar.component';
import { MatChipInputEvent, MatSnackBar } from '@angular/material';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Sort } from '@angular/material/sort';
import { Router, ActivatedRoute } from '@angular/router';
import * as moment from 'moment';

export interface UserData {
  storeId: number;
  userId: number;
  userName: string;
  storeName: string;
  city: string;
  country: string;
  phoneNumber: number;
  adminName: string;
  status: string;

}
@Component({
  selector: 'app-search-store',
  templateUrl: './search-store.component.html',
  styleUrls: ['./search-store.component.scss']
})
export class SearchStoreComponent implements OnInit {
  public breadCrumbData: Array<Object> = [{
    title: 'Configurations',
    link: ''
  }, {
    title: 'Store Management',
    link: '/search-store'
  }
  ];
  public toggleVal: boolean = true;
  public statusValue: string;
  public storeIdValue;
  displayedColumns: string[] = ['storeId', 'userId', 'userName', 'storeName', 'brandName', 'mallName', 'cityName', 'countryName', 'phoneNumber', 'email', 'storeAdminName', 'storeWallid', 'launchDate', 'status'];
  public searchStoreForm: FormGroup;
  public paginationData;
  public resultsLength = 0;
  public roleId;
  public cities: any = [];
  public mallList = [];
  public countries: any = [];
  public showCountryError: boolean = false;
  public searchStoreVal: boolean = false;
  public loadingResponse: boolean = false;
  public noRecords: boolean = false;
  public showCityError = false;
  public brandList = [];
  public sortColumn = "modifiedTime";
  public sortDirection = "desc";
  public cityId;
  public countryId;
  public mallId;
  public minDate: Date = new Date();

  paginationDetail = new BehaviorSubject({
    length: 10,
    pageIndex: 0,
    pageSize: 10
  });

  status = true;

  dataSource: MatTableDataSource<UserData>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  constructor(private fb: FormBuilder, private router: Router,
    private https: HttpService, public snackBar: MatSnackBar) {
    this.dataSource = new MatTableDataSource();
  }
  ngOnInit() {
    this.paginationData = {
      pageIndex: 0,
      pageSize: 10,
      length: this.resultsLength,
      previousPageIndex: 0
    };
    this.buildStoreForm();
    this.getAllBrands();
    this.getAllCountries();
    this.getRoles();
    // this.dataSource.paginator = this.paginator;
    this.dataSource = new MatTableDataSource();
    if (sessionStorage.getItem('CheckType') == 'Stores') {
      if (sessionStorage.searchValue) {
        this.searchStoreForm.controls['searchVal'].setValue(sessionStorage.getItem('searchValue'));
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
      sessionStorage.setItem('CheckType', 'Stores');
    }
    // localStorage.setItem('saveIndex','TRUE');
    // this.dataSource.sort = this.sort;
  }
  openFilter() {
    this.status = !this.status;

  }
  // sortingDataAccessor:((data: T, sortHeaderId: string) => string|number) =
  //        (data: T, sortHeaderId: string): string|number => {
  //      const value: any = data[sortHeaderId];
  //      return +(value) ? Number(value) : value;
  //    }

  getRoles() {
    this.https.getJson(environment.APIEndpoint + "api/rpa/role/v1/get/roles").subscribe(res => {
      console.log(res);
      this.roleId = res;
    }, err => {
      console.log(err)
    })
  }

  getUpdate(event) {
    sessionStorage.setItem('paginationData', JSON.stringify(event));
    this.paginationDetail.next(event);
    this.paginationData = event;
    this.searchVal();
  }

  resetForm() {

    this.buildStoreForm();
    // this.paginationData = {
    //   pageIndex: 0,
    //   pageSize: 10,
    //   length: this.resultsLength,
    //   previousPageIndex: 0
    // };
    this.getUpdate(this.paginationData);
    this.paginator.pageIndex = this.paginationData.pageIndex;
    this.showCountryError = false;
    this.showCityError = false;
    this.countries = [];
    this.cities = [];
    this.mallList = [];
    this.getAllCountries();
    this.searchVal();
  }
  searchKey() {
    // this.paginationData = {
    //   pageIndex: 0,
    //   pageSize: 10,
    //   length: this.resultsLength,
    //   previousPageIndex: 0
    // };
    this.getUpdate(this.paginationData);
    this.paginator.pageIndex = this.paginationData.pageIndex;
  }

  indexResetFormdataSearch() {

    let formdata = this.searchStoreForm.value;

    if (formdata.searchVal != '' && formdata.searchVal != null) {
      this.paginationData.pageIndex = 0;
    }
    if (formdata.adminName != '' && formdata.adminName != null) {
      this.paginationData.pageIndex = 0;
    }
    if (formdata.brands != '' && formdata.brands != null) {
      this.paginationData.pageIndex = 0;
    }
    if (formdata.storeId != '' && formdata.storeId != null) {
      this.paginationData.pageIndex = 0;
    }
    if (formdata.storeName != '' && formdata.storeName != null) {
      this.paginationData.pageIndex = 0;
    }
    if (this.cityId != '' && this.cityId != null) {
      this.paginationData.pageIndex = 0;
    }
    if (formdata.country != '' && formdata.country != null) {
      this.paginationData.pageIndex = 0;
    }
    if (formdata.emailId != '' && formdata.emailId != null) {
      this.paginationData.pageIndex = 0;
    }
    if (formdata.phoneNumber != '' && formdata.phoneNumber != null) {
      this.paginationData.pageIndex = 0;
    }
    if (formdata.status != '' && formdata.status != null) {
      this.paginationData.pageIndex = 0;
    }
    if (formdata.launchDate == 'Invalid date') {
      formdata.launchDate = '';
    }
    if (formdata.launchDate != '' && formdata.launchDate != null) {
      this.paginationData.pageIndex = 0;
    }
  }

  searchVal() {
    let formdata = this.searchStoreForm.value;
    if (formdata.launchDate == 'Invalid date') {
      formdata.launchDate = '';
    }
    sessionStorage.setItem('searchValue', formdata.searchVal);
    this.searchStoreVal = true;
    this.loadingResponse = true;
    if (!this.searchStoreForm.invalid) {
      let data = {
        "page": this.paginationData !== undefined ? this.paginationData.pageIndex : "0",
        "pageSize": this.paginationData !== undefined ? this.paginationData.pageSize : "10",
        "order": {
          "column": this.sortColumn,
          "dir": this.sortDirection
        },
        "keySearch": sessionStorage.getItem('searchValue'),
        "fieldSearch": [
          {
            "fieldName": "storeAdmin.adminName",
            "fieldValue": formdata.adminName,
          },
          {
            "fieldName": "brand.oid",
            "fieldValue": formdata.brands
          },
          {
            "fieldName": "storeId",
            "fieldValue": formdata.storeId
          },
          {
            "fieldName": "storeName",
            "fieldValue": formdata.storeName
          },
          {
            "fieldName": "mall.oid",
            "fieldValue": formdata.mall,
          },
          {
            "fieldName": "launchDate",
            "fieldValue": formdata.launchDate != '' && formdata.launchDate != null? moment(formdata.launchDate).format('YYYY-MM-DD') : '',
          },
          {
            "fieldName": "city.oid",
            "fieldValue": this.cityId != undefined ? this.cityId : ''
          },
          {
            "fieldName": "country.oid",
            "fieldValue": formdata.country
          },
          {
            "fieldName": "storeAdmin.emailId",
            "fieldValue": formdata.emailId
          },
          {
            "fieldName": "storeAdmin.phoneNumber",
            "fieldValue": formdata.phoneNumber
          },
          {
            "fieldName": "status",
            "fieldValue": formdata.status
          }
        ]
      }
      this.https.postJson(environment.APIEndpoint + 'api/rpa/store/v1/search', data).subscribe(res => {
        // for (let i = 0; i < res["items"].length; i++) {

        //   this.statusValue = res["items"][i]['status'];

        //   res["items"][i]['status'] = {
        //     status: this.statusValue,
        //   }

        // }
        console.log(res["items"]);

        this.dataSource = new MatTableDataSource(res["items"]);
        console.log(this.dataSource);
        this.dataSource.sort = this.sort;
        this.searchStoreVal = false;
        this.loadingResponse = false;





        this.resultsLength = res["totalCount"];
        if (this.resultsLength == 0) {
          this.noRecords = true;
        } else {
          this.noRecords = false;
        }

        // if (this.paginationData !== undefined && this.paginationData.pageIndex * this.paginationData.pageSize > this.resultsLength) {
        //   this.paginationData.pageIndex = 0;
        //   this.paginator.pageIndex = 0;
        //   this.searchVal();
        // }
      }, err => {
        console.log(err);
        this.searchStoreVal = false;
        this.loadingResponse = false;
      })
    }
  }

  buildStoreForm() {
    this.searchStoreForm = this.fb.group({
      // fullName: ["",Validators.pattern('[a-zA-Z\u0600-\u06FF \"&\'(),-:.?_ ]*')],
      brands: [""],
      storeId: ["", Validators.pattern('[a-zA-Z0-9]{1,15}$')],
      adminName: ["", Validators.pattern('[a-zA-Z ]{1,15}$')],
      country: [""],
      city: [""],
      mall: [""],
      launchDate: [],
      emailId: ["", Validators.compose([Validators.minLength(7), Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")])],
      phoneNumber: ["", Validators.compose([Validators.minLength(8), Validators.pattern('[0-9]{8,15}$')])],
      storeName: [""],
      status: [""],
      searchVal: [""]
    });
  }

  getAllCountries() {
    this.cityId = '';
    this.cities = [];
    let GET_ALL_COUNTRIES = environment.APIEndpoint + "api/rpa/master/country/v1/get/countries";
    this.https.getJson(GET_ALL_COUNTRIES)
      .subscribe((response) => {
        this.countries = response;
        this.cities = [];

      })
  }

  getAllCities(countryId) {
    console.log(countryId);
    this.cities = [];
    this.cityId = '';
    this.mallList = [];
    this.mallId = '';
    console.log(this.cityId);
    this.countryId = countryId;

    if (countryId == undefined || countryId == '') {
      //    this.showCountryError=true;
    } else {
      let GET_ALL_CITIES = environment.APIEndpoint + "api/rpa/master/city/v1/get/cities";
      this.https.getJson(GET_ALL_CITIES + "?countryIds=" + this.countryId)
        .subscribe((response) => {
          this.cities = response;
          this.showCountryError = false;
          this.showCityError = false;
        })
    }
  }

  getAllMalls(cityId) {
    console.log(cityId);
    this.mallList = [];
    this.cityId = cityId;
    if (this.cityId == undefined || this.cityId == '') {
      // this.showCityError=true;
    } else {
      let GET_ALL_MALLS = environment.APIEndpoint + "api/rpa/master/mall/v1/get/malls"
      this.https.getJson(GET_ALL_MALLS + "?cityIds=" + this.cityId)
        .subscribe((response) => {
          this.mallList = response;
          this.showCityError = false;

        })

    }

  }

  checkCityId(mallId) {
    console.log(mallId);
    this.mallId = mallId;
    if (this.mallList.length == 0)
      this.showCityError = true;
    else
      this.showCityError = false

    if (this.cities.length == 0)
      this.showCountryError = true;
    else
      this.showCountryError = false

  }

  isCountrySelected(country) {
    if (country == undefined || country == '')
      this.showCountryError = true;
    else
      this.showCountryError = false
  }

  getAllBrands() {
    let GET_ALL_ONLINE_BRANDS = environment.APIEndpoint + "api/rpa/master/brand/v1/get/brands";
    this.https.getJson(GET_ALL_ONLINE_BRANDS)
      .subscribe((response) => {
        console.log(response);
        this.brandList = response;
      })
  }

  sortData(sort: Sort) {
    console.log(sort.active);
    console.log(sort.direction);
    if (!sort.active || sort.direction === '') {
      this.sortColumn = "modifiedTime";
      this.sortDirection = "desc"; 
    } 
    if (sort.active == 'userName') {
      this.sortColumn = 'userName';
      this.sortDirection = sort.direction;
    }
    else if (sort.active == 'storeName') {
      this.sortColumn = 'storeName';
      this.sortDirection = sort.direction;
    }
    else if (sort.active == 'storeId') {
      this.sortColumn = 'storeId';
      this.sortDirection = sort.direction;
    }
    else if (sort.active == 'createdBy') {
      this.sortColumn = 'createdBy';
      this.sortDirection = sort.direction;
    }
    else if (sort.active == 'brandName') {
      this.sortColumn = 'brandName';
      this.sortDirection = sort.direction;
    }
    else if (sort.active == 'mallName') {
      this.sortColumn = 'mallName';
      this.sortDirection = sort.direction;
    }
    else if (sort.active == 'cityName') {
      this.sortColumn = 'cityName';
      this.sortDirection = sort.direction;
    }
    else if (sort.active == 'countryName') {
      this.sortColumn = 'countryName';
      this.sortDirection = sort.direction;
    }
    else if (sort.active == 'storeAdmin.phoneNumber') {
      this.sortColumn = 'storeAdmin.phoneNumber';
      this.sortDirection = sort.direction;
    }
    else if (sort.active == 'email') {
      this.sortColumn = 'email';
      this.sortDirection = sort.direction;
    }
    else if (sort.active == 'storeAdmin.adminName') {
      this.sortColumn = 'storeAdmin.adminName';
      this.sortDirection = sort.direction;
    }
    else if (sort.active == 'storeWallid') {
      this.sortColumn = 'storeWallid';
      this.sortDirection = sort.direction;
    }
    else if (sort.active == 'launchDate') {
      this.sortColumn = 'launchDate';
      this.sortDirection = sort.direction;
    }
    else if (sort.active == 'status') {
      this.sortColumn = 'status';
      this.sortDirection = sort.direction;
    }
    else {
      this.sortColumn = sort.active;
      this.sortDirection = sort.direction;
    }

    this.searchVal();
  }

  viewStore(ID) {
    localStorage.setItem('StoreViewID', ID);
    // localStorage.removeItem('saveIndex');
    this.router.navigate(['/view-store']);
  }


  public ev;
  public evof;

  toggleStatusOnline(event, status, storeId) {
    this.ev = event;
    this.storeIdValue = storeId;
    this.statusValue = status;
    console.log(this.ev, + ' == ', this.storeIdValue, '==' + this.statusValue);
  }

  toggleStatusOffline(event, status, storeId) {
    this.evof = event;
    this.storeIdValue = storeId;
    this.statusValue = status;
    console.log(this.ev, + ' == ', this.storeIdValue, '==' + this.statusValue);
  }


  public toggleStatus(event, status, storeId) {
    this.storeIdValue = storeId;
    this.statusValue = status;
    if (this.statusValue == 'ONLINE') {

      let GET_CAMPAIGN_STATUS_CHANGE = environment.APIEndpoint + "api/rpa/store/v1/status/change";
      let request = {
        storeOid: this.storeIdValue,
        status: 'OFFLINE'
      }
      this.https.postJson(GET_CAMPAIGN_STATUS_CHANGE, request).subscribe(
        (response) => {
          console.log(response);
          this.snackBar.openFromComponent(SnackBarComponent, {
            duration: 1500,
            data: {
              status: "success",
              message: "Status Change has been updated successfully"
            }
          });
          this.searchVal();
        },
        (error) => {
          console.log(error);
        }
      );
    }
    else if (this.statusValue == 'OFFLINE') {

      let GET_CAMPAIGN_STATUS_CHANGE = environment.APIEndpoint + "api/rpa/store/v1/status/change";
      let request = {
        storeOid: this.storeIdValue,
        status: 'ONLINE'
      }
      this.https.postJson(GET_CAMPAIGN_STATUS_CHANGE, request).subscribe(
        (response) => {
          console.log(response);
          this.snackBar.openFromComponent(SnackBarComponent, {
            duration: 1500,
            data: {
              status: "success",
              message: "Status Change has been updated successfully"
            }
          });
          this.searchVal();
        },
        (error) => {
          console.log(error);
        }
      );
    }
  }

  toggleStatusChange(ev, toggleVal, storeIdValue) {
    console.log(toggleVal);
    console.log(storeIdValue);
    console.log(ev);

    //   let GET_CAMPAIGN_STATUS_CHANGE = environment.APIEndpoint + "api/rpa/store/v1/status/change";
    //   let request = {
    //     storeOid: this.storeIdValue,
    //     status: this.statusValue
    //   }
    //   this.https.postJson(GET_CAMPAIGN_STATUS_CHANGE, request).subscribe(
    //     (response) => {
    //       console.log(response);
    //       this.snackBar.openFromComponent(SnackBarComponent, {
    //         duration: 1500,
    //         data: {
    //           status: "success",
    //           message: "Status Change has been updated successfully"
    //         }
    //       });
    //     },
    //     (error) => {
    //       console.log(error);
    //     }
    //   );
  }

}
