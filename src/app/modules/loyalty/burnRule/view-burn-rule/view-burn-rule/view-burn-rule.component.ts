import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, Validators, FormBuilder, FormGroup } from '@angular/forms';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material';
import { HttpService } from 'src/app/services/http-service';
import { environment } from 'src/environments/environment';
import { Router, ActivatedRoute } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ViewStoreDialogComponent } from '../../../../../shared/components/view-store-dialog/view-store-dialog.component';

@Component({
    selector: 'app-view-burn-rule',
    templateUrl: './view-burn-rule.component.html',
    styleUrls: ['./view-burn-rule.component.scss']
})
export class ViewBurnRuleComponent implements OnInit {
    public breadCrumbData: Array<Object> = [{
        title: 'Loyalty',
        link: ''
    }, {
        title: 'Burn rule',
        link: ''
    }
    ];

    public checked = true;
    public disabled = true;
    panelOpenState = false;
    public imgUpload = false;
    public burnRuleId;
    public burnRuleDetails;
    programDetails;
    public brand: string;
    public programId;
    public startDateTime;
    public endDateTime;
    isChecked = false;
    public rewardTypes;
    currencies = [];
    public alignCss = [];
    public rightPanel = [];
    public descriptionText = [];
    public termAndConditionText = [];
    public storeCount: any[];
    public productCount
    public rewardWorths = [];
    public burnRuleCurrencies = [];
    public excludeStoreCount = 0;
    public excludeSkuCount = 0;
    public excIncStore = 'Include';
    public filePathUrl = localStorage.getItem("imgBaseUrl");
    public isDisabled = true;
    public totalCount: any = 2000;
    public brandOid: number = 0;
    public fileUrl = localStorage.getItem("fileBaseUrl");
    selectStoreValPass;
    constructor(
        private activatedRoute: ActivatedRoute,
        private https: HttpService,private router: Router,
        private sanitized: DomSanitizer, public dialog: MatDialog, ) {
        // this.activatedRoute.params.subscribe(
        //     (param) => {
        //         this.burnRuleId = param.id
        //     }
        // );
    }

    ngOnInit() {
        let data=localStorage.getItem('ViewBurnID');
        if(data){
            this.burnRuleId = data;
            this.viewBurnRule();
            localStorage.removeItem('ViewBurnID');
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

        this.https.postJson(environment.APIEndpoint + 'api/rpa/store/v1/getAll', data).subscribe(res => {
            this.totalCount = res['totalCount'];
        });
    }

    viewBurnRule() {
        let requestBody = {
            burnRuleId: this.burnRuleId
        }
        this.https.postJson(environment.APIEndpoint + 'api/rpa/burn/rule/v1/view', requestBody)
            .subscribe(
                (response) => {
                    console.log(response);
                    this.burnRuleDetails = response;
                    this.programId = response['programId'];
                    this.rewardWorths = response['rewardWorth'];
                    if (this.rewardWorths != null) {
                        for (let type of this.rewardWorths[0].rewardValues) {
                            this.burnRuleCurrencies.push(type.currencyCode);
                        }
                        this.excludeStoreCount = response['storeList'].length;
                        this.excludeSkuCount = response['skuCodeList'].length;

                    }
                    this.storeCount = response['storeList'];
                    this.selectStoreValPass = response['storeList'];
                    this.productCount = response['skuCodeList'];
                    this.excIncStore = response['excludeStore'] ? 'Exclude' : 'Include';
                    this.getProgramDetails(this.programId);
                    this.getText(this.burnRuleDetails);
                },
                (error) => {
                    console.log(error);
                }
            );
    }


    public getText(TextData) {
        for (var i = 0; i < TextData.ruleLocaleList.length; i++) {
            this.descriptionText.push(this.sanitized.bypassSecurityTrustHtml(TextData.ruleLocaleList[i].description));
            this.termAndConditionText.push(this.sanitized.bypassSecurityTrustHtml(TextData.ruleLocaleList[i].termsAndConditions));
        }
    }

    openStoreDialog() {
        const dialogRef = this.dialog.open(ViewStoreDialogComponent, {
            panelClass: 'custom-modalbox'
        });
        // dialogRef.componentInstance.storeList = this.storeCount;
        // dialogRef.componentInstance.isDisabled = this.isDisabled;
        // dialogRef.componentInstance.brandOid = this.brandOid;
        // dialogRef.componentInstance.totalCount = this.totalCount;
        dialogRef.componentInstance.selectedStoreData = this.selectStoreValPass;
        console.log(this.selectStoreValPass);
        // this.storeList.disable();
        // this.isAllSelected = false;
        this.isDisabled = true;
    }

    getProgramDetails(id: number) {
        let body = {
            programId: id
        }
        let GET_PROGRAM_DATA = environment.APIEndpoint + "api/rpa/loyalty/program/v1/view";
        this.https.postJson(GET_PROGRAM_DATA, body)
            .subscribe(
                (response) => {
                    console.log(response);
                    this.programDetails = response;
                    let brand = this.programDetails.brand;
                    this.startDateTime = new Date(response['startDate']);
                    if (response['startTime'] != null && response['startTime'] != '') {
                        let startTime = response['startTime'].split(":");
                        this.startDateTime.setHours(startTime[0]);
                        this.startDateTime.setMinutes(startTime[1]);
                    }

                    this.endDateTime = (response['endDate'] != '' && response['endDate'] != null) ? new Date(response['endDate']) : '';
                    if (response['endTime'] != null && response['endTime'] != '') {
                        let endTime = response['endTime'].split(":");
                        this.endDateTime.setHours(endTime[0]);
                        this.endDateTime.setMinutes(endTime[1]);
                    }
                    this.rewardTypes = response['pointWorths'];
                    this.isChecked = response['status'] == "ONLINE" ? true : false;

                    for (let p of response['programLocales']) {
                        this.alignCss.push(p.direction == 'RTL' ? 'text-right' : '');
                        this.rightPanel.push(p.direction == 'RTL' ? 'right-panel' : '');
                    }
                    for (let type of this.rewardTypes[0].rewardValues) {
                        this.currencies.push(type.currencyCode);
                    }

                    if (brand == null) {
                        this.brand = "";
                    } else {
                        this.brand = brand.brandName
                        this.brandOid = brand.brandId;
                    }

                },
                (error) => {
                    console.log(error);
                }
            );
    }
    moveToViewProgram(ID){
        localStorage.setItem('ViewID',ID);
       this.router.navigate(['/view-programs']);
     }
     EditBurnRule(burnRuleId){
        localStorage.setItem('BurnEditID',burnRuleId);
        this.router.navigate(['/edit-burn-rule']);
     }
}
