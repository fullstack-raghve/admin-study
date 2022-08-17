import { OnInit, ViewChild, Input, Component, ViewEncapsulation, Inject } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { HttpService } from '../../../services/http-service'
import { environment } from '../../../../environments/environment'
import { MatPaginator, MatSnackBar, MatSort, MatTableDataSource, MAT_DIALOG_DATA } from '@angular/material';
import { MatDialog, MatDialogRef } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { SelectAutocompleteComponent } from 'mat-select-autocomplete';
import { CommonFunctions } from 'src/app/services/common-functions';

export class Color {

  $primary = '#2ebce6';
  $secondary = '#e53935';
  $normal = '#757575';
}



@Component({
  selector: 'app-select-coupon-dialoge',
  templateUrl: './select-coupon-dialoge.component.html',
  styleUrls: ['./select-coupon-dialoge.component.scss']
})
export class SelectCouponDialogeComponent implements OnInit {

  //displayedColumns = ['select','locationName', 'countryName', 'cityName'];

  displayedColumns: string[] = ['select', 'couponId', 'couponName', 'discountType', 'value'];


  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
 selection = new SelectionModel<any>(true, []);
//@ViewChild(getCoupons)
@Input('getCoupons') getCoupons = [];
color = new Color();

 dataSource: MatTableDataSource<object>;
 public searchStoreForm: FormGroup;
  public paginationData;
  //public resultsLength = 0;
  public noRecords: boolean = false;
  public arrlength = [10, 20, 50, 100];
  public total: number;
  public updatedTotal;
  //dataSource : MatTableDataSource<object>;
  status = true;

  public selectedOptions;

  public storeOidValue;
  public selectedmallIdValue;
  selectedBrandIdValue: any;
  mallList: any = [];
  public searchCouponForm: FormGroup;


  

  paginationDetail = new BehaviorSubject({
    length: 10,
    pageIndex: 0,
    pageSize: 10
  });

  originalSelection;
  stores = [];
  allBrands = [];
  isFilterOn = false;
  dataInView = [];
  checkboxClicked = false;
  public programType;
  public Disable:boolean=true;
  searchLocationForm:FormGroup;

  eventData: any[];


  public couponId: number;
  public resultsLength = 0;
  public selectAll: boolean = false;
  @Input('addnotificationCoupon') addnotificationCoupon;
  @Input('couponList') couponList = [];
  selectedCouponMultiple: boolean = false;
  public selectedArray;
  public tableDataLoader: boolean = false;
  @Input('popupSource') popupSource;
  public discountTypes = [
    {
      viewValue: 'Transaction Discount Amount',
      value: 'TRANSACTION_DISCOUNT_AMOUNT'
    },
    {
      viewValue: 'Item Discount Amount',
      value: 'ITEM_DISCOUNT_AMOUNT'
    },
    {
      viewValue: 'Item Discount %',
      value: 'ITEM_DISCOUNT'
    },
    {
      viewValue: 'Transaction Discount %',
      value: 'TRANSACTION_DISCOUNT'
    },
    {
      viewValue: 'Deal Type',
      value: 'DEAL_TYPE'
    },
    {
      viewValue: 'BUY_X_GET_Y_FREE',
      value: 'BUY_X_GET_Y'
    },
    {
      viewValue: 'BUY_X_GET_Y_PERCENTAGE',
      value: 'BUY_X_GET_Z_DISCOUNT_ON_Y_PRODUCT'
    },
    {
      viewValue: 'BUY_X_GET_Y_AMOUNT',
      value: 'BUY_X_GET_Z_DISCOUNT_AMOUNT_ON_Y_PRODUCT'
    },
    //new
   
    {
      viewValue: 'Percentage',
      value: 'PERCENTAGE'
    },
    {
      viewValue: 'Amount',
      value: 'AMOUNT'
    },
    {
      viewValue: 'Item Percentage',
      value: 'ITEMPERCENTAGE'
    },
    {
      viewValue: 'Item Amount',
      value: 'ITEMAMOUNT'
    },
    {
      viewValue: 'Product Discount',
      value: 'PRODUCT_DISCOUNT'
    },
    {
      viewValue: 'Product Discount Amount',
      value: 'PRODUCT_DISCOUNT_AMOUNT'
    },
    {
      viewValue: 'Free Delivery',
      value: 'FREE_DELIVERY'
    }
 
    
  ];




  constructor(private fb: FormBuilder,
    private commonFunctions: CommonFunctions,
    private https: HttpService,
    public dialog: MatDialog,
    private dialogRef: MatDialogRef<MatDialog>,
    public snackBar: MatSnackBar, @Inject(MAT_DIALOG_DATA) data
    )
     {
     dialogRef.disableClose = true;
    this.dataSource = new MatTableDataSource();
    if (data != null) {
      this.couponId = data.couponId
    }

    console.log('data cpn>>>',data)
    //  this.dataSource = new MatTableDataSource();
  }



  ngOnInit() {
    this.buidsearchLocationForm();
   // this.getJsonTable();
  //this.getallcouponss();
  //  this.dataSource = this.eventData;
    this.dataSource.paginator = this.paginator;

   // this.dataSource.forEach((row, i) => row.selectable = i === i);
  // this.makeSelected();


  console.log(this.popupSource);
    
  this.buildForm();
 // this.getMultipleCouponData();
 this.makeSelected();

  }



  // getMultipleCouponData() {
  //   if (this.addnotificationCoupon == 'Registration' || this.addnotificationCoupon == 'XX No of Transactions' || this.addnotificationCoupon == 'XX No of Plays') {
  //     this.selectedCouponMultiple = true;
  //   } else {
  //     this.selectedCouponMultiple = false;
  //   }
  // }

  buildForm() {
    this.searchCouponForm = this.fb.group({
      searchtxt: [""],
      discountType: [""]
    });

    this.getCouponList(this.searchCouponForm.value);
   /// this.getallcouponss();
  }

  resetForm() {
    this.buildForm()
    this.getCouponList(this.searchCouponForm.value);
   // this.getallcouponss();
  }


  getUpdate(event) {
    this.paginationDetail.next(event);
    this.paginationData = event;
    this.getCouponList(this.searchCouponForm.value);
   /// this.getallcouponss();

  }

  //status = true;
  openFilter() {
    this.status = !this.status;
  }
  makeSelected(){
    if (this.getCoupons.length > 0) {
      for (let i of this.eventData) {
        if (this.getCoupons.indexOf(i["couponId"]) > -1) {
          this.selection.select(i);
        }
      }
      this.originalSelection = this.selection.selected;
    }
  }


  getCouponList(formData) {
    let data = {
      "page": this.paginationData !== undefined ? this.paginationData.pageIndex : "0",
      "pageSize": this.paginationData !== undefined ? this.paginationData.pageSize : "10",
      "order": {
        "column": "oid",
        "dir": "desc"
      },
      "keySearch": formData ? formData.searchtxt : "",
      "couponType": this.popupSource === 'PRODUCT_RESEARCH' ? "('UNIQUE','MANUAL')" : "",
      "fieldSearch": [
        {
          "fieldName": "discountType",
          "fieldValue": formData ? formData.discountType : "",
        },
        {
          "fieldName": "status",
          "fieldValue": 'ONLINE',
        }
      ]
    }
    let data2 = {
      "page": this.paginationData !== undefined ? this.paginationData.pageIndex : "0",
      "pageSize": this.paginationData !== undefined ? this.paginationData.pageSize : "10",
      "order": {
        "column": "",
        "dir": ""
      },
      "keySearch": formData ? formData.searchtxt : "",
      "fieldSearch": [
        {
          "fieldName": "discountType",
          "fieldValue": formData ? formData.discountType : "",
        },
        {
          "fieldName": "status",
          "fieldValue": 'ONLINE',
        }
      ]
    }

let data3 = {
  
  "page": this.paginationData !== undefined ? this.paginationData.pageIndex : "0",
  "pageSize": this.paginationData !== undefined ? this.paginationData.pageSize : "10",
    "order": {
      "column": "",
      "dir": "asc"
    },
    "keySearch": formData ? formData.searchtxt : "",
    "fieldSearch": [
      {
        "fieldName": "co.discountType",
        "fieldValue": formData ? formData.discountType : "",
      }
    ]
  
  
}
let newurl = 'http://14.142.204.96:8080/api/rpa/coupon/v1/attachcoupon/search'

    this.tableDataLoader = true;
    this.https.postJson(environment.APIEndpoint + 'api/rpa/coupon/v1/attachcoupon/search', data3).subscribe(res => {
      this.dataSource.data = res["items"];
      this.resultsLength = res["totalCount"];
      if (this.getCoupons.length > 0) {
        for (let i of this.dataSource.data) {
          if (this.getCoupons.indexOf(i["couponId"]) > -1) {
            this.selection.select(i);
          }
        }
      } else if (this.selectAll) {
        for (let i of this.dataSource.data) {
          this.selection.select(i);
        }
      }
      this.tableDataLoader = false;
    }, err => {
      this.tableDataLoader = false;
      console.log(err);
    })
  }



  
  isSelected(value: any): boolean {
    if (value.couponId == this.couponId)
      return true;
    else
      return false;
  }
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    this.selectedArray = this.selection.selected;
    return numSelected === numRows;
    console.log(numSelected);

  }
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }




     buidsearchLocationForm() {
      this.searchLocationForm = this.fb.group({
        searchLocationField: [""]
        // startDate: [""],
        // endDate: [""],
        // Country: [''],
        // Brand:[''],
        // cityName:[''],
        // venue:[''],
        // status:[''],
        // rewardType:[''],
      });
     
    }


    // makeSelected(){
    //   if (this.locationitem.length > 0) {
    //     for (let i of this.eventData) {
    //       if (this.locationitem.indexOf(i["locationId"]) > -1) {
    //         this.selection.select(i);
    //       }
    //     }
    //     this.originalSelection = this.selection.selected;
    //   }
    // }
  eventPreventDefault($event, flag =false) {
    $event.preventDefault();
    //this.getLocalStorageSearchList(flag);
    return false;
  }

  applyFilter(filterValue: string) {
    this.dataSource = new MatTableDataSource<Element>(this.eventData);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    console.log('filter val',filterValue)
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource.filter = filterValue;
    console.log(' this.dataSource.filter', this.dataSource.filter)
  }

  // openFilter() {
  //   this.status = !this.status;
  // }

  searchVal(){
    /////////////////
  }
  // isAllSelected() {
  //   const numSelected = this.selection.selected.length;
  //   const numRows = this.dataSource.data.length;
  //   return numSelected === numRows;
  // }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  // masterToggle() {
  //   this.isAllSelected() ?
  //       this.selection.clear() :
  //       this.dataSource.data.forEach(row => this.selection.select(row));
  // }
  onCloseClick(): void {
    let obj = {
      'buttonName': 'CANCEL',
      'tableData': this.originalSelection,
      'totalCount': this.resultsLength
    }
    //localStorage.removeItem('stores');
    // localStorage.setItem('stores', JSON.stringify(this.stores));
    this.dialogRef.close(obj);
  }

  // selectRow($event: any, row:Element){
  //   console.info("clicked", $event);
  //   $event.preventDefault();
  //       if (row.selectable && !row.selected) {
  //           this.dataSource.forEach((row) => row.selected = false);
  //           row.selected = true;
  //           this.selection.select(row);
  //           if (location.href.indexOf(queryParamName) >= 0) {
  //               location.href = location.href.replace(queryParamName, "");
  //           }
  //       }
  // }


  getUpdatex(event) {
    this.paginationDetail.next(event);
    this.paginationData = event;
  
  }
}
