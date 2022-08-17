import { Component, OnInit, ViewChild, Renderer2, ElementRef, Inject } from '@angular/core';
import { FormControl, Validators, FormBuilder, FormGroup } from '@angular/forms';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { DOCUMENT } from '@angular/common';
import { MatChipInputEvent, MatSnackBar } from '@angular/material';
import { HttpService } from 'src/app/services/http-service';
import { environment } from 'src/environments/environment';
import { Router, ActivatedRoute } from '@angular/router';
import { MAT_STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { SnackBarComponent } from 'src/app/shared/components/snack-bar/snack-bar.component';
import { addRulesDialog } from '../../../../../shared/components/rule-dialog/add-rule.component';
import { addCouponDialog } from '../../../../../shared/components/coupon-dialog/add-coupon.component';
import * as moment from 'moment';
import { notificationDialog } from 'src/app/shared/components/notification-dialog/notification.component';
import { DomSanitizer, SafeResourceUrl, SafeUrl} from '@angular/platform-browser';

@Component({
    selector: 'view-campaign',
    templateUrl: './view-campaign.component.html',
    styleUrls: ['./view-campaign.component.scss'],
    providers: [{
        provide: MAT_STEPPER_GLOBAL_OPTIONS, useValue: { displayDefaultIndicatorType: false }
    }]
})
export class ViewCampaignComponent implements OnInit {

    public breadCrumbData: Array<Object> = [{
        title: 'Marketing',
        link: ''
    }, {
        title: 'Campaigns',
        link: 'view-campaign'
    }
    ];
    public arbicInvalid = [];

    public previousUrl = localStorage.getItem('previousUrl');
    public skuFilePathUrl = localStorage.getItem("fileBaseUrl");
    public filePathUrl = localStorage.getItem("fileBaseUrl");
    @ViewChild("viewCampaignForm") viewCampaignForm;
    firstFormGroup: FormGroup;
    secondFormGroup: FormGroup;
    public showError: boolean = false;
    public loading: boolean = false;
    public statusValue: string = 'OFFLINE';
    public smsRestriction: boolean = false;
    public emailChecked: boolean = false;
    public pushChecked: boolean = false;
    public smsChecked: boolean = false;
    public includeArabicCustomers: boolean = false;
    public campaignId;
    public campaignData: any = [];
    public promotionData: any = [];
    public communicationTypes = [];
    public filePath: string;
    public fileImgPathUrl = localStorage.getItem("imgBaseUrl");
    checked = true;
    public skuFileName = '';
    public toggleVal: boolean = true;

    disabled = true;
    public nonmemberCampaign: boolean = false;
    panelOpenState = false;
    public languageDirection = [];
    public langfield = [];
    public langfieldname = [];
    public languages = JSON.parse(localStorage.getItem("languageList"));

    public customerSelectedCount: number;
    public getCustomerBtnEnbale: boolean = false;
    public segmentAttrJson: any;
    public finalQuery: string;

    public customerSegmentFileapply: any = [];
    public customerfilePath: boolean = false;
    public filePathCustomer: string;
    public customerSelectedCountAbove: boolean = false;
    public fileUrl = localStorage.getItem("fileBaseUrl");

    public viewcusSegmentData: boolean = false;
    public disableData: boolean = false;
    public selectfinalQuery: boolean = false;
    public downloadQuery: boolean = false;
    public viewMemId;
    public genratedTemplate: SafeResourceUrl;

    constructor(private renderer: Renderer2, private _formBuilder: FormBuilder, private activatedRoute: ActivatedRoute, private router: Router, private sanitizer: DomSanitizer ,
        private http: HttpService, public snackBar: MatSnackBar, public dialog: MatDialog,@Inject(DOCUMENT) private document: Document) {
        // this.activatedRoute.params.subscribe((params) => {
        //       this.campaignId = params.id;
        //   });
    }

    ngOnInit() {
        let data = localStorage.getItem('CampaignViewID');
        this.viewMemId = localStorage.getItem('memberCustomerId');
        if (data) {
            this.campaignId = data;
            this.getCampaignDataById();
            this.firstFormGroup = this._formBuilder.group({

            });
            this.secondFormGroup = this._formBuilder.group({

            });

            for (let language of this.languages) {
                this.languageDirection.push(language.direction == 'RTL' ? 'direction' : '');
                this.langfield.push(language.direction == 'RTL' ? 'direction' : '');
                this.langfieldname.push(language.direction == 'RTL' ? 'direction' : '');
                this.arbicInvalid.push(language.direction == 'RTL' ? 'arabicCheck' : 'mat-card');

            }
            localStorage.removeItem('CampaignViewID');
            localStorage.removeItem('memberCustomerId');
        } else {
            sessionStorage.clear();
            this.router.navigate(['/search-campaign'])
        }

    }

    getCampaignDataById() {
        let GET_CAMPAIGN_DATA_BY_ID = environment.APIEndpoint + "api/rpa/campaign/ca/v1/view";
        let request = {
            campaignId: this.campaignId
        }

        this.http.postJson(GET_CAMPAIGN_DATA_BY_ID, request)
            .subscribe((response) => {

                this.campaignData = response;
                this.toggleVal = this.campaignData.basicDetails.status == "ONLINE" ? true : false;
                this.statusValue = this.campaignData.basicDetails.status == "ONLINE" ? 'ONLINE' : 'OFFLINE';
                if (this.campaignData['basicDetails'].activityName == 'File Upload Segment Campaign') {
                    this.nonmemberCampaign = false;
                }
                else {
                    this.nonmemberCampaign = true;
                }
                this.finalQuery = this.campaignData.audience.segmentQuery;

                this.customerSelectedCount = this.campaignData.audience.customerSelctedCount;
                if (this.customerSelectedCount < 500 && this.customerSelectedCount >= 0) {
                    this.getCustomerBtnEnbale = true;
                }
                else {
                    this.getCustomerBtnEnbale = false;
                    this.downloadQuery = false;
                }

                if (this.campaignData.audience.segmentFilePath != null && this.campaignData.audience.segmentFilePath != '' && this.campaignData.audience.segmentFilePath != undefined) {
                    this.skuFileName = this.campaignData.audience.segmentFilePath.split("/").pop();
                }

                let temp;

                if (this.campaignData.content != "") {
                    this.campaignData.content[0].emailContent.emailContentLocale.forEach(element => {
                        this.genratedTemplate = this.sanitizer.bypassSecurityTrustHtml(element.content);
                        console.log(this.genratedTemplate)
                    });
                }
                this.checked = this.campaignData.basicDetails.status == 'ONLINE' ? true : false
                this.statusValue = this.campaignData.basicDetails.status == "ONLINE" ? 'ONLINE' : 'OFFLINE';;
                this.smsRestriction = this.campaignData.audience.smsRestriction;
                if (this.campaignData.audience.filePath != "") {
                    this.filePath = this.campaignData.audience.filePath;
                }

                this.communicationTypes = this.campaignData.basicDetails.communicationType;
                if (this.communicationTypes.includes('EMAIL')) {
                    this.emailChecked = true;
                }
                if (this.communicationTypes.includes('PUSH')) {
                    this.pushChecked = true;
                }
                if (this.communicationTypes.includes('SMS')) {
                    this.smsChecked = true;
                }
                this.includeArabicCustomers = this.campaignData.audience.includeArabicCustomers;
                if (this.includeArabicCustomers == true) {
                    this.renderer.addClass(this.document.body, 'embedded-body');
                } else {
                    this.renderer.removeClass(this.document.body, 'embedded-body');
                }
                this.campaignData.basicDetails.deliveryTime = moment(this.campaignData.basicDetails.deliveryTime, 'HH:mm').format('hh:mm A');

                if (this.campaignData.basicDetails.promotionType == 'RULE') {

                    if (this.campaignData.basicDetails.ruleType == 'EARN') {
                        this.getEarnRuleDataById(this.campaignData.basicDetails.attachedRuleId);
                    }
                    if (this.campaignData.basicDetails.ruleType == 'BURN') {
                        this.getBurnRuleDataById(this.campaignData.basicDetails.attachedRuleId);
                    }
                }
                else if (this.campaignData.basicDetails.promotionType == 'COUPON') {

                    this.getCouponDataById(this.campaignData.basicDetails.attachedCouponId);
                }

            }
                , err => {
                    this.snackBar.openFromComponent(SnackBarComponent, {
                        duration: 1500,
                        data: {
                            status: "failure",
                            message: "Your request cannot be view at this time. Please try again later"
                        }
                    });
                });
    }

    getEarnRuleDataById(param) {
        let GET_EARN_RULE_DATA_BY_ID = environment.APIEndpoint + "api/rpa/earnRule/v1/get";
        let request = {
            earnRuleId: param
        }
        this.http.postJson(GET_EARN_RULE_DATA_BY_ID, request)
            .subscribe((response) => {
                this.promotionData = response;
            }
                , err => {
                    this.snackBar.openFromComponent(SnackBarComponent, {
                        duration: 1500,
                        data: {
                            status: "failure",
                            message: "Your request cannot be view at this time. Please try again later"
                        }
                    });
                });
    }


    getCustomerList() {
        this.disableData = true;
        this.downloadQuery = true;

        let request = {
            segmentQuery: this.finalQuery,
        }
        let GET_QUERY = environment.APIEndpoint + "api/rpa/customer/segment/ca/v1/segmentfile/apply/rule";
        this.http.postJson(GET_QUERY, request).subscribe(
            (response) => {
                this.disableData = false;
                this.downloadQuery = false;
                this.customerSegmentFileapply = response;
                this.filePathCustomer = this.customerSegmentFileapply.filePath;
                this.download(this.filePathCustomer);
                if (this.filePathCustomer != '') {
                    this.customerSelectedCountAbove = true;
                    this.getCustomerBtnEnbale = true;
                }
                else {
                    this.customerSelectedCountAbove = false;
                    this.getCustomerBtnEnbale = false;
                    this.downloadQuery = false;

                }
            },
            (error) => {
                this.disableData = false;
                this.downloadQuery = false;
            }
        );
    }

    download(filepath) {
        var url = this.fileUrl + this.filePathCustomer;
        window.open(url, 'Download');
    }

    getBurnRuleDataById(param) {
        let GET_BURN_RULE_DATA_BY_ID = environment.APIEndpoint + "api/rpa/burnRule/v1/view";
        let request = {
            burnRuleId: param
        }
        this.http.postJson(GET_BURN_RULE_DATA_BY_ID, request)
            .subscribe((response) => {
                this.promotionData = response;
            }
                , err => {
                    this.snackBar.openFromComponent(SnackBarComponent, {
                        duration: 1500,
                        data: {
                            status: "failure",
                            message: "Your request cannot be view at this time. Please try again later"
                        }
                    });
                });
    }

    getCouponDataById(param) {
        let GET_COUPON_DATA_BY_ID = environment.APIEndpoint + "api/rpa/coupon/v1/get/couponcampaign";
        let request = {
            couponId: param
        }
        this.http.postJson(GET_COUPON_DATA_BY_ID, request)
            .subscribe((response) => {
                this.promotionData = response;
            }
                , err => {
                    this.snackBar.openFromComponent(SnackBarComponent, {
                        duration: 1500,
                        data: {
                            status: "failure",
                            message: "Your request cannot be view at this time. Please try again later"
                        }
                    });
                });
    }

    // addRule(){
    //     const dialogRef = this.dialog.open(addRulesDialog);
    // }
    // addCoupon(){
    //     const dialogRef = this.dialog.open(addCouponDialog);
    // }
    cloneCamp(ev) {
        // console.log(ev);
    }

    viewEarnRule(earnRuleId) {
        localStorage.setItem('ViewEarnID', earnRuleId);
        this.router.navigate(['/view-earn-rule']);
    }

    ViewBurnRule(burnRuleId) {
        localStorage.setItem('ViewBurnID', burnRuleId);
        this.router.navigate(['/view-burn-rule']);
    }

    EditCampaign(ID, type) {
        let data = ID + '-' + type;
        localStorage.setItem('EditCampaignID', data);
        this.router.navigate(['/edit-campaign']);
    }

    MoveToViewCoupons(ID) {
        localStorage.setItem('CouponViewID', ID);
        this.router.navigate(['/view-coupons'])
    }

    public toggleStatus(event) {
        if (event.checked == true) {
            this.statusValue = 'ONLINE';
        } else {
            this.statusValue = 'OFFLINE';
        }
        this.toggleStatusChange(this.statusValue);
    }

    toggleStatusChange(toggleVal) {
        let GET_CAMPAIGN_STATUS_CHANGE = environment.APIEndpoint + "api/rpa/campaign/v1/status/change";
        let request = {
            campaignId: this.campaignId,
            status: this.statusValue
        }
        this.http.postJson(GET_CAMPAIGN_STATUS_CHANGE, request).subscribe(
            (response) => {
                this.snackBar.openFromComponent(SnackBarComponent, {
                    duration: 1500,
                    data: {
                        status: "success",
                        message: "Status Change has been updated successfully"
                    }
                });
            },
            (error) => {
            }
        );
    }


    moveToPreviousUrl() {
        if (this.previousUrl.startsWith('/view-member')) {
            localStorage.setItem('memberCustomerId', this.viewMemId);
            this.router.navigate(['/view-member'])
        }
        else {
            this.router.navigate([this.previousUrl])
        }
    }

}
