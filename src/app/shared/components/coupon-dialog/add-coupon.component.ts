import { OnInit, ViewChild, Output, Input, Component, EventEmitter, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder, FormGroupDirective, FormArray, NgForm } from '@angular/forms';
import { HttpService } from '../../../services/http-service'
import { environment } from '../../../../environments/environment'
import { MatPaginator, MatSort, MatTableDataSource, MatSlideToggleModule } from '@angular/material';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { SnackBarComponent } from '../../../shared/components/snack-bar/snack-bar.component';
import { MatChipInputEvent, MatSnackBar } from '@angular/material';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';


@Component({
  selector: 'add-coupon.component',
  templateUrl: 'add-coupon.component.html',
  styleUrls: ['add-coupon.component.scss']
})


export class addCouponDialog implements OnInit {
  
  public scrollbarOptions = { axis: 'y', theme: 'minimal-dark' };
  dataSource: MatTableDataSource<object>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  displayedColumns: string[] = ['select', 'couponId', 'couponName', 'discountType', 'value', 'startDate', 'endDate'];
  public searchCouponForm: FormGroup;
  public paginationData;
  public couponId: number;
  public resultsLength = 0;
  public selectAll: boolean = false;
  @Input('addnotificationCoupon') addnotificationCoupon;
  @Input('couponList') couponList = [];
  selectedCouponMultiple: boolean = false;
  public selectedArray;
  constructor(private fb: FormBuilder,
    private https: HttpService,
    public dialog: MatDialog,
    private dialogRef: MatDialogRef<MatDialog>,
    public snackBar: MatSnackBar, @Inject(MAT_DIALOG_DATA) data) {

    dialogRef.disableClose = true;
    this.dataSource = new MatTableDataSource();

    console.log('sdfsdfsdfsdff' + data)
    if (data != null) {
      this.couponId = data.couponId
    }

  }

  public selection = new SelectionModel(true, []);

  discountTypes = [
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
    
  ]

  onCloseClick(): void {
    let obj = {
      'buttonName': 'CANCEL'
    }
    this.dialogRef.close(obj);
  }

  ngOnInit() {
    this.buildForm();
    console.log(this.addnotificationCoupon);
    this.getCouponList(this.searchCouponForm.value);
    this.getMultipleCouponData();
  }

  getMultipleCouponData() {
    if (this.addnotificationCoupon == 'Registration' || this.addnotificationCoupon == 'XX No of Transactions' || this.addnotificationCoupon == 'XX No of Plays') {
      this.selectedCouponMultiple = true;
    }else{
      this.selectedCouponMultiple = false;
    }
  }

  buildForm() {
    this.searchCouponForm = this.fb.group({
      searchtxt: [""],
      discountType: [""]
    });

    this.getCouponList(this.searchCouponForm.value);
  }

  resetForm() {
    this.buildForm()
    this.getCouponList(this.searchCouponForm.value);
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
    this.getCouponList(this.searchCouponForm.value);
  }

  status = true;
  openFilter() {
    this.status = !this.status;
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


    this.https.postJson(environment.APIEndpoint + 'api/rpa/coupon/v1/attachcoupon/search', data).subscribe(res => {
      this.dataSource.data = res["items"];
      this.resultsLength = res["totalCount"];
      if (this.couponList.length > 0) {
        console.log(this.couponList.length);
        console.log(this.couponList);
        
        for (let i of this.dataSource.data) {
          if (this.couponList.indexOf(i["couponId"]) > -1) {
            this.selection.select(i);
          }
        }
      } else if (this.selectAll) {
        for (let i of this.dataSource.data) {
          this.selection.select(i);
        }
      }
    }, err => {
      console.log(err)
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

}
