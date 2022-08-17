import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { HttpService } from 'src/app/services/http-service';
import { environment } from 'src/environments/environment';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Router } from '@angular/router';
import { Common } from 'src/app/services/common';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Subscription, timer } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { SelectAutocompleteComponent } from 'mat-select-autocomplete';


export interface LiveOrdersData {
  orderId: string,
  storeName: string,
  noOfItems: number,
  totalAmount: number,
  timeElapsed: string,
  orderType: string,
  assignedTo: string,
  dateTime: string,
  txnReqDate: string,
  status: string
}

@Component({
  selector: 'live-orders-global-search',
  templateUrl: './live-orders-global-search.component.html',
  styleUrls: ['./live-orders-global-search.component.scss']
})
export class LiveOrdersGlobalSearchComponent implements OnInit {
  public breadCrumbData: Array<Object> = [
    { title: 'Home', link: '' },
    { title: 'Order Management', link: '' }];

  public seearchLiveOrderFormGroup: FormGroup;

  @ViewChild(MatSort) sort: MatSort;
  
  @ViewChild(MatPaginator) globalSearchPaginator: MatPaginator;

  @ViewChild('storeInput') storeInput: SelectAutocompleteComponent;
  // @ViewChild('brandInput') brandInput: SelectAutocompleteComponent;

  //Global search Data
  displayedGlobalSearchColumns: string[] = ['txnId', 'storeName', 'noOfItems', 'totalAmount', 'timeElapsed', 'orderType', 'userFullName', 'txnReqDate','customerPhNo', 'status'];
  globalSearchDataSource: MatTableDataSource<LiveOrdersData>;

  public searchGlobalLoader: boolean = false;
  public storesList: any = [];
  // public selectedBrandOptions: any = [];
  public selectedStoreOptions: any = [];

  public showGlobalSearchSection: boolean = false;
  public globalSearchRecords: boolean = false;
  public globalSearchLength: number;
  public fieldSerachFilter: boolean = true;
  public brandList: any = [];
  public searchBrandId = '';
  public paginationData;

  paginationDetail = new BehaviorSubject(
    {
      length: 10,
      pageIndex: 0,
      pageSize: 10
    }); 
    
  constructor(private https: HttpService, private router: Router, private fb: FormBuilder, private commonService: Common) {
    this.globalSearchDataSource = new MatTableDataSource();
  }

  ngOnInit() {
    this.paginationData = {
      pageIndex: 0,
      pageSize: 10,
      length: 10,
      previousPageIndex: 0
    };
  
    this.buidFilterhLiveOrderForm();
    this.getGloablSearchResults();
    this.getAllBrands();
    // this.globalSearchDataSource.sort = this.sort;
  }


  buidFilterhLiveOrderForm() {
    this.seearchLiveOrderFormGroup = this.fb.group({
      // brandId: [''],
      storeId: [''],
      orderStatus: [''],
      delivery_type: [''],
      searchVal: [''],
      phoneNumber:['']
    });
  }

  getAllBrands() {
    let GET_ALL_ONLINE_BRANDS = environment.APIEndpoint + "api/rpa/master/brand/v1/get/brands";
    this.https.getJson(GET_ALL_ONLINE_BRANDS)
        .subscribe((response) => {
            this.brandList = response;
            // this.searchBrandId = this.brandList[0].brandId;
            this.getAllStores();
        }) 
}

  getAllStores() {
    this.selectedStoreOptions = [];
    if(this.storeInput != undefined)
      this.storeInput.selectAllChecked = false;
    if (this.searchBrandId != '' && this.searchBrandId != undefined) {
      const GET_ALL_STORES = environment.APIEndpoint + 'api/rpa/order/v1/storeListing';
      let request = {
        "brandId":this.searchBrandId
      }
      this.https.postJson(GET_ALL_STORES, request).subscribe((stores) => {
        this.storesList = [];
        stores.forEach(res => {
          this.storesList.push({
            'storeId': res.storeId,
            'storeName': res.storeName,
            'value': res.storeId,
          });
        });
        var uniqueArray = this.removeDuplicatesJSON(this.storesList, 'storeId');
        this.storesList = uniqueArray;
      }, (error) => {
        console.log(error);
      })
    }
  }

  removeDuplicatesJSON(originalArray, prop) {
    var newArray = [];
    var lookupObject = {};
    for (var i in originalArray) {
      lookupObject[originalArray[i][prop]] = originalArray[i];
    }
    for (i in lookupObject) {
      newArray.push(lookupObject[i]);
    }
    return newArray;
  }

  viewLiveOrder(ID) {
    // localStorage.setItem('currentTabIndex');
    localStorage.setItem('viewLiveOrderId', ID);
    this.router.navigate(['/view-order-details']);
  }

  closeGlobalSearch() {
    this.router.navigate(['live-orders-listing']);
  }

  openFilter() {
    this.fieldSerachFilter = !this.fieldSerachFilter;
  }

  resetForm() {
    // this.brandInput.selectAllChecked = false;
    this.storeInput.selectAllChecked = false;
    this.selectedStoreOptions = [];
    // this.selectedBrandOptions = [];
    this.storesList = [];
    this.buidFilterhLiveOrderForm();
    this.globalSearchDataSource = new MatTableDataSource([]);
    this.getGloablSearchResults();
  }

  getGloablSearchResults() {
    const formdata = this.seearchLiveOrderFormGroup.value;
    this.searchGlobalLoader = true;
    // let selectedBrands = this.seearchLiveOrderFormGroup.controls['brandId'].value;
    let selectedStores = this.seearchLiveOrderFormGroup.controls['storeId'].value;
    let request = {
      "page": this.paginationData !== undefined ? this.paginationData.pageIndex : "0",
      "pageSize": this.paginationData !== undefined ? this.paginationData.pageSize : "10",
      "order": {
        "column": "",
        "dir": "desc"
      },
      "keySearch": formdata.searchVal,
      "fieldSearch": [
        {
          "fieldName": "storeOid",
          "fieldValue": selectedStores.toString() != "" ? selectedStores.toString() : ""
        },
        {
          "fieldName": "brandOid",
          "fieldValue": this.searchBrandId
        },
        {
          "fieldName": "orderStatus",
          "fieldValue": formdata.orderStatus
        },
        {
          "fieldName": "deliveryType",
          "fieldValue": formdata.delivery_type
        },
        {
          "fieldName":"phoneNumber",
          "fieldValue" : formdata.phoneNumber
        }
      ]
    }
    const GET_GLOBAL_SEARCH_RESULT = environment.APIEndpoint + 'api/rpa/order/v1/liveOrderGlobal/search';
    this.https.postJson(GET_GLOBAL_SEARCH_RESULT, request).subscribe((response) => {
      this.searchGlobalLoader = false;
      
      this.globalSearchLength = response['totalCount'];
      if (this.globalSearchLength == 0 || this.globalSearchLength == undefined) {
        this.globalSearchRecords = true;
      }
      else {
        this.globalSearchRecords = false;
      }
      if (response['items'] != null && response['items'] != []) {
        this.globalSearchDataSource = new MatTableDataSource(response['items']);
        this.globalSearchDataSource.sort = this.sort;
      }
    }, err => {
      this.searchGlobalLoader = false;
      console.log(err);
    });
  }


  getUpdate(event) {
    this.paginationDetail.next(event);
    this.paginationData = event;
    this.getGloablSearchResults();
  }

}
