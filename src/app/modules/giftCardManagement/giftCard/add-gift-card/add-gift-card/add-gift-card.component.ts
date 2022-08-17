import { Component, OnInit } from '@angular/core';
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
import { formatDate } from '@angular/common';
import { ExtraValidators } from 'src/app/services/validator-service';
import { selectStoreDialog } from 'src/app/shared/components/select-store-dialog/select-store.component';
@Component({
  selector: 'add-gift-card',
  templateUrl: './add-gift-card.component.html',
  styleUrls: ['./add-gift-card.component.scss']
})
export class AddGiftCardComponent implements OnInit {
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

  // public prefirSuffix:boolean=false;
      DateValue;
    DaysValue;
    minvalue;

  keywordError:boolean=false
  public showLogo:boolean=false;
  public toggleVal: boolean = true;
  public statusValue: string = 'ONLINE';
  public imageUploading = false;
  public imagePath = '';
  public filePathUrl = localStorage.getItem('imgBaseUrl');
  public giftFormGroup: FormGroup;
  public languageList = JSON.parse(localStorage.getItem("languageList"));
  alignCss = [];
  public showImageError: boolean = false;
  TemplateFor;
  backgroundColor='';
  textColor: any;
  logoImage: any;
  backgroundImage = '';
  textMessage: any;
  headingMessage2: any;
  headingMessage1='';
  CurrencyCode = [];
  keywords = [];
  keywordStatus: boolean = true;  // dialog: any;
  public selectedStore = [];
  public totalCount: [];
  public totalProductCount:[]
  public programBrand;
  public brandOid: number = 0;
  public selectedStoreCount = 0;
  public storeRequired: boolean = false;
  public selectStoreVal = false;
  public selectStoreVal1 = false;
  isSubmitted=true;
  public dataStore: boolean = false;
  public dataStore1: boolean = false;

  templateId: any;
  ValueTypeArray = ['Amount', 'Product'];
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
  brandId = [];
  public minDate = new Date();
  storeCount: any;
  selectedCount: any;
  selectedProductCount:any;
  termsConditionError: boolean;
  SKUCodeArray=[];
  public Editable = true;
  isMarkDefault : boolean = false;
  MinValCondition = false;
  minValueError=false;
  endDateError: boolean;
  CheckDate=true;
  SKUCODEurl: any;
  skuXslFileName: any;
  secondCon:boolean=false
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
        this.totalProductCount=response["Output"].length;
       
      })

  }

  ngOnInit() {
    this.buildGiftForm();
    this.giftLanguageList();
    this.conditionFormArray();

  }
  public toggleStatus(event) {
    if (event.checked == true) {
      this.statusValue = 'ONLINE';
    } else {
      this.statusValue = 'OFFLINE';
    }
  }



  buildGiftForm() {

    let form = {
      giftLanguageList: this.fb.array([]),
      conditionArray: this.fb.array([]),
      valueType: ['',Validators.compose([Validators.required])],
      cardFor: ['',Validators.compose([Validators.required])],
      keywords: [''],
      // percentage: [''], stores/brands 
      prefix: ['',Validators.compose([Validators.required,Validators.pattern("[a-zA-Z0-9\s]*$")])],
      suffix: ['',Validators.compose([Validators.required,Validators.pattern("[a-zA-Z0-9\s]*$")])],
          //  Validators.compose([ExtraValidators.conditional(
      //   group => this.firstFormGroup.get('rangeUpload').value === 'range',
      //   Validators.required
      //   )])] 
      minVal: ['',Validators.compose([Validators.minLength(1),Validators.pattern("^[1-9][0-9]*")])],
      maxVal: ['',Validators.compose([Validators.minLength(1),Validators.pattern("^[1-9][0-9]*")])],
      discount: [''],
      additionalCharge: [''],
      cardUsageType: ['SINGLE',Validators.compose([Validators.required])],
      couponId: [''],
      couponTitile: [''],
      Currency: ['',Validators.compose([Validators.required])],
      oneProductCost: ['',Validators.compose([Validators.required,Validators.minLength(1),Validators.pattern("^[1-9][0-9]*")])],
      noOfDay: [''],
      templateId: ['', Validators.compose([Validators.required])],
      productName: ['', Validators.compose([Validators.required])],
      CurrencyID: [''],
      maxTxnPerDay: [''],
      maxTxnValuePerDay: ['',Validators.compose([Validators.required])],
      expiryDate: ['',Validators.compose([Validators.required])],
      productId: [''],
      mappedProductIds: [''],
      publishDate: ['',Validators.compose([Validators.required])],
      SKUCODE: [''],
      expiryDateIn:['']
    }
    this.giftFormGroup = this.fb.group(form);
  }

  getFileTypeStatus(value) {
    this.ValType = value;
    this.selectedProduct=[];
    // if(this.ValType=='Amount'){
    this.giftFormGroup.get('mappedProductIds').reset();
    this.giftFormGroup.get('oneProductCost').reset();
    this.giftFormGroup.get('productName').reset();
    this.giftFormGroup.get('productId').reset();
    this.giftFormGroup.get('SKUCODE').reset();
    this.SKUCodeArray=[];
    this.SKUCODEurl=''
    this.skuXslFileName=''
    // }else if(this.ValType=='Product'){
    // this.giftFormGroup.get('productId').reset();
    // }
  }


  checkExpiry(value) {
    this.giftFormGroup.get('expiryDateIn').patchValue(value)
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



  CheckAmountType(event){
    if(event.checked){
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
     this.giftFormGroup.get('keywords').reset();
    }else{
      this.Editable = true;
      this.isMarkDefault = false;
      this.giftFormGroup.get('maxVal').clearValidators();
      this.giftFormGroup.get('minVal').clearValidators();
      this.giftFormGroup.get('minVal').reset();
      this.giftFormGroup.get('maxVal').reset();
      this.MinValCondition=false;
      // let keywords = this.giftFormGroup.get('keywords')
      // keywords.clearValidators();
      // keywords.updateValueAndValidity();  
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
  
  public giftLanguageList() {
    const control = <FormArray>this.giftFormGroup.controls['giftLanguageList'];
    for (let i = 0; i < this.languageList.length; i++) {
      let newForm = this.fb.group({
        languageCode: this.languageList[i]['languageCode'],
        cardName: ['', Validators.required]
      });
      control.push(newForm);
      this.alignCss.push(this.languageList[i].direction == 'RTL' ? 'text-right' : '');
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
        // this.CurrencyCode=

      });
  }

  public conditionFormArray() {
    const control = <FormArray>this.giftFormGroup.controls['conditionArray'];
    for (let i = 0; i < this.languageList.length; i++) {
      let newForm = this.fb.group({
        languageCode: this.languageList[i]['languageCode'],
        termAndCondition: ['']
      });
      control.push(newForm);
    }
  }

  public addCard(formData) {
    this.keywordStatus = true;
    this.keywordError=false;
    // if( formData.prefix=='' && formData.suffix==''){
    //   this.prefirSuffix=true;
    //  }
    //  else{
    //   this.prefirSuffix=false;
    //  }
    // console.log(formData);
    let selctStore;
    let brandId;
    let amountType;
    let productId = formData.productId;
    let productName = formData.productName;
    let MappedID :any;
    let minVal=formData.minVal;
    let maxVal=formData.maxVal;
    let SKUcode = formData.SKUCODE;
      if(this.SKUCodeArray.length>0){
        MappedID=this.SKUCodeArray;
      }else{
        MappedID='';
      }
    if (this.selectedStore.length > 0) {
      selctStore = this.selectedStore;
      brandId = this.brandId;
    } else {
      selctStore = '';
      brandId = '';
    }
    if(SKUcode == null){
      SKUcode=''
    } 
    if (productId == null) {
      productId = "";
    }
    if (productName == null) {
      productName = ""
    }

    if(this.isMarkDefault == true){
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
    //  console.log(this.giftFormGroup.get('keywords').value);
      this.giftFormGroup.get('keywords').clearValidators();
      this.giftFormGroup.get('keywords').updateValueAndValidity();
     if(this.giftFormGroup.get('minVal').value > this.giftFormGroup.get('maxVal').value){
       this.MinValCondition = true;
     }else if(this.giftFormGroup.get('minVal').value == this.giftFormGroup.get('maxVal').value){
      this.MinValCondition = true;
     }
     else{
       this.MinValCondition = false;
     }
   if(this.giftFormGroup.get('keywords').value==null){
    this.giftFormGroup.get('keywords').clearValidators();
    this.giftFormGroup.get('keywords').reset();
   }else{
    if(this.keywords.length>0){
      this.giftFormGroup.get('keywords').clearValidators();
      this.giftFormGroup.get('keywords').updateValueAndValidity();
     }else{
      let keywords = this.giftFormGroup.get('keywords')
      keywords.setValidators([Validators.required]);
      keywords.updateValueAndValidity();
     }
   }
    }else{
      this.Editable = true;
      this.giftFormGroup.get('maxVal').clearValidators();
      this.giftFormGroup.get('minVal').clearValidators();
      this.giftFormGroup.get('minVal').reset();
      this.giftFormGroup.get('maxVal').reset();
          if(this.keywords.length==0){
            let keywords = this.giftFormGroup.get('keywords')
          keywords.setValidators([Validators.required]);
          keywords.updateValueAndValidity();
          }
          if(this.keywords.length>0){
            this.giftFormGroup.get('keywords').clearValidators();
          }
    }
    if(this.isMarkDefault  && (this.keywords.length>0)){
      amountType = 'BOTH';
      
    }else if(this.isMarkDefault == false){
      amountType = 'FIXED';
      minVal=0;
      maxVal = 0;
    }else{
      amountType = 'RANGE';
    }
    // let DateValue;
    // let DaysValue=0;
    
    if( formData.expiryDateIn=='DATE'){
      this.DateValue = moment(formData.expiryDate).format('YYYY-MM-DD');
      this.DaysValue=0;
      
    }else{
      this.DaysValue = formData.noOfDay;
      this.DateValue='';
      if(this.DateValue=='' && this.DaysValue==null){
        this.giftFormGroup.get('noOfDay').setValidators([Validators.required]);
        this.giftFormGroup.get('noOfDay').updateValueAndValidity();
      }
      if(this.DateValue==null && this.DaysValue==''){
        this.giftFormGroup.get('noOfDay').setValidators([Validators.required]);
        this.giftFormGroup.get('noOfDay').updateValueAndValidity();
      }
      if(this.DateValue=='' && this.DaysValue=='0'){
        this.giftFormGroup.get('noOfDay').setValidators([Validators.minLength(1)]);
        this.giftFormGroup.get('noOfDay').updateValueAndValidity();
      }
      if(this.DateValue=='' && this.DaysValue!=null){
        this.giftFormGroup.get('noOfDay').setValidators([Validators.pattern("^[1-9][0-9]*")]);
        this.giftFormGroup.get('noOfDay').updateValueAndValidity();
      }
     
     
    }
  if(formData.valueType=='Amount'){
    this.giftFormGroup.get('oneProductCost').clearValidators();
    this.giftFormGroup.get('oneProductCost').reset();
  }
  if(formData.valueType=='Amount'){
    this.giftFormGroup.get('productName').clearValidators();
    this.giftFormGroup.get('productName').updateValueAndValidity();
    this.giftFormGroup.get('productName').reset();
  
  }
 
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
      cardStatus:this.toggleVal == true ? "ONLINE" : "OFFLINE",
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
      expiryDate:this.DateValue,
      noOfDay: this.DaysValue,
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
      expiryDateIn: formData.expiryDateIn,
      maxCount: 0,
      uploadProductIds:SKUcode,
      upload_product_url:this.SKUCODEurl==undefined ? '' : this.SKUCODEurl,
      amountType:amountType,
      publishDate: moment(formData.publishDate).format('YYYY-MM-DD')
    }
    // console.log(JSON.stringify(OBJ));

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
    if(this.giftFormGroup.valid && (this.MinValCondition==false && this.minValueError==false && this.secondCon==false)){
      let TempURL = 'https://cupilfuhfg.execute-api.ap-south-1.amazonaws.com/gcadmin_sit/rest/api/v1/gcadmin/add_gift_card';
      // let TempURL =  'https://q2j4fc9t2h.execute-api.ap-south-1.amazonaws.com/gcadmin_sitv1/rest/api/v1/gcadmin/add_gift_card';
    return this.http.postCustomizeJson(TempURL, OBJ)
      .subscribe((response) => {
        // console.log(response);
        this.router.navigate(["/search-gift-card"]);
        this.snackBar.openFromComponent(SnackBarComponent, {
          duration: 1500,
          data: {
            status: "success",
            message: "Gift Card added successfully"
          }
        });
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


  addGiftCard() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = false;
    const dialogRef = this.dialog.open(SelectGiftcardTemplateComponent,
      {panelClass: 'dialoggiftcardStyleChange'}
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
      this.showLogo=true;
      this.textColor = TempData['textColor'];
      this.backgroundColor = TempData['backgroundColor'];
      this.giftFormGroup.controls['templateId'].patchValue(TempData['templteId'])
      this.templateId = TempData['templteId'];
    });
  }
  selcetProductSKU() {
    // console.log(this.selectedProduct)
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = false;
    const dialogRef = this.dialog.open(SkuDialogComponent,  {panelClass: 'dialoggiftcardStyleChange'}
      
    ); 
    dialogRef.componentInstance.totalCount = this.totalProductCount.length;
    dialogRef.componentInstance.SkuList = this.selectedProduct;
     dialogRef.componentInstance.selectedValue =  this.giftFormGroup.controls.valueType.value.toUpperCase( );
    dialogRef.afterClosed().subscribe(result => {
      // console.log(JSON.stringify(result));
      let SKUCode =[];
     this.selectedProduct =[]
      if (result.buttonName === 'SELECT') {
        this.giftFormGroup.get('productName').reset();
        this.giftFormGroup.get('productId').reset();
        this.giftFormGroup.get('SKUCODE').reset();
       
        let ProductCount = result.tableData.length;
        if (ProductCount != 0) {

          if(this.ValType == 'Product'){
            SKUCode.push(result.tableData[0]['SKU_CODE']);
            // this.giftFormGroup.controls.SKUCODE.patchValue(result.tableData[0].SKU_CODE);
            this.giftFormGroup.controls.productName.patchValue(result.tableData[0].PRODUCT_NAME);
            this.giftFormGroup.controls.productId.patchValue(result.tableData[0].productId);
          }else{
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
    }    });

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
                      let BrandID = result.tableData[i].brandId;
                      this.selectedStore.push(storeId);
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


  public showKeyword(keyword: HTMLInputElement) {
    if (this.keywords.length < 5) {
      if (this.keywords.includes(keyword.value)) {

      }
      else {
        this.keywordStatus = true;
        if(keyword.value<'1'){
          // this.keywordStatus = false;
          this.keywordError=true;
          if(keyword.value==''){
            this.keywordStatus = false;
            this.keywordError=false;
            this.secondCon=false;
          }
        }
        if(keyword.value>'0'){
          this.keywordError=false;
          this.keywords.push(keyword.value);
          keyword.value = '';
        }
       
      }

    }
    else {
      this.keywordStatus = true;
      this.giftFormGroup.get('keywords').clearValidators();
      this.giftFormGroup.get('keywords').updateValueAndValidity();
      setTimeout(() => {
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

 

  public uploadSKU(event: FileList) {
    if (event[0].size < 1000000) {
      if (event[0].type == "application/vnd.ms-excel" || event[0].type == "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
        this.uploadFile
       
        
          .uploadSku(event.item(0), event[0].type)
          .subscribe(response =>
             {
               
              this.giftFormGroup.controls.SKUCODE.patchValue(response["Output"]['sku']);
              this.SKUCODEurl=response["Output"]['upload_url'];
              console.log(response["Output"]['upload_url']);
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
    } 
    
    else {

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
  CheckDatecondtion(){
    this.CheckDate=false;
  }
  // decimaValidate(value){
  //   let msg;
  //   if(value==0)
  //   {
  //     this.decimalValError=true;
  //    }
  //  else{
  //   this.decimalValError=false;
     
  //  }
  // }
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



