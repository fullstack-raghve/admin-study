import { OnInit, ViewChild, Output, Input, Component, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder, FormGroupDirective, FormArray, NgForm } from '@angular/forms';
import { MatPaginator, MatSort, MatTableDataSource, MatDialogConfig, MatDialog} from '@angular/material';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HttpService } from 'src/app/services/http-service';
import { environment } from 'src/environments/environment';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Sort } from '@angular/material/sort';
import { Router, ActivatedRoute } from '@angular/router';
import { SelectAutocompleteComponent } from 'mat-select-autocomplete';
import { ErrorMessagesDialogComponent } from 'src/app/shared/components/orderManagement/error-messages-dialog/error-messages-dialog.component';
import { CommonFunctions } from 'src/app/services/common-functions';
export interface TxnData {
  orderId: number;
  storeName: string;
  noOfItems: number;
  totalAmount: number;
  scheduledTime:string;
  productName: string;
  orderType: string;
  txnReqDate: string;
  orderStatus: string;

}

@Component({
  selector: 'scheduled-orders-listing',
  templateUrl: './scheduled-orders-listing.component.html',
  styleUrls: ['./scheduled-orders-listing.component.scss']
})
export class ScheduledOrdersListingComponent implements OnInit {
  public breadCrumbData: Array<Object> = [{
    title: 'Home',link: ''}, 
    {title: 'Order Management',link: ''}
  ];

  displayedColumns: string[] = ['txnId', 'storeName', 'noOfItems', 'totalAmount', 'scheduledTime', 'productName', 'orderType', 'txnReqDate', 'orderStatus'];
  dataSource: MatTableDataSource<TxnData>;

  public searchScheduledOrdersFormGroup: FormGroup;
  public paginationData;
  public resultsLength = 0;
  public noRecords: boolean = false;
  public searchPageLoader: boolean = false;
  public sortColumn = "modifiedTime";
  public sortDirection = "desc";
  status = true;
  public brandsList: any = [];
  public storesList: any = [];
  public searchData : any;

  paginationDetail = new BehaviorSubject({
    length: 10,
    pageIndex: 0,
    pageSize: 10
  });

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('storeInput') storeInput: SelectAutocompleteComponent;
  @ViewChild('brandInput') brandInput: SelectAutocompleteComponent;

  constructor(private fb: FormBuilder, private router: Router, public dialog: MatDialog,
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

    if(sessionStorage.getItem('scheduledOrder')){
      this.searchData = JSON.parse(sessionStorage.getItem('scheduledOrder'));
      this.commonFunctions.checkFilterContainsData(this.searchData) ?  this.openFilter(): '';
    }
    this.buildStoreForm();

    if (sessionStorage.getItem('CheckType') == 'Order_Txns') {
      if (sessionStorage.searchValue) {
        this.searchScheduledOrdersFormGroup.controls['searchVal'].setValue(sessionStorage.getItem('searchValue'));
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
    this.searchData = undefined;
    this.storesList= [];
    this.buildStoreForm();
    this.getUpdate(this.paginationData);
    this.paginator.pageIndex = this.paginationData.pageIndex;
  }
  searchKey() {
    this.getUpdate(this.paginationData);
    this.paginator.pageIndex = this.paginationData.pageIndex;
  }
  searchVal() {
    let formdata = this.searchScheduledOrdersFormGroup.value;
    sessionStorage.setItem('searchValue', formdata.searchVal);
    this.searchPageLoader = true;
    if (!this.searchScheduledOrdersFormGroup.invalid) {
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
            "fieldName": "skuCode",
            "fieldValue": formdata.skuCode
          },
          {
            "fieldName": "deliveryType",
            "fieldValue": formdata.orderType
          }
        ]
      }
      this.setSearchData();
      this.https.postJson(environment.APIEndpoint + 'api/rpa/order/v2/scheduledOrder/search', data).subscribe(res => {
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
    this.searchScheduledOrdersFormGroup = this.fb.group({
      brandId: [data != undefined ? data.brandOid : ''],
      storeId: [data != undefined ? data.storeOid : ''],
      orderType: [data != undefined ? data.deliveryType : ''],
      skuCode:[data != undefined ? data.skuCode : ''],
      searchVal: [data != undefined ? data.searchVal : '']
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
    },(error)=>{
      console.log(error);
    })
  }

  getAllStores(brandIds) {
    if(brandIds != '' && brandIds != undefined){
      const GET_ALL_STORES = environment.APIEndpoint + 'api/rpa/order/v1/storeListing';
      let request ={
        "brandId": brandIds.toString()
      }
      this.https.postJson(GET_ALL_STORES,request).subscribe((stores) => {
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
      },(error)=>{
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
  viewScheduledOrder(ID) {
    localStorage.setItem('viewScheduleId', ID);
    this.router.navigate(['/view-scheduled-order-details']);
  }
  openErrorMessageDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = "350px";
    dialogConfig.height = 'auto';
    dialogConfig.autoFocus = false;
    dialogConfig.panelClass = 'error-messages-dialogue';
    const dialogRef = this.dialog.open(ErrorMessagesDialogComponent, dialogConfig);
  }

  public setSearchData(){
    let formdata = this.searchScheduledOrdersFormGroup.value;
    let selectedData = {
      storeOid: formdata.storeId,
      brandOid: formdata.brandId,
      skuCode: formdata.skuCode,
      deliveryType: formdata.orderType,
      searchVal: formdata.searchVal
    }
    sessionStorage.setItem('scheduledOrder', JSON.stringify(selectedData))
  }
}