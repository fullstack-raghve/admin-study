import { Component, OnInit, ViewChild, ChangeDetectorRef, ElementRef } from '@angular/core';
import { FormControl, Validators, FormBuilder, FormGroup, FormArray, AbstractControl,ValidatorFn } from '@angular/forms';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent, MatSnackBar } from '@angular/material';
import { HttpService } from 'src/app/services/http-service';
import { environment } from 'src/environments/environment';
import { Router, ActivatedRoute } from '@angular/router';
import { productsDialog } from '../../../../../shared/components/products-dialog/products-dialog.component';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { SnackBarComponent } from 'src/app/shared/components/snack-bar/snack-bar.component';
import * as moment from 'moment';
import { UploadFile } from 'src/app/services/uploadFile.service';
import { isJsObject } from '@angular/core/src/change_detection/change_detection_util';
import { AlertMessageDialogComponent } from '../../../../../shared/components/alert-message-dialog/alert-message-dialog.component';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { selectStoreDialog } from 'src/app/shared/components/select-store-dialog/select-store.component';

export function checkValidation(group: FormGroup) {
    let perpectual = group.get('perpectual').value;
    let action = group.get('action').value;
    let endDateControl = group.get('endDate');
    let noOfDays = group.get('noOfDays');
    let noOfTxnAfterRegistration = group.get('noOfTxnAfterRegistration');
    let noOfInviteSent = group.get('noOfInviteSent');
    let noOfRegistration = group.get('noOfRegistration');

    if (perpectual == false) {
        endDateControl.setValidators([Validators.required]);
    }
    if (action == 'INVITE_XX_FRIENDS') {
        noOfInviteSent.setValidators([Validators.required]);
    }
    else if (action == 'REFERRAL_REGISTERED') {
        noOfRegistration.setValidators([Validators.required]);
    }
    else if (action == 'ACTIVE_AFTER_XX_DAYS') {
        noOfDays.setValidators([Validators.required]);
    } else if (action == 'XX_TRANSACTIONS_AFTER_REGISTRATION') {
        noOfTxnAfterRegistration.setValidators([Validators.required]);
    }


}

export function forbiddenNamesValidator(names: string[]): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      // below findIndex will check if control.value is equal to one of our options or not
      const index = names.findIndex(name => {
        return (new RegExp('\^' + name + '\$')).test(control.value);
      });
      return index < 0 ? { 'forbiddenNames': { value: control.value } } : null;
    };
  }

export interface Country {
    countryId: number;
    countryName: string;
}

@Component({
    selector: 'edit-earn-rule',
    templateUrl: './edit-earn-rule.component.html',
    styleUrls: ['./edit-earn-rule.component.scss']
})
export class EditEarnRuleComponent implements OnInit {
    public breadCrumbData: Array<Object> = [{
        title: 'Loyalty',
        link: ''
    }, {
        title: 'Earn rule',
        link: ''
    }
    ];
    public countryData: boolean = false;
    public prePopulatecountryOid;
    @ViewChild('uploadImgEl') uploadImgElRef: ElementRef;
    earnRuleFormGroup: FormGroup;
    public buildForm = false;
    public statusValue = 'ONLINE';
    public toggleVal = true;
    panelOpenState = true;
    public checked = true;
    public imgUpload = false;
    public SelectedActionType;
    public rewardErrMsg = false;
    public selectAction = [];
    public alignCss = [];
    public rightPanel = [];
    public languageList = JSON.parse(localStorage.getItem("languageList"));
    public imgBaseUrl = localStorage.getItem("imgBaseUrl");
    public tierList = [];
    public regionCurrencies = [];
    public tierFlag = false;
    public programSelected = false;
    public programDetails = [];
    public programId = 0;
    public programList = [];
    public programEndDateTime;
    public programStartDateTime;
    public programBrand;
    public earnRuleArr = [];
    public minimumOrderValue = '';
    public ruleImagePath = '';
    public imageUploading = false;
    public showImageError = false;
    public showSkuFileError = false;
    public selectedProduct = [];
    public selectedSkuFilePath = '';
    public skuIncludeExclude = 'Include';
    public skuFile = '';
    public skuFileName = '';
    public productErrorMsg;
    public programRewardType;
    public selectedStore = [];
    public dataStore: boolean = true;
    public storeErrorMsg: string = "Please select Store";
    public selectStoreVal = false;
    public loading = false;
    public minDate = new Date();
    public disabled = false;
    public descriptionError = false;
    public regionCurrencyError = false;
    public conversionList = [];
    public termsConditionError = false;
    public earnRuleId;
    public earnRuleDetails = [];
    public currencyList = [];
    public showRewardType = 'points';
    public rewardType2 = 'Points';
    public ruleStartTime;
    public ruleEndTime;
    public noOfInviteSent = 0;
    public noOfDays = 0;
    public noOfTxnAfterRegistration = 0;
    public noOfRegistration = 0;
    public skuToggleVal = false;
    public brandOid: number = 0;
    public includeExclude = 'Include';
    public freeproductArry = [];
    public skuLabel = 'Exclude';
    public currentSkuType: boolean = false;
    public currencyOids: any[];
    public disableButton = false;
    public errorList = [];
    public alertMesVal: string;
    public totalCount: [];
    public selectedCount;
    public totalStoreCount;
    public selectedStoreCount = 0;
    public minExpiryDate;
    public limitPerCustFlag = false;
    public programType: any;
    public dailyLimitFlag = false;
    public storeRequired: boolean = false;
    public buttonDisable: boolean = false;
    public fileUrl = localStorage.getItem("fileBaseUrl");

    public freeproductvalues = [];
    freeProductCodeValue: any;

    constructor(private fb: FormBuilder, 
        private http: HttpService,
        private router: Router, 
        private uploadFile: UploadFile, 
        private changeDetectorRef: ChangeDetectorRef,
        public snackBar: MatSnackBar, 
        private activatedRoute: ActivatedRoute,
        public dialog: MatDialog) {
        // this.activatedRoute.params.subscribe(
        //     (param) => {
        //         this.earnRuleId = param.id
        //     }
        // );

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
            this.totalCount = res['totalCount'];
            this.selectedCount = res["totalCount"];
            this.totalStoreCount = res['totalCount'];
        });
    }
    
    ngOnInit() {
        let data = localStorage.getItem('EditEarnID')
        if (data) {
            this.earnRuleId = data;
            this.getRegionCurrency();
            this.getAllTiers();
            localStorage.removeItem('EditEarnID');
        } else {
            sessionStorage.clear();
            this.router.navigate(['/search-programs']);
        }

        // this.earnRuleFormArray();
        // this.descriptionFormArray();
        // this.termsConditionFormArray();
        // this.getCurrencyConversionValue();

    }

    setExpiryDate(endDate: Date) {
        let expiryDate = this.earnRuleFormGroup.get("expiryDate");
        //  this.minExpiryDate = new Date(moment(endDate).add(1, "days").format());
        this.minExpiryDate = new Date(moment(endDate).format());
        expiryDate.setValue('');
        expiryDate.updateValueAndValidity();
    }

    viewEarnRuleById() {
        this.selectedStore = [];
        let request = {
            earnRuleId: this.earnRuleId
        }
        let VIEW_EARN_RULE_BY_ID = environment.APIEndpoint + "api/rpa/earnRule/v1/view";
        this.http.postJson(VIEW_EARN_RULE_BY_ID, request).subscribe(
            (response) => {
                if (response['action'] == 'BILL_AMOUNT' || response['action'] == 'BONUS' || response['action'] == 'TRANSACTION_VALUE' || response['action'] == 'PRODUCT_PURCHASE' || response['action'] == 'FIRST_TRANSACTION') {
                    if (response['skuFilePath'] == null || response['skuFilePath'] == "") {
                        this.selectedProduct = response['skus'];
                    } else {
                        this.skuFile = response['skuFilePath'];
                        if (this.skuFile != '' && this.skuFile != null) {
                            this.skuFileName = response['skuFilePath'].split('/').pop();
                        }
                    }
                }

                if (response['action'] == 'PRODUCT_PURCHASE') {
                    this.skuLabel = 'Include';
                } else {
                    this.skuLabel = response['isExcludeSku'] ? 'Exclude' : 'Include'
                    this.currentSkuType = response['isExcludeSku'];
                }

                if (response['action'] == 'BILL_AMOUNT' || response['action'] == 'BONUS' || response['action'] === 'TRANSACTION_VALUE' || response['action'] === 'PRODUCT_PURCHASE') {
                    for (let s of response['stores']) {
                        this.selectedStore.push(s.storeId);
                    }
                }

                if (this.earnRuleDetails['skus'] != null)
                    this.selectedProduct = this.earnRuleDetails['skus'];
                    this.earnRuleDetails = response;
                    this.ruleImagePath = response['ruleImgPath'];

                if (response["pointExpiryIn"] == "FIXEDDATE") {
                    this.minExpiryDate = new Date(moment(response['endDate']).format());
                }

                if (response['startTime'] != null && response['startTime'] != '') {
                    this.ruleStartTime = new Date(response['startDate']);
                    let startTime = response['startTime'].split(":");
                    this.ruleStartTime.setHours(startTime[0]);
                    this.ruleStartTime.setMinutes(startTime[1]);
                }

                if (response['endTime'] != null && response['endTime'] != '') {
                    this.ruleEndTime = new Date(response['startDate']);
                    let endTime = response['endTime'].split(":");
                    this.ruleEndTime.setHours(endTime[0]);
                    this.ruleEndTime.setMinutes(endTime[1]);
                }

                if (response['rewardType'] == 'POINTS') {
                    this.showRewardType = 'points';
                    this.rewardType2 = "Points"
                } 
                else if (response['rewardType'] == 'STAMP') {
                    this.showRewardType = 'stamps';
                    this.rewardType2 = "Stamps"
                } 
                else {
                    this.rewardType2 = response['rewardType'];
                    this.showRewardType = response['rewardType'];
                }

                this.brandOid = response['programBrandOid'];
                this.getFreeProduct(this.brandOid)
                if (response['isExcludeStore']) {
                    this.includeExclude = 'Exclude';
                } 
                else {
                    this.includeExclude = 'Include';
                }

                this.selectedProgramDetails(response['programId']);
                this.buildEarnRuleForm(response);
                this.earnRuleDetails = response;
                this.toggleVal = response['status'] == 'ONLINE' ? true : false;
                this.statusValue = response['status'];
                this.checkVal(response['action']);
            });
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

    checkLimitPerCustomer(overAllAccurals, limitperCustomer, dailyLimit) {
        if (overAllAccurals == '' && limitperCustomer != '')
            this.limitPerCustFlag = true;
        if (overAllAccurals != '' && limitperCustomer != '') {
            if (parseInt(limitperCustomer) > parseInt(overAllAccurals))
                this.limitPerCustFlag = true;
            else
                this.limitPerCustFlag = false;
        }
        if (dailyLimit != '' && limitperCustomer != '') {
            if (parseInt(dailyLimit) > parseInt(limitperCustomer))
                this.dailyLimitFlag = true;
            else
                this.dailyLimitFlag = false;
        }
    }
    openStoresDialog() {
        const dialogRef = this.dialog.open(selectStoreDialog);
        dialogRef.componentInstance.storeList = this.selectedStore;
        dialogRef.componentInstance.totalCount = this.totalStoreCount;
        dialogRef.componentInstance.brandOid = this.brandOid;
        dialogRef.afterClosed().subscribe(
            (result) => {
                if (result.buttonName === 'SELECT') {
                    this.selectedStore = [];
                    this.selectedStoreCount = result.tableData.length;
                    if (this.selectedStoreCount != 0) {
                        this.storeRequired = false;
                        for (let i = 0; i < result.tableData.length; i++) {
                            let storeId = result.tableData[i].storeOid;
                            this.selectedStore.push(storeId);
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
                        }
                    } else {
                        this.storeErrorMsg = "Please select Store";
                    }
                }
            }
        );
    }

    openSkuDialog(statusValue: boolean) {
        const dialogRef = this.dialog.open(productsDialog);
        this.showSkuFileError = false;
        dialogRef.componentInstance.productList = this.selectedProduct;
        dialogRef.componentInstance.moduleName = "earnRule";
        dialogRef.componentInstance.programOid = this.programId;
        if (!statusValue) {
            dialogRef.componentInstance.toggleVal = false;
            dialogRef.componentInstance.statusValue = 'Include SKU';
            dialogRef.componentInstance.skuIncExc = false;
            dialogRef.componentInstance.excludeToggle = true;
        } else {
            if (this.skuLabel == 'Exclude' || this.skuLabel == 'Upload') {
                dialogRef.componentInstance.toggleVal = true;
                dialogRef.componentInstance.statusValue = 'Exclude SKU';
                dialogRef.componentInstance.skuIncExc = true
            } else {
                dialogRef.componentInstance.toggleVal = false;
                dialogRef.componentInstance.statusValue = "Include SKU";
                dialogRef.componentInstance.skuIncExc = false;
            }

        }
        dialogRef.afterClosed().subscribe(
            (result) => {
                if (result.buttonName != 'undefined') {
                    if (result.buttonName === 'UPLOAD') {
                        this.skuFile = result.skuFileName;
                        if (this.skuFile != '') {
                            this.skuFileName = this.skuFile.split("/").pop();
                        }
                        this.skuToggleVal = result.skuToggleVal;
                        this.selectedProduct = [];
                        if (this.skuToggleVal) {
                            this.skuLabel = 'Exclude';
                        } else {
                            this.skuLabel = 'Include';
                        }
                    }
                    if (result.buttonName === 'SELECT') {
                        this.selectedProduct = [];
                        this.skuToggleVal = result.skuToggleVal,
                            this.selectedCount = result.tableData.length;
                        this.skuFile = "";
                        this.skuFileName = "";
                        if (this.skuToggleVal) {
                            this.skuLabel = 'Exclude';
                        } else {
                            this.skuLabel = 'Include';
                        }
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
            });
    }

    buildEarnRuleForm(populateData) {
        if (populateData['earnRuleId'] != undefined) {
            this.buildForm = true;
            this.earnRuleFormGroup = this.fb.group({
                // selectedProgram: [populateData.programId, Validators.required],
                displayOnHomeScreen: populateData.displayOnHomeScreen,
                isExclusive: populateData.isExclusiveRule,
                earnRuleLocales: this.fb.array([]),
                startDate: [new Date(populateData.startDate), Validators.required],
                endDate: populateData.endDate != null ? [new Date(populateData.endDate), Validators.required] : '',
                perpectual: populateData.isPerpectual,
                startTime: populateData.startTime != null ? this.ruleStartTime : '',
                endTime: populateData.endTime != null ? this.ruleEndTime : '',
                navigateTo: populateData.buttonLinkTo != null ? populateData.buttonLinkTo : '',
                navigationValue: [populateData.buttonLinkToRefer != null ? populateData.buttonLinkToRefer : '', Validators.pattern('[a-zA-Z0-9 ]*')],
                buttonDisplayArr: this.fb.array([]),
                // freeProductType: [null != populateData.freeProductType ? populateData.freeProductType : ''],
                freeProductType: [null != populateData.freeProductType ? populateData.freeProductType : ''],
                actionType: { value: populateData.actionType, disabled: true },
                action: { value: populateData.action, disabled: true },
                noOfInviteSent: [(this.noOfInviteSent != 0 ? this.noOfInviteSent : ''), Validators.pattern('[0-9]{1,6}$')],
                noOfRegistration: [(this.noOfRegistration != 0 ? this.noOfRegistration : ''), Validators.pattern('[0-9]{1,6}$')],
                noOfDays: [(this.noOfDays != 0 ? this.noOfDays : ''), Validators.pattern('[0-9]{1,6}$')],
                noOfTxnAfterRegistration: [(this.noOfTxnAfterRegistration != 0 ? this.noOfTxnAfterRegistration : ''), Validators.pattern('[0-9]{1,6}$')],
                descriptionArray: this.fb.array([]),
                termsConditionArray: this.fb.array([]),
                minimumOrder: [populateData.minimumOrderValue, Validators.pattern('[0-9]{1,6}$')],
                pointsRewaredArray: this.fb.array([]),
                purchaseMinValue: [populateData.minimumOrderValue, this.decimalNumberValidator],
                productPurchaseArray: this.fb.array([]),
                productSaleArray: this.fb.array([]),
                regionTierArray: this.fb.array([]),
                transactionMinOrder: [populateData.minimumOrderValue, this.decimalNumberValidator],
                excludeDeliveryCost: populateData.excludeDeliveryCost,
                excludeTax: populateData.excludeTax,
                showButton: populateData.showButton,
                ruleType: populateData.isExcludeStore,
                pointExpiryIn: [populateData.pointExpiryIn != null ? populateData.pointExpiryIn : ''],
                expiryDate: [populateData.expiryDate != null ? populateData.expiryDate : ''],
                numberOfDays: [populateData.expiryDays != null ? populateData.expiryDays : ''],
                overallAccurals: [populateData.maxOverallAccrual != null ? populateData.maxOverallAccrual : ''],
                overAllLimit: [populateData.overallLimitPerCustomer != null ? populateData.overallLimitPerCustomer : ''],
                dailyLimit: [populateData.dailyCustomerLimit != null ? populateData.dailyCustomerLimit : ''],
                // excludedSku: populateData.isExcludeSku,
                // excludedStore: false,
                // includedProductSku: false,
                // excludedProductStore:false, //Validators.minLength(2)
                allowMultipleStamps: true,
                regionMinAmountArray: this.fb.array([])
            }, { validator: checkValidation });
        }

        this.earnRuleFormArray(populateData['earnRuleLocales']);
        this.descriptionFormArray(populateData['earnRuleLocales']);
        this.termsConditionFormArray(populateData['earnRuleLocales']);
        this.buttonFormArray(populateData['earnRuleLocales'], populateData['showButton']);
        this.populateActionValues(populateData['actionType'], populateData['action']);
        this.checkButtonValidation(populateData.showButton);
        this.validateLimit(populateData['action'], populateData);
        if (populateData.isPerpectual) {
            this.disabled = true;
        }

        if (populateData['action'] == 'TRANSACTION_VALUE' || populateData['action'] == 'BILL_AMOUNT' || populateData['action'] == 'BONUS') {
            this.productSaleFormArray(populateData['earnRuleTransactionPointDefs']);
            this.regionTierArrayForm(populateData['earnRuleTransactionAmountDefs']);
            this.regionMinAmountArrayForm(populateData['earnRuleMinimumOrderValueDef']);
            this.earnRuleFormGroup.patchValue({
                allowMultipleStamps: populateData['earnRuleTransactionAmountDefs'][0]['transactionAmountDefs'][0]['allowMultiple']
            })
            this.skuToggleVal = populateData['isExcludeSku'];
        }
        else if (populateData['action'] == 'PRODUCT_PURCHASE') {
            this.productPurchasedFormArray(populateData['earnRulePurchaseProductDefs']);
            this.skuToggleVal = populateData['isExcludeSku'];
        } else {
            this.pointsRewardedFormArray(populateData['earnRuleOtherDefs']);
        
            if (populateData['action'] == 'INVITE_XX_FRIENDS') {
                this.earnRuleFormGroup.patchValue({
                    noOfInviteSent: populateData['earnRuleOtherDefs'][0]['activityCount']
                })
            }
            if (populateData['action'] == 'REFERRAL_REGISTERED') {
                this.earnRuleFormGroup.patchValue({
                    noOfRegistration: populateData['earnRuleOtherDefs'][0]['activityCount']
                })
            }
            if (populateData['action'] == 'ACTIVE_AFTER_XX_DAYS') {
                this.earnRuleFormGroup.patchValue({
                    noOfInviteSent: populateData['earnRuleOtherDefs'][0]['activityCount']
                })
            }
            if (populateData['action'] == 'XX_TRANSACTIONS_AFTER_REGISTRATION') {
                this.earnRuleFormGroup.patchValue({
                    noOfTxnAfterRegistration: populateData['earnRuleOtherDefs'][0]['activityCount']
                })
            }
          
        }
        if (populateData['action'] == 'FIRST_TRANSACTION') {
            this.skuToggleVal = populateData['isExcludeSku'];
        }
        if (populateData['actionType'] == 'PROGRAM_REFERRAL' && populateData['action'] == 'INVITED_USER_REGISTERED_REGION' 
        || populateData['actionType'] == 'PROGRAM_REFERRAL' && populateData['action'] == 'INVITED_USER_TRANSACTED_REGION') {
            this.countryData = true;
            this.prePopulatecountryOid = populateData.countryOid;
            this.getCountryList(this.prePopulatecountryOid)
        }
        else{
            this.countryData = false;
        }
    }

    validateLimit(action: any, earnRuleData: any) {
        let overallLimit = this.earnRuleFormGroup.get('overallAccurals');
        let customerOverallLimit = this.earnRuleFormGroup.get('overAllLimit');
        let dailyLimit = this.earnRuleFormGroup.get('dailyLimit');
        let type: boolean = false;
        if (earnRuleData['programType'] == 'BASE' && (action == 'TRANSACTION_VALUE' || action == 'BILL_AMOUNT' || action == 'BONUS') ) {
            type = true;
        }
        if (action !== 'PRODUCT_PURCHASE' && !type) {
            overallLimit.setValidators(Validators.required);
            overallLimit.updateValueAndValidity();
            customerOverallLimit.setValidators(Validators.required);
            customerOverallLimit.updateValueAndValidity();
            dailyLimit.setValidators(Validators.required)
            dailyLimit.updateValueAndValidity();
        }
    }
    public toggleIncludeExclude(event) {
        if (event.checked == false) {
            this.includeExclude = 'Include';
            this.earnRuleFormGroup.get('ruleType').setValue(false);
            this.storeRequired = false;
        } else {
            this.includeExclude = 'Exclude';
            this.earnRuleFormGroup.get('ruleType').setValue(true);
            this.storeRequired = false;
        }

    }

    public regionMinAmountArrayForm(earnRuleMinimumOrderValueDef) {
        this.tierFlag = true;
        const control = <FormArray>this.earnRuleFormGroup.controls['regionMinAmountArray'];
        if (undefined != earnRuleMinimumOrderValueDef && null != earnRuleMinimumOrderValueDef) {
            for (let currency of this.regionCurrencies) {
                var amount = 0;

                for (let minAmount of earnRuleMinimumOrderValueDef) {
                    if (currency.regionId == minAmount.regionId) {
                        amount = minAmount.minimumOrderAmt;
                    }
                }

                let arr = this.fb.group({
                    [currency.regionId]: amount
                });
                control.push(arr);
            }
        } else {
            var str = '';
            for (let currency of this.regionCurrencies) {
                let arr = this.fb.group({
                    [currency.regionId]: str
                });
                control.push(arr);
            }
        }

    }

    public earnRuleFormArray(earnRuleLocales) {
        const control = <FormArray>this.earnRuleFormGroup.controls['earnRuleLocales'];
        for (let en of earnRuleLocales) {
            let newForm = this.fb.group({
                ruleName: [en.ruleName, Validators.required],
            });
            control.push(newForm);
            this.alignCss.push(en.languageDirection == 'RTL' ? 'text-right' : '');
            this.rightPanel.push(en.languageDirection == 'RTL' ? 'right-panel' : '');

        }
    }

    public buttonFormArray(earnRuleLocales, showButton) {
        if (showButton) {
            this.languageList = [];
            const control = <FormArray>this.earnRuleFormGroup.controls['buttonDisplayArr'];
            for (let en of earnRuleLocales) {
                let newForm = this.fb.group({
                    buttonName: [en.buttonLabel, Validators.pattern('[a-zA-Z0-9\u0600-\u06FF ]*')],
                });
                control.push(newForm);
                this.languageList.push(en.languageName);
                this.alignCss.push(en.languageDirection == 'RTL' ? 'text-right' : '');
                this.rightPanel.push(en.languageDirection == 'RTL' ? 'right-panel' : '');

            }
        } else {
            const control = <FormArray>this.earnRuleFormGroup.controls['buttonDisplayArr'];
            for (let ln of this.languageList) {
                let newForm = this.fb.group({
                    buttonName: ['', Validators.pattern('[a-zA-Z0-9\u0600-\u06FF ]*')],
                });
                control.push(newForm);
                this.alignCss.push(ln.direction == 'RTL' ? 'text-right' : '');
                this.rightPanel.push(ln.languageDirection == 'RTL' ? 'right-panel' : '');

            }
        }

    }

    public descriptionFormArray(earnRuleLocales) {
        const control = <FormArray>this.earnRuleFormGroup.controls['descriptionArray'];
        for (let en of earnRuleLocales) {
            let newForm = this.fb.group({
                description: [en.ruleDesc, Validators.required],
            });
            control.push(newForm);
            this.alignCss.push(en.languageDirection == 'RTL' ? 'text-right' : '');
            this.rightPanel.push(en.languageDirection == 'RTL' ? 'right-panel' : '');
        }
    }

    public termsConditionFormArray(earnRuleLocales) {
        const control = <FormArray>this.earnRuleFormGroup.controls['termsConditionArray'];
        for (let en of earnRuleLocales) {
            let newForm = this.fb.group({
                termsCondition: [en.termsAndCondition],
            });
            control.push(newForm);
            this.alignCss.push(en.languageDirection == 'RTL' ? 'text-right' : '');
            this.rightPanel.push(en.languageDirection == 'RTL' ? 'right-panel' : '');
        }
    }

    public pointsRewardedFormArray(earnRuleOtherDefs) {
        console.log(earnRuleOtherDefs);
        const control = <FormArray>this.earnRuleFormGroup.controls['pointsRewaredArray'];
        for (let t of earnRuleOtherDefs) {
            let newForm = this.fb.group({
                tierId: t.tierId,
                points: [t.noOfRewards, Validators.pattern('[0-9]{1,3}$')],
            });
            control.push(newForm);
            // this.alignCss.push(ln.direction == 'RTL' ? 'text-right' : '');

        }
    }

    public productPurchasedFormArray(earnRulePurchaseProductDefs) {
        const control = <FormArray>this.earnRuleFormGroup.controls['productPurchaseArray'];
        for (let t of earnRulePurchaseProductDefs) {
            let newForm = this.fb.group({
                tierId: t.tierId,
                noOfPurchased: [t.noOfPurchase, Validators.pattern('[0-9]{1,3}$')],
                noOfPoints: [t.noOfRewards, Validators.pattern('[0-9]{1,3}$')],

            });
            control.push(newForm);
            // this.alignCss.push(ln.direction == 'RTL' ? 'text-right' : '');

        }
    }

    public productSaleFormArray(earnRuleTransactionPointDefs) {
        const control = <FormArray>this.earnRuleFormGroup.controls['productSaleArray'];

        for (let tier of this.tierList) {
            var pointDef;
            for (let trans of earnRuleTransactionPointDefs) {
                if (tier.tierId == trans.tierId) {
                    pointDef = trans;
                    break;
                }
            }
            if (pointDef != null) {
                let newForm = this.fb.group({
                    tierId: pointDef.tierId,
                    sale: [(pointDef.transactionPointDefs[0].markupType == 'SALE' ? pointDef.transactionPointDefs[0].noOfRewards : pointDef.transactionPointDefs[1].noOfRewards), Validators.pattern('[0-9]{1,3}$')],
                    noSale: [(pointDef.transactionPointDefs[1].markupType == 'NON_SALE' ? pointDef.transactionPointDefs[1].noOfRewards : pointDef.transactionPointDefs[0].noOfRewards), Validators.pattern('[0-9]{1,3}$')],
                });
                control.push(newForm);
            } else {
                let newForm = this.fb.group({
                    tierId: tier.tierId,
                    sale: ['', Validators.pattern('[0-9]{1,3}$')],
                    noSale: ['', Validators.pattern('[0-9]{1,3}$')],
                });
                control.push(newForm);
            }
        }

    }

    public regionTierArrayForm(earnRuleTransactionAmountDefs) {
        this.tierFlag = true;
        const control = <FormArray>this.earnRuleFormGroup.controls['regionTierArray'];

        for (let t = 0; t < this.tierList.length; t++) {
            //let tier = this.tierList[t];
            let arr = this.fb.group({
                tierId: [this.tierList[t].tierId],
                regionCurrencyArr: this.fb.array([])
            });
            control.push(arr);
            this.regionCurrencyForm(control.controls[t], earnRuleTransactionAmountDefs[t].transactionAmountDefs);
        }
    }

    public regionCurrencyForm(tierControl, transactionAmountDefs) {
        const array = <FormArray>tierControl.controls['regionCurrencyArr'];
        var amount = 0;

        for (let currency of this.regionCurrencies) {
            amount = 0;

            for (let amountDef of transactionAmountDefs) {

                if (amountDef.regionId == currency.regionId) {
                    amount = amountDef.spendAmount;
                    break;
                }
            }

            let arr = this.fb.group({
                [currency.regionId]: amount
            });

            array.push(arr);
        }
    }

    populateActionValues(actionType, populateAction) {
        this.selectAction = [];
        this.freeproductArry = [];
        this.clearValidation();

        if (actionType == 'PURCHASE') {
            this.selectAction.push({
                name: 'Transaction Value',
                value: 'TRANSACTION_VALUE'
            },
                {
                    name: 'Product Purchase',
                    value: 'PRODUCT_PURCHASE'
                },
                {
                    name: 'Bonus',
                    value: 'BONUS'
                });

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

        // if(actionType == 'TRANSACTION'){
        //     this.selectAction.push({
        //         name: 'Bill Amount',
        //         value: 'BILL_AMOUNT'
        //     });
        // }
        
        if (actionType == 'PROGRAM_REFERRAL') {
            this.selectAction.push(
                {
                    name: 'Invited user registered',
                    value: 'REFERRAL_REGISTERED'
                }, 
            //     {
            //     name: 'Invite Sent',
            //     value: 'INVITE_XX_FRIENDS'
            // },
                // {
                //     name: 'Referral Registered',
                //     value: 'REFERRAL_REGISTERED'
                // },
             
            //     {
            //         name: 'Invited user registered',
            //         value: 'REFERRAL_REGISTERED'
            //     }, 
            //{
            //     name: 'Refer customer to Brand',
            //     value: 'REFER_USER_TO_BRAND'

            // }, 
            // {
            //     name: 'Refer customer to Event',
            //     value: 'REFER_USER_TO_EVENT'
            // }, {
            //     name: 'Register on Invitation',
            //     value: 'REGISTER_ON_INVITATION'
            // },
            //     {
            //         name: 'Invited User Registered Region',
            //         value: 'INVITED_USER_REGISTERED_REGION'
            //     },
            //     {
            //         name: 'Invited User Transacted Region',
            //         value: 'INVITED_USER_TRANSACTED_REGION'
            //     },
                {
                    name: '1st Transaction after registered.',
                    value: 'FIRST_TRANSACTION'
                })
            checkValidation(this.earnRuleFormGroup);

        }
        if (actionType == 'PROFILE_ACTIVITY') {
            this.selectAction.push({
                name: 'Registration',
                value: 'REGISTERED'
            },
                {
                    name: 'XX Transaction After Registration',
                    value: 'XX_TRANSACTIONS_AFTER_REGISTRATION'
                },
                {
                    name: 'Active After XX Days',
                    value: 'ACTIVE_AFTER_XX_DAYS'
                },
                {
                    name: 'Complete Profile',
                    value: 'COMPLETE_PROFILE'
                },
                {
                    name: 'Birthday',
                    value: 'BIRTHDAY'
                },
                {
                    name: 'Anniversary',
                    value: 'ANNIVERSARY'
                },
                {
                    name: 'Validate Email',
                    value: 'VALIDATE_EMAIL'
                },
                {
                    name: 'Upload Profile Picture',
                    value: 'UPLOAD_PROFILE_PICTURE'
                })
            checkValidation(this.earnRuleFormGroup);

        }
        if (populateAction != '') {
            this.earnRuleFormGroup.patchValue({
                action: populateAction
            })
        }


    }

    getAllTiers() {
        let GET_ALL_TIERS = environment.APIEndpoint + "api/rpa/tier/v1/qualification/list"
        this.http.getJson(GET_ALL_TIERS)
            .subscribe((response) => {
                this.tierList = response;
            });
    }

    getProgramsList() {
        this.http.getJson(environment.APIEndpoint + 'api/rpa/loyalty/program/v1/get/programs')
            .subscribe(
                (response) => {
                    this.programList = response;
                },
                (error) => {
                });
    }

    selectedProgramDetails(id: number) {
        this.programSelected = true;
        this.programId = id;
        let body = {
            programId: id
        }

        let GET_PROGRAM_DATA = environment.APIEndpoint + "api/rpa/loyalty/program/v1/view";
        this.http.postJson(GET_PROGRAM_DATA, body)
            .subscribe(
                (response) => {
                    this.programDetails = response;
                    this.programType = response['programType'];
                    if (this.programDetails['rewardType'] == 'POINTS')
                        this.programRewardType = 'POINTS';
                    else if (this.programDetails['rewardType'] == 'STAMPS')
                        this.programRewardType = 'STAMPS';
                    else
                        this.programRewardType = this.programDetails['rewardType'];

                    if (response['startTime'] != null) {
                        this.programStartDateTime = new Date(response['startDate']);
                        let startTime = response['startTime'].split(":");
                        this.programStartDateTime.setHours(startTime[0]);
                        this.programStartDateTime.setMinutes(startTime[1]);
                    }
                    if (response['endDate'] != null) {

                        if (response['endTime'] != null) {
                            this.programEndDateTime = new Date(response['endDate']);
                            let endTime = response['endTime'].split(":");
                            this.programEndDateTime.setHours(endTime[0]);
                            this.programEndDateTime.setMinutes(endTime[1]);
                        }
                    }
                    if (this.programDetails['brand'] != null) {
                        let brand = this.programDetails['brand'];
                        if (brand == null) {
                            this.programBrand = "";
                        } else {
                            this.programBrand = brand.brandName
                        }
                    }

                },
                (error) => {
                });
    }

    public countryList;
    Countries: Country[] = [];
    countryCtrl = new FormControl();
    filteredcountries: Observable<Country[]>;

    getCountryList(prePopulatecountryOid) {
        let GET_ALL_COUNTRIES = environment.APIEndpoint + "api/rpa/client/onboarding/v1/get/countriesByRegions";
        this.http.getJson(GET_ALL_COUNTRIES)
            .subscribe((response) => {
                this.countryList = response;
                for (let i = 0; i <= this.countryList.length - 1; i++) {
                    let objMallkey = {
                        countryId: this.countryList[i]['countryId'],
                        countryName: this.countryList[i]['countryName'],
                    }
                    this.Countries.push(objMallkey);
                }
                this.filteredcountries = this.countryCtrl.valueChanges
                    .pipe(
                        startWith(''),
                        map(country => country ? this._filterCountries(country) : this.Countries.slice())
                    );
                    for (let j = 0; j < this.Countries.length; j++) {
                        if (this.Countries[j].countryId == this.prePopulatecountryOid) {
                          this.countryCtrl.setValue(this.Countries[j].countryName);
                        }
                      }
            },
                (error) => {               
                 });
    }
    private _filterCountries(value: string): Country[] {
        const filterValue = value.toLowerCase();
        return this.Countries.filter(country => country.countryName.toLowerCase().indexOf(filterValue) === 0);
    }

    public countryId;

    getAllcountry(countryId) {
        this.prePopulatecountryOid = countryId;
    }




    updateEarnRule(formData) {
        // this.countryCtrl = new FormControl(null,[forbiddenNamesValidator(this.countryList)])
        this.buttonDisable = true;
        this.earnRuleArr = [];
        let earnRuleTransactionPoint = [];
        let activityCount = '';
        let earnPointRewards = [];
        let earnRulePurchaseProduct = [];
        let earnRuleTransactionAmount = [];
        let programId;
        this.loading = true;
        this.descriptionError = false;
        this.termsConditionError = false;
        let termsError;
        let descError;
        let minimumTxnAmounts = [];
        let storeError = false;
        this.regionCurrencyError = false;
        for (let d of formData.descriptionArray) {
            if (d.description == '') {
                descError = true;
            }
        }
        for (let d of formData.termsConditionArray) {
            if (d.termsCondition == '') {
                termsError = true;
            }
        }

        if (this.selectedStore.length == 0 && this.includeExclude == 'Include' && (this.earnRuleDetails['action'] === 'BILL_AMOUNT' || this.earnRuleDetails['action'] === 'BONUS' || this.earnRuleDetails['action'] === 'TRANSACTION_VALUE' || this.earnRuleDetails['action'] === 'PRODUCT_PURCHASE')) {
            storeError = true;
        }


        if (this.earnRuleDetails['action'] === 'TRANSACTION_VALUE' || this.earnRuleDetails['action'] === 'BONUS' || this.earnRuleDetails['action'] === 'BILL_AMOUNT') {

            for (let cn of formData.regionTierArray[1].regionCurrencyArr) {
                var key = Object.keys(cn)
                if (cn[key[0]] == '') {
                    this.regionCurrencyError = true;
                }
            }

            for (let minAmount of formData.regionMinAmountArray) {
                var key = Object.keys(minAmount);
                if (null == minAmount[key[0]] || minAmount[key[0]] == "") {
                    //  this.regionCurrencyError = true;
                }
            }

        }
        let fileError: boolean = false;
        if ((null == this.skuFile || this.skuFile == "") && this.earnRuleDetails['action'] === 'PRODUCT_PURCHASE' && this.selectedProduct.length == 0) {
            fileError = true;
            this.showSkuFileError = true;
        }
        if (this.earnRuleFormGroup.invalid || this.ruleImagePath === '' || descError || termsError || fileError || storeError) {
            this.showImageError = this.ruleImagePath === '' ? true : false;
            this.descriptionError = descError;
            this.termsConditionError = termsError;
            this.storeRequired = storeError;
            this.buttonDisable = false;
        }
        else {
            programId = formData.selectedProgram
            formData.earnRuleLocales.forEach((rule, index) => {
                let locale = {
                    languageId: this.earnRuleDetails['earnRuleLocales'][index].languageId,
                    ruleName: rule.ruleName,
                    ruleDesc: formData.descriptionArray[index].description,
                    termsAndCondition: formData.termsConditionArray[index].termsCondition,
                    buttonLabel: formData.showButton == true ? formData.buttonDisplayArr[index].buttonName : ''
                }
                this.earnRuleArr.push(locale);
            })
            if (this.earnRuleDetails['action'] === 'TRANSACTION_VALUE' || this.earnRuleDetails['action'] === 'BONUS'  || this.earnRuleDetails['action'] === 'BILL_AMOUNT') {
                this.minimumOrderValue = formData.transactionMinOrder;
                formData.productSaleArray.forEach((product, index) => {
                    earnRuleTransactionPoint.push({
                        markupType: 'SALE',
                        regionId: '',
                        tierId: product.tierId,
                        noOfRewards: product.sale,
                    })
                    earnRuleTransactionPoint.push({
                        markupType: 'NON_SALE',
                        regionId: '',
                        tierId: product.tierId,
                        noOfRewards: product.noSale,
                    })
                });

                for (let t of formData.regionTierArray) {
                    for (let i = 0; i < t.regionCurrencyArr.length; i++) {
                        var key = Object.keys(t.regionCurrencyArr[i])
                        if (t.regionCurrencyArr[i][key[0]] != '') {
                            earnRuleTransactionAmount.push(
                                {
                                    regionId: parseInt(key[0]),//int
                                    tierId: parseInt(t.tierId),//int
                                    spendAmount: t.regionCurrencyArr[i][key[0]],//int
                                    markupType: '',
                                    isAllowMultiple: formData.allowMultipleStamps,
                                })
                        }
                        // else{
                        //     this.regionError=true;
                        // }
                    }
                }

                for (let minAmount of formData.regionMinAmountArray) {
                    var key = Object.keys(minAmount);
                    minimumTxnAmounts.push({
                        regionId: parseInt(key[0]),
                        minimumOrderAmt: parseInt(minAmount[key[0]])
                    })
                }
            }
            if (this.earnRuleDetails['action'] === 'PRODUCT_PURCHASE') {
                this.minimumOrderValue = formData.purchaseMinValue;
                formData.productPurchaseArray.forEach((product, index) => {
                    earnRulePurchaseProduct.push({
                        tierId: product.tierId,
                        noOfPurchase: product.noOfPurchased,
                        noOfRewards: product.noOfPoints,
                    })

                })
            }
            if (this.earnRuleDetails['action'] === 'FIRST_TRANSACTION') {
                this.minimumOrderValue = formData.minimumOrder;
            }
            if (this.earnRuleDetails['action'] == 'INVITE_XX_FRIENDS') {
                activityCount = formData.noOfInviteSent;
            }
            if (this.earnRuleDetails['action'] == 'REFERRAL_REGISTERED') {
                activityCount = formData.noOfRegistration;
            }
            if (this.earnRuleDetails['action'] == 'ACTIVE_AFTER_XX_DAYS') {
                activityCount = formData.noOfDays
            }
            if (this.earnRuleDetails['action'] == 'XX_TRANSACTIONS_AFTER_REGISTRATION') {
                activityCount = formData.noOfTxnAfterRegistration
            }
            if (this.earnRuleDetails['action'] !== 'PRODUCT_PURCHASE' || this.earnRuleDetails['action'] !== 'TRANSACTION_VALUE' || this.earnRuleDetails['action'] === 'BONUS'  || this.earnRuleDetails['action'] !== 'BILL_AMOUNT') {
                formData.pointsRewaredArray.forEach((reward, index) => {
                    earnPointRewards.push({
                        tierId: reward.tierId,
                        activityCount: activityCount,
                        noOfRewards: reward.points
                    });
                });
            }

            let storeIncExcl: boolean = false;
            if (this.selectedStore.length == 0) {
                storeIncExcl = true;
            } else {
                storeIncExcl = formData.ruleType;
            }

            //let producttype = null;
            // if (null != formData.freeProductType && formData.freeProductType != '') {
            //     producttype = formData.freeProductType;
            // }

            let producttype = null;
            if (null != formData.freeProductType && formData.freeProductType != '') {
                producttype = formData.freeProductType;
            }

            let request = {
                earnRuleId: this.earnRuleId,
                status: this.statusValue,
                programId: this.programDetails['programId'],
                startDate: formData.startDate != '' ? moment(formData.startDate).format('YYYY-MM-DD') : '',
                endDate: formData.endDate != '' ? moment(formData.endDate).format('YYYY-MM-DD') : '',
                isPerpectual: formData.perpectual,
                isExcludeStore: storeIncExcl,
                startTime: formData.startTime != '' ? moment(formData.startTime).format('HH:mm:ss') : null,
                endTime: formData.endTime != '' ? moment(formData.endTime).format('HH:mm:ss') : null,
                displayOnHomeScreen: formData.displayOnHomeScreen,
                isExclusiveRule: formData.isExclusive,
                ruleDesc: formData.descriptionArray[0].description,
                rewardType: this.programRewardType,
                ruleImgPath: this.ruleImagePath,
                actionType: this.earnRuleDetails['actionType'],
                action: this.earnRuleDetails['action'],
                countryOid: this.prePopulatecountryOid != undefined ? this.prePopulatecountryOid: null,
                minimumOrderValue: this.minimumOrderValue,
                excludeDeliveryCost: formData.excludeDeliveryCost,
                excludeTax: formData.excludeTax,
                isExcludeSku: formData.action === 'PRODUCT_PURCHASE' ? false : this.skuToggleVal,
                skuFilePath: this.skuFile,
                showButton: formData.showButton,
                buttonLinkTo: formData.navigateTo,
                buttonLinkToRefer: formData.navigationValue,
                earnRuleLocales: this.earnRuleArr,
                storeIds: this.selectedStore,
                skus: this.selectedProduct,
                earnRuleTransactionPointDefs: earnRuleTransactionPoint,
                earnRuleTransactionAmountDefs: earnRuleTransactionAmount,
                earnRulePurchaseProductDefs: earnRulePurchaseProduct,
                earnRuleOtherDefs: earnPointRewards,
                earnRuleMinimumOrderValueDef: minimumTxnAmounts,
                // freeProductType: producttype,
                freeProductType: producttype,
                maxOverallAccrual: formData.overallAccurals,
                overallLimitPerCustomer: formData.overAllLimit,
                dailyCustomerLimit: formData.dailyLimit,
                pointExpiryIn: formData.pointExpiryIn == '' ? null : formData.pointExpiryIn,
                expiryDate: formData.expiryDate == '' ? null : moment(formData.expiryDate).format('YYYY-MM-DD'),
                expiryDays: formData.numberOfDays,//int
                isEndOfMonth: false,
            }
            let CREATE_EARN_RULE = environment.APIEndpoint + "api/rpa/earnRule/v1/update";

            if (!this.regionCurrencyError)
                this.http.postJson(CREATE_EARN_RULE, request)
                    .subscribe(
                        (response) => {
                            this.snackBar.openFromComponent(SnackBarComponent, {
                                duration: 1500,
                                data: {
                                    status: "success",
                                    message: "Earn rule has been updated successfully"
                                }
                            });
                            this.loading = false;
                            sessionStorage.clear();
                            localStorage.setItem('ViewID',this.programDetails['programId']);
                            this.router.navigate(['/view-programs'])
                            // this.router.navigate(['/view-programs/' + this.programDetails['programId']]);
                        },
                        err => {
                            this.loading = false;
                            this.buttonDisable = false;
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

    checkPointExpiryValidation(pointExpiryIn) {

        let expiryDate = this.earnRuleFormGroup.get('expiryDate');
        let numberOfDays = this.earnRuleFormGroup.get('numberOfDays');
        if (pointExpiryIn == 'FIXEDDATE') {
            numberOfDays.markAsPristine;
            numberOfDays.clearValidators();
            numberOfDays.setValue('');
            numberOfDays.updateValueAndValidity();
            this.minExpiryDate = new Date(moment(new Date(this.earnRuleFormGroup.get("endDate").value)).format());
        } if (pointExpiryIn == 'NOOFDAYS') {
            expiryDate.markAsPristine;
            expiryDate.clearValidators();
            expiryDate.setValue('');
            expiryDate.updateValueAndValidity();
        }
    }

    public uploadImage(event: FileList) {
        this.imageUploading = true;
        if (event[0].size < 1000000) {
            this.uploadFile.upload(event.item(0), 'program', 'images')
                .subscribe((response) => {
                    this.ruleImagePath = response['message'];
                    this.imageUploading = false;
                    this.showImageError = false;
                    this.uploadImgElRef.nativeElement.value = ''

                    this.snackBar.openFromComponent(SnackBarComponent, {
                        duration: 1500,
                        data: {
                            status: "success",
                            message: "Image successfully uploaded"
                        }
                    });
                }, err => {
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
                                message: "Internal server error"
                            }
                        });
                    }

                }
                );
        } else {
            this.imageUploading = false;
            this.snackBar.openFromComponent(SnackBarComponent, {
                duration: 10000,
                data: {
                    status: "failure",
                    message: "Max upload file size is 1Mb"
                }
            });
        }


    }

    public removeImage(index) {
        this.ruleImagePath = "";


    }

    public removeSku() {
        this.skuFile = '';
        this.skuFileName = "";
        this.skuToggleVal = true;
        this.skuLabel = 'Upload';
    }

    public toggleStatus(event) {
        if (event.checked == true) {
            this.statusValue = 'ONLINE';
        } else {
            this.statusValue = 'OFFLINE';
        }
    }

    clearValidation() {
        let noOfDays = this.earnRuleFormGroup.get('noOfDays');
        let noOfTxnAfterRegistration = this.earnRuleFormGroup.get('noOfTxnAfterRegistration');
        let noOfInviteSent = this.earnRuleFormGroup.get('noOfInviteSent');
        let noOfRegistration = this.earnRuleFormGroup.get('noOfRegistration');
        noOfInviteSent.setValue('');
        noOfRegistration.setValue('');
        noOfDays.setValue('');
        noOfTxnAfterRegistration.setValue('');
        noOfInviteSent.clearValidators();
        noOfRegistration.clearValidators();
        noOfDays.clearValidators();
        noOfTxnAfterRegistration.clearValidators();

    }

    endDateAction(perpectual) {
        let endDateControl = this.earnRuleFormGroup.get('endDate');
        let endTimeControl = this.earnRuleFormGroup.get('endTime');
        let pointExpiryType = this.earnRuleFormGroup.get("pointExpiryIn");
        let expiryDate = this.earnRuleFormGroup.get("expiryDate");
        if (perpectual == true) {
            endDateControl.setValue("");
            //    endTimeControl.setValue("");
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

    public getCurrencyConversionValue(currencyOids: any) {

        let GET_ALL_CURRENCY_CONVERSION_VALUE = environment.APIEndpoint + "api/rpa/master/currencyconversion/v1/get/conversionRate?currencyOids=" +
            currencyOids;
        this.http.getJson(GET_ALL_CURRENCY_CONVERSION_VALUE)
            .subscribe((response) => {
                this.conversionList = response;
            });
    }

    public autoPopulateCurrencyValue(column, row, baseCurValue) {
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
                            const array = <FormArray>column.controls['regionCurrencyArr'];
                            if (conversion.currencyCode === this.regionCurrencies[i].currencyCode) {
                                let conversionValue = conversion.conversionValue * parseFloat(baseCurValue)
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

                    this.regionCurrencyError = false;
                } else {
                    if (row == 0 && baseCurValue != null && baseCurValue != '') {

                        for (let i = 0; i < this.regionCurrencies.length; i++) {
                            for (let conversion of this.conversionList) {
                                const array = <FormArray>this.earnRuleFormGroup.controls['regionMinAmountArray'];

                                if (conversion.currencyCode === this.regionCurrencies[i].currencyCode && i != 0) {
                                    let conversionValue = conversion.conversionValue * parseFloat(baseCurValue);
                                    if (conversionValue.toFixed(0).length > 19) {
                                        this.errorList.push(this.regionCurrencies[i].currencyCode);
                                        conversionValue = 0;
                                    }
                                    array.at(i).patchValue({
                                        //    [this.regionCurrencies[i].regionId]: [conversionValue.toFixed(2)]
                                        [this.regionCurrencies[i].regionId]: conversionValue.toFixed(3)
                                    });
                                    array.markAsPristine;
                                }
                            }
                        }
                    }
                }
            }
        }
        if (this.errorList.length > 0) {
            this.alertMesVal = this.errorList.toString() + " values exceeds limit";
            this.alertLengthPopup();
        }
    }

    checkFormArrayValidation(action) {
        this.clearFormArrayValidation();
        if (action == 'TRANSACTION_VALUE' || action == 'BONUS' || action == 'BILL_AMOUNT') {
            let productSaleArray = this.earnRuleFormGroup.get('productSaleArray') as FormArray;
            for (let i = 0; i < productSaleArray.controls.length; i++) {
                let sale = productSaleArray.controls[i].get('sale');
                let noSale = productSaleArray.controls[i].get('noSale');
                sale.setValidators([Validators.required, Validators.pattern('[0-9]{1,3}$')]);
                noSale.setValidators([Validators.required, Validators.pattern('[0-9]{1,3}$')]);
                sale.updateValueAndValidity();
                noSale.updateValueAndValidity();
            }
        }
        else if (action == 'PRODUCT_PURCHASE') {
            let producttype = this.earnRuleFormGroup.get('freeProductType');
            producttype.setValidators([Validators.required]);
            producttype.updateValueAndValidity();

            let productPurchaseArray = this.earnRuleFormGroup.get('productPurchaseArray') as FormArray;
            for (let i = 0; i < productPurchaseArray.controls.length; i++) {
                let noOfPurchased = productPurchaseArray.controls[i].get('noOfPurchased');
                let noOfPoints = productPurchaseArray.controls[i].get('noOfPoints');
                noOfPurchased.setValidators([Validators.required, Validators.pattern('[0-9]{1,3}$')]);
                noOfPoints.setValidators([Validators.required, Validators.pattern('[0-9]{1,3}$')]);
                noOfPurchased.updateValueAndValidity();
                noOfPoints.updateValueAndValidity();
            }
        } 
        else {
            let pointRewardArr = this.earnRuleFormGroup.get('pointsRewaredArray') as FormArray;
            for (let i = 0; i < pointRewardArr.controls.length; i++) {
                let points = pointRewardArr.controls[i].get('points');
                points.setValidators([Validators.required, Validators.pattern('[0-9]{1,3}$')]);
                points.updateValueAndValidity();
            }
        }
        let type: boolean = false;
        if (this.programType == 'BASE' && (action == 'TRANSACTION_VALUE' || action == 'BONUS' || action == 'BILL_AMOUNT')) {
            type = true;
        }
        if (action !== 'PRODUCT_PURCHASE' && action != 'FIRST_TRANSACTION' && !type) {
            let overallaccural = this.earnRuleFormGroup.get('overallAccurals');
            let overallPerCustomer = this.earnRuleFormGroup.get('overAllLimit');
            let dailyLimit = this.earnRuleFormGroup.get('dailyLimit');

            // overallaccural.setValidators(Validators.required);
            // overallaccural.updateValueAndValidity();
            // overallPerCustomer.setValidators(Validators.required);
            // overallPerCustomer.updateValueAndValidity();
            // dailyLimit.setValidators(Validators.required);
            // dailyLimit.updateValueAndValidity();
        }
    }


    
    checkVal(action){
        if(action == 'FIRST_TRANSACTION'){
        let overallaccural = this.earnRuleFormGroup.get('overallAccurals');
        let overallPerCustomer = this.earnRuleFormGroup.get('overAllLimit');
        let dailyLimit = this.earnRuleFormGroup.get('dailyLimit');
        overallaccural.clearValidators();
        overallaccural.updateValueAndValidity();
        overallPerCustomer.clearValidators();
        overallPerCustomer.updateValueAndValidity();
        dailyLimit.clearValidators();
        dailyLimit.updateValueAndValidity();
        }
    }

    clearFormArrayValidation() {
        let pointRewardArr = this.earnRuleFormGroup.get('pointsRewaredArray') as FormArray;
        for (let i = 0; i < pointRewardArr.controls.length; i++) {
            let points = pointRewardArr.controls[i].get('points');
            points.setValue('');
            points.clearValidators();
            points.updateValueAndValidity();
        }

        // clear the validation for free product
        // let producttype = this.earnRuleFormGroup.get('freeProductType');
        // producttype.clearValidators();
        // producttype.updateValueAndValidity();

        let producttype = this.earnRuleFormGroup.get('freeProductType');
        producttype.clearValidators();
        producttype.updateValueAndValidity();

        //clear Validation on productPurchaseArray
        let productPurchaseArray = this.earnRuleFormGroup.get('productPurchaseArray') as FormArray;
        for (let i = 0; i < productPurchaseArray.controls.length; i++) {
            let noOfPurchased = productPurchaseArray.controls[i].get('noOfPurchased');
            let noOfPoints = productPurchaseArray.controls[i].get('noOfPoints');
            noOfPurchased.setValue('');
            noOfPoints.setValue('');
            noOfPurchased.clearValidators();
            noOfPoints.clearValidators();
            noOfPurchased.updateValueAndValidity();
            noOfPoints.updateValueAndValidity();
        }

        //clear Validation on productSaleArray

        let productSaleArray = this.earnRuleFormGroup.get('productSaleArray') as FormArray;
        for (let i = 0; i < productSaleArray.controls.length; i++) {
            let sale = productSaleArray.controls[i].get('sale');
            let noSale = productSaleArray.controls[i].get('noSale');
            sale.setValue('');
            noSale.setValue('');
            sale.clearValidators();
            noSale.clearValidators();
            sale.updateValueAndValidity();
            noSale.updateValueAndValidity();
        }

        //Limit Validation 
        let overallaccural = this.earnRuleFormGroup.get('overallAccurals');
        let overallPerCustomer = this.earnRuleFormGroup.get('overAllLimit');
        let dailyLimit = this.earnRuleFormGroup.get('dailyLimit');
        overallaccural.setValue('');
        overallaccural.clearValidators();
        overallaccural.updateValueAndValidity();
        overallPerCustomer.setValue('');
        overallPerCustomer.clearValidators();
        overallPerCustomer.updateValueAndValidity();
        dailyLimit.setValue('');
        dailyLimit.clearValidators();
        dailyLimit.updateValueAndValidity();

    }

    checkButtonValidation(value) {
        let navigateTo = this.earnRuleFormGroup.get('navigateTo');
        let navigationValue = this.earnRuleFormGroup.get('navigationValue');
        let buttonDisplayArr = this.earnRuleFormGroup.get('buttonDisplayArr') as FormArray;


        if (value) {
            navigateTo.setValidators([Validators.required]);
            navigationValue.setValidators([Validators.required, Validators.pattern('[a-zA-Z0-9 ]*')]);
            navigateTo.enable();
            navigationValue.enable();
            navigateTo.updateValueAndValidity();
            navigationValue.updateValueAndValidity();
            for (let i = 0; i < buttonDisplayArr.controls.length; i++) {
                let buttonName = buttonDisplayArr.controls[i].get('buttonName');
                buttonName.enable();
                buttonName.setValidators([Validators.required, Validators.pattern('[a-zA-Z0-9\u0600-\u06FF ]*')]);
                buttonName.updateValueAndValidity();
            }

        } else {
            navigationValue.setValue('');
            navigateTo.setValue('');
            navigateTo.disable();
            navigationValue.disable();
            navigationValue.clearValidators();
            navigationValue.updateValueAndValidity();
            navigateTo.clearValidators();
            navigateTo.updateValueAndValidity();
            for (let i = 0; i < buttonDisplayArr.controls.length; i++) {
                let buttonName = buttonDisplayArr.controls[i].get('buttonName');
                buttonName.setValue('');
                buttonName.disable();
                buttonName.clearValidators();
                buttonName.updateValueAndValidity();
            }

        }
    }

    decimalNumberValidator(c: AbstractControl): { [key: string]: boolean } {
        let regex = /^([0-9]{0,3}(\.[0-9]{1,3})?)$/
        let number = regex.test(c.value) ? +c.value : NaN;
        if (number !== number) {
            return { 'value': true };
        }
        return null;
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

            this.viewEarnRuleById();
            this.getCurrencyConversionValue(this.currencyOids);
        })
    }
    alertLengthPopup() {
        const dialogRef = this.dialog.open(AlertMessageDialogComponent);
        dialogRef.componentInstance.alertMes = this.alertMesVal;
    }
    expandDataEmail() {
        var allifram = document.getElementById("arabicID");
        var iFrame_Arabic = allifram.getElementsByTagName("iframe")[0];
        var html_Arabic = iFrame_Arabic.contentWindow.document.getElementsByTagName("html")[0];
        html_Arabic.setAttribute("style", "direction: rtl;");
    }
    expandtermAndCondition() {
        var allifram = document.getElementById("arabicIDtac");
        var iFrame_Arabic = allifram.getElementsByTagName("iframe")[0];
        var html_Arabic = iFrame_Arabic.contentWindow.document.getElementsByTagName("html")[0];
        html_Arabic.setAttribute("style", "direction: rtl;");
    }
    viewEarnRule(earnRuleId) {
        localStorage.setItem('ViewEarnID', earnRuleId);
        this.router.navigate(['/view-earn-rule']);
    }
    moveToViewProgram(ID) {
        localStorage.setItem('ViewID', ID);
        this.router.navigate(['/view-programs']);
    }

    getFreeProduct(brandId) {
        this.brandOid = brandId;
        let GET_FREE_PRODUCTS_VALUE = environment.APIEndpoint + "api/rpa/master/freeProduct/v1/list/" + this.brandOid;
        this.http.getJson(GET_FREE_PRODUCTS_VALUE).subscribe(
            (response) => {
                this.freeproductvalues = response['freeProductType'];                
            });
    }
    
    getfreeproductvalue(freeProductCode){
        this.freeProductCodeValue = freeProductCode;
    }
}
