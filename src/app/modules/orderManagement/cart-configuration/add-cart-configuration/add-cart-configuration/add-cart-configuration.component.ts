import { OnInit, ViewChild, Output, Input, Component, EventEmitter, AfterViewInit,ElementRef } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder, FormGroupDirective, FormArray, NgForm } from '@angular/forms';
import { MatPaginator, MatSort, MatTableDataSource, MatTabsModule, MatSnackBar,MatDialogConfig } from '@angular/material';
import { MatDialogModule } from '@angular/material/dialog';
import { SelectionModel } from '@angular/cdk/collections';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { addBeaconsDialog } from '../../../../../shared/components/add-beacons-dialog/add-beacons.component';
import { storeStaffDialog } from '../../../../../shared/components/store-staff-dialog/storestaff.component';
import { environment } from 'src/environments/environment';
import { HttpService } from 'src/app/services/http-service';
import { Router, ActivatedRoute } from '@angular/router';
import { SnackBarComponent } from 'src/app/shared/components/snack-bar/snack-bar.component';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { SelectAutocompleteComponent } from 'mat-select-autocomplete';
import { selectStoreDialog } from '../../../../../shared/components/select-store-dialog/select-store.component';
import { DenominationDialog } from "../../denomination-dialog/denomination-dialog.component";
import { UploadFile } from 'src/app/services/uploadFile.service';
import * as moment from 'moment';

@Component({
  selector: 'app-add-cart-configuration',
  templateUrl: './add-cart-configuration.component.html',
  styleUrls: ['./add-cart-configuration.component.scss']
})
export class AddCartConfigurationComponent implements OnInit {
  
  public breadCrumbData: Array<Object> = [
    { title: 'Home', link: '' },
    { title: 'Order Management', link: '' },
  ];
  keywordArray=[20,30,40,50]
  cartFormGroup:FormGroup;
  countryList=[]
  selectedBrandOptions: any[];
  @ViewChild('countryInput') countryInput: SelectAutocompleteComponent;
  @ViewChild('brandInput') brandInput: SelectAutocompleteComponent; 
  brands: any[];
  public countryIdval;
  public brandValueList;
  public selectStoreVal = false;
  public dataStore: boolean = true;
  public selectedStorearray = [];
  public totalCount = 0;
  public selectedCount = 0;
  public onLoadStoreCount:any=2000;
  StoreBrandID;
  public languageList = JSON.parse(localStorage.getItem("languageList"));
  public alignCss = [];
  public rightPanel = [];
  public minDate = new Date();
  public loading = false;
  public statusValue: string = 'ONLINE';
  public checked = true;
  public imageUploading: boolean = false;
  public imagePath: string = '';
  public filePathUrl = localStorage.getItem("imgBaseUrl");
  @ViewChild('addOnsImgFile') uploadElRef: ElementRef;
  imageErrMsg;
  constructor(private fb: FormBuilder, private https: HttpService,public dialog: MatDialog, private uploadFile: UploadFile,
    public snackBar: MatSnackBar,    private router: Router,
    ) { }

  ngOnInit() {
    this.buildCartForm();
     this.getBrand();
    //  this.getCountryByBrandId(0);

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
    this.https.postJson(environment.APIEndpoint + 'api/rpa/store/v2/getAll', data).subscribe(res => {
      this.totalCount = res["totalCount"];
      this.onLoadStoreCount =res["totalCount"];
    });

  }
  public toggleStatus(event) {
    if (event.checked) {
      this.statusValue = 'ONLINE';
    } else {
      this.statusValue = 'OFFLINE';
    }
  }
  isPrepopulate=false;
  buildCartForm(){
    let form = {
     
       instructionArray: this.fb.array([]),
      configurationTitle: ['', Validators.compose([Validators.required, Validators.minLength(5), Validators.pattern('^[a-zA-Z0-9\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF \"&\'(),-:.?_ ]*')])],
      brandOid: ["", Validators.required],
      countryOid: ["", Validators.required],
      storeField: [this.selectedCount, Validators.compose([Validators.min(1)])],
      tipsArray: this.fb.array([]),

     
  }
  this.cartFormGroup = this.fb.group(form);
     this.instructionFormAray();
    this.tipsFormArray();
  }
  tipsFormArray(){
    const control = <FormArray>this.cartFormGroup.get('tipsArray');
    let newGroup = this.fb.group({
      startDate:["", Validators.compose([Validators.required])],
      endDate:["", Validators.compose([Validators.required])],
      tipslabelLocale: this.fb.array([]),
      // store:'',
      deliveryPartner:'',
      imagePath:'',
      tipsdescriptionLocale: this.fb.array([]),
      denominationArray:this.fb.array([])

    });
    control.push(newGroup);
    this.tipsLabelLocale(control.controls[control.length - 1]);
    this.tipsDescriptionLocale(control.controls[control.length - 1]);
    
  }

  temKeyArray(control,temp){
    const array = <FormArray>control.controls['keyNumber'];
    for (let ln of temp) {
      let arr = this.fb.group({
        
        key: [ln]
      });
      array.push(arr);
  }
}
  addDecuctDialog(control,ind) {
       const dialogConfig = new MatDialogConfig();
       let selectedCountry = this.cartFormGroup.get('countryOid').value;
       console.log(selectedCountry);
       let TempCurrencyCode=[]
       if(selectedCountry.length >0){
        for(let i=0;i<=this.countries.length-1;i++){
          for(let j=0;j<=selectedCountry.length-1;j++){
            if(this.countries[i]['countryId'] == selectedCountry[j]){
              TempCurrencyCode.push(this.countries[i]['currencyCode'])
            }
          }
        }
     
        dialogConfig.autoFocus = false;
        const dialogRef = this.dialog.open(
          DenominationDialog,
          {panelClass: 'modelSize'}
        );
        const array1 = <FormArray>control.controls['denominationArray'];
        let selectedData = array1.value;
        dialogRef.componentInstance.selectedCountry = TempCurrencyCode;
        dialogRef.componentInstance.selectedData = selectedData;
        //  binding child component value to parent component
        dialogRef.afterClosed().subscribe(data => {
          const array = <FormArray>control.controls['denominationArray'];
         if(array.length > 0){
          let checkCurrency = 0;
            for(let i=0;i<=array.length-1;i++){
              let   tempValue = array.controls[i].get('currencyCode').value
                  if(data.currency == tempValue){
                    checkCurrency = 1;
                    const control2 = array.controls[i].get('keyNumber') as FormArray;
                    // control.at(index).get('listImage').setValue('');                   
                    while (control2.length) {
                      control2.removeAt(control2.length - 1);
                    }
                    this.temKeyArray(array.controls[i], data.keyNumbers);

                  }
              }
              if(checkCurrency == 0){
                let arr = this.fb.group({
                  currencyCode : data.currency,
                  
                  keyNumber: this.fb.array([])
                });
                array.push(arr);
                console.log(data.keyNumbers)
                this.temKeyArray(array.controls[array.length-1], data.keyNumbers) 
              }
          }else{
            let arr = this.fb.group({
              currencyCode : data.currency,
              
              keyNumber: this.fb.array([])
            });
            array.push(arr);
            console.log(data.keyNumbers)
            this.temKeyArray(array.controls[array.length-1], data.keyNumbers) 
          }
        
          // for (let ln of this.languageList) {
            
    
           
             
          
        });
       }
 
  }

  tipsDescriptionLocale(control){
    const array = <FormArray>control.controls['tipsdescriptionLocale'];
    for (let ln of this.languageList) {
      let arr = this.fb.group({
        descriptionName: ['', Validators.compose([Validators.required, Validators.minLength(5), Validators.pattern('^[a-zA-Z0-9\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF \"&\'(),-:.?_ ]*')])]
      });
      array.push(arr);
      this.alignCss.push(ln.direction == 'RTL' ? 'text-right' : '');
      this.rightPanel.push(ln.direction == 'RTL' ? 'right-panel' : '');
    }
  }
  tipsLabelLocale(control)
   {
    const array = <FormArray>control.controls['tipslabelLocale'];
    for (let ln of this.languageList) {
      let arr = this.fb.group({
        labelName: ['', Validators.compose([Validators.required, Validators.minLength(5), Validators.pattern('^[a-zA-Z0-9\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF \"&\'(),-:.?_ ]*')])]
      });
      array.push(arr);
      this.alignCss.push(ln.direction == 'RTL' ? 'text-right' : '');
      this.rightPanel.push(ln.direction == 'RTL' ? 'right-panel' : '');
    }
  }


  instructionFormAray(){
   
      const control = <FormArray>this.cartFormGroup.get('instructionArray');
      let newGroup = this.fb.group({
        startDate:["", Validators.compose([Validators.required])],
        endDate:["", Validators.compose([Validators.required])],
        labelLocale: this.fb.array([]),
        store:'',
        deliveryPartner:'',
        imagePath:'',
        descriptionLocale: this.fb.array([]),

      });
      control.push(newGroup);
      this.labelLocale(control.controls[control.length - 1]);
      this.descriptionLocale(control.controls[control.length - 1]);
      this.showError=false;
    
    //  this.viewCustomQuantity(control.controls[control.length - 1], isPrepopulateObj, addonData);
  }
  descriptionLocale(control){
    const array = <FormArray>control.controls['descriptionLocale'];
    for (let ln of this.languageList) {
      let arr = this.fb.group({
        descriptionName:['', Validators.compose([Validators.required, Validators.minLength(5), Validators.pattern('^[a-zA-Z0-9\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF \"&\'(),-:.?_ ]*')])]
      });
      array.push(arr);
      this.alignCss.push(ln.direction == 'RTL' ? 'text-right' : '');
      this.rightPanel.push(ln.direction == 'RTL' ? 'right-panel' : '');
    }
  }
  labelLocale(control)
   {
      const array = <FormArray>control.controls['labelLocale'];
      for (let ln of this.languageList) {
        let arr = this.fb.group({
          labelName: ['', Validators.compose([Validators.required, Validators.minLength(5), Validators.pattern('^[a-zA-Z0-9\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF \"&\'(),-:.?_ ]*')])]
        });
        array.push(arr);
        this.alignCss.push(ln.direction == 'RTL' ? 'text-right' : '');
        this.rightPanel.push(ln.direction == 'RTL' ? 'right-panel' : '');
      }

  
  }

  getAllBrands(countryId) {
    this.selectedBrandOptions = [];
    // this.selectedMallOptions = [];
    this.brandInput.selectAllChecked = false;
    // this.mallInput.selectAllChecked = false;
    console.log(countryId);

    this.countryIdval = countryId;
    if (countryId != '' && countryId != null && countryId != undefined) {
      // this.disabledCity = false;
      let GET_ALL_ONLINE_BRANDS = environment.APIEndpoint + "api/rpa/master/brand/v1/getBrandByRegionByCountryId" + '?countryOid=' + countryId;
      this.https.getJson(GET_ALL_ONLINE_BRANDS)
        .subscribe((response) => {
          // if (countryId.length != 0) {
            console.log(response);
            this.brands = response;
            response.forEach(response => {
              this.brandValueList.push({
                brandId: response.brandId,
                brandCode: response.brandCode,
                languageDirection: response.languageDirection,
                brandName: response.brandName,
                status: response.status,
                brandType: response.brandType,
                value: response.brandId,
              });
              this.brandValueList = this.brands;
              var uniqueArray = this.removeDuplicatesJSON(this.brandValueList, 'brandId');
              console.log(uniqueArray);
              this.brandValueList = uniqueArray;
            });
            console.log(this.brandValueList);
          // }
          // else {
          //   this.brandValueList = [];
          // }
        },
          (error) => {
            console.log(error);
          });
    } else {
      // this.disabledCity = true;
      // this.cityList = [];
      this.brandValueList = [];
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
  openDialog() {
    if(this.cartFormGroup.get('brandOid').valid){
    const dialogRef = this.dialog.open(selectStoreDialog);
 
    // if (this.selectedStorearray.length <= 0) {
    //   dialogRef.componentInstance.selectAll = false;
    // } else {
    //   dialogRef.componentInstance.storeList = this.selectedStorearray;
    // }
    dialogRef.componentInstance.storeList = this.selectedStorearray;
    dialogRef.componentInstance.totalCount = this.onLoadStoreCount;
    dialogRef.componentInstance.brandId = this.cartFormGroup.get('brandOid').value;

    dialogRef.afterClosed().subscribe(result => {
      if (result.buttonName === 'SELECT') {
        this.selectedCount = result.tableData.length;
        this.totalCount = result.totalCount;
        this.selectedStorearray = result.tableData.map(a => a.storeOid);
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
          // this.storeErrorMsg = "Please select Store";
        }
        this.cartFormGroup.patchValue({
          storeField: this.selectedCount
        });
      }
    });
  }
  }
  
  public uploadImage(event: FileList,inx,type) {
    this.imageUploading = true;
    if (event[0].size < 1000000) {
        if (event[0].type == "image/jpeg" || event[0].type == "image/png" || event[0].type == "image/jpg" || event[0].type == "image/JPG" || event[0].type == "image/JPEG" || event[0].type == "image/PNG") {
            if (event[0].size < 1000000) {
                this.uploadFile.upload(event.item(0), 'cartConfig', 'images')
                    .subscribe((response) => {
                        console.log(response);
                        let imagePath = response['message'];
                        this.imagePath = response['message'];
                        this.imageUploading = false;
                        // this.showImageError = false;
                         this.uploadElRef.nativeElement.value = ''
                        let x = (<FormArray>this.cartFormGroup.controls[type]).at(inx);
                        console.log(x);
                        x.patchValue({
                          imagePath: imagePath
                        });
                        // x.patchValue(this.imagePath)
                        console.log(x);
                        // const control = <FormArray>this.cartFormGroup.get('tipsArray');

                        // control.at(inx).patchValue(response['message'])
                        // this.items.at(index).patchValue(...);
                        console.log("res ::: " + response)
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
                this.imageUploading = false;
                this.imageErrMsg = "Max upload file size is 1Mb";

            }
        } else {
            this.snackBar.openFromComponent(SnackBarComponent, {
                duration: 10000,
                data: {
                    status: "failure",
                    message: "Supported format is JPG, JPEG and PNG"
                }
            });
        }
    } else {
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

removeImage(inx,type) {
    this.imagePath = '';
    let x = (<FormArray>this.cartFormGroup.controls[type]).at(inx);
    console.log(x);
    x.patchValue({
      imagePath: ''
    });
}
brandList=[]
getBrand() {
  const SEARCH_BRANDS = "api/rpa/master/brand/v1/getAllBrand";
  this.https.getJson(environment.APIEndpoint + SEARCH_BRANDS).subscribe(
    res => {
       this.brandList = res;
      // console.log(this.brandList);
      console.log(res);
      // res.forEach(res => {
      //   this.brandList.push({
      //     brandId: res.brandId,
      //     brandCode: res.brandCode,
      //     languageDirection: res.languageDirection,
      //     brandName: res.brandName,
      //     status: res.status,
      //     brandType: res.brandType,
      //     value: res.brandId
      //   });
      // });
      console.log(this.brandList);
    },
    err => {
      console.log(err);
    }
  );
}

countries;
getselectedCountry(value){
 
console.log(value)
}
getAllCountries(brandId) {
  if (brandId.length != 0) {
    console.log(brandId);
    let GET_ALL_COUNTRIES =
      environment.APIEndpoint + "api/rpa/master/brand/v1/get/regions";
    this.https
      .getJson(GET_ALL_COUNTRIES + "?brandOid=" + brandId)
      .subscribe(response => {
        console.log(response);
        this.countries = response;
        response.forEach(res => {
          this.countryList.push({
            countryCode: res.countryCode,
            countryId: res.countryId,
            countryName: res.countryName,
            currencyCode: res.currencyCode,
            languageDirection: res.languageDirection,
            value: res.countryId
          });
        });
        // this.countryList = this.countries;
        var uniqueArray = this.removeDuplicatesJSON(
          this.countryList,
          "countryId"
        );
        this.countryList = uniqueArray;
        console.log("push all data", this.countryList);
      });
  } else {
    this.countryList = [];
  }
}

getCountryByBrandId(BrandId) {
  const COUNTRY_BY_BRAND =
    environment.APIEndpoint +
    "api/rpa/master/brand/v1/getBrandRegion/" +
    BrandId;
  this.https.getJson(COUNTRY_BY_BRAND).subscribe(response => {
    console.log(response);
    this.countries = response;
  });
}
public removeDenomination(i, index) {
  const control = this.cartFormGroup.get('tipsArray') as FormArray;
  const removeDenomination = control.at(i).get('denominationArray') as FormArray;
  removeDenomination.removeAt(index);
  // this.customImages[i].image.splice(index, 1);
}
onCloseClick(i,type){
  const control = this.cartFormGroup.get(type) as FormArray;
    // const removeAddon = control.at(i).get('addonArray') as FormArray;
    control.removeAt(i);
    // this.customImages[i].image.splice(index, 1);
  }
  showError:boolean=false;
  createCart(formData){
    let Data = formData
    console.log(JSON.stringify(formData))
    if(this.cartFormGroup.valid){
      let TempInstructionArray = formData.instructionArray;
  
      
    
    let TempTipsArray = formData.tipsArray
    let instructionDetails=[];
    let tipDonationDetails=[]
    for(let i=0;i<=TempTipsArray.length-1;i++){
      let tipsLocales = [];
      for(let j=0;j<=this.languageList.length-1;j++){
      let tipsObj= {
        languageOid:this.languageList[j]['languageId'],
        tipDonationName:TempTipsArray[i]['tipslabelLocale'][j]['labelName'],
        tipDonationDesc:TempTipsArray[i]['tipsdescriptionLocale'][j]['descriptionName']
      }
      tipsLocales.push(tipsObj)

    }
    let tipDonationDenominations=[];
  
    this.loading = true;
    for(let j=0;j<=TempTipsArray[i]['denominationArray'].length-1;j++){
      let tempDenomination = TempTipsArray[i]['denominationArray'][j]['keyNumber'];
      let tempDAraay=[];
      for(let k=0; k<=tempDenomination.length-1;k++){
        tempDAraay.push(tempDenomination[k]['key']);
      }
      let obj = {
        currencyCode: TempTipsArray[i]['denominationArray'][j]['currencyCode'],
        denominations: tempDAraay
      }
      
      tipDonationDenominations.push(obj)
    }

    let tips={
      "tipDonationImagePath":TempTipsArray[i]['imagePath'],
      "startDate": TempTipsArray[i]['startDate'] != '' ? moment(TempTipsArray[i]['startDate']).format('YYYY-MM-DD') : '',
      "endDate":  TempTipsArray[i]['endDate'] != '' ? moment(TempTipsArray[i]['endDate']).format('YYYY-MM-DD') : '',
      "passToDeliveryPartner": TempTipsArray[i]['deliveryPartner'] == '' ? false : TempTipsArray[i]['deliveryPartner'],
      tipDonationLocales:tipsLocales,
      tipDonationDenominations:tipDonationDenominations
    }
    tipDonationDetails.push(tips)

    }

    for(let i=0;i<=TempInstructionArray.length-1;i++){
      let instructionLocales=[];
      for(let j=0;j<=this.languageList.length-1;j++){
        let KeyObj = {
          languageOid:this.languageList[j]['languageId'],
          instuctionName:TempInstructionArray[i]['labelLocale'][j]['labelName'],
          instuctionDesc:TempInstructionArray[i]['descriptionLocale'][j]['descriptionName'],
        }
        instructionLocales.push(KeyObj);
        
      }
      let instruction={
        "insImagePath": TempInstructionArray[i]['imagePath'],
        "insForDeliveryPartner": TempInstructionArray[i]['deliveryPartner'] == '' ? false : TempInstructionArray[i]['deliveryPartner'],
        "insForStorePartner": TempInstructionArray[i]['store'] == '' ? false : TempInstructionArray[i]['store'] ,
        "startDate": TempInstructionArray[i]['startDate'] != '' ? moment(TempInstructionArray[i]['startDate']).format('YYYY-MM-DD') : '' ,
        "endDate":  TempInstructionArray[i]['endDate'] != '' ? moment(TempInstructionArray[i]['endDate']).format('YYYY-MM-DD') : '' ,
        "instructionLocales":instructionLocales
      }
      instructionDetails.push(instruction);
      
    }
  let request ={
    oid:0,
    configurationTitle: Data.configurationTitle,
    brandOid: Data.brandOid,
    countryOids: Data.countryOid,
    storeOids:  this.selectedStorearray,
    instructionDetails:instructionDetails,
    tipDonationDetails:tipDonationDetails,
    status: this.statusValue,
  }  
  console.log(JSON.stringify(request))
  let URL = environment.APIEndpoint + "api/rpa/cartConfig/v1/create";
  this.https.postJson(URL, request)
    .subscribe((response) => {
      this.snackBar.openFromComponent(SnackBarComponent, {
        duration: 10000,
        data: {
          status: "success",
          message: "Configuration has been added successfully"
        }
      });
      this.loading = false;
      this.router.navigate(['/search-cart-configuration']);
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
}
