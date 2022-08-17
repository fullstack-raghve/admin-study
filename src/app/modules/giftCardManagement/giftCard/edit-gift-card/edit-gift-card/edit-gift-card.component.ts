import { Component, OnInit, ViewChild } from '@angular/core';
import { SnackBarComponent } from '../../../../../shared/components/snack-bar/snack-bar.component';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { HttpService } from '../../../../../services/http-service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { UploadFile } from '../../../../../services/uploadFile.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { SelectGiftcardTemplateComponent } from "../../select-giftcard-template/select-giftcard-template.component";
import { environment } from '../../../../../../environments/environment';
import { addCouponDialog } from '../../../../../shared/components/coupon-dialog/add-coupon.component';
import { productsDialog } from '../../../../../shared/components/products-dialog/products-dialog.component';
import * as moment from 'moment';
import { SkuDialogComponent } from "../../sku-dialog/sku-dialog.component";
import { selectStoreDialog } from 'src/app/shared/components/select-store-dialog/select-store.component';
@Component({
  selector: 'edit-gift-card',
  templateUrl: './edit-gift-card.component.html',
  styleUrls: ['./edit-gift-card.component.scss']
})
export class EditGiftCardComponent implements OnInit {
  @ViewChild('myselect') myselect;
  public breadCrumbData: Array<Object> = [{
    title: 'Home',
    link: ''
  },
  {
    title: 'Gift Cards Management',
    link: ''
  },
  {
    title: 'Gift Card',
    link: '/search-card-template'
  }
  ];
  secondCon:boolean=false
  DateValue;
  DaysValue;
  keywordError:boolean=false;
  public toggleVal: boolean = true;
  public statusValue: string = '';
  public imageUploading = false;
  public imagePath = '';
  public filePathUrl = localStorage.getItem('imgBaseUrl');
  public giftFormGroup: FormGroup;
  public languageList = JSON.parse(localStorage.getItem("languageList"));
  alignCss = [];
  public showImageError: boolean = false;
  TemplateFor;
  backgroundColor = '';
  textColor: any;
  logoImage: any;
  backgroundImage = '';
  textMessage: any;
  headingMessage2: any;
  headingMessage1: any;
  CurrencyCode = [];
  keywords = [];
  keywordStatus: boolean = true;  // dialog: any;
  public selectedStore = [];
  public totalCount: [];
  public programBrand;
  public brandOid: number = 0;
  public selectedStoreCount = 0;
  public storeRequired: boolean = false;

  templateId: any;
  ValType = '';
  public selectedSkuCount = 0;
  public showSkuFileError: boolean = false;
  public selectedProduct = [];
  public programId = 0;
  public skuLabel = 'Upload';
  public skuFile = '';
  public skuFileName = "";
  public skuToggleVal = true;
  public productErrorMsg;
  brandId: any = [];
  public minDate = new Date();
  SKUCodeArray = [];
  storeCount: any;
  selectedCount: any;
  GiftCardID: any;
  viewData = {}
  PublishStatus: any;
  termsConditionError: boolean;
  totalProductCount: any;
  selectedProductCount: any;
  public selectStoreVal: boolean = false;
  public selectStoreVal1: boolean = false;
  public dataStore: boolean = false;
  public dataStore1: boolean = false;
  public Editable = true;
  isMarkDefault: boolean = false;
  loadingResponse = true;
  MinValCondition: boolean=false;
  minValueError=false;
  CheckDate = false;
  statusUpdate: any;
  minvalue: any;
  skuxslFileNameUrl: any;
  SKUCODEurl: any;
  skuXslFileName: any;
  viewSKU=[]
  constructor(private fb: FormBuilder, private http: HttpService, private activatedRoute: ActivatedRoute,
    private router: Router, public snackBar: MatSnackBar, private uploadFile: UploadFile, public dialog: MatDialog) {
    let data = {
      "order": {
        "column": "modifiedTime",
        "dir": "desc"
      },
      "keySearch": "",
      "fieldSearch": [
      ]
    }
    this.http.postJson(environment.APIEndpoint + 'api/rpa/store/v1/getAll', data).subscribe(res => {
      this.totalCount = res["totalCount"];
      this.storeCount = res['totalCount'];
      this.selectedCount = res["totalCount"];
      // console.log(res)
    });
    let data1 = {
      languageCode: "EN"
    }
    let TEMPURL = 'https://cupilfuhfg.execute-api.ap-south-1.amazonaws.com/gcadmin_sit/rest/api/v1/gcadmin/prdouct_sku';
    this.http.postCustomizeJson(TEMPURL, data1)
      .subscribe((response) => {

        // console.log(JSON.stringify(response))
        this.totalProductCount = response["Output"].length;

      })
    this.activatedRoute.params.subscribe((params) => {
      this.GiftCardID = params['id'];
      console.log(this.GiftCardID);

    });

  }

  // constructor(private fb: FormBuilder, private http: HttpService, private activatedRoute: ActivatedRoute,
  //   private router: Router, public snackBar: MatSnackBar, private uploadFile: UploadFile, ){
  //     this.activatedRoute.params.subscribe((params) => {
  //       this.GiftCardID = params['id'];
  //       console.log(this.GiftCardID);

  //     });
  //   }

  ngOnInit() {

    this.getCardData();

  }

  buildGiftForm() {
    // console.log(this.viewData);
    let form = {
      giftLanguageList: this.fb.array([]),
      conditionArray: this.fb.array([]),
      valueType: [this.viewData['valueType'], Validators.compose([Validators.required])],
      cardFor: [this.viewData['cardFor'], Validators.compose([Validators.required])],
      keywords: [""],
      prefix: [this.viewData['prefix'], Validators.compose([Validators.required,Validators.pattern("[a-zA-Z0-9\s]*$")])],
      suffix: [this.viewData['suffix'], Validators.compose([Validators.required,Validators.pattern("[a-zA-Z0-9\s]*$")])],
      minVal: [this.viewData['minVal']],
      maxVal: [this.viewData['maxVal']],
      discount: [this.viewData['discount']],
      additionalCharge: [this.viewData['additionalCharges']],
      cardUsageType: [this.viewData['cardUsageType'], Validators.compose([Validators.required])],
      couponId: [this.viewData['couponId'], Validators.compose([Validators.required])],
      couponTitile: [this.viewData['couponTitle']],
      // viewData.country.countryOid.toString(),Validators.compose([Validators.required])
      Currency: [this.viewData['currencyOid'].toString(), Validators.compose([Validators.required])],
      oneProductCost: [this.viewData['costOfOne'],Validators.compose([Validators.required,Validators.minLength(1),Validators.pattern("^[1-9][0-9]*")])],
      noOfDay: [this.viewData['noOfDay']],
      templateId: [this.viewData['templateId'], Validators.compose([Validators.required])],
      productName: [this.viewData['productName']],
      CurrencyID: [this.viewData['currencyOid'], Validators.compose([Validators.required])],
      maxTxnPerDay: [this.viewData['maxTxnPerDay']],
      maxTxnValuePerDay: [this.viewData['maxTxnValuePerDay']],
      expiryDate: [this.viewData['expiryDate']],
      productId: [this.viewData['productId'], Validators.compose([Validators.required])],
      mappedProductIds: [this.viewData['mappedProductIds'], Validators.compose([Validators.required])],
      publishDate: [this.viewData['publishDate'], Validators.compose([Validators.required])],
      SKUCODE:[this.viewSKU],
      expiryDateIn: [this.viewData['expiryDateIn']],
      isMarkDefault: [''],
      
      
    }
    this.templateId = this.viewData['templateId'];
    this.giftFormGroup = this.fb.group(form);
    if (this.viewData['AmountType'] == 'BOTH') {
      this.isMarkDefault = true;
      this.Editable = false;
      this.giftFormGroup.controls['isMarkDefault'].patchValue(true);
    }
    this.loadingResponse = false;
console.log(form);
    if(this.viewData['minVal']!='' && this.viewData['maxVal']!=''){
      this.isMarkDefault = true;
    }
  }
  getFileTypeStatus(value) {
    this.ValType = value;
    this.giftFormGroup.get('mappedProductIds').reset();
    this.giftFormGroup.get('productId').reset();
    this.giftFormGroup.get('productName').reset();
    this.giftFormGroup.get('oneProductCost').reset();
    this.giftFormGroup.get('SKUCODE').reset();
    this.SKUCODEurl=''
    this.skuXslFileName=''
    this.SKUCodeArray=[];
  }
  checkExpiry(value) {
    this.giftFormGroup.get('expiryDateIn').patchValue(value);
    if (value == 'DATE') {
      let expiryDate = this.giftFormGroup.get('expiryDate');
      expiryDate.setValidators([Validators.required]);
      expiryDate.updateValueAndValidity();
      this.giftFormGroup.get('noOfDay').clearValidators();
      this.giftFormGroup.get('noOfDay').reset();
    } else {
      let noOfDay = this.giftFormGroup.get('noOfDay');
      noOfDay.setValidators([Validators.required]);
      noOfDay.updateValueAndValidity();
      this.giftFormGroup.get('expiryDate').clearValidators();
      this.giftFormGroup.get('expiryDate').reset();
    }
  }
  CheckAmountType(event) {
    if (event.checked) {
      this.Editable = false;
      this.isMarkDefault = true;
      let minVal = this.giftFormGroup.get('minVal');
      let maxValue = this.giftFormGroup.get('maxVal')
      minVal.setValidators([Validators.required]);
      minVal.updateValueAndValidity();
      maxValue.setValidators([Validators.required]);
      maxValue.updateValueAndValidity();
      //  console.log(this.giftFormGroup.get('keywords').value);
      this.giftFormGroup.get('keywords').clearValidators();
      this.giftFormGroup.get('keywords').updateValueAndValidity();
      this.giftFormGroup.get('keywords').reset();
      
    } else {
      this.Editable = true;
      this.isMarkDefault = false;
      this.giftFormGroup.get('maxVal').clearValidators();
      this.giftFormGroup.get('minVal').clearValidators();
      this.giftFormGroup.get('minVal').reset();
      this.giftFormGroup.get('maxVal').reset();
      this.MinValCondition=false;
      if(this.keywords.length<0){
        let keywords = this.giftFormGroup.get('keywords')
        keywords.setValidators([Validators.required]);
        keywords.updateValueAndValidity();  
       }
       if(this.keywords.length>0){
        let keywords = this.giftFormGroup.get('keywords')
        keywords.clearValidators();
        keywords.updateValueAndValidity();  
       }

    }

  }
  //giftcard language

  getCardData() {

    let data = {
      "languageCode": "en",
      "cardId": this.GiftCardID

    }

 
    this.http.postCustomizeJson('https://cupilfuhfg.execute-api.ap-south-1.amazonaws.com/gcadmin_sit/rest/api/v1/gcadmin/view_selected_gift_card_details', data).subscribe(res => {
    console.log(JSON.stringify(res));
      this.viewData = res['Output'];
      console.log(JSON.stringify(this.viewData));
      this.SKUCODEurl=this.viewData['upload_product_url'];
      this.skuXslFileName=this.viewData['uploadFileName'];
      this.statusValue =  res['Output']["status"];
      this.toggleVal = res['Output']["status"] == 'ONLINE' ? true : false;
      this.viewSKU=res['Output']['uploadProductIds'];
     console.log(this.viewSKU);
     
      this.PublishStatus = this.viewData['publishStatus'];
      this.ValType = this.viewData['valueType'];
      this.statusValue = this.viewData['status'];

      this.buildGiftForm();
      this.getLogoDetails()
      this.giftLanguageList();
      this.conditionFormArray();
      this.SKUCodeArray = this.viewData['mappedProductIds']
      for (let i = 1; i <= 5; i++) {
        let value = this.viewData['fixedValue' + i];
        // console.log(value);
        if (value > 0) {
          this.keywords.push(value);
        }
      }
      if (this.ValType == 'PRODUCT') {
        this.brandId = this.viewData['brandId'];
        for (let i = 0; i <= this.viewData['storeId'].length - 1; i++) {
          let ID = this.viewData['storeId'][i]['storeId'];
          console.log(ID);

          this.selectedStore.push(ID);
          this.dataStore = true;
          console.log(this.selectedStore);

        }
      } else {
        this.brandId = this.viewData['brandId'];
        for (let i = 0; i <= this.viewData['storeId'].length - 1; i++) {
          let ID = this.viewData['storeId'][i]['storeId'];
          console.log(ID);

          this.selectedStore.push(ID);
          this.dataStore = true;
        }
        for (let i = 0; i <= this.viewData['mappedProductIds'].length - 1; i++) {
          let ID = this.viewData['mappedProductIds'][i];
          this.selectedProduct.push(ID);
          this.dataStore1 = true;
        }
      }



    });
  }
  public giftLanguageList() {
    const control = <FormArray>this.giftFormGroup.controls['giftLanguageList'];
    for (let i = 0; i < this.viewData['cardNames'].length; i++) {
      let newForm = this.fb.group({
        languageCode: this.viewData['cardNames'][i]['languageCode'],
        cardName: [this.viewData['cardNames'][i]['cardNames'], Validators.required]
      });
      control.push(newForm);
      this.alignCss.push(this.viewData['cardNames'][i]['direction'] == 'RTL' ? 'text-right' : '');
    }
    let GET_ALL_CURRENCIES = "api/rpa/master/currency/v1/select";
    this.http.getJson(environment.APIEndpoint + GET_ALL_CURRENCIES)
      .subscribe((response) => {
        // console.log(JSON.stringify(response));
        let TempArray = response;
        for (let i = 0; i <= TempArray.length - 1; i++) {
          let key = {
            CurrencyName: TempArray[i]['currencyCode'],
            CurrencyID: TempArray[i]['currencyId']
          }
          this.CurrencyCode.push(key)
        }
      });
  }

  public conditionFormArray() {
    const control = <FormArray>this.giftFormGroup.controls['conditionArray'];
    for (let i = 0; i < this.viewData['TNC'].length; i++) {
      let newForm = this.fb.group({
        languageCode: this.viewData['TNC'][i]['languageCode'],
        termAndCondition: this.viewData['TNC'][i]['termAndCondition']
      });
      control.push(newForm);
    }
  }
  getLogoDetails() {
    // console.log(this.templateId);
    let data =
    {
      "languageCode": "en",
      "templateId": this.templateId
    }
    this.http.postCustomizeJson('https://cupilfuhfg.execute-api.ap-south-1.amazonaws.com/gcadmin_sit/rest/api/v1/gcadmin/get_templates_details_by_id', data).subscribe(res => {
      // console.log(res);
      let TempData = res['Output'][0];
      this.headingMessage1 = TempData['headingMessage1'];
      this.headingMessage2 = TempData['headingMessage2'];
      this.textMessage = TempData['textMessage'];
      this.backgroundImage = TempData['backgroundImage'];
      this.logoImage = TempData['logoImage'];
      this.textColor = TempData['textColor'];
      this.backgroundColor = TempData['backgroundColor'];

    }, err => {
      // console.log(err)
    })
  }

  public toggleStatus(event) {
    if (event.checked == true) {
      this.statusValue = 'ONLINE';
    } else {
      this.statusValue = 'OFFLINE';
    }
  }

  addGiftCard() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = false;


    const dialogRef = this.dialog.open(SelectGiftcardTemplateComponent,
      { panelClass: 'dialoggiftcardStyleChange' }
    );;
    dialogRef.afterClosed().subscribe(result => {
      // console.log(JSON.stringify(result));
      let TempData = result['tableData'][0];
      this.giftFormGroup.controls['cardFor'].patchValue(TempData['templateFor']);
      this.headingMessage1 = TempData['headingMessage1'];
      this.headingMessage2 = TempData['headingMessage2'];
      this.textMessage = TempData['textMessage'];
      this.backgroundImage = TempData['backgroundImage'];
      this.logoImage = TempData['logoImage'];
      this.textColor = TempData['textColor'];
      this.backgroundColor = TempData['backgroundColor'];
      this.giftFormGroup.controls['templateId'].patchValue(TempData['templteId'])
      this.templateId = TempData['templteId'];
    });
  }
  public showKeyword(keyword: HTMLInputElement) 
  {
    let  keyValue=parseInt(keyword.value)
    if (this.keywords.length < 5) {
      if (this.keywords.includes(keyValue)) {
   
           }
      else {
             this.keywordStatus = true;
             if (keyword.value < '1')
              {
                // this.keywordStatus = false;
                this.keywordError=true;
                if(keyword.value==''){
                  this.keywordStatus = false;
                  this.keywordError=false;
                }
              }
             if (keyword.value > '0') 
             {
                this.keywords.push(keyValue);
                keyword.value = '';
             }
           }
    }
    else {
           this.keywordStatus = true;
           this.giftFormGroup.get('keywords').clearValidators();
           this.giftFormGroup.get('keywords').updateValueAndValidity();
           setTimeout(() => 
           {
             this.keywordStatus = false;
           }, 2000);

    }
  }

  public deleteKeyword(index: any) {
    this.keywords.splice(index, 1);
  }
  addCoupon() {
    const dialogRef = this.dialog.open(addCouponDialog);
    dialogRef.afterClosed().subscribe(result => {
      // console.log(result)
      if (result.buttonName === 'SELECT') {
        let Name = result['tableData'][0]['couponTitle'];
        let ID = result['tableData'][0]['couponId']
        this.giftFormGroup.controls['couponId'].patchValue(ID);
        this.giftFormGroup.controls['couponTitile'].patchValue(Name)
      }
    });
  }

  selcetProductSKU() {
    // console.log(this.selectedProduct)
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = false;
    const dialogRef = this.dialog.open(SkuDialogComponent,
      { panelClass: 'dialoggiftcardStyleChange' }
    );
    dialogRef.componentInstance.totalCount = this.totalProductCount.length;
    dialogRef.componentInstance.SkuList = this.selectedProduct;
    dialogRef.componentInstance.selectedValue = this.giftFormGroup.controls.valueType.value.toUpperCase();
    dialogRef.afterClosed().subscribe(result => {
      // console.log(JSON.stringify(result));
      let SKUCode = [];

      if (result.buttonName === 'SELECT') {
        // this.giftFormGroup.get('productName').reset();
        // this.giftFormGroup.get('productId').reset();
        // this.giftFormGroup.get('SKUCODE').reset();

        let ProductCount = result.tableData.length;
        if (ProductCount != 0) {

          if (this.ValType == 'PRODUCT') {
            SKUCode.push(result.tableData[0]['SKU_CODE']);
            this.giftFormGroup.get('productName').patchValue(result.tableData[0].PRODUCT_NAME);
            this.giftFormGroup.get('productId').patchValue(result.tableData[0].productId);
          } 
          else {
            for (let i = 0; i < result.tableData.length; i++) {
              // console.log(result.tableData);

              SKUCode.push(result.tableData[i]['SKU_CODE']);
              this.SKUCodeArray = SKUCode;
            }
          }
        }

      }



      this.selectedProduct = SKUCode;
      if (this.selectedProduct.length) {
        this.selectStoreVal1 = true;
        this.dataStore1 = false;
        setTimeout(() => {
          this.selectStoreVal1 = false;
          if (this.selectStoreVal1 == false) {
            this.dataStore1 = true;
          }
        }, 2000);
      }
    });

  }
  openStoresDialog() {
    const dialogRef = this.dialog.open(selectStoreDialog);
    dialogRef.componentInstance.storeList = this.selectedStore;
    dialogRef.componentInstance.totalCount = this.totalCount;
    dialogRef.componentInstance.programBrand = this.programBrand;
    dialogRef.componentInstance.brandOid = this.brandOid;
    dialogRef.afterClosed().subscribe(
      (result) => {
        if (result.buttonName === 'SELECT') {
          this.selectedStore = [];
          this.brandId=[];
          this.selectedStoreCount = result.tableData.length;
          if (this.selectedStoreCount != 0) {
            this.storeRequired = false;
            for (let i = 0; i < result.tableData.length; i++) {
              // console.log(result.tableData)
              let storeId = result.tableData[i].storeOid;
              let BrandID = result.tableData[i].brandId
              console.log(BrandID);

              this.selectedStore.push(storeId);
              if (this.brandId == '') {
                this.brandId = []
              }
              this.brandId.push(BrandID);
              const arrrayTemp = this.selectedStore;
              this.selectedStore = Array.from(new Set(arrrayTemp));
              console.log(this.selectedStore.length);
              if (this.selectedStore.length) {
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
          } else {
            //  this.storeErrorMsg = "Please select Store";
          }
        }
      }
    );
  }


  public uploadSKU(event: FileList) {
    if (event[0].size < 1000000) {
      if (event[0].type == "application/vnd.ms-excel" || event[0].type == "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
        this.uploadFile
          .uploadSku(event.item(0), event[0].type)
          .subscribe(response => {
              this.giftFormGroup.controls.SKUCODE.patchValue(response["Output"]['sku']);
              console.log(this.giftFormGroup.controls.SKUCODE);
              
              this.SKUCODEurl=response["Output"]['upload_url'];
              console.log(event[0].name);
              this.skuXslFileName=event[0].name;
            },
            (error) => {
              console.log(typeof (error));

              console.log(JSON.stringify(error));
              this.snackBar.openFromComponent(SnackBarComponent, {
                duration: 10000,
                data: {
                  status: 'failure',
                  message: error.error['Error_message']['Error']
                }
              });
            }
            );
           
      }
      else{
        this.snackBar.openFromComponent(SnackBarComponent, {
          duration: 10000,
          data: {
            status: "failure",
            message: "Supported format is xls and xlsx"
          }
        });
       }
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

  expandtermAndCondition() {
    var allifram = document.getElementById("arabicIDtac");
    var iFrame_Arabic = allifram.getElementsByTagName("iframe")[0];
    var html_Arabic = iFrame_Arabic.contentWindow.document.getElementsByTagName("html")[0];
    html_Arabic.setAttribute("style", "direction: rtl;");
  }
  public UpdateGiftCard(formData) {
    this.keywordStatus = true;
    this.keywordError=false;
    console.log('formData--->',formData);
    let selctStore;
    let brandId;
    let amountType;
    let productId = formData.productId;
    let productName = formData.productName;
    let MappedID: any;
    let minVal = formData.minVal;
    let maxVal = formData.maxVal;
    let SKUcode = formData.SKUCODE;
    if (this.SKUCodeArray.length > 0) {
      MappedID = this.SKUCodeArray;
    } else {
      MappedID = '';
    }
    if (this.selectedStore.length > 0) {
      selctStore = this.selectedStore;
      brandId = this.brandId;
    } else {
      selctStore = '';
      brandId = '';
    }
    if (SKUcode == null) {
      SKUcode = ''
    }
    if (productId == null) {
      productId = "";
    }
    if (productName == null) {
      productName = ""
    }
    if (this.isMarkDefault == true) {
      this.Editable = false;
      let minVal = this.giftFormGroup.get('minVal');
      let maxValue = this.giftFormGroup.get('maxVal');
      this.minvalue=this.giftFormGroup.get('minVal');
      minVal.setValidators([Validators.required]);
      minVal.updateValueAndValidity();
      maxValue.setValidators([Validators.required]);
      maxValue.updateValueAndValidity();
     
      if(this.giftFormGroup.get('minVal').value=='0'){
        this.minValueError =true;
      }
      else{
        this.minValueError =false;
      } 
      this.giftFormGroup.get('keywords').clearValidators();
      this.giftFormGroup.get('keywords').updateValueAndValidity();
      if (this.giftFormGroup.get('minVal').value > this.giftFormGroup.get('maxVal').value) {
        this.MinValCondition = true;
      } else if(this.giftFormGroup.get('minVal').value == this.giftFormGroup.get('maxVal').value){
        this.MinValCondition = true;
       }
      else {
        this.MinValCondition = false;
      }
      //  console.log(this.giftFormGroup.get('keywords').value);
      if (this.giftFormGroup.get('keywords').value == null) {
        this.giftFormGroup.get('keywords').clearValidators();
        this.giftFormGroup.get('keywords').reset();
      } else {
        if (this.keywords.length > 0) {
          this.giftFormGroup.get('keywords').clearValidators();
          this.giftFormGroup.get('keywords').updateValueAndValidity();
        }else if (this.giftFormGroup.get('keywords').value == '') {
          this.giftFormGroup.get('keywords').clearValidators();
          this.giftFormGroup.get('keywords').updateValueAndValidity();
        }
         else {
          let keywords = this.giftFormGroup.get('keywords')
          keywords.setValidators([Validators.required]);
          keywords.updateValueAndValidity();
        }
      }
    } else {
      this.Editable = true;
      this.giftFormGroup.get('maxVal').clearValidators();
      this.giftFormGroup.get('minVal').clearValidators();
      this.giftFormGroup.get('minVal').reset();
      this.giftFormGroup.get('maxVal').reset();
      // let keywords = this.giftFormGroup.get('keywords')
      // keywords.setValidators([Validators.required]);
      // keywords.updateValueAndValidity();
      if (this.keywords.length > 0) {
        this.giftFormGroup.get('keywords').clearValidators();
        this.giftFormGroup.get('keywords').updateValueAndValidity();
      } else {
        let keywords = this.giftFormGroup.get('keywords')
        keywords.setValidators([Validators.required]);
        keywords.updateValueAndValidity();
      }
    }
    if (MappedID == null) {
      MappedID = ""
    }
    if (productId == null) {
      productId = "";
    }
    if (productName == null) {
      productName = ""
    }
    if ((this.isMarkDefault == true) && (this.giftFormGroup.get('keywords').value != null)) {
      amountType = 'BOTH'
    } else if (this.isMarkDefault == false) {
      amountType = 'FIXED';
      minVal = 0;
      maxVal = 0;
    } else {
      amountType = 'RANGE'
    }
    // let DateValue;
    // let DaysValue = 0;

    if (formData['expiryDateIn'] == 'DATE') {
      this.DateValue = moment(formData.expiryDate).format('YYYY-MM-DD');
      this.DaysValue=0;
    } else {
      this.DaysValue = formData.noOfDay;
      this.DateValue = '';
      if(this.DateValue=='' && this.DaysValue==null){
        this.giftFormGroup.get('noOfDay').setValidators([Validators.required]);
        this.giftFormGroup.get('noOfDay').updateValueAndValidity();
      }
      if(this.DateValue==null && this.DaysValue==''){
        this.giftFormGroup.get('noOfDay').setValidators([Validators.required]);
        this.giftFormGroup.get('noOfDay').updateValueAndValidity();
      }
      //  if(this.DateValue=='' && this.DaysValue==''){
      //   this.giftFormGroup.get('noOfDay').setValidators([Validators.required]);
      //   this.giftFormGroup.get('noOfDay').updateValueAndValidity();
      // }
      if(this.DateValue=='' && this.DaysValue=='0'){
        this.giftFormGroup.get('noOfDay').setValidators([Validators.minLength(1)]);
        this.giftFormGroup.get('noOfDay').updateValueAndValidity();
      }
      if(this.DateValue=='' && this.DaysValue!=null){
        this.giftFormGroup.get('noOfDay').setValidators([Validators.pattern("^[1-9][0-9]*")]);
        this.giftFormGroup.get('noOfDay').updateValueAndValidity();
      }
     
    }

    if (formData['publishDate'] == null) {
      this.giftFormGroup.get('publishDate').setValidators([Validators.required]);
      this.giftFormGroup.get('publishDate').updateValueAndValidity();
    }
    else if (formData['publishDate'] != null) {
      this.giftFormGroup.get('publishDate').clearValidators();
      this.giftFormGroup.get('publishDate').updateValueAndValidity();
    }
    // if (formData['maxTxnValuePerDay']) {
    //   this.giftFormGroup.get('maxTxnValuePerDay').clearValidators();
    //   this.giftFormGroup.get('maxTxnValuePerDay').updateValueAndValidity();
    // }
    if(formData['maxTxnValuePerDay']==''){
      this.giftFormGroup.get('maxTxnValuePerDay').clearValidators();
      this.giftFormGroup.get('maxTxnValuePerDay').updateValueAndValidity();
    }
   if(formData['maxTxnValuePerDay']!=''){
      this.giftFormGroup.get('maxTxnValuePerDay').setValidators([Validators.pattern('^[1-9]+[0-9]*$')]);
      this.giftFormGroup.get('maxTxnValuePerDay').updateValueAndValidity();
    }
    if(formData['maxTxnValuePerDay']=='0'){
      this.giftFormGroup.get('maxTxnValuePerDay').setValidators([Validators.minLength(1)]);
      this.giftFormGroup.get('maxTxnValuePerDay').updateValueAndValidity();
    }
    if(formData['maxTxnPerDay']==''){
      this.giftFormGroup.get('maxTxnPerDay').clearValidators();
      this.giftFormGroup.get('maxTxnPerDay').updateValueAndValidity();
    }
   if(formData['maxTxnPerDay']!=''){
      this.giftFormGroup.get('maxTxnPerDay').setValidators([Validators.pattern('^[1-9]+[0-9]*$')]);
      this.giftFormGroup.get('maxTxnPerDay').updateValueAndValidity();
    }
    if(formData['maxTxnPerDay']=='0'){
      this.giftFormGroup.get('maxTxnPerDay').setValidators([Validators.minLength(1)]);
      this.giftFormGroup.get('maxTxnPerDay').updateValueAndValidity();
    }
    if (formData['valueType'] == 'AMOUNT') {
      this.giftFormGroup.get('mappedProductIds').clearValidators();
      this.giftFormGroup.get('mappedProductIds').updateValueAndValidity();
      this.giftFormGroup.get('productId').clearValidators();
      this.giftFormGroup.get('productId').updateValueAndValidity();
      this.giftFormGroup.get('productName').clearValidators();
      this.giftFormGroup.get('productName').updateValueAndValidity();
      this.giftFormGroup.get('oneProductCost').clearValidators();
      this.giftFormGroup.get('oneProductCost').updateValueAndValidity();
    }

    if (formData['valueType'] == 'PRODUCT') {
      this.giftFormGroup.get('mappedProductIds').clearValidators();
      this.giftFormGroup.get('mappedProductIds').updateValueAndValidity();
      this.giftFormGroup.get('productId').setValidators([Validators.required]);
      this.giftFormGroup.get('productId').updateValueAndValidity();
      this.giftFormGroup.get('productName').setValidators([Validators.required]);
      this.giftFormGroup.get('productName').updateValueAndValidity();
      this.giftFormGroup.get('oneProductCost').setValidators([Validators.required]);
      this.giftFormGroup.get('oneProductCost').updateValueAndValidity();
      if(this.giftFormGroup.get('oneProductCost').value=='0'){
        this.giftFormGroup.get('oneProductCost').setValidators([Validators.minLength(1)]);
        this.giftFormGroup.get('oneProductCost').updateValueAndValidity();
      }
      if(this.giftFormGroup.get('oneProductCost').value!=null){
        this.giftFormGroup.get('oneProductCost').setValidators(Validators.pattern('^[1-9]+[0-9]*$'));
        this.giftFormGroup.get('oneProductCost').updateValueAndValidity();
      }
      if(this.giftFormGroup.get('oneProductCost').value==''){
        this.giftFormGroup.get('oneProductCost').setValidators([Validators.required]);
        this.giftFormGroup.get('oneProductCost').updateValueAndValidity();
      }
    }
    if(formData['additionalCharge']=='0'){
      this.giftFormGroup.get('additionalCharge').setValidators([Validators.minLength(1)]);
      this.giftFormGroup.get('additionalCharge').updateValueAndValidity();
    }
    if(formData['additionalCharge']==null){
      this.giftFormGroup.get('additionalCharge').clearValidators();
      this.giftFormGroup.get('additionalCharge').updateValueAndValidity();
    }
    if(formData.discount==''){
      this.giftFormGroup.get('discount').clearValidators();
      this.giftFormGroup.get('discount').updateValueAndValidity();
    }
    if(formData.discount!=''){
      this.giftFormGroup.get('discount').setValidators([Validators.pattern('^[1-9]+[0-9]*$')]);
      this.giftFormGroup.get('discount').updateValueAndValidity();
    }
    if(formData.discount=='0'){
      this.giftFormGroup.get('discount').setValidators([Validators.minLength(1)]);
      this.giftFormGroup.get('discount').updateValueAndValidity();
    }

    if(formData.valueType=='Product'){
  
      SKUcode='';
      this.SKUCODEurl='';
    }else{
      SKUcode;
      this.SKUCODEurl;
    }
    let OBJ = {
      cardStatus:this.statusValue,
      languageCode: "EN",
      templateId: formData.templateId,
      cardNames: formData.giftLanguageList,
      TNC: formData.conditionArray,
      cardFor: formData.cardFor,
      prefix: formData.prefix,
      suffix: formData.suffix,
      cardUsageType: formData.cardUsageType,
      valueType: formData.valueType,
      currency: formData.Currency,
      fixedValue1: 0,
      fixedValue2: 0,
      fixedValue3: 0,
      fixedValue4: 0,
      fixedValue5: 0,
      minVal: minVal,
      maxVal: maxVal,
      discount: formData.discount,
      additionalCharge: formData.additionalCharge,

      maxTxnPerDay: formData.maxTxnPerDay,
      maxTxnValuePerDay: formData.maxTxnValuePerDay,
      couponId: formData.couponId,
      giftcardMessage: '',
      couponMessage: formData.couponTitile,
      productId: productId,
      productName: productName,
      oneProductCost: formData.oneProductCost,
      mappedProductIds: MappedID,
      storeId: selctStore,
      brandId: brandId,
      expiryDateIn: formData['expiryDateIn'],
      expiryDate: this.DateValue,
      noOfDay: this.DaysValue,
      maxCount: 0,
      uploadProductIds: SKUcode,
      publishDate: moment(formData.publishDate).format('YYYY-MM-DD'),
      giftCardId: this.GiftCardID,
      amountType: amountType,
      upload_product_url:this.SKUCODEurl==undefined || this.SKUCODEurl==null ? '' : this.SKUCODEurl,
    }

    for (let i = 0; i <= this.keywords.length - 1; i++) {
      let value = 'fixedValue' + (i + 1);
      OBJ[value] = this.keywords[i];

    }
    if(this.keywords.length<1 &&(minVal==0 && maxVal==0) &&(formData.keywords!='')){
      this.secondCon=true
    }
    else if(this.keywords.length<1 &&(minVal==null && maxVal==null) &&(formData.keywords!='')){
      this.secondCon=true
    }
    else{
      this.secondCon=false
    }
   if(this.keywords.length<1 &&(minVal==null && maxVal==null) &&(formData.keywords==null)){
      this.secondCon=false
    }
    if(this.keywords.length<1 &&(minVal==0 && maxVal==0) &&(formData.keywords==null)){
      this.secondCon=false
    }
    console.log(JSON.stringify(OBJ));
    if (this.giftFormGroup.valid && (this.MinValCondition==false && this.minValueError==false  && this.secondCon==false)) {
      console.log(JSON.stringify(OBJ));
      let TempURL = 'https://cupilfuhfg.execute-api.ap-south-1.amazonaws.com/gcadmin_sit/rest/api/v1/gcadmin/edit_gift_card';
      // let TempURL = 'https://q2j4fc9t2h.execute-api.ap-south-1.amazonaws.com/gcadmin_sitv1/rest/api/v1/gcadmin/edit_gift_card';

      return this.http.postCustomizeJson(TempURL, OBJ)
        .subscribe((response) => {
          // console.log(response);

          this.snackBar.openFromComponent(SnackBarComponent, {
            duration: 1500,
            data: {
              status: "success",
              message: "Gift Card Updated successfully"
            }
          });

          this.router.navigate(["/search-gift-card"])


        },
          err => {
            // console.log(err)
            this.snackBar.openFromComponent(SnackBarComponent, {
              duration: 3000,
              data: {
                status: "failure",
                message: err.error.Error_message
              }
            });


          }
        );
    }
  }
  CheckDatecondtion() {
    this.CheckDate = false;
  }
  statusCall() {
    let data = {
      "languageCode": 'en',
      "cardId": this.GiftCardID,
      "statusToBe": this.statusValue
    }
    this.http.postCustomizeJson('https://cupilfuhfg.execute-api.ap-south-1.amazonaws.com/gcadmin_sit/rest/api/v1/gcadmin/change_giftcard_status', data).subscribe(res => {
      console.log(res);
      this.statusUpdate = res['Output'];
      this.getCardData()
      this.snackBar.openFromComponent(SnackBarComponent, {
        duration: 1000,
        data: {
          status: 'success',
          message: this.statusUpdate
        }
      });


    }, err => {
      console.log(err)
      this.snackBar.openFromComponent(SnackBarComponent, {
        duration: 10000,
        data: {
          status: 'failure',
          message: err.error['Error_message']
        }
      });
    })
  }
  checkPin($event: KeyboardEvent) {
    console.log($event)
    let value = (<HTMLInputElement>event.target).value;
  
    if ($event.target) {
      if (value == "") {
        this.secondCon=false
      }
  
      if (value.length > 0) {
        this.secondCon=true;
      }
    }
  }
}
