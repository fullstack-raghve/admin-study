import { OnInit, Input, Component, ViewChild, ElementRef, Output, EventEmitter } from "@angular/core";
import { FormGroup, FormBuilder, FormArray } from "@angular/forms";
import { MatCheckboxChange, MatDialog, MatDialogRef } from "@angular/material";
import { HttpService } from 'src/app/services/http-service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'coupon-products-dialog',
  templateUrl: './coupon-products-dialog.component.html',
  styleUrls: ['./coupon-products-dialog.component.scss']
})
export class CouponProductsDialogComponent implements OnInit {

  @Input('selectedSkuProduct') selectedSkuProduct = [];
  @Input('mode') mode: string;
  @Input('couponDateRange') couponDateRange: any;
  @ViewChild('productInput') productInput: ElementRef;
  @Output() change: EventEmitter<MatCheckboxChange> 

  public scrollbarOptions = { axis: 'y', theme: 'minimal-dark' };
  public productList = [];
  skuProductFormGroup: FormGroup;
  searchProductsFormGroup: FormGroup;
  public filePathUrl = localStorage.getItem("imgBaseUrl");
  public totalCount = 0;
  public loading: boolean = false;
  public status = true;
  public prodGroupArr = [];
  public formattedPrductArr = [];
  public productError: boolean = false;
  public selectedSearchData = [];
  public selectedSearchBfrCloseData = [];
  public clickedsearchClose: boolean = false;

  constructor(
    private fb: FormBuilder,
    public dialog: MatDialog,
    private dialogRef: MatDialogRef<CouponProductsDialogComponent>, private http: HttpService,
  ) {
    this.skuProductFormGroup = this.fb.group({
      orders: this.fb.array([])
    });
    dialogRef.disableClose = true;
  }

  buildSearchForm() {
    this.searchProductsFormGroup = this.fb.group({
      // searchVal: [''],
      category: [''],
    });
  }

  private addCheckboxes() {
    const control = <FormArray>this.skuProductFormGroup.controls['orders'];
    this.prodGroupArr.forEach((product, i) => {
      let newForm = this.fb.group({
        productDetails: this.fb.array([]),
      });
      control.push(newForm);
      if (this.clickedsearchClose) {
        this.buildProdDetailsArrayAfterCloseSearch(control.controls[i], product, i)
      } else {
        this.buildProdDetailsArray(control.controls[i], product, i)
      }
    })
    this.clickedsearchClose = false;
  }

  public buildProdDetailsArrayAfterCloseSearch(recievedControl, data, i) {
    let temp = this.selectedSearchData;
    let allSelected = temp.concat(this.selectedSearchBfrCloseData)

    for (let j of data.groupItem) {
      const control = <FormArray>recievedControl.controls['productDetails'];
      let value = false;
      if (allSelected.length != 0) {
        for (let k = 0; k < allSelected.length; k++) {
          if (j.productOid == allSelected[k]['productOid']) {
            value = true;
            break;
          }
        }
      }
      let newGroup = this.fb.group({
        productChecked: [value],
      })
      control.push(newGroup);
    }
  }

  public buildProdDetailsArray(recievedControl, data, i) {
    for (let j of data.groupItem) {
      const control = <FormArray>recievedControl.controls['productDetails'];
      let value = false;
      if (this.selectedSkuProduct.length != 0) {
        for (let k = 0; k < this.selectedSkuProduct.length; k++) {
          if (j.productOid == this.selectedSkuProduct[k]['productOid']) {
            value = true;
            break;
          }
        }
      }
      let newGroup = this.fb.group({
        productChecked: [value],
      })
      control.push(newGroup);
    }
  }
  ngOnInit() {
    this.buildSearchForm();
    this.getSkuProducts();
  }

  getSkuProducts() {
    this.loading = true;
    let request = {
      "page": "0",
      "pageSize": "10000",
      "order": { "column": "oid", "dir": "asc" },
      "keySearch": this.productInput.nativeElement.value,
      "mode": this.mode,
      "fieldSearch": [
        { "fieldName": "couponStartDate", "fieldValue": this.couponDateRange.startDate },
        { "fieldName": "couponEndDate", "fieldValue": this.couponDateRange.endDate },
        { "fieldName": "status", "fieldValue": "ONLINE" }
      ]
    }
    const GET_COUPON_PRODUCTS = environment.APIEndpoint + "api/rpa/product/v1/searchProduct";
    this.http.postJson(GET_COUPON_PRODUCTS, request)
      .subscribe((response) => {
        this.loading = false;
        this.prodGroupArr = [];
        if (response['items'].length > 0) {
          this.productList = response['items']
          this.totalCount = response['totalCount']
          this.prodGroupArr = this.productList.reduce((r, { categoryName }) => {
            if (!r.some(o => o.categoryName == categoryName)) {
              r.push({ categoryName, groupItem: this.productList.filter(v => v.categoryName == categoryName) });
            }
            return r;
          }, []);
          if (this.productInput.nativeElement.value != '') {
            this.buildSearchdataPopup();
          }
          this.addCheckboxes();
        } else if (response['items'].length == 0) {
          this.totalCount = 0;
          this.prodGroupArr = [];
          this.skuProductFormGroup = this.fb.group({
            orders: this.fb.array([])
          });
          this.skuProductFormGroup.controls['orders'].setValue([]);
        }

      })
      , (error) => {
        this.loading = false;
      }
  }
  clearSearch() {
    this.productInput.nativeElement.value = '';
    this.clickedsearchClose = true;
    this.getSelectedProdBfrSearchClose();
    this.buildSearchdataPopup();
    this.getSkuProducts();
  }

  addProduct(value) {
    let area = [];
    if (this.selectedSearchData.length != 0) {
      for (let k = 0; k < this.selectedSearchData.length; k++) {
        area.push(this.selectedSearchData[k]);
      }
    }

    for (let i = 0; i < value.orders.length; i++) {
      for (let j = 0; j < value.orders[i].productDetails.length; j++) {
        if (value.orders[i].productDetails[j].productChecked) {
          area.push(this.prodGroupArr[i].groupItem[j]);
        }
      }
    }

    let filterdProd = area.reduce((unique, o) => {
      if (!unique.some(obj => obj.productOid === o.productOid)) {
        unique.push(o);
      }
      return unique;
    }, []);

    if (filterdProd.length > 0) {
      this.productError = false;

      let tempArray = [...filterdProd].reverse();
      this.dialogRef.close(tempArray);
    } else {
      this.productError = true;
    }

  }

  onCloseClick() {
    this.dialogRef.close();
  }

  public reset() {
    this.buildSearchForm();
  }

  openFilter() {
    this.status = !this.status;
  }

  buildSearchdataPopup() {
    const control = <FormArray>this.skuProductFormGroup.controls['orders'];
    for (let i = control.length - 1; i >= 0; i--) {
      control.removeAt(i)
    }
    this.skuProductFormGroup.controls['orders'].updateValueAndValidity();
  }

  getSelectedDataBfrSearch() {
    let value = this.skuProductFormGroup.value;
    this.selectedSearchData = [];
    for (let i = 0; i < value.orders.length; i++) {
      for (let j = 0; j < value.orders[i].productDetails.length; j++) {
        if (value.orders[i].productDetails[j].productChecked) {
          this.selectedSearchData.push(this.prodGroupArr[i].groupItem[j]);
        }
      }
    }
    this.selectedSkuProduct = this.selectedSearchData.concat(this.selectedSkuProduct);
  }

  getSelectedProdBfrSearchClose() {
    let value = this.skuProductFormGroup.value;
    this.selectedSearchBfrCloseData = [];
    for (let i = 0; i < value.orders.length; i++) {
      for (let j = 0; j < value.orders[i].productDetails.length; j++) {
        if (value.orders[i].productDetails[j].productChecked) {
          this.selectedSearchBfrCloseData.push(this.prodGroupArr[i].groupItem[j]);
        }
      }
    }
  }

  onChangeProduct(event: MatCheckboxChange){
    if(event.checked === true){
      this.productError = false;
    }
  }
}

