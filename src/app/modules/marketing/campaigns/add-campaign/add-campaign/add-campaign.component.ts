import { Component, OnInit, ViewChild, ElementRef, Inject, Renderer2, QueryList, ViewChildren } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { FormControl, Validators, FormBuilder, FormGroup, NgForm, FormGroupDirective, FormArray, ValidatorFn, AbstractControl } from '@angular/forms';
import { HttpService } from 'src/app/services/http-service';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { ErrorStateMatcher } from '@angular/material/core';
import { MAT_STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { addRulesDialog } from '../../../../../shared/components/rule-dialog/add-rule.component';
import { addCouponDialog } from '../../../../../shared/components/coupon-dialog/add-coupon.component';
import { addAttributesDialog } from '../../../../../shared/components/attributes-dialog/attributes.component';
import { segmentRuleDialog } from '../../../../../shared/components/segment-rule-dialog/segment-rule.component';
import * as moment from 'moment';
import { SnackBarComponent } from 'src/app/shared/components/snack-bar/snack-bar.component';
import { MatSnackBar } from '@angular/material';
import { MatStepper } from '@angular/material/stepper';
import { ExtraValidators } from 'src/app/services/validator-service';
import { AddFlowDialogComponent } from 'src/app/shared/components/add-flow-dialog/add-flow-dialog.component';
import { UploadFile } from 'src/app/services/uploadFile.service';
import { Globals } from 'src/app/services/global';
import { EmojiModule } from '@ctrl/ngx-emoji-mart/ngx-emoji';
import { PickerModule } from '@ctrl/ngx-emoji-mart';
import { SelectCategoryDailogComponent } from 'src/app/shared/components/select-category-dailog/select-category-dailog.component';
import { SelectProductDailogComponent } from 'src/app/shared/components/select-product-dailog/select-product-dailog.component';

import { Observable, Subject } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

// for stripo
import { HttpClient } from '@angular/common/http';
import { EventDialogComponent } from 'src/app/shared/components/event-dialog/event-dialog.component';
declare var window: any;
// const STRIPO_AUTH_PATH = "https://plugins.stripo.email/api/v1/auth";
const STRIPO_AUTH_PATH = environment.APIEndpoint + "api/rpa/marketing/template/v1/token";
console.log(STRIPO_AUTH_PATH);


export interface Segment {
    segmentId: number;
    segmentName: string;
}

export interface Activity {
    id: number;
    value: string;
}


export interface Brand {
    brandId: number;
    brandName: string;
}
export interface pushTemplate {
    pushTemplateId: number;
    pushTemplateName: string;
}

export interface smsTemplate {
    smsTemplateId: number;
    smsTemplateName: string;
}

export interface emailTemplate {
    emailTemplateId: number;
    emailTemplateName: string;
}

export class MyErrorStateMatcher implements ErrorStateMatcher {
    isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
        const isSubmitted = form && form.submitted;
        return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
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

@Component({
    selector: 'add-campaign',
    templateUrl: './add-campaign.component.html',
    styleUrls: ['./add-campaign.component.scss'],
    providers: [{
        provide: MAT_STEPPER_GLOBAL_OPTIONS, useValue: { displayDefaultIndicatorType: false }
    }],
    host: {
        '(document:click)': 'onClick($event)',
    },
})



export class AddCampaignComponent implements OnInit {
    public scrollbarOptions = { axis: 'y', theme: 'minimal-dark' };
    public breadCrumbData: Array<Object> = [
        {
            title: 'Marketing',
            link: ''
        },
        {
            title: 'Add Campaigns',
            link: ''
        },
    ];

    public htmlContent: any;
    public templateHtml: any;
    public templateCss: any;
    panelOpenState = false;

    public prePopulateImg = [];
    public prePopulateImgSecond = [];
    public brandType: String = '';
    public linkToId;
    @ViewChild("createCampaignForm") createCampaignForm;
    @ViewChild("updateSegmentForm") updateSegmentForm;
    @ViewChildren('subInp', {read: ElementRef}) input : QueryList<ElementRef>;
    @ViewChildren('someTag', {read: ElementRef}) inputContent : QueryList<ElementRef>;
    firstFormGroup: FormGroup;
    secondFormGroup: FormGroup;
    thirdFormGroup: FormGroup;
    public activityValue;
    public activityId;
    public showError: boolean = false;
    public loading: boolean = false;
    public activities: any = [];
    public languages = JSON.parse(localStorage.getItem("languageList"));
    public segments: any = [];
    public pushData: any = [];
    public smsData: any = [];
    public emailData: any = [];
    public statusValue: string = 'ONLINE';
    public toggleVal: boolean = true;
    public optionsChecked: any = [];
    public campaignData: any = [];
    public segmentData: any = [];
    public emailChecked: boolean = false;
    public pushChecked: boolean = false;
    public smsChecked: boolean = false;
    public pushTemplateChecked: boolean = false;
    public smsTemplateChecked: boolean = false;
    public emailTemplateChecked: boolean = false;
    public segmentMemNonMem: boolean = false;
    public segmentName: string;
    public errorMesCampaign;
    public customersSelected: '';
    public emailCustomersSelected: '';
    public segmentQuery: '';
    public segmentAttrJson: string;
    public filePath: string;
    public notificationLimit: number
    public ruleCouponError: boolean = false;
    public minDate: Date = new Date();
    public couponData: any = [];
    public earnRuleData: any = [];
    public burnRuleData: any = [];
    public ruleType: string;
    public promotionType: string;
    public promotionId: number;
    public campaignId: number;
    public memberCamp: boolean = false;
    public campaignName: string;
    public campStartDate: string;
    public campEndDate: string;
    public activity: any;
    public communications: string;
    public commError: boolean = false;
    public promotionError: boolean = false;
    public segmentError: boolean = false;
    public dateError: boolean = false;
    public fixedScheduled = "fixed";
    public languageDirection = [];
    public langfield = [];
    public arbicInvalid = [];
    public langfieldname = [];
    public contentError: boolean = false;
    public prePopulateRemoveImg: boolean = false;
    public prePopulateRemoveImgSecond: boolean = false;
    public pushAttr;
    public smsAttr;
    public emailAttr;
    public err;
    public costomerError: boolean = false;
    public skuValidated: boolean = false;
    public boolCampaignVal: boolean = false;
    public senderList = [];
    public smsSenderList = [];
    public emailSenderList = [];
    public specificBrands = [];
    public nonMembercamp: boolean = false;
    public segmentTypeSelection: boolean = false;
    public fileUrl = localStorage.getItem("fileBaseUrl");
    public flowURL;
    public flowData;
    getEventEditor;
    getCursorPosition;
    contentSet;
    getRange;
    newNodeAdd;
    setUpTinyMce;
    setDataContent;
    loadingResponse: boolean = false;
    public segmentFileSucessFileData;
    public segmentFileErrorFileData;
    public segmentvalidMemberCount;
    public segmentinValidMemeberCount;
    public segmentfileValidateStatus;
    public skuFilePath = '';
    public skuFileName = '';
    public skuErrorFile = '';
    public skuErrorFileName = '';
    public manualFileRequired = false;
    public validCouponCode = false;
    public validCouponRequired = false;
    public skuRequired = false;
    public submitForm = true;
    public manualErrorFileName = '';
    skuRequiredError: boolean = false;
    public manualFileName = '';
    public manualErrorFile = '';
    public nonmemberData: any = [];
    public brandList;
    Brands: Brand[] = [];
    brandCtrl = new FormControl();
    filteredBrands: Observable<Brand[]>;
    @ViewChild('uploadFile') uploadManualXLSFile: ElementRef;
    @ViewChild('uploadSku') uploadSkuRef: ElementRef;
    public pushFileUploadHide: boolean = false;
    public validSkuFile = true;
    public validateSkuFile = false;
    public manualFilePath: any = [];
    public optionsArabicChecked: boolean = false;
    public errorFilePathUrl = localStorage.getItem("fileBaseUrl");
    public linkToIteamName : '';
    public linkToItemErr : boolean = false;

    pushList = [
        { value: 'Customer Profile', label: 'Customer Profile' },
        { value: 'My Transactions', label: 'My Transactions' },
        { value: 'Points Summary', label: 'Points Summary' },
        { value: 'Our Brands', label: 'Our Brands' },
        { value: 'Coupon', label: 'Coupons' },
        { value: 'Refer and Earn', label: 'Refer and Earn' },
        { value: 'Press Releases', label: 'Press Releases' },
        { value: 'FAQ', label: 'FAQ' },
        { value: 'Customer Tier', label: 'Customer Tier' },
        { value: 'Others', label: 'Others - Lands to Home screen' },
        { value: 'External Link', label: 'External Link' },
        { value: 'All Orders', label: 'All Orders' },
        { value: 'Menu', label: 'Menu' },
        { value: 'Stores', label: 'Stores' },
        { value: 'About Us', label: 'About Us' },
        { value: 'Schedule Order Page', label: 'Schedule Order Page' },
        { value: 'Rewards Dashboard', label: 'Rewards Dashboard' },
        { value: 'Scratch Card Listing Page', label: 'Scratch Card Listing Page' },
        { value: 'Hotsellers Category', label: 'Hotsellers Category' },
        { value: 'Exclusive', label: 'Exclusive' },
        { value: 'ime Bounded', label: 'ime Bounded' },
        { value: 'Healthy', label: 'Healthy' },
        { value: 'Product', label: 'Product' },
        { value: 'Category', label: 'Category' },
    ];

    frequencies: any = [
        { value: 'IMMEDIATE', viewValue: 'IMMEDIATE' },
        { value: 'ONE_TIME', viewValue: 'ONE TIME' },
        { value: 'DAILY', viewValue: 'DAILY' },
        { value: 'WEEKLY', viewValue: 'WEEKLY' },
        { value: 'MONTHLY', viewValue: 'MONTHLY' },
    ];

    segmentTypes = [
        { value: 'SEGMENT_MEMBER', viewValue: 'Upload Member CSV file' },
        { value: 'SEGMENT_NON_MEMBER', viewValue: 'Upload Non Member CSV file' },
        { value: 'SEGMENT_MEMBER_AND_NON_MEMBER', viewValue: 'Upload Member / Non Member CSV file', disabled: true },
        { value: 'SEGMENT_RULE', viewValue: 'Segment Rule', disabled: true },
    ];

    communicationTypes = [
        {
            viewValue: 'App-Push Notification',
            name: 'PUSH',
            checked: false,
            display: true
        },
        {
            viewValue: 'Email',
            name: 'EMAIL',
            checked: false,
            display: true
        },
        {
            viewValue: 'SMS',
            name: 'SMS',
            checked: false,
            display: true
        }
    ]

    isIncludeArabicText = [
        {
            viewValue: 'Yes',
            name: 'YES',
            checked: false,
        },
    ]

    weekDays = [

        {
            value: 'MON',
            viewValue: 'Monday'
        },
        {
            value: 'TUE',
            viewValue: 'Tuesday'
        },
        {
            value: 'WED',
            viewValue: 'Wednesday'
        },
        {
            value: 'THU',
            viewValue: 'Thursday'
        },
        {
            value: 'FRI',
            viewValue: 'Friday'
        },
        {
            value: 'SAT',
            viewValue: 'Saturday'
        },
        {
            value: 'SUN',
            viewValue: 'Sunday'
        }
    ];
    public segmentErrorMes;

    dates = [
        { date: '1', value: '1' },
        { date: '2', value: '2' },
        { date: '3', value: '3' },
        { date: '4', value: '4' },
        { date: '5', value: '5' },
        { date: '6', value: '6' },
        { date: '7', value: '7' },
        { date: '8', value: '8' },
        { date: '9', value: '9' },
        { date: '10', value: '10' },
        { date: '11', value: '11' },
        { date: '12', value: '12' },
        { date: '13', value: '13' },
        { date: '14', value: '14' },
        { date: '15', value: '15' },
        { date: '16', value: '16' },
        { date: '17', value: '17' },
        { date: '18', value: '18' },
        { date: '19', value: '19' },
        { date: '20', value: '20' },
        { date: '21', value: '21' },
        { date: '22', value: '22' },
        { date: '23', value: '23' },
        { date: '24', value: '24' },
        { date: '25', value: '25' },
        { date: '26', value: '26' },
        { date: '27', value: '27' },
        { date: '28', value: '28' },
        { date: '29', value: '29' },
        { date: '30', value: '30' },
        { date: '31', value: '31' },
    ];
    public selectedDaysOptions: any[];
    public selectedWeekdaysOptions: any[];
    fileTypeErr: boolean;
    otherAttr: any;
    brandattr: string;

    public selectfinalQuery: boolean = false;
    public downloadQuery: boolean = false;
    public customerSegmentFileapply: any = [];
    public customerfilePath: boolean = false;
    public filePathCustomer: string;
    public disableData: boolean = false;
    public getCustomerBtnEnbale: boolean = false;
    public customerSelectedCountAbove: boolean = false;
    public customerSelectedCount: number;
    public segmentIdValue;
    otherAttrContent: any;
    pushAttrContent: any;
    brandattrSubject: any;
    public segmentTypeValue;
    public segmentFileUploadValueError: boolean = false;
    public segmentDataObj;

    updateCheckedOptions() {
        this.optionsChecked = this.communicationTypes.filter(item => item.checked === true).map(item => item.name);
        if (this.emailChecked == true) {
            this.boolCampaignVal = true;
        }
        else {
            this.boolCampaignVal = false;
        }

        this.emailChecked = this.optionsChecked.includes('EMAIL') ? true : false;
        this.pushChecked = this.optionsChecked.includes('PUSH') ? true : false;
        this.smsChecked = this.optionsChecked.includes('SMS') ? true : false;

        if (this.smsChecked == true) {
            if (this.optionsArabicChecked === true) {
                let control = this.thirdFormGroup.get('smsLocaleArray') as FormArray;

                let smsDataValue1 = control['controls'][0]['controls'].content;
                smsDataValue1.setValidators([Validators.required]);
                smsDataValue1.updateValueAndValidity();

                let smsDataValue = control['controls'][1]['controls'].content;
                smsDataValue.setValidators([Validators.required]);
                smsDataValue.updateValueAndValidity();
            }
            else {
                let control = this.thirdFormGroup.get('smsLocaleArray') as FormArray;

                let smsDataValue1 = control['controls'][0]['controls'].content;
                smsDataValue1.setValidators([Validators.required]);
                smsDataValue1.updateValueAndValidity();

                let smsDataValue = control['controls'][1]['controls'].content;
                smsDataValue.clearValidators();
                smsDataValue.reset();
                smsDataValue.updateValueAndValidity();
            }
        }
        else {
            let control = this.thirdFormGroup.get('smsLocaleArray') as FormArray;
            let smsDataValue1 = control['controls'][0]['controls'].content;
            smsDataValue1.clearValidators();
            smsDataValue1.reset();
            smsDataValue1.updateValueAndValidity();

            let smsDataValue = control['controls'][1]['controls'].content;
            smsDataValue.clearValidators();
            smsDataValue.reset();
            smsDataValue.updateValueAndValidity();

            let smsSenderId = this.thirdFormGroup.controls.smsSenderId;
            smsSenderId.clearValidators();
            smsSenderId.reset();
            smsSenderId.updateValueAndValidity();
        }

        if (this.pushChecked == true) {
            if (this.optionsArabicChecked === true) {

                let control = this.thirdFormGroup.get('pushLocaleArray') as FormArray;

                let pushDataValue1 = control['controls'][0]['controls'].content;
                pushDataValue1.setValidators([Validators.required]);
                pushDataValue1.updateValueAndValidity();

                let pushDataValue = control['controls'][1]['controls'].content;
                pushDataValue.setValidators([Validators.required]);
                pushDataValue.updateValueAndValidity();

                let pushDataSubjectValue1 = control['controls'][0]['controls'].subject;
                pushDataSubjectValue1.setValidators([Validators.required]);
                pushDataSubjectValue1.updateValueAndValidity();

                let pushDataSubjectValue = control['controls'][1]['controls'].subject;
                pushDataSubjectValue.setValidators([Validators.required]);
                pushDataSubjectValue.updateValueAndValidity();
            }
            else {
                let control = this.thirdFormGroup.get('pushLocaleArray') as FormArray;

                let pushDataValue1 = control['controls'][0]['controls'].content;
                pushDataValue1.setValidators([Validators.required]);
                pushDataValue1.updateValueAndValidity();

                let pushDataValue = control['controls'][1]['controls'].content;
                pushDataValue.clearValidators();
                pushDataValue.reset();
                pushDataValue.updateValueAndValidity();

                let pushDataSubjectValue1 = control['controls'][0]['controls'].subject;
                pushDataSubjectValue1.setValidators([Validators.required]);
                pushDataSubjectValue1.updateValueAndValidity();

                let pushDataSubjectValue = control['controls'][1]['controls'].subject;
                pushDataSubjectValue.clearValidators();
                pushDataSubjectValue.reset();
                pushDataSubjectValue.updateValueAndValidity();
            }
        }
        else {
            let control = this.thirdFormGroup.get('pushLocaleArray') as FormArray;

            let pushDataValue1 = control['controls'][0]['controls'].content;
            pushDataValue1.clearValidators();
            pushDataValue1.reset();
            pushDataValue1.updateValueAndValidity();

            let pushDataValue = control['controls'][1]['controls'].content;
            pushDataValue.clearValidators();
            pushDataValue.reset();
            pushDataValue.updateValueAndValidity();


            let pushDataSubjectValue1 = control['controls'][0]['controls'].subject;
            pushDataSubjectValue1.clearValidators();
            pushDataSubjectValue1.reset();
            pushDataSubjectValue1.updateValueAndValidity();

            let pushDataSubjectValue = control['controls'][1]['controls'].subject;
            pushDataSubjectValue.clearValidators();
            pushDataSubjectValue.reset();
            pushDataSubjectValue.updateValueAndValidity();

            let pushLinkTo = this.thirdFormGroup.controls.pushLinkTo;
            pushLinkTo.clearValidators();
            pushLinkTo.reset();
            pushLinkTo.updateValueAndValidity();
        }

        if (this.emailChecked == true) {
            if (this.optionsArabicChecked === true) {
                let control = this.thirdFormGroup.get('emailLocaleArray') as FormArray;
                let emailDataValue1 = control['controls'][0]['controls'].content;
                emailDataValue1.setValidators([Validators.required]);
                emailDataValue1.updateValueAndValidity();

                let emailDataValue = control['controls'][1]['controls'].content;
                emailDataValue.setValidators([Validators.required]);
                emailDataValue.updateValueAndValidity();

                let emailDataSubjectValue1 = control['controls'][0]['controls'].subject;
                emailDataSubjectValue1.setValidators([Validators.required]);
                emailDataSubjectValue1.updateValueAndValidity();

                let emailDataSubjectValue = control['controls'][1]['controls'].subject;
                emailDataSubjectValue.setValidators([Validators.required]);
                emailDataSubjectValue.updateValueAndValidity();
            }
            else {
                let control = this.thirdFormGroup.get('emailLocaleArray') as FormArray;
                let emailDataValue1 = control['controls'][0]['controls'].content;
                emailDataValue1.setValidators([Validators.required]);
                emailDataValue1.updateValueAndValidity();

                let emailDataValue = control['controls'][1]['controls'].content;
                emailDataValue.clearValidators();
                emailDataValue.reset();
                emailDataValue.updateValueAndValidity();

                let emailDataSubjectValue1 = control['controls'][0]['controls'].subject;
                emailDataSubjectValue1.setValidators([Validators.required]);
                emailDataSubjectValue1.updateValueAndValidity();

                let emailDataSubjectValue = control['controls'][1]['controls'].subject;
                emailDataSubjectValue.clearValidators();
                emailDataSubjectValue.reset();
                emailDataSubjectValue.updateValueAndValidity();
            }
        }
        else {
            let control = this.thirdFormGroup.get('emailLocaleArray') as FormArray;

            let emailDataValue1 = control['controls'][0]['controls'].content;
            emailDataValue1.clearValidators();
            emailDataValue1.reset();
            emailDataValue1.updateValueAndValidity();

            let emailDataValue = control['controls'][1]['controls'].content;
            emailDataValue.clearValidators();
            emailDataValue.reset();
            emailDataValue.updateValueAndValidity();

            let emailDataSubjectValue1 = control['controls'][0]['controls'].subject;
            emailDataSubjectValue1.clearValidators();
            emailDataSubjectValue1.reset();
            emailDataSubjectValue1.updateValueAndValidity();

            let emailDataSubjectValue = control['controls'][1]['controls'].subject;
            emailDataSubjectValue.clearValidators();
            emailDataSubjectValue.reset();
            emailDataSubjectValue.updateValueAndValidity();


            let emailSenderId = this.thirdFormGroup.controls.emailSenderId;
            emailSenderId.clearValidators();
            emailSenderId.reset();
            emailSenderId.updateValueAndValidity();
        }

        this.communications = this.optionsChecked.join(",");
        this.commError = this.communications.length > 0 ? false : true;

    }

    public selectedIndex = 0;
    goBackToFirst(stepper: MatStepper, index: number) {
        if (this.optionsChecked.length == 0) {
            this.commError = true;
        } else {
            this.commError = false;
        }
        if (this.commError || this.firstFormGroup.invalid) {
            stepper.previous();
        }
        else {
            this.selectedIndex = index;
            stepper.next();
        }
    }

    getWeekDaysValue(ev) {
    }

    goBackToSecond(stepper: MatStepper) {
        let segmentId = this.secondFormGroup.get('segmentId');
        if (this.activityValue != 'File Upload Segment Campaign' && this.activityValue != 'Member File upload segment campaign') {
            if ((!this.segmentAttrJson || this.segmentAttrJson == undefined || this.customersSelected == '') && this.secondFormGroup.get('fixedScheduled').value != 'scheduled') {
                    segmentId.setValidators([Validators.required]);
                    segmentId.updateValueAndValidity();
            }
            else if (this.secondFormGroup.valid) {
                segmentId.clearValidators();
                segmentId.updateValueAndValidity();
                this.notificationLimit = this.secondFormGroup.get('notificationLimit').value;
                this.fixedScheduled = this.secondFormGroup.get('fixedScheduled').value;
                this.pushLocale(this.pushData);
                this.smsLocale(this.smsData);
                this.emailLocale(this.emailData);
                this.checkEmailData();
                stepper.next();
            }
        }
        else {
            if (this.activityValue != 'Member File upload segment campaign') {       
                this.segmentFileUploadValueError = false;
                if (this.segmentIdValue != '' && this.segmentIdValue != undefined) {
                    this.fixedScheduled = 'fixed';
                    this.pushLocale(this.pushData);
                    this.smsLocale(this.smsData);
                    this.emailLocale(this.emailData);
                    this.checkEmailData();
                    stepper.next();
                }
                else {
                    this.segmentFileUploadValueError = true;
                }
            }
            else {
                segmentId.clearValidators();
                segmentId.updateValueAndValidity();
                this.notificationLimit = this.secondFormGroup.get('notificationLimit').value;
                this.fixedScheduled = this.secondFormGroup.get('fixedScheduled').value;
                this.pushLocale(this.pushData);
                this.smsLocale(this.smsData);
                this.emailLocale(this.emailData);
                stepper.next();
            }
        }
    }

    public checkEmailData() {
        console.log(this.thirdFormGroup);
        if(this.thirdFormGroup.get('emailTemplate').value) {
          this.loadStripoScript();
        } else {
          this.loadStripoScriptByDefault();
        }
      }
    

    constructor(
        private formBuilder: FormBuilder, 
        private https: HttpService, 
        private http: HttpService, 
        private renderer: Renderer2,
        private router: Router, 
        public dialog: MatDialog, 
        public snackBar: MatSnackBar, 
        private uploadFile: UploadFile,
        private httpClient: HttpClient, 
        @Inject(DOCUMENT) private document: Document) {
    }

    ngOnInit() {
        this.getActivityList();
        this.getAllSenderList();
        this.getTemplateList();
        this.buildCampaignForm();
        this.buildSegmentForm();
        this.buildContentForm();
        this.setLocalStorageData();
        this.getAllRegionBrandsA();
        this.flowURL = window.location.href;
        this.flowURL = this.flowURL.replace(/\/.*/, '');

        this.setUpTinyMce = {
            plugins: 'code, preview ,customInsertButton ,print,fullpage, searchreplace, directionality, visualblocks, visualchars, fullscreen, image, link, media, template, codesample, table, charmap, hr, pagebreak, nonbreaking, anchor, toc, insertdatetime, advlist, lists, wordcount, imagetools, textpattern, help',
            toolbar: 'code preview',
            height: '480',

        }
    }

    ngAfterViewInit(): void {
        console.log(this.input);
        document.onclick = (args: any): void => {
            let emojiBox = false;
            emojiBox = args.target.parentElement.classList.contains('emoji-mart-emoji')
            if (args.target.id == 'emojiBtn' || args.target.parentElement.className == 'emoji-mart' || emojiBox) {
                return;
            } else {
                for (let i = 0; i < this.showEmojiPicker.length; i++) {
                    this.showEmojiPicker[i] = false;
                }
                emojiBox = false;
            }

            if ( args.target.id == 'emojiContentBtn' || args.target.parentElement.className == 'emoji-mart' || emojiBox) {
                return;
            } else {
                for (let i = 0; i < this.showEmojiPickerAppCOntent.length; i++) {
                    this.showEmojiPickerAppCOntent[i] = false;
                }
                emojiBox = false;
            }

        }
    }

    public setLocalStorageData() {
        let userData = JSON.parse(localStorage.getItem("userpermissions"));
        if (localStorage.countryData === undefined) {
            $.ajaxSetup({
                headers: {
                    'Authorization': userData.token_type + " " + userData.access_token,
                    'Content-Type': 'application/json'
                }
            });
            $.getJSON(environment.APIEndpoint + "api/rpa/master/country/v1/get/onlineCountries", function (data) {
                localStorage.countryData = JSON.stringify(data);
            });
        }

        if (localStorage.cityData === undefined) {
            $.ajaxSetup({
                headers: {
                    'Authorization': userData.token_type + " " + userData.access_token,
                    'Content-Type': 'application/json'
                }
            });
            $.getJSON(environment.APIEndpoint + "api/rpa/master/city/v1/list", function (data) {
                localStorage.cityData = JSON.stringify(data);
            });
        }

        if (localStorage.tierData === undefined) {
            $.ajaxSetup({
                headers: {
                    'Authorization': userData.token_type + " " + userData.access_token,
                    'Content-Type': 'application/json'
                }
            });
            $.getJSON(environment.APIEndpoint + "api/rpa/tier/v1/qualification/list", function (data) {
                localStorage.tierData = JSON.stringify(data);
            });
        }

        if (localStorage.brandData === undefined) {
            $.ajaxSetup({
                headers: {
                    'Authorization': userData.token_type + " " + userData.access_token,
                    'Content-Type': 'application/json'
                }
            });
            $.getJSON(environment.APIEndpoint + "api/rpa/master/brand/v1/get/brands", function (data) {
                localStorage.brandData = JSON.stringify(data);
            });
        }

        if (localStorage.currencyData === undefined) {
            $.ajaxSetup({
                headers: {
                    'Authorization': userData.token_type + " " + userData.access_token,
                    'Content-Type': 'application/json'
                }
            });
            $.getJSON(environment.APIEndpoint + "api/rpa/master/currency/v1/select", function (data) {
                localStorage.currencyData = JSON.stringify(data);
            });
        }

        if (localStorage.coupon === undefined) {
            $.ajaxSetup({
                headers: {
                    'Authorization': userData.token_type + " " + userData.access_token,
                    'Content-Type': 'application/json'
                }
            });
            $.getJSON(environment.APIEndpoint + "api/rpa/coupon/v1/list", function (data) {
                data.forEach(function (item) {
                    // let couponIdName = item.couponId + '-' + item.couponTitle;
                    // item['couponIdName'] = couponIdName;
                    item['couponIdName'] = item.couponId + '-' + item.couponTitle;
                });
                localStorage.coupon = JSON.stringify(data);
            });
        }

        if (localStorage.storeData === undefined) {
            $.ajaxSetup({
                headers: {
                    'Authorization': userData.token_type + " " + userData.access_token,
                    'Content-Type': 'application/json'
                }
            });
            $.get(environment.APIEndpoint + "api/rpa/store/v2/getAll", function (data) {
                localStorage.storeData = JSON.stringify(data);
            });
        }

        if (localStorage.mallData === undefined) {

            $.ajaxSetup({
                headers: {
                    'Authorization': userData.token_type + " " + userData.access_token,
                    'Content-Type': 'application/json'
                }
            });
            $.getJSON(environment.APIEndpoint + "api/rpa/master/mall/v1/get/malls?cityIds=", function (data) {
                localStorage.mallData = JSON.stringify(data);
            });
        }

        if (localStorage.emailCampiagnData === undefined) {
            $.ajaxSetup({
                headers: {
                    'Authorization': userData.token_type + " " + userData.access_token,
                    'Content-Type': 'application/json'
                }
            });
            $.getJSON(environment.APIEndpoint + "api/rpa/campaign/v1/getCampiagn?communicationType=Email", function (data) {
                localStorage.emailCampiagnData = JSON.stringify(data);
            });
        }

        if (localStorage.smsCampiagnData === undefined) {
            $.ajaxSetup({
                headers: {
                    'Authorization': userData.token_type + " " + userData.access_token,
                    'Content-Type': 'application/json'
                }
            });
            $.getJSON(environment.APIEndpoint + "api/rpa/campaign/v1/getCampiagn?communicationType=SMS", function (data) {
                localStorage.smsCampiagnData = JSON.stringify(data);
            });
        }

        if (localStorage.campiagnData === undefined) {
            $.ajaxSetup({
                headers: {
                    'Authorization': userData.token_type + " " + userData.access_token,
                    'Content-Type': 'application/json'
                }
            });
            $.getJSON(environment.APIEndpoint + "api/rpa/campaign/v1/getCampiagn", function (data) {
                // data.forEach(function (item) {
                //     let campIdName = item.campaignId + '-' + item.campaignName;
                //     item['campIdName'] = campIdName;
                // });
                localStorage.campiagnData = JSON.stringify(data);
            });
        }
    }


    public buildCampaignForm() {

        this.firstFormGroup = this.formBuilder.group({
            activity: ['', Validators.compose([Validators.required])],
            campaignName: ['', Validators.compose([Validators.required])],
            campaignDesc: ['', Validators.compose([Validators.required])],
            communication: [''],
            endDate: ['', Validators.compose([Validators.required])],
            startDate: ['', Validators.compose([Validators.required])],
            deliveryFrequency: ['', Validators.compose([Validators.required])],
            deliveryDate: ['', Validators.compose([ExtraValidators.conditional(
                group => this.firstFormGroup.get('deliveryFrequency').value === 'ONE_TIME',
                Validators.required
            )])],
            deliveryTime: ['', Validators.compose([ExtraValidators.conditional(
                group => (this.firstFormGroup.get('deliveryFrequency').value == 'ONE_TIME'
                    || this.firstFormGroup.get('deliveryFrequency').value == 'DAILY'
                    || this.firstFormGroup.get('deliveryFrequency').value == 'WEEKLY'
                    || this.firstFormGroup.get('deliveryFrequency').value == 'MONTHLY'),
                Validators.required
            )])],
            deliveryWeekDay: ['', Validators.compose([ExtraValidators.conditional(
                group => this.firstFormGroup.get('deliveryFrequency').value === 'WEEKLY',
                Validators.required
            )])],
            deliveryMonthDay: ['', Validators.compose([ExtraValidators.conditional(
                group => this.firstFormGroup.get('deliveryFrequency').value === 'MONTHLY',
                Validators.required
            )])]
        });

    }

    public tempSelected: any;

    updateCheckedArabicOptions(item) {

        console.log('item arabic>>>>>',item);

        this.optionsArabicChecked = item.checked;
        this.tempSelected = item.checked;
        if (this.optionsArabicChecked == true) {
            this.renderer.addClass(this.document.body, 'embedded-body');
            console.log('i m from if>>>>>',item);

        } else {
            this.renderer.removeClass(this.document.body, 'embedded-body');
            console.log('i m from else>>>>>',item);


        }
    }

    public getCampaignData() {
        this.campaignName = this.firstFormGroup.get('campaignName').value;
        this.campStartDate = this.firstFormGroup.get('startDate').value != "" ? moment(this.firstFormGroup.get('startDate').value).format('DD-MM-YYYY') : moment(new Date()).format('DD-MM-YYYY');
        this.campEndDate = this.firstFormGroup.get('endDate').value != "" ? moment(this.firstFormGroup.get('endDate').value).format('DD-MM-YYYY') : moment(new Date()).format('DD-MM-YYYY');
        this.activities.forEach(activity => {
            if (activity.id == this.activityId) {
                this.activity = activity.value;

                if (null !== activity && activity.value === "File Upload Segment Campaign") {
                    this.nonMembercamp = true;
                    this.segmentTypeSelection = false;
                    this.communicationTypes.map(obj => {
                        if (obj.name == "PUSH") {
                            obj.display = false;
                        }
                    });
                }
                else if (null !== activity && activity.value === "Member File upload segment campaign") {
                    this.nonMembercamp = false;
                    this.memberCamp = false;
                    this.segmentTypeSelection = true;
                    this.communicationTypes.map(obj => { obj.display = true });
                }
                else {
                    this.nonMembercamp = false;
                    this.segmentTypeSelection = true;
                    this.communicationTypes.map(obj => { obj.display = true });
                }
            }
        });
        let d1 = new Date(this.firstFormGroup.get('startDate').value);
        let d2 = new Date(this.firstFormGroup.get('endDate').value);
        this.dateError = d1 > d2 ? true : false;
    }

    public getSegmentData(selectedValue) {
        if (this.segmentTypeValue == 'SEGMENT_RULE') {
            if (this.emailChecked == true) {
                this.boolCampaignVal = true;
            }
            else {
                this.boolCampaignVal = false;
            }
            this.selectfinalQuery = true;
            this.disableData = true;
            let request = {
                segmentId: selectedValue,
                boolCampaign: this.boolCampaignVal
            }

            let segmentData: any;

            let GET_SEGEMENT_DATA_BY_ID = environment.APIEndpoint + "api/rpa/campaign/v1/segment/rule";
            this.https.postJson(GET_SEGEMENT_DATA_BY_ID, request).subscribe(res => {
                console.log(res);
                this.selectfinalQuery = false;
                this.disableData = false;
                segmentData = res;
                this.segmentName = segmentData.segmentName;
                this.customersSelected = segmentData.customerSelctedCount;
                this.customerSelectedCount = segmentData.customerSelctedCount;
                this.emailCustomersSelected = segmentData.selectedEmailCount;
                this.segmentQuery = segmentData.segmentQuery;
                this.segmentAttrJson = segmentData.segmentAttrJson;
                if (this.customerSelectedCount < 500 && this.customerSelectedCount >= 0) {
                    this.getCustomerBtnEnbale = true;
                }
                else {
                    this.getCustomerBtnEnbale = false;
                    this.downloadQuery = false;
                }
                if (segmentData.filePath != "") {
                    this.filePath = segmentData.filePath;
                }
                else {
                    this.filePath = "";
                }

                this.secondFormGroup.patchValue({
                    segmentId: segmentData.segmentId,
                    segmentDesc: segmentData.segmentDescription,
                })

                this.segmentError = false;

            }, err => {
                this.selectfinalQuery = false;
                this.disableData = false;
            });
        } else {
            this.segmentFileUploadValueError = false;
        }
    }

    getSegmentValue(segment) {
        this.segmentFileUploadValueError = false;
        this.segmentFileSucessFileData = segment.successFilePath;
        this.segmentFileErrorFileData = segment.errorFilePath;
        this.segmentvalidMemberCount = segment.validMemberCount;
        this.segmentinValidMemeberCount = segment.inValidMemeberCount;
        this.segmentfileValidateStatus = segment.fileValidateStatus;
        this.customerSelectedCount = segment.userCount;
        this.segmentIdValue = segment.segmentId;
    }

    public buildSegmentForm() {
        this.secondFormGroup = this.formBuilder.group({
            segmentId: [''],
            segmentDesc: [''],
            isIncludeArabic: [''],
            notificationLimit: ['', Validators.compose([Validators.required, Validators.min(1)])],
            segmentType: ['', Validators.compose([Validators.required])],
            fixedScheduled: [''],
            smsRestriction: [''],
        });
    }

    public updateValidation(value: any) {
        if (value == 'ONE_TIME') {
            // alert("yes i am here to clear one_time");
            let startDate = this.firstFormGroup.get('startDate');
            let endDate = this.firstFormGroup.get('endDate');
            startDate.clearValidators();
            startDate.updateValueAndValidity();
            endDate.clearValidators();
            endDate.updateValueAndValidity();
        }
        if (value == 'IMMEDIATE') {
            // alert("yes i am here to clear immidiate");
            let startDate = this.firstFormGroup.get('startDate');
            let endDate = this.firstFormGroup.get('endDate');
            startDate.clearValidators();
            startDate.updateValueAndValidity();
            endDate.clearValidators();
            endDate.updateValueAndValidity();
        }
        this.selectedDaysOptions = [];
        this.selectedWeekdaysOptions = [];
    }

    public updateValidationHyperLink(value: any) {
        if (value == 'External Link') {
            let linkTo = this.thirdFormGroup.get('pushHyperLink');
            linkTo.setValidators([Validators.required]);
            linkTo.updateValueAndValidity();
        } else {
            let linkto = this.thirdFormGroup.get('pushHyperLink');
            linkto.clearValidators();
            linkto.updateValueAndValidity();
        }
        if(value == 'Product' || value == 'Category'){
            this.linkToId = ''
            this.linkToIteamName = ''
        }
    }

    public buildContentForm() {
        this.thirdFormGroup = this.formBuilder.group({
            pushTemplate: [''],
            smsTemplate: [''],
            emailTemplate: [''],
            emailSenderId: ['', Validators.compose([ExtraValidators.conditional(group => this.emailChecked === true, Validators.required), Validators.pattern('[a-zA-Z0-9.-_]{1,}@[a-zA-Z.-]{2,}[.]{1}[a-zA-Z]{2,}')])],
            smsSenderId: ['', Validators.compose([ExtraValidators.conditional(group => this.smsChecked === true, Validators.required)])],
            pushLinkTo: ['', Validators.compose([ExtraValidators.conditional(group => this.pushChecked === true, Validators.required)])],
            specificBrand: ['', Validators.compose([ExtraValidators.conditional(group => this.thirdFormGroup.get('pushLinkTo').value === 'Our Brands',
                Validators.required)])],
            pushHyperLink: [''],
            smsHyperLink: [''],
            emailHyperLink: [''],
            pushLocaleArray: this.formBuilder.array([]),
            smsLocaleArray: this.formBuilder.array([]),
            emailLocaleArray: this.formBuilder.array([]),

        });

        this.pushLocale(this.pushData);
        this.smsLocale(this.smsData);
        this.emailLocale(this.emailData);

    }

    public pushLocale(pushData) {
        const control = <FormArray>this.thirdFormGroup.controls['pushLocaleArray'];
        try {
            control.removeAt(0);
            control.removeAt(1);
        } catch{

        }
        control.controls = [];

        this.imagePath = [];
        this.imagePathTwo = [];
        this.uploadFlag = [];
        this.storeImgFlag = [];
        this.uploadError = [];
        
        if (this.optionsArabicChecked == true) {

        }
        for (let i = 0; i < this.languages.length; i++) {
            if (this.optionsArabicChecked === true) {
                const control = <FormArray>this.thirdFormGroup.controls['pushLocaleArray'];
                let newForm = this.formBuilder.group({
                    subject: ['', Validators.compose([ExtraValidators.conditional(group => this.pushChecked === true, Validators.required)])],
                    content: ['', Validators.compose([ExtraValidators.conditional(group => this.pushChecked === true, Validators.required)])],
                    languageId: this.languages[i].languageName,
                    // campaingnPushImage: [''],
                });
                control.push(newForm);
                this.languageDirection.push(this.languages[i].direction == 'RTL' ? 'direction' : '');
                this.langfield.push(this.languages[i].direction == 'RTL' ? 'text-right' : '');
                this.langfieldname.push(this.languages[i].direction == 'RTL' ? 'lang-field-name' : '');
                this.arbicInvalid.push(this.languages[i].direction == 'RTL' ? 'arabicCheck' : 'mat-card');
                this.showEmojiPicker.push(false);
                this.textAreaAppContent.push('');
                this.textAreaAppSubject.push('');
            }

            else {

                if (this.languages[i].direction == 'LTR') {
                    const control = <FormArray>this.thirdFormGroup.controls['pushLocaleArray'];
                    let newForm = this.formBuilder.group({
                        subject: ['', Validators.compose([ExtraValidators.conditional(group => this.pushChecked === true, Validators.required)])],
                        content: ['', Validators.compose([ExtraValidators.conditional(group => this.pushChecked === true, Validators.required)])],
                        languageId: this.languages[i].languageName,
                        // campaingnPushImage: [''],
                    });
                    control.push(newForm);
                    this.languageDirection.push(this.languages[i].direction == 'RTL' ? 'direction' : '');
                    this.langfield.push(this.languages[i].direction == 'RTL' ? 'direction' : '');
                    this.langfieldname.push(this.languages[i].direction == 'RTL' ? 'direction' : '');
                    this.arbicInvalid.push(this.languages[i].direction == 'RTL' ? 'arabicCheck' : 'mat-card');
                    this.showEmojiPicker.push(false);
                    this.textAreaAppContent.push('');
                    this.textAreaAppSubject.push('');
                }
                else {
                    const control = <FormArray>this.thirdFormGroup.controls['pushLocaleArray'];
                    let newForm = this.formBuilder.group({
                        subject: ['',],
                        content: ['',],
                        languageId: this.languages[i].languageName,
                        // campaingnPushImage: [''],
                    });
                    control.push(newForm);
                    this.languageDirection.push(this.languages[i].direction == 'RTL' ? 'direction' : '');
                    this.langfield.push(this.languages[i].direction == 'RTL' ? 'direction' : '');
                    this.langfieldname.push(this.languages[i].direction == 'RTL' ? 'direction' : '');
                    this.arbicInvalid.push(this.languages[i].direction == 'RTL' ? 'arabicCheck' : 'mat-card');
                    this.showEmojiPicker.push(false);
                    this.textAreaAppContent.push('');
                    this.textAreaAppSubject.push('');
                }
            }
        }
        // }




        if (pushData["marketingTemplateLocales"] != undefined) {
            console.log(pushData["marketingTemplateLocales"]);
            for (let i = 0; i < pushData.marketingTemplateLocales.length; i++) {
                const item = <FormArray>this.thirdFormGroup.controls['pushLocaleArray'];
                this.textAreaAppSubject[i] = pushData.marketingTemplateLocales[i].subject;
                this.textAreaAppContent[i] = pushData.marketingTemplateLocales[i].content;
                item.at(i).patchValue({
                    subject: this.textAreaAppSubject[i],
                    content: this.textAreaAppContent[i],
                    languageId: pushData.marketingTemplateLocales[i].languageName,
                    // imagePath: pushData.marketingTemplateLocales[i].imagePath
                })
                console.log(pushData.marketingTemplateLocales[i].imagePathTwo);
                this.imagePath[i] = pushData.marketingTemplateLocales[i].imagePath;
                this.imagePathTwo[i] = pushData.marketingTemplateLocales[i].imagePathTwo;

                if (this.imagePath[i] != '') {
                    this.prePopulateImg.push(true);
                    this.uploadFlag.push(true);
                    this.prePopulateRemoveImg = true;
                }
                else {
                    this.prePopulateImg.push(false);
                    this.uploadFlag.push(false);
                    this.prePopulateRemoveImg = false;
                }

                if (this.imagePathTwo[i] != '') {
                    this.prePopulateImgSecond.push(true);
                    this.storeImgFlag.push(true);
                    this.prePopulateRemoveImgSecond = true;
                }
                else {
                    this.prePopulateImgSecond.push(false);
                    this.storeImgFlag.push(false);
                    this.prePopulateRemoveImgSecond = false;
                }
                // this.imagePath.push(pushData.marketingTemplateLocales[i].imagePath = this.imagePath[i]);

            }
        }

        for (let l of this.languages) {
            this.uploadFlag.push(false);
            this.uploadError.push(false);
            this.imagePath.push('');
            this.imagePathTwo.push('');
            this.storeImgFlag.push(false);
        }
    }

    public smsLocale(smsData) {

        const control = <FormArray>this.thirdFormGroup.controls['smsLocaleArray'];
        try {
            control.removeAt(0);
            control.removeAt(1);
        } catch{

        }
        control.controls = [];



        // if (smsData.length == 0) {
        for (let ln of this.languages) {
            if (this.optionsArabicChecked === true) {
                const control = <FormArray>this.thirdFormGroup.controls['smsLocaleArray'];
                let newForm = this.formBuilder.group({
                    content: ['', Validators.compose([Validators.pattern(Globals.regCustomwhiteList), ExtraValidators.conditional(group => this.smsChecked === true, Validators.required)])],
                    languageId: [],
                    campaingnSMSImage: [''],
                });
                control.push(newForm);
                this.arbicInvalid.push(ln.direction == 'RTL' ? 'arabicCheck' : 'mat-card');
            }
            else {
                if (ln.direction == 'LTR') {
                    const control = <FormArray>this.thirdFormGroup.controls['smsLocaleArray'];
                    let newForm = this.formBuilder.group({
                        content: ['', Validators.compose([ExtraValidators.conditional(group => this.smsChecked === true, Validators.required)])],
                        languageId: ln.languageName,
                        // campaingnPushImage: [''],
                    });
                    control.push(newForm);
                    this.languageDirection.push(ln.direction == 'RTL' ? 'direction' : '');
                    this.langfield.push(ln.direction == 'RTL' ? 'text-right' : '');
                    this.langfieldname.push(ln.direction == 'RTL' ? 'lang-field-name' : '');
                    this.arbicInvalid.push(ln.direction == 'RTL' ? 'arabicCheck' : 'mat-card');
                }
                else {
                    const control = <FormArray>this.thirdFormGroup.controls['smsLocaleArray'];
                    let newForm = this.formBuilder.group({
                        content: [],
                        languageId: ln.languageName,
                        // campaingnPushImage: [''],
                    });
                    control.push(newForm);
                    this.languageDirection.push(ln.direction == 'RTL' ? 'direction' : '');
                    this.langfield.push(ln.direction == 'RTL' ? 'text-right' : '');
                    this.langfieldname.push(ln.direction == 'RTL' ? 'lang-field-name' : '');
                    this.arbicInvalid.push(ln.direction == 'RTL' ? 'arabicCheck' : 'mat-card');

                }
            }
        }
        // }

        if (smsData["marketingTemplateLocales"] != undefined) {
            for (let i = 0; i < smsData.marketingTemplateLocales.length; i++) {
                const item = <FormArray>this.thirdFormGroup.controls['smsLocaleArray'];
                item.at(i).patchValue({
                    content: smsData.marketingTemplateLocales[i].content,
                    languageId: smsData.marketingTemplateLocales[i].languageName
                })
            }
        }

        // if (smsData.length != 0) {

        // }

    }
    public emailLocale(emailData) {

        const control = <FormArray>this.thirdFormGroup.controls['emailLocaleArray'];
        try {
            control.removeAt(0);
            control.removeAt(1);
        } catch{

        }
        control.controls = [];

        // if (emailData.length == 0) {
        for (let ln of this.languages) {
            if (this.optionsArabicChecked === true) {
                const control = <FormArray>this.thirdFormGroup.controls['emailLocaleArray'];
                let newForm = this.formBuilder.group({
                    subject: ['', Validators.compose([ExtraValidators.conditional(group => this.emailChecked === true, Validators.required)])],
                    content: ['', Validators.compose([ExtraValidators.conditional(group => this.emailChecked === true, Validators.required)])],
                    languageId: [],
                    templateHtml: [''],
                    templateCss: ['']
                });
                control.push(newForm);
                this.languageDirection.push(ln.direction == 'RTL' ? 'direction' : '');
                this.langfield.push(ln.direction == 'RTL' ? 'text-right' : '');
                this.langfieldname.push(ln.direction == 'RTL' ? 'lang-field-name' : '');
                this.arbicInvalid.push(ln.direction == 'RTL' ? 'arabicCheck' : 'mat-card');

            }
            else {
                if (ln.direction == 'LTR') {
                    const control = <FormArray>this.thirdFormGroup.controls['emailLocaleArray'];
                    let newForm = this.formBuilder.group({
                        subject: ['', Validators.compose([ExtraValidators.conditional(group => this.emailChecked === true, Validators.required)])],
                        content: ['', Validators.compose([ExtraValidators.conditional(group => this.emailChecked === true, Validators.required)])],
                        languageId: [],
                        templateHtml: [''],
                        templateCss: ['']
                    });
                    control.push(newForm);
                    this.arbicInvalid.push(ln.direction == 'RTL' ? 'arabicCheck' : 'mat-card');

                }
                else {
                    const control = <FormArray>this.thirdFormGroup.controls['emailLocaleArray'];
                    let newForm = this.formBuilder.group({
                        subject: ['',],
                        content: ['',],
                        languageId: [],
                        templateHtml: [''],
                        templateCss: ['']
                    });
                    control.push(newForm);
                    this.languageDirection.push(ln.direction == 'RTL' ? 'direction' : '');
                    this.langfield.push(ln.direction == 'RTL' ? 'text-right' : '');
                    this.langfieldname.push(ln.direction == 'RTL' ? 'lang-field-name' : '');
                    this.arbicInvalid.push(ln.direction == 'RTL' ? 'arabicCheck' : 'mat-card');

                }
            }
        }
        // }


        if (emailData["marketingTemplateLocales"] != undefined) {
            for (let i = 0; i < emailData.marketingTemplateLocales.length; i++) {
                const item = <FormArray>this.thirdFormGroup.controls['emailLocaleArray'];
                item.at(i).patchValue({
                    subject: emailData.marketingTemplateLocales[i].subject,
                    content: emailData.marketingTemplateLocales[i].content,
                    languageId: emailData.marketingTemplateLocales[i].languageName,
                    templateHtml: emailData.marketingTemplateLocales[i].templateHtml,
                    templateCss: emailData.marketingTemplateLocales[i].templateCss
                })
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

    getActivityList() {
        let GET_ACTIVITY_LIST = environment.APIEndpoint + "api/rpa/campaign/v1/activity/list";
        this.https.getJson(GET_ACTIVITY_LIST)
            .subscribe((response) => {
                this.activities = response;
            }
                , err => {
                });
    }

    public segmentList;
    Segments: Segment[] = [];
    segmentCtrl = new FormControl();
    filteredsegments: Observable<Segment[]>;

    segmentTypeSelectionObj(data) {
        this.segmentDataObj = data;
    }

    public segmentChanges(ev) {
        this.segmentTypeValue = ev;
        this.getSegmentList(this.segmentTypeValue);
        if (this.segmentTypeValue == 'SEGMENT_MEMBER_AND_NON_MEMBER') {
            this.segmentMemNonMem = true;
        } else {
            this.segmentMemNonMem = false;
        }
        this.segmentTypeValue = '';
        this.segmentCtrl.reset('');
        this.Segments = [];
    }

    getSegmentList(segmentTypeValue) {
        let GET_ACTIVITY_LIST = environment.APIEndpoint + "api/rpa/customer/segment/v1/get/SegmentRuleListOnSegmentType/" + this.segmentTypeValue;
        this.https.getJson(GET_ACTIVITY_LIST)
            .subscribe((response) => {
                this.segmentList = response;

                for (let i = 0; i <= this.segmentList.length - 1; i++) {
                    let objMallkey = {
                        segmentId: this.segmentList[i]['segmentRuleOid'],
                        segmentName: this.segmentList[i]['segmentName'],
                        filePath: this.segmentList[i]['filePath'],
                        segmentType: this.segmentList[i]['segmentType'],
                        successFilePath: this.segmentList[i]['successFilePath'],
                        userCount: this.segmentList[i]['userCount'],

                        errorFilePath: this.segmentList[i]['errorFilePath'],
                        errorMsg: this.segmentList[i]['errorMsg'],
                        fileValidateStatus: this.segmentList[i]['fileValidateStatus'],
                        inValidMemeberCount: this.segmentList[i]['inValidMemeberCount'],
                        isErrorRecord: this.segmentList[i]['isErrorRecord'],
                        segmentAttrJson: this.segmentList[i]['segmentAttrJson'],
                        segmentQuery: this.segmentList[i]['segmentQuery'],
                        validMemberCount: this.segmentList[i]['validMemberCount'],

                    }

                    this.Segments.push(objMallkey);
                }
                this.filteredsegments = this.segmentCtrl.valueChanges
                    .pipe(
                        startWith(''),
                        map(segment => segment ? this._filterSegments(segment) : this.Segments.slice())
                    );
            },
                (error) => {
                    this.Segments = [];
                });
    }

    private _filterSegments(value: string): Segment[] {
        const filterValue = value.toLowerCase();
        return this.Segments.filter(segment => segment.segmentName.toLowerCase().indexOf(filterValue) === 0);
    }

    public selectedsegmentId
    getsegmentId(segmentId) {
        this.selectedsegmentId = segmentId;
    }

    pushTemplates: pushTemplate[] = [];
    pushTemplateCtrl = new FormControl();
    filteredpushTemplates: Observable<pushTemplate[]>;

    smsTemplates: smsTemplate[] = [];
    smsTemplateCtrl = new FormControl();
    filteredsmsTemplates: Observable<smsTemplate[]>;

    emailTemplates: emailTemplate[] = [];
    emailTemplateCtrl = new FormControl();
    filteredemailTemplates: Observable<emailTemplate[]>;

    getTemplateList() {

        let GET_TEMPLATE_LIST = environment.APIEndpoint + "api/rpa/marketing/template/v1/list";
        let request1 = {
            templateType: 'PUSH'
        }
        let request2 = {
            templateType: 'SMS'
        }
        let request3 = {
            templateType: 'EMAIL'
        }

        this.https.postJson(GET_TEMPLATE_LIST, request1)
            .subscribe((response) => {
                this.pushData = response;
                console.log(this.pushData);
                for (let i = 0; i <= this.pushData.length - 1; i++) {
                    let objMallkey = {
                        pushTemplateId: this.pushData[i]['templateId'],
                        pushTemplateName: this.pushData[i]['templateName'],
                    }
                    this.pushTemplates.push(objMallkey);
                }
                this.filteredpushTemplates = this.pushTemplateCtrl.valueChanges
                    .pipe(
                        startWith(''),
                        map(pushTemplate => pushTemplate ? this._filterpushTemplates(pushTemplate) : this.pushTemplates.slice())
                    );
            },
                err => {
                });
        this.https.postJson(GET_TEMPLATE_LIST, request2)
            .subscribe((response) => {
                this.smsData = response;
                for (let i = 0; i <= this.smsData.length - 1; i++) {
                    let objMallkey = {
                        smsTemplateId: this.smsData[i]['templateId'],
                        smsTemplateName: this.smsData[i]['templateName'],
                    }
                    this.smsTemplates.push(objMallkey);
                }
                this.filteredsmsTemplates = this.smsTemplateCtrl.valueChanges
                    .pipe(
                        startWith(''),
                        map(smsTemplate => smsTemplate ? this._filtersmsTemplates(smsTemplate) : this.smsTemplates.slice())
                    );

            }
                , err => {
                });
        this.https.postJson(GET_TEMPLATE_LIST, request3)
            .subscribe((response) => {
                this.emailData = response;

                for (let i = 0; i <= this.emailData.length - 1; i++) {
                    let objMallkey = {
                        emailTemplateId: this.emailData[i]['templateId'],
                        emailTemplateName: this.emailData[i]['templateName'],
                    }

                    this.emailTemplates.push(objMallkey);
                }
                this.filteredemailTemplates = this.emailTemplateCtrl.valueChanges
                    .pipe(
                        startWith(''),
                        map(emailTemplate => emailTemplate ? this._filteremailTemplates(emailTemplate) : this.emailTemplates.slice())
                    );
            }
                , err => {
                });
    }

    private _filterpushTemplates(value: string): pushTemplate[] {
        const filterValue = value.toLowerCase();
        return this.pushTemplates.filter(pushTemplate => pushTemplate.pushTemplateName.toLowerCase().indexOf(filterValue) === 0);
    }

    private _filtersmsTemplates(value: string): smsTemplate[] {
        const filterValue = value.toLowerCase();
        return this.smsTemplates.filter(smsTemplate => smsTemplate.smsTemplateName.toLowerCase().indexOf(filterValue) === 0);
    }
    private _filteremailTemplates(value: string): emailTemplate[] {
        const filterValue = value.toLowerCase();
        return this.emailTemplates.filter(emailTemplate => emailTemplate.emailTemplateName.toLowerCase().indexOf(filterValue) === 0);
    }

    public selectedPushValue;

    onPushChange(selectedValue) {
        this.selectedPushValue = selectedValue;
        this.pushTemplateChecked = true;
        this.pushData.forEach(push => {
            if (push.templateId == selectedValue) {
                this.thirdFormGroup.patchValue({
                    pushHyperLink: push.hyperLink
                })
                console.log(push);
                this.pushLocale(push);
            }
        });
    }

    getPushData(push) {
        for (let i = 0; i < push.marketingTemplateLocales.length; i++) {
            const item = <FormArray>this.thirdFormGroup.controls['pushLocaleArray'];
            item.at(i).patchValue({
                subject: push.marketingTemplateLocales[i].subject,
                content: push.marketingTemplateLocales[i].content,
                languageId: push.marketingTemplateLocales[i].languageName,
                // imagePath: push.marketingTemplateLocales[i].imagePath
            })

            this.imagePath[i] = push.marketingTemplateLocales[i].imagePath;
            this.imagePathTwo[i] = push.marketingTemplateLocales[i].imagePathTwo;

            if (this.imagePath[i] != '') {
                this.prePopulateImg.push(true);
                this.uploadFlag.push(true);
                this.prePopulateRemoveImg = true;
            }
            else {
                this.prePopulateImg.push(false);
                this.uploadFlag.push(false);
                this.prePopulateRemoveImg = false;
            }
            if (this.imagePathTwo[i] != '') {
                this.prePopulateImgSecond.push(true);
                this.storeImgFlag.push(true);
                this.prePopulateRemoveImgSecond = true;
            }
            else {
                this.prePopulateImgSecond.push(false);
                this.storeImgFlag.push(false);
                this.prePopulateRemoveImgSecond = false;
            }
        }
    }

    public selectedSMSValue;
    onSMSChange(selectedValue) {
        this.selectedSMSValue = selectedValue;
        this.smsTemplateChecked = true;
        this.smsData.forEach(sms => {
            if (sms.templateId == selectedValue) {
                this.thirdFormGroup.patchValue({
                    smsHyperLink: sms.hyperLink
                });
                this.smsLocale(sms);
            }
        });
    }
    public selectedEmailValue;
    onEmailChange(selectedValue) {
        this.selectedEmailValue = selectedValue;
        this.loadStripoScript();
        this.emailTemplateChecked = true;
        this.emailData.forEach(email => {
            if (email.templateId == selectedValue) {
                this.thirdFormGroup.patchValue({
                    emailHyperLink: email.hyperLink
                })
                this.emailLocale(email);
                this.htmlContent = email.marketingTemplateLocales[0].content;
                this.templateHtml = email.marketingTemplateLocales[0].templateHtml;
                this.templateCss = email.marketingTemplateLocales[0].templateCss;
            }
        });
    }


    addRule() {
        const dialogRef = this.dialog.open(addRulesDialog);
        dialogRef.afterClosed().subscribe(result => {
            if (result.buttonName === 'SELECT') {
                this.promotionError = false;
                this.promotionType = 'RULE'
                let request = {};
                if (result.tableData[0].earnRuleId == undefined) {
                    this.promotionId = result.tableData[0].burnRuleId;
                    this.ruleType = 'BURN';
                    request = {
                        burnRuleId: result.tableData[0].burnRuleId
                    }
                    let GET_BURN_RULE_DATA_BY_ID = environment.APIEndpoint + "api/rpa/burn/rule/v1/view/id";
                    this.https.postJson(GET_BURN_RULE_DATA_BY_ID, request).subscribe(res => {
                        this.burnRuleData = res;
                    }, err => {
                    });
                }
                else {
                    this.promotionId = result.tableData[0].earnRuleId;
                    this.ruleType = 'EARN';
                    request = {
                        earnRuleId: result.tableData[0].earnRuleId
                    }
                    let GET_EARN_RULE_DATA_BY_ID = environment.APIEndpoint + "api/rpa/earnRule/v1/get";
                    this.https.postJson(GET_EARN_RULE_DATA_BY_ID, request).subscribe(res => {
                        this.earnRuleData = res;
                    }, err => {
                    });
                }
            }
        });
    }

    addCoupon() {
        const dialogRef = this.dialog.open(addCouponDialog);
        dialogRef.afterClosed().subscribe(result => {
            if (result.buttonName === 'SELECT') {
                this.promotionError = false;
                this.promotionType = 'COUPON'
                this.promotionId = result.tableData[0].couponId;
                let request = {
                    couponId: result.tableData[0].couponId
                }
                let GET_COUPON_DATA_BY_ID = environment.APIEndpoint + "api/rpa/coupon/v1/get/couponcampaign";
                this.https.postJson(GET_COUPON_DATA_BY_ID, request).subscribe(res => {
                    this.couponData = res;
                }, err => {
                });
            }
        });
    }
//event mapping
    addEvent(){
        const dialogRef = this.dialog.open(EventDialogComponent);
        dialogRef.afterClosed().subscribe(result => {
            if (result.buttonName === 'SELECT') {
                console.log('result----of---selcetd---event',result)
                 this.promotionError = false;
                 this.promotionType = 'EVENT';
                this.promotionId = result.tableData[0].eventId;
                let request = {
                    eventId: result.tableData[0].eventId
                }
                // let GET_COUPON_DATA_BY_ID = environment.APIEndpoint + "api/rpa/coupon/v1/get/couponcampaign";
                // this.https.postJson(GET_COUPON_DATA_BY_ID, request).subscribe(res => {
                //     this.couponData = res;
                // }, err => {
                // });
            }
        }); 
    }


    addFlow() {
        let dialogConfig = new MatDialogConfig();
        dialogConfig = {
            autoFocus: false,
        }
        const dialogRef = this.dialog.open(AddFlowDialogComponent, dialogConfig);
        dialogConfig.autoFocus = false;
        dialogRef.afterClosed().subscribe(result => {
            var getSelectedFlow = result.tableData.slice(-1)[0]
            if (result.buttonName === 'SELECT') {
                this.flowData = getSelectedFlow;
            }
        });
    }

    closeDialog() {
        this.couponData = [];
        this.burnRuleData = [];
        this.earnRuleData = [];
        this.promotionType = null;
        this.flowData = '';
        this.promotionId = null;
    }
   
    getCampaignVal(activity) {
        this.activityValue = activity.value;
        this.activityId = activity.id;
        this.segmentTypeValue = '';
        this.segmentCtrl.reset('');
        this.Segments = [];

        if (null !== activity && activity.value === "File Upload Segment Campaign") {
            this.nonMembercamp = true;
            this.segmentTypeSelection = false;
            this.pushFileUploadHide = true;
            this.secondFormGroup.get('segmentType').setValue('');

            this.segmentTypes.map(obj => {
                obj.disabled = true;
            });
            this.communicationTypes.map(obj => {
                if (obj.name == "PUSH") {
                    obj.display = false;
                }
            });
        }
        else if (null !== activity && activity.value === "Member File upload segment campaign") {
            this.nonMembercamp = false;
            this.segmentTypeSelection = true;
            this.pushFileUploadHide = false;
            this.secondFormGroup.get('segmentType').setValue('SEGMENT_MEMBER');
            this.segmentTypeValue = 'SEGMENT_MEMBER';
            this.getSegmentList(this.segmentTypeValue);
            this.communicationTypes.map(obj => { obj.display = true });
        }
        else {
            this.nonMembercamp = false;
            this.segmentTypeSelection = true;
            this.pushFileUploadHide = false;
            this.secondFormGroup.get('segmentType').setValue('SEGMENT_RULE');
            this.segmentTypeValue = 'SEGMENT_RULE';
            this.getSegmentList(this.segmentTypeValue);
            this.communicationTypes.map(obj => { obj.display = true });
        }
    }
    attributeDialog(index, type) {
        const dialogRef = this.dialog.open(addAttributesDialog);
        dialogRef.componentInstance.campaignActivitySelection = this.activityValue;
        dialogRef.componentInstance.couponDataValue = this.couponData;
        dialogRef.afterClosed().subscribe(result => {
            let content;
            let subject;
            if (result.brand != undefined) {
                this.brandattr = result.brand;
                content = result.list.map(e => {
                    return `${e.fieldName}`
                })
                content.push(this.brandattr);
            } else {
                content = result.map(e => {
                    return `${e.fieldName}`
                });
            }

            if (type == 'PUSH') {
                if (result.brand != undefined) {
                    this.otherAttr = result.list.map(e => { return e.id });
                    this.pushAttr = this.otherAttr;
                } else {
                    this.pushAttr = result.map(e => { return e.id })
                }
                const item = <FormArray>this.thirdFormGroup.controls['pushLocaleArray'];
                this.insertAtCaret(content.join(" "), `#textareaPush${index}`, item, index, content);
            }
            else if (type == 'SMS') {
                if (result.brand != undefined) {
                    this.otherAttr = result.list.map(e => { return e.id });
                    this.smsAttr = this.otherAttr;
                } else {
                    this.smsAttr = result.map(e => { return e.id });
                }
                // this.smsAttr = result.map(e => { return e.id });
                const item = <FormArray>this.thirdFormGroup.controls['smsLocaleArray'];
                // item.at(index).patchValue({
                //     content: item.value[index].content ? item.value[index].content + content.join(" ") : content.join(" "),
                // })
                this.insertAtCaret(content.join(" "), `#textarea${index}`, item, index, content);
            }

            else if (type == 'EMAIL') {
                if (result.brand != undefined) {
                    this.otherAttr = result.list.map(e => { return e.id });
                    this.emailAttr = this.otherAttr;
                } else {
                    this.emailAttr = result.map(e => { return e.id });
                }
                //  this.emailAttr = result.map(e => { return e.id });
                const item = <FormArray>this.thirdFormGroup.controls['emailLocaleArray'];

                try {
                    let obj_doc = new DOMParser().parseFromString(item.value[index].content, 'text/html');
                    let full_string = "";
                    for (let i1 = 0; i1 < obj_doc.body.children.length; i1++) {
                        full_string = full_string + (obj_doc.body.children[i1].innerHTML).toString();
                    }

                    // Start code added by rohit gupta
                    if (this.setDataContent != 'undefined') {
                        this.contentSet = true;
                        this.setDataContent = content.join(" ");
                        this.addKeyWordsContent();

                    }
                    // End code added by rohit gupta
                }
                catch (err) {
                }
            }
        });
    }

    selectSegmentDialog() {
        if (this.emailChecked == true) {
            this.boolCampaignVal = true;
        }
        else {
            this.boolCampaignVal = false;
        }

        if (this.segmentError == true) {
            this.segmentError = false
        }
        const dialogRef = this.dialog.open(segmentRuleDialog, {
            data: {
                segmentAttrJson: this.segmentAttrJson
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            this.segmentAttrJson = result.segmentAttrJson;
            let request = {
                segmentAttrJson: JSON.stringify(this.segmentAttrJson),
                boolCampaign: this.boolCampaignVal,
                action: 'CREATE'
            }
            if (request != undefined) {
                this.selectfinalQuery = true;
                // setTimeout(() => {
                //     this.selectfinalQuery = false;
                // }, 3000);
            }
            else {
                this.selectfinalQuery = false;
            }
            if (request.segmentAttrJson != undefined) {
                this.selectfinalQuery = true;
                // setTimeout(() => {
                //     this.selectfinalQuery = false;
                // }, 3000);
            }
            else {
                this.selectfinalQuery = false;
            }
            let GET_COUNT = environment.APIEndpoint + "api/rpa/customer/segment/ca/v2/apply/rule"
            if (this.segmentAttrJson != "" && this.segmentAttrJson != null) {
                this.https.postJson(GET_COUNT, request)
                    .subscribe((response) => {
                        this.segmentData = response;
                        setTimeout(() => {
                            this.selectfinalQuery = false;
                        }, 1000);
                        this.selectfinalQuery = false;
                        this.customersSelected = this.segmentData.customerCount;
                        this.emailCustomersSelected = this.segmentData.emailCustomerCount;
                        this.segmentQuery = this.segmentData.finalQuery
                        this.filePath = this.segmentData.filePath;
                        this.segmentAttrJson = this.segmentData.segmentAttrJson;
                        this.customerSelectedCount = this.segmentData.customerCount;
                        if (this.customerSelectedCount < 500 && this.customerSelectedCount >= 0) {
                            this.getCustomerBtnEnbale = true;
                        }
                        else {
                            this.getCustomerBtnEnbale = false;
                            this.downloadQuery = false;
                        }
                    }
                        , err => {
                            this.selectfinalQuery = false;
                            if (err.error.message != '') {
                                this.snackBar.openFromComponent(SnackBarComponent, {
                                    duration: 3000,
                                    data: {
                                        status: "failure",
                                        message: err.error.message
                                    }
                                });
                            }
                           
                            for (let i = 0; i < err.error.errorDetails.length; i++) {
                                this.segmentErrorMes = err.error.errorDetails[i].description
                            }
                            this.snackBar.openFromComponent(SnackBarComponent, {
                                duration: 3000,
                                data: {
                                    status: "failure",
                                    message: this.segmentErrorMes
                                }
                            });
                        });
                this.segmentError = false;
                let segmentId = this.secondFormGroup.get('segmentId');
                segmentId.clearValidators();
                segmentId.updateValueAndValidity();
            }
        });
    }


    getCustomerList() {
        this.disableData = true;
        this.downloadQuery = true;
        let request = {
            segmentQuery: this.segmentQuery,
        }
        let GET_QUERY = environment.APIEndpoint + "api/rpa/customer/segment/ca/v1/segmentfile/apply/rule";
        this.https.postJson(GET_QUERY, request).subscribe(
            (response) => {
                this.disableData = false;
                this.downloadQuery = false;
                this.customerSegmentFileapply = response;
                this.filePathCustomer = this.customerSegmentFileapply.filePath;
                this.download(this.filePathCustomer)
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

    public onClick(event) {

        if (this.thirdFormGroup.valid) {

            this.contentError = false;
        }

    }

    createCampaign() {
        console.log('valid form sss')
        if (this.campaignId == undefined) {
            if (this.thirdFormGroup.invalid) {
                this.contentError = true;
            }
            if(this.thirdFormGroup.get('pushLinkTo').value == 'Product' || this.thirdFormGroup.get('pushLinkTo').value == 'Category')
                this.linkToItemErr = this.linkToId == '' ||  this.linkToId == undefined ? true : false;
            if (this.firstFormGroup.valid && this.secondFormGroup.valid && this.thirdFormGroup.valid && !this.linkToItemErr) {
                this.contentError = false;
                let startDate = null;
                if (null != this.firstFormGroup.get('startDate').value && this.firstFormGroup.get('startDate').value != "") {
                    startDate = moment(this.firstFormGroup.get("startDate").value).format("YYYY-MM-DD HH:mm:ss");
                } else if (this.firstFormGroup.get('deliveryFrequency').value == "ONE_TIME") {
                    startDate = moment(this.firstFormGroup.get('deliveryDate').value).format("YYYY-MM-DD HH:mm:ss");
                } else if (this.firstFormGroup.get('deliveryFrequency').value == "IMMEDIATE") {
                    startDate = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
                }
                let endDate = null;
                if (null != this.firstFormGroup.get("endDate").value && this.firstFormGroup.get("endDate").value != "") {
                    endDate = moment(this.firstFormGroup.get('endDate').value).format('YYYY-MM-DD HH:mm:ss');
                } else if (this.firstFormGroup.get('deliveryFrequency').value == "ONE_TIME") {
                    endDate = moment(this.firstFormGroup.get('deliveryDate').value).format("YYYY-MM-DD HH:mm:ss");
                } else if (this.firstFormGroup.get('deliveryFrequency').value == "IMMEDIATE") {
                    endDate = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
                }
                let delDate = (this.firstFormGroup.get('deliveryDate').value != '') ? moment(this.firstFormGroup.get('deliveryDate').value).format('YYYY-MM-DD') : "";
                let delTime = (this.firstFormGroup.get('deliveryTime').value != '') ? moment(this.firstFormGroup.get('deliveryTime').value).format('hh:mm A') : "";
                this.loadingResponse = true;

                this.loading = true;
                this.showError = false;
                let request = {
                    activityId: this.firstFormGroup.get('activity').value,
                    campaignName: this.firstFormGroup.get('campaignName').value,
                    campaignDescription: this.firstFormGroup.get('campaignDesc').value,
                    campaignStartDate: startDate,
                    campaignEndDate: endDate,
                    status: this.toggleVal == true ? 'ONLINE' : 'OFFLINE',
                    communicationType: this.optionsChecked.join(","),
                    deliveryFrequency: this.firstFormGroup.get('deliveryFrequency').value,
                    deliveryDate: delDate,
                    deliveryTime: delTime,
                    deliveryMonthDay: (this.firstFormGroup.get('deliveryMonthDay').value != '') ? this.firstFormGroup.get('deliveryMonthDay').value.join(",") : "",
                    deliveryWeekDay: (this.firstFormGroup.get('deliveryWeekDay').value != '') ? this.firstFormGroup.get('deliveryWeekDay').value.join(",") : "",
                    promotionId: this.promotionId,
                    promotionType: null != this.promotionType ? this.promotionType : null,
                    ruleType: this.ruleType,
                }

                let CREATE_CAMPAIGN = environment.APIEndpoint + "api/rpa/campaign/v1/create";
                this.https.postJson(CREATE_CAMPAIGN, request)
                    .subscribe((response) => {
                        this.loadingResponse = false;
                        this.campaignData = response;
                        this.campaignId = this.campaignData.campaignId;
                        this.createSegment();
                    }
                        , err => {
                            this.loadingResponse = false;
                            this.loading = false;
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
        else {
            this.createSegment();
        }

    }

    createSegment() {

        if (this.segmentTypeValue != 'SEGMENT_RULE') {
            this.secondFormGroup.get('segmentId').setValue(this.segmentIdValue);
            this.secondFormGroup.get('fixedScheduled').setValue('fixed');
        }


        let request = {
            campaignId: this.campaignId,
            segmentId: this.secondFormGroup.get('segmentId').value,
            notificationLimit: this.secondFormGroup.get('notificationLimit').value,
            segmentDescription: this.secondFormGroup.get('segmentDesc').value,
            customerSelctedCount: this.customersSelected,
            selectedEmailCount: this.emailCustomersSelected,
            segmentQuery: this.segmentQuery,
            segmentAttrJson: this.segmentAttrJson,
            filePath: this.filePath,
            fixedOrScheduled: this.secondFormGroup.get('fixedScheduled').value,
            smsRestriction: this.secondFormGroup.get('smsRestriction').value,
            segmentFilePath: this.skuFilePath,
            includeArabicCustomers: this.optionsArabicChecked
        }

        let UPDATE_SEGMENT = environment.APIEndpoint + "api/rpa/campaign/v1/segment/update";
        this.https.postJson(UPDATE_SEGMENT, request)
            .subscribe((response) => {
                this.segmentData = response;
                this.createContent();
            }
                , err => {
                    this.loading = false;
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
    createContent() {

        let fromvalue = this.thirdFormGroup.value;
        console.log('fromvalue',fromvalue)

        let request = {
            campaignId: this.campaignId,
            status: this.toggleVal == true ? 'ONLINE' : 'OFFLINE'
        }

        if (this.pushChecked) {
            for (let i = 0; i < this.languages.length; i++) {
                this.thirdFormGroup.value.pushLocaleArray[i].languageId = this.languages[i].languageId
            }
            if(this.thirdFormGroup.get('specificBrand').value != undefined && this.thirdFormGroup.get('specificBrand').value != '' && this.thirdFormGroup.get('specificBrand').value != null)
                    this.linkToId = this.thirdFormGroup.get('specificBrand').value 
          
                    let pushContent = {
                templateId: this.selectedPushValue,

                //senderId: this.thirdFormGroup.get('pushSenderId').value,
                linkTo: this.thirdFormGroup.get('pushLinkTo').value,
                linkToId: this.linkToId,
                linkToItemName : this.linkToIteamName,
                hyperLink: this.thirdFormGroup.get('pushHyperLink').value,
              //  pushContentLocale: this.thirdFormGroup.value.pushLocaleArray,
                pushPersonaliseAttr: this.pushAttr
            }

            for (let index = 0; index < this.thirdFormGroup.value.pushLocaleArray.length; index++) {
                this.thirdFormGroup.value.pushLocaleArray[index].imagePath = this.imagePath[index];
                this.thirdFormGroup.value.pushLocaleArray[index].imagePathTwo = this.imagePathTwo[index]
            }

            request['pushContent'] = pushContent;


//////for arbic checkbox
            if (this.optionsArabicChecked == false) {
                let pushContentLocale = this.thirdFormGroup.value.pushLocaleArray;
                let data = pushContentLocale.filter(item => item.languageId !== 2);
          ///  let data = request['pushContent']['pushContentLocale'].filter(item => item.languageId !== 2);
             request['pushContent']['pushContentLocale'] = data;
            console.log('updatedHero>>>',data);
            console.log('no arabic content>>>');
            console.log('request>>>',request);
        
        
          }else{
            console.log('arabic content>>>');
            let pushContentLocale = this.thirdFormGroup.value.pushLocaleArray;
            request['pushContent']['pushContentLocale'] = pushContentLocale;
        
          }
          //////for arbic checkbox end



        }


        if (this.smsChecked) {
            for (let i = 0; i < this.languages.length; i++) {
                this.thirdFormGroup.value.smsLocaleArray[i].languageId = this.languages[i].languageId
            }
            let smsContent = {
                templateId: this.selectedSMSValue,
                senderId: this.thirdFormGroup.get('smsSenderId').value,
                hyperLink: this.thirdFormGroup.get('smsHyperLink').value,
               // smsContentLocale: this.thirdFormGroup.value.smsLocaleArray,
                smsPersonaliseAttr: this.smsAttr
            }
            request['smsContent'] = smsContent



//////for arbic checkbox
if (this.optionsArabicChecked == false) {

    let smsContentLocale = this.thirdFormGroup.value.smsLocaleArray;
    let data = smsContentLocale.filter(item => item.languageId !== 2);
///  let data = request['pushContent']['pushContentLocale'].filter(item => item.languageId !== 2);
 request['smsContent']['smsContentLocale'] = data;

console.log('updatedHero>>>',data);
console.log('no arabic content>>>');
console.log('request>>>',request);


}else{

console.log('arabic content>>>');

let smsContentLocale = this.thirdFormGroup.value.smsLocaleArray;

request['smsContent']['smsContentLocale'] = smsContentLocale;

}
//////for arbic checkbox end


            
        }
        if (this.emailChecked) {
            // for (let i = 0; i < this.languages.length; i++) {
            //     this.thirdFormGroup.value.emailLocaleArray[i].languageId = this.languages[i].languageId
            // }
            // let emailContent = {
            //     templateId: this.selectedEmailValue,
            //     senderId: this.thirdFormGroup.get('emailSenderId').value,
            //     hyperLink: this.thirdFormGroup.get('emailHyperLink').value,
            //     emailContentLocale: this.thirdFormGroup.value.emailLocaleArray,
            //     emailPersonaliseAttr: this.emailAttr
            // }


            // request['emailContent'] = emailContent
            this.onExportHtmlTemp().then((d: any) => {
                this.getSeperateTemplate().then((contentObj: any) => {
                  console.log(contentObj);
                  for (let i = 0; i < this.languages.length; i++) {
                    this.thirdFormGroup.value.emailLocaleArray[i].languageId = this.languages[i].languageId,
                    this.thirdFormGroup.value.emailLocaleArray[i].content = d,
                    this.thirdFormGroup.value.emailLocaleArray[i].templateHtml = contentObj.html,
                    this.thirdFormGroup.value.emailLocaleArray[i].templateCss = contentObj.css
                  }
                  let emailContent = {
                    templateId: this.thirdFormGroup.get('emailTemplate').value,
                    senderId: this.thirdFormGroup.get('emailSenderId').value,
                    hyperLink: this.thirdFormGroup.get('emailHyperLink').value,
                    emailContentLocale: this.thirdFormGroup.value.emailLocaleArray,
                    emailPersonaliseAttr: this.emailAttr,
                    templateCss: contentObj.css,
                    templateHtml: contentObj.html
                  }
                  request['emailContent'] = emailContent;
                  this.repeatCreateForEmail(request);
                });
              });
              return;
        }

     



         
  
  console.log('request body is>>>>>',request);


      
        let CREATE_CONTENT = environment.APIEndpoint + "api/rpa/campaign/v1/content/update";
        this.https.postJson(CREATE_CONTENT, request)
            .subscribe((response) => {
                console.log('res111>>>',response);

                console.log(response);
                this.segmentData = response;
                this.snackBar.openFromComponent(SnackBarComponent, {
                    duration: 1500,
                    data: {
                        status: "success",
                        message: "Campaign has been added successfully"
                    }
                });
                this.loading = false;
                sessionStorage.clear();
                this.router.navigate(['/search-campaign']);

            }
                , err => {
                    this.loading = false;
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


    // Stripo code starts

     // by default
  public loadStripoScriptByDefault() {
    let self = this;

    let body = <HTMLDivElement>document.body;
    let script = document.createElement('script');
    script.id = 'stripoScript';
    script.src = 'https://plugins.stripo.email/static/latest/stripo.js';
    script.async = true;
    script.defer = true;
    script.onload = function () {
      self.loadDemoTemplateByDefault(self.initStripo)
    };
    body.appendChild(script);
  }


  public loadStripoScript() {
    let self = this;

    let body = <HTMLDivElement>document.body;
    let script = document.createElement('script');
    script.id = 'stripoScript';
    script.src = 'https://plugins.stripo.email/static/latest/stripo.js';
    script.async = true;
    script.defer = true;
    script.onload = function () {
      self.loadDemoTemplate(self.initStripo)
    };
    body.appendChild(script);
  }

  // Utility methods
  public request(method, url, data, callback) {
    var req = new XMLHttpRequest();
    req.onreadystatechange = function () {
      if (req.readyState === 4 && req.status === 200) {
        callback(req.responseText);
      } else if (req.readyState === 4 && req.status !== 200) {
        console.error('Can not complete request. Please check you entered a valid PLUGIN_ID and SECRET_KEY values');
      }
    };
    req.open(method, url, true);
    if (method !== 'GET') {
      req.setRequestHeader('content-type', 'application/json');
    }
    req.send(data);
  }

    // by default
    public loadDemoTemplateByDefault(callback) {
        console.log("load template")
        return this.httpClient.get('https://raw.githubusercontent.com/ardas/stripo-plugin/master/Public-Templates/Basic-Templates/Trigger%20newsletter%20mockup/Trigger%20newsletter%20mockup.html', { responseType: 'text' }).subscribe(
          (html) => {
            return this.httpClient.get('https://raw.githubusercontent.com/ardas/stripo-plugin/master/Public-Templates/Basic-Templates/Trigger%20newsletter%20mockup/Trigger%20newsletter%20mockup.css', { responseType: 'text' }).subscribe(
              (css) => {
                callback({ html: html, css: css });
              }
            )
          }
        )
      }

  public loadDemoTemplate(callback) {
    console.log("load template")
    return this.httpClient.get('https://raw.githubusercontent.com/ardas/stripo-plugin/master/Public-Templates/Basic-Templates/Trigger%20newsletter%20mockup/Trigger%20newsletter%20mockup.html', { responseType: 'text' }).subscribe(
      (html) => {
        return this.httpClient.get('https://raw.githubusercontent.com/ardas/stripo-plugin/master/Public-Templates/Basic-Templates/Trigger%20newsletter%20mockup/Trigger%20newsletter%20mockup.css', { responseType: 'text' }).subscribe(
          (css) => {
            callback({ html: this.templateHtml, css: this.templateCss });
          }
        )
      }
    )
  }

  initStripo(template) {
    let self = this;
    window.Stripo.init({
      settingsId: 'stripoSettingsContainer',
      previewId: 'stripoPreviewContainer',
      codeEditorButtonId: 'codeEditor',
      undoButtonId: 'undoButton',
      redoButtonId: 'redoButton',
      locale: 'en',
      html: template.html,
      css: template.css,
      apiRequestData: {
        emailId: 123
      },
      "mergeTags": [
        {
          "category": "Reciproci-1",
          "entries": [
            {
              "label": "First Name",
              "value": "{FNAME}"
            }
          ]
        },
        {
          "category": "Reciproci-2",
          "entries": [
            {
              "label": "Last Name",
              "value": "{LNAME}"
            }
          ]
        }
      ],
      getAuthToken: function (callback) {
        // TEMPORARILY INSERT CREDS HERE, BUT DON'T SAVE IT PERMANENTLY!!!
        // let pluginId = "699ff104a7ff4e3c8467d2f9be4ed6f5"; // <----
        // let secretKey = "aa898dc4111f4419ad10b162efa3b07c"; // <----
        let userData = JSON.parse(localStorage.getItem("userpermissions"));


        let config = {
          url: STRIPO_AUTH_PATH,
          headers: {
            'Authorization': userData.token_type + " " + userData.access_token,
            "Content-Type": "application/json",
            'Access-Control-Allow-Origin': '*',
          },
          // body: {
          //     pluginId: pluginId,
          //     secretKey: secretKey
          //     // role: 'ADMIN' // only pass this if you want admin role; leave blank for normal users
          // }
        };
        var xhr = new XMLHttpRequest();
        xhr.open('GET', config.url, true);
        xhr.setRequestHeader('Content-type', 'application/json');
        xhr.setRequestHeader('Authorization', userData.token_type + " " + userData.access_token);
        xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
        xhr.onload = function () {
          console.log(this.responseText);
          callback(JSON.parse(this.responseText).token);
        };
        // xhr.send(JSON.stringify(config.body));
        xhr.send(JSON.stringify(config.headers));

        // this.httpClient.post(config.url, JSON.stringify(config.body), { observe: "response" }).subscribe(
        //         (token: any) => {
        //             let _token = token.json();
        //             console.log('token', _token);
        //             return _token;
        //         },
        //         error => {
        //             console.error("fetchUrl error:", error);
        //             return { error: error };
        //         }
        //     );
      },
      "notifications": {
        "info": message => console.log(message),
        "error": message => console.error(message),
        "success": message => console.log(message),
        "warn": message => console.log(message),
        "loader": message => console.log(message),
        "hide": message => console.log(message)
      }
    });


  }

  // On Export the HTML
  public onExportHtml() {
    // window.StripoApi.compileEmail((error, html, ampHtml, ampError) => {
    //     var x = html;
    //     console.log(x);
    // });
    window.StripoApi.getTemplate((error, html, ampHtml, ampError) => {
      var x = html;
      console.log(x);
    });
  }

  // for recreating EmailTemplateHTML
  public repeatCreateForEmail(request) {
    console.log('request2>>>',request);

    let CREATE_CONTENT = environment.APIEndpoint + "api/rpa/campaign/v1/content/update";
    this.https.postJson(CREATE_CONTENT, request)
      .subscribe((response) => {
        console.log('res222>>>',response);

        this.segmentData = response;
        this.snackBar.openFromComponent(SnackBarComponent, {
          duration: 1500,
          data: {
            status: "success",
            message: "Campaign has been added successfully"
          }
        });
        // this.buttonDisable = true;
        this.loading = false;
        this.router.navigate(['/search-campaign']);
      }
        , err => {
          this.loading = false;
        //   this.buttonDisable = false;
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
  // for export EmailTemplateHTML
  public onExportHtmlTemp() {
    let promise = new Promise((resolve, reject) => {
      window.StripoApi.compileEmail((error, html, ampHtml, ampError) => {
        resolve(html);
        console.log(html);
      });
    });

    return promise;
  }

  public getSeperateTemplate() {
    let promiseForGetTemplate = new Promise((resolve, reject) => {
      window.StripoApi.getTemplate((HTML, CSS, width, heigh) => {
        resolve({ html: HTML, css: CSS });
        console.log(HTML);
      });
    })
    return promiseForGetTemplate;
  }


  
  public onSelectionChange(stepperCount) {
    console.log(stepperCount.selectedIndex);
  }
  
  // Stripo code ends












    public imagePath: any = [];
    public uploadError = [];
    public uploadFlag = [];
    @ViewChild('uploadEl') uploadElRef: ElementRef;
    public filePathUrl = localStorage.getItem("imgBaseUrl");
    public imgUpload = false;
    public imageUploading: boolean = false;
    public storeImgFlag = [];
    @ViewChild('uploadImgEl') uploadImgEl: ElementRef;
    public imagePathTwo = [];

    public uploadFullImage(event: FileList, i) {
        this.imageUploading = true;
        if (event[0].size < 5000000) {
          if (event[0].type == "image/jpeg" || event[0].type == "image/png" || event[0].type == "image/PNG" || event[0].type == "image/jpg" || event[0].type == "image/JPG"
            || event[0].type == "image/JPEG" || event[0].type == "image/Jpg" || event[0].type == "image/Jpeg" || event[0].type == "image/Png") {
            this.uploadFile.upload(event.item(0), 'store360', 'images')
              .subscribe((response) => {
                this.imagePathTwo[i] = response['message'];
                this.storeImgFlag[i] = true;
                this.uploadImgEl.nativeElement.value = ''
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
          }
          else {
            this.imagePathTwo[i] = '';
            this.snackBar.openFromComponent(SnackBarComponent, {
              duration: 10000,
              data: {
                status: "failure",
                message: "Supported format is JPG, JPEG and PNG"
              }
            });
          }
        } else {
          this.imagePathTwo[i] = '';
          this.snackBar.openFromComponent(SnackBarComponent, {
            duration: 10000,
            data: {
              status: "failure",
              message: "Max upload file size is 5Mb"
            }
          });
        }
      }

  

    public uploadImage(event: FileList, i) {
        // this.imageUploading = true;
        if (event[0].type == "image/jpeg" || event[0].type == "image/png" || event[0].type == "image/jpg") {
            if (event[0].size < 1000000) {
                // this.imageErr[i] = false;
                // this.imageErrMsg[i] = "";
                this.uploadFile.upload(event.item(0), 'brandCategory', 'images')
                    .subscribe((response) => {
                        this.imagePath[i] = response['message'];
                        this.uploadFlag[i] = true;
                        this.prePopulateImg[i] = true;
                        //   this.imageUploading = false;
                        this.snackBar.openFromComponent(SnackBarComponent, {
                            duration: 1500,
                            data: {
                                status: "success",
                                message: " image successfully uploaded"
                            }
                        });
                    }, err => {
                    })
            } else {
                // this.imageErr[i] = true;
                // this.imageErrMsg[i] = "Max upload file size is 1Mb";
            }
        } else {
            //   this.imageErr[i] = true;
            //   this.imageErrMsg[i] = "Supported format is JPG, JPEG and PNG";
        }
    }

    public uploadImageaa(event: FileList, i) {
        if (event[0].size < 1000000) {
            if (event[0].type == "image/jpeg" || event[0].type == "image/png" || event[0].type == "image/PNG" || event[0].type == "image/jpg" || event[0].type == "image/JPG"
                || event[0].type == "image/JPEG" || event[0].type == "image/Jpg" || event[0].type == "image/Jpeg" || event[0].type == "image/Png") {
                // this.uploadFile.upload(event.item(0), 'brandCategory', 'images')
                this.uploadFile.upload(event.item(0), 'brandCategory', 'images')
                    .subscribe((response) => {
                        this.imagePath[i] = response['message'];
                        this.uploadError[i] = false;
                        this.uploadFlag[i] = true;
                        this.uploadElRef.nativeElement.value = ''
                        this.snackBar.openFromComponent(SnackBarComponent, {
                            duration: 1500,
                            data: {
                                status: "success",
                                message: " image successfully uploaded"
                            }
                        });
                    }, err => {
                        this.loading = false;
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
            }
            else {
                this.imagePath[i] = '';
                this.snackBar.openFromComponent(SnackBarComponent, {
                    duration: 10000,
                    data: {
                        status: "failure",
                        message: "Supported format is JPG, JPEG and PNG"
                    }
                });
            }
        } else {
            this.imagePath[i] = '';
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
        this.imagePath[index] = "";
        this.uploadFlag[index] = false;
        this.prePopulateImg[index] = false;
        const control = this.thirdFormGroup.get('pushLocaleArray') as FormArray;
        // control.at(index).get('campaingnPushImage').setValue('');
    }

    public removeDetailImage(index) {
        this.imagePathTwo[index] = "";
        this.storeImgFlag[index] = false;
        this.prePopulateImgSecond[index] = false;
        const control = this.thirdFormGroup.get('pushLocaleArray') as FormArray;
      }

    public getAllSenderList() {
        let GET_ALL_SENDER_LIST = environment.APIEndpoint + "api/rpa/campaign/v1/get/senderList";
        this.http.getJson(GET_ALL_SENDER_LIST)
            .subscribe((response) => {
                this.senderList = response;
                for (let sender of this.senderList) {
                    if (sender.templateType == 'SMS') {
                        this.smsSenderList.push(sender.senderId);
                    } else if (sender.templateType == 'EMAIL') {
                        this.emailSenderList.push(sender.senderId);
                    }
                }
            })
    }
    // expandDataEmail() {
    //     var allifram = document.getElementById("arabicID");
    //     var iFrame_Arabic = allifram.getElementsByTagName("iframe")[0];
    //     var html_Arabic = iFrame_Arabic.contentWindow.document.getElementsByTagName("html")[0];
    //     html_Arabic.setAttribute("style", "direction: rtl;text-align: right;");
    // }

    // onChangeInEditor(event) {
    //     this.getEventEditor = event.editor;
    // }

    addKeyWordsContent() {
        if (this.contentSet) {
            this.getRange = this.getEventEditor.selection.getRng();
            this.newNodeAdd = this.getEventEditor.getDoc().createElement("span");
            this.newNodeAdd.innerText = `${this.setDataContent}`;
            this.getRange.insertNode(this.newNodeAdd);
            this.contentSet = false;
        }
    }

    createNewCampaign() {
        this.loadingResponse = true;

        let startDate = null;
        if (null != this.firstFormGroup.get('startDate').value && this.firstFormGroup.get('startDate').value != "") {
            startDate = moment(this.firstFormGroup.get("startDate").value).format("YYYY-MM-DD HH:mm:ss");
        } else if (this.firstFormGroup.get('deliveryFrequency').value == "ONE_TIME") {
            startDate = moment(this.firstFormGroup.get('deliveryDate').value).format("YYYY-MM-DD HH:mm:ss");
        } else if (this.firstFormGroup.get('deliveryFrequency').value == "IMMEDIATE") {
            startDate = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
        }
        let endDate = null;
        if (null != this.firstFormGroup.get("endDate").value && this.firstFormGroup.get("endDate").value != "") {
            endDate = moment(this.firstFormGroup.get('endDate').value).format('YYYY-MM-DD HH:mm:ss');
        } else if (this.firstFormGroup.get('deliveryFrequency').value == "ONE_TIME") {
            endDate = moment(this.firstFormGroup.get('deliveryDate').value).format("YYYY-MM-DD HH:mm:ss");
        } else if (this.firstFormGroup.get('deliveryFrequency').value == "IMMEDIATE") {
            endDate = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
        }


        let delDate = (this.firstFormGroup.get('deliveryDate').value != '') ? moment(this.firstFormGroup.get('deliveryDate').value).format('YYYY-MM-DD') : "";
        let delTime = moment(this.firstFormGroup.get('deliveryTime').value).format('hh:mm A');

        let request = {
            isUpdate: false,
            activityId: this.activityId,
            campaignName: this.firstFormGroup.get('campaignName').value,
            campaignDescription: this.firstFormGroup.get('campaignDesc').value,
            campaignStartDate: startDate,
            campaignEndDate: endDate,
            status: this.toggleVal == true ? 'ONLINE' : 'OFFLINE',
            communicationType: this.optionsChecked.join(","),
            deliveryFrequency: this.firstFormGroup.get('deliveryFrequency').value,
            deliveryDate: delDate,
            deliveryTime: delTime,
            deliveryMonthDay: (this.firstFormGroup.get('deliveryMonthDay').value != '') ? this.firstFormGroup.get('deliveryMonthDay').value.join(",") : "",
            deliveryWeekDay: (this.firstFormGroup.get('deliveryWeekDay').value != '') ? this.firstFormGroup.get('deliveryWeekDay').value.join(",") : "",
            promotionId: this.promotionId,
            promotionType: null != this.promotionType ? this.promotionType : null,
            ruleType: this.ruleType,

            //segment
            segmentId: this.secondFormGroup.get('segmentId').value,
            notificationLimit: this.secondFormGroup.get('notificationLimit').value,
            segmentDescription: this.secondFormGroup.get('segmentDesc').value,
            customerSelctedCount: this.customersSelected,
            selectedEmailCount: this.emailCustomersSelected,
            segmentQuery: this.segmentQuery,
            segmentAttrJson: this.segmentAttrJson,
            filePath: this.filePath,
            fixedOrScheduled: this.secondFormGroup.get('fixedScheduled').value,
            smsRestriction: this.secondFormGroup.get('smsRestriction').value
        }

        //content

        if (this.pushChecked) {
            for (let i = 0; i < this.languages.length; i++) {
                this.thirdFormGroup.value.pushLocaleArray[i].languageId = this.languages[i].languageId
            }
            // for (let index = 0; index < this.thirdFormGroup.value.pushLocaleArray.length; index++) {
            //     this.thirdFormGroup.value.pushLocaleArray[index].imagePath = this.imagePath[index]
            // }
            // for (let index = 0; index < this.thirdFormGroup.value.pushLocaleArray.length; index++) {
            //     this.thirdFormGroup.value.pushLocaleArray[index].imagePathTwo = this.imagePathTwo[index]
            // }
            let pushContent = {
                templateId: this.selectedPushValue,
                linkTo: this.thirdFormGroup.get('pushLinkTo').value,
                hyperLink: this.thirdFormGroup.get('pushHyperLink').value,
                pushContentLocale: this.thirdFormGroup.value.pushLocaleArray
            }
            for (let index = 0; index < this.thirdFormGroup.value.pushLocaleArray.length; index++) {
                this.thirdFormGroup.value.pushLocaleArray[index].imagePath = this.imagePath[index];
                this.thirdFormGroup.value.pushLocaleArray[index].imagePathTwo = this.imagePathTwo[index]
            }
        
            request['pushContent'] = pushContent
        }
        if (this.smsChecked) {
            for (let i = 0; i < this.languages.length; i++) {
                this.thirdFormGroup.value.smsLocaleArray[i].languageId = this.languages[i].languageId
            }
            let smsContent = {
                templateId: this.selectedSMSValue,
                senderId: this.thirdFormGroup.get('smsSenderId').value,
                hyperLink: this.thirdFormGroup.get('smsHyperLink').value,
                smsContentLocale: this.thirdFormGroup.value.smsLocaleArray
            }
            request['smsContent'] = smsContent
        }
        if (this.emailChecked) {
            // for (let i = 0; i < this.languages.length; i++) {
            //     this.thirdFormGroup.value.emailLocaleArray[i].languageId = this.languages[i].languageId
            // }
            // let emailContent = {
            //     templateId: this.selectedEmailValue,
            //     senderId: this.thirdFormGroup.get('emailSenderId').value,
            //     hyperLink: this.thirdFormGroup.get('emailHyperLink').value,
            //     emailContentLocale: this.thirdFormGroup.value.emailLocaleArray
            // }

            // request['emailContent'] = emailContent

            this.onExportHtmlTemp().then((d: any) => {
                this.getSeperateTemplate().then((contentObj: any) => {
                  console.log(contentObj);
                  for (let i = 0; i < this.languages.length; i++) {
                    this.thirdFormGroup.value.emailLocaleArray[i].languageId = this.languages[i].languageId,
                    this.thirdFormGroup.value.emailLocaleArray[i].content = d,
                    this.thirdFormGroup.value.emailLocaleArray[i].templateHtml = contentObj.html,
                    this.thirdFormGroup.value.emailLocaleArray[i].templateCss = contentObj.css
                  }
                  let emailContent = {
                    templateId: this.thirdFormGroup.get('emailTemplate').value,
                    senderId: this.thirdFormGroup.get('emailSenderId').value,
                    hyperLink: this.thirdFormGroup.get('emailHyperLink').value,
                    emailContentLocale: this.thirdFormGroup.value.emailLocaleArray,
                    emailPersonaliseAttr: this.emailAttr,
                    templateCss: contentObj.css,
                    templateHtml: contentObj.html
                  }
                  request['emailContent'] = emailContent;
                  this.repeatCreateForEmail(request);
                });
              });
              return;
        }
        let CREATE_CAMPAIGN = environment.APIEndpoint + "api/rpa/campaign/v1/create";
        this.https.postJson(CREATE_CAMPAIGN, request)
            .subscribe((response) => {
                this.segmentData = response;
                this.snackBar.openFromComponent(SnackBarComponent, {
                    duration: 1500,
                    data: {
                        status: "success",
                        message: "Campaign has been added successfully"
                    }
                });
                this.loadingResponse = false;
                this.loading = false;
                sessionStorage.clear();
                this.router.navigate(['/search-campaign']);
            }
                , err => {
                    this.loading = false;
                    this.loadingResponse = false;
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





    //Upload Sku

    uploadFileSku(event: FileList) {
        //pick from one of the 4 styles of file uploads below
        this.uploadAndProgress(event, "skuFile");
    }

    uploadAndProgress(files: FileList, fileType: String) {
        this.fileTypeErr = false;
        //    var formData = new FormData();
        //    Array.from(files).forEach(f => formData.append('file',f))

        this.uploadFile.upload(files.item(0), 'campaign', 'files')
            .subscribe((response) => {
                if (fileType == 'manual') {
                    this.manualFileName = files.item(0).name;
                    this.manualFilePath = response['message'];
                    this.submitForm = true;
                    this.manualFileRequired = false;
                    this.validCouponCode = false;
                    this.manualErrorFileName = '';
                    this.manualErrorFile = '';
                    this.uploadManualXLSFile.nativeElement.value = ''
                } else {
                    this.skuFileName = files.item(0).name;
                    this.skuFilePath = response['message'];
                    this.skuRequiredError = false
                    this.skuRequired = false;
                    this.validSkuFile = false;
                    this.skuErrorFile = '';
                    this.skuErrorFileName = '';
                    this.uploadSkuRef.nativeElement.value = '';
                }

                this.snackBar.openFromComponent(SnackBarComponent, {
                    duration: 1500,
                    data: {
                        status: "success",
                        message: " file successfully uploaded"
                    }
                });
            }, err => {
                if (err.error.errorType == 'VALIDATION') {
                    this.snackBar.openFromComponent(SnackBarComponent, {
                        duration: 10000,
                        data: {
                            status: "failure",
                            message: 'File Extension Not Valid '
                        }
                    });
                } else {
                    this.snackBar.openFromComponent(SnackBarComponent, {
                        duration: 10000,
                        data: {
                            status: "failure",
                            message: "File cannot be uploaded. Please try again later"
                        }
                    });
                }

            }
            )

    }
    public skuUpload(value: any) {
        this.skuFilePath = '';
        this.submitForm = true
        this.skuErrorFile = '';
        this.skuErrorFileName = '';
        this.validSkuFile = true;
        this.validCouponRequired = false;
        this.skuFileName = '';
        this.validateSkuFile = false;
        this.skuRequired = false;
        this.customersSelected = '';
        this.emailCustomersSelected = '';
        this.uploadSkuRef.nativeElement.value = null;
    }

    validateSKUs() {
        if (null != this.skuFilePath && this.skuFilePath != '') {
            this.validateSkuFile = false;
            this.skuRequiredError = false;
            let request = {
                activityId: this.activityId,
                filePath: this.skuFilePath
            }
            let VALIDATE_SKUS = environment.APIEndpoint + "api/rpa/campaign/v1/validate/";
            this.http.postJson(VALIDATE_SKUS, request)
                .subscribe((response) => {
                    this.nonmemberData = response;
                    this.customersSelected = this.nonmemberData.customerCount;
                    this.emailCustomersSelected = this.nonmemberData.emailCustomerCount;

                    //  smsCustomerCount
                    this.validSkuFile = true;
                    this.submitForm = true;
                    this.snackBar.openFromComponent(SnackBarComponent, {
                        duration: 10000,
                        data: {
                            status: "success",
                            message: "File validated successfully"
                        }
                    });
                    this.skuRequiredError = false
                }, err => {
                    for (let i = 0; i < err.error.errorDetails.length; i++) {
                        this.errorMesCampaign = err.error.errorDetails[i].description
                    }
                    this.validSkuFile = false;
                    let fileErr = undefined;
                    fileErr = this.skuFilePath != '' ? this.skuFilePath.includes('.csv') || this.skuFilePath.includes('.CSV') : undefined;
                    if (this.skuFilePath != '' && fileErr != undefined) {
                        this.snackBar.openFromComponent(SnackBarComponent, {
                            duration: 10000,
                            data: {
                                status: "failure",
                                message: this.errorMesCampaign
                            }
                        });
                        this.fileTypeErr = true;
                    }
                    else {
                        this.skuFileName = '';
                        this.snackBar.openFromComponent(SnackBarComponent, {
                            duration: 10000,
                            data: {
                                status: "failure",
                                message: err.error.errorDetails[0].description
                            }
                        });
                    }
                    if (err.error.errorDetails[0].errorFilePath != undefined) {
                        this.skuErrorFile = this.errorFilePathUrl + '/' + err.error.errorDetails[0].errorFilePath;
                        this.skuErrorFileName = this.skuErrorFile.split("/").pop();
                    }
                })
        }
    }

    getAllRegionBrandsA() {
        let GET_ALL_BRANDS = environment.APIEndpoint + "api/rpa/master/brand/v1/get/regionBrands";
        this.http.getJson(GET_ALL_BRANDS)
            .subscribe((response) => {
                this.specificBrands = response;
            }),
            (error) => {
            }
    }

    getAllRegionBrands() {
        let GET_ALL_CITIES = environment.APIEndpoint + "api/rpa/master/brand/v1/get/regionBrands";
        this.http.getJson(GET_ALL_CITIES)
            .subscribe((response) => {
                this.brandList = response;

                for (let i = 0; i <= this.brandList.length - 1; i++) {
                    let objbrandkey = {
                        brandId: this.brandList[i]['brandId'],
                        brandName: this.brandList[i]['brandName'],
                    }
                    this.Brands.push(objbrandkey);
                }
                this.filteredBrands = this.brandCtrl.valueChanges
                    .pipe(
                        startWith(''),
                        map(brand => brand ? this._filterBrands(brand) : this.Brands.slice())
                    );
            },
                (error) => {
                });
    }

    private _filterBrands(value: string): Brand[] {
        const filterValue = value.toLowerCase();
        return this.Brands.filter(brand => brand.brandName.toLowerCase().indexOf(filterValue) === 0);
    }

    public setBrandType(brandOid) {
        this.linkToId = brandOid;
    }

    insertAtCaret(text, id, formgroup, index, content) {
        const textarea = (<HTMLTextAreaElement>document.querySelector(id));

        textarea.setRangeText(
            text,
            textarea.selectionStart,
            textarea.selectionEnd,
            'end'
        )
        const item = formgroup;
        item.at(index).patchValue({
            content: textarea.value,
        });
    }

    openLinkToItemPopUP(){
        const dialogConfig = new MatDialogConfig();
        dialogConfig.width = "unset";
        dialogConfig.height = 'auto';
        dialogConfig.autoFocus = false;
        dialogConfig.panelClass = 'view-product-dialogue';
        let selectedItemList = {
          itemId : this.linkToId
        }
        let dialogRef;
        if(this.thirdFormGroup.get('pushLinkTo').value == 'Product'){
          dialogRef = this.dialog.open(SelectProductDailogComponent ,dialogConfig);
        }
        else if(this.thirdFormGroup.get('pushLinkTo').value == 'Category'){
          dialogRef = this.dialog.open(SelectCategoryDailogComponent ,dialogConfig);
        }
        dialogRef.componentInstance.TempItemList = selectedItemList;
        dialogRef.afterClosed().subscribe(result => {
            this.linkToId = result.itemId;
            this.linkToIteamName = result.linkToIteamName;
            this.linkToItemErr = this.linkToId == '' ||  this.linkToId == undefined ? true : false;
        });
    }


    // For the emoji implementation
    message = [];
    public textAreaAppSubject: any[] = [];
    public textAreaAppContent: any[] = [];
    public textAreaSMSContent: string = '';
    public textAreaEmailSub: string = '';
    public textAreaEmailContent: string = '';

    showEmojiPicker = [];
    showEmojiPickerAppCOntent = [];
    showEmojiPickerSMSCOntent = [];
    showEmojiPickerEmailSub = [];
    showEmojiPickerEmailContent = [];

    sets = [
      'native',
      'google',
      'twitter',
      'facebook',
      'emojione',
      'apple',
      'messenger'
    ]
    set = 'twitter';
    // App Push Section
    toggleEmojiPicker(index) {
        this.showEmojiPicker[index] = !this.showEmojiPicker[index];
    }
    addEmojiAppSubject(event,index) {
      const emoji : string = (event.emoji as any).native;
      const input = (index == 0) ? this.input.first.nativeElement : this.input.last.nativeElement;
      input.focus();

      const text = this.textAreaAppSubject[index] + `${event.emoji.native}`;
      this.textAreaAppSubject[index] = text;

      if (document.execCommand){ 
            var event1 = new Event('input');
            document.execCommand('insertText', false, emoji);
            return; 
      }
      const [start, end] = [input.selectionStart, input.selectionEnd]; 
      input.setRangeText(emoji, start, end, 'end');
    }

    toggleEmojiPickerAppContent(index) {
        this.showEmojiPickerAppCOntent[index] = !this.showEmojiPickerAppCOntent[index];
    }
    addEmojiAppContent(event,index) {
        const emoji : string = (event.emoji as any).native;
        const inputContent = (index == 0) ? this.inputContent.first.nativeElement : this.inputContent.last.nativeElement;
        inputContent.focus();
        const text = this.textAreaAppContent[index] + `${event.emoji.native}`;
        this.textAreaAppContent[index] = text;
        if (document.execCommand){ 
            var event1 = new Event('inputContent');
            document.execCommand('insertText', false, emoji);
            return; 
        }
        const [start, end] = [inputContent.selectionStart, inputContent.selectionEnd]; 
        inputContent.setRangeText(emoji, start, end, 'end');
    }
}
