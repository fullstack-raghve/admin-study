import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormControl, Validators, FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent, MatSnackBar } from '@angular/material';
import { HttpService } from 'src/app/services/http-service';
import { environment } from 'src/environments/environment';
import { selectStoreDialog } from '../../../../../shared/components/select-store-dialog/select-store.component';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig } from '@angular/material';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { UploadFile } from 'src/app/services/uploadFile.service';
import { SnackBarComponent } from 'src/app/shared/components/snack-bar/snack-bar.component';
import * as moment from 'moment';
import { Globals } from 'src/app/services/global';
import { ExtraValidators } from 'src/app/services/validator-service';
import { CategoryDialogComponent } from 'src/app/shared/components/category-dialog/category-dialog.component';
import { CouponProductsDialogComponent } from 'src/app/shared/components/coupon-products-dialog/coupon-products-dialog.component';
import { CouponVariantDialogComponent } from 'src/app/shared/components/coupon-variant-dialog/coupon-variant-dialog.component';

@Component({
  selector: 'edit-coupons',
  templateUrl: './edit-coupons.component.html',
  styleUrls: ['./edit-coupons.component.scss']
})
export class EditCouponsComponent implements OnInit {
  public breadCrumbData: Array<Object> = [{
    title: 'Marketing',
    link: ''
  }, {
    title: 'Coupons',
    link: '/search-coupons'
  }
  ];
  public searchStoreVal: boolean = false;
  // public alignCss = [];
  @ViewChild('uploadEl') uploadElRef: ElementRef;
  @ViewChild('uploadSku') uploadSkuRef: ElementRef;
  @ViewChild('uploadFile') uploadManualXLSFile: ElementRef;
  public panelOpenState = false;
  public checked = true;
  public imgUpload = false;
  public codeGeneration = 'GENERIC';
  public notificationType;
  public buttonVal = '';
  public id;
  public toggleVal;
  viewData
  public totalCount = 0;
  public selectedCount = 0;
  editCouponGroup: FormGroup;
  public buildFlag = false;
  public genericCodeValue = "";
  public imagePath = [];
  public filePathUrl = localStorage.getItem("imgBaseUrl");
  public errorFilePathUrl = localStorage.getItem("fileBaseUrl");
  public manualFileName = '';
  public manualFilePath = '';
  public skuFilePath = '';
  public skuFileName = '';
  public showError = false;
  public uploadFlag = [];
  public selectedStorearray = [];
  public skuErrorFile = '';
  public manualErrorFile = '';
  public manualErrorFileName = '';
  public submitForm = true;
  public skuRequired = false;
  public currenctDate;
  public currenctEndDate;
  public expirtTypeRequired = false;
  public expiryValueRequired = false;
  public manualFileRequired = false;
  public imageRequired = [];
  public validCouponCode = false;
  public validCouponRequired = false;
  public storeRequired = false;
  public skuErrorFileName = '';
  public alignCss = [];
  public langfield = [];
  public module = '';
  public validSkuFile = true;
  public validateSkuFile = false;
  public endDateError = null;
  public startDateError = null;
  public minEndDates;
  public dateError1: boolean = false;
  public dateError2: boolean = false;
  startDate: string;
  endDate: string;
  public currencyOids;
  public selectStoreVal = false;
  public dataStore: boolean = true;
  public storeErrorMsg;
  public rigionList = [];
  public storeCount: any = 5000;
  private _activeValue = "";
  public fileUrl = localStorage.getItem("fileBaseUrl");
  public isCouponLimitExceeded: boolean = false;
  public couponLimitErrMsg = "";
  public currencyOrderAmounts: any = [];
  public languageDirection = [];
  public langfieldname = [];
  loadingResponse: boolean = false;
  baseUrl: any = '';
  brandType = '';
  BrandList = [];
  public codeCount;
  public codeCountBool: boolean = false;

  public codeCountmanual;
  public codeCountmanualBool: boolean = false;
  public bogoSection: boolean = false;
  public showCouponPercentageIp: boolean = false;
  public couponBuys: any = [];
  public couponGets: any = [];
  public couponRegionAmounts: any = [];
  public couponBuysCategories: any = [];
  public couponBuysProducts: any = [];
  public fixedProductBuyVariants: any = [];
  public fixedProductGetVariants: any = [];
  public showFixedProductBogo: boolean = false;
  public offerAlertMsgLocale: any = [];
  public englishBuyAlertMsg: any = '';
  public englishGetAlertMsg: any = '';
  public arabicBuyAlertMsg: any = '';
  public arabicGetAlertMsg: any = '';
  public showMinCouponUse: boolean = false;
  public showRegionWiseCouponAmt: boolean = false;
  public couponGetsDiscountAmount: any = [];
  public productselectionErrorMsg: boolean = false;
  public productGetVarinatsErrorMsg: boolean = false;
  public _offerAlertMsgLocale:any = [];
  public discAmount: any = '';
  public datesValidationMsg: boolean = false;
  public cgdatesValidationMsg: boolean = false;

  constructor(private fb: FormBuilder,
    public dialog: MatDialog,
    private http: HttpService, private router: Router,
    private uploadFiles: UploadFile, public snackBar: MatSnackBar, private activatedRoute: ActivatedRoute) {
    this.currenctDate = new Date();
    this.minEndDates = new Date();
    // this.activatedRoute.params.subscribe((params) => {
    //   this.module = params.module;
    // });
    this.getLanguageList();
    this.getOnBoardingRegions();
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
      this.storeCount = res['totalCount'];
    });
  }
  ngOnInit() {

    let data = localStorage.getItem('CouponEditID');
    if (data) {
      this.module = data.split('-')[1];
      this.id = data.split('-')[0];
      this.getBrandList()
      this.getViewData();
      localStorage.removeItem('CouponEditID');
    } else {
      sessionStorage.clear();
      this.router.navigate(['/search-coupons']);
    }

  }


  setEndDate(formData) {

    //check expiry of start date after the user changed
    this.getCouponData();

    let startDate = moment(formData.startDate);
    let endDate = moment(formData.endDate);
    if (formData.startDate != null && formData.startDate != '') {
      if(this.module == 'clone'){
        if (moment(startDate) > moment(endDate)) {
          this.startDateError = true;
        } else {
           this.startDateError = false;
        }
      }else{
        this.startDateError = false;
      }
     
    }

    if (formData.endDate != null && formData.endDate != '') {
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

            this.snackBar.openFromComponent(SnackBarComponent, {
              duration: 1500,
              data: {
                status: "success",
                message: " image successfully uploaded"
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

  Url: any = '';
  couponImg(event) {
    if (event.target.files && event.target.files[0]) {
      this.imgUpload = true;
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = (event) => {
        this.Url = <string>reader.result;

      }
    }
  }

  public removeManualFile() {
    this.manualFileName = '';
    this.manualErrorFileName = '';
    this.manualFilePath = '';
  }

  public validateCodeGeneration(codeGenerationType) {

    let genericCodeValue = this.editCouponGroup.get('genericCodeValue');
    let uniqueCodeValue = this.editCouponGroup.get('uniqueCodeValue');
    let uniqueCodeType = this.editCouponGroup.get('uniqueCodeType')

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
    }
  }

  uploadManualCoupon(event: FileList) {
    //pick from one of the 4 styles of file uploads below
    this.uploadAndProgress(event, "manual");
  }

  uploadAndProgress(files: FileList, fileType: String) {

    //    var formData = new FormData();
    //    Array.from(files).forEach(f => formData.append('file',f))
    this.uploadFiles.uploadFileSku(files.item(0), 'coupon', 'files')
      .subscribe((response) => {
        if (fileType == 'manual') {
          this.manualFileRequired = false;
          this.validCouponCode = false;
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
          this.manualErrorFile = '';
          this.manualErrorFileName = '';
          this.uploadManualXLSFile.nativeElement.value = '';
        } else {
          this.skuFileName = files.item(0).name;
          // this.skuFilePath = response['message'];

          this.skuFilePath = response['filePath'];
          this.codeCount = response['codeCounts'];
          if (this.codeCount != 0) {
            this.codeCountBool = true;
          }
          else {
            this.codeCountBool = false;
          }
          
          this.submitForm = true;
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
              message: "File cannot be uploaded. Please try again later "
            }
          });
        }

      }
      )
  }
  uploadFile(event: FileList) {
    //pick from one of the 4 styles of file uploads below
    this.uploadAndProgress(event, "skuFile");
  }

  uploadFileList(files: File[]) {
    var formData = new FormData();
    Array.from(files).forEach(f => formData.append('file', f))
  }




  getOnBoardingRegions() {
    let GET_ALL_REGIONS = environment.APIEndpoint + "api/rpa/client/onboarding/v1/view";
    this.http.getJson(GET_ALL_REGIONS)
      .subscribe((response) => {
        this.currencyOids = response["regionList"].map(oid => oid.currencyOid);
        this.rigionList = response['regionList'];
        ///  this.addmMinOrderAmount();
        this.getCurrencyConversionValue(this.currencyOids);
      })
  }
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
          this.storeRequired = false;
        }
      }
    });
  }
  getViewData() {
    this.searchStoreVal = true;
    // this.id = this.router.url.split('edit-coupons/')[1];
    let data = {
      "couponId": parseFloat(this.id)
    }
    this.http.postJson(environment.APIEndpoint + "api/rpa/coupon/v3/view", data).subscribe((res) => {
      this.searchStoreVal = false;
      this.viewData = res;
      this.toggleVal = res["status"] == "ONLINE" ? true : false;
      this.checked = res['status'] == 'ONLINE' ? true : false;
      this.imgUpload = true;
      this.selectedCount = res["selectedStoreCount"];
      this.totalCount = res["totalStoreCount"];
      this.currencyOrderAmounts = res["minOrderAmounts"];
      
      this.codeCount = this.viewData.skuCounts;
      this.codeCountmanual = this.viewData.couponCodeCounts;
      if(this.viewData.couponGets != null){
        this.couponRegionAmounts = this.viewData.couponGets['couponGetsDiscountAmountList'] != null ? this.viewData.couponGets['couponGetsDiscountAmountList'] : [];
      }
      if(this.viewData.discountType == 'BUY_X_GET_Y' || this.viewData.discountType == 'BUY_X_GET_Z_DISCOUNT_AMOUNT_ON_Y_PRODUCT' || this.viewData.discountType == 'BUY_X_GET_Z_DISCOUNT_ON_Y_PRODUCT'){
        this.bogoSection = true;
        this.showCouponPercentageIp = this.viewData.discountType == 'BUY_X_GET_Z_DISCOUNT_ON_Y_PRODUCT' ? true : false;
        this.couponBuys = this.viewData.couponBuys;
        this.couponGets = this.viewData.couponGets;
        console.log(this.couponBuys);
        console.log(this.couponGets);
        if(this.module == "edit"){
          this.couponBuysCategories = this.couponBuys.couponBuysCategories != null ? this.couponBuys.couponBuysCategories : [];
          this.couponBuysProducts = this.couponBuys.couponBuysProducts != null ? this.couponBuys.couponBuysProducts : [];
          this.fixedProductBuyVariants = this.couponBuys.couponBuysProductsList != null ? this.couponBuys.couponBuysProductsList : [];
          this.fixedProductGetVariants = this.couponGets.couponGetsProducts != null ? this.couponGets.couponGetsProducts : [];
        }
        if(this.viewData.specificProduct){
          this.showFixedProductBogo = this.viewData.specificProduct;
          this.offerAlertMsgLocale = this.couponGets.couponOfferMessageLocale;
          let enBuyAlertMsg = this.offerAlertMsgLocale[0].buyMessage.replace('Buy', '');
          enBuyAlertMsg = enBuyAlertMsg.replace(this.couponBuys.quantity, '');
          this.englishBuyAlertMsg = enBuyAlertMsg.trim();
          let enGetAlertMsg = this.offerAlertMsgLocale[0].getMessage.replace('Get', '');
          enGetAlertMsg = enGetAlertMsg.replace(this.couponGets.quantity, '');
          this.englishGetAlertMsg = enGetAlertMsg.trim();
        }
      } else {
        this.bogoSection = false;
        this.showCouponPercentageIp = false;
      }

      if (this.codeCount!='' && this.codeCount != null){
        this.codeCountBool = true;
      }
      else{
        this.codeCountBool = false;
      }

      if (this.codeCountmanual!='' && this.codeCountmanual != null){
        this.codeCountmanualBool = true;
      }
      else{
        this.codeCountmanualBool = false;
      }

      //alert(JSON.stringify(this.currencyOrderAmounts));
      this.buildForm(this.viewData);

      for (let prod of this.viewData["couponLocales"]) {
        // this.alignCss.push(prod.direction == 'RTL' ? 'text-right' : '');
        // this.langfield.push(prod.direction == 'RTL' ? 'lang-field-right' : '');
        this.alignCss.push(prod.direction == 'RTL' ? 'text-right' : '');
        this.langfield.push(prod.direction == 'RTL' ? 'lang-field-right' : ''); 
         this.languageDirection.push(prod.direction == 'RTL' ? 'direction' : '');
        this.langfieldname.push(prod.direction == 'RTL' ? 'direction' : '');
      }

    },
      (error) => {
        console.log(error);
        this.searchStoreVal = true;
      }
    )
  }
  public languages: any = [];
  getLanguageList() {
    let GET_ALL_LANGUAGES = environment.APIEndpoint + "api/rpa/master/language/v1/list";
    this.http.getJson(GET_ALL_LANGUAGES)
      .subscribe((response) => {
        this.languages = response;
      })
  }
  public removeSku() {
    this.skuFileName = '';
    this.skuErrorFileName = '';
    this.skuFilePath = null;
    this.codeCountBool = false;
  }
  public buildForm(viewData) {
    if (this.module == "edit") {
      this.buttonVal = "UPDATE";
    } else {
      this.buttonVal = "ADD";
    }

    if (viewData.length == 0) {
      let form = {
        couponLocales: this.fb.array([]),
        regionCouponAmount: this.fb.array([]),
        minOrderAmounts: this.fb.array([])
      }
      this.editCouponGroup = this.fb.group(form);
    } else {
      console.log(viewData)

      this.buildFlag = true;
      let uniqueCodeValue = '';
      let fileCodeValue = '';
      let codeType = '';
      let brandId = '';

      console.log(viewData['brands']);


      if (viewData['brands'].length > 0) {
        // this.amenityFormGroup.get('brand').patchValue(response['brandOid'].toString());
        brandId = viewData['brands'][0]['brandId'].toString();
      }
      else {
        brandId = '';
      }

      

      this.notificationType = viewData.notificationType;
      this.validCouponCode = true;
      this.validSkuFile = true;
      if (this.module == "edit") {
        if (viewData.codeGenerationType == "GENERIC") {
          this.genericCodeValue = viewData.codeValue;
          this.codeGeneration = "GENERIC"
          codeType = "FIXED";
        } else if (viewData.codeGenerationType == "UNIQUE") {
          uniqueCodeValue = viewData.codeValue;
          this.codeGeneration = "UNIQUE"
          codeType = viewData.codeType;
        } else if (viewData.codeGenerationType == "MANUAL") {
          fileCodeValue = viewData.codeValue;
          this.codeGeneration = "MANUAL"
          codeType = viewData.codeType;
          this.manualFileName = viewData.codeValue.split("/").pop();
          this.manualFilePath = viewData.codeValue;
        }
      }

      if (viewData.skuFilePath != null && viewData.skuFilePath != '' && viewData.skuFilePath != undefined) {
        this.skuFilePath = viewData.skuFilePath;
        this.skuFileName = viewData.skuFilePath.split("/").pop();
      }

      // let brandId;
      // if (viewData.brands != null || viewData.brands != undefined) {
      //   brandId = viewData.brands.map(function (item) {
      //       return item.brandId;
      //     })
      //   }
      this.brandType = viewData.brandType != undefined ? viewData.brandType : '';
      if(viewData.couponGets != null){
        this.showMinCouponUse = viewData.couponGets.minCouponUsePerOffer != null ? true : false;
      }
      if(this.module == "clone" && viewData.couponBuys != null){
        viewData.couponBuys.buyFrom = '';
        viewData.couponGets.getFrom = '';
      }
      this.editCouponGroup = this.fb.group({
        couponLocales: this.fb.array([]),
        minOrderAmounts: this.fb.array([]),
        regionCouponAmount: this.fb.array([]),
        discountType: [viewData.discountType != undefined ? viewData.discountType : '', Validators.compose([Validators.required])],
        discountValue: [viewData.discountValue, Validators.compose([Validators.required, Validators.pattern('^([0-9]{0,3})(\\.[0-9]{1,2})?$')])],
        startDate: [viewData.startDate, Validators.compose([Validators.required])],
        endDate: [viewData.endDate, Validators.compose([Validators.required])],
        expiryValue: [viewData.expiryValue],
        expiryType: [viewData.expiryType],
        internalComment: [viewData.internalComment, Validators.compose([Validators.maxLength(250), Validators.pattern(Globals.regCustomwhiteList)])],
        internalCouponTitle: [viewData.internalCouponTitle],
        notificationType: [viewData.notificationType],
        codeGeneration: [viewData.codeGenerationType],
        genericCodeValue: [this.genericCodeValue,],
        uniqueCodeValue: [uniqueCodeValue,],
        uniqueCodeType: [codeType],
        couponUsageLimit: [viewData.couponUsageLimit, Validators.compose([Validators.required, Validators.pattern('^([0-9]{0,8})?$')])],
        usageLimitPerCustomer: [viewData.usageLimitPerCustomer],
        couponUsageBy: [viewData.couponUsageBy],
        brandOids: brandId != undefined ? brandId : '',
        channelType: viewData.channelType != undefined ? viewData.channelType : '',
        couponType: viewData.couponType != undefined ? viewData.couponType : '',
         brandType:this.brandType,
         customerBuysQuantity: [viewData.couponBuys != null ? viewData.couponBuys.quantity : '', Validators.compose([ExtraValidators.conditional(
          group => this.bogoSection == true,
          Validators.required),Validators.pattern('^[1-9][0-9]*')])],
        customerGetsQuantity: [viewData.couponGets != null ? viewData.couponGets.quantity : '', Validators.compose([ExtraValidators.conditional(
          group => this.bogoSection == true,
          Validators.required),Validators.pattern('^[1-9][0-9]*')])],
        customerBuysProduct: [viewData.couponBuys != null ? viewData.couponBuys.buyFrom : '', Validators.compose([ExtraValidators.conditional(
          group => this.bogoSection == true,
          Validators.required,
        )])],
        minCouponUsePerOffer: [viewData.couponGets != null ? viewData.couponGets.minCouponUsePerOffer : '', Validators.compose([ExtraValidators.conditional(
          group => this.showMinCouponUse == true,
          Validators.required),Validators.pattern('^[1-9][0-9]*')])],
        couponGetsPercentage:[ viewData.discountType == 'BUY_X_GET_Z_DISCOUNT_ON_Y_PRODUCT' ? viewData.discountValue : '',  Validators.compose([ExtraValidators.conditional(
          group => this.showCouponPercentageIp == true,
          Validators.required),Validators.pattern('^[1-9][0-9]*')])],
          customerGetsProduct:[viewData.couponGets != null ? viewData.couponGets.getFrom : '', Validators.compose([ExtraValidators.conditional(
            group => this.showFixedProductBogo == true, Validators.required)])],
          enBuyAlertMsg: [this.englishBuyAlertMsg, Validators.compose([ExtraValidators.conditional(
            group => this.showFixedProductBogo == true, Validators.required)])],
          enGetAlertMsg: [this.englishGetAlertMsg, Validators.compose([ExtraValidators.conditional(
            group => this.showFixedProductBogo == true, Validators.required)])],
        })
      // console.log(this.editCouponGroup.get('brandOids').value)

      // this.dateError1 = startDate > endDate || startDate < date ? true : false;
      // this.dateError2 = endDate < startDate || endDate < date ? true : false;

      if (this.module == "edit") {
        for (let couponLocale of viewData.couponLocales) {
          const control = <FormArray>this.editCouponGroup.controls['couponLocales'];
          let newGroup = this.fb.group({
            couponTitle: [couponLocale.couponTitle, Validators.compose([Validators.required, Validators.maxLength(40), Validators.pattern(Globals.regCustomwhiteList)])],
            description: [couponLocale.couponDescription, Validators.compose([Validators.required])],
            termsAndCondition: [couponLocale.termsAndCondition, Validators.compose([Validators.required])]
          });
          control.push(newGroup);
        }
      } else {
        for (let couponLocale of viewData.couponLocales) {
          const control = <FormArray>this.editCouponGroup.controls['couponLocales'];
          let newGroup = this.fb.group({
            couponTitle: ["", Validators.compose([Validators.required, Validators.maxLength(40), Validators.pattern(Globals.regCustomwhiteList)])],
            description: [couponLocale.couponDescription, Validators.compose([Validators.required])],
            termsAndCondition: [couponLocale.termsAndCondition, Validators.compose([Validators.required])]

          });
          control.push(newGroup);
        }
      }

      for (let minOrderAmount of this.currencyOrderAmounts) {
        const control = <FormArray>this.editCouponGroup.controls['minOrderAmounts'];
        console.log(minOrderAmount.orderAmount);
        let newGroup = this.fb.group({
          orderAmount: [minOrderAmount.orderAmount.toString(), Validators.compose([Validators.pattern('^([0-9]{1,19})(\\.[0-9]{1,3})?$')])]
        });
        control.push(newGroup);
      }

      if(this.couponRegionAmounts.length > 0){
        for (let couponAmount of this.couponRegionAmounts) {
          const control = <FormArray>this.editCouponGroup.controls['regionCouponAmount'];
          console.log(couponAmount.discountAmount);
          let newGroup = this.fb.group({
            couponAmount: [couponAmount.discountAmount.toString(), Validators.compose([ExtraValidators.conditional(group => this.showRegionWiseCouponAmt == true, Validators.required),Validators.maxLength(8), Validators.pattern('^([1-9]|[0-9]{1,4})(\\.[0-9]{1,2})?$')])]
          });
          control.push(newGroup);
        }
      }

      for (let i = 0; i < viewData.couponLocales.length; i++) {
        this.imagePath.push(viewData.couponLocales[i].imagePath);
        this.uploadFlag[i] = true;
      }

      for (let i = 0; i < viewData.couponStores.length; i++) {
        this.selectedStorearray.push(viewData.couponStores[i].storeId);
      }

    }
    this.getCouponData();
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
  //   getBrandList(){
  //     let GET_ALL_ONLINE_BRANDS = environment.APIEndpoint + "api/rpa/store/v1/get/storeBrands";
  //     this.http.getJson(GET_ALL_ONLINE_BRANDS)
  //       .subscribe((response) => {
  //          this.brandList = response;      
  //           this.brandList.forEach(res => {
  //             this.BrandList.push({
  //               "brandId": res.brandId,
  //               "brandName": res.brandName,
  //               "value" : res.brandId

  //           });
  //         })          
  //         },
  //         (error) => {
  //           console.log(error);
  //         });
  //         var valuesArray = this.removeDuplicatesJSON(this.BrandList, 'storeTypeOid');
  //         this.BrandList = valuesArray;
  // }

  // getStoreListData(){
  //     let StoreTypeList = environment.APIEndpoint + "api/rpa/store/v1/get/storeTypes";
  //        this.http.getJson(StoreTypeList)
  //        .subscribe((response) => {
  //         this.StoreTypeList=response;
  //         //  this.malls = response;
  //          this.StoreTypeList.forEach(res => {
  //            this.StoreTypeList1.push({
  //              "storeTypeOid": res.storeTypeOid,
  //              "storeTypeValue": res.storeTypeValue,
  //              "value" : res.storeTypeOid

  //          });
  //        })
  //         });
  //         var valuesArray = this.removeDuplicatesJSON(this.StoreTypeList1, 'storeTypeOid');
  //         this.StoreTypeList1 = valuesArray;
  //      }
  public getCouponData() {
    this.startDate = moment(this.editCouponGroup.get('startDate').value).format('DD-MM-YYYY');
    this.endDate = moment(this.editCouponGroup.get('endDate').value).format('DD-MM-YYYY');

    let d1 = moment(new Date(this.editCouponGroup.get('startDate').value)).format('YYYY-MM-DD');
    let d2 = moment(new Date(this.editCouponGroup.get('endDate').value)).format('YYYY-MM-DD');
    let date = moment(new Date()).format('YYYY-MM-DD');

    this.dateError1 = d1 < date ? true : false;
    this.dateError2 = d2 < d1 || d2 < date ? true : false;
  }
  onChange(event, group) {
    if (this._activeValue === event.value) {
      group.value = "";
      this._activeValue = "";
    } else {
      this._activeValue = event.value;
    }
  }
  public expiryMinValidation: any = "";

   // removeEmptyValue(ev){
  //   console.log(ev.target.value);
  //   if (ev.target.value==''){
  //     let expiryType = this.couponFormGroup.get('expiryType').setValue('');
  //   }
  // }

  public validateExpiryType() {
    let expiryValue = this.editCouponGroup.get('expiryValue');
    let expiryType = this.editCouponGroup.get('expiryType');
    if (expiryValue.value != null && (expiryType.value == null || expiryType.value == "")) {
      // expiryType.setValidators([Validators.required]);
      // expiryType.updateValueAndValidity();
    } else if ((expiryValue.value == null || expiryValue.value == "") && (expiryType.value != null || expiryType.value != "")) {
      expiryType.clearValidators();
      expiryType.updateValueAndValidity();
      expiryValue.clearValidators();
      expiryValue.updateValueAndValidity();
    } else if ((expiryValue.value == null || expiryValue.value == "") && (expiryType.value == null || expiryType.value == "")) {
      expiryType.clearValidators();
      expiryType.updateValueAndValidity();
      expiryValue.clearValidators();
      expiryValue.updateValueAndValidity();
    } else {
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
        expiryValue.setValidators([Validators.maxLength(3), Validators.pattern('^([0]{0,2}[1-9]|[0]?[1-9][0-9]|[12][0-9][0-9]|3[0-5][0-9]|36[0-5])$')]);
        expiryValue.updateValueAndValidity();
        this.expiryMinValidation = "Allowed is upto 365 Days";
      }
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

  updateCoupon(formData) {
    let required = false;
    let skuValidated = false;
    let limitExceeded = false;
    limitExceeded = this.ValidateUsageLimit();
    if (this.selectedStorearray.length == 0) {
      this.storeRequired = true;
      required = true;
    }

    if ((this.skuFilePath == '' || this.skuFilePath == undefined) && (formData.discountType == 'ITEM_DISCOUNT' || formData.discountType == 'ITEM_DISCOUNT_AMOUNT')) {
      skuValidated = true;
      this.skuRequired = true;
    } 
    if (!this.validSkuFile) {
      this.validateSkuFile = true;
      skuValidated = true;
    }

    if (this.editCouponGroup.invalid == true || required || skuValidated || limitExceeded) {
      this.showError = true;
    } else {

      if (formData.codeGeneration == 'MANUAL' && this.manualFilePath == '') {
        this.manualFileRequired = true;
        this.submitForm = false;
      } else {
        this.manualFileRequired = false;
        this.submitForm = true;
      }

      for (var i = 0; i < this.uploadFlag.length; i++) {
        if (this.uploadFlag[i] == false) {
          this.imageRequired[i] = true;
        } else {
          this.imageRequired[i] = false;
        }
      }


      if (!this.validCouponCode && !this.manualFileRequired && formData.codeGeneration == 'MANUAL') {
        this.validCouponRequired = true;
      } else {
        this.validCouponCode = true;
      }

      if (this.submitForm && this.validCouponCode && this.validSkuFile && this.imagePath.length != 0) {
        this.showError = false;

        let couponLocals = [];
        for (var i = 0; i < formData.couponLocales.length; i++) {
          let obj = {
            languageId: this.viewData.couponLocales[i].languageId,
            couponTitle: formData.couponLocales[i].couponTitle,
            couponDescription: formData.couponLocales[i].description,
            imagePath: this.imagePath[i],
            termsAndCondition: formData.couponLocales[i].termsAndCondition,
          }
          couponLocals.push(obj);
        }

        let minOrdersArr = [];

        for (var i = 0; i < formData.minOrderAmounts.length; i++) {
          let amt = formData.minOrderAmounts[i].orderAmount
          let minOrder = {
            regionId: this.viewData.minOrderAmounts[i].regionId,
            orderAmount: amt.toString(),
          }
          minOrdersArr.push(minOrder);
        }

        if(this.bogoSection && this.editCouponGroup.get('discountType').value == 'BUY_X_GET_Z_DISCOUNT_AMOUNT_ON_Y_PRODUCT'){
          for (var i = 0; i < formData.regionCouponAmount.length; i++) {
            let temp = formData.regionCouponAmount[i].couponAmount
            let couponAmt = {
              regionId: this.couponRegionAmounts[i].regionId,
              discountAmount: temp.toString(),
            }
            this.couponGetsDiscountAmount.push(couponAmt);
          }
        }

        let couponCodeType = '';
        let couponCodeValue = '';

        if (formData.codeGeneration == 'GENERIC') {
          couponCodeType = 'FIXED';
          couponCodeValue = formData.genericCodeValue;
        } else if (formData.codeGeneration == 'UNIQUE') {
          couponCodeType = formData.uniqueCodeType;
          couponCodeValue = formData.uniqueCodeValue;
        } else if (formData.codeGeneration == 'MANUAL') {
          couponCodeType = 'FILEUPLOAD';
          couponCodeValue = this.manualFilePath;
        }
        let couponId = 0;
        let UPDATE_COUPON = '';

        if (this.module == "clone") {
          couponId = null;
          UPDATE_COUPON = environment.APIEndpoint + "api/rpa/coupon/v3/create"
        } else if (this.module == "edit") {
          couponId = parseFloat(this.id);
          UPDATE_COUPON = environment.APIEndpoint + "api/rpa/coupon/v3/update"
        }
        let brandOid = [];
        if(formData.brandOids!=''){
         
          brandOid.push(JSON.parse(formData.brandOids));
        }
      
        if(this.bogoSection){
          if(this.couponBuysProducts.length === 0 && this.couponBuysCategories.length === 0 && this.fixedProductBuyVariants.length === 0){
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
            }
          ]
        } else {
          this._offerAlertMsgLocale = [];
        }
        let selectedCategoryIds = [];
        let selectedProductIds = [];
        selectedCategoryIds = this.couponBuysCategories.map(item => item.categoryId);
        selectedProductIds = this.couponBuysProducts.map(item => item.productOid);
        console.log(selectedCategoryIds);
        console.log(selectedProductIds);

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
        console.log(customerGetFixedProducts);
        
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
        console.log(formData.discountValue);
        if(this.editCouponGroup.get('discountType').value == 'BUY_X_GET_Z_DISCOUNT_ON_Y_PRODUCT'){
          this.discAmount = formData.couponGetsPercentage;
        }else if(this.editCouponGroup.get('discountType').value == 'BUY_X_GET_Y'){
          this.discAmount = 100;
        } else if(this.editCouponGroup.get('discountType').value == 'BUY_X_GET_Z_DISCOUNT_AMOUNT_ON_Y_PRODUCT'){
          this.discAmount = 10;
        }
            
        let updateCouponBody = {
          couponId: couponId,
          discountType: formData.discountType,
          discountValue: this.discAmount != '' ? this.discAmount : formData.discountValue,
          startDate: moment(formData.startDate).format('YYYY-MM-DD'),
          endDate: moment(formData.endDate).format('YYYY-MM-DD'),
          expiryValue: formData.expiryValue != '' ? formData.expiryValue : null,
          expiryType: formData.expiryType != '' ? formData.expiryType : null,
          internalComment: formData.internalComment,
          internalCouponTitle: formData.internalCouponTitle,
          notificationType: formData.notificationType,
          status: this.toggleVal == true ? 'ONLINE' : 'OFFLINE',
          displayOnDashboard: true,
          couponLocales: couponLocals,
          codeGenerationType: formData.codeGeneration,
          codeType: couponCodeType,
          codeValue: couponCodeValue,
          minOrderAmounts: minOrdersArr,
          couponUsageLimit: formData.couponUsageLimit,
          usageLimitPerCustomer: formData.usageLimitPerCustomer,
          couponUsageBy: formData.couponUsageBy,
          // skuFilePath: this.skuFilePath != '' ? this.skuFilePath : '',
          skuFilePath: this.skuFilePath,
          couponStoreIds: this.selectedStorearray,
          brandOids: brandOid,
          channelType: formData.channelType != '' ? formData.channelType : null,
          couponType: formData.couponType != '' ? formData.couponType : null,
          brandType: this.brandType != '' ? this.brandType : null,
          specificProduct : this.showFixedProductBogo,
          couponBuys: this.bogoSection == true ? couponBuysDetails : null,
          couponGets: this.bogoSection == true ? couponGetsDetails : null,
        }
        this.loadingResponse = true;
        this.http.postJson(UPDATE_COUPON, updateCouponBody)
          .subscribe((response) => {
            this.loadingResponse = false;
            this.snackBar.openFromComponent(SnackBarComponent, {
              duration: 10000,
              data: {
                status: "success",
                message: "Coupon details have been updated"
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

  public removeImage(index) {
    this.imagePath[index] = "";
    this.uploadFlag[index] = false;

  }

  validateCouponCodes() {
    if (null != this.manualFilePath && this.manualFilePath != '') {
      this.validCouponRequired = false;
      let request = {
        filePath: this.manualFilePath,
        couponOid: parseFloat(this.id)
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
                message: "Unable to validate the file"
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
    this.skuRequired = false;
    this.validateSkuFile = false;
    this.uploadSkuRef.nativeElement.value = null;
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
      for (let i = 0; i < this.currencyOrderAmounts.length; i++) {
        for (let conversion of this.conversionList) {
          const array = <FormArray>this.editCouponGroup.controls['minOrderAmounts'];
          if (conversion.currencyCode === this.currencyOrderAmounts[i].currencyCode && i != 0) {
            let conversionValue = conversion.conversionValue * parseInt(currencyValue);
            array.at(i).patchValue({
              orderAmount: [conversionValue.toFixed(3)]
            });
            array.markAsPristine;
          }
        }
      }
    }
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

  public ValidateUsageLimit() {
    let couponUsageLimit = this.editCouponGroup.get('couponUsageLimit').value;
    let usageLimitPerCustomer = this.editCouponGroup.get('usageLimitPerCustomer').value;
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

  isFixedProductBogo(value){
    this.showFixedProductBogo = value == true ? true : false;
    if(!this.showFixedProductBogo){
      this.editCouponGroup.patchValue(
        { enBuyAlertMsg: '',
          enGetAlertMsg: '',
          customerGetsProduct: '',
          customerBuysProduct: ''
        })
      this.fixedProductBuyVariants = [];
      this.fixedProductGetVariants = [];
    }
  }

  public openProductOrCategory(productFrom): void {
    if ((this.editCouponGroup.get('startDate').value != '' && this.editCouponGroup.get('startDate').value != 'Invalid date') &&
       (this.editCouponGroup.get('endDate').value != '' && this.editCouponGroup.get('endDate').value != 'Invalid date')) {
      this.datesValidationMsg = false;
      if (productFrom === 'CATEGORY') {
        this.openCategoryDialog((moment(this.editCouponGroup.get('startDate').value).format('YYYY-MM-DD')), moment(this.editCouponGroup.get('endDate').value).format('YYYY-MM-DD'));
      } else if (productFrom === 'PRODUCT' && !this.showFixedProductBogo) {
        this.openProductDialog((moment(this.editCouponGroup.get('startDate').value).format('YYYY-MM-DD')), moment(this.editCouponGroup.get('endDate').value).format('YYYY-MM-DD'));
      } else if (productFrom === 'PRODUCT' && this.showFixedProductBogo) {
        this.openCustomerBuyVariantDialogue((moment(this.editCouponGroup.get('startDate').value).format('YYYY-MM-DD')), moment(this.editCouponGroup.get('endDate').value).format('YYYY-MM-DD'));
      }
    } else {
      this.datesValidationMsg = true;
    }
  }
  public selectFixedProducts(value): void {
    if ((this.editCouponGroup.get('startDate').value != '' && this.editCouponGroup.get('startDate').value != 'Invalid date') &&
       (this.editCouponGroup.get('endDate').value != '' && this.editCouponGroup.get('endDate').value != 'Invalid date')
       ) {
      this.cgdatesValidationMsg = false;
      if (value === 'PRODUCT') {
        this.openCustomerGetVariantDialogue((moment(this.editCouponGroup.get('startDate').value).format('YYYY-MM-DD')), moment(this.editCouponGroup.get('endDate').value).format('YYYY-MM-DD'));
      } 
    } else {
      this.cgdatesValidationMsg = true;
    }
  }
  public removeBogoItem(index, type) {
    if (type === 'productArray') {
      this.couponBuysProducts.splice(index, 1);
    } else if (type === 'categoryArray') {
      this.couponBuysCategories.splice(index, 1);
    } else if (type === 'variantArray') {
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
    } else if( value === 'PRODUCT' && this.showFixedProductBogo){
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
    dialogRef.componentInstance.mode = 'edit';
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
    dialogRef.componentInstance.mode = 'edit';
    dialogRef.afterClosed().subscribe(result => {
      this.couponBuysProducts = result != undefined ? result : [];
      if(this.couponBuysProducts.length > 0){
        this.productselectionErrorMsg = false;
      }
    });
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
    dialogRef.componentInstance.mode = 'edit';
    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      
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
    dialogRef.componentInstance.mode = 'edit';
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

  checkMinCouponUse(value){
    if(value){
      this.showMinCouponUse = true;
    } else{
      this.showMinCouponUse = false;
    }
  }
}
