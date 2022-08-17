import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormControl, Validators, FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent, MatSnackBar } from '@angular/material';
import { HttpService } from 'src/app/services/http-service';
import { environment } from 'src/environments/environment';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { productsDialog } from 'src/app/shared/components/products-dialog/products-dialog.component';
import { SnackBarComponent } from 'src/app/shared/components/snack-bar/snack-bar.component';
import { UploadFile } from 'src/app/services/uploadFile.service';
import { AlertMessageDialogComponent } from '../../../../../shared/components/alert-message-dialog/alert-message-dialog.component';
import { selectStoreDialog } from 'src/app/shared/components/select-store-dialog/select-store.component';


@Component({
    selector: 'edit-burn-rule',
    templateUrl: './edit-burn-rule.component.html',
    styleUrls: ['./edit-burn-rule.component.scss']
})
export class EditBurnRuleComponent implements OnInit {
    public breadCrumbData: Array<Object> = [{
        title: 'Loyalty',
        link: ''
    }, {
        title: 'Burn rule',
        link: ''
    }
    ];
    public imgUpload = false;
    public checked = true;
    panelOpenState = false;
    public burnRuleId;
    public programId: number;
    public programDetails;
    public startDate;
    public startDateTime;
    public skuFile = '';
    public skuFileName = '';
    public endDateTime;
    public expiryDate = false;
    public endDate;
    public burnRuleDetails;
    public rewardTypes;
    public regionCurrencies = [];
    public currencyOids: any;
    public tierList = [];
    public alignCss = [];
    public rightPanel = [];
    public burnRuleName;
    isChecked = false;
    currencies = [];
    public storeErrorMsg = "Please select Store";
    public selectedProduct;
    public brand;
    public brandOid = 0;
    public rewardErrMsg = false;
    baseUrl: any = '';
    rewardUrl: any = '';
    burnRuleFormGroup: FormGroup;
    public buildFlag = false;
    burnRuleNameArray;
    public tierArray;
    showError = false;
    public selectedCount;
    public productErrorMsg;
    public imageUploading: boolean = false;
    public rulePath: string = '';
    public rewardPath: string = '';
    showRewardImageError = false;
    showRuleImageError = false;
    public exclude = false;
    public tierFlag = false;
    public languageList = JSON.parse(localStorage.getItem("languageList"));
    public regionError = false;
    public conversionList = [];
    rewardArr;
    public freeproductArry = [];
    public includeExclude = 'Include';
    public disableButton = false;
    public alertMesVal: string;
    public errorList = [];
    public totalCount: any = 2000;
    public filePathUrl = localStorage.getItem("imgBaseUrl");
    public storeRequired: boolean = false;
    @ViewChild('burnRuleImg') uploadElRef: ElementRef;
    public fileUrl = localStorage.getItem("fileBaseUrl");
    public selectedStore:any=[];

    constructor(
        private fb: FormBuilder,
        public dialog: MatDialog,
        private https: HttpService,
        private activatedRoute: ActivatedRoute,
        private uploadFile: UploadFile,
        public snackBar: MatSnackBar,
        private router: Router) {
        // this.activatedRoute.params.subscribe(
        //     (params) => {
        //         this.burnRuleId = params.id;
        //     }
        // );
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



    ngOnInit() {
        let data = localStorage.getItem('BurnEditID');
        if(data){
            this.burnRuleId=data;
            this.getAllTiers();
            this.getRegionCurrency();
            this.router.routeReuseStrategy.shouldReuseRoute = () => false;
            localStorage.removeItem('BurnEditID')
        }else{
            sessionStorage.clear();
            this.router.navigate(['/search-programs']); 
        }
        

    }

    getAllTiers() {
        let GET_ALL_TIERS = environment.APIEndpoint + "api/rpa/tier/v1/qualification/list"
        this.https.getJson(GET_ALL_TIERS)
            .subscribe((response) => {
                console.log(response);
                this.tierList = response;

            })

    }

    totalDataStore() {
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

        this.https.postJson(environment.APIEndpoint + 'api/rpa/store/v1/getAll', data).subscribe(res => {
            this.totalCount = res['totalCount'];
        });
    }

    public burnRuleFormBuilder(editData) {
        this.buildFlag = true
        this.burnRuleFormGroup = this.fb.group({
            displayScreen: [editData.isDisplayHomeScreen],
            exclusive: [editData.isExclusive],
            burnRuleNameArray: this.fb.array([]),
            tierArray: this.fb.array([]),
            freeProduct: [{ value: editData.rewardType, disabled: true }],
            rewardQuantity: [editData.rewardQty],
            descriptionArray: this.fb.array([]),
            termAndConditionArray: this.fb.array([]),
            rewardArray: this.fb.array([]),
            minimumPoints: [editData.minimumPoints],
            freeProductType: [editData.freeProductType, Validators.required],
            ruleType: editData.excludeStore,
        });

        if (editData.rewardType == "POINTS") {
            let pointsProduct = this.burnRuleFormGroup.get('freeProductType');
            pointsProduct.clearValidators();
            pointsProduct.updateValueAndValidity();
        }

        this.burnRuleArray(editData['ruleLocaleList']);
        this.descriptionFormArray(editData['ruleLocaleList']);
        this.termAndConditionFormArray(editData['ruleLocaleList']);
        this.tierArrayForm(editData['ruleTierList']);

        if (editData['rewardWorth'] != null) {
            this.rewardArrayForm(editData['rewardWorth']);
        }
    }
    public rewardArrayForm(tierList) {
        this.tierFlag = true;
        const control = <FormArray>this.burnRuleFormGroup.controls['rewardArray'];
        for (let t = 0; t < tierList.length; t++) {
            //let tier = this.tierList[t];
            let arr = this.fb.group({
                tierId: [this.tierList[t].tierId],
                currencyArr: this.fb.array([])
            });

            control.push(arr);
            this.tierCurrencyForm(control.controls[t], tierList[t].rewardValues);
        }
    }

    public tierCurrencyForm(control, rewardValues) {
        const array = <FormArray>control.controls['currencyArr'];
        //   for(let r of rewardValues){
        //       let arr = this.fb.group({
        //           [r.regionId]: r.rewardValue
        //       });
        //       array.push(arr);
        //   }

        for (let rc of this.regionCurrencies) {
            var rewardValue = '0';
            for (let rv of rewardValues) {
                if (rv.regionId == rc.regionId) {
                    rewardValue = rv.rewardValue;
                }
            }
            let arr = this.fb.group({
                [rc.regionId]: rewardValue
            });

            array.push(arr);
        }
    }
    public burnRule(event: FileList) {
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


    public removeRuleImage() {
        this.rulePath = "";
    }

    public removeRewardImage() {
        this.rewardPath = "";
    }
    public removeSku() {
        this.skuFile = '';
        this.skuFileName='';
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


    public burnRuleArray(burnRuleNameArray) {
        const control = <FormArray>this.burnRuleFormGroup.controls['burnRuleNameArray'];
        for (let burn of burnRuleNameArray) {
            let newForm = this.fb.group({
                burnRule: [burn.ruleName, Validators.compose([Validators.required])],
            });
            control.push(newForm);
            this.alignCss.push(burn.languageDirection == 'RTL' ? 'text-right' : '');
            this.rightPanel.push(burn.languageDirection == 'RTL' ? 'right-panel' : '');
        }
    }

    public descriptionFormArray(burnRuleDescriptionArray) {
        const control = <FormArray>this.burnRuleFormGroup.controls['descriptionArray'];
        for (let descriptionValue of burnRuleDescriptionArray) {
            let newForm = this.fb.group({
                description: [descriptionValue.description],
            });
            control.push(newForm);
        }
    }


    public termAndConditionFormArray(burnRuleTermAndConditionArray) {
        const control = <FormArray>this.burnRuleFormGroup.controls['termAndConditionArray'];
        for (let termAndConditionValue of burnRuleTermAndConditionArray) {
            let newForm = this.fb.group({
                termAndCondition: [termAndConditionValue.termsAndConditions],
            });
            control.push(newForm);
        }
    }

    public tierArrayForm(tierList) {
        const control = <FormArray>this.burnRuleFormGroup.controls['tierArray'];
        for (let t = 0; t < tierList.length; t++) {
            let arr = this.fb.group({
                tierName: this.tierList[t].tierName,
                tierCount: [tierList[t].noOfStamps, Validators.required],
            });
            control.push(arr);
            //console.log(this.burnRuleFormGroup.controls['tierArray']['controls'][1]['ti'].value);
        }
    }

    openDialog() {
        const dialogRef = this.dialog.open(selectStoreDialog);
        dialogRef.componentInstance.storeList = this.selectedStore;
        dialogRef.componentInstance.brandOid = this.brandOid;
        dialogRef.componentInstance.totalCount = this.totalCount;
        dialogRef.afterClosed().subscribe(
            (result) => {
                if (result.buttonName === 'SELECT') {
                    this.selectedStore = [];
                    this.selectedCount = result.tableData.length;
                    if (this.selectedCount != 0) {
                        this.storeRequired = false;
                        for (let i = 0; i < result.tableData.length; i++) {
                            let storeId = result.tableData[i].storeOid;
                            this.selectedStore.push(storeId);

                        }
                    } else {
                        this.storeErrorMsg = "Please select Store";
                    }
                   // this.selectedStore = result.tableData.map(a => a.storeOid);
                    console.log(this.selectedStore);
                }
            });
    }
    public removeSkuFile() {
        this.skuFile = '';
    }
    productsDialog() {
        const dialogRef = this.dialog.open(productsDialog);
        dialogRef.componentInstance.productList = this.selectedProduct;
        dialogRef.componentInstance.moduleName = "burnRule";
        dialogRef.componentInstance.programOid = this.programId;
        this.exclude = true;
        dialogRef.componentInstance.excludeToggle = this.exclude;
        dialogRef.afterClosed().subscribe(
            (result) => {
                if (result.buttonName === 'UPLOAD') {
                    this.skuFile = result.skuFileName;
                    this.productErrorMsg = "";
                    this.productErrorMsg = "";
                }
                if (result.buttonName === 'SELECT') {
                    this.selectedProduct = [];
                    this.skuFile = "";
                    this.selectedCount = result.tableData.length;
                    if (this.selectedCount != 0) {
                        for (let i = 0; i < result.tableData.length; i++) {
                            let skuId = result.tableData[i].skuCode;
                            this.selectedProduct.push(skuId);
                        }
                    }
                    else {
                        this.productErrorMsg = "Please select Product SKU or Products";

                    }
                    this.selectedProduct = result.tableData.map(a => a.skuCode)
                }
            });
    }

    viewBurnRule() {
        let requestBody = {
            burnRuleId: this.burnRuleId
        }
        this.https.postJson(environment.APIEndpoint + 'api/rpa/burn/rule/v1/view', requestBody)
            .subscribe(
                (response) => {

                    this.burnRuleDetails = response;
                    if (null != response['storeList'] && response['storeList'].length != 0) {
                        this.selectedStore = response['storeList'].map(p => p.storeId);
                    }

                    this.rulePath = response['ruleImagePath'];
                    this.rewardPath = response['rewardImagePath'];
                    this.programId = +(response['programId']);
                    if (response['excludeStore']) {
                        this.includeExclude = 'Exclude';
                    } else {
                        this.includeExclude = 'Include';
                    }

                    if (response['skuFilePath'] == null || response['skuFilePath'] == "") {
                        this.selectedProduct = response['skuCodeList'];
                    } else {
                        this.skuFile = response['skuFilePath'];
                    }

                    this.burnRuleFormBuilder(response);
                    this.getProgramDetails(this.programId);
                },
                (error) => {
                    console.log(error);
                });
    }

    getProgramDetails(id: number) {
        let body = {
            programId: id
        }
        let GET_PROGRAM_DATA = environment.APIEndpoint + "api/rpa/loyalty/program/v1/view";
        this.https.postJson(GET_PROGRAM_DATA, body)
            .subscribe(
                (response) => {
                    this.programDetails = response;
                    this.startDate = new Date();
                    let pointExpiry = response['pointExpiryIn'];
                    if (pointExpiry != "NOOFDAYS") {
                        this.expiryDate = true;
                    }
                    this.startDateTime = new Date(response['startDate']);
                    if (response['startTime'] != null && response['startTime'] != '') {
                        let startTime = response['startTime'].split(":");
                        this.startDateTime.setHours(startTime[0]);
                        this.startDateTime.setMinutes(startTime[1]);
                    }

                    this.endDateTime = response['endDate'] != '' ? new Date(response['endDate']) : '';
                    if (response['endTime'] != null && response['endTime'] != '') {
                        let endTime = response['endTime'].split(":");
                        this.endDateTime.setHours(endTime[0]);
                        this.endDateTime.setMinutes(endTime[1]);
                    }
                    this.rewardTypes = response['pointWorths'];
                    this.isChecked = response['status'] == "ONLINE" ? true : false
                    for (let type of this.rewardTypes[0].rewardValues) {
                        this.currencies.push(type.currencyCode);
                    }
                    let brand = this.programDetails.brand;
                    if (brand == null) {
                        this.brand = "";
                    } else {
                        this.brand = brand.brandName;
                        this.brandOid = brand.brandId;
                    }

                },
                (error) => {
                    console.log(error);
                });
    }

    getRegionCurrency() {
        let GET_REGION_CURRENCIES_AND_TIERS = environment.APIEndpoint + "api/rpa/client/onboarding/v1/view"
        this.https.getJson(GET_REGION_CURRENCIES_AND_TIERS).subscribe((response) => {
            this.currencyOids = response['regionList'].map(oid => oid.currencyOid);
            this.regionCurrencies = response['regionList'].map(function (item) {
                let region = {
                    regionId: item.regionId,
                    currencyCode: item.currencyCode,
                }
                return region;
            })
            this.viewBurnRule();
            this.getCurrencyConversionValue(this.currencyOids);
        })
    }


    updateBurnRule(formData) {
        this.burnRuleName = [];
        this.rewardArr = []
        this.tierArray = [];
        let skuRequired = false;
        if (this.burnRuleDetails['rewardType'] === 'FREE_PRODUCT' && this.skuFile == "" && this.selectedProduct == undefined){
            skuRequired = true;
            this.productErrorMsg = "Please select Product SKU or Products"; 
            return;
        }
        if (this.burnRuleDetails['rewardType'] === 'FREE_PRODUCT' && this.skuFile == "" && this.selectedProduct.length == 0) {
            skuRequired = true;
            this.productErrorMsg = "Please select Product SKU or Products";
            return;
        }

        let storeError = false;
        if (this.includeExclude == 'Include' && this.selectedStore.length == 0) {
            storeError = true;
        }

        if (this.burnRuleFormGroup.invalid == true || skuRequired || storeError) {
            this.showError = true;
            this.storeRequired = storeError;
            return
        } else if (this.burnRuleDetails['rewardType'] === 'FREE_PRODUCT' && this.rewardPath == '') {
            this.showRewardImageError = true;
        } else if (this.rulePath == '') {
            this.showRuleImageError = true;
        } else {
            this.disableButton = true;
            formData.burnRuleNameArray.forEach((rule, index) => {
                let locale = {
                    languageId: this.languageList[index].languageId,
                    ruleName: rule.burnRule,
                    description: formData.descriptionArray[index].description,
                    termsAndConditions: formData.termAndConditionArray[index].termAndCondition,
                }
                this.burnRuleName.push(locale);
            })

            if (this.burnRuleDetails['rewardType'] === 'FREE_PRODUCT') {
                formData.tierArray.forEach((tier, index) => {
                    let locale = {
                        tierId: this.tierList[index].tierId,
                        noOfStamps: formData.tierArray[index].tierCount
                    }
                    this.tierArray.push(locale);
                })
            }

            if (this.burnRuleDetails['rewardType'] === 'POINTS') {
                for (let t of formData.rewardArray) {
                    for (let i = 0; i < t.currencyArr.length; i++) {
                        var key = Object.keys(t.currencyArr[i]);

                        if (t.currencyArr[i][key[0]] != '') {
                            this.rewardArr.push(
                                {
                                    regionId: parseInt(key[0]),//int
                                    tierId: parseInt(t.tierId),//int
                                    rewardValue: (t.currencyArr[i][key[0]])//int
                                })
                        } else {
                            this.regionError = true;
                        }

                    }
                }
            }

            let type = null;
            if (null != formData.freeProductType && formData.freeProductType != '') {
                type = formData.freeProductType;
            }

            let storeIncExcl: boolean = false;
            
            if (this.selectedStore.length == 0) {
                storeIncExcl = true;
            } else {
                storeIncExcl = formData.ruleType;
            }

            let requestBody = {
                burnRuleId: this.burnRuleId,
                programId: this.programDetails.programId,
                isDisplayHomeScreen: formData.displayScreen,
                isExclusive: formData.exclusive,
                rewardType: this.burnRuleDetails['rewardType'],
                rewardQty: formData.rewardQuantity,
                ruleImagePath: this.rulePath,
                rewardImagePath: this.rewardPath,
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
            let UPDATE_BURN_RULE = environment.APIEndpoint + "api/rpa/burn/rule/v1/update";
            this.https.postJson(UPDATE_BURN_RULE, requestBody)
                .subscribe((response) => {
                    this.snackBar.openFromComponent(SnackBarComponent, {
                        duration: 1500,
                        data: {
                            status: "success",
                            message: "Burn Rule updated successfully"
                        }
                    });
                    
                    localStorage.setItem('ViewID',this.programDetails.programId);
                    sessionStorage.clear();
                    this.router.navigate(['/view-programs'])
                    // this.router.navigate(['/view-programs/' + this.programDetails.programId]);
                },
                    (error) => {
                        this.disableButton = false;
                        console.log(error);
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
        this.https.getJson(GET_ALL_CURRENCY_CONVERSION_VALUE)
            .subscribe((response) => {
                this.conversionList = response;

            })
    }
    public autoPopulateCurrencyValue(column, row, baseCurValue) {
        // let regex =/^[0-9]*$/;
        this.errorList = [];
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
                                let conversionValue = conversion.conversionValue * parseFloat(baseCurValue);
                                if (conversionValue.toFixed(0).length > 19) {
                                    this.errorList.push(this.regionCurrencies[i].currencyCode);
                                    conversionValue = 0;
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
       ViewBurnRule(burnRuleId){
        localStorage.setItem('ViewBurnID',burnRuleId);
        this.router.navigate(['/view-burn-rule']);
    }
}
