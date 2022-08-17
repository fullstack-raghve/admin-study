import { Component, OnInit, ViewChild, Inject, ElementRef, Input } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { HttpService } from 'src/app/services/http-service';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { MatPaginator, MatSort, MatTableDataSource, MatTabsModule, MatSnackBar } from '@angular/material';
import { MatDialogModule, MatDialogConfig } from '@angular/material/dialog';
import { SelectionModel } from '@angular/cdk/collections';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ViewVariantStoreDialogComponent } from "../view-store-dialog/view-store-dialog.component";
import { UploadFile } from "src/app/services/uploadFile.service";
import { AddOnsComponent } from '../addOns-dialog/addOns-dialog.component';
import { BeveragesDialogComponent } from '../beverages-dialog/beverages-dialog.component';
import { BreadsDialogComponent } from '../breads-dialog/breads-dialog.component';
import { SnackBarComponent } from 'src/app/shared/components/snack-bar/snack-bar.component';
import { Globals } from 'src/app/services/global';
import { __values } from 'tslib';
import { VariantsAddStoreDialogComponent } from '../add-store-variant/add-store-variant.component';
import { selectStoreVariantDialog } from 'src/app/shared/components/select-store-variant-dialog/select-store-variant.component';
import {VarientDialogComponent} from  '../varient-dialog/varient-dialog.component'	
import { CrossSellAddOnsComponent } from '../crossSell-addOns-dialog/crossSell-addOns-dialog.component';

@Component({
  selector: 'view-products',
  templateUrl: './view-products.component.html',
  styleUrls: ['./view-products.component.scss']
})

export class ViewProductsComponent implements OnInit {
  public scrollbarOptions = { axis: 'x', theme: 'minimal-dark' };
  public breadCrumbData: Array<Object> = [{
    title: 'Menu Management',
    link: ''
  }, {
    title: 'Products',
    link: '/search-products'
  }
  ];
  displayedColumns: string[] = ['select'];
  @ViewChild('addOnsImgFile') uploadElRef2: ElementRef;
  @ViewChild('selectImgFile') uploadElRef1: ElementRef;
  @ViewChild('uploadEl') uploadElRef: ElementRef;
  @Input('isDisabled') isDisabled: boolean = false;
  @Input() editable: boolean = false;

  private brandId;
  public tableData = [];
  public activeGroupId = 0;


  public imgUpload = false;
  public imgUploadAdds = false;
  public imgUploadDieatry = false;
  public imgUploadAlergion = false;
  public imgUploadBreads = false;
  public toggleVal = true;
  public imgUploadAddOns = false;
  public imagePathAddOns = '';
  public imagePathBreads = '';
  public imageUploading: boolean = false;
  public selectedStorearray = [];
  public selectedStoreArrayView = [];
  public checked;
  public minCount = 0;
  public imagePathAdds = '';
  public imagePathDieatry = '';
  public imagePathAlergion = '';
  public showError = false;
  public showImageError = false;
  public loading = false;
  public uploadError = [];
  public isVariantTypeSelected = [];
  public uploadErrorSku = [];
  public uploadErrorDisplayPrice = [];
  errorMsg = "Please select value";
  public filePathUrl = localStorage.getItem("imgBaseUrl");
  public id;
  public viewData = [];
  public variantsData = [];
  public imageErrMsg;
  addClientOnBoardingGroup: FormGroup;
  addForm: FormGroup;
  rows: FormArray;
  itemForm: FormGroup;
  addProductGroup: FormGroup;
  variantsFormGroup: FormGroup;
  public categories = "";
  public totalCount = 0;
  public selectedCount;
  availableFrom;
  availableTo;
  brandName;
  public alignCss = [];
  public rightPanel = [];
  addons = [];
  priceLabel = "";
  price;
  public selectedVariant;
  public languageList = JSON.parse(localStorage.getItem("languageList"));
  public addonLocalesObj: any = [];
  public variantsLocales: any = [];
  public addonData;
  public customizationAddons: any = []
  public customizationAddonLocale: any = []
  public radioValue = false;	
  public isMandatory = false;	
  public addonRequired = false;	
  public customizeAddonRequired = false;	
  public customizeQuantity = false;
  public customizeAddonSelectionErrorMsg;
  public isPrepopulate: boolean = false;
  public isPrepopulateVariants: boolean = false;
  public customizeAddonOids = [];
  public checkForView: boolean = true;
  public customImages: any = [];
  customizationForm: FormGroup;
  arr: FormArray;
  contentBlock: FormArray
  public localesList: any[] = [0];
  variantList: any[];
  variantListData: any = [];
  variantTypes: any;
  variantTypeLocales: any;
  variantOid: any;
  public imagePath: any = [];
  public uploadFlag = [];
  storeArray: any;
  public selectedAddonsResult = [];
  public selectedAddonsResultCustomize = [];
  public twoArray: any[][] = new Array();
  public storeCount: any = 2000;
  public selectStoreVal = false;
  public dataStore: boolean = false;
  public storeRequiredFiled = false;
  public storeRequired = false;
  public storeErrorMsg;
  public selectStoreValPass = [];
  selectedArray: any[];
  selectedVariantArray: any[];
  storeList: any;
  selectedData: any[];
  viewVaraintsData: any[];
  variantTypeList: any;
  variantsTypeArray: any;
  imageArray: any;
  variantTypeOid: any;
  productVariantsArray: any;
  storeOid: any;
  isNonTrade: boolean = false;	
  checkAllNonTrades: boolean = false;	
  checkAllTrades: boolean = false;	
  storeCheck: boolean = false;
  stores: any = [];
  variantsDataView: any = [];
  selectedVariants: any;
  addonDetails: any = [];
  editData: any;
  variantName: any;
  public productVariants: any = [];
  public variants: any = [];
  public variantsDataFormData: any = [];
  public customizationAddonsList: any = [];
  addonDetailsList: any;
  selectedAll: boolean = true;
  public addonImagePath: any = [];
  defaultId = undefined;
  addonName: any;
  addonArray: any[];
  productVariantOid: any;
  public imgMainArray: any = [];
  public imgSecondaryArray: any = [];
  variantsNewData: any;
  variantsSelectedData: any;
  public variantsEditData = [];
  customImagesView: any;
  public variantsDataRecords = [];
  public variantsStorePopupData;
  public variantsStorePopupDataEdit = [];
  variantsPrepopulation: any;
  selectedstores: any;

  public validationFlag = false;
  public buildFlagCustomization = true;
  variant: any;
  variantsName: any;
  variantRegionArray: any;
  variantData: any;
  variantStoreData: any;
  viewVariantsName: any;
  viewDataDetails: any;
  productTagList: any;
  exclusiveProducts: any;
  limitedTimeProducts: any;
  healthyProducts: any;
  hotSellerProducts: any;
  variantPopupData: any[];	
  checkboxClicked = false;	
  public variantFormDisplayTotal = 0;	
  skuEditable = false;	
  languageDirection = [];	
  taxList: any[];
  totals: any;


  constructor(
    private fb: FormBuilder,
    private http: HttpService,
    private uploadFile: UploadFile,
    public snackBar: MatSnackBar,
    private router: Router,
    public dialog: MatDialog

  ) {
    this.getProductTag();
    this.getViewData();
    this.getAddonsByProductId();
    this.buildCustomizationForm();
    this.getViewVariantsData();
    this.getViewVariantsDataV1();
    this.buildCreateVariantsForm();
    let data = {
      order: {
        column: "storeId",
        dir: "asc"
      },
      keySearch: "",
      fieldSearch: [
        {
          fieldName: "mall.city.oid",
          fieldValue: ""
        },
        {
          fieldName: "mall.city.country.oid",
          fieldValue: ""
        }
      ]
    };
    this.http
      .postJson(environment.APIEndpoint + "api/rpa/store/v1/getAll", data)
      .subscribe(res => {
        this.totalCount = res["totalCount"];
      });
  }

  public selection = new SelectionModel(true, []);

  ngOnInit() {
    this.getOnlineVariants();
  }

  getProductTag() {
    this.http.getJson(environment.APIEndpoint + 'api/rpa/master/productTag/v1/getProductsTags')
      .subscribe((response) => {
        this.productTagList = response;
        this.exclusiveProducts = response['exclusiveProducts'];
        this.limitedTimeProducts = response['limitedTimeProducts'];
        this.healthyProducts = response['healthyProducts'];
        this.hotSellerProducts =  response['hotSellerProducts'];
      })
  }

  public buildCustomizationForm() {
    let formData = {
      contentBlock: this.fb.array([])
    }
    this.customizationForm = this.fb.group(formData);
  }

  public getGroupData(isPrepopulateObj, addonData: any) {
    const control = <FormArray>this.customizationForm.get('contentBlock');
    for (let t = 0; t < this.localesList.length; t++) {
      let newGroup = this.fb.group({
         isMultiSelect: [this.radioValue],
         isFreeProduct:this.radioValue,
        isMandatory:this.isMandatory,
        labelLocale: this.fb.array([]),
        addonArray: this.fb.array([]),
        customQuantity:this.fb.array([])

      });
      control.push(newGroup);
      this.labelLocale(control.controls[control.length - 1], isPrepopulateObj);
      this.viewCustomizeAddon(control.controls[control.length - 1], isPrepopulateObj, addonData);
     this.viewCustomQuantity(control.controls[control.length - 1], isPrepopulateObj, addonData);
  }
}

public labelLocale(control, isPrepopulateObj) {	
  if (!isPrepopulateObj) {	
    const array = <FormArray>control.controls['labelLocale'];	
    for (let ln of this.languageList) {	
      let arr = this.fb.group({	
        labelName: ['', Validators.compose([Validators.required, Validators.minLength(2), Validators.pattern('^[a-zA-Z0-9\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF \"&\'(),-:.?_ ]*')])]	
      });	
      array.push(arr);	
      this.alignCss.push(ln.direction == 'RTL' ? 'text-right' : '');	
      this.rightPanel.push(ln.direction == 'RTL' ? 'right-panel' : '');	
      this.languageDirection.push(ln.direction == 'RTL' ? 'direction' : '');	
    }	
  } else {	
    const array = <FormArray>control.controls['labelLocale'];	
    for (let ln of this.customizationAddonLocale) {	
      let arr = this.fb.group({	
        labelName: [ln.displayName, Validators.compose([Validators.required, Validators.minLength(2), Validators.pattern('^[a-zA-Z0-9\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF \"&\'(),-:.?_ ]*')])]	
      });	
      array.push(arr);	
      this.alignCss.push(ln.languageDirection == 'RTL' ? 'text-right' : '');	
      this.rightPanel.push(ln.languageDirection == 'RTL' ? 'right-panel' : '');	
      this.languageDirection.push(ln.languageDirection == 'RTL' ? 'direction' : '');	
    }	
  }	
}	
categoryOid=''	
getCategories(array) {	
  var output = '';	
  for (let ar of array) {	
    output += ar.categoryName + ', ';	
    this.categoryOid = ar.categoryOid	
  }	
  return output.replace(/,(\s+)?$/, '');	
}	
priceLable(value) {	
  if (value.length != 0) {	
    this.price = value;	
    if (this.selectedStorearray.length > 0) {	
      this.selectedStorearray.forEach(i => {	
        i["price"] = value;	
      });	
    }	
    this.priceLabel = "Same Price";	
  }	
}	

openAddOnsDialog(event, value) {	
  const dialogConfig = new MatDialogConfig();	
  dialogConfig.data = {	
    addonType: value	
  }	
  let selectedData=[];	
  if(this.selectedAddonsResult){	
    let checkData= this.selectedAddonsResult;	
      
    for(let i=0;i<=checkData.length-1;i++){	
      let key = checkData[i]['uniqueID'];	
      selectedData.push(key)	
    }	
  }else{	
    this.selectedAddonsResult=[]	
  }	
    
  dialogConfig.panelClass = 'crossSell-dialogue'; 	
  const dialogRef = this.dialog.open(CrossSellAddOnsComponent, dialogConfig);	
  dialogRef.componentInstance.ProductListData = selectedData;	
  dialogRef.componentInstance.brandId = this.brandId;	
  dialogRef.componentInstance.list = this.selectedAddonsResult;	
  dialogRef.afterClosed().subscribe(result => {	
    if(result['Value']!=undefined){	
      this.selectedAddonsResult = result['Value'];	
    }	   
  });	
}	
openVarientDialog(event, value, control, i){	
   let TempData = control['customQuantity'].value;	
  const dialogConfig = new MatDialogConfig();	
  let TempPopUPData = this.variantPopupData;	
 for(let i=0;i<=TempPopUPData.length-1;i++){	
  if(TempData.length > 0){	
    for(let j=0; j<=TempData.length-1;j++){	
          if(TempPopUPData[i]['variantTypeOid'] == TempData[j]['variantTypeOid']){	
            TempPopUPData[i].maxSelectionCustAddons = TempData[j].maxSelectionCustAddons;	
            TempPopUPData[i].maxQuantityPerAddons = TempData[j].maxQuantityPerAddons;	
            TempPopUPData[i].isVariantTypeSelected=true;	
      }	
    }	
 }	
 else{	
  TempPopUPData[i].maxSelectionCustAddons = '';	
  TempPopUPData[i].maxQuantityPerAddons = '';	
}	
}	
   
  dialogConfig.autoFocus = false;	
  const dialogRef = this.dialog.open(VarientDialogComponent, {panelClass: 'dialogVariantStyleChange'});	
   dialogRef.componentInstance.popUPData = TempPopUPData;	
  dialogRef.afterClosed().subscribe(result => {	
    if(result!=undefined){	
          
    const control2 = <FormArray>control['customQuantity'];	
    while (control2.length) {	
      control2.removeAt(control2.length - 1);	
    }	
    if(result['tableData'].productVariants.length>0){	
      let temparray = result['tableData'].productVariants;	
      const array = <FormArray>control['customQuantity'];	
      for (let i = 0; i <= temparray.length-1; i++) {	
        if(temparray[i].isVariantTypeSelected == true){	
          let Data = temparray[i].variantTypeName+":"+(temparray[i].maxSelectionCustAddons || 0)+","+(temparray[i].maxQuantityPerAddons || 0);	
          let arr = this.fb.group({	
          variantTypeOid: temparray[i].variantTypeOid,	
          maxSelectionCustAddons: temparray[i].maxSelectionCustAddons,	
          maxQuantityPerAddons: temparray[i].maxQuantityPerAddons,	
          variantTypeName: temparray[i].variantTypeName,	
          isVariantTypeSelected:temparray[i].isVariantTypeSelected,	
          DisplayData:Data	
        });	
        array.push(arr);	
      }	
      }	
    }	
  }	
  });	
}	
openAddOnsCustomizationDialog(event, value, control, i) {	
  const dialogConfig = new MatDialogConfig();	
  dialogConfig.data = {	
    addonType: value	
  }	
  let checkData= control['addonArray'].value;	
 let selectedData=[];	
 for(let i=0;i<=checkData.length-1;i++){	
   let key = checkData[i]['addonOid'];	
   selectedData.push(key)	
 }	
  const dialogRef = this.dialog.open(AddOnsComponent, dialogConfig);	
  dialogRef.componentInstance.selectedData = selectedData;	
  dialogRef.componentInstance.categoryOid = this.categoryOid;	
  dialogRef.afterClosed().subscribe(result => {	
    if(result!=undefined){	
    const control2 = <FormArray>control['addonArray'];	
    while (control2.length) {	
      control2.removeAt(control2.length - 1);	
    }	
    this.selectedAddonsResultCustomize = result;	
    let imagePath = [];	
    if(this.buildFlagCustomization = true){	
      if (this.customImages.length > i) {	
        this.customImages[i].image = [];	
        this.buildFlagCustomization = false;	
      }	
    }	
    else{	
      if (this.customImages.length >= i) {	
        this.customImages[i].image = [];	
      }	
    }	
    let flag = false;	
    const array = <FormArray>control['addonArray'];	
    let count = 0;	
    for (let ln of this.selectedAddonsResultCustomize) {	
      let arr = this.fb.group({	
        addonOid: [ln.addonOid],	
        addonName: [ln.addonName],	
        addonImagePath: [ln.addonImagePath],	
        displayPrice: [ln.displayPrice]	
      });	
      array.push(arr);	
      if (this.customImages.length <= i || this.customImages.length == 0) {	
        imagePath[count] = ln.addonImagePath;	
        flag = true;	
        count = count + 1;	
      } else {	
        this.customImages[i].image.push(ln.addonImagePath);	
        count = count + 1;	
      }	
    }	
    if (flag) {	
      this.customImages[i] = {	
        image: imagePath	
      };	
      if (this.selectedAddonsResultCustomize.length != 0) {	
        this.customizeAddonRequired = false;	
        this.customizeAddonSelectionErrorMsg = "";	
      }	
    }	
  }	
  });	
}	
public viewCustomizeAddon(control, isPrepopulateObj, addonData: any) {	
  if (isPrepopulateObj) {	
    const array = <FormArray>control.controls['addonArray'];	
    for (let i = 0; i < addonData.addonDetails.length; i++) {	
      let arr = this.fb.group({	
        addonOid: [addonData.addonDetails[i].addonOid],	
        addonName: [addonData.addonDetails[i].addonName],	
        addonImagePath: [addonData.addonDetails[i].addonImagePath],	
        displayPrice: [addonData.addonDetails[i].displayPrice]	
      });	
      array.push(arr);	
    }	
  }	
}	
  
viewCustomQuantity(control, isPrepopulateObj, quantityData: any){	
  if (isPrepopulateObj) {	
    if(quantityData.customQuantity!=undefined){	
      const control2 = <FormArray>control.controls['customQuantity'];	
      while (control2.length) {	
        control2.removeAt(control2.length - 1);	
      }	
    if(quantityData.customQuantity.length>0){	
    const array = <FormArray>control.controls['customQuantity'];	
    for (let i = 0; i <= quantityData.customQuantity.length-1; i++) {	
      let Data = quantityData.customQuantity[i].variantTypeName+":"+(quantityData.customQuantity[i].maxSelectionCustAddons || 0)+","+(quantityData.customQuantity[i].maxQuantityPerAddons || 0);	
      let arr = this.fb.group({	
        variantTypeOid: quantityData.customQuantity[i].variantTypeOid,	
        maxSelectionCustAddons: quantityData.customQuantity[i].maxSelectionCustAddons,	
        maxQuantityPerAddons: quantityData.customQuantity[i].maxQuantityPerAddons,	
        variantTypeName: quantityData.customQuantity[i].variantTypeName,	
        DisplayData:Data,	
        isVariantTypeSelected:true	
      });	
      array.push(arr);	
    }	
  }	
  else{	
    const array = <FormArray>control.controls['customQuantity'];	
    let arr = this.fb.group({	
      variantTypeOid: '',	
      maxSelectionCustAddons: '',	
      maxQuantityPerAddons: '',	
      variantTypeName: '',	
      DisplayData:'',	
      isVariantTypeSelected:false	
    });	
    array.push(arr);	
  }	
}	
  }	
}	
removeAddonImage(id) {	
  this.selectedAddonsResult.splice(id, 1);	
}	
public removeCustomization(i, index) {
  const control = this.customizationForm.get('contentBlock') as FormArray;
  const removeAddon = control.at(i).get('addonArray') as FormArray;
  removeAddon.removeAt(index);
  this.customImages[i].image.splice(index, 1);
}
onCloseClick(i){
  const control = this.customizationForm.get('contentBlock') as FormArray;
    control.removeAt(i);
  }
openBeveragesDialog() {	
  const dialogRef = this.dialog.open(BeveragesDialogComponent);	
}	
openBreadsDialog() {	
  const dialogRef = this.dialog.open(BreadsDialogComponent);	
}

  	
createOrEdit(formData) {
  let addonRequired = false;
  let customAddonRequired = false;

  // if (this.addonImagePath.addonArray > 0) {
    this.customizeQuantity = false;
    for (let i = 0; i < formData.contentBlock.length; i++) {
      if(formData.contentBlock[i].addonArray.length>0){
        for (let j = 0; j < formData.contentBlock[i].addonArray; j++) {
          if (this.addonImagePath[j] == '') {
            this.showError = true;
          }
      }
    }
    else{
          this.showError = true;
          this.customizeAddonSelectionErrorMsg = "Please select addons";
          customAddonRequired = true;
          // this.customizeQuantity = true;
        }
      if(formData.contentBlock[i].customQuantity.length == 0 || formData.contentBlock[i].customQuantity.length == undefined){
        this.customizeQuantity = true;
      }
    }

  // }

  if (this.customizationForm.invalid == true || customAddonRequired || this.customizeQuantity ) {
    this.showError = true;
    if (this.customizeAddonRequired = true) {
      this.customizeAddonRequired = true;
      this.customizeAddonSelectionErrorMsg = "Please select addons";
      customAddonRequired = true;
    }
  } else {
    this.loading = true;
    this.showError = false;
    let customizeAddons = [];

    for (let i = 0; i < formData.contentBlock.length; i++) {
      let obj = {
        addonType: "CUSTOMISATION",
         isMultiSelect: false,
         isFreeProduct: formData.contentBlock[i].isFreeProduct,
          isMandatory:formData.contentBlock[i].isMandatory,
        addonOids: this.getCustomAddonArray(formData.contentBlock[i].addonArray),
        addonLocales: this.getAddonLocales(formData.contentBlock[i].labelLocale, i),
        customQuantity: this.getCustomQuantityArray(formData.contentBlock[i].customQuantity)

      }
      customizeAddons.push(obj);
    }

    let request = {
      productOid: parseFloat(this.id),
      // addon: ObjAddon,
      crossSellAddons: this.selectedAddonsResult,
      customizeAddons: customizeAddons,
      status: this.toggleVal == true ? 'ONLINE' : 'OFFLINE'
    }
    let CREATE_OR_UPADTE_PRODUCT_ADDON = environment.APIEndpoint + "api/rpa/product/v3/update/addon";

    // let CREATE_OR_UPADTE_PRODUCT_ADDON = environment.APIEndpoint + "api/rpa/product/v1/update/addon";
    this.http.postJson(CREATE_OR_UPADTE_PRODUCT_ADDON, request)
      .subscribe((response) => {
        this.snackBar.openFromComponent(SnackBarComponent, {
          duration: 10000,
          data: {
            status: "success",
            message: "Product addon has been added successfully"
          }
        });
        this.loading = false;
        this.router.navigate(['/search-products']);
      }
        , err => {
          this.loading = false;
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
        })
  }
}

public getAddonsByProductId() {
  let GET_ADDON_BY_PRODUCT_ID = environment.APIEndpoint + "api/rpa/product/v3/view/addon";

  let request = {
    productOid: parseFloat(this.id)
  }
  this.http.postJson(GET_ADDON_BY_PRODUCT_ID, request)
    .subscribe((response) => {
      this.addonData = response;
      this.buildFlagCustomization = false;
 
    this.selectedAddonsResult = this.addonData.crossSellAddons;
    if(this.selectedAddonsResult != null || this.selectedAddonsResult != undefined){
    for(let i=0;i<=this.selectedAddonsResult.length-1;i++){
      let imagePath =this.selectedAddonsResult[i]['imagePath'];
      let productName = this.selectedAddonsResult[i]['productName']+' ( '+this.selectedAddonsResult[i]['variantTypeName']+' )';
      this.selectedAddonsResult[i]['productName']=productName;
      this.selectedAddonsResult[i]['imagePath']=imagePath;
      this.selectedAddonsResult[i]['uniqueID'] = this.selectedAddonsResult[i]['oid'];

    }
  }
   if(this.addonData.customizeAddons !== null || this.addonData.customizeAddons != undefined){
      let count = 0;
      for (let m of this.addonData.customizeAddons) {
        this.customizationAddonLocale = [];
        this.radioValue = m.freeProduct ;
        this.isMandatory = m.mandatory;
        this.customizationAddonLocale = m.addonLocale;
        for (let addon of m.addonDetails) {
          if (m.addonType == 'CUSTOMISATION') {
            this.customizationAddons.push(addon);
            this.selectedAddonsResultCustomize = this.customizationAddons;
            this.addonDetails = m;

            for (let i = 0; i < m.addonDetails.length; i++) {
              this.addonImagePath[i] = m.addonDetails[i].addonImagePath;
              if (this.addonImagePath[i] != '')
                this.uploadFlag[i] = true
            }
          }
          for (let locale of m.addonLocale) {
            this.alignCss.push(locale.languageDirection == 'RTL' ? 'text-right' : '');
            this.languageDirection.push(locale.languageDirection == 'RTL' ? 'direction' : '');
          }
        }
        let imagePath = [];
        for (let i = 0; i < m.addonDetails.length; i++) {
          imagePath[i] = m.addonDetails[i].addonImagePath;
        }
        this.customImages[count] = {
          image: imagePath
        };
        count = count + 1;

        this.isPrepopulate = true;
        this.getGroupData(this.isPrepopulate, m);
      }
    }
    }
      , err => {
        this.snackBar.openFromComponent(SnackBarComponent, {
          duration: 1500,
          data: {
            status: "failure",
            message: "Your request cannot be saved at this time. Please try again later"
          }
        });
      })
}

  openViewStoreDialog() {
    this.variantsDataFormData = this.variantsFormGroup.value;
    this.variantsNewData = this.variantsDataFormData.productVariants;
    this.variantsName = this.variantsDataView.variantName;
    this.variantRegionArray = this.variantsDataView.variantRegionArray;
    const dialogRef = this.dialog.open(ViewVariantStoreDialogComponent, {
      panelClass: 'custom-modalbox'
    });
    dialogRef.componentInstance.selectedStoreData = this.stores;
    dialogRef.componentInstance.variantsData = this.variantsNewData;
    dialogRef.componentInstance.variantsStorePopupDataEdit = this.variantsStorePopupDataEdit;
    dialogRef.afterClosed().subscribe(
      (result) => {

      }
    );
  }

  openSelectStoreVariantDialog(){
    const dialogRef = this.dialog.open(selectStoreVariantDialog);
    dialogRef.componentInstance.storeList = this.selectedStorearray;
    dialogRef.componentInstance.brandId = this.brandId;
    dialogRef.componentInstance.tableData = this.tableData;
    dialogRef.componentInstance.activeGroupId = this.activeGroupId;

    dialogRef.afterClosed().subscribe(result => {
      if (result.buttonName === 'SELECT') {
        this.tableData = result.tableData;
        this.selectedStorearray = [];
        this.selectedCount = result.tableData.length;
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
  
  openAddStoreDialog() {
    this.variantsDataFormData = this.variantsFormGroup.value;
    this.variantsNewData = this.variantsDataFormData.productVariants;
    this.viewVariantsName = this.productVariants;
    this.variantRegionArray = this.variantsDataView.variantRegionArray;
    const dialogRef = this.dialog.open(VariantsAddStoreDialogComponent);
    dialogRef.componentInstance.storeList = this.selectedStorearray;
    dialogRef.componentInstance.storeListCurrency = this.stores;
    dialogRef.componentInstance.totalCount = this.storeCount;
    dialogRef.componentInstance.variantsDataList = this.variantsNewData;
    dialogRef.componentInstance.variantsData = this.variantsNewData;
    dialogRef.componentInstance.viewVariantsName = this.viewVariantsName;
    dialogRef.componentInstance.variantsStorePopupDataEdit = this.variantsStorePopupDataEdit;

    dialogRef.afterClosed().subscribe(result => {
      if (result.buttonName === 'SELECT') {
        this.stores = result.tableData;
        this.variantsDataView = result.variantsData;
        this.selectedStorearray = [];
        this.selectedCount = result.tableData.length;
        if (this.selectedCount != 0) {
          this.storeRequired = false;
          for (let i = 0; i < result.tableData.length; i++) {
            let storeId = result.tableData[i].storeOid;
            this.selectedStorearray.push(storeId);
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
        } else {
          this.storeErrorMsg = "Please select Store";
        }
      }
    });
  }

  public removeImageAddOns(index) {
    this.imagePathAddOns.slice(index, 1);
  }

  public removeImageBreads(index) {
    this.imagePathBreads.slice(index, 1);
  }

  public uploadImageAdds(event: FileList) {
    this.imageUploading = true;
    if (event[0].size < 1000000) {
      if (event[0].type == "image/jpeg" || event[0].type == "image/png" || event[0].type == "image/jpg" || event[0].type == "image/JPG" || event[0].type == "image/JPEG" || event[0].type == "image/PNG") {
        if (event[0].size < 1000000) {
          this.uploadFile.upload(event.item(0), 'productAddon', 'images')
            .subscribe((response) => {
              this.imagePath = response['message'];
              this.imageUploading = false;
              this.showImageError = false;
              this.uploadElRef.nativeElement.value = ''
              this.snackBar.openFromComponent(SnackBarComponent, {
                duration: 1500,
                data: {
                  status: "success",
                  message: " image successfully uploaded"
                }
              });
            }, err => {
              this.snackBar.openFromComponent(SnackBarComponent, {
                duration: 10000,
                data: {
                  status: "failure",
                  message: "Internal server error"
                }
              });
            });
        } 
        else {
          this.imageUploading = false;
          this.imageErrMsg = "Max upload file size is 1Mb";
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
    else {
      this.imagePath = '';
      this.snackBar.openFromComponent(SnackBarComponent, {
        duration: 10000,
        data: {
          status: "failure",
          message: "Max upload file size is 1Mb"
        }
      });
    }
  }

  public uploadImage(event: FileList, i) {
    this.imageUploading = true;
    if (event[0].size < 1000000) {
      if (event[0].type == "image/jpeg" || event[0].type == "image/png" || event[0].type == "image/jpg" || event[0].type == "image/JPG" || event[0].type == "image/JPEG" || event[0].type == "image/PNG") {
        if (event[0].size < 1000000) {
          this.uploadFile.upload(event.item(0), 'product', 'images')
            .subscribe((response) => {
              this.imagePath[i] = response['message'];
              this.uploadFlag[i] = true;
              this.uploadError[i] = false;
              this.uploadElRef.nativeElement.value = ''
              this.snackBar.openFromComponent(SnackBarComponent, {
                duration: 1500,
                data: {
                  status: "success",
                  message: " image successfully uploaded"
                }
              });
            }, err => {
              this.snackBar.openFromComponent(SnackBarComponent, {
                duration: 10000,
                data: {
                  status: "failure",
                  message: "Internal server error"
                }
              });
            }
            )
        } else {
          this.imageUploading[i] = false;
          this.imageErrMsg = "Max upload file size is 1Mb";

        }
      } else {
        this.imagePath[i] = '';
        this.snackBar.openFromComponent(SnackBarComponent, {
          duration: 10000,
          data: {
            status: "failure",
            message: "Supported format is JPG, JPEG and PNG"
          }
        });
      }
    } else {
      this.imagePath[i] = '';
      this.snackBar.openFromComponent(SnackBarComponent, {
        duration: 10000,
        data: {
          status: "failure",
          message: "Max upload file size is 1Mb"
        }
      });
    }
  }

  getViewData() {
    this.id = this.router.url.split('view-products/')[1];
    let data = {
      "productOid": parseFloat(this.id)
    }
    this.http.postJson(environment.APIEndpoint + "api/rpa/product/v1/view", data).subscribe(res => {
      this.viewData = res;
      this.toggleVal = res["status"] == "ONLINE" ? true : false;
      this.checked = res['status'] == 'ONLINE' ? true : false;
      this.imgUpload = true;
      this.imgUploadDieatry = true;
      this.imgUploadAlergion = true;
      this.imgUploadAddOns = true;
      this.imgUploadBreads = true;
      this.selectedCount = res["selectedStoreCount"];
      // this.totalCount = res["totalStoreCount"];
      this.categories = this.getCategories(res['categories']);
      this.brandName = res["brand"].brandName;
      this.brandId = res["brand"].brandId;

      for (let prod of this.viewData["productLocales"]) {
        this.alignCss.push(prod.languageDirection == 'RTL' ? 'text-right' : '');
      }
      // for (let st of this.viewData["stores"]) {
      //   if (this.viewData["displayPrice"] != st.price) {
      //     this.priceLabel = "Different Price";
      //   }
      // }
      let availFrom = new Date();
      let availTo = new Date();

      if (this.viewData["availableFrom"] != "" && this.viewData["availableFrom"] != null) {
        var hh = this.viewData["availableFrom"].split(":");
        availFrom.setHours(hh[0]);
        availFrom.setMinutes(hh[1]);
        this.availableFrom = availFrom;
      }

      if (this.viewData["availableTo"] != "" && this.viewData["availableTo"] != null) {
        var hh = this.viewData["availableTo"].split(":");
        availTo.setHours(hh[0]);
        availTo.setMinutes(hh[1]);
        this.availableTo = availTo;
      }
    })
  }

  getOnlineVariants() {
    this.http.getJson(environment.APIEndpoint + 'api/rpa/menu/variant/v1/get/variants')
      .subscribe((response) => {
        this.variantList = response;
        this.stores.variants = [];
      });
  }

  public getViewVariantsData() {
    let GET_VARIANTS_BY_ID = environment.APIEndpoint + "api/rpa/product/v2/view/variants";
    let request = {
      productOid: parseFloat(this.id)
    }
    this.http.postJson(GET_VARIANTS_BY_ID, request)
      .subscribe((response) => {
        this.variantsData = response;
        this.isPrepopulate = true;
        this.variant = response["variant"];
        this.variantPopupData =[];

        for(let i=0;i<=response["productVariants"].length-1;i++){
          let obj =  {
            "variantTypeOid": response["productVariants"][i]['variantTypeOid'],
            "variantTypeName": response["productVariants"][i]['variantTypeName'],
            "maxSelectionCustAddons":'',
            "maxQuantityPerAddons":'',
            "isVariantTypeSelected":true
          }
          this.variantPopupData.push(obj);
        }
        this.getPreprolateVariant(this.variantsData, this.isPrepopulate);	
        if (this.isPrepopulate == true) {	
          this.getAllVariants(this.variantOid, this.variantsData, this.isPrepopulate);	
        }	

        this.productVariants = response["productVariants"];
        if (this.isPrepopulate == true) {
          for (let i = 0; i < this.productVariants.length; i++) {
            this.imagePath[i] = this.productVariants[i].imagePath;
            if (this.imagePath[i] != '')
              this.uploadFlag[i] = true
          }
        }
        // this.selectedCount = response["selectedStoreCount"];
        // this.totalCount = response["totalStoreCount"];
        // for (const store of response["stores"]) {
        //   this.selectedStorearray.push(store.storeOid);
        // }
        // this.stores = response["stores"];
        // for (let store of response["stores"]) {
        //   this.variantsStorePopupDataEdit.push(store['variants']);
        // }
      });
  }

  public getViewVariantsDataV1() {
    let GET_VARIANTS_BY_ID = environment.APIEndpoint + "api/rpa/product/v1/view/variants";
    let request = {
      productOid: parseFloat(this.id)
    }
    this.http.postJson(GET_VARIANTS_BY_ID, request)
      .subscribe((response) => {
        this.selectedCount = response["selectedStoreCount"];
        for (const store of response["stores"]) {
          this.selectedStorearray.push(store.storeOid);
        }
        this.stores = response["stores"];
        for (let store of response["stores"]) {
          this.variantsStorePopupDataEdit.push(store['variants']);
        }
      });
  }


  public removeVariantImage(index) {
    this.imagePath[index] = "";
    this.uploadFlag[index] = false;
  }

  getAllVariants(variantOid, variantsData, isPrepopulate) {
    this.variantOid = variantOid;
    this.variantsData = variantsData;
    this.isPrepopulate = isPrepopulate;
    if (!isPrepopulate) {
      this.variantOid = variantOid;
    }
    else {
      this.variantOid = variantsData.variant.variantOid;
    }
    let GET_ALL_VARIANTS = environment.APIEndpoint + "api/rpa/menu/variant/v1/get/variantTypes?variantOid=" + this.variantOid;
    this.http.getJson(GET_ALL_VARIANTS)
      .subscribe((response) => {
        const control = <FormArray>this.variantsFormGroup.controls['productVariants'];
        while (control.length) {
          control.removeAt(control.length - 1);
        }
        this.imagePath = [''];
        this.variantListData = response;
        this.productVariantsForm(this.variantsData);
      });
  }

  public getPreprolateVariant(editData, isPrepopulateObj) {
    if (isPrepopulateObj) {
      this.variantsFormGroup = this.fb.group({
        variantName: [editData.variant.variantOid, Validators.compose([Validators.required])],
        productVariants: this.fb.array([])
      });
    }
  }

  public buildCreateVariantsForm() {
    this.variantsFormGroup = this.fb.group({
      variantName: ['', Validators.compose([Validators.required])],
      productVariants: this.fb.array([])
    });
  }

  public productVariantsForm(editData) {
    const control = <FormArray>this.variantsFormGroup.controls['productVariants'];
    let details1 = this.variantsFormGroup.get('productVariants') as FormArray;

    for (let p = 0; p < this.variantListData.length; p++) {
      const newForm = this.fb.group({
        isVariantTypeSelected: [false],
        variantTypeName: [this.variantListData[p].variantType],
        variantTypeOid: [this.variantListData[p].variantTypeOid],
        productVariantOid: [''],
        imagePath: ['', Validators.compose([Validators.required])],
        skuCode: ['', Validators.compose([Validators.required])],
        displayPrice: ['', Validators.compose([Validators.required])],
        costPrice: ['', Validators.compose([Validators.pattern('/^[0-9]+(\.[0-9]{1,2})?$/')])],
        inventory: ['', Validators.compose([Validators.pattern('/^[0-9]+(\.[0-9]{1,2})?$/')])],
        minimumInventory: ['', Validators.compose([Validators.pattern('^([0-9]{1,5})(\\.[0-9]{1,5})?$')])],
        taxRate: ['', Validators.compose([Validators.pattern('^([0-9]{1,5})(\\.[0-9]{1,5})?$')])],
        weight: ['', Validators.compose([Validators.pattern('^([0-9]{1,3})(\\.[0-9]{1,5})?$')])]
      });
      control.push(newForm);
   
      if (editData.productVariants >= 0 || editData.productVariants != undefined) {
        for (let a = 0; a < editData.productVariants.length; a++) {
          if (editData.productVariants[a].variantTypeOid == this.variantListData[p].variantTypeOid) {
            let details = this.variantsFormGroup.get('productVariants') as FormArray;
            this.imagePath[p] = editData.productVariants[a].imagePath;
            this.uploadFlag[p] = true;
            let isVariantTypeSelected = details.at(p).get('isVariantTypeSelected');
            isVariantTypeSelected.setValue(editData.productVariants[a].isVariantTypeSelected == true);
            isVariantTypeSelected.updateValueAndValidity();
            let skuCode = details.at(p).get('skuCode');
            skuCode.setValue(editData.productVariants[a].skuCode);
            skuCode.updateValueAndValidity();
            let productVariantOid = details.at(p).get('productVariantOid');
            productVariantOid.setValue(editData.productVariants[a].productVariantOid);
            skuCode.updateValueAndValidity();
            let displayPrice = details.at(p).get('displayPrice');
            displayPrice.setValue(editData.productVariants[a].displayPrice);
            displayPrice.updateValueAndValidity();
            let costPrice = details.at(p).get('costPrice');
            costPrice.setValue(editData.productVariants[a].costPrice);
            costPrice.updateValueAndValidity();
            let inventory = details.at(p).get('inventory');
            inventory.setValue(editData.productVariants[a].inventory);
            inventory.updateValueAndValidity();
            let minimumInventory = details.at(p).get('minimumInventory');
            minimumInventory.setValue(editData.productVariants[a].minimumInventory);
            minimumInventory.updateValueAndValidity();
            let taxRate = details.at(p).get('taxRate');
            taxRate.setValue(editData.productVariants[a].taxRate);
            taxRate.updateValueAndValidity();
            let weight = details.at(p).get('weight');
            weight.setValue(editData.productVariants[a].weight);
            weight.updateValueAndValidity();
          }
        }
      }
    }
    for (let p = 0; p < this.variantListData.length; p++) {
      this.uploadFlag.push(false);
      this.uploadError.push(false);
      this.imagePath.push('');
    }
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.variantListData;
    this.selectedVariantArray = this.selection.selected;
    return numSelected === numRows;
  }

  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.variantListData.forEach(row => this.selection.select(row));
  }

  
  public getAddonLocales(labelLocale, mainIndex) {	
    this.addonLocalesObj = [];	
    labelLocale.forEach((addon, index) => {	
      this.addonLocalesObj.push({	
        displayName: addon.labelName,	
        languageOid: this.languageList[index].languageId	
      })	
    })	
    return this.addonLocalesObj;	
  }	
  public getCustomAddonArray(addonArray) {	
    this.customizeAddonOids = [];	
    addonArray.forEach((addonOids) => {	
      this.customizeAddonOids.push(addonOids.addonOid)	
    })	
    return this.customizeAddonOids;	
  }	
  customQuantityArray=[];	
  public getCustomQuantityArray(customQuantityArray) {	
    if(customQuantityArray.length > 0){	
    this.customQuantityArray = [];	
    customQuantityArray.forEach((data) => {	
      this.customQuantityArray.push({	
        variantTypeOid: data.variantTypeOid,	
        maxSelectionCustAddons: data.maxSelectionCustAddons,	
        maxQuantityPerAddons:data.maxQuantityPerAddons	
      });
    });
    return this.customQuantityArray;	
  }	
}

  public variantsForm(formData) {
    for (let i = 0; i < this.productVariants.length; i++) {
      this.productVariantOid = this.productVariants[i].productVariantOid;
    }
    if (this.productVariantOid == undefined || this.productVariantOid == '' || this.productVariantOid <= 0) {
      this.variantsLocales = [];
      this.productVariantsArray = [];
      this.variantsTypeArray = [];
      this.storeArray = [];
      this.loading = true;
      this.showError = false;

      if (formData.productVariants.skuCode == '') {
        for (let i = 0; i < formData.productVariants.length; i++) {
          if (formData.productVariants[i].isVariantTypeSelected == true && formData.productVariants[i].skuCode == '' || formData.productVariants[i].skuCode == null || formData.productVariants[i].skuCode == undefined) {
            this.uploadErrorSku[i] = true;
            this.showError = true;
            this.isVariantTypeSelected[i] = true;
          }
        }
      }

      if (formData.productVariants.displayPrice == '') {
        for (let i = 0; i < formData.productVariants.length; i++) {
          if (formData.productVariants[i].isVariantTypeSelected == true && formData.productVariants[i].displayPrice == '' || formData.productVariants[i].displayPrice == null || formData.productVariants[i].displayPrice == undefined) {
            this.showError = true;
            this.isVariantTypeSelected[i] = true;
          }
        }
      }

      if (this.imagePath.length > 0) {
        for (let i = 0; i < formData.productVariants.length; i++) {
          if (this.imagePath[i] == '' && formData.productVariants[i].isVariantTypeSelected == true) {
            this.uploadError[i] = true;
            this.showError = true;
            this.isVariantTypeSelected[i] = true;
          }
        }
      }

      for (let i = 0; i < formData.productVariants.length; i++) {
        if (formData.productVariants[i] != '') {
          if (formData.productVariants[i].isVariantTypeSelected == true) {
            console.log(formData.productVariants[i].displayPrice);
            let amtDisplayPrice = formData.productVariants[i].displayPrice;
            let amtCostPrice = formData.productVariants[i].costPrice;
            let amtInventoryPrice = formData.productVariants[i].inventory;
            let amtMinimumInventoryPrice = formData.productVariants[i].minimumInventory;
            let amtTaxRate = formData.productVariants[i].taxRate;
            let amtWeight = formData.productVariants[i].weight;

            let locale = {
              isVariantTypeSelected: formData.productVariants[i].isVariantTypeSelected,
              variantTypeOid: formData.productVariants[i].variantTypeOid,
              skuCode: formData.productVariants[i].skuCode,
              displayPrice: amtDisplayPrice,
              costPrice: parseInt(amtCostPrice),
              inventory: parseInt(amtInventoryPrice),
              minimumInventory: parseInt(amtMinimumInventoryPrice),
              taxRate: parseInt(amtTaxRate),
              weight: parseInt(amtWeight),
              imagePath: this.imagePath[i]
            }
            this.productVariantsArray.push(locale);
          }
        }
      }

      for (let i = 0; i < formData.productVariants.length; i++) {
        if (formData.productVariants[i].isVariantTypeSelected == true) {
        // let amtDisplayPrice = formData.productVariants[i].displayPrice;
        let locale = {
          variantTypeOid: formData.productVariants[i].variantTypeOid,
          displayPrice: formData.productVariants[i].displayPrice,
        }
        this.variantsTypeArray.push(locale);
         }
      }

      for (let i = 0; i < this.stores.length; i++) {
        if (this.selectedStorearray[i] != '') {
          let locale = {
            storeOid: this.stores[i].storeOid,
            variantTypes: this.variantsTypeArray
          }
          this.storeArray.push(locale);
        }
      }

      let createReq = {
        productOid: parseFloat(this.id),
        variantOid: formData.variantName,
        productVariants: this.productVariantsArray,
        stores: this.storeArray
      }

      let CREATE_VARIANTS = environment.APIEndpoint + "api/rpa/product/v1/create/variants";
      this.http.postJson(CREATE_VARIANTS, createReq)
        .subscribe((response) => {
          this.snackBar.openFromComponent(SnackBarComponent, {
            duration: 1500,
            data: {
              status: "success",
              message: "Variants added successfully"
            }
          });
          this.loading = false;
          this.router.navigate(['/search-products']);
        }
          , err => {
            this.loading = false;
            if (err.error.errorType == 'VALIDATION') {
              this.snackBar.openFromComponent(SnackBarComponent, {
                duration: 1500,
                data: {
                  status: "failure",
                  message: err.error.errorDetails[0].description
                }
              });
            } else {
              this.snackBar.openFromComponent(SnackBarComponent, {
                duration: 1500,
                data: {
                  status: "failure",
                  message: "Your request cannot be saved at this time. Please try again later"
                }
              });
            }
          })
    }
    else {
      this.variantsLocales = [];
      this.productVariantsArray = [];
      this.variantsTypeArray = [];
      this.storeArray = [];
      this.loading = true;
      this.showError = false;

      if (this.imagePath.length > 0) {
        for (let i = 0; i < formData.productVariants.length; i++) {
          if (this.imagePath[i] == '' && formData.productVariants[i].isVariantTypeSelected == true) {
            this.uploadError[i] = true;
            this.showError = true;
            this.isVariantTypeSelected[i] = true;
          }
        }
      }

      if (formData.productVariants.skuCode == '') {
        for (let i = 0; i < formData.productVariants.length; i++) {
          if (formData.productVariants[i].isVariantTypeSelected == true && formData.productVariants[i].skuCode == '' || formData.productVariants[i].skuCode == null || formData.productVariants[i].skuCode == undefined) {
            this.showError = true;
            this.isVariantTypeSelected[i] = true;
          }
        }
      }

      if (formData.productVariants.displayPrice == '') {
        for (let i = 0; i < formData.productVariants.length; i++) {
          if (formData.productVariants[i].isVariantTypeSelected == true && formData.productVariants[i].displayPrice == '' || formData.productVariants[i].displayPrice == null || formData.productVariants[i].displayPrice == undefined) {
            this.showError = true;
            this.isVariantTypeSelected[i] = true;
          }
        }
      }

      let count=0;
      for (let i = 0; i < formData.productVariants.length; i++) {
      if (formData.productVariants[i] != '') {
      if (formData.productVariants[i].isVariantTypeSelected == true) {
      let amtDisplayPrice = formData.productVariants[i].displayPrice;
      let amtCostPrice = formData.productVariants[i].costPrice;
      let amtInventoryPrice = formData.productVariants[i].inventory;
      let amtMinimumInventoryPrice = formData.productVariants[i].minimumInventory;
      let amtTaxRate = formData.productVariants[i].taxRate;
      let amtWeight = formData.productVariants[i].weight;

      let locale = {
      isVariantTypeSelected: formData.productVariants[i].isVariantTypeSelected,
      variantTypeOid: formData.productVariants[i].variantTypeOid,
      productVariantOid: formData.productVariants[i].productVariantOid,
      skuCode: formData.productVariants[i].skuCode,
      displayPrice: amtDisplayPrice,
      costPrice: parseInt(amtCostPrice),
      inventory: parseInt(amtInventoryPrice),
      minimumInventory: parseInt(amtMinimumInventoryPrice),
      taxRate: parseInt(amtTaxRate),
      weight: parseInt(amtWeight),
      imagePath: this.imagePath[i]
      }
      this.productVariantsArray.push(locale);
      count=count+1;
      }
      }
      }

      for (let i = 0; i < formData.productVariants.length; i++) {
        if (formData.productVariants[i].isVariantTypeSelected == true) {
        // let amtDisplayPrice = formData.productVariants[i].displayPrice;
        let locale = {
          variantTypeOid: formData.productVariants[i].variantTypeOid,
          displayPrice: formData.productVariants[i].displayPrice,
        }
        this.variantsTypeArray.push(locale);
         }
      }

      for (let i = 0; i < this.stores.length; i++) {
        if (this.selectedStorearray[i] != '') {
          let locale = {
            storeOid: this.stores[i].storeOid,
            variantTypes: this.variantsTypeArray
          }
          this.storeArray.push(locale);
        }
      }

      let createReq = {
        productOid: parseFloat(this.id),
        variantOid: formData.variantName,
        productVariants: this.productVariantsArray,
        stores: this.storeArray
      }

      let CREATE_VARIANTS = environment.APIEndpoint + "api/rpa/product/v1/update/variants";
      this.http.postJson(CREATE_VARIANTS, createReq)
        .subscribe((response) => {
          this.snackBar.openFromComponent(SnackBarComponent, {
            duration: 1500,
            data: {
              status: "success",
              message: "Variants updated successfully"
            }
          });
          this.loading = false;
          this.router.navigate(['/search-products']);
        }
          , err => {
            this.loading = false;
            if (err.error.errorType == 'VALIDATION') {
              this.snackBar.openFromComponent(SnackBarComponent, {
                duration: 1500,
                data: {
                  status: "failure",
                  message: err.error.errorDetails[0].description
                }
              });
            } else {
              this.snackBar.openFromComponent(SnackBarComponent, {
                duration: 1500,
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
