import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import { FormControl, Validators, FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent, MatSnackBar } from '@angular/material';
import { HttpService } from 'src/app/services/http-service';
import { environment } from 'src/environments/environment';
import { Router, ActivatedRoute } from '@angular/router';
import { SelectionModel } from '@angular/cdk/collections';
import { productsDialog } from '../../../../../shared/components/products-dialog/products-dialog.component';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { SnackBarComponent } from 'src/app/shared/components/snack-bar/snack-bar.component';
import { UploadFile } from 'src/app/services/uploadFile.service';
import { AlertMessageDialogComponent } from '../../../../../shared/components/alert-message-dialog/alert-message-dialog.component';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { selectStoreDialog } from 'src/app/shared/components/select-store-dialog/select-store.component';

declare var tinymce: any;

export interface Program {
    programId: number;
    programName: string;
}

@Component({
    selector: 'add-burn-rule',
    templateUrl: './add-burn-rule.component.html',
    styleUrls: ['./add-burn-rule.component.scss']
})
export class AddBurnRuleComponent implements OnInit {
    brandList;
    Programs: Program[] = [];
    programCtrl = new FormControl();
    filteredprograms: Observable<Program[]>;

    public breadCrumbData: Array<Object> = [{
        title: 'Loyalty',
        link: ''
    }, {
        title: 'Burn rule',
        link: ''
    }
    ];
    public freeproductvalues = [];
    freeProductCodeValue: any;
    panelOpenState = false;
    public imgUpload = false;
    baseUrl: any = '';
    rewardUrl: any = '';
    showError = false;
    showRewardImageError = false;
    showRuleImageError = false;
    public includeExclude = 'Include';
    public storeList = [];
    public imageUploading: boolean = false;
    public dataStore: boolean = false;
    public rulePath: string = '';
    public rewardPath: string = '';
    public programs = [];
    public programDetails;
    public rewardErrMsg = false;
    public programSelected: boolean = false;
    public programId;
    public brand;
    public brandOid = 0;
    public startDateTime;
    public endDateTime;
    public selectedStore = [];
    public selectedProduct = [];
    public selectedCount;
    public tierList = [];
    public programCondition = false;
    public selection = new SelectionModel(true, []);
    public alignCss = [];
    public rightPanel = [];
    public skuFile = '';
    public skuFileName = '';
    public tierFlag = false;
    public burnRuleName;
    public storeErrorMsg = "Please select Store";
    public productErrorMsg;
    public tierArray;
    public ti;
    public descriptionError = false;
    public termsConditionError = false;
    public selectStoreVal = false;
    public exclude = false;
    public storeRequired: boolean = false;
    burnRuleFormGroup: FormGroup;
    public regionCurrencies = [];
    public regionError = false;
    public conversionList = [];
    public selProgramId = 0;
    public currencyOids: any[];
    public alertMesVal: string;
    public errorList = [];
    rewardArr;
    public freeproductArry = [];
    public totalCount: [];
    public buttonDisable = false;
    public languageList = JSON.parse(localStorage.getItem("languageList"));
    public filePathUrl = localStorage.getItem("imgBaseUrl");
    directionVal: string;
    @ViewChild('burnRuleImg') uploadElRef: ElementRef;
    // @Input ('pageLength') pageLength;
    public pageLength;
    constructor(private fb: FormBuilder,
        private http: HttpService,
        public dialog: MatDialog,
        private https: HttpService,
        private uploadFile: UploadFile,
        public snackBar: MatSnackBar,
        private router: Router, private activatedRoute: ActivatedRoute) {

        this.activatedRoute.params.subscribe(
            (params) => {
                this.selProgramId = +(params.id);

                //this.initialiseState();
            }
        );
        this.programDetails = [];
        this.getRegionCurrency();
        this.getAllTiers();
        this.buildForm();
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

        this.http.postJson(environment.APIEndpoint + 'api/rpa/store/v1/getAll', data).subscribe(res => {
            console.log(res);

            this.totalCount = res['totalCount'];
            this.selectedCount = res["totalCount"];
            console.log(this.totalCount);
        });
    }

    ngOnInit() {
        this.router.routeReuseStrategy.shouldReuseRoute = () => false;
        if (this.selProgramId != 0) {
            this.selectProgram(this.selProgramId);
        } else {
            this.programDetails = [];
        }
        this.getAllBrands();
        this.getProgramsList();
        this.burnRuleNameArray();
        this.descriptionFormArray();
        this.termAndConditionFormArray();


        this.freeproductArry.push({
            name: 'Sandwich',
            value: 'SANDWICH'
        }, {
                name: 'Beverages',
                value: 'BEVERAGES'
            }, {
                name: 'Ice Cream',
                value: 'ICE_CREAM'
            }, {
                name: 'Ice Cream Cake',
                value: 'ICE_CREAM_CAKE'
            });
    }


    getAllBrands() {
        // console.log(this.KioskForm.get('brands').value);
    
        let GET_ALL_ONLINE_BRANDS = environment.APIEndpoint + "api/rpa/loyalty/program/v1/get/programs";
        this.http.getJson(GET_ALL_ONLINE_BRANDS)
          .subscribe((response) => {
            // console.log(response);
            this.brandList = response;
    
            for (let i = 0; i <= this.brandList.length - 1; i++) {
              let objMallkey = {
                programId: this.brandList[i]['programId'],
                programName: this.brandList[i]['programName'],
              }
              console.log(objMallkey);
              this.Programs.push(objMallkey);
            }
            this.filteredprograms = this.programCtrl.valueChanges
                .pipe(
                  startWith(''),
                  map(program => program ? this._filterBrands(program) : this.Programs.slice())
                );
          },
            (error) => {
              console.log(error);
            });
      }
      private _filterBrands(value: string): Program[] {
        const filterValue = value.toLowerCase();
        return this.Programs.filter(program => program.programName.toLowerCase().indexOf(filterValue) === 0);
      }
      public programID;
      getAllPrograms(programId){
        this.programID = programId;
        console.log(this.programID);
        if (this.programId != 0) {
            this.selectProgram(this.programID);
        }
    }

    setupTinyMce() {
        tinymce.init({
            selector: 'editor',
            plugins: 'code, preview ,print,fullpage, searchreplace,directionality, visualblocks, visualchars, fullscreen, image, link, media, template, codesample, table, charmap, hr, pagebreak, nonbreaking, anchor, toc, insertdatetime, advlist, lists, wordcount, imagetools, textpattern, help',
            toolbar: 'code preview',
             directionality : "rtl",
            //   plugins: 'code, preview ,print,fullpage, searchreplace, directionality, visualblocks, visualchars, fullscreen, image, link, media, template, codesample, table, charmap, hr, pagebreak, nonbreaking, anchor, toc, insertdatetime, advlist, lists, wordcount, imagetools, textpattern, help',
            //   toolbar: 'code, preview, undo redo | fontsizeselect fontselect',
            height: "480",
            content_css: ['//fonts.googleapis.com/css?family=Roboto'],
            font_formats: 'Arial Black=arial black,avant garde;Roboto=Roboto'
        });
        console.log(this.directionVal);

    }
    openDialog() {
        const dialogRef = this.dialog.open(selectStoreDialog);
        dialogRef.componentInstance.storeList = this.selectedStore;
        dialogRef.componentInstance.totalCount = this.totalCount;
        dialogRef.componentInstance.brandOid = this.brandOid;
        dialogRef.afterClosed().subscribe(
            (result) => {
                if (result.buttonName === 'SELECT') {
                    this.selectedStore = [];
                    this.selectedCount = result.tableData.length;
                    if (this.selectedCount != 0) {
                        this.storeRequired = false;
                        for (let i = 0; i < result.tableData.length; i++) {
                            let storeId = result.tableData[i].storeOid;
                            this.selectedStore.push(parseInt(storeId));
                            const arrrayTemp = this.selectedStore;
                            this.selectedStore = Array.from(new Set(arrrayTemp));
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
                            this.selectedStore = this.selectedStore.filter(function (element) {
                                return element !== undefined;
                            });
                        }
                    } else {
                        this.storeErrorMsg = "Please select Store";
                    }
                }
            }
        );
    }
    public removeImage(index) {
        this.rulePath = "";
    }
    public removeRewardImage(index) {
        this.rewardPath = "";
    }
    public removeSku() {
        this.skuFile = '';
        this.skuFileName='';
    }
    productsDialog(status: any) {
        const dialogRef = this.dialog.open(productsDialog);
        dialogRef.componentInstance.productList = this.selectedProduct;
        dialogRef.componentInstance.moduleName = 'burnRule';
        dialogRef.componentInstance.programOid = this.programId;
        this.exclude = true;
        dialogRef.componentInstance.excludeToggle = this.exclude;
        dialogRef.afterClosed().subscribe(
            (result) => {
                if (result.buttonName === 'UPLOAD') {
                    this.skuFile = result.skuFileName;
                    if(this.skuFile!=''){
                        this.skuFileName=this.skuFile.split("/").pop();
                    }
                    this.productErrorMsg = "";
                    this.selectedProduct = [];
                }
                if (result.buttonName === 'SELECT') {
                    this.productErrorMsg = "";
                    this.selectedProduct = [];
                    this.skuFile = result.skuFileName;
                    this.selectedCount = result.tableData.length;
                    this.skuFile = "";
                    this.skuFileName="";
                    if (this.selectedCount != 0) {
                        for (let i = 0; i < result.tableData.length; i++) {
                            let skuId = result.tableData[i].skuCode;
                            this.selectedProduct.push(skuId);
                        }
                    } else {
                        this.productErrorMsg = "Please select Product SKU or Products";
                    }
                }
            }
        );
    }
    getProgramsList() {
        this.https.getJson(environment.APIEndpoint + 'api/rpa/loyalty/program/v1/get/programs')
            .subscribe(
                (response) => {
                    this.programs = response;
                },
                (error) => {
                    console.log(error);
                }
            );
    }

    selectProgram(id: number) {
        console.log(id);
        
        this.programSelected = true;
        this.programId = id;
        let body = {
            programId: this.programId
        }

        let GET_PROGRAM_DATA = environment.APIEndpoint + "api/rpa/loyalty/program/v1/view";
        this.https.postJson(GET_PROGRAM_DATA, body)
            .subscribe(
                (response) => {
                    this.programDetails = response;
                    this.programCondition = true;
                    this.startDateTime = new Date(response['startDate']);
                    if (response['startTime'] != null && response['startTime'] != '') {
                        let startTime = response['startTime'].split(":");
                        this.startDateTime.setHours(startTime[0]);
                        this.startDateTime.setMinutes(startTime[1]);
                    }

                    this.endDateTime = response['endDate'] != '' ? new Date(response['endDate']) : '';
                    console.log("this.endDateTime" + this.endDateTime);
                    if (response['endTime'] != null && response['endTime'] != '' && this.endDateTime != '') {
                        let endTime = response['endTime'].split(":");
                        this.endDateTime.setHours(endTime[0]);
                        this.endDateTime.setMinutes(endTime[1]);
                    }

                    if (this.programDetails.rewardType == 'STAMPS') {
                        let reward = this.burnRuleFormGroup.get('freeProduct');
                        reward.setValue('FREE_PRODUCT');
                        reward.updateValueAndValidity();
                    } else {
                        let reward = this.burnRuleFormGroup.get('freeProduct');
                        reward.setValue('POINTS');
                        reward.updateValueAndValidity();
                        let freeProductType = this.burnRuleFormGroup.get('freeProductType');
                        freeProductType.clearValidators();
                        freeProductType.updateValueAndValidity();
                    }

                    let brand = this.programDetails.brand;
                    if (brand == null) {
                        this.brand = "";
                    } else {
                        this.brand = brand.brandName;
                        this.brandOid = brand.brandId;
                        this.getFreeProduct(this.brandOid);
                    }
                },
                (error) => {
                    console.log(error);
                }
            );
    }

    public buildForm() {
        let form = {
            enableButton: [false],
            displayScreen: [false],
            exclusive: [false],
            freeProduct: ['FREE_PRODUCT', Validators.required],
            rewardQuantity: [''],
            tierArray: this.fb.array([]),
            burnRuleName: this.fb.array([]),
            descriptionArray: this.fb.array([]),
            TermAndConditionArray: this.fb.array([]),
            rewardArray: this.fb.array([]),
            minimumPoints: "",
            freeProductType: ["", Validators.required],
            ruleType: false,

        }
        this.burnRuleFormGroup = this.fb.group(form);
    }
    public rewardArrayForm() {
        this.tierFlag = true;
        const control = <FormArray>this.burnRuleFormGroup.controls['rewardArray'];
        for (let t = 0; t < this.tierList.length; t++) {
            //let tier = this.tierList[t];
            let arr = this.fb.group({
                tierId: [this.tierList[t].tierId],
                currencyArr: this.fb.array([])
            });
            control.push(arr);
            this.tierCurrencyForm(control.controls[t]);
        }
        this.burnRuleFormGroup.updateValueAndValidity();
    }

    public tierCurrencyForm(control) {
        const array = <FormArray>control.controls['currencyArr'];
        for (let currency of this.regionCurrencies) {
            let arr = this.fb.group({
                [currency.regionId]: ['',]
            });
            array.push(arr);
        }

    }
    public burnRuleNameArray() {
        const control = <FormArray>this.burnRuleFormGroup.controls['burnRuleName'];
        for (let i = 0; i < this.languageList.length; i++) {
            let newForm = this.fb.group({
                burn: ['', Validators.compose([Validators.required])],
            });
            control.push(newForm);
            this.alignCss.push(this.languageList[i].direction == 'RTL' ? 'text-right' : '');
            this.rightPanel.push(this.languageList[i].direction == 'RTL' ? 'right-panel' : '');
        }
    }

    public descriptionFormArray() {
        const controls = <FormArray>this.burnRuleFormGroup.controls['descriptionArray'];
        for (let i = 0; i < this.languageList.length; i++) {
            console.log(this.languageList[i].languageCode);
            if (this.languageList[i].languageCode == "AR") {
                console.log("Arabic Value");
                this.directionVal = 'rtl';
                console.log(this.directionVal);
                this.languageList[i].direction = 'RTL'

            } else {
                this.directionVal = 'ltr';
            }
            this.setupTinyMce();
            console.log(this.languageList);
            let control = this.fb.group({
                description: ['']
            });
            controls.push(control);
            this.alignCss.push(this.languageList[i].direction == 'RTL' ? 'text-right' : '');
            this.rightPanel.push(this.languageList[i].direction == 'RTL' ? 'right-panel' : '');
        }
    }

    public termAndConditionFormArray() {
        const controls = <FormArray>this.burnRuleFormGroup.controls['TermAndConditionArray'];
        for (let i = 0; i < this.languageList.length; i++) {
            let control = this.fb.group({
                termAndCondition: ['']
            });
            controls.push(control);
            this.alignCss.push(this.languageList[i].direction == 'RTL' ? 'text-right' : '');
            this.rightPanel.push(this.languageList[i].direction == 'RTL' ? 'right-panel' : '');
        }
    }

    getAllTiers() {
        let GET_ALL_TIERS = environment.APIEndpoint + "api/rpa/tier/v1/qualification/list"
        this.http.getJson(GET_ALL_TIERS)
            .subscribe((response) => {
                this.tierList = response;
                this.tierArrayForm();
            })

    }
    public tierArrayForm() {
        const control = <FormArray>this.burnRuleFormGroup.controls['tierArray'];
        for (let t = 0; t < this.tierList.length; t++) {
            let arr = this.fb.group({
                tierName: this.tierList[t].tierName,
                tierCount: [''],
            });
            control.push(arr);
            //console.log(this.burnRuleFormGroup.controls['tierArray']['controls'][1]['ti'].value);
        }
    }
    getRegionCurrency() {
        let GET_REGION_CURRENCIES_AND_TIERS = environment.APIEndpoint + "api/rpa/client/onboarding/v1/view"
        this.http.getJson(GET_REGION_CURRENCIES_AND_TIERS).subscribe((response) => {
            this.currencyOids = response['regionList'].map(oid => oid.currencyOid);
            this.regionCurrencies = response['regionList'].map(function (item) {
                let region = {
                    regionId: item.regionId,
                    currencyCode: item.currencyCode,
                }
                return region;
            })
            this.getCurrencyConversionValue(this.currencyOids);
            this.rewardArrayForm();
        })
    }


    public baseRuleImg(event: FileList) {
        this.imageUploading = true;
        if (event[0].type == "image/jpeg" || event[0].type == "image/png" || event[0].type == "image/jpg") {
            this.uploadFile.upload(event.item(0), 'burnRule', 'images')
                .subscribe((response) => {
                    this.rulePath = response['message'];
                    this.imageUploading = false;
                    this.showRuleImageError = false;
                    this.uploadElRef.nativeElement.value = ''
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
                                message: "Internal server error"
                            }
                        });
                    }
                })
        } else {
            this.snackBar.openFromComponent(SnackBarComponent, {
                duration: 10000,
                data: {
                    status: "failure",
                    message: "Supported format is JPG, JPEG and PNG"
                }
            });
        }
    }


    public rewardImg(event: FileList) {
        this.imageUploading = true;
        if (event[0].type == "image/jpeg" || event[0].type == "image/png" || event[0].type == "image/jpg") {
            this.uploadFile.upload(event.item(0), 'burnRule', 'images')
                .subscribe((response) => {
                    this.rewardPath = response['message'];
                    this.imageUploading = false;
                    this.showRewardImageError = false;
                    this.uploadElRef.nativeElement.value = ''
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
                                message: "Internal server error"
                            }
                        });
                    }
                })
        } else {
            this.snackBar.openFromComponent(SnackBarComponent, {
                duration: 10000,
                data: {
                    status: "failure",
                    message: "Supported format is JPG, JPEG and PNG"
                }
            });
        }
    }
    removeErrorMsg(index) {
        let totalLength = this.languageList.length;
        if (totalLength - 1 == index) {
            this.descriptionError = false;
        }
    }
    removeTermsCondErrorMsg(index) {
        let totalLength = this.languageList.length;
        if (totalLength - 1 == index) {
            this.termsConditionError = false;
        }
    }


    createBurnRule(formData) {
        let programId = this.programDetails.programId;
        
        console.log(this.burnRuleFormGroup)
        this.regionError = false;
        this.rewardArr = [];
        this.burnRuleName = [];
        this.tierArray = [];
        this.descriptionError = false;
        this.termsConditionError = false;
        let termsError;
        let descError;
        for (let d of formData.descriptionArray) {
            if (d.description == '') {
                descError = true;
            }
        }
        for (let d of formData.TermAndConditionArray) {
            if (d.termAndCondition == '') {
                termsError = true;
            }
        }
        if (formData.freeProduct === 'POINTS') {
            for (let cn of formData.rewardArray[1].currencyArr) {
                var key = Object.keys(cn)
                if (cn[key[0]] == '') {
                    this.regionError = true;
                }
            }
        }
        let skuRequired = false;
        if (formData.freeProduct === "FREE_PRODUCT" && this.skuFile == "" && this.selectedProduct.length == 0) {
            skuRequired = true;
            this.productErrorMsg = "Please select Product SKU or Products";
        }
        let storeError = false;
        if (this.includeExclude == 'Include' && this.selectedStore.length == 0) {
            storeError = true;
        }

        if (this.burnRuleFormGroup.invalid || this.rulePath === '' || descError || termsError || this.regionError || skuRequired || storeError) {
            this.showRewardImageError = this.rewardPath === '' ? true : false;
            this.showRuleImageError = this.rulePath === '' ? true : false;
            this.descriptionError = descError;
            this.termsConditionError = termsError;
            this.showError = true;
            this.storeRequired = storeError;
        }
        else if (formData.freeProduct == 'FREE_PRODUCT' && this.rewardPath == '') {
            this.showRewardImageError = true;
        } else if (this.rulePath == '') {
            this.showRuleImageError = true;
        } else {
            this.buttonDisable = true;
            formData.burnRuleName.forEach((rule, index) => {
                let locale = {
                    languageId: this.languageList[index].languageId,
                    ruleName: rule.burn,
                    description: formData.descriptionArray[index].description,
                    termsAndConditions: formData.TermAndConditionArray[index].termAndCondition,
                }
                this.burnRuleName.push(locale);
            })
            if (formData.freeProduct === 'FREE_PRODUCT') {
                formData.tierArray.forEach((tier, index) => {
                    let locale = {
                        tierId: this.tierList[index].tierId,
                        noOfStamps: formData.tierArray[index].tierCount
                    }
                    this.tierArray.push(locale);
                })
            }
            if (formData.freeProduct === 'POINTS') {
                for (let t of formData.rewardArray) {
                    for (let i = 0; i < t.currencyArr.length; i++) {
                        var key = Object.keys(t.currencyArr[i])
                        if (t.currencyArr[i][key[0]] != '') {
                            this.rewardArr.push(
                                {
                                    regionId: parseInt(key[0]),//int
                                    tierId: parseInt(t.tierId),//int
                                    rewardValue: t.currencyArr[i][key[0]]//int
                                })
                        } else {
                            this.regionError = true;
                        }

                    }
                }
            }

            let type = null;
            if (null != formData.freeProductType && formData.freeProductType != "") {
                type = formData.freeProductType;
            }

            let storeIncExcl: boolean = false;
            if (this.selectedStore.length == 0) {
                storeIncExcl = true;
            } else {
                storeIncExcl = formData.ruleType;
            }

            let requestBody = {
                programId: this.programDetails.programId,
                isDisplayHomeScreen: formData.displayScreen,
                isExclusive: formData.exclusive,
                rewardType: formData.freeProduct,
                rewardQty: formData.rewardQuantity,
                rewardImagePath: this.rewardPath,
                ruleImagePath: this.rulePath,
                skuFilePath: this.skuFile,
                skuCodeList: this.selectedProduct,
                ruleLocaleList: this.burnRuleName,
                storeList: this.selectedStore,
                ruleTierList: this.tierArray,
                rewardValues: this.rewardArr,
                excludeStore: storeIncExcl,
                isExcludeSku: 0,
                minimumPoints: formData.minimumPoints === '' ? 0 : formData.minimumPoints,
                freeProductType: type
            }
            let CREATE_BURN_RULE = environment.APIEndpoint + "api/rpa/burn/rule/v1/save";
            this.http.postJson(CREATE_BURN_RULE, requestBody)
                .subscribe((response) => {
                    this.snackBar.openFromComponent(SnackBarComponent, {
                        duration: 1500,
                        data: {
                            status: "success",
                            message: "Burn Rule has been created successfully"
                        }
                    });
                    // this.router.navigate(['view-programs/' + this.programId]);
                    let ID = programId;
                    localStorage.setItem('ViewID', ID);
                    this.router.navigate(['/view-programs']);
                },
                    (error) => {
                        this.buttonDisable = false;
                        if (error.error.errorType == 'VALIDATION') {
                            this.snackBar.openFromComponent(SnackBarComponent, {
                                duration: 10000,
                                data: {
                                    status: "failure",
                                    message: error.error.errorDetails[0].description
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
    public getCurrencyConversionValue(currencyOids: any) {
        let GET_ALL_CURRENCY_CONVERSION_VALUE = environment.APIEndpoint + "api/rpa/master/currencyconversion/v1/get/conversionRate?currencyOids=" +
            currencyOids;
        this.http.getJson(GET_ALL_CURRENCY_CONVERSION_VALUE)
            .subscribe((response) => {
                this.conversionList = response;
            })
    }

    public toggleIncludeExclude(event) {
        if (event.checked == false) {
            this.includeExclude = 'Include';
            this.burnRuleFormGroup.get('ruleType').setValue(false);
            this.storeRequired = false;
        } else {
            this.includeExclude = 'Exclude';
            this.burnRuleFormGroup.get('ruleType').setValue(true);
            this.storeRequired = false;
        }

    }

    public autoPopulateCurrencyValue(column, row, baseCurValue) {
        console.log("tier" + column.controls);
        this.errorList = [];

        // let regex =/^[0-9]*$/;
        let regex = /^[0-9]{1,19}.?[0-9]{0,3}$/;
        if (baseCurValue.indexOf(".") == -1) {
            regex = /^[0-9]{1,19}$/;
        }
        if (baseCurValue != '') {
            let valid = baseCurValue.match(regex)
            if (!valid) {
                this.rewardErrMsg = true;
            } else {
                this.rewardErrMsg = false;

                if (row == 0 && column != undefined && baseCurValue != "") {


                    for (let i = 1; i < this.regionCurrencies.length; i++) {
                        for (let conversion of this.conversionList) {
                            const array = <FormArray>column.controls['currencyArr'];
                            if (conversion.currencyCode === this.regionCurrencies[i].currencyCode) {
                                let conversionValue = conversion.conversionValue * parseFloat(baseCurValue)
                                if (conversionValue.toFixed(0).length > 19) {
                                    this.errorList.push(this.regionCurrencies[i].currencyCode);
                                    conversionValue = 0;
                                    console.log("decimal " + conversionValue.toFixed(0).length);
                                }
                                array.at(i).patchValue({
                                    [this.regionCurrencies[i].regionId]: conversionValue.toFixed(3)
                                });
                                array.markAsPristine;
                            }
                        }

                        //array.push(arr);
                    }

                    this.regionError = false;
                }
            }
            if (this.errorList.length > 0) {
                this.alertMesVal = this.errorList.toString() + " values exceeds limit";
                this.alertLengthPopup();
            }
        }

    }
    alertLengthPopup() {
        const dialogRef = this.dialog.open(AlertMessageDialogComponent);
        dialogRef.componentInstance.alertMes = this.alertMesVal;
    }
    expandDataEmail(){
        var allifram = document.getElementById("arabicID");
        var iFrame_Arabic = allifram.getElementsByTagName("iframe")[0];
        var html_Arabic = iFrame_Arabic.contentWindow.document.getElementsByTagName("html")[0];
        html_Arabic.setAttribute("style", "direction: rtl;");
    }
    expandtermAndCondition(){
        var allifram = document.getElementById("arabicIDtac");
        var iFrame_Arabic = allifram.getElementsByTagName("iframe")[0];
        var html_Arabic = iFrame_Arabic.contentWindow.document.getElementsByTagName("html")[0];
        html_Arabic.setAttribute("style", "direction: rtl;");
    }


    getFreeProduct(brandId) {
        console.log(brandId);
        this.brandOid = brandId;
        let GET_FREE_PRODUCTS_VALUE = environment.APIEndpoint + "api/rpa/master/freeProduct/v1/list/" + this.brandOid;
        this.http.getJson(GET_FREE_PRODUCTS_VALUE).subscribe(
            (response) => {
                console.log(response);
                this.freeproductvalues = response['freeProductType'];
                console.log(this.freeproductvalues);
                
            }
        )
    }
    getfreeproductvalue(freeProductCode){
        this.freeProductCodeValue = freeProductCode;
    }


}
