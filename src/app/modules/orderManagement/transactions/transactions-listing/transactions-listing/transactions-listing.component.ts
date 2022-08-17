import { OnInit, ViewChild, Output, Input, Component, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder, FormGroupDirective, FormArray, NgForm } from '@angular/forms';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { HttpService } from '../../../../../services/http-service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../../../environments/environment';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Sort } from '@angular/material/sort';
import { Router, ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { SelectAutocompleteComponent } from 'mat-select-autocomplete';
import { CommonFunctions } from 'src/app/services/common-functions';
export interface TxnData {
  txnId: number;
  storeName: string;
  noOfItems: number;
  totalAmount: number;
  productName: string;
  orderType: string;
  txnTime: string;
  orderStatus: string;
}

@Component({
  selector: 'transactions-listing',
  templateUrl: './transactions-listing.component.html',
  styleUrls: ['./transactions-listing.component.scss']
})
export class TransactionsListingComponent implements OnInit {
  public breadCrumbData: Array<Object> = [{
    title: 'Home',link: ''}, 
    {title: 'Order Management',link: ''}
  ];

  displayedColumns: string[] = ['txnId', 'storeName', 'noOfItems', 'totalAmount', 'productName', 'orderType', 'txnTime','customerPhNo', 'orderStatus'];
  dataSource: MatTableDataSource<TxnData>;

  public searchTransactionFormGroup: FormGroup;
  public paginationData;
  public resultsLength = 0;
  public noRecords: boolean = false;
  public searchPageLoader: boolean = false;
  public sortColumn = "modifiedTime";
  public sortDirection = "desc";
  public searchData : any;

  paginationDetail = new BehaviorSubject({
    length: 10,
    pageIndex: 0,
    pageSize: 10
  });

  status = true;
  public brandsList: any = [];
  public storesList: any = [];

  @ViewChild(MatPaginator) paginator: MatPaginator; 
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('storeInput') storeInput: SelectAutocompleteComponent;
  @ViewChild('brandInput') brandInput: SelectAutocompleteComponent;


  constructor(private fb: FormBuilder, private router: Router,
    private https: HttpService,private commonFunctions: CommonFunctions) {
    this.dataSource = new MatTableDataSource();
  }
  ngOnInit() {
    this.paginationData = {
      pageIndex: 0,
      pageSize: 10,
      length: this.resultsLength,
      previousPageIndex: 0
    };
    this.getAllBrands();
  
    this.dataSource = new MatTableDataSource();
    if(sessionStorage.getItem('appTransactions')){
      this.searchData = JSON.parse(sessionStorage.getItem('appTransactions'));
      this.commonFunctions.checkFilterContainsData(this.searchData) ?  this.openFilter(): '';
    }
    this.buildStoreForm();

    if (sessionStorage.getItem('CheckType') == 'Order_Txns') {
      if (sessionStorage.searchValue) {
        this.searchTransactionFormGroup.controls['searchVal'].setValue(sessionStorage.getItem('searchValue'));
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
      sessionStorage.setItem('CheckType', 'Order_Txns');
    }
  }
  openFilter() {
    this.status = !this.status;
  }

  getUpdate(event) {
    sessionStorage.setItem('paginationData', JSON.stringify(event));
    this.paginationDetail.next(event);
    this.paginationData = event;
    this.searchVal();
  }

  resetForm() {
    this.storesList= [];
    this.searchData= undefined;
    this.buildStoreForm();

    this.getUpdate(this.paginationData);
    this.paginator.pageIndex = this.paginationData.pageIndex;
  }
  searchKey() {
    this.getUpdate(this.paginationData);
    this.paginator.pageIndex = this.paginationData.pageIndex;
  }
  searchVal() {
    let formdata = this.searchTransactionFormGroup.value;
    sessionStorage.setItem('searchValue', formdata.searchVal);
    if (!this.searchTransactionFormGroup.invalid) {
      this.searchPageLoader = true;
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
            "fieldName": "storeOid",
            "fieldValue": formdata.storeId.toString()
          },
          {
            "fieldName": "brandOid",
            "fieldValue": formdata.brandId.toString()
          },
          {
            "fieldName": "deliveryType",
            "fieldValue": formdata.orderType
          },
          {
            "fieldName": "startDate",
            "fieldValue": formdata.startDate != '' ? moment(formdata.startDate).format('YYYY-MM-DD') + ' ' + '00:00:00' : ''
          },
          {
            "fieldName": "endDate",
            "fieldValue": formdata.endDate != '' ? moment(formdata.endDate).format('YYYY-MM-DD') + ' ' + '23:59:59' : ''
          },
          {
            "fieldName": "orderStatus",
            "fieldValue": formdata.orderStatus
          },
          {
            "fieldName": "refundStatus",
            "fieldValue": formdata.refundStatus
          },
          {
            "fieldName":"phoneNumber",
            "fieldValue" : formdata.phoneNumber
          }
        ]
      }
      this.setSearchData();
      this.https.postJson(environment.APIEndpoint + 'api/rpa/order/v2/completedOrder/search', data).subscribe(res => {
        this.searchPageLoader = false;

        this.resultsLength = res["totalCount"];
        if (this.resultsLength == 0) {
          this.noRecords = true;
        } else {
          this.noRecords = false;
        }
        this.dataSource = new MatTableDataSource(res["items"]);
        this.dataSource.sort = this.sort;
      }, err => {
        console.log(err);
        this.searchPageLoader = false;
      })
    }
  }

  buildStoreForm() {
    let data = this.searchData;
    if(data != undefined)
      if(data.storeOid.length != 0 && data.storeOid != '')
        this.getAllStores(data.brandOid);
    this.searchTransactionFormGroup = this.fb.group({
      brandId: [data != undefined ? data.brandOid : ''],
      storeId: [data != undefined ? data.storeOid : ''],
      orderType: [data != undefined ? data.deliveryType : ''],
      orderStatus: [data != undefined ? data.orderStatus : ''],
      refundStatus: [data != undefined ? data.refundStatus : ''],
      startDate: [data != undefined ? data.startDate : ''],
      endDate: [data != undefined ? data.endDate : ''],
      searchVal: [data != undefined ? data.searchVal : ''],
      phoneNumber:[data != undefined ? data.phoneNumber : '']
    });
  }

  sortData(sort: Sort) {
    if (!sort.active || sort.direction === '') {
      this.sortColumn = "modifiedTime";
      this.sortDirection = "desc";
    } else {
      this.sortColumn = sort.active;
      this.sortDirection = sort.direction;
    }
    this.searchVal();
  }

  getAllBrands() {
    const GET_ALL_BRANDS = environment.APIEndpoint + 'api/rpa/order/v1/brandListing';
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
      console.log(error);
    })
  }

  getAllStores(brandIds) {
    if (brandIds != '' && brandIds != undefined) {
      const GET_ALL_STORES = environment.APIEndpoint + 'api/rpa/order/v1/storeListing';
      let request = {
        "brandId": brandIds.toString()
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
  viewTxnDetails(ID) {
    localStorage.setItem('viewOrderId', ID);
    this.router.navigate(['/view-transaction-details']);
  }
  updateValidation(value){
    if(value != ''){
      this.searchTransactionFormGroup.get('orderStatus').setValidators([Validators.required]);
      this.searchTransactionFormGroup.get('orderStatus').updateValueAndValidity();
    }
  }

  public setSearchData(){
    let formdata = this.searchTransactionFormGroup.value;
    let selectedData = {
      storeOid: formdata.storeId,
      brandOid: formdata.brandId,
      deliveryType: formdata.orderType,
      startDate: formdata.startDate,
      endDate: formdata.endDate,
      orderStatus: formdata.orderStatus,
      refundStatus: formdata.refundStatus,
      phoneNumber: formdata.phoneNumber,
      searchVal: formdata.searchVal
    }
    sessionStorage.setItem('appTransactions', JSON.stringify(selectedData))
  }
}