import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { HttpService } from 'src/app/services/http-service';
import { Router } from '@angular/router';
import { UploadFile } from 'src/app/services/uploadFile.service';
import { MatSnackBar, MatRadioChange, MatTabChangeEvent } from '@angular/material';
import { SnackBarComponent } from 'src/app/shared/components/snack-bar/snack-bar.component';
import { environment } from "src/environments/environment";
import { SelectAutocompleteComponent } from 'mat-select-autocomplete';
// import { AddOnsComponent } from '../../../products/view-products/addOns-dialog/addOns-dialog.component';
import { MatDialogModule, MatDialogConfig } from '@angular/material/dialog';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
// import { CategoryPopupComponent } from '../../categoryPopup/categoryPopup.component';
// import { ProductPopupComponent } from '../../productPopup/productPopup.component';
// import { VarientDialogComponent } from '../../varientDialog/varientDialog.component';
import { selectStoreDialog } from 'src/app/shared/components/select-store-dialog/select-store.component';
import { JsonPipe } from '@angular/common';
import * as moment from 'moment';
import { CategoryPopupComponent } from 'src/app/shared/components/menuManagement/categoryPopup/categoryPopup.component';
import { ProductPopupComponent } from 'src/app/shared/components/menuManagement/productPopup/productPopup.component';
import { VarientDialogComponent } from 'src/app/shared/components/menuManagement/varientDialog/varientDialog.component';
import { ExtraValidators } from 'src/app/services/validator-service';
import { ComboStorePopupComponent } from 'src/app/shared/components/menuManagement/combo-store-popup/store-popup.component';
import {FormControl} from '@angular/forms';
import { DieatryImageDialog } from '../../../products/dieatry-image-dialog/dieatry-image-dialog.component';
import { AlergionImageDialog } from '../../../products/alergion-image-dialog/alergion-image-dialog.component';

@Component({
  selector: 'app-edit-combo',
  templateUrl: './edit-combo.component.html',
  styleUrls: ['./edit-combo.component.scss']
})
export class EditComboComponent implements OnInit {
  public breadCrumbData: Array<Object> = [{
    title: 'Menu Management',
    link: ''
}, {
    title: 'Combo',
    link: ''
}
];
public alignCss = [];
comboType;
public imagePath=[];
imageUploading;
showImageError;
public filePathUrl = localStorage.getItem("imgBaseUrl");
comboType1;
comboType2;
totalFixedValue = 0;
public languageList = JSON.parse(localStorage.getItem("languageList"));
createComboFormGroup: FormGroup;
createComboFormGroup1: FormGroup;

rightPanel=[];
languageDirection=[];
brandList: any[];
selectedCategoryOptions: any[];
@ViewChild('categoryInput') categoryInput: SelectAutocompleteComponent;
@ViewChild('countryInput') countryInput: SelectAutocompleteComponent;

categoriesList: any[];
sortOrder: any;
countries: any[];
selectedAddonsResultCustomize: any;
public customImages: any = [];
public customProduts: any = [];
buildFlagCustomization: boolean;
categoryOid: any;
public scrollbarOptions = { axis: 'x', theme: 'minimal-dark' };
public selectedStorearray = [];
selectedCount: any;
totalCount: any;
selectStoreVal: boolean = false;
dataStore: boolean = false;
storeErrorMsg: string;
loading: boolean = false;
onLoadStoreCount;
public toggleVal = false;
viewID;
viewData=[];
  activeGroupId: any;
  public tabSelectionId: number;
  selected = new FormControl(0);
  selectedIndex: number = 0;
  imageErr: boolean;
  imageErrMsg: string;
  imgUpload: boolean;
  defaultId: any;
  imagePathDieatry=[];
  imagePathAlergion=[];
  selectedIndex1: number = 0;
  cloneOrderList=[
    {id:1,
      value:'DELIVERY'},
      {id:2,
        value:'PICK UP'},
        {id:3,
          value:'DINE IN'}
  ]
  customizationAddonLocale: any=[];
  selectedCountryOptions: any[];
  public countryArray=[];
 public categoryArray = [];
 basicTabError: boolean = false;
  isDeliveryReadonly:boolean=false;
  isPickupReadonly:boolean=false;
  isDineINReadonly:boolean=false;
  storeGroupDine=[];
  storeGroupPickup=[];
  storeGroup=[];
constructor(private fb: FormBuilder, private http: HttpService, public dialog: MatDialog,

  private router: Router, private uploadFile: UploadFile, public snackBar: MatSnackBar) { 
    let data = {
      "order": {
        "column": "storeId",
        "dir": "asc"
      },
      "keySearch": "",
      "fieldSearch": [
        {
          "fieldName": "mall.city.oid",
          "fieldValue": "",
        },
        {
          "fieldName": "mall.city.country.oid",
          "fieldValue": "",
        },
      ]
    }
    this.http.postJson(environment.APIEndpoint + 'api/rpa/store/v2/getAll', data).subscribe(res => {
      this.totalCount = res["totalCount"];
      this.onLoadStoreCount =res["totalCount"];
    });
  }

ngOnInit() {
   this.buildForm(false);
  this.getBrandList();
  this.getSortOrder();
  let data = localStorage.getItem('comboViewID');
  if (data) {
    this.viewID = data;
    this.getViewData();
    localStorage.removeItem('comboViewID')

  }else{
    this.router.navigate(['/search-combo'])
  }
}
getViewData() {

this.loading = true;
  let data =
  {
    "comboId": this.viewID,
  }
  let URL = environment.APIEndpoint + "api/rpa/combo/v1/view";
  this.http.postJson(URL, data)
    .subscribe((response) => {
      this.loading = true;
      this.viewData = response;
      for(let i=0;i<=this.viewData['comboImages'].length-1;i++){
        this.imagePath.push(this.viewData['comboImages'][i]['imgPath']);
        if(this.viewData['comboImages'][i].isDefault==true){
          this.defaultId = i;
        }
      }
      // this.imagePath= this.viewData['comboImages'];
      this.toggleVal = response["status"] == "ONLINE" ? true : false;
      this.getAllCountries(this.viewData['brandOid'],true);
      this.getParentList(this.viewData['brandOid'], true);
      console.log(response)
    });
}
getBrandList() {
  this.http
    .getJson(environment.APIEndpoint + "api/rpa/master/brand/v1/get/brands")
    .subscribe(response => {
      this.brandList = response;
    });
}
getSortOrder() {
  this.http
    .getJson(environment.APIEndpoint + "api/rpa/product/v1/get/sortOrder")
    .subscribe(response => {
      this.sortOrder = response["sortOrder"];
      this.createComboFormGroup.patchValue({
        sortOrder: this.sortOrder
      });
      this.createComboFormGroup.controls["sortOrder"].setValidators(
        Validators.compose([
          Validators.required,
          Validators.max(this.sortOrder)
        ])
      );
    });
}
// globalCurrencyList = [];
// getAllCurrency(countryId) {
//   this.globalCurrencyList = [];
//   console.log(countryId)
//   for (let i = 0; i <= this.countries.length - 1; i++) {

//     for (let j = 0; j <= countryId.length - 1; j++) {
//       if (this.countries[i]['countryId'] == countryId[j]) {
//         this.globalCurrencyList.push(this.countries[i]['currencyCode'])
//       }
//     }
//   }
//   console.log(this.globalCurrencyList)
// }

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
public buildForm(prepopulatedData) {
  if(prepopulatedData == false){
    this.createComboFormGroup = this.fb.group({
      comboLocales: this.fb.array([]),
      availFrom: "",
      availTo: '',
      brand: '',
      category: '',
      categoryOids: ["", Validators.compose([Validators.required])],
      displayPriceType: 'AUTO_CALCULATE',
      // displayPrice: '',
      // discountType: 'PERCENTAGE',
      // isDiscount: false,
      // discountPrice:['', Validators.compose([ExtraValidators.conditional(group => (this.createComboFormGroup.get('discountType').value != 'PERCENTAGE' && this.createComboFormGroup.get('isDiscount').value == true), Validators.required)])],
      // discountPrice1:['', Validators.compose([ExtraValidators.conditional(group => (this.createComboFormGroup.get('discountType').value == 'PERCENTAGE' && this.createComboFormGroup.get('isDiscount').value == true), Validators.required)])],

      // currency: ["", Validators.compose([Validators.required])],
      comboType: 'SELECTABLE',
      comboCarts: this.fb.array([]),
      comboCartsPickup: this.fb.array([]),
      comboCartsDineIn: this.fb.array([]),
      noOfStep: 0,
     
      country: '',
      storeField: '',
      sortOrder: [
        "",
        Validators.compose([
          Validators.required,
          Validators.max(this.sortOrder)
        ])
      ],
      isDeliveryEnabled:true,
      isPickupEnabled:false,
      isDineinEnabled:false,
      skuCode: ["", Validators.compose([Validators.required, Validators.pattern('^[a-zA-Z0-9-]{1,50}$')])],
      packingCharge: '',
      deliveryCharge: '',
      taxRates: '',
      skuCodePickup: ["", Validators.compose([Validators.required, Validators.pattern('^[a-zA-Z0-9-]{1,50}$')])],
      packingChargePickup: '',
      taxRatesPickup: '',
      skuCodeDineIn: ["", Validators.compose([Validators.required, Validators.pattern('^[a-zA-Z0-9-]{1,50}$')])],
      packingChargeDineIn: '',
      taxRatesDineIn: '',
      deliveryStoreGroupArray: this.fb.array([]),
      pickupStoreGroupArray: this.fb.array([]),
      dineInStoreGroupArray: this.fb.array([])
    });
  // this.comboNameData();

  // this.titleData();
}
else{
  let availableToTime;
  let availableFromTime;
  if (this.viewData['availableFrom'] != null) {
    availableFromTime = new Date();
    let e = this.viewData['availableFrom'].split(":");
    availableFromTime.setHours(e[0]);
    availableFromTime.setMinutes(e[1]);
  }
  if (this.viewData['availableTo'] != null) {
    availableToTime = new Date();
    let t = this.viewData['availableTo'].split(":");
    availableToTime.setHours(t[0]);
    availableToTime.setMinutes(t[1]);
  }
  //  console.log(this.viewData['brandOid'])

  this.createComboFormGroup = this.fb.group({
    comboLocales: this.fb.array([]),
    availFrom: availableFromTime,
    availTo: availableToTime,
    brand: this.viewData['brandOid'],
    isDiscount: false,
    category: '',
    categoryOids: ['', Validators.compose([Validators.required])],
    displayPriceType: this.viewData['displayPriceType'],
    displayPrice: this.viewData['displayPrice'],
    discountType: this.viewData['discountType'] == null ? 'PERCENTAGE' : this.viewData['discountType'],
    discountPrice:[ this.viewData['discountPrice'] == null ? '': this.viewData['discountPrice'], Validators.compose([ExtraValidators.conditional(group => (this.createComboFormGroup.get('discountType').value != 'PERCENTAGE' && this.createComboFormGroup.get('isDiscount').value == true), Validators.required)])],
    discountPrice1:[this.viewData['discountPrice'] == null ? '': this.viewData['discountPrice'], Validators.compose([ExtraValidators.conditional(group => (this.createComboFormGroup.get('discountType').value == 'PERCENTAGE' && this.createComboFormGroup.get('isDiscount').value == true), Validators.required)])],

    // currency: ['', Validators.compose([Validators.required])],
     comboType: this.viewData['comboType'],
    comboCarts: this.fb.array([]),
    comboCartsPickup: this.fb.array([]),
    comboCartsDineIn: this.fb.array([]),
    noOfStep: 0,
   
    country: '',
    // storeField: 0,

    // storeField: this.viewData['comboStore'].length,
    sortOrder: [
      this.viewData['sortOrder'],
      Validators.compose([
        Validators.required,
        Validators.max(this.sortOrder)
      ])
    ],
    isDeliveryEnabled:true,
    isPickupEnabled:false,
    isDineinEnabled:false,
    // skuCode:this.viewData['comboSkuCode'],
    // packingCharge: this.viewData['packagingCharge'],
    // deliveryCharge: this.viewData['deliveryCharge'],
    // taxRates: this.viewData['taxRate'],
    // skuCode: ["", Validators.compose([Validators.required, Validators.pattern('^[a-zA-Z0-9-]{1,50}$')])],
    skuCode : ['', Validators.compose([Validators.pattern('^[a-zA-Z0-9-]{1,50}$'),ExtraValidators.conditional(group => this.createComboFormGroup.get('isDeliveryEnabled').value == true, Validators.required)])],

    packingCharge: '',
    deliveryCharge: '',
    taxRates: '',
    skuCodePickup: ['', Validators.compose([Validators.pattern('^[a-zA-Z0-9-]{1,50}$'),ExtraValidators.conditional(group => this.createComboFormGroup.get('isPickupEnabled').value == true, Validators.required)])],
    // skuCodePickup: ["", Validators.compose([Validators.required, Validators.pattern('^[a-zA-Z0-9-]{1,50}$')])],
    packingChargePickup: '',
    taxRatesPickup: '',
    skuCodeDineIn: ['', Validators.compose([Validators.pattern('^[a-zA-Z0-9-]{1,50}$'),ExtraValidators.conditional(group => this.createComboFormGroup.get('isDineinEnabled').value == true, Validators.required)])],
    // skuCodeDineIn: ["", Validators.compose([Validators.required, Validators.pattern('^[a-zA-Z0-9-]{1,50}$')])],
    packingChargeDineIn: '',
    taxRatesDineIn: '',
    deliveryStoreGroupArray: this.fb.array([]),
    pickupStoreGroupArray: this.fb.array([]),
    dineInStoreGroupArray: this.fb.array([]),

  });

  this.loading = false;

  this.createComboFormGroup1 = this.fb.group({

    productFormArray: this.fb.array([]),
    isExclusive: this.viewData['isExclusive'],
    isLimitedTimeCategory: this.viewData['isLimitedTimeCategory'],
    isHealthy: this.viewData['issHealthy'],
    isHotSeller: this.viewData['isHotSeller'],
    productType: this.viewData['comboProductType']
  })
  this.comboNameData();
  let TempCountryArray=[]

  for(let i=0;i<=this.viewData['comboCountry'].length-1;i++){
    TempCountryArray.push(this.viewData['comboCountry'][i]['countryOid']);
  }
  this.createComboFormGroup.get('country').patchValue(TempCountryArray);
  this.selectedCountryOptions = TempCountryArray;
  if(this.countries.length == TempCountryArray.length){
    this.countryInput.selectAllChecked = true;
  }

  this.imagePathAlergion = this.viewData['comboAlergion'];
  this.imagePathDieatry = this.viewData['comboDieatry'];
  this.createComboFormGroup.get('comboType').patchValue(this.viewData['comboType']);
  this.getOrderTypeData()

}

}

getOrderTypeData(){
  for(let i=0;i<=this.viewData['comboOrderType'].length-1;i++){
    if(this.viewData['comboOrderType'][i].orderDeliveryType=='DELIVERY'){
      this.createComboFormGroup.get('isDeliveryEnabled').patchValue(this.viewData['comboOrderType'][i].isOrderDeliveryTypeEnable);
      if(this.viewData['comboOrderType'][i].comboSkuDetails['skuCode']!= null && this.viewData['comboOrderType'][i].comboSkuDetails['skuCode'] != undefined){
        this.createComboFormGroup.get('skuCode').patchValue(this.viewData['comboOrderType'][i].comboSkuDetails['skuCode']);
        this.isDeliveryReadonly = true;
      }
      this.createComboFormGroup.get('packingCharge').patchValue(this.viewData['comboOrderType'][i].comboSkuDetails['packagingCharge']);
      this.createComboFormGroup.get('deliveryCharge').patchValue(this.viewData['comboOrderType'][i].comboSkuDetails['deliveryCharge']);
      this.createComboFormGroup.get('taxRates').patchValue(this.viewData['comboOrderType'][i].comboSkuDetails['taxRate']);
      const control = <FormArray>this.createComboFormGroup.controls['deliveryStoreGroupArray'];
      if(this.viewData['comboOrderType'][i].isOrderDeliveryTypeEnable == true){

      if(this.viewData['comboOrderType'][i].comboStoreGroup != null && this.viewData['comboOrderType'][i].comboStoreGroup != undefined){

      for(let ij=0;ij<=this.viewData['comboOrderType'][i].comboStoreGroup.length-1;ij++){
        let key = this.viewData['comboOrderType'][i].comboStoreGroup[ij];
 
        let tempArray=[];
        for(let key1=0;key1<=key['storeOids'].length-1;key1++){
          let storeObj={
            storeOid:key['storeOids'][key1]
          }
          tempArray.push(storeObj)
        }
        let displayPrice;
        if(this.viewData['displayPriceType'] == 'FIXED_PRICE'){
          displayPrice = key.displayPrice;
        }else{
          displayPrice=  'AUTO CALCULATE'
        }
        let    Obj = {
          activeGroupId:key.comboStoreGroupOid,
          currencyCode:key.currency,
          displayPrice: displayPrice,
          storeOids:tempArray
        }
       
        this.storeGroup.push(Obj);
        let discountType;
        let discountPrice='';
          let discountPrice1=''
        if(key.discountType == 'Fixed Value'){
          discountType='FIXED_VALUE';
          discountPrice=key.discountPrice;
        }else{
          discountType='PERCENTAGE';
          discountPrice1=key.discountPrice;

        }
        const newForm = this.fb.group({
          discountType: discountType,
      isDiscount: key.isDiscount,
    
      discountPrice: '',
     discountPrice1:'',
     finalPrice:displayPrice,
     showFinalPrice:key.finalPrice
  
  
        });
        control.push(newForm);
        if(key.isDiscount){
        let value =  control.controls[control.length-1].get('finalPrice').value;
        let discountAmount = control.controls[control.length-1].get('discountPrice');
        let discountPercentage =  control.controls[control.length-1].get('discountPrice1');
        if( control.controls[control.length-1].get('discountType').value != 'PERCENTAGE'){
          control.controls[control.length-1].get('discountPrice').setValue(discountPrice);
          control.controls[control.length-1].get('discountPrice1').setValue('');

        if(this.createComboFormGroup.get('displayPriceType').value == 'AUTO_CALCULATE'){
            discountAmount.setValidators([Validators.required,Validators.min(1)]);
            discountAmount.updateValueAndValidity();
          }else{
            discountAmount.setValidators([Validators.required,Validators.max(value-1),Validators.min(1)]);
            discountAmount.updateValueAndValidity();
          }
          discountPercentage.clearValidators();
          discountPercentage.updateValueAndValidity();
        }
        else{
          control.controls[control.length-1].get('discountPrice1').setValue(discountPrice1);
          control.controls[control.length-1].get('discountPrice').setValue('');

          discountPercentage.setValidators([Validators.required, Validators.pattern('^([1-9]|[1-9][0-9])$') ])
          discountPercentage.updateValueAndValidity();
          discountAmount.clearValidators();
          discountAmount.updateValueAndValidity();
    
        }
      }          
      }
    }    
    if(this.viewData['comboOrderType'][i].comboCarts.length > 0){
      this.titleData(this.viewData['comboOrderType'][i],'comboCarts')

     }
    // this.titleData(this.viewData['comboOrderType'][i],true)

      }

    }
    else if(this.viewData['comboOrderType'][i].orderDeliveryType=='PICKUP'){
      this.createComboFormGroup.get('isPickupEnabled').patchValue(this.viewData['comboOrderType'][i].isOrderDeliveryTypeEnable);
      if(this.viewData['comboOrderType'][i].comboSkuDetails['skuCode']!= null && this.viewData['comboOrderType'][i].comboSkuDetails['skuCode'] != undefined){
        this.createComboFormGroup.get('skuCodePickup').patchValue(this.viewData['comboOrderType'][i].comboSkuDetails['skuCode']);
        this.isPickupReadonly = true;
      }
      // this.createComboFormGroup.get('skuCodePickup').patchValue(this.viewData['comboOrderType'][i].comboSkuDetails['skuCode']);
      this.createComboFormGroup.get('packingChargePickup').patchValue(this.viewData['comboOrderType'][i].comboSkuDetails['packagingCharge']);
      this.createComboFormGroup.get('taxRatesPickup').patchValue(this.viewData['comboOrderType'][i].comboSkuDetails['taxRate']);
      const control = <FormArray>this.createComboFormGroup.controls['pickupStoreGroupArray'];
      if(this.viewData['comboOrderType'][i].isOrderDeliveryTypeEnable == true){
        if(this.viewData['comboOrderType'][i].comboStoreGroup != null && this.viewData['comboOrderType'][i].comboStoreGroup != undefined){
          for(let ij=0;ij<=this.viewData['comboOrderType'][i].comboStoreGroup.length-1;ij++){
            let key = this.viewData['comboOrderType'][i].comboStoreGroup[ij];
            let tempArray=[];
                for(let key1=0;key1<=key['storeOids'].length-1;key1++){
                  let storeObj={
                    storeOid:key['storeOids'][key1]
                  }
                  tempArray.push(storeObj)
                }
                let displayPrice;
                if(this.viewData['displayPriceType'] == 'FIXED_PRICE'){
                  displayPrice = key.displayPrice;
                }else{
                  displayPrice=  'AUTO CALCULATE'
                }
                let    Obj = {
                  activeGroupId:key.comboStoreGroupOid,
                  currencyCode:key.currency,
                  displayPrice:displayPrice,
                  storeOids:tempArray
                }
          
            this.storeGroupPickup.push(Obj);
            let discountType;
            let discountPrice='';
              let discountPrice1=''
            if(key.discountType == 'Fixed Value'){
              discountType='FIXED_VALUE';
              discountPrice=key.discountPrice;
            }else{
              discountType='PERCENTAGE';
              discountPrice1=key.discountPrice;

            }
            const newForm = this.fb.group({
              discountType: discountType,
          isDiscount: key.isDiscount,

          discountPrice:discountPrice,
        discountPrice1:discountPrice1,
        finalPrice:displayPrice,
        showFinalPrice:key.finalPrice



            });
            control.push(newForm);
            if(key.isDiscount){
            let value =  control.controls[control.length-1].get('finalPrice').value;
            let discountAmount = control.controls[control.length-1].get('discountPrice');
            let discountPercentage =  control.controls[control.length-1].get('discountPrice1');
          
              if( control.controls[control.length-1].get('discountType').value != 'PERCENTAGE'){
                control.controls[control.length-1].get('discountPrice').setValue(discountPrice);
                control.controls[control.length-1].get('discountPrice1').setValue('');
          
              if(this.createComboFormGroup.get('displayPriceType').value == 'AUTO_CALCULATE'){
                  discountAmount.setValidators([Validators.required,Validators.min(1)]);
                  discountAmount.updateValueAndValidity();
                }else{
                  discountAmount.setValidators([Validators.required,Validators.max(value-1),Validators.min(1)]);
                  discountAmount.updateValueAndValidity();
                }
                discountPercentage.clearValidators();
                discountPercentage.updateValueAndValidity();
              }
              else{
                control.controls[control.length-1].get('discountPrice1').setValue(discountPrice1);
                control.controls[control.length-1].get('discountPrice').setValue('');
          
                discountPercentage.setValidators([Validators.required, Validators.pattern('^([1-9]|[1-9][0-9])$') ])
                discountPercentage.updateValueAndValidity();
                discountAmount.clearValidators();
                discountAmount.updateValueAndValidity();
          
              }
            }
          
          }
        }
        if(this.viewData['comboOrderType'][i].comboCarts.length > 0){
         this.titleData(this.viewData['comboOrderType'][i],'comboCartsPickup')

        }
      }
    }
    else{
      this.createComboFormGroup.get('isDineinEnabled').patchValue(this.viewData['comboOrderType'][i].isOrderDeliveryTypeEnable);
      if(this.viewData['comboOrderType'][i].comboSkuDetails['skuCode']!= null && this.viewData['comboOrderType'][i].comboSkuDetails['skuCode'] != undefined){
        this.createComboFormGroup.get('skuCodeDineIn').patchValue(this.viewData['comboOrderType'][i].comboSkuDetails['skuCode']);
        this.isDineINReadonly = true;
      }
      // this.createComboFormGroup.get('skuCodeDineIn').patchValue(this.viewData['comboOrderType'][i].comboSkuDetails['skuCode']);
      this.createComboFormGroup.get('packingChargeDineIn').patchValue(this.viewData['comboOrderType'][i].comboSkuDetails['packagingCharge']);
      this.createComboFormGroup.get('taxRatesDineIn').patchValue(this.viewData['comboOrderType'][i].comboSkuDetails['taxRate']);
      const control = <FormArray>this.createComboFormGroup.controls['dineInStoreGroupArray'];
      if(this.viewData['comboOrderType'][i].isOrderDeliveryTypeEnable == true){
      if(this.viewData['comboOrderType'][i].comboStoreGroup != null && this.viewData['comboOrderType'][i].comboStoreGroup != undefined){

      for(let ij=0;ij<=this.viewData['comboOrderType'][i].comboStoreGroup.length-1;ij++){
        let key = this.viewData['comboOrderType'][i].comboStoreGroup[ij];
        let tempArray=[];
        for(let key1=0;key1<=key['storeOids'].length-1;key1++){
          let storeObj={
            storeOid:key['storeOids'][key1]
          }
          tempArray.push(storeObj)
        }
        let displayPrice;
        if(this.viewData['displayPriceType'] == 'FIXED_PRICE'){
          displayPrice = key.displayPrice;
        }else{
          displayPrice=  'AUTO CALCULATE'
        }
        let    Obj = {
          activeGroupId:key.comboStoreGroupOid,
          currencyCode:key.currency,
          displayPrice: displayPrice,
          storeOids:tempArray
        }
        this.storeGroupDine.push(Obj);
        let discountType;
        let discountPrice='';
          let discountPrice1=''
        if(key.discountType == 'Fixed Value'){
          discountType='FIXED_VALUE';
          discountPrice=key.discountPrice;
        }else{
          discountType='PERCENTAGE';
          discountPrice1=key.discountPrice;

        }
        const newForm = this.fb.group({
          discountType: discountType,
      isDiscount: key.isDiscount,
    
      discountPrice:discountPrice,
     discountPrice1:discountPrice1,
     finalPrice:displayPrice,
     showFinalPrice:key.finalPrice
  
  
  
        });
        control.push(newForm);
        if(key.isDiscount){
          let value =  control.controls[control.length-1].get('finalPrice').value;
          let discountAmount = control.controls[control.length-1].get('discountPrice');
          let discountPercentage =  control.controls[control.length-1].get('discountPrice1');
          if( control.controls[control.length-1].get('discountType').value != 'PERCENTAGE'){
            control.controls[control.length-1].get('discountPrice').setValue(discountPrice);
            control.controls[control.length-1].get('discountPrice1').setValue('');
  
          if(this.createComboFormGroup.get('displayPriceType').value == 'AUTO_CALCULATE'){
              discountAmount.setValidators([Validators.required,Validators.min(1)]);
              discountAmount.updateValueAndValidity();
            }else{
              discountAmount.setValidators([Validators.required,Validators.max(value-1),Validators.min(1)]);
              discountAmount.updateValueAndValidity();
            }
            discountPercentage.clearValidators();
            discountPercentage.updateValueAndValidity();
          }
          else{
            control.controls[control.length-1].get('discountPrice1').setValue(discountPrice1);
            control.controls[control.length-1].get('discountPrice').setValue('');
  
            discountPercentage.setValidators([Validators.required, Validators.pattern('^([1-9]|[1-9][0-9])$') ])
            discountPercentage.updateValueAndValidity();
            discountAmount.clearValidators();
            discountAmount.updateValueAndValidity();
      
          } 
        }
        
      }
    }
    if(this.viewData['comboOrderType'][i].comboCarts.length > 0){
      this.titleData(this.viewData['comboOrderType'][i],'comboCartsDineIn')

     }

  }
    
    }

  }
}

getParentList(brandId, value) {
   this.selectedCategoryOptions = [];
   if(!value){
    this.categoryInput.selectAllChecked = false;
   }
  this.storeGroup = [];
  this.storeGroupPickup=[];
  this.storeGroupDine=[];
  this.updateValidation(this.createComboFormGroup.get('comboType').value,true);
  this.updateValidatiopn();
  if (brandId.length != 0) {
    this.http
      .getJson(
        environment.APIEndpoint +
        "api/rpa/productcategory/v1/get/brandCategories?brandId=" + brandId)
      .subscribe(response => {
        console.log(response);
        this.categoriesList = [];
        response.forEach(response => {
          this.categoriesList.push({
            "categoryId": response.categoryId,
            "categoryName": response.categoryName,
            "direction": response.direction,
            "parentProductCategoryId": response.parentProductCategoryId,
            "status": response.status,
            "value": response.categoryId
          });
          var uniqueArray = this.removeDuplicatesJSON(this.categoriesList, 'categoryId');
          console.log(uniqueArray);
          this.categoriesList = uniqueArray;
        });
        console.log(this.categoriesList);
        if(value){
          let TempCategory=[];
          for(let i=0;i<=this.viewData['comboCategory'].length-1;i++){
            TempCategory.push(this.viewData['comboCategory'][i]['categoryOid'])
          }
            this.createComboFormGroup.get('categoryOids').patchValue(TempCategory);
            this.selectedCategoryOptions = TempCategory;
                  if(this.categoriesList.length == TempCategory.length){
            this.categoryInput.selectAllChecked = true
          }
        }
        // this.buildForm(true);

      }, err => {
        console.log(err);
      });
  }
  else {
    this.categoriesList = [];
  }
}
currencyCode = []
getAllCountries(brandId , value) {
  this.countries = [];
  if (brandId.length != 0) {
    console.log(brandId);
    let GET_ALL_COUNTRIES =
      environment.APIEndpoint + "api/rpa/master/brand/v1/get/regions";
    this.http
      .getJson(GET_ALL_COUNTRIES + "?brandOid=" + brandId)
      .subscribe(response => {
        console.log(response);
        this.countries = response;
        response.forEach(res => {
          this.countries.push({
            countryCode: res.countryCode,
            countryId: res.countryId,
            countryName: res.countryName,
            currencyCode: res.currencyCode,
            languageDirection: res.languageDirection,
            value: res.countryId
          });
        });
        var uniqueArray = this.removeDuplicatesJSON(
          this.countries,
          "countryId"
        );
        this.countries = uniqueArray;
        console.log("push all data", this.countries);

            if(value == true){
              this.buildForm(true);

            }
      });
  } else {
    this.countries = [];
  }
}

titleTab(type){
  const control = <FormArray>this.createComboFormGroup.get(type);
  let newGroup = this.fb.group({
    comboCartLocales: this.fb.array([]),
    comboCartProduct: this.fb.array([]),
    addCartType: '',
    comboCategoryList: this.fb.array([]),
    noOfVariantSelectionFromList:1

  });
  control.push(newGroup);
  this.comboCartLocalesPickup(control.controls[control.length - 1]);

}
public titleData(value,type) {
  const control = <FormArray>this.createComboFormGroup.get(type);
  // const control1 = <FormArray>this.createComboFormGroup.get('comboCartsPickup');
  // const control2 = <FormArray>this.createComboFormGroup.get('comboCartsDineIn');
  // if(value.orderDeliveryType == 'DELIVERY'){
    if(value['comboCarts'] != null && value['comboCarts'] != undefined){

    for(let i=0;i<=value['comboCarts'].length-1;i++){
      let newGroup = this.fb.group({

        comboCartLocales: this.fb.array([]),
        comboCartProduct: this.fb.array([]),
        addCartType: value['comboCarts'][i].addCartType,
        comboCategoryList: this.fb.array([]),
        noOfVariantSelectionFromList: value['comboCarts'][i].noOfVariantSelectionFromList == null ? 0 : value['comboCarts'][i].noOfVariantSelectionFromList
    
    
      });
      control.push(newGroup);
       this.customizationAddonLocale = value['comboCarts'][i]['comboCartLocales'];
      this.comboCartLocales(control.controls[control.length - 1],true);
      this.selectedProductsResult = value['comboCarts'][i]['comboCartProduct'];
      this.selectedCategoryResult = value['comboCarts'][i]['comboCartCategory'];
       this.getProductData(value['comboCarts'][i],control.controls[control.length - 1],i)
    }
  }

    // }
    // else if(value.orderDeliveryType == 'PICKUP'){
    //   if(value['comboCarts'] != null && value['comboCarts'] != undefined){

    //   for(let i=0;i<=value['comboCarts'].length-1;i++){
    //     let newGroup = this.fb.group({
  
    //       comboCartLocales: this.fb.array([]),
    //       comboCartProduct: this.fb.array([]),
    //       addCartType: value['comboCarts'][i].addCartType,
    //       comboCategoryList: this.fb.array([]),
    //       noOfVariantSelectionFromList: value['comboCarts'][i].noOfVariantSelectionFromList == null ? 0 : value['comboCarts'][i].noOfVariantSelectionFromList
      
      
    //     });
    //     control1.push(newGroup);
    //     this.customizationAddonLocale = value['comboCarts'][i]['comboCartLocales'];
    //     this.comboCartLocales(control1.controls[control1.length - 1],true);
    //     this.selectedProductsResult = value['comboCarts'][i]['comboCartProduct'];
    //     this.selectedCategoryResult = value['comboCarts'][i]['comboCartCategory'];
    //      this.getProductData(value['comboCarts'][i],control1.controls[control1.length - 1],i)
    //   }
    // }
    // }else{
    //   if(value['comboCarts'] != null && value['comboCarts'] != undefined){

    //   for(let i=0;i<=value['comboCarts'].length-1;i++){
    //     let newGroup = this.fb.group({
  
    //       comboCartLocales: this.fb.array([]),
    //       comboCartProduct: this.fb.array([]),
    //       addCartType: value['comboCarts'][i].addCartType,
    //       comboCategoryList: this.fb.array([]),
    //       noOfVariantSelectionFromList: value['comboCarts'][i].noOfVariantSelectionFromList == null ? 0 : value['comboCarts'][i].noOfVariantSelectionFromList
      
      
    //     });
    //     control2.push(newGroup);
    //     this.customizationAddonLocale = value['comboCarts'][i]['comboCartLocales'];
    //     this.comboCartLocales(control2.controls[control2.length - 1],true);
    //     this.selectedProductsResult = value['comboCarts'][i]['comboCartProduct'];
    //     this.selectedCategoryResult = value['comboCarts'][i]['comboCartCategory'];
    //      this.getProductData(value['comboCarts'][i],control2.controls[control2.length - 1],i)
    //   }
    // }
    // }
  
  // let tempLength = this.createComboFormGroup.get('comboCarts').value;
  // this.createComboFormGroup.patchValue({
  //   noOfStep: tempLength.length
  // });
  
 


}
public titleDataClone(comboCart,value) {

  const control = <FormArray>this.createComboFormGroup.get(comboCart);


 let newGroup = this.fb.group({

   comboCartLocales: this.fb.array([]),
   comboCartProduct: this.fb.array([]),
   addCartType: value.addCartType,
   comboCategoryList: this.fb.array([]),
   noOfVariantSelectionFromList:value.noOfVariantSelectionFromList


 });
 control.push(newGroup);


 this.comboCartLocales(control.controls[control.length - 1],true);
 this.getCloneProductData(value,control.controls[control.length - 1])



}
public comboCartLocalesPickup(control) {

  const array = <FormArray>control.controls['comboCartLocales'];
  for (let ln of this.languageList) {
    let arr = this.fb.group({
      languageOid: ln.languageId,
      languageName: ln.languageName,
      comboCartName: ['', Validators.compose([Validators.required, Validators.minLength(2), Validators.pattern('^[a-zA-Z0-9\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF \"&\'(),-:.?_ ]*')])]
    });
    array.push(arr);


  }
}
public comboCartLocalesDineIn(control) {

  const array = <FormArray>control.controls['comboCartLocales'];
  for (let ln of this.languageList) {
    let arr = this.fb.group({
      languageOid: ln.languageId,
      languageName: ln.languageName,
      comboCartName: ['', Validators.compose([Validators.required, Validators.minLength(2), Validators.pattern('^[a-zA-Z0-9\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF \"&\'(),-:.?_ ]*')])]
    });
    array.push(arr);


  }
}

selectedCategoryResult=[]
getProductData(value,control,i){
  if(value.addCartType=='product'){
    if (value['comboCartProduct'] != undefined) {
      const array1 = <FormArray>control.controls['comboCartProduct'];
    let  productPrize = 0
      for (let ln of this.selectedProductsResult) {
        let arr = this.fb.group({
          displayPrice: [ln.productPrice],
          productName: [ln.productName],
          imagePath: [this.filePathUrl+ln.productImage],
          skuCode: [ln.productSkuCode],
          maxQuantityPerProduct: ln.maxQuantityPerProduct,
          noOfVariantSelectionFromList: ln.noOfVariantSelectionFromList,
          productSkuCode: [ln.productSkuCode],
          productQuantity: [ln.productQuantity],
          varientName:['( '+ln.variantType+' )'],


          productOid: [ln.productOid],
          availableFrom: ln.availableFrom,
          availableTo: ln.availableTo


        });
        array1.push(arr);
        if(this.createComboFormGroup.get('comboType').value == 'FIXED'){
          let productQuantity = array1.controls[array1.length-1].get('productQuantity');
          array1.controls[array1.length-1].get('productQuantity').setValue(ln.productQuantity);
          productQuantity.setValidators([Validators.required,Validators.min(1)]);
          productQuantity.updateValueAndValidity();
        } 
        // productPrize = productPrize + ln.productPrice;



      
      }
    

      // control1.controls[i].patchValue({ totalProductPrize: productPrize });

    }
  }else{
    if (value['comboCartCategory'] != undefined) {

      const categoryArray = <FormArray>control.controls['comboCategoryList']
           
      const array1 = <FormArray>control.controls['comboCartProduct'];
      for(let j=0;j<=this.selectedCategoryResult.length-1;j++){

          let arr = this.fb.group({
            categoryName:this.selectedCategoryResult[j].categoryName,
            categoryId:this.selectedCategoryResult[j].categoryOid
          })
          categoryArray.push(arr);
  
          let  productPrize = 0

        for (let ln of this.selectedCategoryResult[j]['comboCartCategoryProduct']) {
          let arr = this.fb.group({
            displayPrice: [ln.productPrice],
            productName: [ln.productName],
            imagePath: [this.filePathUrl+ln.productImage],
            tax: [ln.productTax],
            skuCode: [ln.productSkuCode],
            maxQuantityPerProduct: ln.maxQuantityPerProduct,
            noOfVariantSelectionFromList: ln.noOfVariantSelectionFromList,
            variantOid: [ln.variantOid],//backend data required
            productSkuCode: [ln.productSkuCode],
            productQuantity: [ln.productQuantity],
            productOid: [ln.productOid],


         
            categoryName: [this.selectedCategoryResult[j].categoryName],
         
            categoryId: [this.selectedCategoryResult[j].categoryOid],
            varientName:['( '+ln.variantType+' )'],
            availableFrom: ln.availableFrom,
            availableTo: ln.availableTo

          });
          array1.push(arr);
        

        }
        // const control1 = <FormArray>this.createComboFormGroup.get('comboCarts');

        // control1.controls[i].patchValue({ totalProductPrize: productPrize });
  
      }
     
    }
  }



}


public comboCartLocales(control,isPrePopulated) {
  if(isPrePopulated == false){
    const array = <FormArray>control.controls['comboCartLocales'];
    for (let ln of this.languageList) {
      let arr = this.fb.group({
        languageOid: ln.languageId,
        languageName: ln.languageName,
        comboCartName: ['', Validators.compose([Validators.required, Validators.minLength(2), Validators.pattern('^[a-zA-Z0-9\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF \"&\'(),-:.?_ ]*')])]
      });
      array.push(arr);
  }



  }else{
    const array = <FormArray>control.controls['comboCartLocales'];
    for (let ln of this.customizationAddonLocale) {
      let arr = this.fb.group({
        languageOid: ln.languageOid,
        languageName: ln.languageName,
        comboCartName: [ln.comboCartName, Validators.compose([Validators.required, Validators.minLength(2), Validators.pattern('^[a-zA-Z0-9\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF \"&\'(),-:.?_ ]*')])]
      });
      array.push(arr);
     
    }


  
}
}




comboNameData1() {
  const control = <FormArray>this.createComboFormGroup.controls['comboLocales'];
  for (let i = 0; i < this.viewData['comboLocales'].length; i++) {
    const newForm = this.fb.group({
      comboName: [this.viewData['comboLocales'][i]['comboName'], Validators.compose([Validators.required, Validators.minLength(2), 
      Validators.pattern('^[a-zA-Z0-9\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF \"&\'(),-:.?_ ]*')])],
      languageOid:this.viewData['comboLocales'][i]['languageOid'],
      languageName:this.viewData['comboLocales'][i]['languageName']

    });
    control.push(newForm);
    this.alignCss.push(this.viewData['comboLocales'][i]['langDirectionType'] == 'RTL' ? 'text-right' : '');
  }
}

comboNameData() {
  const control = <FormArray>this.createComboFormGroup.controls['comboLocales'];
  const control1 = <FormArray>this.createComboFormGroup1.controls['productFormArray'];
  for (let i = 0; i < this.viewData['comboLocales'].length; i++) {
    const newForm = this.fb.group({
      comboName: [this.viewData['comboLocales'][i]['comboName'], Validators.compose([Validators.required, Validators.minLength(2), 
      Validators.pattern('^[a-zA-Z0-9\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF \"&\'(),-:.?_ ]*')])],
      languageOid:this.viewData['comboLocales'][i]['languageOid'],
      languageName:this.viewData['comboLocales'][i]['languageName']

    });
    control.push(newForm);
    this.alignCss.push(this.viewData['comboLocales'][i]['langDirectionType'] == 'RTL' ? 'text-right' : '');
  }
  for (let i = 0; i < this.viewData['comboDescription'].length; i++) {

    let newGroup = this.fb.group({
      additionalDescription: this.viewData['comboDescription'][i].additionalDescription, 
      ingredients: this.viewData['comboDescription'][i].ingredients,
      description: this.viewData['comboDescription'][i].description,
      languageOid: this.viewData['comboDescription'][i].languageOid,
      languageName:this.viewData['comboDescription'][i].languageName
    });
    control1.push(newGroup);
    // this.alignCss.push(this.languageList[i].direction == 'RTL' ? 'text-right' : '');
    this.rightPanel.push(this.viewData['comboDescription'][i].languageName == 'Arabic' ? 'right-panel' : '');
    this.languageDirection.push(this.viewData['comboDescription'][i].languageName == 'Arabic' ? 'direction' : '');
  }
}
updateValidation(value, isPrePopulated) {
  const control = <FormArray>this.createComboFormGroup.get('comboCarts');
  const control1 = <FormArray>this.createComboFormGroup.get('comboCartsPickup');
  const control2 = <FormArray>this.createComboFormGroup.get('comboCartsDineIn');

  while (control.length) {
    control.removeAt(control.length - 1);
  }
  while (control1.length) {
    control1.removeAt(control1.length - 1);
  }
  while (control2.length) {
    control2.removeAt(control2.length - 1);
  }
  // this.titleData('',false)
  // this.createComboFormGroup.get('displayPrice').patchValue(0);
  if (value == 'FIXED') {
    this.createComboFormGroup.get('displayPriceType').patchValue('FIXED_PRICE');
    // this.updateValidatiopn('AUTO_CALCULATE')
  }
  if(isPrePopulated == false){
    this.createComboFormGroup.get('isDeliveryEnabled').patchValue(true);
    this.createComboFormGroup.get('isPickupEnabled').patchValue(false);
    this.createComboFormGroup.get('isDineinEnabled').patchValue(false);

    this.titleTab('comboCarts');
  }
}
updateValidatiopn() {
  // this.selectedCountryOptions =[];
  // this.selectedCategoryOptions = [];
  const control = <FormArray>this.createComboFormGroup.get('deliveryStoreGroupArray');
  const control1 = <FormArray>this.createComboFormGroup.get('pickupStoreGroupArray');
  const control2 = <FormArray>this.createComboFormGroup.get('dineInStoreGroupArray');
  // this.createComboFormGroup.get('country').patchValue('');
  // this.createComboFormGroup.get('categoryOids').patchValue('');
  this.storeGroup=[];
  this.storeGroupPickup=[];
  this.storeGroupDine=[]
  while (control.length) {
    control.removeAt(control.length - 1);
  }
  while (control1.length) {
    control1.removeAt(control1.length - 1);
  }
  while (control2.length) {
    control2.removeAt(control2.length - 1);
  }
}
radioOptions=['PERCENTAGE','FIXED_VALUE']
updateDiscount(section,event: MatRadioChange,type, index) {
  const control1 = <FormArray>this.createComboFormGroup.get(type);
  let value =  control1.controls[index].get('finalPrice').value;
  let discountAmount = control1.controls[index].get('discountPrice');
  let discountPercentage =  control1.controls[index].get('discountPrice1');
 console.log(control1.controls[index].get('discountType').value);
 control1.controls[index].get('discountType').patchValue(section)
  if( control1.controls[index].get('discountType').value != 'PERCENTAGE'){
    control1.controls[index].get('discountPrice').setValue('');
    control1.controls[index].get('showFinalPrice').patchValue(value);
    
   if(this.createComboFormGroup.get('displayPriceType').value == 'AUTO_CALCULATE'){
      discountAmount.setValidators([Validators.required,Validators.min(1)]);
      discountAmount.updateValueAndValidity();
    }else{
      discountAmount.setValidators([Validators.required,Validators.max(value-1),Validators.min(1)]);
      discountAmount.updateValueAndValidity();
    }
    discountPercentage.clearValidators();
    discountPercentage.updateValueAndValidity();
  }
  else{
    control1.controls[index].get('discountPrice1').setValue('');
    control1.controls[index].get('showFinalPrice').patchValue(value);
    discountPercentage.setValidators([Validators.required, Validators.pattern('^([1-9]|[1-9][0-9])$') ])
    discountPercentage.updateValueAndValidity();
    discountAmount.clearValidators();
    discountAmount.updateValueAndValidity();

  }

}
public removeImage(index) {
  this.imagePath.splice(index, 1);
}
public uploadImage(event: FileList) {
  this.imageErr = false;
  this.imageErrMsg = "";
  this.imgUpload = true;
  if (
    event[0].type == "image/jpeg" ||
    event[0].type == "image/png" ||
    event[0].type == "image/jpg"
  ) {
    if (event[0].size < 5000000) {
      this.uploadFile
        .upload(event.item(0), "combo", "images")
        .subscribe(
          response => {
            this.imagePath.push(response["message"]);
            this.imgUpload = false;
            this.snackBar.openFromComponent(SnackBarComponent, {
              duration: 1500,
              data: {
                status: "success",
                message: " image successfully uploaded"
              }
            });
          },
          err => { }
        );
    } else {
      this.imageErr = true;
      this.imageErrMsg = "Max upload file size is 5Mb";
    }
  } else {
    this.imageErr = true;
    this.imageErrMsg = "Supported format is JPG, JPEG and PNG";
  }
}

variantPopupData = []
// onCloseClick(i) {
//   const control = this.createComboFormGroup.get('comboCarts') as FormArray;
//   control.removeAt(i);
//   let tempLength = this.createComboFormGroup.get('comboCarts').value;
//   this.createComboFormGroup.patchValue({
//     noOfStep: tempLength.length
//   });
// }
onCloseClick(i,type) {
  const control = <FormArray>this.createComboFormGroup.get(type);
  // const control1 = <FormArray>this.createComboFormGroup.get('comboCartsPickup');
  // const control2 = <FormArray>this.createComboFormGroup.get('comboCartsDineIn');

  control.removeAt(i);
  // control1.removeAt(i);
  // control2.removeAt(i);
  // let tempLength = this.createComboFormGroup.get('comboCarts').value;
  // this.createComboFormGroup.patchValue({
  //   noOfStep: tempLength.length
  // });
}
openVarientDialog(event, type, control, i) {
  const array1 = <FormArray>control['comboCartLocales'];

  const control1 = <FormArray>this.createComboFormGroup.get(type);

  this.variantPopupData = [];

    let obj = {
    
      "variantTypeName": array1.value[0]['comboCartName'],
      "maxSelectionCustAddons": control1.controls[i].get('noOfVariantSelectionFromList').value,
     
    }
    this.variantPopupData.push(obj);
  const dialogConfig = new MatDialogConfig();
  let TempPopUPData = this.variantPopupData;
 


  dialogConfig.autoFocus = false;
  const dialogRef = this.dialog.open(VarientDialogComponent, { panelClass: 'dialogVariantStyleChange' });
  dialogRef.componentInstance.popUPData = TempPopUPData;

  dialogRef.afterClosed().subscribe(result => {
    if (result != undefined) {
      if (result['tableData'].productVariants.length > 0) {
        control1.controls[i].get('noOfVariantSelectionFromList').patchValue(result['tableData'].productVariants[0].maxSelectionCustAddons)
      }
    }
  });

}

contentLoader = false;



selectedProductsResult = [];
comboCategoryList = [];
productPrize;
openCategoryPopUP(type, control, i,orderType) {

  const dialogConfig = new MatDialogConfig();
  
  dialogConfig.width = "unset";
  dialogConfig.height = 'auto';
  dialogConfig.autoFocus = false;
  dialogConfig.panelClass = 'view-product-dialogue';
  const control1 = <FormArray>this.createComboFormGroup.get(type);
  this.productPrize = 0;
  let checkData = control['comboCartProduct'].value;
  let selectedData = [];
  let TempData = [];

  
  for (let i = 0; i <= checkData.length - 1; i++) {
    let key = checkData[i]['skuCode'];
    selectedData.push(key);
    TempData.push(checkData[i])
  }
  let checkCategoryId = control['comboCategoryList'].value;
  let categoryIdList =[];
  for(let i=0;i<=checkCategoryId.length-1;i++){
    categoryIdList=checkCategoryId[i]['categoryId']
  }
  const dialogRef = this.dialog.open(CategoryPopupComponent, dialogConfig);
   dialogRef.componentInstance.orderType = orderType;
   dialogRef.componentInstance.brandOid = this.createComboFormGroup.get('brand').value;
  dialogRef.componentInstance.TempCategoryList = control['comboCategoryList'].value;
  this.selectedProductsResult = []

  dialogRef.afterClosed().subscribe(result => {
    console.log(result['Value']);
    if (result['Value'] != undefined) {
      const control2 = <FormArray>control['comboCartProduct'];
      while (control2.length) {
        control2.removeAt(control2.length - 1);
      }

      this.selectedProductsResult = result['Value'];

      const array = <FormArray>control['comboCartProduct'];
     
      const categoryArray = <FormArray>control['comboCategoryList']
      while (categoryArray.length) {
        categoryArray.removeAt(categoryArray.length - 1);
      }
      control1.controls[i].patchValue({ addCartType: 'category' });

      for(let ln of result['categoryList']){
        let arr = this.fb.group({
          categoryName:ln['categoryName'],
          categoryId:ln['categoryId']
        })
        categoryArray.push(arr);

      }
   

      for (let ln of this.selectedProductsResult) {
        let arr = this.fb.group({
          displayPrice: [ln.displayPrice],
          productName: [ln.productName1],
          imagePath: [ln.imagePath],
          tax: [ln.tax],
          skuCode: [ln.skuCode],
          
          noOfVariantSelectionFromList: 0,
          variantOid: [ln.variantOid],
          categoryName: [ln.categoryName],
          productOid: [ln.productOid],
          productSkuCode: [ln.skuCode],
          productQuantity: 1,
          categoryId: [ln.categoryId],
          varientName:[ln.varientName],
          availableFrom:ln.availableFrom,
          availableTo:ln.availableTo
        });
        array.push(arr);
      }
      
    }
  });
}
deleteCategoryProducts(control, i,childInd,type) {
  const categoryList = <FormArray>control['comboCategoryList'];
   const categoryIdValue = categoryList.at(childInd).get('categoryId').value;
  const control2 = <FormArray>control['comboCartProduct'];
  if(categoryList.length == 1){
   
      while (control2.length) {
        control2.removeAt(control2.length - 1);
      }
         categoryList.removeAt(childInd);
         const control1 = <FormArray>this.createComboFormGroup.get(type);
         control1.controls[i].patchValue({ addCartType: '' });

         
  }else{

  let TempArray =[]
  for(let j=0; j<=control2.length-1;j++){
    let categoryId1 =  control2.controls[j].get('categoryId').value;
    if(categoryIdValue != categoryId1 ){
      TempArray.push(control2.controls[j].value);
    }
  }
  categoryList.removeAt(childInd);
  while (control2.length) {
    control2.removeAt(control2.length - 1);
  }

  for (let ln of TempArray) {
    let arr = this.fb.group({
      displayPrice: [ln.displayPrice],
      productName: [ln.productName],
      imagePath: [ln.imagePath],
      tax: [ln.tax],
      skuCode: [ln.skuCode],
      
      noOfVariantSelectionFromList: 0,
      variantOid: [ln.variantOid],
      categoryName: [ln.categoryName],
      productOid: [ln.productOid],
      productSkuCode: [ln.skuCode],
      productQuantity: 1,
      categoryId: [ln.categoryId],
      varientName: [ln.varientName]
    });
    control2.push(arr);

  }
}
  
}

public removeCustomization(i, index,type) {
     
  const control = this.createComboFormGroup.get(type) as FormArray;
  const removeAddon = control.at(i).get('comboCartProduct') as FormArray;
  removeAddon.removeAt(index);
  if(removeAddon.length == 0){    
    control.controls[i].patchValue({ addCartType: '' });
  }
}
openProductPopUP(type, control, i,orderType) {
  
  const dialogConfig = new MatDialogConfig();
  dialogConfig.data = {
    orderId: '',
    storeOid: 133
  }
  dialogConfig.width = "unset";
  dialogConfig.height = 'auto';
  dialogConfig.autoFocus = false;
  dialogConfig.panelClass = 'view-product-dialogue';
  let checkData = control['comboCartProduct'].value;
  let selectedData = [];
  let TempData = [];
  const control1 = <FormArray>this.createComboFormGroup.get(type);
  this.productPrize = 0;
  for (let i = 0; i <= checkData.length - 1; i++) {
    let key = checkData[i]['skuCode'];
    selectedData.push(key);
    TempData.push(checkData[i])
  }
  // if (checkData.length > 0) {
  //   this.productPrize = control1.controls[i].get('totalProductPrize').value;

  // }

  const dialogRef = this.dialog.open(ProductPopupComponent, dialogConfig);
  dialogRef.componentInstance.ProductListData = selectedData;
  dialogRef.componentInstance.selectedData = TempData; 
  dialogRef.componentInstance.orderType = orderType; 
  dialogRef.componentInstance.brandOid = this.createComboFormGroup.get('brand').value;



  dialogRef.afterClosed().subscribe(result => {
    console.log(result['Value']);
    if (result['Value'] != undefined) {
      const control2 = <FormArray>control['comboCartProduct'];
      while (control2.length) {
        control2.removeAt(control2.length - 1);
      }
      this.selectedProductsResult = result['Value'];
      const array = <FormArray>control['comboCartProduct'];



      control1.controls[i].patchValue({ addCartType: 'product' });
      console.log(this.createComboFormGroup.get('comboCarts').value)
      // let productPrize = 0;

      for (let ln of this.selectedProductsResult) {
        let arr = this.fb.group({
          displayPrice: [ln.displayPrice],
          productName: [ln.productName1],
          imagePath: [ln.imagePath],
          tax: [ln.tax],
          skuCode: [ln.skuCode],
          
          noOfVariantSelectionFromList: 0,
          variantOid: [ln.variantOid],
          productSkuCode: [ln.skuCode],
          productQuantity: 1,


          productOid: [ln.productOid],
          varientName:[ln.varientName],
          availableFrom:ln.availableFrom,
          availableTo:ln.availableTo

        });
        array.push(arr);
        if(this.createComboFormGroup.get('comboType').value == 'FIXED'){
          let productQuantity = array.controls[array.length-1].get('productQuantity');
          array.controls[array.length-1].get('productQuantity').setValue(1);
          productQuantity.setValidators([Validators.required,Validators.min(1)]);
          productQuantity.updateValueAndValidity();
        } 
        // productPrize = productPrize + ln.displayPrice;



      }
      // control1.controls[i].patchValue({ totalProductPrize: productPrize });


      // let Cvalue = this.createComboFormGroup.get('displayPrice').value + productPrize - this.productPrize;
      // if (this.createComboFormGroup.get('displayPriceType').value != 'FIXED_PRICE') {
      //   this.createComboFormGroup.get('displayPrice').patchValue(Cvalue);
      // }




    }


  });


}

CheckDiscountType(event,type,index) {
  const control1 = <FormArray>this.createComboFormGroup.get(type);
  if (event.checked) {
    control1.controls[index].get( 'isDiscount').patchValue(true);
    control1.controls[index].get( 'discountType').patchValue('')
    let finalPrice =  control1.controls[index].get('finalPrice').value;
    control1.controls[index].get('showFinalPrice').patchValue(finalPrice);
    // this.createComboFormGroup.patchValue({
    //   isDiscount: true
    // });
  } else {
    // this.createComboFormGroup.get('isDiscount').patchValue(false);
    control1.controls[index].get( 'isDiscount').patchValue(false);
    control1.controls[index].get( 'discountType').patchValue('')
    let finalPrice =  control1.controls[index].get('finalPrice').value;
    control1.controls[index].get('showFinalPrice').patchValue(finalPrice);

  }
}
openDialog(groupType,index) {
  let valueType = this.createComboFormGroup.get('displayPriceType').value;

  const control = <FormArray>this.createComboFormGroup.controls[groupType];

  const dialogRef = this.dialog.open(ComboStorePopupComponent);
  this.selectedStorearray=[];
  dialogRef.componentInstance.totalCount = this.onLoadStoreCount;
  dialogRef.componentInstance.valueType = valueType;
  dialogRef.componentInstance.brandId = this.createComboFormGroup.get('brand').value;
  if(index == 'new'){
    let group;
    if(groupType == 'deliveryStoreGroupArray'){
      group = this.storeGroup;
    }else if(groupType == 'pickupStoreGroupArray'){
      group = this.storeGroupPickup;
    }else{
      group = this.storeGroupDine;
    }
    if(group.length > 0){
      for(let i=0;i<=group.length-1;i++){
        for(let j=0; j<=group[i].storeOids.length-1;j++){
          this.selectedStorearray.push(group[i].storeOids[j].storeOid)

        }
      }
    }
 
    this.activeGroupId=0;
    dialogRef.componentInstance.activeGroupId = 0;
    dialogRef.componentInstance.storeList = this.selectedStorearray;

  }else{

    let group;
    if(groupType == 'deliveryStoreGroupArray'){
      group = this.storeGroup;
    }else if(groupType == 'pickupStoreGroupArray'){
      group = this.storeGroupPickup;
    }else{
      group = this.storeGroupDine;
    }
    let storesForEdit=[]

    for(let i=0;i<=group[index].storeOids.length-1;i++){
      storesForEdit.push(group[index].storeOids[i].storeOid)
    }
    if(group.length > 0){
      for(let i=0;i<=group.length-1;i++){
        for(let j=0; j<=group[i].storeOids.length-1;j++){
          this.selectedStorearray.push(group[i].storeOids[j].storeOid)

        }
      }
    }
    dialogRef.componentInstance.activeGroupId = group[index].activeGroupId;
    this.activeGroupId = group[index].activeGroupId;
    dialogRef.componentInstance.storeList = this.selectedStorearray;
    dialogRef.componentInstance.displayPriceCurrency = group[index].currencyCode;
    dialogRef.componentInstance.displayPrice = group[index].displayPrice;
    dialogRef.componentInstance.storesForEdit = storesForEdit

  }
  dialogRef.afterClosed().subscribe(result => {
    if (result.buttonName === 'SELECT') {
      let finalPrice=0;

      if(this.activeGroupId != 0){
        if(groupType == 'deliveryStoreGroupArray'){
          this.storeGroup[index]=result.tableData;
          finalPrice=result.tableData['displayPrice'];

        }else if(groupType == 'pickupStoreGroupArray'){
          this.storeGroupPickup[index] = result.tableData;
          finalPrice=result.tableData['displayPrice'];

        }else{
          this.storeGroupDine[index]= result.tableData;
          finalPrice=result.tableData['displayPrice'];
        }
        control.controls[index].get('finalPrice').patchValue(finalPrice);
        let showFinalPrice;
        if(control.controls[index].get('discountType').value == 'PERCENTAGE'){
          showFinalPrice= control.controls[index].get('discountPrice1').value;
          let percentage = (showFinalPrice / 100) * finalPrice;
        let finalAmount = finalPrice - percentage
        control.controls[index].get('showFinalPrice').patchValue(finalAmount);
            }else{
          showFinalPrice= control.controls[index].get('discountPrice').value;
          let finalAmount = finalPrice - showFinalPrice;
          control.controls[index].get('showFinalPrice').patchValue(finalAmount);
        }

      }else{
        if(groupType == 'deliveryStoreGroupArray'){

        this.storeGroup.push(result.tableData);
        finalPrice=result.tableData['displayPrice'];
        }else if(groupType == 'pickupStoreGroupArray'){
          this.storeGroupPickup.push(result.tableData);
          finalPrice=result.tableData['displayPrice'];

        }else{
          this.storeGroupDine.push(result.tableData);
          finalPrice=result.tableData['displayPrice'];
        }
              
        
                const newForm = this.fb.group({
                  discountType: '',
              isDiscount: false,
            
              discountPrice:[''],
             discountPrice1:[''],
             finalPrice:finalPrice,
             showFinalPrice:finalPrice
        
        
          
                });
                control.push(newForm);

      
    }

       console.log(control.controls[control.length-1].get('discountType').value)
       console.log(control)
    }else if(result.buttonName === 'REMOVE'){
      if(groupType == 'deliveryStoreGroupArray'){
        this.storeGroup.splice(index, 1);
      }else  if(groupType == 'pickupStoreGroupArray'){
        this.storeGroupPickup.splice(index, 1);
      }else{
        this.storeGroupDine.splice(index, 1);

      }
      control.removeAt(index);

    }
  });
}

createCombo(formatJson1) {
  let formatJson = this.createComboFormGroup.value;
  if (this.createComboFormGroup.valid && this.createComboFormGroup1.valid && (this.invalidError == false)) {          
        let comboOrderType=[];
        let comboStoreGroup=[];
        let comboStoreGroupPickup=[];
        let comboStoreGroupDineIn=[];
        let  comboCarts =[]
        for(let i=0;i<=formatJson.comboCarts.length-1;i++){
          if(formatJson.comboCarts[i].addCartType=='product'){
            let obj ={
              addCartType:formatJson.comboCarts[i].addCartType,
              noOfVariantSelectionFromList: formatJson.comboCarts[i].noOfVariantSelectionFromList ,
              comboCartLocales:formatJson.comboCarts[i].comboCartLocales,
              comboCartProduct:formatJson.comboCarts[i].comboCartProduct
            }
            comboCarts.push(obj)
          }else{
            let comboCategoryList = formatJson.comboCarts[i].comboCategoryList;
            let comboCartCategory=[];
            for (let j = 0; j <= comboCategoryList.length - 1; j++) {
             
              let comboCartCategoryArray = []
              for (let k = 0; k <= formatJson.comboCarts[i]['comboCartProduct'].length - 1; k++) {
                if (formatJson.comboCarts[i]['comboCartProduct'][k]['categoryId'] == comboCategoryList[j]['categoryId']) {
                  comboCartCategoryArray.push(formatJson.comboCarts[i]['comboCartProduct'][k]);
                }
  
              }
           let   comboCartCategoryObj = {
                categoryOid: comboCategoryList[j]['categoryId'],
                categoryName: comboCategoryList[j]['categoryName'],
                categoryProduct: comboCartCategoryArray
              }
              comboCartCategory.push(comboCartCategoryObj)
            }
            
            let obj ={
              addCartType:formatJson.comboCarts[i].addCartType,
              noOfVariantSelectionFromList:formatJson.comboCarts[i].noOfVariantSelectionFromList,
              comboCartLocales:formatJson.comboCarts[i].comboCartLocales,
               comboCartCategory:comboCartCategory
            }
            comboCarts.push(obj)
          }
        }
        let  comboCartsPickup =[];
        for(let i=0;i<=formatJson.comboCartsPickup.length-1;i++){
          if(formatJson.comboCartsPickup[i].addCartType=='product'){
        
            let obj ={
              addCartType:formatJson.comboCartsPickup[i].addCartType,
              noOfVariantSelectionFromList: formatJson.comboCartsPickup[i].noOfVariantSelectionFromList ,
              comboCartLocales:formatJson.comboCartsPickup[i].comboCartLocales,
              comboCartProduct:formatJson.comboCartsPickup[i].comboCartProduct
            }
            comboCartsPickup.push(obj)
          }else{
            let comboCategoryList = formatJson.comboCartsPickup[i].comboCategoryList;
            let comboCartCategory=[];
            for (let j = 0; j <= comboCategoryList.length - 1; j++) {
              
              let comboCartCategoryArray = []
              for (let k = 0; k <= formatJson.comboCartsPickup[i]['comboCartProduct'].length - 1; k++) {
                if (formatJson.comboCartsPickup[i]['comboCartProduct'][k]['categoryId'] == comboCategoryList[j]['categoryId']) {
                  comboCartCategoryArray.push(formatJson.comboCartsPickup[i]['comboCartProduct'][k]);
                }
  
              }
             let comboCartCategoryObj = {
                categoryOid: comboCategoryList[j]['categoryId'],
                categoryName: comboCategoryList[j]['categoryName'],
                categoryProduct: comboCartCategoryArray
              }
              comboCartCategory.push(comboCartCategoryObj)
  
            }
            
            let obj ={
              addCartType:formatJson.comboCartsPickup[i].addCartType,
              noOfVariantSelectionFromList:formatJson.comboCartsPickup[i].noOfVariantSelectionFromList,
              comboCartLocales:formatJson.comboCartsPickup[i].comboCartLocales,
              comboCartCategory:comboCartCategory
            }
            comboCartsPickup.push(obj)
          }
        }
        let comboCartsDineIn=[];
        for(let i=0;i<=formatJson.comboCartsDineIn.length-1;i++){
          if(formatJson.comboCartsDineIn[i].addCartType=='product'){
        
            let obj ={
              addCartType:formatJson.comboCartsDineIn[i].addCartType,
              noOfVariantSelectionFromList: formatJson.comboCartsDineIn[i].noOfVariantSelectionFromList ,
              comboCartLocales:formatJson.comboCartsDineIn[i].comboCartLocales,
              comboCartProduct:formatJson.comboCartsDineIn[i].comboCartProduct
            }
            comboCartsDineIn.push(obj)
          }else{
            let comboCategoryList = formatJson.comboCartsDineIn[i].comboCategoryList;
            let comboCartCategory=[];
            for (let j = 0; j <= comboCategoryList.length - 1; j++) {
              let comboCartCategoryArray = []
              for (let k = 0; k <= formatJson.comboCartsDineIn[i]['comboCartProduct'].length - 1; k++) {
                if (formatJson.comboCartsDineIn[i]['comboCartProduct'][k]['categoryId'] == comboCategoryList[j]['categoryId']) {
                  comboCartCategoryArray.push(formatJson.comboCartsDineIn[i]['comboCartProduct'][k]);
                }
  
              }
           let   comboCartCategoryObj = {
                categoryOid: comboCategoryList[j]['categoryId'],
                categoryName: comboCategoryList[j]['categoryName'],
                categoryProduct: comboCartCategoryArray
              }
              comboCartCategory.push(comboCartCategoryObj)
  
            }
            
            let obj ={
              addCartType:formatJson.comboCartsDineIn[i].addCartType,
              noOfVariantSelectionFromList:formatJson.comboCartsDineIn[i].noOfVariantSelectionFromList,
              comboCartLocales:formatJson.comboCartsDineIn[i].comboCartLocales,
              comboCartCategory:comboCartCategory
            }
            comboCartsDineIn.push(obj)
          }
        }
     
        for(let i=0;i<=this.storeGroup.length-1;i++){
        let   selectedStorearray=[]
          for(let j=0;j<=this.storeGroup[i].storeOids.length-1;j++){
            selectedStorearray.push(this.storeGroup[i].storeOids[j].storeOid)
          }
          let price;
          if(formatJson.deliveryStoreGroupArray[i].discountType == 'PERCENTAGE'){
            price= formatJson.deliveryStoreGroupArray[i].discountPrice1;
          }else{
            price= formatJson.deliveryStoreGroupArray[i].discountPrice;
          }
          let  comboStoreGroupObj = {
            storeOids:selectedStorearray,
            displayPrice:this.storeGroup[i].displayPrice == 'AUTO CALCULATE' ? null : this.storeGroup[i].displayPrice,
            currency: this.storeGroup[i].currencyCode,
            isDiscount: formatJson.deliveryStoreGroupArray[i].isDiscount== true ? 1 :0,
            discountType:formatJson.deliveryStoreGroupArray[i].isDiscount== true ? formatJson.deliveryStoreGroupArray[i].discountType : 'PERCENTAGE',
            discountPrice: price,
            }
            comboStoreGroup.push(comboStoreGroupObj);
        }
        for(let i=0;i<=this.storeGroupPickup.length-1;i++){
          let   selectedStorearray=[]
            for(let j=0;j<=this.storeGroupPickup[i].storeOids.length-1;j++){
              selectedStorearray.push(this.storeGroupPickup[i].storeOids[j].storeOid)
            }
            let price;
            if(formatJson.pickupStoreGroupArray[i].discountType == 'PERCENTAGE'){
              price= formatJson.pickupStoreGroupArray[i].discountPrice1;
            }else{
              price= formatJson.pickupStoreGroupArray[i].discountPrice;
            }
            let  comboStoreGroupObj = {
              storeOids:selectedStorearray,
              displayPrice:this.storeGroupPickup[i].displayPrice == 'AUTO CALCULATE' ? null : this.storeGroupPickup[i].displayPrice,
              currency: this.storeGroupPickup[i].currencyCode,
              isDiscount: formatJson.pickupStoreGroupArray[i].isDiscount== true ? 1 :0,
              discountType: formatJson.pickupStoreGroupArray[i].isDiscount== true ? formatJson.pickupStoreGroupArray[i].discountType : 'PERCENTAGE',
              discountPrice: price,
              }
              comboStoreGroupPickup.push(comboStoreGroupObj);
          }
          for(let i=0;i<=this.storeGroupDine.length-1;i++){
            let   selectedStorearray=[]
              for(let j=0;j<=this.storeGroupDine[i].storeOids.length-1;j++){
                selectedStorearray.push(this.storeGroupDine[i].storeOids[j].storeOid)
              }
              let price;
              if(formatJson.dineInStoreGroupArray[i].discountType == 'PERCENTAGE'){
                price= formatJson.dineInStoreGroupArray[i].discountPrice1;
              }else{
                price= formatJson.dineInStoreGroupArray[i].discountPrice;
              }
              let  comboStoreGroupObj = {
                storeOids:selectedStorearray,
                displayPrice:this.storeGroupDine[i].displayPrice == 'AUTO CALCULATE' ? null : this.storeGroupDine[i].displayPrice,
                currency: this.storeGroupDine[i].currencyCode,
                isDiscount: formatJson.dineInStoreGroupArray[i].isDiscount== true ? 1 :0,
                discountType: formatJson.dineInStoreGroupArray[i].isDiscount== true ? formatJson.dineInStoreGroupArray[i].discountType  : 'PERCENTAGE',
                discountPrice: price,
                }
                comboStoreGroupDineIn.push(comboStoreGroupObj);
            }
            if(formatJson.skuCode != '' && formatJson.skuCode != undefined){

            let obj = {
              skuCode: formatJson.skuCode,
              packagingCharge: formatJson.packingCharge,
              deliveryCharge: formatJson.deliveryCharge,
              taxRate: formatJson.taxRates
      
            }
        
        let deliveryObj = {
          isOrderDeliveryTypeEnable: formatJson.isDeliveryEnabled,
          orderDeliveryType:'DELIVERY',
          comboSkuDetails:obj,
          comboStoreGroup:comboStoreGroup,
          comboCarts:comboCarts
        }
        comboOrderType.push(deliveryObj);

      }
        if(formatJson.skuCodePickup != '' && formatJson.skuCodePickup != undefined){

       let objPick = {
          skuCode: formatJson.skuCodePickup,
          packagingCharge: formatJson.packingChargePickup,
          taxRate: formatJson.taxRatesPickup,
          deliveryCharge: 0
        }
        let pickUpObj = {
          isOrderDeliveryTypeEnable: formatJson.isPickupEnabled,
          orderDeliveryType:'PICKUP',
          comboSkuDetails:objPick,
          comboStoreGroup:comboStoreGroupPickup,
          comboCarts:comboCartsPickup
  
        }
        comboOrderType.push(pickUpObj);
      }
      if(formatJson.skuCodeDineIn != '' && formatJson.skuCodeDineIn != undefined){

        let dineInobj = {
          skuCode: formatJson.skuCodeDineIn,
          packagingCharge: formatJson.packingChargeDineIn,
          taxRate: formatJson.taxRatesDineIn,
          deliveryCharge: 0
        }
        let dineINObj = {
          isOrderDeliveryTypeEnable: formatJson.isDineinEnabled,
          orderDeliveryType:'DINEIN',
          comboSkuDetails:dineInobj,
          comboStoreGroup:comboStoreGroupDineIn,
          comboCarts:comboCartsDineIn
  
        }
        comboOrderType.push(dineINObj);
      }
        let prodImages = [];
      if (this.imagePath.length > 0) {
        for (var i = 0; i < this.imagePath.length; i++) {
          let images = {
            isDefault: this.defaultId == i ? true : false,
            imgPath: this.imagePath[i]
          };
          prodImages.push(images);
        }
      }
        let request = {
          comboLocales: formatJson['comboLocales'],
          brandOid: formatJson['brand'],
          availableFrom: moment(formatJson.availFrom).format('HH:mm:ss'),
          availableTo: moment(formatJson.availTo).format('HH:mm:ss'),
          categoryOids: formatJson.categoryOids,
          countryOids: formatJson.country,
          sortOrder: formatJson.sortOrder,
         comboImage:  prodImages,
          noOfStepInCombo: 0,
          comboType: formatJson.comboType,
          displayPriceType: formatJson.displayPriceType,
          status: this.toggleVal == true ? "ONLINE" : "OFFLINE",
          comboOrderType:comboOrderType,
          comboId:this.viewID,
          isExclusive: formatJson1.isExclusive,
          isLimitedTimeCategory: formatJson1.isLimitedTimeCategory,
          isHealthy: formatJson1.isHealthy,
          isHotSeller: formatJson1.isHotSeller,
          comboProductType: formatJson1.productType,
          comboDescription: formatJson1.productFormArray,
          comboAlergion:this.imagePathAlergion,
          comboDieatry: this.imagePathDieatry
          // comboCarts:comboCarts
        }
        console.log(JSON.stringify(request))
        this.http.postJson(environment.APIEndpoint + "api/rpa/combo/v1/update", request)
          .subscribe((response) => {
            this.snackBar.openFromComponent(SnackBarComponent, {
              duration: 1000,
              data: {
                status: "success",
                message: "Combo is Saved successfully"
              }
            });
            this.loading = false;
            this.router.navigate(['/search-combo']);
          }
            , err => {
              this.loading = false;
              console.log("error Status = ", err);
              if (err.error.errorType == 'VALIDATION') {
                this.snackBar.openFromComponent(SnackBarComponent, {
                  duration: 1000,
                  data: {
                    status: "failure",
                    message: err.error.errorDetails[0].description
                  }
                });
              } else {
                this.snackBar.openFromComponent(SnackBarComponent, {
                  duration: 1000,
                  data: {
                    status: "failure",
                    message: "Your request cannot be saved at this time. Please try again later"
                  }
                });
              }
            })
      }
    }


    functionname(value,control,discountType){
      console.log(value)
      if(control['discountType'].value == 'PERCENTAGE'){  //percentage
        let finalPrice = control['finalPrice'].value;
        let percentage = (value / 100) * finalPrice;
       let finalAmount = finalPrice - percentage
        control['showFinalPrice'].patchValue(finalAmount)
  
  
      }else{
        let finalPrice = control['finalPrice'].value;
        let finalAmount = finalPrice - value;
         control['showFinalPrice'].patchValue(finalAmount)
      }
  
    }
    expandDataEmail() {
      var allifram = document.getElementById("arabicID");
      var iFrame_Arabic = allifram.getElementsByTagName("iframe")[0];
      var html_Arabic = iFrame_Arabic.contentWindow.document.getElementsByTagName("html")[0];
      html_Arabic.setAttribute("style", "direction: rtl;");
    }
    
    expandDataEmailDescrtipion() {
      var allifram = document.getElementById("arabicIDDescrtipion");
      var iFrame_Arabic = allifram.getElementsByTagName("iframe")[0];
      var html_Arabic = iFrame_Arabic.contentWindow.document.getElementsByTagName("html")[0];
      html_Arabic.setAttribute("style", "direction: rtl;");
    }
    invalidError:boolean = false;
    nextStep(value) {
      this.invalidError = false;
      if(this.createComboFormGroup.get('isDeliveryEnabled').value == true && this.storeGroup.length == 0){
        this.invalidError = true;
      }
      if(this.createComboFormGroup.get('isPickupEnabled').value == true && this.storeGroupPickup.length == 0){
        this.invalidError = true;
      }
      if(this.createComboFormGroup.get('isDineinEnabled').value == true && this.storeGroupDine.length == 0){
        this.invalidError = true;
      }
      
      if(this.createComboFormGroup.valid && (this.invalidError == false) ){
        if (this.selectedIndex == 0) {
          this.selectedIndex = this.selectedIndex + 1;
        }
      }else{
        this.basicTabError = true;
        setTimeout(() => {
          this.basicTabError = false;
        
        }, 3000);
  
      }
  
    }
    public tabChanged(tabChangeEvent: MatTabChangeEvent): void {
      if (tabChangeEvent.index == 1) {
        this.selectedIndex = 1;
        this.countryArray=this.createComboFormGroup.get('country').value;
        this.categoryArray = this.createComboFormGroup.get('categoryOids').value;
      } else if (tabChangeEvent.index == 0) {
        this.selectedIndex = 0;
        this.createComboFormGroup.get('country').patchValue(this.countryArray);
        this.createComboFormGroup.get('categoryOids').patchValue(this.categoryArray);
  
        if(this.countries.length == this.countryArray.length){
          this.countryInput.selectAllChecked = true;
        }
        if(this.categoryArray.length == this.categoriesList.length){
          this.categoryInput.selectAllChecked = true
        }
      }
  }
  previousStep() {
    if (this.selectedIndex != 0) {
      this.selectedIndex = this.selectedIndex - 1;
    }
    console.log(this.selectedIndex);
  }
  onChange(mrChange: MatRadioChange) {
    this.defaultId = mrChange.value;
  }
  cloneOrder(tabIndex,orderInput){
    let storeGroupArray;
    let comboCart;
    let storeGroup=[];
    let groupId = Date.now();
  
    if(orderInput == 1){
      storeGroupArray = this.createComboFormGroup.get('deliveryStoreGroupArray').value;
      comboCart = this.createComboFormGroup.get('comboCarts').value;
      let storeGroupTempArray=this.storeGroup;
      for(let i=0;i <= storeGroupTempArray.length -1; i++){
        let Obj ={
        activeGroupId:groupId,
        currencyCode:storeGroupTempArray[i].currencyCode,
        displayPrice: storeGroupTempArray[i].displayPrice,
        storeOids:storeGroupTempArray[i].storeOids
        }
        storeGroup.push(Obj)
      }
     
    }else if(orderInput == 2){
      storeGroupArray = this.createComboFormGroup.get('pickupStoreGroupArray').value;
      comboCart = this.createComboFormGroup.get('comboCartsPickup').value;
      // storeGroup=this.storeGroupPickup;
      let storeGroupTempArray=this.storeGroupPickup;
  
      for(let i=0;i <= storeGroupTempArray.length -1; i++){
        let Obj ={
        activeGroupId:groupId,
        currencyCode:storeGroupTempArray[i].currencyCode,
        displayPrice: storeGroupTempArray[i].displayPrice,
        storeOids:storeGroupTempArray[i].storeOids
        }
        storeGroup.push(Obj)
      }
  
    }else if(orderInput == 3){
      storeGroupArray = this.createComboFormGroup.get('dineInStoreGroupArray').value;
      comboCart = this.createComboFormGroup.get('comboCartsDineIn').value;
      // storeGroup=this.storeGroupDine;
      let storeGroupTempArray=this.storeGroupDine;
  
      for(let i=0;i <= storeGroupTempArray.length -1; i++){
        let Obj ={
        activeGroupId:groupId,
        currencyCode:storeGroupTempArray[i].currencyCode,
        displayPrice: storeGroupTempArray[i].displayPrice,
        storeOids:storeGroupTempArray[i].storeOids
        }
        storeGroup.push(Obj)
      }
  
    }
    this.customizationAddonLocale=[];
    let controlstore1;
    if(tabIndex == 0){
      this.storeGroup=storeGroup;
      const control = <FormArray>this.createComboFormGroup.get('comboCarts');
      while (control.length) {
        control.removeAt(control.length - 1);
      }
   
    for(let i=0;i<=comboCart.length-1;i++){
      this.customizationAddonLocale = comboCart[i]['comboCartLocales'];
      this.titleDataClone('comboCarts',comboCart[i])
     }
     const controlstore = <FormArray>this.createComboFormGroup.controls['deliveryStoreGroupArray'];
     while (controlstore.length) {
      controlstore.removeAt(controlstore.length - 1);
    }
    console.log(storeGroupArray)
    
    controlstore1 = controlstore;
  
     
  
    }else if(tabIndex == 1){
      this.storeGroupPickup=storeGroup;
      const control1 = <FormArray>this.createComboFormGroup.get('comboCartsPickup');
      while (control1.length) {
        control1.removeAt(control1.length - 1);
      }
      for(let i=0;i<=comboCart.length-1;i++){
        this.customizationAddonLocale = comboCart[i]['comboCartLocales'];
        this.titleDataClone('comboCartsPickup',comboCart[i])
       }
       const controlstore = <FormArray>this.createComboFormGroup.controls['pickupStoreGroupArray'];
       while (controlstore.length) {
        controlstore.removeAt(controlstore.length - 1);
      }
      controlstore1 = controlstore;
  
    }else if(tabIndex == 2){
      this.storeGroupDine=storeGroup;
      const control2 = <FormArray>this.createComboFormGroup.get('comboCartsDineIn');
      while (control2.length) {
        control2.removeAt(control2.length - 1);
      }
      for(let i=0;i<=comboCart.length-1;i++){
        this.customizationAddonLocale = comboCart[i]['comboCartLocales'];
        this.titleDataClone('comboCartsDineIn',comboCart[i])
       }
       const controlstore = <FormArray>this.createComboFormGroup.controls['dineInStoreGroupArray'];
       while (controlstore.length) {
        controlstore.removeAt(controlstore.length - 1);
      }
      controlstore1 = controlstore;
  
      // console.log(storeGroupArray)
      
  
    }
    for(let i=0; i<=storeGroupArray.length-1;i++){
      const newForm = this.fb.group({
        discountType: storeGroupArray[i].discountType,
    isDiscount: storeGroupArray[i].isDiscount,
  
    discountPrice:storeGroupArray[i].discountPrice,
  discountPrice1:storeGroupArray[i].discountPrice1,
  finalPrice:storeGroupArray[i].finalPrice,
  showFinalPrice:storeGroupArray[i].showFinalPrice
      });
  
      controlstore1.push(newForm);
      if(controlstore1.controls[controlstore1.length-1].get('isDiscount').value == true){
        let value =  controlstore1.controls[controlstore1.length-1].get('finalPrice').value;
        let discountAmount = controlstore1.controls[controlstore1.length-1].get('discountPrice');
        let discountPercentage =  controlstore1.controls[controlstore1.length-1].get('discountPrice1');
        if( controlstore1.controls[controlstore1.length-1].get('discountType').value != 'PERCENTAGE'){
          controlstore1.controls[controlstore1.length-1].get('discountPrice').setValue(storeGroupArray[i].discountPrice);
          controlstore1.controls[controlstore1.length-1].get('discountPrice1').setValue('');
    
          if(this.createComboFormGroup.get('displayPriceType').value == 'AUTO_CALCULATE'){
            discountAmount.setValidators([Validators.required,Validators.min(1)]);
            discountAmount.updateValueAndValidity();
          }else{
            discountAmount.setValidators([Validators.required,Validators.max(value-1),Validators.min(1)]);
            discountAmount.updateValueAndValidity();
          }
          discountPercentage.clearValidators();
          discountPercentage.updateValueAndValidity();
        }
        else{
          controlstore1.controls[controlstore1.length-1].get('discountPrice').setValue('');
          controlstore1.controls[controlstore1.length-1].get('discountPrice1').setValue(storeGroupArray[i].discountPrice1);
          discountPercentage.setValidators([Validators.required, Validators.pattern('^([1-9]|[1-9][0-9])$') ])
          discountPercentage.updateValueAndValidity();
          discountAmount.clearValidators();
          discountAmount.updateValueAndValidity();
    
        }
      }
     
  }
  }
  // cloneOrder1(tabIndex,orderInput){
  //   let storeGroupArray;
  //   let comboCart;
  //   let storeGroup;
  //   if(orderInput == 1){
  //     storeGroupArray = this.createComboFormGroup.get('deliveryStoreGroupArray').value;
  //     comboCart = this.createComboFormGroup.get('comboCarts').value;
  //     storeGroup=this.storeGroup;
  //   }else if(orderInput == 2){
  //     storeGroupArray = this.createComboFormGroup.get('pickupStoreGroupArray').value;
  //     comboCart = this.createComboFormGroup.get('comboCartsPickup').value;
  //     storeGroup=this.storeGroupPickup;
  
  //   }else if(orderInput == 3){
  //     storeGroupArray = this.createComboFormGroup.get('dineInStoreGroupArray').value;
  //     comboCart = this.createComboFormGroup.get('comboCartsDineIn').value;
  //     storeGroup=this.storeGroupDine;
  
  //   }
  //   this.customizationAddonLocale=[];
  //   let controlstore1;
  //   if(tabIndex == 0){
  //     this.storeGroup=storeGroup;
  //     const control = <FormArray>this.createComboFormGroup.get('comboCarts');
  //     while (control.length) {
  //       control.removeAt(control.length - 1);
  //     }
   
  //   for(let i=0;i<=comboCart.length-1;i++){
  //     this.customizationAddonLocale = comboCart[i]['comboCartLocales'];
  //     this.titleDataClone('comboCarts',comboCart[i])
  //    }
  //    const controlstore = <FormArray>this.createComboFormGroup.controls['deliveryStoreGroupArray'];
  //    while (controlstore.length) {
  //     controlstore.removeAt(controlstore.length - 1);
  //   }
  //   console.log(storeGroupArray)
    
  //   controlstore1 = controlstore;
  
     
  
  //   }else if(tabIndex == 1){
  //     this.storeGroupPickup=storeGroup;
  //     const control1 = <FormArray>this.createComboFormGroup.get('comboCartsPickup');
  //     while (control1.length) {
  //       control1.removeAt(control1.length - 1);
  //     }
  //     for(let i=0;i<=comboCart.length-1;i++){
  //       this.customizationAddonLocale = comboCart[i]['comboCartLocales'];
  //       this.titleDataClone('comboCartsPickup',comboCart[i])
  //      }
  //      const controlstore = <FormArray>this.createComboFormGroup.controls['pickupStoreGroupArray'];
  //      while (controlstore.length) {
  //       controlstore.removeAt(controlstore.length - 1);
  //     }
  //     controlstore1 = controlstore;
  
  //   }else if(tabIndex == 2){
  //     this.storeGroupDine=storeGroup;
  //     const control2 = <FormArray>this.createComboFormGroup.get('comboCartsDineIn');
  //     while (control2.length) {
  //       control2.removeAt(control2.length - 1);
  //     }
  //     for(let i=0;i<=comboCart.length-1;i++){
  //       this.customizationAddonLocale = comboCart[i]['comboCartLocales'];
  //       this.titleDataClone('comboCartsDineIn',comboCart[i])
  //      }
  //      const controlstore = <FormArray>this.createComboFormGroup.controls['dineInStoreGroupArray'];
  //      while (controlstore.length) {
  //       controlstore.removeAt(controlstore.length - 1);
  //     }
  //     controlstore1 = controlstore;
  
  //     // console.log(storeGroupArray)
      
  
  //   }
  //   for(let i=0; i<=storeGroupArray.length-1;i++){
  //     const newForm = this.fb.group({
  //       discountType: storeGroupArray[i].discountType,
  //   isDiscount: storeGroupArray[i].isDiscount,
  
  //   discountPrice:storeGroupArray[i].discountPrice,
  // discountPrice1:storeGroupArray[i].discountPrice1,
  // finalPrice:storeGroupArray[i].finalPrice,
  // showFinalPrice:storeGroupArray[i].showFinalPrice
  //     });
  
  //     controlstore1.push(newForm);
  //     if(controlstore1.controls[controlstore1.length-1].get('isDiscount').value == true){
  //       let value =  controlstore1.controls[controlstore1.length-1].get('finalPrice').value;
  //       let discountAmount = controlstore1.controls[controlstore1.length-1].get('discountPrice');
  //       let discountPercentage =  controlstore1.controls[controlstore1.length-1].get('discountPrice1');
  //       if( controlstore1.controls[controlstore1.length-1].get('discountType').value != 'PERCENTAGE'){
  //         controlstore1.controls[controlstore1.length-1].get('discountPrice').setValue(storeGroupArray[i].discountPrice);
  //         controlstore1.controls[controlstore1.length-1].get('discountPrice1').setValue('');
    
  //         if(this.createComboFormGroup.get('displayPriceType').value == 'AUTO_CALCULATE'){
  //           discountAmount.setValidators([Validators.required,Validators.min(1)]);
  //           discountAmount.updateValueAndValidity();
  //         }else{
  //           discountAmount.setValidators([Validators.required,Validators.max(value-1),Validators.min(1)]);
  //           discountAmount.updateValueAndValidity();
  //         }
  //         discountPercentage.clearValidators();
  //         discountPercentage.updateValueAndValidity();
  //       }
  //       else{
  //         controlstore1.controls[controlstore1.length-1].get('discountPrice').setValue('');
  //         controlstore1.controls[controlstore1.length-1].get('discountPrice1').setValue(storeGroupArray[i].discountPrice1);
  //         discountPercentage.setValidators([Validators.required, Validators.pattern('^([1-9]|[1-9][0-9])$') ])
  //         discountPercentage.updateValueAndValidity();
  //         discountAmount.clearValidators();
  //         discountAmount.updateValueAndValidity();
    
  //       }
  //     }
     
  // }
  // }
  
  public tabChanged1(tabChangeEvent: MatTabChangeEvent): void {
    if (tabChangeEvent.index == 1) {
      this.selectedIndex1 = 1;
    } else if (tabChangeEvent.index == 0) {
      this.selectedIndex1 = 0;
    }
    else if (tabChangeEvent.index == 2) {
      this.selectedIndex1 = 2;
    }
  
  }
  getCloneProductData(value,control){
    if(value.addCartType=='product'){
      if (value['comboCartProduct'].length > 0) {
        const array1 = <FormArray>control.controls['comboCartProduct'];
        for (let ln of value['comboCartProduct']) {
          let arr = this.fb.group({
            displayPrice: [ln.displayPrice],
              productName: [ln.productName],
              imagePath: [ln.imagePath],
              tax: [ln.tax],
              skuCode: [ln.skuCode],
              
              noOfProductSelectionFromList: 0,
              variantOid: [ln.variantOid],
              productSkuCode: [ln.productSkuCode],
              productQuantity: ln.productQuantity,
              productOid: [ln.productOid],
              varientName:[ln.varientName],
              availableFrom: [ln.availableFrom],
              availableTo: [ln.availableTo]
          });
          array1.push(arr);
          if(this.createComboFormGroup.get('comboType').value == 'FIXED'){
            let productQuantity = array1.controls[array1.length-1].get('productQuantity');
            array1.controls[array1.length-1].get('productQuantity').setValue(ln.productQuantity);
            productQuantity.setValidators([Validators.required,Validators.min(1)]);
            productQuantity.updateValueAndValidity();
          } 
        }
  
      }
    }else{
      if (value['comboCartProduct'].length > 0) {
  
        const categoryArray = <FormArray>control.controls['comboCategoryList']
             
        const array1 = <FormArray>control.controls['comboCartProduct'];
        for(let j=0;j<=value['comboCategoryList'].length-1;j++){
  
            let arr = this.fb.group({
              categoryName:value['comboCategoryList'][j].categoryName,
              categoryId:value['comboCategoryList'][j].categoryId
            })
            categoryArray.push(arr);
    
          }
          for (let ln of value['comboCartProduct']) {
            let arr = this.fb.group({
              displayPrice: [ln.displayPrice],
              productName: [ln.productName],
              imagePath: [ln.imagePath],
              tax: [ln.tax],
              skuCode: [ln.skuCode],
              
              noOfProductSelectionFromList: 0,
              // variantOid: [ln.variantOid],
              categoryName: [ln.categoryName],
              productOid: [ln.productOid],
              productSkuCode: [ln.productSkuCode],
              productQuantity: 1,
              categoryId: [ln.categoryId],
              varientName: [ln.varientName],
              availableFrom: [ln.availableFrom],
              availableTo: [ln.availableTo]
  
            });
            array1.push(arr);
          
  
          }
          
    
        
       
      }
    }
  
  
  
  }
  openAlergionDialog() {
    const dialogRef = this.dialog.open(AlergionImageDialog);
    dialogRef.afterClosed().subscribe(result => {
      if (result != undefined)
        this.imagePathAlergion.push(result);
    });
  }
  openDieatryDialog() {
    const dialogRef = this.dialog.open(DieatryImageDialog);
    dialogRef.afterClosed().subscribe(result => {
      if (result != undefined)
        this.imagePathDieatry.push(result);
    });
  }
  public removeImageAlergion(index) {
    this.imagePathAlergion.splice(index, 1);
  }
  
  public removeImageDieatry(index) {
    this.imagePathDieatry.splice(index, 1);
  }
  isEnabledCheck(event,combotype,type,storeGrouptype){
    if (event.checked) {
      this.createComboFormGroup.get(type).patchValue(true);
      this.titleTab(combotype);
    }else{
      this.createComboFormGroup.get(type).patchValue(false);
      this.removeOrderType(combotype);
       const control2 = <FormArray>this.createComboFormGroup.get(storeGrouptype);
      while (control2.length) {
        control2.removeAt(control2.length - 1);
      }
      if(type == 'isDeliveryEnabled'){
        this.storeGroup = [];
      }else if(type == 'isPickupEnabled'){
        this.storeGroupPickup=[];
      }else{
        this.storeGroupDine=[];
      }
    }
  }
  public removeOrderType(combotype){
    const control = <FormArray>this.createComboFormGroup.controls[combotype];
    while (control.length) {
      control.removeAt(control.length-1);
    }
  }
  }
  
  

