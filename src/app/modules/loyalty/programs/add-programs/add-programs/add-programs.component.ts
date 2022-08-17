import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { Validators, FormBuilder, FormGroup, FormArray,FormControl } from '@angular/forms';
import { MatSnackBar, MatDialog } from '@angular/material';
import { HttpService } from 'src/app/services/http-service';
import { environment } from 'src/environments/environment';
import { Router, ActivatedRoute } from '@angular/router';
import { UploadFile } from 'src/app/services/uploadFile.service';
import * as moment from 'moment';
import { SnackBarComponent } from 'src/app/shared/components/snack-bar/snack-bar.component';
import { productsDialog } from 'src/app/shared/components/products-dialog/products-dialog.component';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

export function checkValidation(group: FormGroup) {

    let programType = group.get('programType').value;
    let perceptual = group.get('perceptual').value;
    let brandControl = group.get('brand');
    let endDateControl = group.get('endDate');
    let pointExpiryIn = group.get('pointExpiryIn').value;
    let expiryDate = group.get('expiryDate');
    let numberOfDays = group.get('numberOfDays');

    if (programType != "BASE") {
        brandControl.setValidators([Validators.required]);
    }

    if (perceptual == false) {
        endDateControl.setValidators([Validators.required]);
    }
    if (pointExpiryIn == 'FIXEDDATE') {
        numberOfDays.clearValidators();
        expiryDate.setValidators([Validators.required]);
    } if (pointExpiryIn == 'NOOFDAYS') {
        expiryDate.clearValidators();
        numberOfDays.setValidators([Validators.required]);
    }

}


export interface Brand {
  brandId: number;
  brandName: string;
}
@Component({
    selector: 'add-programs',
    templateUrl: './add-programs.component.html',
    styleUrls: ['./add-programs.component.scss']
})

export class AddProgramsComponent implements OnInit {

    brandList;
    Brands: Brand[] = [];
    brand = new FormControl();
    filteredbrands: Observable<Brand[]>;


    public breadCrumbData: Array<Object> = [{
        title: 'Loyalty',
        link: ''
    }, {
        title: 'Programs',
        link: '/search-programs'
    }
    ];
    @ViewChild("createProgramForm") createProgramForm;
    @ViewChild('uploadImgEl') uploadImgElRef: ElementRef;
    programFormGroup: FormGroup;
    selectedProgramType = 'Base';
    panelOpenState;
    public languageList = JSON.parse(localStorage.getItem("languageList"));
    public imgUpload = false;
    public disabled = false;
    public rewardTypeArr;
    public regionCurrencies = [];
    public tierFlag = false;
    public rewardErrMsg = false;
    public freeProductTypeValue = false;
    public currencyFlag = [];
    public tierList = [];
    // public brandList = [];
    public freeproductvalues = [];
    public tierTestJson = [];
    public freeproductArry = [];
    public baseRewardType = '';
    public imageUploading: boolean = false;
    public imagePath: string = '';
    public showImageError: boolean = false;
    public statusValue = 'ONLINE'
    public limitPerCustFlag = false;
    public dailyLimitFlag = false;
    public productErrorMsg;
    public uploadSkuFlag = false;
    public minDate = new Date();
    public loading = false;
    public regionError = false;
    showError = false;
    public skuFile = '';
    public validateSkuFile = false;
    public toggleVal = true;
    public descriptionError = false;
    public imgPathUrl = localStorage.getItem("imgBaseUrl");
    public filePathUrl = localStorage.getItem("fileBaseUrl");
    public conversionList = [];
    public selectedCount = 0;
    public selectedProduct = [];
    public skuToggleVal;
    public minExpiryDate;
    programLocales;
    alignCss = [];
    rewardArr;
    expiredBy;
    public pointbrandIdValue;

    exTensionDateVals = [
        {
            value: '1',
            label: 'Allow Extension (30 Days)',
            checked: false
        },
        {
            value: '2',
            label: 'Allow End of Month Expiry',
            checked: false
        },
    ];
    brandIdValue: any;
    freeProductCodeValue: any;
    constructor(private fb: FormBuilder, private http: HttpService,
        private router: Router, private uploadFile: UploadFile, private changeDetectorRef: ChangeDetectorRef,
        public snackBar: MatSnackBar, private activatedRoute: ActivatedRoute,
        public dialog: MatDialog, ) {
        //  this.getRegionCurrency();
        //  this.getAllTiers();
        this.minExpiryDate = new Date();


    }

    baseUrl: any = '';
    baseProgramImg(event) {
        if (event.target.files && event.target.files[0]) {
            this.imgUpload = true;
            var reader = new FileReader();
            reader.readAsDataURL(event.target.files[0]);
            reader.onload = (event) => {
                this.baseUrl = <string>reader.result;

            }
        }
    }
    url: any = '';
    onSelectFile(event) {
        if (event.target.files && event.target.files[0]) {
            this.imgUpload = true;
            var reader = new FileReader();

            reader.readAsDataURL(event.target.files[0]); // read file as data url

            reader.onload = (event) => { // called once readAsDataURL is completed
                // this.url = event.target.result;
                this.url = <string>reader.result;

            }
        }
    }


    public buildCreateProgramForm() {
        this.programFormGroup = this.fb.group({
            programType: ["BASE", Validators.required],
            //  programLocales:this.fb.array([]),
            //  descriptionArray:this.fb.array([]),
            //tierArray:this.fb.array([]),
            brand: [""],
            freeProductValue: [''],
            rewardType: ["", Validators.required],
            startDate: ["", Validators.required],
            endDate: [""],
            startTime: [""],
            endTime: [""],
            pointExpiryIn: [""],
            perceptual: [false],
            expiryDate: ["", Validators.min],
            numberOfDays: [""],
            // freeProductType: [""],
            isEndOfMonth: [false],
            isAllowExtension: [false],
            descriptionCtrl: ["", Validators.required],
            programName: ["", Validators.required]
        }, { validator: checkValidation });

        let programType = this.programFormGroup.get('programType').value;
        let brandControl = this.programFormGroup.get('brand');
        if (programType == 'BASE') {
            brandControl.clearValidators();
            brandControl.updateValueAndValidity();
        }
    }

    postVal(ev) {
        console.log(ev.value);
        this.expiredBy = ev.value;
    }
    public tierArrayForm() {
        this.tierFlag = true;
        const control = <FormArray>this.programFormGroup.controls['tierArray'];
        for (let t = 0; t < this.tierList.length; t++) {
            //let tier = this.tierList[t];
            let arr = this.fb.group({
                tierId: [this.tierList[t].tierId],
                currencyArr: this.fb.array([])
            });

            control.push(arr);
            this.tierCurrencyForm(control.controls[t]);

            console.log("control" + control);
        }


    }

    public tierCurrencyForm(control) {
        const array = <FormArray>control.controls['currencyArr'];
        for (let currency of this.regionCurrencies) {
            let arr = this.fb.group({
                [currency.regionId]: ['']
            });
            array.push(arr);
        }


    }

    // public programFormArray(){
    //     const control = <FormArray>this.programFormGroup.controls['programLocales'];
    //     for(let i=0;i<this.languageList.length;i++){
    //         let newForm = this.fb.group({
    //             programName: ['', Validators.required],
    //         });
    //         control.push(newForm);
    //         this.alignCss.push(this.languageList[i].direction == 'RTL' ? 'text-right' : '');

    //     }
    // }

    public descriptionFormArray() {
        const control = <FormArray>this.programFormGroup.controls['descriptionArray'];
        for (let i = 0; i < this.languageList.length; i++) {
            let newForm = this.fb.group({
                description: [''],
            });
            control.push(newForm);
        }
    }
    ngOnInit() {
        this.isBaseProgramExist();
        this.buildCreateProgramForm();
        this.getRewardType('BASE');

        //  this.programFormArray();
        //   this.descriptionFormArray();
        //this.getCurrencyConversionValue();

    }
    getRewardType(programType) {


        this.getAllBrands(programType);

        let brandControl = this.programFormGroup.get('brand');
        let freeProductCtrl = this.programFormGroup.get('freeProductValue');
        if (programType == 'BASE') {
            brandControl.clearValidators();
            brandControl.updateValueAndValidity();
        }
        if (programType == 'BRAND') {
            brandControl.setValidators([Validators.required]);
            brandControl.updateValueAndValidity();
            this.rewardTypeArr = [
                { name: 'Base Reward', value: "BASEREWARD" },
                { name: 'Points', value: "POINTS" },
                { name: 'Stamps', value: "STAMPS" }
            ];
        } else if (programType == 'PRODUCT') {
            brandControl.setValidators([Validators.required]);
            brandControl.updateValueAndValidity();
            freeProductCtrl.setValidators([Validators.required]);
            freeProductCtrl.updateValueAndValidity();
            this.rewardTypeArr = [
                { name: 'Base Reward', value: "BASEREWARD" },
                { name: 'Brand Reward', value: "BRANDREWARD" },
                { name: 'Points', value: "POINTS" },
                { name: 'Stamps', value: "STAMPS" }
            ]

        } else {
            this.rewardTypeArr = [
                { name: 'Points', value: "POINTS" },
                { name: 'Stamps', value: "STAMPS" }
            ];
        }
    }

    // updateValidationAccrual(rewardType:any){
    //     if(rewardType=='STAMPS' || rewardType=='BASE'){
    //         let maxAccruals = this.programFormGroup.get('overallAccurals');
    //         let overallAccural = this.programFormGroup.get('overAllLimit');
    //         let dailyAccural = this.programFormGroup.get('dailyLimit');

    //         maxAccruals.clearValidators();
    //         maxAccruals.updateValueAndValidity();
    //         overallAccural.clearValidators();
    //         overallAccural.updateValueAndValidity();
    //         dailyAccural.clearValidators();
    //         dailyAccural.updateValueAndValidity();

    //     }else{
    //         let maxAccruals = this.programFormGroup.get('overallAccurals');
    //         let overallAccural = this.programFormGroup.get('overAllLimit');
    //         let dailyAccural = this.programFormGroup.get('dailyLimit'); 

    //         maxAccruals.setValidators([Validators.required]);
    //         maxAccruals.updateValueAndValidity();
    //         overallAccural.setValidators([Validators.required]);
    //         overallAccural.updateValueAndValidity();
    //         dailyAccural.setValidators([Validators.required]);
    //         dailyAccural.updateValueAndValidity();
    //     }
    // }

    endDateAction(perceptual) {
        let endDateControl = this.programFormGroup.get('endDate');
        let pointExpiryType = this.programFormGroup.get("pointExpiryIn");
        let expiryDate = this.programFormGroup.get("expiryDate");
        if (perceptual == true) {
            endDateControl.setValue("");
            //   endTimeControl.setValue("");
            this.disabled = true;
            endDateControl.clearValidators();
            endDateControl.updateValueAndValidity();
            pointExpiryType.setValue('');
            pointExpiryType.updateValueAndValidity();
            expiryDate.setValue('');
            expiryDate.updateValueAndValidity();
        } else {
            this.disabled = false;
            endDateControl.setValidators([Validators.required]);
            endDateControl.updateValueAndValidity();

        }
    }

    setExpiryDate(endDate: Date) {
        let expiryDate = this.programFormGroup.get("expiryDate");
        expiryDate.setValue('');
        expiryDate.updateValueAndValidity();
        this.minExpiryDate = moment(endDate).format();

    }

    createProgram(formData) {
        console.log(this.languageList)
        this.regionError = false;
        this.rewardArr = [];
        this.programLocales = [];
        this.descriptionError = false;
        let descError;


        // for( let d of formData.descriptionArray){
        //     if(d.description==''){
        //         descError=true;
        //     }
        // }

        // for(let cn of formData.tierArray[1].currencyArr) {
        //     var key = Object.keys(cn)
        //     if(cn[key[0]]==''){
        //         this.regionError=true;
        //     }
        // }

        this.programFormGroup.get('startTime').markAsPristine;
        this.programFormGroup.get('endTime').markAsPristine;
        if (this.programFormGroup.invalid == true) {
            this.showError = true;
            //this.regionError=true;
            this.descriptionError = descError;

        } else if (this.imagePath == '') {
            this.showImageError = true;
        }
        else {
            // for(let t of formData.tierArray) {
            //     for(let i=0;i<t.currencyArr.length;i++) {
            //         var key = Object.keys(t.currencyArr[i])
            //         if(t.currencyArr[i][key[0]]!=''){
            //             this.rewardArr.push(
            //                 {
            //                     regionId:parseInt(key[0]),//int
            //                     tierId:parseInt(t.tierId),//int
            //                     rewardValue:parseInt(t.currencyArr[i][key[0]])//int
            //                 })
            //         }else{
            //             this.regionError=true;
            //         }

            //     }
            // }
            if (this.regionError == false) {
                // formData.programLocales.forEach((program, index) => {
                //     let locale={
                //         languageId:this.languageList[index].languageId,
                //         programName:program.programName,
                //         programDescription:formData.descriptionArray[index].description
                //     }
                //     this.programLocales.push(locale);
                // })
                for (let i = 0; i < this.languageList.length; i++) {
                    if (this.languageList[i].languageCode == "EN") {
                        let locale = {
                            languageId: this.languageList[i].languageId,
                            programName: formData.programName,
                            programDescription: formData.descriptionCtrl
                        }
                        this.programLocales.push(locale);
                    }
                }
                console.log("rewardArr = " + this.rewardArr);
                let request = {
                    programType: formData.programType,
                    brandId: formData.brand != 'BASE' ? this.pointbrandIdValue : '',
                    productBrandType: formData.brand == 'BASE' ? 'BASE' : 'BRAND',
                    skuFilePath: this.skuFile,
                    skuCodes: this.selectedProduct,
                    programLocales: this.programLocales,
                    programImgPath: this.imagePath,
                    rewardType: formData.rewardType,
                    freeProductType: this.freeProductCodeValue,
                    startDate: formData.startDate != '' ? moment(formData.startDate).format('YYYY-MM-DD') : '',
                    endDate: formData.endDate != '' ? moment(formData.endDate).format('YYYY-MM-DD') : '',
                    isPerpetual: formData.perceptual,
                    startTime: formData.startTime != '' ? moment(formData.startTime).format('HH:mm:ss') : '',//"12:10:11",
                    endTime: formData.endTime === '' ? '' : moment(formData.endTime).format('HH:mm:ss'),
                    pointExpiryIn: formData.pointExpiryIn == '' ? null : formData.pointExpiryIn,
                    expiryDate: formData.expiryDate == '' ? null : moment(formData.expiryDate).format('YYYY-MM-DD'),
                    expiryDays: formData.numberOfDays,//int
                    isEndOfMonth: formData.isEndOfMonth,
                    isAllowExtension: formData.isAllowExtension,
                    //   maxOverallAccrual:formData.overallAccurals, //int
                    //   overallLimitPerCustomer:formData.overAllLimit,//12,
                    //   dailyCustomerLimit:formData.dailyLimit,//10,
                    status: this.statusValue,
                    //rewardValues:this.rewardArr,
                    validateSku: this.validateSkuFile
                }
                this.loading = true;

                let CREATE_PROGRAM = environment.APIEndpoint + "api/rpa/loyalty/program/v1/create";
                this.http.postJson(CREATE_PROGRAM, request)
                    .subscribe((response) => {
                        console.log("res = " + response);
                        this.snackBar.openFromComponent(SnackBarComponent, {
                            duration: 1500,
                            data: {
                                status: "success",
                                message: "Program has been created successfully"
                            }
                        });
                        this.loading = false;
                        sessionStorage.clear();
                        this.router.navigate(['/search-programs']);
                    }
                        , err => {
                            console.log("err.error.errorType = " + err.error.errorType);
                            this.loading = false;
                            console.log("error Status = " + err);
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
    getRegionCurrency() {
        let GET_REGION_CURRENCIES_AND_TIERS = environment.APIEndpoint + "api/rpa/client/onboarding/v1/view"
        this.http.getJson(GET_REGION_CURRENCIES_AND_TIERS).subscribe((response) => {
            this.regionCurrencies = response['regionList'].map(function (item) {
                let region = {
                    regionId: item.regionId,
                    currencyCode: item.currencyCode,

                }
                return region;
            })
            this.tierArrayForm();


        })
    }

    getAllTiers() {

        let GET_ALL_TIERS = environment.APIEndpoint + "api/rpa/tier/v1/qualification/list"
        this.http.getJson(GET_ALL_TIERS)
            .subscribe((response) => {
                console.log(response);
                this.tierList = response;

            })
    }
    getAllBrands(programType) {
        if (programType == 'BRAND') {
            let GET_ALL_ONLINE_BRANDS = environment.APIEndpoint + "api/rpa/loyalty/program/v1/get/programBrands";
            this.http.getJson(GET_ALL_ONLINE_BRANDS)
                .subscribe((response) => {
                    console.log(response);
                    this.brandList = response;

                })
        }
        if (programType == 'PRODUCT') {

            let GET_ALL_ONLINE_BRANDS = environment.APIEndpoint + "api/rpa/master/brand/v1/get/brands";
            this.http.getJson(GET_ALL_ONLINE_BRANDS)
                .subscribe((response) => {
                    console.log(response);
                    this.brandList = response;

                })

        }

    }



    getAllBrandsA(programType) {
        // console.log(this.KioskForm.get('brands').value);

        this.brandList = [];
            this.Brands = [];

        if (programType == 'BRAND'){
            let GET_ALL_ONLINE_BRANDS = environment.APIEndpoint + "api/rpa/loyalty/program/v1/get/programBrands";
            this.http.getJson(GET_ALL_ONLINE_BRANDS)
              .subscribe((response) => {
                // console.log(response);
                this.brandList = response;
        
                for (let i = 0; i <= this.brandList.length - 1; i++) {
                  let objMallkey = {
                    brandId: this.brandList[i]['brandId'],
                    brandName: this.brandList[i]['brandName'],
                  }
                  console.log(objMallkey);
                  this.Brands.push(objMallkey);
                }
                this.filteredbrands = this.brand.valueChanges
                  .pipe(
                    startWith(''),
                    map(brand => brand ? this._filterBrands(brand) : this.Brands.slice())
                  );
                console.log(this.brandList['brandName']);
                console.log(this.brandList['brandId']);
              },
                (error) => {
                  console.log(error);
                });
        }
        if (programType == 'PRODUCT'){
            let GET_ALL_ONLINE_BRANDS = environment.APIEndpoint + "api/rpa/master/brand/v1/get/brands";
            this.http.getJson(GET_ALL_ONLINE_BRANDS)
              .subscribe((response) => {
                // console.log(response);
                this.brandList = response;
        
                for (let i = 0; i <= this.brandList.length - 1; i++) {
                  let objMallkey = {
                    brandId: this.brandList[i]['brandId'],
                    brandName: this.brandList[i]['brandName'],
                  }
                  console.log(objMallkey);
                  this.Brands.push(objMallkey);
                }
                this.filteredbrands = this.brand.valueChanges
                  .pipe(
                    startWith(''),
                    map(brand => brand ? this._filterBrands(brand) : this.Brands.slice())
                  );
                console.log(this.brandList['brandName']);
                console.log(this.brandList['brandId']);
              },
                (error) => {
                  console.log(error);
                });
        }
        
      }
      private _filterBrands(value: string): Brand[] {
        const filterValue = value.toLowerCase();
        return this.Brands.filter(brand => brand.brandName.toLowerCase().indexOf(filterValue) === 0);
      }


      getBrandValue(val) {
        console.log(val);
        this.pointbrandIdValue = val;
        this.getFreeProduct(this.pointbrandIdValue);
      }

    getFreeProduct(brandId) {
        console.log(brandId);
        this.pointbrandIdValue = brandId;
        let GET_FREE_PRODUCTS_VALUE = environment.APIEndpoint + "api/rpa/master/freeProduct/v1/list/" + this.pointbrandIdValue;
        this.http.getJson(GET_FREE_PRODUCTS_VALUE).subscribe(
            (response) => {
                console.log(response);
                this.freeproductvalues = response['freeProductType'];
                console.log(this.freeproductvalues);    
            }
        )
    }

    public uploadImage(event: FileList) {
        if (event[0].size < 1000000) {
            this.imageUploading = true;
            this.uploadFile.upload(event.item(0), 'program', 'images')
                .subscribe((response) => {
                    console.log(response);
                    this.imagePath = response['message'];
                    this.imageUploading = false;
                    this.showImageError = false;
                    this.uploadImgElRef.nativeElement.value = ''

                    console.log("res ::: " + response)
                    this.snackBar.openFromComponent(SnackBarComponent, {
                        duration: 1500,
                        data: {
                            status: "success",
                            message: " image successfully uploaded"
                        }
                    });


                }, err => {

                    console.log("error Status = " + err);
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
                                message: "Internal server error"
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
    uploadSkuFile(event: FileList) {
        if (event[0].type == "application/vnd.ms-excel") {
            this.uploadFile.upload(event.item(0), 'program', 'files')
                .subscribe((response) => {
                    console.log(response);
                    this.skuFile = response['message'];
                    //.changeDetectorRef.detectChanges()
                    this.validateSku();
                }, err => {
                    if (err.error.errorType == 'VALIDATION') {
                        this.snackBar.openFromComponent(SnackBarComponent, {
                            duration: 1500,
                            data: {
                                status: "failure",
                                message: err.error.errorDetails[0].description
                            }
                        });
                    }

                });
        } else {
            this.snackBar.openFromComponent(SnackBarComponent, {
                duration: 1500,
                data: {
                    status: "failure",
                    message: "Supported format is xls"
                }
            });

        }

    }
    validateSku() {
        let VALIDATE_SKU_FILE = environment.APIEndpoint + "api/rpa/loyalty/program/v1/skufile/validate";
        let request = {
            filePath: this.skuFile
        }
        this.http.postJson(VALIDATE_SKU_FILE, request)
            .subscribe((response) => {
                console.log(response);
                this.validateSkuFile = true;
            }, err => {
                this.validateSkuFile = false;
            })
    }

    removeSku() {
        this.skuFile = '';
    }

    // checkLimitPerCustomer(overAllAccurals, limitperCustomer, dailyLimit){
    //     console.log("overAllAccurals = "+overAllAccurals+" || limitperCustomer = "+limitperCustomer+" || dailyLimit= "+dailyLimit);
    //     if(overAllAccurals=='' && limitperCustomer!='')
    //         this.limitPerCustFlag=true;
    //     if(overAllAccurals!='' && limitperCustomer!=''){
    //         if(parseInt(limitperCustomer) > parseInt(overAllAccurals))
    //             this.limitPerCustFlag=true;
    //         else
    //             this.limitPerCustFlag=false;
    //     }
    //     if(dailyLimit!='' && limitperCustomer!=''){
    //         if(parseInt(dailyLimit) > parseInt(limitperCustomer))
    //             this.dailyLimitFlag=true;
    //         else
    //             this.dailyLimitFlag=false;
    //     }
    // }
    public removeImage(index) {
        this.imagePath = "";


    }
    public toggleStatus(event) {
        if (event.checked == true) {
            this.statusValue = 'ONLINE';
        } else {
            this.statusValue = 'OFFLINE';
        }
    }
    public getCurrencyConversionValue() {

        let GET_ALL_CURRENCY_CONVERSION_VALUE = environment.APIEndpoint + "api/rpa/master/currencyconversion/v1/get/conversionRate"
        this.http.getJson(GET_ALL_CURRENCY_CONVERSION_VALUE)
            .subscribe((response) => {
                console.log(response);
                this.conversionList = response;



            })
    }
    // public autoPopulateCurrencyValue(column, row, baseCurValue){
    //     let regex =/^[0-9]*$/;
    //     if(baseCurValue!=''){
    //         let valid = baseCurValue.match(regex)
    //         if (!valid ){
    //             this.rewardErrMsg = true;
    //         }else{
    //             this.rewardErrMsg = false;

    //             if(row == 0 && column!=undefined && baseCurValue!=""){


    //                     for(let i=1;i<this.regionCurrencies.length;i++){
    //                         for(let conversion of this.conversionList){
    //                         console.log("value ="+ conversion.conversionValue*parseInt(baseCurValue));
    //                         console.log("value ="+ this.regionCurrencies[i].currencyCode);
    //                         const array = <FormArray>column.controls['currencyArr'];
    //                         if(conversion.currencyCode === this.regionCurrencies[i].currencyCode){
    //                             let conversionValue= conversion.conversionValue*parseInt(baseCurValue)
    //                             array.at(i).patchValue({
    //                                [this.regionCurrencies[i].regionId]: [Math.round(conversionValue)]
    //                            });
    //                            array.markAsPristine;
    //                         }
    //                     }
    //                         //array.push(arr);
    //                     }

    //                     this.regionError=false;
    //             }
    //         }
    //     }

    // }
    removeErrorMsg(index) {
        let totalLength = this.languageList.length;
        if (totalLength - 1 == index) {
            this.descriptionError = false;
        }

    }
    // productsDialog() {
    //     this.selectedProduct=[];
    //   const dialogRef = this.dialog.open(productsDialog);
    //   dialogRef.afterClosed().subscribe(
    //       (result)=>{
    //         if(result.buttonName === 'SELECT'){
    //           this.skuToggleVal = result.skuToggleVal,
    //           this.skuFile = result.skuFileName;
    //           if(this.skuFile !=''){
    //               this.validateSku();
    //           }
    //           this.selectedCount = result.tableData.length;
    //           if(this.selectedCount != 0 || this.skuFile != ''){
    //               for (let i = 0; i < result.tableData.length; i++) {
    //                   let skuId = result.tableData[i].skuCode;
    //                   this.selectedProduct.push(skuId);
    //                   console.log(this.selectedProduct);
    //                  }
    //           }else{
    //               this.productErrorMsg = "Please select Product SKU or Products";
    //               console.log(this.productErrorMsg);
    //           }

    //         }
    //       }
    //     );
    // }

    productsDialog() {
        this.selectedProduct = [];
        const dialogRef = this.dialog.open(productsDialog);
        dialogRef.componentInstance.excludeToggle = true;
        dialogRef.componentInstance.seletedTabIndex = 1;
        dialogRef.afterClosed().subscribe(
            (result) => {
                if (result.buttonName === 'UPLOAD') {
                    this.skuFile = result.skuFileName;
                }
                if (result.buttonName === 'SELECT') {
                    this.skuToggleVal = result.skuToggleVal,
                        this.skuFile = result.skuFileName;
                    if (this.skuFile != '') {
                        this.validateSku();
                    }
                    this.selectedCount = result.tableData.length;
                    if (this.selectedCount != 0 || this.skuFile != '') {
                        for (let i = 0; i < result.tableData.length; i++) {
                            let skuId = result.tableData[i].skuCode;
                            this.selectedProduct.push(skuId);
                            console.log(this.selectedProduct);
                        }
                    } else {
                        this.productErrorMsg = "Please select Product SKU or Products";
                        console.log(this.productErrorMsg);
                    }

                }
            }
        );
    }
    checkPointExpiryValidation(pointExpiryIn) {

        let expiryDate = this.programFormGroup.get('expiryDate');
        let numberOfDays = this.programFormGroup.get('numberOfDays');
        let isAllowExtension = this.programFormGroup.get('isAllowExtension');
        let isEndOfMonth = this.programFormGroup.get('isEndOfMonth');
        if (pointExpiryIn == 'FIXEDDATE') {
            numberOfDays.markAsPristine;
            numberOfDays.clearValidators();
            numberOfDays.setValue('');
            expiryDate.setValidators([Validators.required]);
            numberOfDays.updateValueAndValidity();
            expiryDate.updateValueAndValidity();
        } if (pointExpiryIn == 'NOOFDAYS') {
            isAllowExtension.setValue(false);
            isEndOfMonth.setValue(false);
            expiryDate.markAsPristine;
            expiryDate.clearValidators();
            expiryDate.setValue('');
            numberOfDays.setValidators([Validators.required]);
            expiryDate.updateValueAndValidity();
            numberOfDays.updateValueAndValidity();
        }
    }
    isBaseProgramExist() {
        let IS_BASE_PROGRAM_EXIST = environment.APIEndpoint + "api/rpa/loyalty/program/v1/get/baseprogram";
        this.http.getJson(IS_BASE_PROGRAM_EXIST)
            .subscribe((response) => {
                if (response['rewardType'] != undefined || response['rewardType'] != null)
                    this.baseRewardType = response['rewardType'];


            })
        console.log("this.baseRewardType=" + this.baseRewardType);
    }
    // getRewardTypeValue(rewardVal) {
    //     console.log(rewardVal);
    //     if (rewardVal == 'STAMPS') {
    //         this.freeProductTypeValue = true;
    //         let GET_FREE_PRODUCTS_STAMPS = environment.APIEndpoint + "api/rpa/loyalty/program/v1/get/freeproducts";
    //         this.http.getJson(GET_FREE_PRODUCTS_STAMPS).subscribe(
    //             (response) => {
    //                 console.log(response);
    //                 this.freeproductArry = response;
    //             },
    //             (error) => {
    //                 console.log(error);
    //             }
    //         )
    //     } else {
    //         this.freeProductTypeValue = false;
    //     }
    // }
    getfreeproductvalue(freeProductCode){
        this.freeProductCodeValue = freeProductCode;
    }
    
}


//http://192.168.2.54:9090/api/v1/uploadFiles/program/files
