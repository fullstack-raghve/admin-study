import { Component, OnInit, ViewChild, Renderer2 } from '@angular/core';
import { FormControl, Validators, FormBuilder, FormGroup } from '@angular/forms';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent,MatSnackBar } from '@angular/material';
import { HttpService } from 'src/app/services/http-service';
import { environment } from 'src/environments/environment';
import { Router, ActivatedRoute } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { ViewStoreDialogComponent } from '../../../../../shared/components/view-store-dialog/view-store-dialog.component';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { SnackBarComponent } from 'src/app/shared/components/snack-bar/snack-bar.component';
@Component({
    selector: 'view-earn-rule',
    templateUrl: './view-earn-rule.component.html',
    styleUrls: ['./view-earn-rule.component.scss']
})
export class ViewEarnRuleComponent implements OnInit {
    public breadCrumbData: Array<Object> = [{
        title: 'Loyalty',
        link: ''
    }, {
        title: 'Earn rule',
        link: ''
    }
    ];
    tax = true;
    panelOpenState = true;
    public checked = true;
    public imgUpload = false;
    public SelectedActionType;
    public SelectedAction;
    public earnRuleId ;
    public earnRuleDetails : any;
    public startTime;
    public endTime;
    public alignCss = [];
    public rightPanel = [];
    public descriptionText = [];
    public termAndConditionText = [];
    public allowMultipleStamps = false;
    public programStartDateTime;
    public programEndDateTime;
    public programBrand = '';
    public programDetails = [];
    public showRewardType = 'points';
    public rewardType2 = 'Points';
    public imgUrl = localStorage.getItem('imgBaseUrl');
    public skuFilePathUrl = localStorage.getItem("fileBaseUrl");
    public currencyList = [];
    public statusValue = 'Online'
    public selectedSkus = 0;
    public selectedSkuFilePath = '';
    public skuIncludeExclude = 'Include';
    public selectedStores: any = 0;
    public tierList = [];
    public regionCurrencies = [];
    public regionTierAmounts = [];
    public minimumTxnAmounts = [];
    public includeExcludeStore:String='Exclude';
    selectStoreValPass;
    public fileUrl = localStorage.getItem("fileBaseUrl");
    public toggleVal;
    public updatePermission = true;
    public menuIds: any = localStorage.getItem("navigationArray");
    public skuFileName:String="";
    // dialog: any;
    // selectedStore: any;
    brandOid: any;
    selectedStoreCount: any;
    storeErrorMsg: string;
    storeList: any;
    isAllSelected: boolean;
    public isDisabled = true;

    public selectedCount = 0;
    currentUrlSlug;
    public dataStore: boolean = true;
    public selectStoreVal = false;
    public totalCount: [];

    public selectedStore = [];
    constructor(private activatedRoute: ActivatedRoute,
        private https: HttpService,  
        private router: Router,
        private sanitized: DomSanitizer, 
        public dialog: MatDialog, 
        private renderer: Renderer2, 
        private http: HttpService,
        public snackBar: MatSnackBar) {
        // this.activatedRoute.params.subscribe(
        //     (param) => {
        //         this.earnRuleId = param.id
        //     }
        // );
        // this.isDisabled = true ;
        this.totalDataStore();
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

    ngOnInit() {
        let data=localStorage.getItem('ViewEarnID');
        if(data){
            this.earnRuleId = data;
            this.getAllTiers();
            this.getRegionCurrency();
            localStorage.removeItem('ViewEarnID');
        }else{
            sessionStorage.clear();
            this.router.navigate(['/search-programs']); 
        }
       
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

        this.http.postJson(environment.APIEndpoint + 'api/rpa/store/v1/getAll', data).subscribe(res => {
            this.totalCount = res['totalCount'];
            this.selectedCount = res["totalCount"];
        });
    }

    viewEarnRuleById() {
        this.currencyList = [];
        let request = {
            earnRuleId: this.earnRuleId
        }
        let VIEW_EARN_RULE_BY_ID = environment.APIEndpoint + "api/rpa/earnRule/v1/view";
        this.https.postJson(VIEW_EARN_RULE_BY_ID, request).subscribe(
            (response) => {
                this.selectStoreValPass = response['stores'];
                if (response['action'] == 'TRANSACTION_VALUE' || response['action'] == 'BONUS' || response['action'] == 'PRODUCT_PURCHASE') {
                    if (response['skuFilePath'] == null || response['skuFilePath'] == "") {
                        this.selectedSkus = response['skus'] == null ? 0 : response['skus'].length;
                    } else {
                        this.selectedSkuFilePath = response['skuFilePath'];
                        if(this.selectedSkuFilePath!='' && this.selectedSkuFilePath!=null){
                            this.skuFileName=this.selectedSkuFilePath.split("/").pop();
                        }
                        
                    }

                }

                if (response['action'] == 'PRODUCT_PURCHASE') {
                    this.skuIncludeExclude = 'Include';
                } else {
                    this.skuIncludeExclude = response['isExcludeSku'] ? 'Exclude' : 'Include';
                }
                this.toggleVal = response['status'] == 'ONLINE' ? true : false;
                if (response['isExcludeStore']) {
                    this.includeExcludeStore = 'Exclude';
                } else {
                    this.includeExcludeStore = 'Include';
                }

                if (response['action'] == 'TRANSACTION_VALUE' || response['action'] == 'BONUS' || response['action'] == 'PRODUCT_PURCHASE') {
                    this.selectedStores = response['stores'].length;

                }

                if(response['stores'].length > 0){
                    this.selectedStore=response['stores'].map(oid=> oid.storeId);
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
                this.earnRuleDetails = response;
                if (this.earnRuleDetails['earnRuleTransactionAmountDefs'] != undefined) {
                    this.regionTierArrayForm(this.earnRuleDetails['earnRuleTransactionAmountDefs']);

                    for (let cr of this.earnRuleDetails['earnRuleTransactionAmountDefs'][0]['transactionAmountDefs']) {
                        this.currencyList.push(cr.currencyCode);
                    }
                }

                if (this.earnRuleDetails['earnRuleMinimumOrderValueDef'] != undefined) {
                    this.regionMinAmountArrayForm(this.earnRuleDetails['earnRuleMinimumOrderValueDef']);
                }

                if (response['action'] == 'TRANSACTION_VALUE' || response['action'] == 'BONUS') {
                    this.allowMultipleStamps = response['earnRuleTransactionAmountDefs'][0]['transactionAmountDefs'][0]['allowMultiple']
                }

                this.brandOid = response['programBrandOid'];

                this.statusValue = this.earnRuleDetails['status'];
                this.checked = this.earnRuleDetails['status'] == 'ONLINE' ? true : false;
                this.selectedProgramDetails(response['programId']);

                if (response['startTime'] != null && response['startTime'] != '') {
                    this.startTime = new Date(response['startDate']);
                    let startTime = response['startTime'].split(":");
                    this.startTime.setHours(startTime[0]);
                    this.startTime.setMinutes(startTime[1]);
                }
                if (response['endTime'] != null && response['endTime'] != '') {
                    this.endTime = new Date(response['startDate']);
                    let endTime = response['endTime'].split(":");
                    this.endTime.setHours(endTime[0]);
                    this.endTime.setMinutes(endTime[1]);
                }
                for (let e of response['earnRuleLocales']) {
                    this.alignCss.push(e.languageDirection == 'RTL' ? 'text-right' : '');
                    this.rightPanel.push(e.languageDirection == 'RTL' ? 'panel-right' : '');
                }
                this.getText(this.earnRuleDetails);


            });
    }
    public getText(textData) {
        for (let tx of textData.earnRuleLocales) {
            this.descriptionText.push(this.sanitized.bypassSecurityTrustHtml(tx.ruleDesc));
            this.termAndConditionText.push(this.sanitized.bypassSecurityTrustHtml(tx.termsAndCondition));
        }
    }
    selectedProgramDetails(id: number) {
        let body = {
            programId: id
        }

        let GET_PROGRAM_DATA = environment.APIEndpoint + "api/rpa/loyalty/program/v1/view";
        this.https.postJson(GET_PROGRAM_DATA, body)
            .subscribe(
                (response) => {
                    this.programDetails = response;

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
                    if (this.menuIds.indexOf('3003005') > -1 && response['publishStatus']=='LIVE') {
                        this.updatePermission = false;
                    }

                },
                (error) => {
                });
    }

    public toggleStatus(event) {
        if (event.checked == true) {
            this.statusValue = 'ONLINE';
        } else {
            this.statusValue = 'OFFLINE';
        }
        this.updateStatus(this.statusValue);
    }

    updateStatus(status: any) {
        let body = {
            earnRuleId: this.earnRuleId,
            status: status
        }

        let SEND_FOR_APPROVAL = environment.APIEndpoint + "api/rpa/earnRule/v1/update/status";
        this.http.postJson(SEND_FOR_APPROVAL, body)
            .subscribe((response) => {
                let approvalMsg = "Earn rule status updated successfully";
                this.snackBar.openFromComponent(SnackBarComponent, {
                    duration: 1500,
                    data: {
                        status: "success",
                        message: approvalMsg
                    }
                });
            }, err => {
                this.snackBar.openFromComponent(SnackBarComponent, {
                    duration: 1500,
                    data: {
                        status: "failure",
                        message: "Your request cannot be saved at this time. Please try again later"
                    }

                });
            });
    }
    
    openStoresDialog() {
        const dialogRef = this.dialog.open(ViewStoreDialogComponent, {
            panelClass: 'custom-modalbox'
        });
        dialogRef.componentInstance.selectedStoreData = this.selectStoreValPass;
        dialogRef.afterClosed().subscribe(
            (result) => {
                if (result.buttonName === 'SELECT') {
                    this.selectedStore = [];
                    this.selectedStoreCount = result.tableData.length;
                    if (this.selectedStoreCount != 0) {
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
    getRegionCurrency() {
        let GET_REGION_CURRENCIES_AND_TIERS = environment.APIEndpoint + "api/rpa/client/onboarding/v1/view"
        this.https.getJson(GET_REGION_CURRENCIES_AND_TIERS).subscribe((response) => {
            this.regionCurrencies = response['regionList'].map(function (item) {
                let region = {
                    regionId: item.regionId,
                    currencyCode: item.currencyCode,
                }
                return region;
            })

            this.viewEarnRuleById();
        });
    }

    getAllTiers() {
        let GET_ALL_TIERS = environment.APIEndpoint + "api/rpa/tier/v1/qualification/list"
        this.https.getJson(GET_ALL_TIERS)
            .subscribe((response) => {
                this.tierList = response;
            });
    }

    public regionTierArrayForm(earnRuleTransactionAmountDefs) {
        for (let t = 0; t < this.tierList.length; t++) {
            let arr = {
                tierId: this.tierList[t].tierId,
                regionCurrencyArray: []
            };
            this.regionTierAmounts.push(arr);
            this.regionCurrencyForm(this.regionTierAmounts[t].regionCurrencyArray, earnRuleTransactionAmountDefs[t].transactionAmountDefs);
        }
    }

    public regionCurrencyForm(tierControl, transactionAmountDefs) {
        var amount = 0;

        for (let currency of this.regionCurrencies) {
            amount = 0;

            for (let amountDef of transactionAmountDefs) {

                if (amountDef.regionId == currency.regionId) {
                    amount = amountDef.spendAmount;
                    break;
                }
            }

            // let arr ={
            //     [currency.regionId]: amount
            //     };

            tierControl.push(amount);
        }
    }

    public regionMinAmountArrayForm(earnRuleMinimumOrderValueDef) {
        for (let currency of this.regionCurrencies) {
            var amount = 0;
            for (let minAmount of earnRuleMinimumOrderValueDef) {
                if (currency.regionId == minAmount.regionId) {
                    amount = minAmount.minimumOrderAmt;
                }
            }
            // let arr = {
            //     [currency.regionId]: amount
            // };
            this.minimumTxnAmounts.push(amount);
        }
    }
    MoveToEditEarnRule(earnRuleId){
        localStorage.removeItem('ViewEarnID');
        localStorage.setItem('EditEarnID',earnRuleId);
        this.router.navigate(['/edit-earn-rule']);
    }
      moveToViewProgram(ID){
     localStorage.setItem('ViewID',ID);
    this.router.navigate(['/view-programs'])
  }
}
