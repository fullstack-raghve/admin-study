import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatTableDataSource, MatSort } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpService } from 'src/app/services/http-service';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';

export interface UserData {
  merchantLogo: string;
  merchantCode: string;
  merchantName: string;
  createdOn: string;
  lastModifiedBy: string;
  lastModifiedOn: string;
  status: string;
}
@Component({
  selector: 'search-merchant',
  templateUrl: './search-merchant.component.html',
  styleUrls: ['./search-merchant.component.scss']
})
export class SearchMerchantComponent implements OnInit {

  public breadCrumbData: Array<Object> = [{
    title: 'Home',
    link: ''
  }, {
    title: 'Configurations',
    link: '/search-merchant'
  }
  ];

  displayedColumns: string[] = ['merchantLogo','merchantCode', 'merchantName', 'createdOn', 'lastModifiedBy', 'lastModifiedOn', 'status'];
  dataSource: MatTableDataSource<UserData>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  notification_data: UserData[] = [
    {
      merchantLogo:'/assets/images/Loginlogo.png',
      merchantCode: 'FR',
      merchantName: 'ABC',
      createdOn: '12/2/2018',
      lastModifiedBy: 'XYZ',
      lastModifiedOn: '12/2/2019',
      status: 'Online'
    },
    {
      merchantLogo:'/assets/images/Loginlogo.png',
      merchantCode: 'GM',
      merchantName: 'PQR',
      createdOn: '10/2/2018',
      lastModifiedBy: 'ABC',
      lastModifiedOn: '12/5/2020',
      status: 'Offline'
    },
  ];

  public paginationData;
  public resultsLength = 0;
  searchMerchantForm: FormGroup;
  constructor(private fb: FormBuilder,
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
    // this.getAllCountries();
    this.dataSource = new MatTableDataSource();
    this.dataSource.paginator = this.paginator;
    this.searchVal();
    this.dataSource = new MatTableDataSource<UserData>(this.notification_data);
  }
  public buildSearchForm() {
    this.searchMerchantForm = this.fb.group({
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
  // searchVal() {
  //     console.log(this.paginationData);
  //     if (this.searchCityForm.invalid == false) {
  //         let formdata = this.searchCityForm.value;
  //         let data =
  //         {
  //             "page": this.paginationData !== undefined ? this.paginationData.pageIndex : "0",
  //             "pageSize": this.paginationData !== undefined ? this.paginationData.pageSize : "10",
  //             "order": {
  //                 "column": "modifiedTime",
  //                 "dir": "desc"
  //             },
  //             "keySearch": formdata.searchVal,
  //             "fieldSearch": [
  //                 {
  //                     "fieldName": "merchant",
  //                     "fieldValue": formdata.merchant,
  //                 },
  // {
  //     "fieldName": "cityCode",
  //     "fieldValue": formdata.cityCode
  // },
  // {
  //     "fieldName": "country.oid",
  //     "fieldValue": formdata.country
  // },
  //         {
  //             "fieldName": "status",
  //             "fieldValue": formdata.status
  //         }
  //     ]
  // }
  // let SEARCH_COUNTRY = "api/rpa/master/city/v1/search"
  // this.https.postJson(environment.APIEndpoint + SEARCH_COUNTRY, data).subscribe(res => {
  //     this.dataSource = new MatTableDataSource(res["items"]);
  //     this.dataSource.sort = this.sort;
  //     this.resultsLength = res["totalCount"]

  //     if(this.paginationData !== undefined && this.paginationData.pageIndex * this.paginationData.pageSize > this.resultsLength ){
  //         this.paginationData.pageIndex = 0;
  //         this.paginator.pageIndex = 0;
  //         this.searchVal();
  //       }
  // }, err => {
  //     console.log(err)
  // })
  //     }
  // }

  searchVal() {
    const notification_data: UserData[] = [
      {
        merchantLogo:'./assets/images/dashboard_icons/dashboard.png',
        merchantCode: 'GM',
        merchantName: 'PQR',
        createdOn: '10/2/2018',
        lastModifiedBy: 'ABC',
        lastModifiedOn: '12/5/2020',
        status: 'Offline'
      },

    ]
    this.dataSource = new MatTableDataSource<UserData>(notification_data);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  // getAllCountries() {
  //     let GET_ALL_COUNTRIES = environment.APIEndpoint + "api/rpa/master/country/v1/get/countries";
  //     this.https.getJson(GET_ALL_COUNTRIES)
  //         .subscribe((response) => {
  //             console.log(response);
  //             this.countries = response;

  //         })
  // }
  public reset() {
    this.buildSearchForm();
    this.searchVal();
    this.dataSource = new MatTableDataSource<UserData>(this.notification_data);
  }
}
