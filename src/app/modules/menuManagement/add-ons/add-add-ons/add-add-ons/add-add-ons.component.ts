import { OnInit, ViewChild, Output, Input, Component, EventEmitter, AfterViewInit, ElementRef } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder, FormGroupDirective, FormArray, NgForm } from '@angular/forms';
import { MatPaginator, MatSort, MatTableDataSource, MatTabsModule, MatSnackBar } from '@angular/material';
import { MatDialogModule } from '@angular/material/dialog';
import { SelectionModel } from '@angular/cdk/collections';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { UploadFile } from 'src/app/services/uploadFile.service';
import { HttpService } from 'src/app/services/http-service';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { SnackBarComponent } from 'src/app/shared/components/snack-bar/snack-bar.component';
import { SelectAutocompleteComponent } from 'mat-select-autocomplete';
import { Globals } from 'src/app/services/global';

@Component({
    selector: 'add-add-ons',
    templateUrl: './add-add-ons.component.html',
    styleUrls: ['./add-add-ons.component.scss']
})
export class AddAddOnsComponent implements OnInit {
    public breadCrumbData: Array<Object> = [{
        title: 'Menu Management',
        link: ''
    }, {
        title: 'Add-ons',
        link: '/add-add-ons'
    }
    ];

    @ViewChild('addOnsImgFile') uploadElRef: ElementRef;
    @ViewChild(SelectAutocompleteComponent) multiSelect: SelectAutocompleteComponent;
    addonFormGroup: FormGroup;
    public languageList = JSON.parse(localStorage.getItem("languageList"));
    public imageUploading: boolean = false;
    public imagePath: string = '';
    public filePathUrl = localStorage.getItem("imgBaseUrl");
    public statusValue: string = 'ONLINE';
    columns = [];
    count = 0;
    public alignCss = [];
    public showError: boolean = false;
    public loading: boolean = false;
    public imageErrMsg;
    public showImageError: boolean = false;
    public addonLocales: any = [];
    // public addonRegionPrices: any;
    public productCategories: any = [];
    public regionCurrencies: any = [];
    columnArr = [];
    columnHeadArr = [];
    public conversionList = [];
    public toggleVal: boolean = true;
    rigionList: any;
    currencyOids: any;
    addonRegion: any;
    addonRegionPrices: any[];
    languageDirection = [];

    constructor(private uploadFile: UploadFile, private fb: FormBuilder,
        private http: HttpService, private router: Router, public snackBar: MatSnackBar, ) {
        this.buildCreateAddonFrom();
    }

    ngOnInit() {
        this.getAllProductCategories();
        this.getOnBoardingRegions();
        this.getBaseCurrency();
        this.addonLocale();
    }

    category1 = [];
    getAllProductCategories() {
        let GET_ALL_CATEGORIES = environment.APIEndpoint + "api/rpa/productcategory/v1/get/list";
        this.http.getJson(GET_ALL_CATEGORIES)
            .subscribe((response) => {
                console.log(response);
                this.productCategories = response;
                this.productCategories.forEach(res => {
                    this.category1.push({
                        "categoryId": res.categoryId,
                        "categoryName": res.categoryName,
                        "direction": res.direction,
                        "parentProductCategoryId": res.parentProductCategoryId,
                        "status": res.status,
                        "value": res.categoryId
                    });
                });
            })
    }

    public buildCreateAddonFrom() {
        let form = {
            addonLocaleArray: this.fb.array([]),
            addonRegionArray: this.fb.array([]),
            addonCols: this.fb.array([]),
            categories: ["", Validators.compose([Validators.required])],
            deliveryCharge: [0, Validators.compose([Validators.required, Validators.pattern('[0-9]{1,6}$')])],
            packingCharge: [0, Validators.compose([Validators.required, Validators.pattern('[0-9]{1,6}$')])],
            addonType: ["", Validators.required],
            skuCode: ["", Validators.compose([Validators.required, Validators.pattern('^[a-zA-Z0-9-]{1,50}$')])],
            costPrice: ["", Validators.compose([Validators.pattern('[0-9]{1,5}$')])],
            inventory: [""],
            minimumInventory: [""],
            taxRates: [""],
            weights: [""],
        }
        this.addonFormGroup = this.fb.group(form);
    }

    public addonLocale() {
        console.log("size = " + this.languageList.length);
        const control = <FormArray>this.addonFormGroup.controls['addonLocaleArray'];
        for (let ln of this.languageList) {
            let arr = this.fb.group({
                addonName: ['', Validators.compose([Validators.required,Validators.pattern('^[a-zA-Z0-9\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF \"&\'(),-:.?_ ]*')
            ])],
            });
            control.push(arr);
            this.alignCss.push(ln.direction == 'RTL' ? 'text-right' : '');
            this.languageDirection.push(ln.direction == 'RTL' ? 'direction' : '');
        }
    }

    // getRegionCurrency() {
    //     let GET_REGION_CURRENCIES = environment.APIEndpoint + "api/rpa/client/onboarding/v1/view"
    //     this.http.getJson(GET_REGION_CURRENCIES).subscribe((response) => {
    //         this.regionCurrencies = response['regionList'];
    //         this.addonRegionDisplayPrice();
    //     })
    // }

    // public getCurrencyConversionValue() {
    //     let GET_ALL_CURRENCY_CONVERSION_VALUE = environment.APIEndpoint + "api/rpa/master/currencyconversion/v1/get/conversionRate"
    //     this.http.getJson(GET_ALL_CURRENCY_CONVERSION_VALUE)
    //         .subscribe((response) => {
    //             console.log(response);
    //             this.conversionList = response;
    //         })
    // }

    // public addonRegionDisplayPrice() {
    //     const array = <FormArray>this.addonFormGroup.controls['addonRegionArray'];
    //     for (let ln of this.rigionList) {
    //         let arr = this.fb.group({
    //             displayPrice: ['', Validators.compose([Validators.required, Validators.pattern('^[a-zA-Z0-9\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF \"&\'(),-:.?_ ]*')])],
    //         });
    //         array.push(arr);
    //     }
    // }

    public addonRegionDisplayPrice() {
        for (let i = 0; i < this.rigionList.length; i++) {
            const control = <FormArray>this.addonFormGroup.controls['addonRegionArray'];
            let newForm = this.fb.group({
                displayPrice: ["", Validators.compose([Validators.required, Validators.pattern('^[a-zA-Z0-9\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF \"&\'(),-:.?_ ]*')])]
            });
            control.push(newForm);
        }
    }

    public createProductAddon(formData) {
        this.addonLocales = [];
        this.addonRegion = [];
        this.addonRegionPrices = [];
        if (this.addonFormGroup.invalid == true) {
            this.showError = true;
        } else {
            this.loading = true;
            this.showError = false;
            formData.addonLocaleArray.forEach((addonLocale, index) => {
                this.addonLocales.push({
                    addonName: addonLocale.addonName,
                    languageOid: this.languageList[index].languageId
                })
            })

            // formData.addonRegionArray.forEach((addonRegionPrice, index) => {
            //     this.addonRegionPrices.push({
            //         displayPrice: addonRegionPrice.displayPrice,
            //         regionOid: this.rigionList[index].regionId
            //     })
            //     console.log(this.addonRegionPrices);
            // })
            for (var i = 0; i < formData.addonRegionArray.length; i++) {
                // let amt = formData.addonRegionArray[i].displayPrice;
                let cur = {
                    displayPrice: Number(formData.addonRegionArray[i].displayPrice),
                    regionOid: this.rigionList[i].regionId
                }
                this.addonRegionPrices.push(cur);
            }


            let addonColumns = [];
            if (this.columnHeadArr.length > 0) {
                for (let i = 0; i < this.columnHeadArr.length; i++) {
                    let obj = {
                        label: this.columnHeadArr[i],
                        value: this.columnArr[i]
                    };
                    addonColumns.push(obj);
                }
            }

            //By using form Array
            // formData.addonCols.forEach((addonCol, index)=>{
            //     this.addonColumns.push({
            //         label:addonCol.addonColLabel,
            //         value:addonCol.addonColValue
            //     })
            // })

            let createAddonReq = {
                categoryOids: formData.categories,
                deliveryCharge: formData.deliveryCharge,
                packingCharge: formData.packingCharge,
                addonImagePath: this.imagePath,
                addonType: formData.addonType,
                skuCode: formData.skuCode,
                costPrice: formData.costPrice,
                inventory: formData.inventory,
                minimumInventory: formData.minimumInventory,
                taxRates: formData.taxRates,
                weights: formData.weights,
                status: this.statusValue,
                addonCols: addonColumns,
                productAddonLocales: this.addonLocales,
                productAddonDisplayPrices: this.addonRegionPrices,
            }

            console.log(createAddonReq);
            let CREATE_ADDON = environment.APIEndpoint + "api/rpa/menu/addon/v1/create";
            this.http.postJson(CREATE_ADDON, createAddonReq)
                .subscribe((response) => {
                    console.log(response);
                    this.snackBar.openFromComponent(SnackBarComponent, {
                        duration: 1500,
                        data: {
                            status: "success",
                            message: "Add-on added successfully"
                        }
                    });
                    this.loading = false;
                    this.router.navigate(['/search-add-ons']);
                }
                    , err => {
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
                    })
        }
    }

    getOnBoardingRegions() {
        let GET_ALL_REGIONS = environment.APIEndpoint + "api/rpa/client/onboarding/v1/view";
        this.http.getJson(GET_ALL_REGIONS)
            .subscribe((response) => {
                this.currencyOids = response["regionList"].map(oid => oid.currencyOid);
                this.rigionList = response['regionList'];
                this.addonRegionDisplayPrice();
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
                    const array = <FormArray>this.addonFormGroup.controls['addonRegionArray'];
                    if (conversion.currencyCode === this.rigionList[i].currencyCode && i != 0) {
                        let conversionValue = conversion.conversionValue * parseInt(currencyValue);
                        array.at(i).patchValue({
                            displayPrice: [conversionValue.toFixed(2)]
                        });
                        array.markAsPristine;
                    }
                }
            }
        } else if (row == 0 && (currencyValue == null || currencyValue == '')) {
            for (let i = 0; i < this.rigionList.length; i++) {
                for (let conversion of this.conversionList) {
                    const array = <FormArray>this.addonFormGroup.controls['addonRegionArray'];
                    if (conversion.currencyCode === this.rigionList[i].currencyCode && i != 0) {
                        array.at(i).patchValue({
                            displayPrice: []
                        });
                        array.markAsPristine;
                    }
                }
            }
        }
    }

    public toggleStatus(event) {
        if (event.checked == true) {
            this.statusValue = 'ONLINE';
        } else {
            this.statusValue = 'OFFLINE';
        }
    }

    incrementColumn() {
        if (this.columns.length < 3) {
            this.count += 1;
            if (this.count < 4) {
                this.columns.push(this.count);
            }
        }
    }

    //By using form Array

    // incrementColumn(){
    //     const control=this.addonFormGroup.get('addonCols') as FormArray;
    //     control.push(this.fb.group({
    //         addonColLabel:["",],
    //         addonColValue:["",]
    //     }));
    // }
    public uploadImage(event: FileList) {
        this.imageUploading = true;
        if (event[0].size < 1000000) {
            if (event[0].type == "image/jpeg" || event[0].type == "image/png" || event[0].type == "image/jpg" || event[0].type == "image/JPG" || event[0].type == "image/JPEG" || event[0].type == "image/PNG") {
                if (event[0].size < 1000000) {
                    this.uploadFile.upload(event.item(0), 'productAddon', 'images')
                        .subscribe((response) => {
                            console.log(response);
                            this.imagePath = response['message'];
                            this.imageUploading = false;
                            this.showImageError = false;
                            this.uploadElRef.nativeElement.value = ''
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

    removeImage() {
        this.imagePath = '';
    }
    removeColumn(rowid) {
        if (rowid > -1) {
            this.columns.splice(rowid, 1);
            this.columnHeadArr.splice(rowid, 1);
            this.columnArr.splice(rowid, 1)
            this.count = this.count - 1;
        }

    }


}