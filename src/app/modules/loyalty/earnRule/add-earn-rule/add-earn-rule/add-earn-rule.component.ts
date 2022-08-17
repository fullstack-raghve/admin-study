import { Component, OnInit, ViewChild, ChangeDetectorRef, ElementRef } from '@angular/core';
import { FormControl, Validators, FormBuilder, FormGroup, FormArray, AbstractControl,ValidatorFn } from '@angular/forms';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent, MatSnackBar } from '@angular/material';
import { HttpService } from 'src/app/services/http-service';
import { environment } from 'src/environments/environment';
import { Router, ActivatedRoute } from '@angular/router';
import { productsDialog } from '../../../../../shared/components/products-dialog/products-dialog.component';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { UploadFile } from 'src/app/services/uploadFile.service';
import { SnackBarComponent } from 'src/app/shared/components/snack-bar/snack-bar.component';
import * as moment from 'moment';
import { AlertMessageDialogComponent } from '../../../../../shared/components/alert-message-dialog/alert-message-dialog.component';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { selectStoreDialog } from 'src/app/shared/components/select-store-dialog/select-store.component';
// import { forbiddenNamesValidator} from 'src/app/'

export function checkValidation(group: FormGroup) {
    let perpectual = group.get('perpectual').value;
    let action = group.get('action').value;
    let endDateControl = group.get('endDate');
    let noOfDays = group.get('noOfDays');
    let noOfTxnAfterRegistration = group.get('noOfTxnAfterRegistration')
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

export interface Program {
    programId: number;
    programName: string;
}

export interface Country {
    countryId: number;
    countryName: string;
}
@Component({
    selector: 'add-earn-rule',
    templateUrl: './add-earn-rule.component.html',
    styleUrls: ['./add-earn-rule.component.scss']
})
export class AddEarnRuleComponent implements OnInit {
    public breadCrumbData: Array<Object> = [{
        title: 'Loyalty',
        link: ''
    }, {
        title: 'Earn rule',
        link: ''
    }
    ];
    public alertMesVal: string;
    @ViewChild('uploadImgEl') uploadImgElRef: ElementRef;
    earnRuleFormGroup: FormGroup;
    public statusValue = 'ONLINE';
    public includeExclude = 'Include';
    public storeRequired: boolean = false;
    public toggleVal = true;
    panelOpenState = true;
    public checked = false;
    public imgUpload = false;
    public SelectedActionType;
    public rewardErrMsg = false;
    public selectAction = [];
    public maxEndDate = "";
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
    public imageUploading: boolean = false;
    public showImageError: boolean = false;
    public showSkuFileError: boolean = false;
    public countryData: boolean = false;
    public selectedStoreCount = 0;
    public selectedProduct = [];
    public skuFile = '';
    public skuFileName = "";
    public productErrorMsg;
    public programRewardType;
    public showRewardType = 'points';
    public rewardType = 'Points';
    public selectedStore = [];
    public storeErrorMsg: string = "Please select Store";;
    public loading = false;
    public minDate = new Date();
    public disabled = false;
    public descriptionError = false;
    public regionCurrencyError = false;
    public conversionList = [];
    public termsConditionError = false;
    public disabledInput = true;
    public skuToggleVal = true;
    public skuLabel = 'Upload';
    public selProgramId = 0;
    public selectedSkuCount = 0;
    public brandOid: number = 0;
    public freeproductArry = [];
    public currencyOids: any[];
    public errorList = [];
    public disableButton = false;
    public totalCount: [];
    public selectedCount;
    public selectStoreVal = false;
    public dataStore: boolean = false;
    public programType = 'BRAND';
    public minExpiryDate;
    public limitPerCustFlag = false;
    public dailyLimitFlag = false;
    public buttonDisable: boolean = false;
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
        this.router.routeReuseStrategy.shouldReuseRoute = () => false;
        this.activatedRoute.params.subscribe(
            (params) => {
                this.selProgramId = +(params.id);

                //this.initialiseState();
            }
        );
        this.buildEarnRuleForm();
        this.getAllTiers();
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
        });
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
        this.selectedSkuCount = 0;
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
                this.showSkuFileError = false;
                if (result.buttonName === 'UPLOAD') {
                    this.skuFile = result.skuFileName;
                    if (this.skuFile != '') {
                        this.skuFileName = this.skuFile.split("/").pop();
                    }
                    this.skuToggleVal = result.skuToggleVal;
                    if (this.skuToggleVal) {
                        this.skuLabel = 'Exclude';
                    } else {
                        this.skuLabel = 'Include';
                    }
                    this.selectedProduct = [];
                }
                if (result.buttonName === 'SELECT') {
                    this.selectedProduct = [];
                    this.skuToggleVal = result.skuToggleVal;
                    if (this.skuToggleVal) {
                        this.skuLabel = 'Exclude';
                    } else {
                        this.skuLabel = 'Include';
                    }
                    this.skuFile = "";
                    this.skuFileName = "";
                    this.selectedSkuCount = result.tableData.length;
                    if (this.selectedSkuCount != 0) {
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
    public removeSku() {
        this.skuFile = '';
        this.skuFileName = "";
        this.skuToggleVal = true;
        this.skuLabel = 'Upload';
    }
    ngOnInit() {
        if (this.programId == 0) {
            this.programDetails = [];
        }
        this.getProgramsList();
        this.earnRuleFormArray();
        this.buttonFormArray();
        this.descriptionFormArray();
        this.termsConditionFormArray();
        this.getAllBrands();
        // this.alertLengthPopup();

        this.getProgramValue();
        this.getCountryList();

    }


    public brandList;
    Programs: Program[] = [];
    programCtrl = new FormControl();
    filteredprograms: Observable<Program[]>;

    getAllBrands() {
        let GET_ALL_ONLINE_BRANDS = environment.APIEndpoint + "api/rpa/loyalty/program/v1/get/programs";
        this.http.getJson(GET_ALL_ONLINE_BRANDS)
          .subscribe((response) => {
            this.brandList = response;
    
            for (let i = 0; i <= this.brandList.length - 1; i++) {
              let objMallkey = {
                programId: this.brandList[i]['programId'],
                programName: this.brandList[i]['programName'],
              }
              this.Programs.push(objMallkey);
            }
            this.filteredprograms = this.programCtrl.valueChanges
                .pipe(
                  startWith(''),
                  map(program => program ? this._filterBrands(program) : this.Programs.slice())
                );
          },
            (error) => {
            });
      }
      private _filterBrands(value: string): Program[] {
        const filterValue = value.toLowerCase();
        return this.Programs.filter(program => program.programName.toLowerCase().indexOf(filterValue) === 0);
      }
      public programID;
      getAllPrograms(programId){
        this.programId = programId;
        if (this.programId != 0) {
            this.selectedProgramDetails(this.programId, 'POPULATE');
        }
    }
getProgramValue(){
    if (this.selProgramId!=0){
        this.selectedProgramDetails(this.selProgramId, 'POPULATE');
    }
}
    setExpiryDate(endDate: Date) {
        let expiryDate = this.earnRuleFormGroup.get("expiryDate");
        expiryDate.setValue('');
        expiryDate.updateValueAndValidity();
        //    this.minExpiryDate = moment(endDate).add(1, "days").format();
        this.minExpiryDate = moment(endDate).format();

    }

    buildEarnRuleForm() {
        this.earnRuleFormGroup = this.fb.group({
            // selectedProgram: [''],
            displayOnHomeScreen: false,
            isExclusive: false,
            earnRuleLocales: this.fb.array([]),
            startDate: ['', Validators.required],
            endDate: '',
            perpectual: false,
            startTime: '',
            endTime: '',
            navigateTo: { value: '', disabled: true },
            navigationValue: [{ value: '', disabled: true }, Validators.pattern('[a-zA-Z0-9 ]*')],
            buttonDisplayArr: this.fb.array([]),
            actionType: ['', Validators.required],
            action: ['', Validators.required],
            noOfInviteSent: ['', Validators.pattern('[0-9]{1,6}$')],
            noOfRegistration: ['', Validators.pattern('[0-9]{1,6}$')],
            noOfDays: ['', Validators.pattern('[0-9]{1,6}$')],
            noOfTxnAfterRegistration: ['', Validators.pattern('[0-9]{1,6}$')],
            maxDiscount: ['', Validators.required],
            minDiscount: ['', Validators.required],
            // freeProductType: [''],
            freeProductType: [''],
            descriptionArray: this.fb.array([]),
            termsConditionArray: this.fb.array([]),
            minimumOrder: ['', Validators.pattern('[0-9]{1,6}$')],
            pointsRewaredArray: this.fb.array([]),
            purchaseMinValue: ['', this.decimalNumberValidator],
            productPurchaseArray: this.fb.array([]),
            productSaleArray: this.fb.array([]),
            regionTierArray: this.fb.array([]),
            transactionMinOrder: ['', this.decimalNumberValidator],
            pointExpiryIn: [''],
            expiryDate: [''],
            numberOfDays: [''],
            descriptionCtrl: [''],
            overallAccurals: [''],
            overAllLimit: [''],
            dailyLimit: [''],
            excludeDeliveryCost: false,
            excludeTax: false,
            showButton: false,
            ruleType: false,
            //excludedSku: false,
            // excludedStore: false,
            //includedProductSku: false,
            // includedProductStore: false,
            allowMultipleStamps: true,
            // excludedProductStore:false, //Validators.minLength(2)
            regionMinAmountArray: this.fb.array([])
        }, { validator: checkValidation });
        // if (this.selProgramId == 0) {
        //     this.earnRuleFormGroup.get('selectedProgram').setValidators([Validators.required])

        // } else {
        //     this.programId = this.selProgramId;
        // }

    }
    public earnRuleFormArray() {
        const control = <FormArray>this.earnRuleFormGroup.controls['earnRuleLocales'];
        for (let i = 0; i < this.languageList.length; i++) {
            let newForm = this.fb.group({
                ruleName: ['', Validators.compose([Validators.required, Validators.maxLength(100), Validators.minLength(4)])],
            });
            control.push(newForm);
            this.alignCss.push(this.languageList[i].direction == 'RTL' ? 'text-right' : '');
            this.rightPanel.push(this.languageList[i].direction == 'RTL' ? 'right-panel' : '');
        }
    }
    public buttonFormArray() {
        const control = <FormArray>this.earnRuleFormGroup.controls['buttonDisplayArr'];
        for (let ln of this.languageList) {
            let newForm = this.fb.group({
                buttonName: [{ value: '', disabled: true }, Validators.pattern('[a-zA-Z0-9\u0600-\u06FF ]*')],
            });
            control.push(newForm);
            this.alignCss.push(ln.direction == 'RTL' ? 'text-right' : '');
            this.rightPanel.push(ln.direction == 'RTL' ? 'right-panel' : '');
        }
    }
    public descriptionFormArray() {
        const control = <FormArray>this.earnRuleFormGroup.controls['descriptionArray'];
        for (let ln of this.languageList) {
            let newForm = this.fb.group({
                description: ['', Validators.required],
            });
            control.push(newForm);
            this.alignCss.push(ln.direction == 'RTL' ? 'text-right' : '');
            this.rightPanel.push(ln.direction == 'RTL' ? 'right-panel' : '');

        }
    }
    public termsConditionFormArray() {
        const control = <FormArray>this.earnRuleFormGroup.controls['termsConditionArray'];
        for (let ln of this.languageList) {
            let newForm = this.fb.group({
                termsCondition: [''],
            });
            control.push(newForm);
            this.alignCss.push(ln.direction == 'RTL' ? 'text-right' : '');
            this.rightPanel.push(ln.direction == 'RTL' ? 'right-panel' : '');
        }
    }
    public pointsRewardedFormArray() {
        const control = <FormArray>this.earnRuleFormGroup.controls['pointsRewaredArray'];
        for (let t of this.tierList) {
            let newForm = this.fb.group({
                tierId: t.tierId,
                points: ['', Validators.pattern('[0-9]{1,3}$')],

            });
            control.push(newForm);
            // this.alignCss.push(ln.direction == 'RTL' ? 'text-right' : '');

        }
    }
    public productPurchasedFormArray() {
        const control = <FormArray>this.earnRuleFormGroup.controls['productPurchaseArray'];
        for (let t of this.tierList) {
            let newForm = this.fb.group({
                tierId: t.tierId,
                noOfPurchased: ['', Validators.pattern('[0-9]{1,3}$')],
                noOfPoints: ['', Validators.pattern('[0-9]{1,3}$')],

            });
            control.push(newForm);
            // this.alignCss.push(ln.direction == 'RTL' ? 'text-right' : '');

        }
    }
    public productSaleFormArray() {
        const control = <FormArray>this.earnRuleFormGroup.controls['productSaleArray'];
        for (let t of this.tierList) {
            let newForm = this.fb.group({
                tierId: t.tierId,
                sale: ['', Validators.pattern('[0-9]{1,3}$')],
                noSale: ['', Validators.pattern('[0-9]{1,3}$')],
            });
            control.push(newForm);
        }
    }

    public regionMinAmountArrayForm() {
        this.tierFlag = true;
        const control = <FormArray>this.earnRuleFormGroup.controls['regionMinAmountArray'];
        for (let currency of this.regionCurrencies) {
            let arr = this.fb.group({
                [currency.regionId]: ['']
            });
            control.push(arr);
        }
    }

    public regionTierArrayForm() {
        this.tierFlag = true;
        const control = <FormArray>this.earnRuleFormGroup.controls['regionTierArray'];
        for (let t = 0; t < this.tierList.length; t++) {
            //let tier = this.tierList[t];
            let arr = this.fb.group({
                tierId: [this.tierList[t].tierId],
                regionCurrencyArr: this.fb.array([])
            });
            control.push(arr);
            this.regionCurrencyForm(control.controls[t]);
        }
    }

    public regionCurrencyForm(tierControl) {
        const array = <FormArray>tierControl.controls['regionCurrencyArr'];
        for (let currency of this.regionCurrencies) {
            let arr = this.fb.group({
                [currency.regionId]: ['']
            });
            array.push(arr);
        }
    }

    populateActionValues(actionType) {
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
                    name: 'Transaction Discount',
                    value: 'TRANSACTION_DISCOUNT'
                },
                {
                    name: 'Bonus',
                    value: 'BONUS'
                }
             
                );

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
        
        if(actionType == 'TRANSACTION'){
            this.selectAction.push({
                name: 'Bill Amount',
                value: 'BILL_AMOUNT'
            });
        }

        if (actionType == 'PROGRAM_REFERRAL') {
            this.selectAction.push(
            //     {
            //     name: 'Invite Sent',
            //     value: 'INVITE_XX_FRIENDS'
            // },
                {
                    name: 'Invited user registered',
                    value: 'REFERRAL_REGISTERED'
                }, 
                // {
                //     name: 'Refer customer to Brand',
                //     value: 'REFER_USER_TO_BRAND'

                // },
                //  {
                //     name: 'Refer customer to Event',
                //     value: 'REFER_USER_TO_EVENT'
                // },
                // {
                //     name: 'Register on Invitation',
                //     value: 'REGISTER_ON_INVITATION'
                // },
                // {
                //     name: 'Invited User Registered Region',
                //     value: 'INVITED_USER_REGISTERED_REGION'
                // },
                // {
                //     name: 'Invited User Transacted Region',
                //     value: 'INVITED_USER_TRANSACTED_REGION'
                // },
                {
                    name: '1st Transaction after registered.',
                    value: 'FIRST_TRANSACTION'
                }
                )
            checkValidation(this.earnRuleFormGroup);
        }

        if (actionType == 'PROFILE_ACTIVITY') {
            this.selectAction.push({
                name: 'Registration',
                value: 'REGISTERED'
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
                }, {
                    name: 'Upload Profile Picture',
                    value: 'UPLOAD_PROFILE_PICTURE'
                }, {
                    name: 'Validate Email',
                    value: 'VALIDATE_EMAIL'
                }, {
                    name: 'XX Transactions after Registration',
                    value: 'XX_TRANSACTIONS_AFTER_REGISTRATION'
                })
            checkValidation(this.earnRuleFormGroup);

        }

    }

    getAllTiers() {
        let GET_ALL_TIERS = environment.APIEndpoint + "api/rpa/tier/v1/qualification/list"
        this.http.getJson(GET_ALL_TIERS)
            .subscribe((response) => {
                this.tierList = response;
                this.pointsRewardedFormArray();
                this.productPurchasedFormArray();
                this.productSaleFormArray();
                this.getRegionCurrency();
            });
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
            this.regionTierArrayForm();
            this.regionMinAmountArrayForm();

        })
    }
    
  
    getProgramsList() {
        this.http.getJson(environment.APIEndpoint + 'api/rpa/loyalty/program/v1/get/programs')
            .subscribe(
                (response) => {
                    this.programList = response;
                    if (this.programId != 0) {
                        this.selectedProgramDetails(this.programId, 'POPULATE');
                    }
                },
                (error) => {
                }
            );
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
    selectedProgramDetails(id: number, dataType) {
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
                    if (new Date(this.programDetails['startDate']) < this.minDate) {
                        this.minDate = new Date();
                    } else {
                        this.minDate = this.programDetails['startDate'];
                    }
                    if (this.programDetails['rewardType'] == 'POINTS') {
                        this.programRewardType = 'POINTS';
                        this.showRewardType = 'points';
                        this.rewardType = "Points"
                    }

                    else if (this.programDetails['rewardType'] == 'STAMPS') {
                        this.programRewardType = 'STAMPS';
                        this.showRewardType = 'stamps';
                        this.rewardType = "Stamps"
                    }

                    else {
                        this.programRewardType = this.programDetails['rewardType'];
                    }

                    this.programStartDateTime = new Date(response['startDate']);
                    if (response['startTime'] != null) {
                        let startTime = response['startTime'].split(":");
                        this.programStartDateTime.setHours(startTime[0]);
                        this.programStartDateTime.setMinutes(startTime[1]);
                    }
                    if (response['endDate'] != null) {
                        this.programEndDateTime = new Date(response['endDate']);
                        this.maxEndDate = this.programEndDateTime;
                        if (response['endTime'] != null) {
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
                            this.programBrand = brand.brandName;
                            this.brandOid = brand.brandId;
                            this.getFreeProduct(this.brandOid);
                        }
                    }

                },
                (error) => {
                }
            );
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

    createEarnRule(formData) {
        this.buttonDisable = true;
        this.earnRuleArr = [];
        let earnRuleTransactionPoint = [];
        let activityCount = '';
        let earnPointRewards = [];
        let earnRulePurchaseProduct = [];
        let earnRuleTransactionAmount = [];
        let programId;
        this.descriptionError = false;
        this.termsConditionError = false;
        let termsError;
        let descError;
        let minimumTxnAmounts = [];
        let storeError = false;

        for (let d of formData.descriptionArray) {
            if (d.description == '') {
                descError = true;
            }
        }
        for (let e of formData.termsConditionArray) {
            if (e.termsCondition == '') {
                termsError = true;
            }
        }

        if (this.selectedStore.length == 0 && this.includeExclude == 'Include' && (formData.action === 'TRANSACTION_VALUE' || formData.action === 'BONUS' || formData.action === 'PRODUCT_PURCHASE' || formData.action === 'BILL_AMOUNT')) {
            storeError = true;
        }

        if (formData.action === 'TRANSACTION_VALUE' || formData.action === 'BONUS'|| formData.action === 'BILL_AMOUNT') {
            for (let cn of formData.regionTierArray[1].regionCurrencyArr) {
                var key = Object.keys(cn)
                if (cn[key[0]] == '') {
                    this.regionCurrencyError = true;
                }
            }
        }

        let fileError: boolean = false;
        if ((null == this.skuFile || this.skuFile == "") && formData.action === 'PRODUCT_PURCHASE' && this.selectedProduct.length == 0) {
            fileError = true;
            this.showSkuFileError = true;
        }

        if (this.earnRuleFormGroup.invalid || this.ruleImagePath === '' || descError || termsError || fileError || storeError) {
            this.showImageError = this.ruleImagePath === '' ? true : false;
            this.descriptionError = descError;
            this.termsConditionError = termsError;
            this.storeRequired = storeError;
            this.buttonDisable = true;       
         }
        else {
            this.loading = true;
            programId = this.selProgramId == 0 ? this.programId : this.selProgramId;
            formData.earnRuleLocales.forEach((rule, index) => {
                let locale = {
                    languageId: this.languageList[index].languageId,
                    ruleName: rule.ruleName,
                    ruleDesc: formData.descriptionArray[index].description,
                    termsAndCondition: formData.termsConditionArray[index].termsCondition,
                    buttonLabel: formData.showButton == true ? formData.buttonDisplayArr[index].buttonName : ''
                }
                this.earnRuleArr.push(locale);
            })
            if (formData.action === 'TRANSACTION_VALUE' || formData.action === 'BONUS' || formData.action === 'BILL_AMOUNT') {
                this.minimumOrderValue = formData.transactionMinOrder;
                formData.productSaleArray.forEach((product, index) => {
                    earnRuleTransactionPoint.push({
                        markupType: 'SALE',
                        regionId: '',
                        tierId: product.tierId,
                        noOfRewards: product.sale,
                    });
                    earnRuleTransactionPoint.push({
                        markupType: 'NON_SALE',
                        regionId: '',
                        tierId: product.tierId,
                        noOfRewards: product.noSale,
                    });
                });

                for (let t of formData.regionTierArray) {
                    for (let i = 0; i < t.regionCurrencyArr.length; i++) {
                        var key = Object.keys(t.regionCurrencyArr[i])
                        if (t.regionCurrencyArr[i][key[0]] != '') {
                            earnRuleTransactionAmount.push(
                                {
                                    regionId: parseInt(key[0]),//int
                                    tierId: parseInt(t.tierId),//int
                                    spendAmount: t.regionCurrencyArr[i][key[0]].toString(),//int
                                    markupType: '',
                                    isAllowMultiple: formData.allowMultipleStamps,
                                });
                        }
                    }
                }

                for (let minAmount of formData.regionMinAmountArray) {
                    var key = Object.keys(minAmount);
                    minimumTxnAmounts.push({
                        regionId: parseInt(key[0]),
                        minimumOrderAmt: minAmount[key[0]].toString()
                    });
                }
            }
            if (formData.action === 'PRODUCT_PURCHASE') {
                this.minimumOrderValue = formData.purchaseMinValue;
                formData.productPurchaseArray.forEach((product, index) => {
                    earnRulePurchaseProduct.push({
                        tierId: product.tierId,
                        noOfPurchase: product.noOfPurchased,
                        noOfRewards: product.noOfPoints,
                    });
                });
            }
            if (formData.action === 'FIRST_TRANSACTION') {
                this.minimumOrderValue = formData.minimumOrder;
            }
            if (formData.action == 'INVITE_XX_FRIENDS') {
                activityCount = formData.noOfInviteSent;
            }
            if (formData.action == 'REFERRAL_REGISTERED') {
                activityCount = formData.noOfRegistration;
            }
            if (formData.action == 'ACTIVE_AFTER_XX_DAYS') {
                activityCount = formData.noOfDays
            }
            if (formData.action == 'XX_TRANSACTIONS_AFTER_REGISTRATION') {
                activityCount = formData.noOfTxnAfterRegistration
            }
            if (formData.action !== 'PRODUCT_PURCHASE' && formData.action !== 'TRANSACTION_VALUE' && formData.action !== 'BONUS' && formData.action !== 'BILL_AMOUNT') {
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
            let producttype = null;
            if (null != formData.freeProductType && formData.freeProductType != '') {
                producttype = formData.freeProductType;
            }

            let request = {
                status: this.statusValue,
                programId: this.programId,
                // programId: this.selProgramId == 0 ? this.programID : this.selProgramId,
                startDate: formData.startDate != '' ? moment(formData.startDate).format('YYYY-MM-DD') : '',
                endDate: formData.endDate != '' ? moment(formData.endDate).format('YYYY-MM-DD') : '',
                isPerpectual: formData.perpectual,
                startTime: formData.startTime != '' ? moment(formData.startTime).format('HH:mm:ss') : '',
                endTime: formData.endTime != '' ? moment(formData.endTime).format('HH:mm:ss') : '',
                displayOnHomeScreen: formData.displayOnHomeScreen,
                isExcludeStore: storeIncExcl,
                isExclusiveRule: formData.isExclusive,
                ruleDesc: formData.descriptionArray[0].description,
                rewardType: this.programRewardType,
                ruleImgPath: this.ruleImagePath,
                actionType: formData.actionType,
                action: formData.action,
                minimumOrderValue: this.minimumOrderValue,
                excludeDeliveryCost: formData.excludeDeliveryCost,
                excludeTax: formData.excludeTax,
                isExcludeSku: formData.action === 'PRODUCT_PURCHASE' ? false : this.skuToggleVal,
                skuFilePath: this.skuFile,
                showButton: formData.showButton,
                countryOid: this.countryId,
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
                freeProductType: producttype,
                maxOverallAccrual: formData.overallAccurals,
                overallLimitPerCustomer: formData.overAllLimit,
                dailyCustomerLimit: formData.dailyLimit,
                pointExpiryIn: formData.pointExpiryIn == '' ? null : formData.pointExpiryIn,
                expiryDate: formData.expiryDate == '' ? null : moment(formData.expiryDate).format('YYYY-MM-DD'),
                expiryDays: formData.numberOfDays,
                isEndOfMonth: false,
            }
            let CREATE_EARN_RULE = environment.APIEndpoint + "api/rpa/earnRule/v1/create";
            this.http.postJson(CREATE_EARN_RULE, request)
                .subscribe(
                    (response) => {
                        this.snackBar.openFromComponent(SnackBarComponent, {
                            duration: 1500,
                            data: {
                                status: "success",
                                message: "Earn rule has been created successfully"
                            }
                        });
                        this.loading = false;
                        let ID = programId
                        localStorage.setItem('ViewID', ID);
                        this.router.navigate(['/view-programs']);
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
                        } 
                        else {
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
                });
        } 
        else {
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
        let GET_ALL_CURRENCY_CONVERSION_VALUE =
            environment.APIEndpoint +
            "api/rpa/master/currencyconversion/v1/get/conversionRate?currencyOids=" +
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
            } 
            else {
                this.rewardErrMsg = false;
                if (row == 0 && column != undefined && baseCurValue != "") {
                    for (let i = 1; i < this.regionCurrencies.length; i++) {
                        for (let conversion of this.conversionList) {
                            const array = <FormArray>column.controls['regionCurrencyArr'];
                            if (conversion.currencyCode === this.regionCurrencies[i].currencyCode) {
                                let conversionValue = conversion.conversionValue * parseFloat(baseCurValue);
                                if (conversionValue.toFixed(0).length > 19) {
                                    this.errorList.push(this.regionCurrencies[i].currencyCode);
                                    conversionValue = 0;
                                }
                                array.at(i).patchValue({
                                    //  [this.regionCurrencies[i].regionId]: conversionValue
                                    [this.regionCurrencies[i].regionId]: [conversionValue.toFixed(3)]
                                });
                                array.markAsPristine;
                            }
                        }
                        if (this.errorList.length > 0) {
                            this.alertMesVal = this.errorList.toString() + " values exceeds limit";
                            this.alertLengthPopup();
                        }
                        //array.push(arr);
                    }
                    this.regionCurrencyError = false;
                } 
                else {
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
                                        [this.regionCurrencies[i].regionId]: [conversionValue.toFixed(3)]
                                        //  [this.regionCurrencies[i].regionId]: [Math.round(conversionValue)]
                                    });
                                    array.markAsPristine;
                                }
                            }
                        }
                    }
                }
            }
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
        else if (action == 'TRANSACTION_DISCOUNT') {
            let minDiscount = this.earnRuleFormGroup.get('minDiscount');
            let maxDiscount = this.earnRuleFormGroup.get('maxDiscount');
            minDiscount.setValidators([Validators.required]);
            maxDiscount.setValidators([Validators.required]);
            minDiscount.updateValueAndValidity();
            maxDiscount.updateValueAndValidity();
        } 
        else if (action == 'INVITED_USER_REGISTERED_REGION' || action == 'INVITED_USER_TRANSACTED_REGION'){
            this.countryData = true;
        }
        else {
            this.countryData = false;
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
        if (action != 'PRODUCT_PURCHASE' && action != 'FIRST_TRANSACTION' && !type) {
            let overallaccural = this.earnRuleFormGroup.get('overallAccurals');
            let overallPerCustomer = this.earnRuleFormGroup.get('overAllLimit');
            let dailyLimit = this.earnRuleFormGroup.get('dailyLimit');

            overallaccural.setValidators(Validators.required);
            overallaccural.updateValueAndValidity();
            overallPerCustomer.setValidators(Validators.required);
            overallPerCustomer.updateValueAndValidity();
            dailyLimit.setValidators(Validators.required);
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

        let producttype = this.earnRuleFormGroup.get('freeProductType');
        producttype.clearValidators();
        producttype.updateValueAndValidity();

        // clear the validation for min and max Discount
        let minDiscount = this.earnRuleFormGroup.get('minDiscount');
        let maxDiscount = this.earnRuleFormGroup.get('maxDiscount');
        minDiscount.clearValidators();
        maxDiscount.clearValidators();
        minDiscount.updateValueAndValidity();
        maxDiscount.updateValueAndValidity();

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
        overallaccural.clearValidators()
        overallaccural.updateValueAndValidity();
        overallPerCustomer.setValue('');
        overallPerCustomer.clearValidators()
        overallPerCustomer.updateValueAndValidity();
        dailyLimit.setValue('');
        dailyLimit.clearValidators();
        dailyLimit.updateValueAndValidity();
    }

    public countryList;
    Countries: Country[] = [];
    countryCtrl = new FormControl();
    filteredcountries: Observable<Country[]>;

    getCountryList() {
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
          },
            (error) => {
            });
      }

      private _filterCountries(value: string): Country[] {
        const filterValue = value.toLowerCase();
        return this.Countries.filter(country => country.countryName.toLowerCase().indexOf(filterValue) === 0);
      }

      public countryId;

      getAllcountry(countryId){
          this.countryId = countryId;
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
        }
         else {
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

    alertLengthPopup() {
        const dialogRef = this.dialog.open(AlertMessageDialogComponent);
        dialogRef.componentInstance.alertMes = this.alertMesVal;
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
