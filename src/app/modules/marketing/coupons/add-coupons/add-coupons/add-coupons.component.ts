import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormControl, Validators, FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent, MatSnackBar , MatDialogConfig} from '@angular/material';
import { HttpService } from 'src/app/services/http-service';
import { environment } from 'src/environments/environment';
import { selectStoreDialog } from '../../../../../shared/components/select-store-dialog/select-store.component';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { HttpClient } from '@angular/common/http';
import { SnackBarComponent } from 'src/app/shared/components/snack-bar/snack-bar.component';
import { UploadFile } from 'src/app/services/uploadFile.service';
import * as moment from 'moment';
import { Router } from '@angular/router';
import { Globals } from 'src/app/services/global';
import { ExtraValidators } from 'src/app/services/validator-service';
import { CategoryDialogComponent } from 'src/app/shared/components/category-dialog/category-dialog.component';
import { CouponProductsDialogComponent } from 'src/app/shared/components/coupon-products-dialog/coupon-products-dialog.component';
import { CouponVariantDialogComponent } from 'src/app/shared/components/coupon-variant-dialog/coupon-variant-dialog.component';

export interface StoreData {
  storeId: string;
  storeName: string;
  address: string;
}

@Component({
  selector: 'add-coupons',
  templateUrl: './add-coupons.component.html',
  styleUrls: ['./add-coupons.component.scss']
})
export class AddCouponsComponent implements OnInit {
  public breadCrumbData: Array<Object> = [{
    title: 'Marketing',
    link: ''
  }, {
    title: 'Coupons',
    link: '/search-coupons'
  }
  ];
  @ViewChild('uploadEl') uploadElRef: ElementRef;
  @ViewChild('uploadSku') uploadSkuRef: ElementRef;
  @ViewChild('uploadFile') uploadManualXLSFile: ElementRef;
  couponFormGroup: FormGroup;
  public statusValue: string = 'ONLINE';
  panelOpenState = false;
  public checked = true;
  public imgUpload = false;
  public codeGeneration = 'GENERIC';
  public notificationType = 'ONLINE';
  public couponType;
  public languages = [];
  public rigionList = [];
  public uploadFlag = [];
  public imagePath: any = [];
  public manualFilePath: any = [];
  public manualFileName = '';
  public manualErrorFile = '';
  public skuFilePath = '';
  public skuFileName = '';
  loadingResponse: boolean = false;
  public skuErrorFile = '';
  public skuErrorFileName = '';
  public filePathUrl = localStorage.getItem("imgBaseUrl");
  public errorFilePathUrl = localStorage.getItem("fileBaseUrl");
  public couponLocalesArr = [];
  public minOrdersArr = [];
  public showError = false;
  public toggleVal: boolean = true;
  public couponCodeType = '';
  public couponCodeValue = '';
  public totalCount: [];
  public storeCount: any = 5000;
  public selectedStorearray = [];
  public selectedCount = 0;
  public skuRequired = false;
  public submitForm = true;
  public currenctDate;
  public currenctEndDate;
  public expirtTypeRequired = false;
  public imageRequired = [];
  public manualFileRequired = false;
  public validCouponCode = false;
  public validCouponRequired = false;
  public storeRequired = false;
  public storeRequiredFiled = false;
  public validSkuFile = true;
  public validateSkuFile = false;
  public manualErrorFileName = '';
  public alignCss = [];
  public langfield = [];
  public defaultStoreArray = [];
  public endDateError = null;
  public minEndDates;
  public check_unique = false;
  public currencyOids;
  public selectedStore = [];
  public brandOid = 0;
  public selectStoreVal = false;
  public dataStore: boolean = false;
  public storeErrorMsg;
  private _activeValue = "";
  public languageDirection = [];
  public langfieldname = [];

  public isCouponLimitExceeded: boolean = false;
  public couponLimitErrMsg = "";
  BrandList = [];
  brandType = '';

  public codeCount;
  public codeCountBool: boolean = false;

  public codeCountmanual;
  public codeCountmanualBool: boolean = false;

  public bogoSection: boolean = false;
  public showCouponPercentageIp: boolean = false;
  public showRegionWiseCouponAmt: boolean = false;
  public showFixedProductBogo: boolean = false;
  public showMinCouponUse: boolean = false;
  public fixedProductGetVariants: any = [];
  public fixedProductBuyVariants: any = [];
  public couponBuysProducts: any = [];
  public couponBuysCategories: any = [];
  public productselectionErrorMsg: boolean = false;
  public productGetVarinatsErrorMsg: boolean = false;
  public _offerAlertMsgLocale: any = [];
  public couponGetsDiscountAmount: any = [];
  public discAmount: any = 10;
  public cgdatesValidationMsg: boolean = false;
  public datesValidationMsg: boolean = false;

  constructor(private fb: FormBuilder,
    public dialog: MatDialog,
    private http: HttpService, public snackBar: MatSnackBar,
    private uploadFiles: UploadFile, private router: Router) {
    this.getLanguageList();
    this.getOnBoardingRegions();
    this.buildCreateCouponForm();
    this.getBaseCurrency();
    this.currenctDate = new Date();
    this.minEndDates = new Date();
    //this.dataSource = new MatTableDataSource();
    let data = {
      "order": {
        "column": "storeId",
        "dir": "asc"
      },
      "keySearch": "",
      "fieldSearch": [
        {
          "fieldName": "mall.city.country.oid",
          "fieldValue": "",
        },
        {
          "fieldName": "mall.city.oid",
          "fieldValue": "",
        }
      ]
    }

    this.http.postJson(environment.APIEndpoint + 'api/rpa/store/v2/getAll', data).subscribe(res => {
      console.log(res);

      this.totalCount = res['totalCount'];
      this.storeCount = res['totalCount'];
      this.selectedCount = res["totalCount"];
      console.log(this.totalCount);
    });
  }
  ngOnInit() {
    this.validateCodeGeneration("GENERIC");
    this.getBrandList();
  }
  setEndDate(formData) {
    let startDate = moment(formData.startDate);
    if (formData.endDate != null && formData.endDate != '') {
      let endDate = moment(formData.endDate);
      if (moment(endDate) < moment(startDate)) {
        this.endDateError = true;
      } else {
        this.endDateError = false;
      }
    }
    this.minEndDates = formData.startDate;
  }

  baseCouponImg(event: FileList, i) {
    if (event[0].type == "image/jpeg" || event[0].type == "image/png" || event[0].type == "image/jpg") {
      if (event[0].size < 1000000) {
        this.uploadFiles.upload(event.item(0), 'coupon', 'images')
          .subscribe((response) => {
            if (this.imageRequired.length != 0) {
              this.imageRequired[i] = false;
            }
            this.imagePath[i] = response['message'];
            this.uploadFlag[i] = true;
            this.uploadElRef.nativeElement.value = ''
            this.snackBar.openFromComponent(SnackBarComponent, {
              duration: 1500,
              data: {
                status: "success",
                message: " Image successfully uploaded"
              }
            });
          }, err => {
            if (err.error.errorType == 'VALIDATION') {
              this.snackBar.openFromComponent(SnackBarComponent, {
                duration: 10000,
                data: {
                  status: "failure",
                  message: "Supported format is JPG, JPEG and PNG"
                }
              });
            } else {
              this.snackBar.openFromComponent(SnackBarComponent, {
                duration: 10000,
                data: {
                  status: "failure",
                  message: "Image cannot be uploaded. Please try again later "
                }
              });
            }
          }
          )
      } else {
        this.snackBar.openFromComponent(SnackBarComponent, {
          duration: 10000,
          data: {
            status: "failure",
            message: "Max upload file size is 1Mb"
          }
        });
      }
    }
    else {
      this.snackBar.openFromComponent(SnackBarComponent, {
        duration: 10000,
        data: {
          status: "failure",
          message: "Supported format is JPG, JPEG and PNG"
        }
      });
    }
  }

  uploadManualCoupon(event: FileList) {
    //pick from one of the 4 styles of file uploads below
    this.uploadAndProgress(event, "manual");
  }

  uploadAndProgress(files: FileList, fileType: String) {

    //    var formData = new FormData();
    //    Array.from(files).forEach(f => formData.append('file',f))
    if (files.item(0).type == "application/vnd.ms-excel" || files.item(0).type == "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
      this.uploadFiles.uploadFileSku(files.item(0), 'coupon', 'files')
        .subscribe((response) => {
          console.log(response);
          
          if (fileType == 'manual') {
            this.manualFileName = files.item(0).name;
            this.manualFilePath = response['filePath'];
            this.codeCountmanual = response['codeCounts'];
            if (this.codeCountmanual != 0) {
              this.codeCountmanualBool = true;
            }
            else {
              this.codeCountmanualBool = false;
            }
            this.submitForm = true;
            this.manualFileRequired = false;
            this.validCouponCode = false;
            this.manualErrorFileName = '';
            this.manualErrorFile = '';
            this.uploadManualXLSFile.nativeElement.value = ''
          } else {
            this.skuFileName = files.item(0).name;
            this.skuFilePath = response['filePath'];
            this.codeCount = response['codeCounts'];
            if (this.codeCount != 0) {
              this.codeCountBool = true;
            }
            else {
              this.codeCountBool = false;
            }
            this.skuRequired = false;
            this.validSkuFile = false;
            this.skuErrorFile = '';
            this.skuErrorFileName = '';
            this.uploadSkuRef.nativeElement.value = '';
          }

          this.snackBar.openFromComponent(SnackBarComponent, {
            duration: 1500,
            data: {
              status: "success",
              message: " file successfully uploaded"
            }
          });
        }, err => {
          if (err.error.errorType == 'VALIDATION') {
            this.snackBar.openFromComponent(SnackBarComponent, {
              duration: 10000,
              data: {
                status: "failure",
                message: err.error.message
              }
            });
          } else {
            this.snackBar.openFromComponent(SnackBarComponent, {
              duration: 10000,
              data: {
                status: "failure",
                message: "File cannot be uploaded. Please try again later"
              }
            });
          }

        }
        )
    } else {
      this.snackBar.openFromComponent(SnackBarComponent, {
        duration: 10000,
        data: {
          status: "failure",
          message: "Supported file format is xls and xlsx"
        }
      });
    }
  }

  validateCouponCodes() {
    if (null != this.manualFilePath && this.manualFilePath != '') {
      this.validCouponRequired = false;
      let request = {
        filePath: this.manualFilePath
      }
      let VALIDATE_COUPON_CODES = environment.APIEndpoint + "api/rpa/coupon/v1/validate/couponcode";
      this.http.postJson(VALIDATE_COUPON_CODES, request)
        .subscribe((response) => {
          this.validCouponCode = true;
          this.snackBar.openFromComponent(SnackBarComponent, {
            duration: 10000,
            data: {
              status: "success",
              message: "File validated successfully"
            }
          });
        }, err => {
          if (err.error.errorType == 'VALIDATION') {
            if (err.error.errorDetails[0].errorFilePath != undefined) {
              this.manualErrorFile = this.errorFilePathUrl + '/' + err.error.errorDetails[0].errorFilePath;
              this.manualErrorFileName = this.manualErrorFile.split('/').pop();
            }
            this.manualFileName = '';
            this.snackBar.openFromComponent(SnackBarComponent, {
              duration: 10000,
              data: {
                status: "failure",
                message: err.error.errorDetails[0].description
              }
            });


          } else {
            this.snackBar.openFromComponent(SnackBarComponent, {
              duration: 10000,
              data: {
                status: "failure",
                message: "Unable to validate the file. Please try again later "
              }
            });
          }


        })
    }
  }


  public skuUpload(value: any) {
    this.skuFilePath = '';
    this.submitForm = true
    this.skuErrorFile = '';
    this.skuErrorFileName = '';
    this.validSkuFile = true;
    this.validCouponRequired = false;
    this.skuFileName = '';
    this.validateSkuFile = false;
    this.skuRequired = false;
    this.uploadSkuRef.nativeElement.value = null;
  }

  validateSKUs() {
    if (null != this.skuFilePath && this.skuFilePath != '') {
      this.validateSkuFile = false;
      let request = {
        filePath: this.skuFilePath
      }
      let VALIDATE_SKUS = environment.APIEndpoint + "api/rpa/coupon/v1/validate/sku";
      this.http.postJson(VALIDATE_SKUS, request)
        .subscribe((response) => {
          this.validSkuFile = true;
          this.submitForm = true;
          this.snackBar.openFromComponent(SnackBarComponent, {
            duration: 10000,
            data: {
              status: "success",
              message: "File validated successfully"
            }
          });
        }, err => {
          console.log(err);
          this.validSkuFile = false;
          if (err.error.errorDetails[0].errorFilePath != undefined) {
            this.skuErrorFile = this.errorFilePathUrl + '/' + err.error.errorDetails[0].errorFilePath;
            this.skuErrorFileName = this.skuErrorFile.split("/").pop();
          }
          this.skuFileName = '';
          this.snackBar.openFromComponent(SnackBarComponent, {
            duration: 10000,
            data: {
              status: "failure",
              message: err.error.errorDetails[0].description
            }
          });

        })
    }
  }

  uploadFile(event: FileList) {
    //pick from one of the 4 styles of file uploads below
    this.uploadAndProgress(event, "skuFile");
  }

  uploadFileList(files: File[]) {
    var formData = new FormData();
    Array.from(files).forEach(f => formData.append('file', f))
  }



  public toggleStatus(event) {
    if (event.checked == true) {
      this.statusValue = 'ONLINE';
    } else {
      this.statusValue = 'OFFLINE';
    }

  }

  getLanguageList() {
    let GET_ALL_LANGUAGES = environment.APIEndpoint + "api/rpa/master/language/v1/list";
    this.http.getJson(GET_ALL_LANGUAGES)
      .subscribe((response) => {
        this.languages = response;
        this.addCouponLocales();
      })
  }

  getOnBoardingRegions() {
    let GET_ALL_REGIONS = environment.APIEndpoint + "api/rpa/client/onboarding/v1/view";
    this.http.getJson(GET_ALL_REGIONS)
      .subscribe((response) => {
        this.currencyOids = response["regionList"].map(oid => oid.currencyOid);
        this.rigionList = response['regionList'];
        this.addmMinOrderAmount();
        this.getCurrencyConversionValue(this.currencyOids);
      })
  }

  public basecurrency = '';
  getBaseCurrency() {
    let GET_BASE_CURRENCY = environment.APIEndpoint + "api/rpa/master/currency/v1/getbasecurrency";
    this.http.getJson(GET_BASE_CURRENCY)
      .subscribe((response) => {
        this.basecurrency = response["currencyCode"];
      })
  }

  public conversionList: any = [];

  public getCurrencyConversionValue(currencyOids: any) {
    let GET_ALL_CURRENCY_CONVERSION_VALUE = environment.APIEndpoint +
      "api/rpa/master/currencyconversion/v1/get/conversionRate?currencyOids=" +
      currencyOids;
    this.http.getJson(GET_ALL_CURRENCY_CONVERSION_VALUE)
      .subscribe((response) => {
        console.log(response);
        this.conversionList = response;

      })
  }

  public autoPopulateCurrencyValue(column: any, row: any, currencyValue: any) {
    if (row == 0 && currencyValue != null && currencyValue != '') {
      for (let i = 0; i < this.rigionList.length; i++) {
        for (let conversion of this.conversionList) {
          const array = <FormArray>this.couponFormGroup.controls['minOrderAmounts'];
          if (conversion.currencyCode === this.rigionList[i].currencyCode && i != 0) {
            let conversionValue = conversion.conversionValue * parseInt(currencyValue);
            array.at(i).patchValue({
              orderAmount: [conversionValue.toFixed(3)]
            });
            array.markAsPristine;
          }
        }
      }
    } else if (row == 0 && (currencyValue == null || currencyValue == '')) {
      for (let i = 0; i < this.rigionList.length; i++) {
        for (let conversion of this.conversionList) {
          const array = <FormArray>this.couponFormGroup.controls['minOrderAmounts'];
          if (conversion.currencyCode === this.rigionList[i].currencyCode && i != 0) {
            array.at(i).patchValue({
              orderAmount: []
            });
            array.markAsPristine;
          }
        }
      }
    }
  }
  public expiryMinValidation: any = "";
  onChange(event, group) {
    if (this._activeValue === event.value) {
      group.value = "";
      this._activeValue = "";
    } else {
      this._activeValue = event.value;
    }
  }
  // removeEmptyValue(ev){
  //   console.log(ev.target.value);
  //   if (ev.target.value==''){
  //     let expiryType = this.couponFormGroup.get('expiryType').setValue('');
  //   }
  // }
  public validateExpiryType() {
    // console.log(event);
    // let toggle = event.source;
    // if (toggle) {
    //   let group = toggle.buttonToggleGroup;
    //   if (event.value.some(item => item == toggle.value)) {
    //     group.value = [toggle.value];
    //   }
    // }
    let expiryValue = this.couponFormGroup.get('expiryValue');
    let expiryType = this.couponFormGroup.get('expiryType');
    if (expiryValue.value != null && (expiryType.value == null || expiryType.value == "")) {
      // expiryType.setValidators([Validators.required]);
      // expiryType.updateValueAndValidity();
    }
    else if ((expiryValue.value == null || expiryValue.value == "") && (expiryType.value != null || expiryType.value != "")) {
      expiryType.clearValidators();
      expiryType.updateValueAndValidity();
      expiryValue.clearValidators();
      expiryValue.updateValueAndValidity();
    }
    else if ((expiryValue.value == null || expiryValue.value == "") && (expiryType.value == null || expiryType.value == "")) {
      expiryType.clearValidators();
      expiryType.updateValueAndValidity();
      expiryValue.clearValidators();
      expiryValue.updateValueAndValidity();
    }
    else {
      expiryType.clearValidators();
      expiryType.updateValueAndValidity();
      if (expiryType.value == "MINUTES") {
        expiryValue.clearValidators();
        expiryValue.setValidators([Validators.pattern('^[1-5]?[0-9]$')]);
        expiryValue.updateValueAndValidity();
        this.expiryMinValidation = "Allowed is upto 59 Minutes";
      } else if (expiryType.value == "HOURS") {
        expiryValue.clearValidators();
        expiryValue.setValidators([Validators.pattern('^(2[0-4]|1[0-9]|[1-9])$')]);
        expiryValue.updateValueAndValidity();
        this.expiryMinValidation = "Allowed is upto 24 Hours";
      } else if (expiryType.value == "DAYS") {
        expiryValue.clearValidators();
        expiryValue.setValidators([Validators.pattern('^([0]{0,2}[1-9]|[0]?[1-9][0-9]|[12][0-9][0-9]|3[0-5][0-9]|36[0-5])$')]);
        expiryValue.updateValueAndValidity();
        this.expiryMinValidation = "Allowed is upto 365 Days";
      }
    }

  }

  // openDialog() {
  //   const dialogRef = this.dialog.open(addStoreDialog);
  //   dialogRef.componentInstance.storeList = this.selectedStore;
  //   dialogRef.componentInstance.brandOid=this.brandOid;
  //   if (this.selectedStorearray.length <= 0) {
  //     dialogRef.componentInstance.selectAll = true;
  //   } else {
  //     dialogRef.componentInstance.storeList = this.selectedStorearray;
  //   }

  //   dialogRef.afterClosed().subscribe(result => {
  //     if (result.buttonName === 'SELECT') {
  //       this.selectedCount = result.tableData.length;
  //       this.totalCount = result.totalCount;
  //       for (let i = 0; i < result.tableData.length; i++) {
  //         this.selectedStorearray.push(result.tableData[i].storeOid);
  //       }
  //     }
  //     if (this.selectedStorearray.length != 0) {
  //       this.storeRequired = false;
  //     }
  //   });
  // }
  openDialog() {
    const dialogRef = this.dialog.open(selectStoreDialog);
    dialogRef.componentInstance.storeList = this.selectedStorearray;
    dialogRef.componentInstance.totalCount = this.storeCount;
    dialogRef.afterClosed().subscribe(result => {
      if (result.buttonName === 'SELECT') {
        this.selectedStorearray = [];
        this.selectedCount = result.tableData.length;
        this.totalCount = result.totalCount;
        for (let i = 0; i < result.tableData.length; i++) {
          this.selectedStorearray.push(result.tableData[i].storeOid);
          const arrrayTemp = this.selectedStorearray;
          this.selectedStorearray = Array.from(new Set(arrrayTemp));
          if (this.selectedStorearray.length) {
            this.selectStoreVal = true;
            this.dataStore = false;
            setTimeout(() => {
              this.selectStoreVal = false;
              if (this.selectStoreVal == false) {
                this.dataStore = true;
              }
            }, 2000);
          }
        }
        if (this.selectedStorearray.length != 0) {
          this.storeRequiredFiled = false;
          this.storeErrorMsg = "Please select Store";
        }
      }
    });
  }
  // openDialog() {
  //   const dialogRef = this.dialog.open(addStoreDialog);
  //   dialogRef.componentInstance.storeList = this.selectedStore;
  //   dialogRef.componentInstance.brandOid = this.brandOid;
  //   dialogRef.afterClosed().subscribe(
  //     (result) => {
  //       if (result.buttonName === 'SELECT') {
  //         this.selectedStore = [];
  //         this.selectedCount = result.tableData.length;
  //         console.log(this.selectedCount);
  //         if (this.selectedCount != 0) {
  //           for (let i = 0; i < result.tableData.length; i++) {
  //             let storeId = result.tableData[i].storeOid;
  //             this.selectedStore.push(parseInt(storeId));
  //             console.log(result.tableData);
  //             console.log(result.tableData.length);
  //             const arrrayTemp = this.selectedStore;
  //             this.selectedStore = Array.from(new Set(arrrayTemp));
  //             console.log(this.selectedStore.length);
  //             if (this.selectedStore.length) {
  //               this.selectStoreVal = true;
  //               this.dataStore = false;
  //               setTimeout(() => {
  //                 this.selectStoreVal = false;
  //                 if (this.selectStoreVal == false) {
  //                   this.dataStore = true;
  //                 }
  //               }, 2000);
  //             }
  //             this.selectedStore = this.selectedStore.filter(function (element) {
  //               return element !== undefined;
  //             });
  //           }
  //         } else {
  //           this.storeErrorMsg = "Please select Store";
  //         }
  //       }
  //     }
  //   );
  // }

  public buildCreateCouponForm() {
    this.couponFormGroup = this.fb.group({
      discountType: ["", Validators.compose([Validators.required])],
      discountValue: ["", Validators.compose([ExtraValidators.conditional(
        group => (this.couponFormGroup.get('discountType').value == 'TRANSACTION_DISCOUNT_AMOUNT'
        || this.couponFormGroup.get('discountType').value == 'ITEM_DISCOUNT_AMOUNT'
        || this.couponFormGroup.get('discountType').value == 'ITEM_DISCOUNT'
        || this.couponFormGroup.get('discountType').value == 'TRANSACTION_DISCOUNT'
        || this.couponFormGroup.get('discountType').value == 'DEAL_TYPE'),
        Validators.required, 
        )])],
      startDate: ["", Validators.compose([Validators.required])],
      endDate: ["", Validators.compose([Validators.required])],
      expiryValue: ["",],
      expiryType: ["",],
      internalComment: ["", Validators.compose([Validators.maxLength(250), Validators.pattern(Globals.regCustomwhiteList)])],
      internalCouponTitle: [''],
      notificationType: [""],
      codeGeneration: [""],
      couponLocales: this.fb.array([]),
      minOrderAmounts: this.fb.array([]),
      genericCodeValue: ["",],
      uniqueCodeValue: ["",],
      uniqueCodeType: ["",],
      couponUsageLimit: ["", Validators.compose([Validators.required, Validators.maxLength(8), Validators.pattern('^[1-9][0-9]*')])],
      usageLimitPerCustomer: ["", Validators.compose([Validators.required, Validators.maxLength(3), Validators.pattern('^[1-9][0-9]*')])],
      couponUsageBy: [false,],
      brandOids: [''],
      // brandType:[''],
      couponType: ['', Validators.required],
      channelType: [''],
      regionCouponAmount: this.fb.array([]),
      customerBuysQuantity: ['', Validators.compose([ExtraValidators.conditional(
        group => this.bogoSection == true,
        Validators.required),Validators.pattern('^[1-9][0-9]*')])],
      customerGetsQuantity: ['', Validators.compose([ExtraValidators.conditional(
        group => this.bogoSection == true,
        Validators.required),Validators.pattern('^[1-9][0-9]*')])],
      customerBuysProduct: ['', Validators.compose([ExtraValidators.conditional(
        group => this.bogoSection == true,
        Validators.required)])],
      customerGetsProduct: ['', Validators.compose([ExtraValidators.conditional(
        group => this.showFixedProductBogo == true,Validators.required)])],
        minCouponUsePerOffer: ['', Validators.compose([ExtraValidators.conditional(
          group => this.showMinCouponUse == true,
          Validators.required),Validators.pattern('^[1-9][0-9]*')])],
        couponGetsPercentage:['', Validators.compose([ExtraValidators.conditional(
          group => this.showCouponPercentageIp == true,
          Validators.required),Validators.pattern('^[1-9][0-9]*')])],
        enBuyAlertMsg: ['', Validators.compose([ExtraValidators.conditional(
          group => this.showFixedProductBogo == true, Validators.required)])],
        enGetAlertMsg: ['', Validators.compose([ExtraValidators.conditional(
          group => this.showFixedProductBogo == true, Validators.required)])],
    });
  }

  public addCouponLocales() {
    for (let i = 0; i < this.languages.length; i++) {
      this.uploadFlag.push(false);
      const control = <FormArray>this.couponFormGroup.controls['couponLocales'];
      let newForm = this.fb.group({
        couponTitle: ["", Validators.compose([Validators.required, Validators.maxLength(40), Validators.pattern(Globals.regCustomwhiteList)])],
        description: ["", Validators.compose([Validators.required])],
        termsAndCondition: ["", Validators.compose([Validators.required])]
      });
      control.push(newForm);
      // this.alignCss.push(this.languages[i].direction == 'RTL' ? 'text-right' : '');
      // this.langfield.push(this.languages[i].direction == 'RTL' ? 'lang-field-right' : '');
      this.alignCss.push(this.languages[i].direction == 'RTL' ? 'text-right' : '');
      this.langfield.push(this.languages[i].direction == 'RTL' ? 'lang-field-right' : '');
      this.languageDirection.push(this.languages[i].direction == 'RTL' ? 'direction' : '');
      // this.langfield.push(this.languages[i].direction == 'RTL' ? 'direction' : '');
      this.langfieldname.push(this.languages[i].direction == 'RTL' ? 'direction' : '');
    }
  }


  public addmMinOrderAmount() {
    for (let i = 0; i < this.rigionList.length; i++) {
      const control = <FormArray>this.couponFormGroup.controls['minOrderAmounts'];
      let newForm = this.fb.group({
        orderAmount: ["", Validators.compose([Validators.pattern('^([0-9]{1,19})(\\.[0-9]{1,3})?$')])]
      });
      control.push(newForm);
    }
  }

  public validateCodeGeneration(codeGenerationType) {
    let genericCodeValue = this.couponFormGroup.get('genericCodeValue');
    let uniqueCodeValue = this.couponFormGroup.get('uniqueCodeValue');
    let uniqueCodeType = this.couponFormGroup.get('uniqueCodeType')

    if (codeGenerationType == "GENERIC") {
      this.manualFileName = '';
      this.manualFilePath = '';
      genericCodeValue.setValue("");
      uniqueCodeValue.setValue("");
      uniqueCodeType.setValue("");
      uniqueCodeValue.clearValidators();
      uniqueCodeValue.updateValueAndValidity();
      uniqueCodeType.clearValidators();
      uniqueCodeType.updateValueAndValidity();
      genericCodeValue.setValidators([Validators.required, Validators.minLength(16), Validators.pattern('^[a-zA-Z0-9]*')]);
      genericCodeValue.updateValueAndValidity();
      this.check_unique = false;
    } else if (codeGenerationType == "UNIQUE") {
      this.manualFileName = '';
      this.manualFilePath = '';
      genericCodeValue.setValue("");
      uniqueCodeValue.setValue("");
      uniqueCodeType.setValue("");
      genericCodeValue.clearValidators();
      genericCodeValue.updateValueAndValidity();
      uniqueCodeValue.setValidators([Validators.required, Validators.maxLength(3), Validators.pattern('^[a-zA-Z0-9]*')]);
      uniqueCodeType.setValidators([Validators.required]);
      uniqueCodeValue.updateValueAndValidity();
      uniqueCodeType.updateValueAndValidity();
      this.check_unique = false;
    } else if (codeGenerationType == "MANUAL") {
      genericCodeValue.setValue("");
      uniqueCodeValue.setValue("");
      uniqueCodeType.setValue("");
      uniqueCodeValue.clearValidators();
      uniqueCodeValue.updateValueAndValidity();
      uniqueCodeType.clearValidators();
      uniqueCodeType.updateValueAndValidity();
      genericCodeValue.clearValidators();
      genericCodeValue.updateValueAndValidity();
      this.check_unique = false;
    }
  }

  public updateValidation(value: any) {
    if (value != 'ITEM_DISCOUNT_AMOUNT' || value != 'ITEM_DISCOUNT') {
      this.skuRequired = false;
      this.validateSkuFile = false;
    }
    if (value == 'BUY_X_GET_Y' || value == 'BUY_X_GET_Z_DISCOUNT_ON_Y_PRODUCT' || value == 'BUY_X_GET_Z_DISCOUNT_AMOUNT_ON_Y_PRODUCT') {
      this.bogoSection = true;
      this.showCouponPercentageIp = value == 'BUY_X_GET_Z_DISCOUNT_ON_Y_PRODUCT' ? true : false;
      this.showRegionWiseCouponAmt = value == 'BUY_X_GET_Z_DISCOUNT_AMOUNT_ON_Y_PRODUCT' ? true : false;
    } else {
      this.bogoSection = false;
      this.showCouponPercentageIp = false;
    }
  }
  
  public regionWiseCouponAmount() {
    for (let i = 0; i < this.rigionList.length; i++) {
      const control = <FormArray>this.couponFormGroup.controls['regionCouponAmount'];
      let newForm = this.fb.group({
        couponAmount : ["",  Validators.compose([ExtraValidators.conditional(group => this.showRegionWiseCouponAmt == true, Validators.required),Validators.maxLength(8), Validators.pattern('^([1-9]|[0-9]{1,4})(\\.[0-9]{1,2})?$')])], 
      });
      control.push(newForm);
    }
  }

  createCoupon(formData) {
    let required = false;
    let skuValidated = false;
    this.check_unique = true;
    let limitExceeded = false;
    limitExceeded = this.ValidateUsageLimit();
    if (this.selectedStorearray.length == 0) {
      this.storeRequired = true;
      this.storeRequiredFiled = true;
      this.storeErrorMsg = "Please select Store";
      required = true;
    }
    if (this.skuFilePath == '' && (formData.discountType == 'ITEM_DISCOUNT' || formData.discountType == 'ITEM_DISCOUNT_AMOUNT')) {
      skuValidated = true;
      this.skuRequired = true;
    } 
    if (!this.validSkuFile) {
      this.validateSkuFile = true;
      skuValidated = true;
    }

    if (this.couponFormGroup.invalid == true || required || skuValidated || limitExceeded) {
      this.showError = true;
    } else {
      for (var i = 0; i < this.uploadFlag.length; i++) {
        if (this.uploadFlag[i] == false) {
          this.imageRequired[i] = true;
        } else {
          this.imageRequired[i] = false;
        }
      }

      if (formData.codeGeneration == 'MANUAL' && (this.manualFilePath == null || this.manualFilePath == '')) {
        this.manualFileRequired = true;
        this.submitForm = false;
      }

      if (!this.validCouponCode && !this.manualFileRequired && formData.codeGeneration == 'MANUAL') {
        this.validCouponRequired = true;
      } else {
        this.validCouponCode = true;
      }

      if (this.submitForm && this.validCouponCode && this.validSkuFile && this.imagePath.length != 0) {
        this.couponLocalesArr = [];
        this.minOrdersArr = [];
        for (var i = 0; i < formData.couponLocales.length; i++) {
          let locale = {
            languageId: this.languages[i].languageId,
            couponTitle: formData.couponLocales[i].couponTitle,
            couponDescription: formData.couponLocales[i].description,
            imagePath: this.imagePath[i],
            termsAndCondition: formData.couponLocales[i].termsAndCondition,
          }
          this.couponLocalesArr.push(locale);
        }

        for (var i = 0; i < formData.minOrderAmounts.length; i++) {
          let amt = formData.minOrderAmounts[i].orderAmount;
          let minOrder = {
            regionId: this.rigionList[i].regionId,
            orderAmount: amt.toString(),
          }
          this.minOrdersArr.push(minOrder);
        }

        if (formData.codeGeneration == 'GENERIC') {
          this.couponCodeType = 'FIXED';
          this.couponCodeValue = formData.genericCodeValue;
        } else if (formData.codeGeneration == 'UNIQUE') {
          this.couponCodeType = formData.uniqueCodeType;
          this.couponCodeValue = formData.uniqueCodeValue;

        } else if (formData.codeGeneration == 'MANUAL') {
          this.couponCodeType = 'FILEUPLOAD';
          this.couponCodeValue = this.manualFilePath;
        }
        // let selectedStorearray = this.dataSource.data.map(a => a.storeId)
        let brandOid = [];
        if (formData.brandOids != '') {
          brandOid.push(JSON.parse(formData.brandOids));
        }
        if(this.bogoSection && this.couponFormGroup.get('discountType').value == 'BUY_X_GET_Z_DISCOUNT_AMOUNT_ON_Y_PRODUCT'){
          for (var i = 0; i < formData.regionCouponAmount.length; i++) {
            let couponAmt = formData.regionCouponAmount[i].couponAmount;
            let couponDiscAmt = {
              regionId: this.rigionList[i].regionId,
              discountAmount: couponAmt.toString(),
            }
            this.couponGetsDiscountAmount.push(couponDiscAmt);
          }
        }
        if(this.bogoSection){
          if(this.couponBuysProducts.length === 0 && this.couponBuysCategories.length === 0 && this.fixedProductBuyVariants.length == 0){
            this.productselectionErrorMsg = true;
            return;
          }
        }
        if (this.showFixedProductBogo) {
          if(this.fixedProductGetVariants.length == 0){
            this.productGetVarinatsErrorMsg = true;
            return;
          }
          this._offerAlertMsgLocale = [
            {
              "languageId": 1,
              "buyMessage": 'Buy' + '\xa0' + formData.customerBuysQuantity + '\xa0' + formData.enBuyAlertMsg ,
              "getMessage": 'Get' + '\xa0' + formData.customerGetsQuantity + '\xa0' + formData.enGetAlertMsg
            },
          ]
        } else {
          this._offerAlertMsgLocale = [];
        }
        let selectedCategoryIds = this.couponBuysCategories.map(item => item.categoryId);
        let selectedProductIds = this.couponBuysProducts.map(item => item.productOid);
        // let customerGetselectedCategoryIds = this.customerGetsCategories.map(item => item.categoryId);
        // for fixed product selected variants
        // customer buy section variants
        let cbProductGroupData = [];
        let customerBuyFixedProducts = [];
        this.fixedProductBuyVariants.forEach(item => {
          if(!cbProductGroupData[item.productOid]){
            cbProductGroupData[item.productOid] = [];
          }
          cbProductGroupData[item.productOid].push(item.skuCode)
        });
        console.log(cbProductGroupData);
        cbProductGroupData.forEach((value, key) => {
          customerBuyFixedProducts.push({
            productOid : key,
            productSkus : value
          })       
        });
        console.log(customerBuyFixedProducts);

        // customer get section variants
        let cgProductGroupData = [];
        let customerGetFixedProducts = [];
        this.fixedProductGetVariants.forEach(item => {
          if(!cgProductGroupData[item.productOid]){
            cgProductGroupData[item.productOid] = [];
          }
          cgProductGroupData[item.productOid].push(item.skuCode)
        });
        console.log(cgProductGroupData);
        cgProductGroupData.forEach((value, key) => {
          customerGetFixedProducts.push({
            productOid : key,
            productSkus : value
          })       
        });
        
        let couponBuysDetails = {
          quantity: formData.customerBuysQuantity,
          buyFrom: formData.customerBuysProduct,
          couponBuysProducts: selectedProductIds,
          couponBuysCategories: selectedCategoryIds,
          couponBuysProductsList : customerBuyFixedProducts.length > 0 ? customerBuyFixedProducts : null
        }
        let couponGetsDetails = {
          quantity: formData.customerGetsQuantity,
          getFrom : formData.customerGetsProduct != '' ? formData.customerGetsProduct : null,
          minCouponUsePerOffer: formData.minCouponUsePerOffer,
          couponGetsDiscountAmount:this.couponGetsDiscountAmount,
          couponOfferMessageLocaleBean: this._offerAlertMsgLocale.length > 0 ? this._offerAlertMsgLocale : null,
          couponGetsProductsList : customerGetFixedProducts.length > 0 ? customerGetFixedProducts : null
        }
        if(this.couponFormGroup.get('discountType').value == 'BUY_X_GET_Z_DISCOUNT_ON_Y_PRODUCT'){
          this.discAmount = formData.couponGetsPercentage;
        }else if(this.couponFormGroup.get('discountType').value == 'BUY_X_GET_Y'){
          this.discAmount = 100;
        } else if(this.couponFormGroup.get('discountType').value == 'BUY_X_GET_Z_DISCOUNT_AMOUNT_ON_Y_PRODUCT'){
          this.discAmount = 10;
        }
        let request = {
          discountType: formData.discountType,
          discountValue: formData.discountValue != '' ? formData.discountValue : this.discAmount,
          startDate: moment(formData.startDate).format('YYYY-MM-DD'),
          endDate: moment(formData.endDate).format('YYYY-MM-DD'),
          expiryValue: formData.expiryValue,
          expiryType: formData.expiryType != '' ? formData.expiryType : null,
          internalComment: formData.internalComment,
          notificationType: formData.notificationType,
          status: this.statusValue,
          displayOnDashboard: true,
          couponLocales: this.couponLocalesArr,
          codeGenerationType: formData.codeGeneration,
          codeType: this.couponCodeType,
          codeValue: this.couponCodeValue,
          minOrderAmounts: this.minOrdersArr,
          couponUsageLimit: formData.couponUsageLimit,
          usageLimitPerCustomer: formData.usageLimitPerCustomer,
          couponUsageBy: formData.couponUsageBy,
          skuFilePath: this.skuFilePath,
          couponStoreIds: this.selectedStorearray,
          internalCouponTitle: formData.internalCouponTitle,
          brandOids: brandOid,
          channelType: formData.channelType != '' ? formData.channelType : null,
          couponType: formData.couponType != '' ? formData.couponType : null,
          brandType: this.brandType != '' ? this.brandType : null,
          specificProduct : this.showFixedProductBogo,
          couponBuys: this.bogoSection == true ? couponBuysDetails : null,
          couponGets: this.bogoSection == true ? couponGetsDetails : null,
        }
        console.log(JSON.stringify(request));
        this.loadingResponse = true;
        let CREATE_COUPON = environment.APIEndpoint + "api/rpa/coupon/v3/create"
        this.http.postJson(CREATE_COUPON, request)
          .subscribe((response) => {
            this.loadingResponse = false;
            this.snackBar.openFromComponent(SnackBarComponent, {
              duration: 10000,
              data: {
                status: "success",
                message: "Coupon details have been added successfully"
              }
            });
            sessionStorage.clear();
            this.router.navigate(['/search-coupons']);
          }
            , err => {
              this.loadingResponse = false;
              console.log("error Status = " + err);
              if (err.error.errorType == 'VALIDATION') {
                this.snackBar.openFromComponent(SnackBarComponent, {
                  duration: 10000,
                  data: {
                    status: "failure",
                    message: err.error.errorDetails[0].description
                  }
                });
              } else {
                this.snackBar.openFromComponent(SnackBarComponent, {
                  duration: 10000,
                  data: {
                    status: "failure",
                    message: "Your request cannot be saved at this time. Please try again later"
                  }
                });
              }
            });
      }
    }

  }

  public removeManualFile() {
    this.manualFileName = '';
    this.manualErrorFileName = '';
  }
  public removeImage(index) {
    this.imagePath[index] = undefined;
    this.uploadFlag[index] = false;
  }

  public ValidateUsageLimit() {
    let couponUsageLimit = this.couponFormGroup.get('couponUsageLimit').value;
    let usageLimitPerCustomer = this.couponFormGroup.get('usageLimitPerCustomer').value;
    if (parseInt(usageLimitPerCustomer) > parseInt(couponUsageLimit)) {
      this.isCouponLimitExceeded = true;
      this.couponLimitErrMsg = "UsageLimitPerCustomer cannot be greater than CouponUsageLimit"
      return this.isCouponLimitExceeded;
    } else {
      this.isCouponLimitExceeded = false;
      this.couponLimitErrMsg = "";
      return this.isCouponLimitExceeded;
    }
  }
  setBrandType(brandOid) {
    this.BrandList.forEach(element => {
      if (element.brandId == brandOid) {
        this.brandType = element.brandType;
      }
    });
  }

  getBrandList() {
    let GET_ALL_ONLINE_BRANDS = environment.APIEndpoint + "api/rpa/store/v1/get/storeBrands";
    this.http.getJson(GET_ALL_ONLINE_BRANDS)
      .subscribe((response) => {
        // console.log(response);
        let BrandList = response;
        if (BrandList.length > 0) {
          this.BrandList = BrandList
        }
      }
      );
  }

  public selectFixedProducts(value): void {
    if ((this.couponFormGroup.get('startDate').value != '' && this.couponFormGroup.get('startDate').value != 'Invalid date') &&
       (this.couponFormGroup.get('endDate').value != '' && this.couponFormGroup.get('endDate').value != 'Invalid date')
       ) {
      this.cgdatesValidationMsg = false;
      if (value === 'PRODUCT') {
        this.openCustomerGetVariantDialogue((moment(this.couponFormGroup.get('startDate').value).format('YYYY-MM-DD')), moment(this.couponFormGroup.get('endDate').value).format('YYYY-MM-DD'));
      } 
    } else {
      this.cgdatesValidationMsg = true;
    }
  }
  
  public openProductOrCategory(productFrom): void {
    if ((this.couponFormGroup.get('startDate').value != '' && this.couponFormGroup.get('startDate').value != 'Invalid date') &&
       (this.couponFormGroup.get('endDate').value != '' && this.couponFormGroup.get('endDate').value != 'Invalid date')
       ) {
      this.datesValidationMsg = false;
      if (productFrom === 'CATEGORY') {
        this.openCategoryDialog((moment(this.couponFormGroup.get('startDate').value).format('YYYY-MM-DD')), moment(this.couponFormGroup.get('endDate').value).format('YYYY-MM-DD'));
      } else if (productFrom === 'PRODUCT' && !this.showFixedProductBogo) {
        this.openProductDialog((moment(this.couponFormGroup.get('startDate').value).format('YYYY-MM-DD')), moment(this.couponFormGroup.get('endDate').value).format('YYYY-MM-DD'));
      } else if (productFrom === 'PRODUCT' && this.showFixedProductBogo) {
        this.openCustomerBuyVariantDialogue((moment(this.couponFormGroup.get('startDate').value).format('YYYY-MM-DD')), moment(this.couponFormGroup.get('endDate').value).format('YYYY-MM-DD'));
      }
    } else {
      this.datesValidationMsg = true;
    }
  }

  isFixedProductBogo(value){
    this.showFixedProductBogo = value == true ? true : false;
    if(!this.showFixedProductBogo){
      this.couponFormGroup.patchValue(
        { enBuyAlertMsg: '',
          enGetAlertMsg: '',
          customerGetsProduct: '',
          customerBuysProduct: ''
        })
      this.fixedProductBuyVariants = [];
      this.fixedProductGetVariants = [];
    }
  }

  public removeBogoItem(index, type) {
    if (type === 'productArray') {
      this.couponBuysProducts.splice(index, 1);
    } else if (type === 'categoryArray') {
      this.couponBuysCategories.splice(index, 1);
    } else if(type === 'variantArray'){
      this.fixedProductBuyVariants.splice(index, 1);
    }
  }

  public cbProductFromUpdate(value) {
    if (value == 'CATEGORY') {
      this.couponBuysProducts = [];
      this.fixedProductBuyVariants = [];
    } else if (value === 'PRODUCT' && !this.showFixedProductBogo) {
      this.couponBuysCategories = [];
      this.fixedProductBuyVariants = [];
    } else if(value === 'PRODUCT' && this.showFixedProductBogo){
      this.couponBuysCategories = [];
      this.couponBuysProducts = [];
    }
  }

  public openCategoryDialog(startDate, endDate) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = "350px";
    dialogConfig.height = 'auto';
    dialogConfig.autoFocus = false;
    dialogConfig.panelClass = 'categories-dialogue';
    const dialogRef = this.dialog.open(CategoryDialogComponent, dialogConfig);
    let couponDateRange = {
      startDate: startDate,
      endDate : endDate
    }
    dialogRef.componentInstance.prepopulateCategories = this.couponBuysCategories;
    dialogRef.componentInstance.couponDateRange = couponDateRange;
    dialogRef.componentInstance.mode = 'create';
    dialogRef.afterClosed().subscribe(result => {
      if(result != undefined){
        this.couponBuysCategories = result;
        if(this.couponBuysCategories.length > 0){
          this.productselectionErrorMsg = false;
        }
      }
    });
  }

  public openProductDialog(startDate, endDate) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = "350px";
    dialogConfig.height = 'auto';
    dialogConfig.autoFocus = false;
    dialogConfig.panelClass = 'products-dialogue';
    let couponDateRange = {
      startDate: startDate,
      endDate : endDate
    }
    const dialogRef = this.dialog.open(CouponProductsDialogComponent, dialogConfig);
    dialogRef.componentInstance.selectedSkuProduct = this.couponBuysProducts;
    dialogRef.componentInstance.couponDateRange = couponDateRange;
    dialogRef.componentInstance.mode = 'create';
    dialogRef.afterClosed().subscribe(result => {
      if(result != undefined){
        this.couponBuysProducts = result;
        if(this.couponBuysProducts.length > 0){
          this.productselectionErrorMsg = false;
        }
      }
    });
  }

  checkMinCouponUse(value){
    if(value){
      this.showMinCouponUse = true;
    } else{
      this.showMinCouponUse = false;
    }
  }

  public openCustomerBuyVariantDialogue(startDate, endDate){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = "350px";
    dialogConfig.height = 'auto';
    dialogConfig.autoFocus = false;
    dialogConfig.panelClass = 'fixed-products-dialogue';
    let couponDateRange = {
      startDate: startDate,
      endDate : endDate
    }
    const dialogRef = this.dialog.open(CouponVariantDialogComponent, dialogConfig);
    dialogRef.componentInstance.selectedSkuProduct = this.fixedProductBuyVariants;
    dialogRef.componentInstance.couponDateRange = couponDateRange;
    dialogRef.componentInstance.mode = 'create';
    dialogRef.afterClosed().subscribe(result => {
      this.fixedProductBuyVariants = result != undefined ? result : [];
      if(this.fixedProductBuyVariants.length > 0){
        this.productselectionErrorMsg = false;
        console.log(this.fixedProductBuyVariants);       
      }
    });
  }

  public openCustomerGetVariantDialogue(startDate, endDate){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = "350px";
    dialogConfig.height = 'auto';
    dialogConfig.autoFocus = false;
    dialogConfig.panelClass = 'fixed-products-dialogue';
    let couponDateRange = {
      startDate: startDate,
      endDate : endDate
    }
    const dialogRef = this.dialog.open(CouponVariantDialogComponent, dialogConfig);
    dialogRef.componentInstance.selectedSkuProduct = this.fixedProductGetVariants;
    dialogRef.componentInstance.couponDateRange = couponDateRange;
    dialogRef.componentInstance.mode = 'create';
    dialogRef.afterClosed().subscribe(result => {
      this.fixedProductGetVariants = result != undefined ? result : [];
      if(this.fixedProductGetVariants.length > 0){
        this.productselectionErrorMsg = false;
        this.productGetVarinatsErrorMsg = false;
        console.log(this.fixedProductGetVariants);
      }
    });
  }
  public removeCustomerGetProductItem(index, type) {
    if (type === 'variantArray') {
      this.fixedProductGetVariants.splice(index, 1);
    }
  }
}
