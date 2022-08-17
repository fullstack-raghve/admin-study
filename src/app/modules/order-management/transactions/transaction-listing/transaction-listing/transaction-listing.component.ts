import { OnInit, ViewChild, Output, Input, Component, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder, FormGroupDirective, FormArray, NgForm } from '@angular/forms';
import { MatPaginator, MatSnackBar, MatSort, MatTableDataSource } from '@angular/material';
import { HttpService } from '../../../../../services/http-service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../../../environments/environment';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Sort } from '@angular/material/sort';
import { Router, ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { SnackBarComponent } from 'src/app/shared/components/snack-bar/snack-bar.component';
import {ViewChildren,QueryList,ElementRef} from '@angular/core';
import {MatInput} from '@angular/material/input';
import { CommonFunctions } from 'src/app/services/common-functions';

export interface TxnData {
  txnId: number;
  storeName: string;
  noOfItems: number;
  totalAmount: number;
  productName: string;
  orderType: string;
  omniChannel: string;
  txnReqDate: string;
  deliveryBoyAssigned: string;
  orderStatus: string;
}

export interface Brand {
  brandId: number;
  brandName: string;
}

export interface Store {
  storeOid: number;
  storeName: string;
}
@Component({
  selector: 'transaction-listing',
  templateUrl: './transaction-listing.component.html',
  styleUrls: ['./transaction-listing.component.scss']
})

export class TransactionListingComponent implements OnInit {
  public breadCrumbData: Array<Object> = [{
    title: 'Home',
    link: ''
  }, {
    title: 'Order Management',
    link: ''
  }
  ];

  displayedColumns: string[] = ['txnId', 'storeName', 'noOfItems', 'totalAmount', 'productName', 'orderType','omniChannel','phoneNumber', 'txnReqDate', 'deliveryBoyAssigned', 'orderStatus'];
  dataSource: MatTableDataSource<TxnData>;

  public searchTransactionsFormGroup: FormGroup;
  public paginationData;
  public resultsLength = 0;
  public noRecords: boolean = false;
  public searchPageLoader: boolean = false;
  public hideStatusDropdown: boolean = false;
  public sortColumn = "oid";
  public sortDirection = "desc";

  paginationDetail = new BehaviorSubject({
    length: 10,
    pageIndex: 0,
    pageSize: 10
  });

  status = true;
  public brandsList: any = [];
  public storesList: any = [];
  public selectedBrandOptions: any = [];
  public selectedStoreOptions: any = [];
  public brandList;
  Brands: Brand[] = [];
  brandCtrl = new FormControl();
  filteredBrands: Observable<Brand[]>;
  public storeAllList;
  Stores: Store[] = [];
  storeCtrl = new FormControl();
  filteredStores: Observable<Store[]>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  storeOid: any;
  brandId: any;
  public resetStatus: boolean = false;
  selectedValue;
  statusList = [];
  editRowId:number=-1
  @ViewChildren(MatInput,{read:ElementRef}) inputs:QueryList<ElementRef>;
  public searchData : any;

  transactionstatusList = [
    { value: 'ORDER_INITIATED', viewValue: 'ORDER INITIATED' },
    { value: 'PAYMENT_SUCCESS', viewValue: 'PAYMENT SUCCESS' },
    { value: 'PAYMENT_FAILED', viewValue: 'PAYMENT FAILED' },
    { value: 'ORDER_PLACED', viewValue: 'ORDER PLACED' },
    { value: 'ORDER_CONFIRMED', viewValue: 'ORDER CONFIRMED' },
    { value: 'ORDER_READY', viewValue: 'ORDER READY' },
    { value: 'DELIVERY_PERSON_ASSIGNED', viewValue: 'DELIVERY PERSON ASSIGNED' },
    { value: 'ORDER_PICKED', viewValue: 'ORDER PICKED' },
    { value: 'ORDER_DELIVERED', viewValue: 'ORDER DELIVERED' },
    { value: 'COMPLETED', viewValue: 'COMPLETED' },
    { value: 'VOID', viewValue: 'VOID' },
    { value: 'MANUALLY_COMPLETED', viewValue: 'MANUALLY COMPLETED' },
    { value: 'CANCELLED', viewValue: 'CANCELLED' },
    { value: 'FOOD_PREPARING', viewValue: 'FOOD_PREPARING' },
    { value: 'ORDER_NOT_DELIVERED', viewValue: 'ORDER_NOT_DELIVERED' },
];

  constructor(private fb: FormBuilder, 
    private router: Router,
    private https: HttpService,
    private http: HttpClient,
    public snackBar: MatSnackBar,
    private commonFunctions: CommonFunctions ) {
    this.dataSource = new MatTableDataSource();
  }

  ngOnInit() {
    this.getAllBrands();
    this.getAllStores();
    this.getAllBrandsA();
    this.getAllStoresA();
    this.dataSource = new MatTableDataSource();
    if(sessionStorage.getItem('allTransaction')){
      this.searchData = JSON.parse(sessionStorage.getItem('allTransaction'));
      this.commonFunctions.checkFilterContainsData(this.searchData) ?  this.openFilter(): '';
      this.brandId = this.searchData != undefined ? this.searchData.brandOid : '';
      this.storeOid = this.searchData != undefined ? this.searchData.storeOid : '';
    }
    this.buildOrderForm();
    if (sessionStorage.getItem('CheckType') == 'Order_Txns') {
      if (sessionStorage.searchValue) {
        this.searchTransactionsFormGroup.controls['searchVal'].setValue(sessionStorage.getItem('searchValue'));
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
      }
       else {
        this.searchVal();
      }
    }
     else {
      sessionStorage.clear();
      this.searchVal();
      sessionStorage.setItem('CheckType', 'Order_Txns');
    }
  }

  openFilter() {
    this.status = !this.status;
  }

  getAllBrandsA() {
    let GET_ALL_CITIES = environment.APIEndpoint + "api/rpa/master/brand/v1/get/brands";
    this.https.getJson(GET_ALL_CITIES)
      .subscribe((response) => {
        this.brandList = response;

        for (let i = 0; i <= this.brandList.length - 1; i++) {
          let objbrandkey = {
            brandId: this.brandList[i]['brandId'],
            brandName: this.brandList[i]['brandName'],
          }
          this.Brands.push(objbrandkey);
        }
        this.filteredBrands = this.brandCtrl.valueChanges
          .pipe(
            startWith(''),
            map(brand => brand ? this._filterBrands(brand) : this.Brands.slice())
          );

          for (let j = 0; j < this.brandList.length; j++) {
            if (this.brandList[j].brandId == this.brandId) {
                this.brandCtrl.setValue(this.brandList[j].brandName);
            }
          }
      },
        (error) => {
        });
  }

  private _filterBrands(value: string): Brand[] {
    const filterValue = value.toLowerCase();
    return this.Brands.filter(brand => brand.brandName.toLowerCase().indexOf(filterValue) === 0);
  }

  getAllStoresA() {
    let data = {
      "page": "0",
      "pageSize": "10000",
      "order": {
        "column": "oid",
        "dir": "asc"
      },
      "keySearch": "",
      "fieldSearch": [
        {
          "fieldName": "status",
          "fieldValue": ""
        },
      ]
    }
    this.https.postJson(environment.APIEndpoint + 'api/rpa/store/v2/getAll', data).subscribe(response => {
      this.storeAllList = response["items"];

      for (let i = 0; i <= this.storeAllList.length - 1; i++) {
        let objbrandkey = {
          storeOid: this.storeAllList[i]['storeOid'],
          storeName: this.storeAllList[i]['storeName'],
        }
        this.Stores.push(objbrandkey);
      }
      this.filteredStores = this.storeCtrl.valueChanges
        .pipe(
          startWith(''),
          map(store => store ? this._filterStores(store) : this.Stores.slice())
        );

        for (let j = 0; j < this.storeAllList.length; j++) {
          if (this.storeAllList[j].storeOid == this.storeOid) {
              this.storeCtrl.setValue(this.storeAllList[j].storeName);
          }
        }
    },
      (error) => {
      });
  }

  private _filterStores(value: string): Store[] {
    const filterValue = value.toLowerCase();
    return this.Stores.filter(store => store.storeName.toLowerCase().indexOf(filterValue) === 0);
  }

  getAllBrand(brandId) {
    this.brandId = brandId;
  }

  getAllStore(storeOid) {
    this.storeOid = storeOid;
  }

  getUpdate(event) {
    sessionStorage.setItem('paginationData', JSON.stringify(event));
    this.paginationDetail.next(event);
    this.paginationData = event;
    this.searchVal();
  }

  resetForm() {
    this.searchData = undefined;
    this.buildOrderForm();
    this.brandCtrl.reset('');
    this.brandId = '';
    this.Brands = [];
    this.brandId = '';
    this.storeCtrl.reset('');
    this.storeOid = '';
    this.Stores = [];
    this.getAllBrandsA();
    this.getAllStoresA();
    this.paginationData = {
      pageIndex: 0,
      pageSize: 10,
      length: this.resultsLength,
      previousPageIndex: 0
    };
    this.getUpdate(this.paginationData);
    this.paginator.pageIndex = this.paginationData.pageIndex;
  }

  edit(row){
    this.editRowId=row;
    this.hideStatusDropdown = false;
  }

    getOrderStatusList(txnId,orderStatus) {
      this.hideStatusDropdown = false;
      let GET_LIST = environment.APIEndpoint + "api/rpa/order/v1/getOrderStatusList";
      let request = {
        "txnOid": txnId,
        "orderStatus": orderStatus
      }
      this.https.postJson(GET_LIST, request)
          .subscribe((response) => {
              this.statusList = response;
          }
              , err => {
              });
  }

  public changeStatus(txnId){
    this.hideStatusDropdown = false;
    let req = {
      "txnOid": txnId,
      "orderStatus": this.selectedValue
    }
    let url = environment.APIEndpoint + "api/rpa/order/v1/updateStatus"
      let userData = JSON.parse(localStorage.getItem("userpermissions"));
      let httpOptions = new HttpHeaders({
          'Authorization': userData.token_type +" "+ userData.access_token,
          'Content-Type': 'application/json',
          'Accept-Language': 'en'
      }); 
      this.http.post(url,req, { headers: httpOptions }).subscribe(res => {
        this.snackBar.openFromComponent(SnackBarComponent, {
          duration: 1500,
          data: {
            status: "success",
            message: "Status updated successfully"
          }
        });
        this.searchVal();
        this.hideStatusDropdown = true;
      }, err => {
        if (err.error.errorType == 'VALIDATION') {
          this.snackBar.openFromComponent(SnackBarComponent, {
            duration: 1500,
            data: {
              status: "failure",
              message: err.error.errorDetails[0].description
            }
          });
        } 
        else {
          this.snackBar.openFromComponent(SnackBarComponent, {
            duration: 1500,
            data: {
              status: "failure",
              message: "Your request cannot be saved at this time. Please try again later"
            }
          });
        }
      });
  }  

  searchKey() {
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
    let formdata = this.searchTransactionsFormGroup.value;
    sessionStorage.setItem('searchValue', formdata.searchVal);
    this.searchPageLoader = true;
    let scheduled = '';
    if (formdata.isScheduled != '') {
      scheduled = formdata.isScheduled == true ? '1' : '0';
    }
    if (!this.searchTransactionsFormGroup.invalid) {
      let data = {
        "page": this.paginationData !== undefined ? this.paginationData.pageIndex : '0',
        "pageSize": this.paginationData !== undefined ? this.paginationData.pageSize : '10',
        "order": {
          "column": this.sortColumn,
          "dir": this.sortDirection
        },
        "keySearch": sessionStorage.getItem('searchValue'),
        "fieldSearch": [
          {
            "fieldName": "oid",
            "fieldValue": formdata.txnId
          },
          {
            "fieldName": "brandOid",
            "fieldValue": null != this.brandId ? this.brandId : ''
          },
          {
            "fieldName": "storeOid",
            "fieldValue": null != this.storeOid ? this.storeOid : ''
          },
          {
            "fieldName": "phoneNumber",
            "fieldValue": formdata.phoneNumber
          },
          {
            "fieldName": "txnStatus",
            "fieldValue": null != formdata.status ? formdata.status : ''
          },
          { 
            "fieldName": "omniChannel", 
            "fieldValue": formdata.omniChannel 
            },
          {
            "fieldName": "deliveryType",
            "fieldValue": formdata.orderType
          },
          {
            "fieldName": "txnDay",
            "fieldValue": formdata.orderDay
          },
          {
            "fieldName": "isIsScheduled",
            "fieldValue": scheduled
          },
          {
            "fieldName": "fromDate",
            "fieldValue": formdata.startDate != '' ? moment(formdata.startDate).format('YYYY-MM-DD') : ''
          },
          {
            "fieldName": "toDate",
            "fieldValue": formdata.endDate != '' ? moment(formdata.endDate).format('YYYY-MM-DD') : ''
          },
          {
            "fieldName": "isdeliveryPersionAssigned",
            "fieldValue": formdata.deliveryBoyAssigned
          }
        ]
      }
    
      this.setSearchData();
      this.https.postJson(environment.APIEndpoint + 'api/rpa/order/v1/search', data).subscribe(res => {
        this.searchPageLoader = false;

        this.resultsLength = res["totalCount"];
        if (this.resultsLength == 0) {
          this.noRecords = true;
        } else {
          this.noRecords = false;
        }
        this.dataSource = new MatTableDataSource(res["items"]);
        console.log(this.dataSource);
        this.dataSource.sort = this.sort;
      }, err => {
        this.searchPageLoader = false;
      });
    }
  }

  buildOrderForm() {
    let data = this.searchData; 
    this.searchTransactionsFormGroup = this.fb.group({
      txnId: [data != undefined ? data.oid : ''],
      isScheduled: [data != undefined ? data.isIsScheduled : ''],
      orderDay: [data != undefined ? data.txnDay : ''],
      phoneNumber: [data != undefined ? data.phoneNumber : '', Validators.compose([Validators.minLength(8), Validators.pattern("^[0-9]*")])],
      orderType: [data != undefined ? data.deliveryType : ''],
      omniChannel: [data != undefined ? data.omniChannel : ''],
      startDate: [data != undefined ? data.fromDate : ''],
      endDate: [data != undefined ? data.toDate : ''],
      status: [data != undefined ? data.txnStatus : ''],
      searchVal: [data != undefined ? data.searchValue : ''],
      deliveryBoyAssigned: [data != undefined ? data.deliveryBoyAssigned : ''],
    });
  }

  sortData(sort: Sort) {
    if (!sort.active || sort.direction === '') {
      this.sortColumn = "oid";
      this.sortDirection = "desc";
    } else {
      this.sortColumn = sort.active;
      this.sortDirection = sort.direction;
    }
    this.searchVal();
  }
 
  getAllBrands() {
    const GET_ALL_BRANDS = environment.APIEndpoint + 'api/rpa/master/brand/v1/get/brands';
    this.https.getJson(GET_ALL_BRANDS).subscribe((brands) => {
      brands.forEach(res => {
        this.brandsList.push({
          'brandOid': res.brandOid,
          'brandName': res.brandName,
          'value': res.brandOid,
        });
      });
      var uniqueArray = this.removeDuplicatesJSON(this.brandsList, 'brandOid');
      this.brandsList = uniqueArray;
    }, (error) => {
    });
  }

  getAllStores() {
    let data = {
      "page": "0",
      "pageSize": "10000",
      "order": {
        "column": "oid",
        "dir": "asc"
      },
      "keySearch": "",
      "fieldSearch": [
        {
          "fieldName": "status",
          "fieldValue": ""
        },
      ]
    }
      const GET_ALL_STORES = environment.APIEndpoint + 'api/rpa/store/v2/getAll';
      this.https.postJson(GET_ALL_STORES, data).subscribe((stores) => {
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
      });
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

  viewTxnDetails(ID,memId) {
    localStorage.setItem('TxnOid', ID);
    localStorage.setItem('memberID', memId);
    this.router.navigate(['/view-transaction']);
  }

  public setSearchData(){
    let formdata = this.searchTransactionsFormGroup.value;
    let selectedData = {
      oid : formdata.txnId == null ? '' : formdata.txnId,
      brandOid : null != this.brandId ? this.brandId : '',
      storeOid: null != this.storeOid ? this.storeOid : '',
      phoneNumber: formdata.phoneNumber,
      txnStatus: null != formdata.status ? formdata.status : '',
      omniChannel: formdata.omniChannel,
      deliveryType: formdata.orderType,
      txnDay: formdata.orderDay,
      isIsScheduled: formdata.isScheduled,
      fromDate: formdata.startDate,
      toDate: formdata.endDate,
      searchValue: formdata.searchVal,
      deliveryBoyAssigned: formdata.deliveryBoyAssigned
    }
    sessionStorage.setItem('allTransaction', JSON.stringify(selectedData));
  }
}