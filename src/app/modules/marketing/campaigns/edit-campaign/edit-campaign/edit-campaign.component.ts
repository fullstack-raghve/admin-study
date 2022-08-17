import { Component, OnInit, ViewChild, HostListener, Renderer2, ElementRef, Inject, QueryList, ViewChildren } from '@angular/core';
import { FormControl, Validators, FormBuilder, FormGroup, NgForm, FormGroupDirective, FormArray, ValidatorFn, AbstractControl } from '@angular/forms';
import { HttpService } from 'src/app/services/http-service';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { DOCUMENT } from '@angular/common';
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
import { notificationDialog } from 'src/app/shared/components/notification-dialog/notification.component';
import { AddFlowDialogComponent } from 'src/app/shared/components/add-flow-dialog/add-flow-dialog.component';
import { Globals } from 'src/app/services/global';
import { UploadFile } from 'src/app/services/uploadFile.service';
import { EmojiModule } from '@ctrl/ngx-emoji-mart/ngx-emoji';
import { PickerModule } from '@ctrl/ngx-emoji-mart';
import { SelectCategoryDailogComponent } from 'src/app/shared/components/select-category-dailog/select-category-dailog.component';
import { SelectProductDailogComponent } from 'src/app/shared/components/select-product-dailog/select-product-dailog.component';

import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

// for stripo
import { HttpClient } from '@angular/common/http';
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


export function forbiddenNamesValidator(names: string[]): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
        // below findIndex will check if control.value is equal to one of our options or not
        const index = names.findIndex(name => {
            return (new RegExp('\^' + name + '\$')).test(control.value);
        });
        return index < 0 ? { 'forbiddenNames': { value: control.value } } : null;
    };
}

export class MyErrorStateMatcher implements ErrorStateMatcher {
    isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
        const isSubmitted = form && form.submitted;
        return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
    }
}

@Component({
    selector: 'edit-campaign',
    templateUrl: './edit-campaign.component.html',
    styleUrls: ['./edit-campaign.component.scss'],
    providers: [{
        provide: MAT_STEPPER_GLOBAL_OPTIONS, useValue: { displayDefaultIndicatorType: false }
    }],
    host: {
        '(document:click)': 'onClick($event)',
    },
})



export class EditCampaignComponent implements OnInit {

    pushTemplates: pushTemplate[] = [];
    pushTemplateCtrl = new FormControl();
    filteredpushTemplates: Observable<pushTemplate[]>;

    public scrollbarOptions = { axis: "y", theme: "minimal-dark" };
    public breadCrumbData: Array<Object> = [{
        title: 'Marketing',
        link: ''
    }
    ];
    public linkToId;
    public linkToIteamName = '';
    public linkToItemErr : boolean = false;
    // public activityList;
    // Activites: Activity[] = [];
    // activityCtrl = new FormControl();
    // filteredactivities: Observable<Activity[]>;

    public htmlContent: any;
    public templateHtml: any;
    public templateCss: any;

    @ViewChild('body') body: ElementRef;
    @ViewChild("createCampaignForm") createCampaignForm;
    @ViewChild("updateSegmentForm") updateSegmentForm;
    @ViewChildren('subInp', {read: ElementRef}) input : QueryList<ElementRef>;
    @ViewChildren('someTag', {read: ElementRef}) inputContent : QueryList<ElementRef>;
    firstFormGroup: FormGroup;
    secondFormGroup: FormGroup;
    thirdFormGroup: FormGroup;

    brandList;
    Brands: Brand[] = [];
    brandCtrl = new FormControl();
    filteredbrands: Observable<Brand[]>;
    public prePopulateBrandId;
    public brandType: String = '';
    public specificBrands = [];

    public showError: boolean = false;
    public loading: boolean = false;
    public activities: any = [];
    public languages = JSON.parse(localStorage.getItem("languageList"));
    public pushData: any = [];
    public smsData: any = [];
    public emailData: any = [];
    public statusValue: string = 'ONLINE';
    public toggleVal: boolean = true;
    public optionsChecked: any = [];
    public campaignData: any = [];
    public prePopulateArabic;
    public segmentData: any = [];
    public emailChecked: boolean = false;
    public pushChecked: boolean = false;
    public smsChecked: boolean = false;
    reqField: boolean;
    public pushTemplateChecked: boolean = false;
    public smsTemplateChecked: boolean = false;
    public emailTemplateChecked: boolean = false;
    public customersSelected;
    public emailCustomersSelected: '';
    public smsCustomersSelected: '';
    public segmentQuery: '';
    public segmentAttrJson: string
    public filePath: string;
    public notificationLimit: number;
    public fixedScheduled = "fixed";
    public ruleCouponError: boolean = false;
    public minDate: Date = new Date();
    public couponData: any = [];
    public earnRuleData: any = [];
    public burnRuleData: any = [];
    public ruleType: string;
    public promotionType: string;
    public promotionId: number;
    public campaignId: number;
    public contentError: boolean = false;
    public segmentFileUploadValueError: boolean = false;
    public campaignName: string;
    public campStartDate: string;
    public campEndDate: string;
    public activity: any;
    public activityId;
    public communications: string;
    public href;
    public url: string;
    public btntxt: string;
    checked = true;
    disabled = false;
    panelOpenState = false;
    public weekList: any = [];
    public monthList: any = [];
    public commError: boolean = false;
    public promotionError: boolean = false;
    public dateError1: boolean = false;
    public dateError2: boolean = false;
    public dateError3: boolean = false;
    public dateError4: boolean = false;
    public segmentError: boolean = false;
    public languageDirection = [];
    public fileUrl = localStorage.getItem("fileBaseUrl");
    public pushAttr;
    public smsAttr;
    public emailAttr;

    public senderList = [];
    public smsSenderList = [];
    public emailSenderList = [];
    public langfield = [];
    public langfieldname = [];
    public arbicInvalid = [];

    public flowData;

    public skuValidated = false;
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
    public errorFilePathUrl = localStorage.getItem("fileBaseUrl");
    // public customersSelected: string;

    @ViewChild('uploadFile') uploadManualXLSFile: ElementRef;
    @ViewChild('uploadSku') uploadSkuRef: ElementRef;
    public nonmemberData: any = [];
    public nonMembercamp: boolean = false;
    public imagePath: any = [];
    public uploadError = [];
    public uploadFlag = [];
    @ViewChild('uploadEl') uploadElRef: ElementRef;
    public validSkuFile = true;
    public validateSkuFile = false;
    public manualFilePath: any = [];
    public filePathUrl = localStorage.getItem("imgBaseUrl");
    public imgUpload = false;
    public optionsArabicChecked: boolean = false;
    public loadingResponse: boolean = false;

    public customerSelectedCount: number;
    public getCustomerBtnEnbale: boolean = false;
    public finalQuery: string;

    public customerSegmentFileapply: any = [];
    public customerfilePath: boolean = false;
    public filePathCustomer: string;
    public selectfinalQuery: boolean = false;

    public disableData: boolean = false;
    public customerSelectedCountAbove: boolean = false;
    public downloadQuery: boolean = false;
    public segmentFileSucessFileData;
    public segmentFileErrorFileData;
    public segmentvalidMemberCount;
    public segmentinValidMemeberCount;
    public segmentfileValidateStatus;
    public segmentIdValue;
    public segmentName;
    public segmentMemNonMem: boolean = false;

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
        { value: 'SEGMENT_MEMBER_AND_NON_MEMBER', viewValue: 'Upload Member / Non Member CSV file',disabled: true },
        { value: 'SEGMENT_RULE', viewValue: 'Segment Rule', disabled: true },
    ];

    public segmentTypeSelection: boolean = false;
    
    public communicationTypes = [
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
    ];
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
    public errorMesCampaign;
    //dates = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31'];
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
    getEventEditor;
    getCursorPosition;
    contentSet;
    getRange;
    newNodeAdd;
    setUpTinyMce;
    setDataContent;
    public prePopulateImg: boolean = false;
    public prePopulateImgSecond: boolean = false;
    UTLtype: any;
    fileTypeErr: boolean;
    brandattr: any;
    otherAttr: any;
    brandAttrId: any;
    public segmentErrorMes;
    public boolCampaignVal: boolean = false;

    public segmentTypeValue;
    public segmentDataObj;

    constructor(private renderer: Renderer2, private formBuilder: FormBuilder, private https: HttpService, private http: HttpService, private httpClient: HttpClient,
        private router: Router, public dialog: MatDialog, public snackBar: MatSnackBar, private uploadFile: UploadFile, @Inject(DOCUMENT) private document: Document) {

        this.buildCampaignForm();
        this.buildSegmentForm();
        this.buildContentForm();

    }
    ngOnInit() {
        let data = localStorage.getItem('EditCampaignID');
        if (data) {
            this.href = data.split('-')[0];
            this.UTLtype = data.split('-')[1];
            this.contentSet = '';
            this.contentSet = false;
            this.setUpTinyMce = {
                plugins: 'code, preview ,customInsertButton ,print,fullpage, searchreplace, directionality, visualblocks, visualchars, fullscreen, image, link, media, template, codesample, table, charmap, hr, pagebreak, nonbreaking, anchor, toc, insertdatetime, advlist, lists, wordcount, imagetools, textpattern, help',
                toolbar: 'code preview',
                height: '480',

            }
            // this.getSegmentList();
            // this.getTemplateList();
            this.getCampaignDataById();
            this.setLocalStorageData();
            localStorage.removeItem('EditCampaignID');
        } else {
            sessionStorage.clear();
            this.router.navigate(['/search-campaign']);
        }
        this.getAllSenderList();
        this.getAllRegionBrandsA();
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

    updateCheckedOptions(name) {
        this.communicationTypes.forEach(com => {
            if (com.name == name) {
                com.checked = this.firstFormGroup.get('communication').value;
            }
        });

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

                // let smsDataValue = control['controls'][1]['controls'].content;
                // smsDataValue.clearValidators();
                // smsDataValue.reset();
                // smsDataValue.updateValueAndValidity();


            }
        }
        else {
            let control = this.thirdFormGroup.get('smsLocaleArray') as FormArray;
            let smsDataValue1 = control['controls'][0]['controls'].content;
            smsDataValue1.clearValidators();
            smsDataValue1.reset();
            smsDataValue1.updateValueAndValidity();

            if (this.optionsArabicChecked === true) {
                let smsDataValue = control['controls'][1]['controls'].content;
                smsDataValue.clearValidators();
                smsDataValue.reset();
                smsDataValue.updateValueAndValidity();
            }
            let smsSenderId = this.thirdFormGroup.controls.smsSenderId;
            smsSenderId.clearValidators();
            smsSenderId.reset();
            smsSenderId.updateValueAndValidity();
        }

        if (this.pushChecked == true) {
            for (let i = 0; i < this.thirdFormGroup.value.pushLocaleArray.length; i++) {
                this.thirdFormGroup.value.pushLocaleArray[i].imagePath = this.imagePath[i];
                this.thirdFormGroup.value.pushLocaleArray[i].imagePathTwo = this.imagePathTwo[i];

                if (this.imagePath[i] != '') {
                    this.prePopulateImg = true;
                    this.uploadFlag[i] = false;
                }
                else {
                    this.prePopulateImg = false;
                    this.uploadFlag[i] = true;
                }
                if (this.imagePathTwo[i] != '') {
                    this.prePopulateImgSecond = true;
                    this.storeImgFlag[i] = false;
                }
                else {
                    this.prePopulateImgSecond = false;
                    this.storeImgFlag[i] = true;
                }
            }
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

                // let pushDataValue = control['controls'][1]['controls'].content;
                // pushDataValue.clearValidators();
                // pushDataValue.reset();
                // pushDataValue.updateValueAndValidity();

                let pushDataSubjectValue1 = control['controls'][0]['controls'].subject;
                pushDataSubjectValue1.setValidators([Validators.required]);
                pushDataSubjectValue1.updateValueAndValidity();

                // let pushDataSubjectValue = control['controls'][1]['controls'].subject;
                // pushDataSubjectValue.clearValidators();
                // pushDataSubjectValue.reset();
                // pushDataSubjectValue.updateValueAndValidity();
            }
        }
        else {
            let control = this.thirdFormGroup.get('pushLocaleArray') as FormArray;

            let pushDataValue1 = control['controls'][0]['controls'].content;
            pushDataValue1.clearValidators();
            pushDataValue1.reset();
            pushDataValue1.updateValueAndValidity();

            if(this.optionsArabicChecked === true){
                let pushDataValue = control['controls'][1]['controls'].content;
                pushDataValue.clearValidators();
                pushDataValue.reset();
                pushDataValue.updateValueAndValidity();
            }

            let pushDataSubjectValue1 = control['controls'][0]['controls'].subject;
            pushDataSubjectValue1.clearValidators();
            pushDataSubjectValue1.reset();
            pushDataSubjectValue1.updateValueAndValidity();

            // let pushDataSubjectValue = control['controls'][1]['controls'].subject;
            // pushDataSubjectValue.clearValidators();
            // pushDataSubjectValue.reset();
            // pushDataSubjectValue.updateValueAndValidity();
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

                // let emailDataValue = control['controls'][1]['controls'].content;
                // emailDataValue.clearValidators();
                // emailDataValue.reset();
                // emailDataValue.updateValueAndValidity();

                let emailDataSubjectValue1 = control['controls'][0]['controls'].subject;
                emailDataSubjectValue1.setValidators([Validators.required]);
                emailDataSubjectValue1.updateValueAndValidity();

                // let emailDataSubjectValue = control['controls'][1]['controls'].subject;
                // emailDataSubjectValue.clearValidators();
                // emailDataSubjectValue.reset();
                // emailDataSubjectValue.updateValueAndValidity();
            }
        }
        else {
            let control = this.thirdFormGroup.get('emailLocaleArray') as FormArray;

            let emailDataValue1 = control['controls'][0]['controls'].content;
            emailDataValue1.clearValidators();
            emailDataValue1.reset();
            emailDataValue1.updateValueAndValidity();

            // let emailDataValue = control['controls'][1]['controls'].content;
            // emailDataValue.clearValidators();
            // emailDataValue.reset();
            // emailDataValue.updateValueAndValidity();

            let emailDataSubjectValue1 = control['controls'][0]['controls'].subject;
            emailDataSubjectValue1.clearValidators();
            emailDataSubjectValue1.reset();
            emailDataSubjectValue1.updateValueAndValidity();

            // let emailDataSubjectValue = control['controls'][1]['controls'].subject;
            // emailDataSubjectValue.clearValidators();
            // emailDataSubjectValue.reset();
            // emailDataSubjectValue.updateValueAndValidity();
        }
        this.communications = this.optionsChecked.join(",");
        this.commError = this.communications.length > 0 ? false : true; 
    }



    goBackToFirst(stepper: MatStepper) {

        if (this.activity == 'File Upload Segment Campaign') {
            if (this.optionsChecked == 'PUSH') {
                this.commError = true;
            }
        }
        else {
            if (this.optionsChecked.length == 0) {
                this.commError = true;
            }
        }

        // if(this.couponData.length == 0 && this.burnRuleData.length === 0 && this.earnRuleData.length === 0 ){
        //     this.promotionError = true;
        // }
        if (this.commError) {
            stepper.previous();
        }

    }

    goBackToSecond(stepper: MatStepper) {
        // if (!this.validSkuFile) {
        //     this.validateSkuFile = true;
        //     this.skuValidated = true;
        // }

        // if (this.skuRequired == true && this.skuFileName == '') {
        //     this.skuRequiredError = true;
        // } else {
        //     this.skuRequiredError = false;
        // }

        let segmentId = this.secondFormGroup.get('segmentId');
        if (this.activity != 'File Upload Segment Campaign' && this.activity != 'Member File upload segment campaign') {
            if ((!this.segmentAttrJson || this.segmentAttrJson == undefined || this.customersSelected == '') && this.secondFormGroup.get('fixedScheduled').value != 'scheduled') {
                segmentId.setValidators([Validators.required]);
                segmentId.updateValueAndValidity();
            } else if (this.secondFormGroup.valid) {
                segmentId.clearValidators();
                segmentId.updateValueAndValidity();
                this.notificationLimit = this.secondFormGroup.get('notificationLimit').value;
                this.fixedScheduled = this.secondFormGroup.get('fixedScheduled').value;
                stepper.next();
            }
        }
        else {
            if (this.activity != 'Member File upload segment campaign') {
                if (this.prePopulateSegmentId != '') {
                    this.segmentFileUploadValueError = false;
                }
                else {
                    this.segmentFileUploadValueError = true;
                }
                if (this.prePopulateSegmentId != '' && this.prePopulateSegmentId != undefined) {
                    this.fixedScheduled = 'fixed';
                    stepper.next();
                }
            }
            else {
                segmentId.clearValidators();
                segmentId.updateValueAndValidity();
                this.notificationLimit = this.secondFormGroup.get('notificationLimit').value;
                this.fixedScheduled = this.secondFormGroup.get('fixedScheduled').value;
                // this.pushLocale(this.pushData);
                // this.smsLocale(this.smsData);
                // this.emailLocale(this.emailData);
                stepper.next();
            }
            // if (this.skuFileName == '') {
            //     this.skuRequiredError = true;
            //     this.validateSkuFile = false;
            // } else {
            //     this.skuRequiredError = false;
            //     if (this.skuFilePath == '' || this.customersSelected == '') {
            //         this.validateSkuFile = true;
            //     } else {
            //         this.validateSkuFile = false;
            //         // this.populateData();
            stepper.next();
            //     }
            // }
        }
        if (this.optionsChecked.length == 0) {
            this.commError = true;
        }
        // if(this.couponData.length == 0 && this.burnRuleData.length === 0 && this.earnRuleData.length === 0 ){
        //     this.promotionError = true;
        // }
        if (this.commError) {
            stepper.previous();
        }
    }


    onChangeInEditor(event) {
        this.getEventEditor = event.editor;
    }

    addKeyWordsContent() {
        if (this.contentSet) {
            this.getRange = this.getEventEditor.selection.getRng();
            this.newNodeAdd = this.getEventEditor.getDoc().createElement("span");
            this.newNodeAdd.innerText = `${this.setDataContent}`;
            this.getRange.insertNode(this.newNodeAdd);
            this.contentSet = false;
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

    public updateValidation(value: any) {
        if (value == 'ONE_TIME') {
            // this.reqField = true;
            let startDate = this.firstFormGroup.get('startDate');
            let endDate = this.firstFormGroup.get('endDate');
            startDate.clearValidators();
            startDate.updateValueAndValidity();
            endDate.clearValidators();
            endDate.updateValueAndValidity();
        }
        if (value == 'IMMEDIATE') {
            let startDate = this.firstFormGroup.get('startDate');
            let endDate = this.firstFormGroup.get('endDate');
            startDate.clearValidators();
            startDate.updateValueAndValidity();
            endDate.clearValidators();
            endDate.updateValueAndValidity();
        }
        if (value == 'MONTHLY') {
            let deliveryMonthDay = this.firstFormGroup.get('deliveryMonthDay');
            deliveryMonthDay.setValidators([Validators.required]);
            deliveryMonthDay.updateValueAndValidity();
        }
        else {
            let deliveryMonthDay = this.firstFormGroup.get('deliveryMonthDay');
            deliveryMonthDay.clearValidators();
            deliveryMonthDay.updateValueAndValidity();
        }

        if (value == 'WEEKLY') {
            let deliveryWeekDay = this.firstFormGroup.get('deliveryWeekDay');
            deliveryWeekDay.setValidators([Validators.required]);
            deliveryWeekDay.updateValueAndValidity();
        }
        else {
            let deliveryWeekDay = this.firstFormGroup.get('deliveryWeekDay');
            deliveryWeekDay.clearValidators();
            deliveryWeekDay.updateValueAndValidity();
        }
        this.selectedDaysOptions = [];
        this.selectedWeekdaysOptions = [];
    }

    getCampaignDataById() {

        // this.href = this.router.url.split('/')[2];
        let data = {
            campaignId: this.href
        }

        // this.url = this.router.url.split('/')[3] == 'clone' ? "create" : "update";
        // this.btntxt = this.router.url.split('/')[3] == 'clone' ? "ADD" : "UPDATE";
        this.url = this.UTLtype == 'clone' ? "create" : "update";
        this.btntxt = this.UTLtype == 'clone' ? "ADD" : "UPDATE";
        this.https.postJson(environment.APIEndpoint + 'api/rpa/campaign/ca/v1/view', data).subscribe(res => {
            console.log(res);

            this.campaignData = res;
            this.htmlContent = this.campaignData.content[0].emailContent.emailContentLocale[0].content;
            this.templateHtml = this.campaignData.content[0].emailContent.emailContentLocale[0].templateHtml;
            this.templateCss = this.campaignData.content[0].emailContent.emailContentLocale[0].templateCss;
            // console.log(this.campaignData.content[0].emailContent.emailContentLocale[0].content);
            this.toggleVal = this.campaignData.basicDetails.status == "ONLINE" ? true : false;
            this.statusValue = this.campaignData.basicDetails.status == "ONLINE" ? 'ONLINE' : 'OFFLINE';
            this.loadStripoScript();
            this.populateData();
        }, err => {
        })
    }

    public setChecked(type) {

        this.communicationTypes.forEach(com => {
            if (com.name == type) {
                com.checked = true;
            }
        });
    }

    public getWeekDayChecked(deliveryWeekDay) {

        this.weekDays.forEach(day => {
            if (deliveryWeekDay.indexOf(day.value) > -1) {
                this.weekList.push(day.value);
            }
        })
    }

    public getMonthDayChecked(deliveryMonthDay) {

        this.monthList = deliveryMonthDay.split(",");
    }

    isSelected(value: boolean): boolean {
        if (value)
            return true;
        else
            return false;
    }


    public prePopulateSegmentId;

    public prePopulateActivityId;

    public prePopulatePushTempId;
    public prePopulateSMSTempId;
    public prePopulateEmailTempId;
    public prePopulatesegmentType;
    public prePopulatevalidMemberCount;
    public prePopulateinValidMemeberCount;
    public prepoulateValidateStatus;

    public populateData() {
        this.getCampaignData();
        // this.optionsArabicChecked = this.campaignData.audience.includeArabicCustomers;
        // this.updateCheckedArabicOptions(this.optionsArabicChecked);
        this.closeDialog();
        this.getActivityList(this.prePopulateActivityId);
        this.getSegmentList(this.segmentTypeValue, this.prePopulateSegmentId);
        this.getTemplateList(this.prePopulatePushTempId, this.prePopulateSMSTempId, this.prePopulateEmailTempId);
        let editStartTime = new Date();
        if (this.campaignData.basicDetails.deliveryTime) {
            let s = this.campaignData.basicDetails.deliveryTime.split(":");
            let s1 = s[1].split(" ");
            editStartTime.setHours(s[0]);
            editStartTime.setMinutes(s1[0]);
            editStartTime.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })
        }



        if (this.campaignData.basicDetails.activityName == 'File Upload Segment Campaign' && this.campaignData.basicDetails.activityName == 'Member File upload segment campaign') {
            this.customersSelected = "";
            this.emailCustomersSelected = "";
            this.nonMembercamp = true;
        }

        else {
            this.customersSelected = this.campaignData.audience.customerSelctedCount;
            this.emailCustomersSelected = this.campaignData.audience.selectedEmailCount;
            this.nonMembercamp = false;
        }
        this.customerSelectedCount = this.campaignData.audience.customerSelctedCount;
        if (this.customerSelectedCount < 500 && this.customerSelectedCount >= 0) {
            this.getCustomerBtnEnbale = true;
        }
        else {
            this.getCustomerBtnEnbale = false;
            this.downloadQuery = false;
        }

        this.segmentQuery = this.campaignData.audience.segmentQuery;
        this.segmentAttrJson = this.campaignData.audience.segmentAttrJson;
        this.notificationLimit = this.secondFormGroup.get('notificationLimit').value;
        this.fixedScheduled = this.secondFormGroup.get('fixedScheduled').value;
        if (this.campaignData.audience.filePath != "") {
            this.filePath = this.campaignData.audience.filePath;
        }
        else {
            this.filePath = "";
        }

        this.campaignName = this.campaignData.basicDetails.campaignName;
        this.campStartDate = moment(this.campaignData.basicDetails.campaignStartDate).format('DD-MM-YYYY');
        this.campEndDate = moment(this.campaignData.basicDetails.campaignEndDate).format('DD-MM-YYYY');
        this.activity = this.campaignData.basicDetails.activityName;

        this.segmentTypeValue = this.campaignData.audience.segmentType;
        if (null != this.campaignData.basicDetails.promotionType) {
            this.promotionType = this.campaignData.basicDetails.promotionType;
            this.promotionId = this.promotionType == 'COUPON' ? this.campaignData.basicDetails.attachedCouponId : this.campaignData.basicDetails.attachedRuleId;
        }
        this.ruleType = this.campaignData.basicDetails.ruleType;

        let radioValue = this.campaignData.audience.fixedOrScheduled == 'FIXED' ? 'fixed' : 'scheduled'

        this.optionsChecked = this.campaignData.basicDetails.communicationType;
        this.communications = this.optionsChecked;

        if (this.campaignData.basicDetails.deliveryWeekDay != "" && this.campaignData.basicDetails.deliveryWeekDay != undefined) {

            this.getWeekDayChecked(this.campaignData.basicDetails.deliveryWeekDay);
        }

        if (this.campaignData.basicDetails.deliveryMonthDay != "" && this.campaignData.basicDetails.deliveryMonthDay != undefined) {

            this.getMonthDayChecked(this.campaignData.basicDetails.deliveryMonthDay);
        }

        if (this.campaignData.basicDetails.communicationType.match('EMAIL')) {
            this.setChecked('EMAIL');
            this.emailChecked = true;
        }
        if (this.campaignData.basicDetails.communicationType.match('PUSH')) {
            this.setChecked('PUSH');
            this.pushChecked = true;
        }
        if (this.campaignData.basicDetails.communicationType.match('SMS')) {
            this.setChecked('SMS');
            this.smsChecked = true;
        }
    
        this.prePopulateActivityId = this.campaignData.basicDetails.activityId;
        this.firstFormGroup.patchValue({
            activity: this.campaignData.basicDetails.activityId,
            campaignName: this.UTLtype != 'clone' ? this.campaignData.basicDetails.campaignName : "",
            campaignDesc: this.campaignData.basicDetails.campaignDescription,
            startDate: this.UTLtype != 'clone' ? this.campaignData.basicDetails.campaignStartDate : "",
            endDate: this.UTLtype != 'clone' ? this.campaignData.basicDetails.campaignEndDate : "",
            deliveryFrequency: this.campaignData.basicDetails.deliveryFrequency,
            deliveryDate: this.campaignData.basicDetails.deliveryDate,
            deliveryTime: editStartTime,
            deliveryWeekDay: this.weekList,
            deliveryMonthDay: this.monthList
        });

       

        this.prePopulateSegmentId = this.campaignData.audience.segmentId;


        this.prePopulatesegmentType = this.campaignData.audience.segmentType;

        this.prePopulatevalidMemberCount = this.campaignData.audience.validMemberCount;
        this.prePopulateinValidMemeberCount = this.campaignData.audience.inValidMemeberCount;

        this.prepoulateValidateStatus = this.campaignData.audience.fileValidateStatus;


        this.prePopulatePushTempId = this.campaignData.content[0].pushContent.templateId === 0 ? "" : this.campaignData.content[0].pushContent.templateId;
        this.prePopulateSMSTempId = this.campaignData.content[0].smsContent.templateId === 0 ? "" : this.campaignData.content[0].smsContent.templateId;
        this.prePopulateEmailTempId = this.campaignData.content[0].emailContent.templateId === 0 ? "" : this.campaignData.content[0].emailContent.templateId;
        this.segmentFileSucessFileData = this.campaignData.audience.successFilePath;
        this.segmentFileErrorFileData = this.campaignData.audience.errorFilePath;

        this.segmentvalidMemberCount = this.campaignData.audience.validMemberCount;
        this.segmentinValidMemeberCount = this.campaignData.audience.inValidMemeberCount;
        this.segmentfileValidateStatus = this.campaignData.audience.fileValidateStatus;

        this.secondFormGroup.patchValue({
            segmentId: this.campaignData.audience.segmentId,
            segmentDesc: this.campaignData.audience.segmentDescription,
            notificationLimit: this.campaignData.audience.notificationLimit,
            fixedScheduled: radioValue,
            smsRestriction: this.campaignData.audience.smsRestriction,
            isIncludeArabic: this.campaignData.audience.includeArabicCustomers,
            segmentType: this.campaignData.audience.segmentType
        })

        if (this.campaignData.audience.segmentType == 'SEGMENT_MEMBER_AND_NON_MEMBER') {
            this.segmentMemNonMem = true;
        }
        else{
            this.segmentMemNonMem = false;
        }

        if (this.campaignData.content != "") {
            this.thirdFormGroup.patchValue({
                pushTemplate: this.campaignData.content[0].pushContent.templateId === 0 ? "" : this.campaignData.content[0].pushContent.templateId,
                smsTemplate: this.campaignData.content[0].smsContent.templateId === 0 ? "" : this.campaignData.content[0].smsContent.templateId,
                emailTemplate: this.campaignData.content[0].emailContent.templateId === 0 ? "" : this.campaignData.content[0].emailContent.templateId,
                //pushSenderId: this.campaignData.content[0].pushContent.senderId,
                smsSenderId: this.campaignData.content[0].smsContent.senderId,
                emailSenderId: this.campaignData.content[0].emailContent.senderId,
                pushLinkTo: this.campaignData.content[0].pushContent.linkTo,
                specificBrand: this.campaignData.content[0].pushContent.linkToId != undefined ? this.campaignData.content[0].pushContent.linkToId : null,
                pushHyperLink: this.campaignData.content[0].pushContent.hyperLink,
                smsHyperLink: this.campaignData.content[0].smsContent.hyperLink,
                emailHyperLink: this.campaignData.content[0].emailContent.hyperLink
            })

            this.pushLocale(this.campaignData.content[0].pushContent.pushContentLocale);
            this.smsLocale(this.campaignData.content[0].smsContent.smsContentLocale);
            this.emailLocale(this.campaignData.content[0].emailContent.emailContentLocale);
            this.linkToId = this.campaignData.content[0].pushContent.linkToId;
            this.linkToIteamName = this.campaignData.content[0].pushContent.linkToItemName;
        }


       
        if (this.campaignData.basicDetails.deliveryFrequency === "ONE_TIME" || this.campaignData.basicDetails.deliveryFrequency === "IMMEDIATE") {
            let sDate = this.firstFormGroup.get('startDate');
            let eDate = this.firstFormGroup.get('endDate');
            // this.firstFormGroup.get('deliveryDate').setValue('');
            // let deliveryDateVal = this.firstFormGroup.get('deliveryDate');
            // deliveryDateVal.clearValidators();
            // deliveryDateVal.updateValueAndValidity();
            sDate.clearValidators();
            sDate.setValue('');
            sDate.updateValueAndValidity();
            eDate.clearValidators();
            eDate.setValue('');
            eDate.updateValueAndValidity();
        }
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

    public pushImgValue: any = [];
    public pushLocale(pushLocale) {
        try {
            this.pushImgValue = pushLocale;
            if (pushLocale != "" && pushLocale != undefined) {
                for (let i = 0; i < pushLocale.length; i++) {
                    const item = <FormArray>this.thirdFormGroup.controls['pushLocaleArray'];
                    this.textAreaAppSubject[i] = pushLocale[i].subject;
                    this.textAreaAppContent[i] = pushLocale[i].content;
                    item.at(i).patchValue({
                        subject: this.textAreaAppSubject[i],
                        content: this.textAreaAppContent[i],
                        languageId: pushLocale[i].languageName
                    });
                    this.languageDirection.push(this.languages[i].direction == 'RTL' ? 'direction' : '');
                    this.langfield.push(this.languages[i].direction == 'RTL' ? 'text-right' : '');
                    this.langfieldname.push(this.languages[i].direction == 'RTL' ? 'lang-field-name' : '');
                    this.arbicInvalid.push(this.languages[i].direction == 'RTL' ? 'arabicCheck' : 'mat-card');

                    // pushLocale[i].imagePath = this.imagePath[i]
                    // this.imagePath.push(pushLocale[i].imagePath);
                }
                for (let i = 0; i < this.pushImgValue.length; i++) {
                    try {
                        this.imagePath[i] = this.pushImgValue[i].imagePath;

                    }
                    catch{
                        this.imagePath.push(this.pushImgValue[i].imagePath);

                    }
                    // this.pushImgValue[i].imagePath[i] = this.imagePath[i];
                    if (this.imagePath[i] != '') {
                        this.prePopulateImg = true;
                        this.uploadFlag[i] = true;
                    }
                    else {
                        this.prePopulateImg = false;
                        this.uploadFlag[i] = false;
                    }

                }

                for (let i = 0; i < this.pushImgValue.length; i++) {
                    try {
                        this.imagePathTwo[i] = this.pushImgValue[i].imagePathTwo;

                    }
                    catch{
                        this.imagePathTwo.push(this.pushImgValue[i].imagePathTwo);

                    }
                    // this.pushImgValue[i].imagePath[i] = this.imagePath[i];
                    if (this.imagePathTwo[i] != '') {
                        this.prePopulateImgSecond = true;
                        this.storeImgFlag[i] = true;
                    }
                    else {
                        this.prePopulateImgSecond = false;
                        this.storeImgFlag[i] = false;
                    }
                }
            }
        }
        catch{

        }
    }

    public smsLocale(smsLocale) {
        if (smsLocale != "" && smsLocale != undefined) {
            for (let i = 0; i < smsLocale.length; i++) {
                const item = <FormArray>this.thirdFormGroup.controls['smsLocaleArray'];
                item.at(i).patchValue({
                    content: smsLocale[i].content == undefined ? '' : smsLocale[i].content,
                    languageId: smsLocale[i].languageName == undefined ? '' : smsLocale[i].languageName
                });
                this.languageDirection.push(this.languages[i].direction == 'RTL' ? 'direction' : '');
                this.langfield.push(this.languages[i].direction == 'RTL' ? 'direction' : '');
                this.langfieldname.push(this.languages[i].direction == 'RTL' ? 'direction' : '');
                this.arbicInvalid.push(this.languages[i].direction == 'RTL' ? 'arabicCheck' : 'mat-card');
            }
        }
    }

    public emailLocale(emailLocale) {
        if (emailLocale != "" && emailLocale != undefined) {
            for (let i = 0; i < emailLocale.length; i++) {
                const item = <FormArray>this.thirdFormGroup.controls['emailLocaleArray'];
                if (item.at(i) != undefined) {
                    item.at(i).patchValue({
                        subject: emailLocale[i].subject,
                        // content: emailLocale[i].content,
                        // languageId: emailLocale[i].languageName
                        // content: this.myTrim(emailLocale[i].content),
                    content: emailLocale[i].content,
                    languageId: emailLocale[i].languageName,
                    templateHtml: emailLocale[i].templateHtml,
                    templateCss: emailLocale[i].templateCss
                    })
                    this.languageDirection.push(this.languages[i].direction == 'RTL' ? 'direction' : '');
                    this.langfield.push(this.languages[i].direction == 'RTL' ? 'text-right' : '');
                    this.langfieldname.push(this.languages[i].direction == 'RTL' ? 'lang-field-name' : '');
                    this.arbicInvalid.push(this.languages[i].direction == 'RTL' ? 'arabicCheck' : 'mat-card');
                }
            }
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
            // deliveryDate: ['', Validators.compose([Validators.required])],
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
                group => this.firstFormGroup.get('deliveryWeekDay').value === 'WEEKLY',
                Validators.required
            )])],
            deliveryMonthDay: ['', Validators.compose([ExtraValidators.conditional(
                group => this.firstFormGroup.get('deliveryMonthDay').value === 'MONTHLY',
                Validators.required
            )])]
        });

    }

    public getCampaignData() {
        this.campaignName = this.firstFormGroup.get('campaignName').value;
        this.campStartDate = moment(this.firstFormGroup.get('startDate').value).format('DD-MM-YYYY');
        this.campEndDate = moment(this.firstFormGroup.get('endDate').value).format('DD-MM-YYYY');
        // this.activities.forEach(activity => {
        //     if (activity.id == this.firstFormGroup.get('activity').value) {
        //         this.activity = activity.value;
        //     }
        // });
        this.activities.forEach(activity => {
            if (activity.id == this.prePopulateActivityId) {
                this.activity = activity.value;
                if (null !== activity && activity.value === "File Upload Segment Campaign") {
                    this.nonMembercamp = true;
                    this.segmentTypeSelection = false;
                    this.communicationTypes.map(obj => {
                        if (obj.name == "PUSH") {
                            obj.display = false;
                            // obj.checked = false;
                        }
                    });
                }
                else if (null !== activity && activity.value === "Member File upload segment campaign") {
                    this.nonMembercamp = false;
                    this.secondFormGroup.get('segmentType').setValue('SEGMENT_MEMBER');
                    this.segmentTypeSelection = true;
                    this.communicationTypes.map(obj => { obj.display = true });
                }
                else {
                    this.segmentTypeSelection = true;
                    this.secondFormGroup.get('segmentType').setValue('SEGMENT_RULE');
                    this.nonMembercamp = false;
                    this.communicationTypes.map(obj => { obj.display = true });
                }
            }
        });

        let d1 = moment(new Date(this.firstFormGroup.get('startDate').value)).format('YYYY-MM-DD');
        let d2 = moment(new Date(this.firstFormGroup.get('endDate').value)).format('YYYY-MM-DD');
        let d3 = moment(new Date(this.firstFormGroup.get('deliveryDate').value)).format('YYYY-MM-DD');
        let date = moment(new Date()).format('YYYY-MM-DD');
        // let time = moment(new Date()).format('hh:mm A');
        // let d4 = moment(new Date(this.firstFormGroup.get('deliveryTime').value)).format('hh:mm A');


        this.dateError1 = d1 > d2 || d1 < date ? true : false;
        this.dateError2 = d2 < d1 || d2 < date ? true : false;
        this.dateError3 = d3 < date ? true : false;
        // this.dateError4 = d4 < time ? true : false;

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
                segmentId: selectedValue.segmentId,
                boolCampaign: this.boolCampaignVal
            }

            let segmentData: any;

            let GET_SEGEMENT_DATA_BY_ID = environment.APIEndpoint + "api/rpa/campaign/v1/segment/rule";
            this.https.postJson(GET_SEGEMENT_DATA_BY_ID, request).subscribe(res => {
                this.selectfinalQuery = false;
                this.disableData = false;
                segmentData = res;
                this.customersSelected = segmentData.customerSelctedCount;
                this.emailCustomersSelected = segmentData.selectedEmailCount;
                this.segmentQuery = segmentData.segmentQuery;
                this.segmentAttrJson = segmentData.segmentAttrJson;
                this.customerSelectedCount = segmentData.customerSelctedCount;

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
                    segmentDesc: segmentData.segmentDescription
                })

            }, err => {
                this.selectfinalQuery = false;
                this.disableData = false;
            });
        }
        else {
            this.getSegmentValue(selectedValue);
        }
    }

    getSegmentValue(segment) {
        this.segmentFileSucessFileData = segment.successFilePath;
        this.segmentFileErrorFileData = segment.errorFilePath;
        this.prePopulatevalidMemberCount = segment.validMemberCount;
        this.prePopulateinValidMemeberCount = segment.inValidMemeberCount;
        this.segmentfileValidateStatus = segment.fileValidateStatus;
        this.customerSelectedCount = segment.userCount;
        this.segmentIdValue = segment.segmentId;
        this.prePopulateSegmentId = segment.segmentId;
    }

    public buildSegmentForm() {
        this.secondFormGroup = this.formBuilder.group({
            segmentId: [''],
            segmentDesc: [''],
            isIncludeArabic: [''],
            segmentType: ['', Validators.compose([Validators.required])],
            // notificationLimit: ['', Validators.compose([Validators.required])],
            notificationLimit: ['', Validators.compose([Validators.required, Validators.min(1)])],
            fixedScheduled: [''],
            smsRestriction: [''],
        });
    }

    public smsDataValue;

    updateCheckedArabicOptions(item) {
        this.optionsArabicChecked = item;
        if (this.optionsArabicChecked == true) {
            this.renderer.addClass(this.document.body, 'embedded-body');
        } else {
            this.renderer.removeClass(this.document.body, 'embedded-body');
        }
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
        }
    }

    public buildContentForm() {
        this.thirdFormGroup = this.formBuilder.group({
            pushTemplate: [''],
            smsTemplate: [''],
            emailTemplate: [''],
            specificBrand: [],
            emailSenderId: ['', Validators.compose([ExtraValidators.conditional(group => this.emailChecked === true, Validators.required), Validators.pattern('[a-zA-Z0-9.-_]{1,}@[a-zA-Z.-]{2,}[.]{1}[a-zA-Z]{2,}')])],
            smsSenderId: ['', Validators.compose([ExtraValidators.conditional(group => this.smsChecked === true, Validators.required),])],
            pushLinkTo: ['', Validators.compose([ExtraValidators.conditional(group => this.pushChecked === true, Validators.required)])],
            pushHyperLink: [''],
            smsHyperLink: [''],
            emailHyperLink: [''],
            pushLocaleArray: this.formBuilder.array([]),
            smsLocaleArray: this.formBuilder.array([]),
            emailLocaleArray: this.formBuilder.array([]),
        });

        this.buildPushLocale();
        this.buildSMSLocale();
        this.buildEmailLocale();

    }

    public buildPushLocale() {

        for (let i = 0; i < this.languages.length; i++) {
            const control = <FormArray>this.thirdFormGroup.controls['pushLocaleArray'];
            let newForm = this.formBuilder.group({
                subject: ['', Validators.compose([ExtraValidators.conditional(group => this.pushChecked === true, Validators.required)])],
                content: ['', Validators.compose([ExtraValidators.conditional(group => this.pushChecked === true, Validators.required)])],
                languageId: []
            });
            control.push(newForm);
            this.languageDirection.push(this.languages[i].direction == 'RTL' ? 'direction' : '');
            this.langfield.push(this.languages[i].direction == 'RTL' ? 'direction' : '');
            this.langfieldname.push(this.languages[i].direction == 'RTL' ? 'direction' : '');
            this.arbicInvalid.push(this.languages[i].direction == 'RTL' ? 'arabicCheck' : 'mat-card');
            this.showEmojiPicker.push(false);
            this.textAreaAppSubject[i] = '';
            this.textAreaAppContent[i] = '';
        }
    }
    public buildSMSLocale() {

        for (let i = 0; i < this.languages.length; i++) {
            const control = <FormArray>this.thirdFormGroup.controls['smsLocaleArray'];
            let newForm = this.formBuilder.group({
                // subject: ['', Validators.compose([ExtraValidators.conditional(group => this.smsChecked === true, Validators.required)])],
                content: ['', Validators.compose([ExtraValidators.conditional(group => this.smsChecked === true, Validators.required)])],
                languageId: []
            });
            control.push(newForm);
            this.languageDirection.push(this.languages[i].direction == 'RTL' ? 'direction' : '');
            this.langfield.push(this.languages[i].direction == 'RTL' ? 'direction' : '');
            this.langfieldname.push(this.languages[i].direction == 'RTL' ? 'direction' : '');
            this.arbicInvalid.push(this.languages[i].direction == 'RTL' ? 'arabicCheck' : 'mat-card');
        }
    }
    public buildEmailLocale() {

        for (let ln of this.languages) {
            const control = <FormArray>this.thirdFormGroup.controls['emailLocaleArray'];
            let newForm = this.formBuilder.group({
                subject: ['', Validators.compose([ExtraValidators.conditional(group => this.emailChecked === true, Validators.required)])],
                content: ['', Validators.compose([ExtraValidators.conditional(group => this.emailChecked === true, Validators.required)])],
                languageId: []
            });
            control.push(newForm);
            this.languageDirection.push(ln.direction == 'RTL' ? 'direction' : '');
            this.langfield.push(ln.direction == 'RTL' ? 'text-right' : '');
            this.langfieldname.push(ln.direction == 'RTL' ? 'lang-field-name' : '');
            this.arbicInvalid.push(ln.direction == 'RTL' ? 'arabicCheck' : 'mat-card');
        }
    }

    public toggleStatus(event) {
        if (event.checked == true) {
            this.statusValue = 'ONLINE';
        } else {
            this.statusValue = 'OFFLINE';
        }
        this.alertDialog();
    }

    alertDialog(): void {
        const dialogReference = this.dialog.open(notificationDialog, {
            width: '350px',
        });
        dialogReference.componentInstance.statusValue = this.statusValue;
        dialogReference.afterClosed().subscribe(result => {
            if (result) {
                this.toggleVal = !this.toggleVal;
            }
        });
    }


    getActivityList(prePopulateActivityId) {
        let GET_ACTIVITY_LIST = environment.APIEndpoint + "api/rpa/campaign/v1/activity/list";
        this.https.getJson(GET_ACTIVITY_LIST)
            .subscribe((response) => {
                this.activities = response;
            }
                , err => {
                });
    }

    public segmentList;
    segments: Segment[] = [];
    segmentCtrl = new FormControl();
    filteredsegments: Observable<Segment[]>;

    smsTemplates: smsTemplate[] = [];
    smsTemplateCtrl = new FormControl();
    filteredsmsTemplates: Observable<smsTemplate[]>;

    emailTemplates: emailTemplate[] = [];
    emailTemplateCtrl = new FormControl();
    filteredemailTemplates: Observable<emailTemplate[]>;

    public segmentChanges(ev) {
        this.segmentTypeValue = ev;
        this.getSegmentList(this.segmentTypeValue, this.prePopulateSegmentId);
        if (this.segmentTypeValue == 'SEGMENT_MEMBER_AND_NON_MEMBER') {
            this.segmentMemNonMem = true;
        } else {
            this.segmentMemNonMem = false;
        }
        this.prePopulateSegmentId = '';
        this.segmentCtrl.reset('');
        this.segments = [];
    }

    getSegmentList(segmentTypeValue, prePopulateSegmentId) {
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
                    this.segments.push(objMallkey);
                }
                this.filteredsegments = this.segmentCtrl.valueChanges
                    .pipe(
                        startWith(''),
                        map(segment => segment ? this._filterSegments(segment) : this.segments.slice())
                    );
                for (let j = 0; j < this.segments.length; j++) {
                    if (this.segments[j].segmentId == this.prePopulateSegmentId) {
                        this.segmentCtrl.setValue(this.segments[j].segmentName);
                    }
                }
            }
                , err => {
                });
    }

    private _filterSegments(value: string): Segment[] {
        const filterValue = value.toLowerCase();
        return this.segments.filter(segment => segment.segmentName.toLowerCase().indexOf(filterValue) === 0);
    }

    private _filtersmsTemplates(value: string): smsTemplate[] {
        const filterValue = value.toLowerCase();
        return this.smsTemplates.filter(smsTemplate => smsTemplate.smsTemplateName.toLowerCase().indexOf(filterValue) === 0);
    }
    private _filteremailTemplates(value: string): emailTemplate[] {
        const filterValue = value.toLowerCase();
        return this.emailTemplates.filter(emailTemplate => emailTemplate.emailTemplateName.toLowerCase().indexOf(filterValue) === 0);
    }

    getTemplateList(prePopulatePushTempId, prePopulateSMSTempId, prePopulateEmailTempId) {
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

                for (let j = 0; j < this.pushTemplates.length; j++) {
                    if (this.pushTemplates[j].pushTemplateId == this.prePopulatePushTempId) {
                        this.pushTemplateCtrl.setValue(this.pushTemplates[j].pushTemplateName);
                    }
                }

            }
                , err => {
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
                for (let j = 0; j < this.smsTemplates.length; j++) {
                    if (this.smsTemplates[j].smsTemplateId == this.prePopulateSMSTempId) {
                        this.smsTemplateCtrl.setValue(this.smsTemplates[j].smsTemplateName);
                    }
                }
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
                for (let j = 0; j < this.emailTemplates.length; j++) {
                    if (this.emailTemplates[j].emailTemplateId == this.prePopulateEmailTempId) {
                        this.emailTemplateCtrl.setValue(this.emailTemplates[j].emailTemplateName);
                    }
                }
            }
                , err => {
                });
    }

    private _filterpushTemplates(value: string): pushTemplate[] {
        const filterValue = value.toLowerCase();
        return this.pushTemplates.filter(pushTemplate => pushTemplate.pushTemplateName.toLowerCase().indexOf(filterValue) === 0);
    }

    public onPushChange(selectedValue) {
        this.prePopulatePushTempId = selectedValue;
        this.pushTemplateChecked = true;
        this.pushData.forEach(push => {
            if (push.templateId == selectedValue) {
                this.thirdFormGroup.patchValue({
                    pushHyperLink: push.hyperLink
                })
                this.pushLocale(push.marketingTemplateLocales);
            }
        });
    }

    public onSMSChange(selectedValue) {
        this.prePopulateSMSTempId = selectedValue;
        this.smsTemplateChecked = true;
        this.smsData.forEach(sms => {
            if (sms.templateId == selectedValue) {
                this.thirdFormGroup.patchValue({
                    smsHyperLink: sms.hyperLink
                })
                this.smsLocale(sms.marketingTemplateLocales);
            }
        });
    }

    public onEmailChange(selectedValue) {
        this.prePopulateEmailTempId = selectedValue;
        this.emailTemplateChecked = true;
        this.emailData.forEach(email => {
            if (email.templateId == selectedValue) {
                this.thirdFormGroup.patchValue({
                    emailHyperLink: email.hyperLink
                })
                this.emailLocale(email.marketingTemplateLocales);
                // this.htmlContent = email.marketingTemplateLocales[0].content;
                this.templateHtml = email.marketingTemplateLocales[0].templateHtml;
                this.templateCss = email.marketingTemplateLocales[0].templateCss;
            }
        });
        this.loadStripoScript();
    }


    addRule() {
        const dialogRef = this.dialog.open(addRulesDialog, {
            data: {
                ruleId: this.campaignData.basicDetails.attachedRuleId,
                ruleType: this.campaignData.basicDetails.ruleType,
            }
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result.buttonName === 'SELECT') {
                this.promotionType = 'RULE'
                this.promotionError = false;
                let request = {};
                if (result.tableData.length == 0) {
                    this.promotionId = this.campaignData.basicDetails.attachedRuleId;
                    this.ruleType = this.campaignData.basicDetails.ruleType;
                    if (this.ruleType == 'BURN') {
                        request = {
                            burnRuleId: this.promotionId
                        }
                        let GET_BURN_RULE_DATA_BY_ID = environment.APIEndpoint + "api/rpa/burn/rule/v1/view/id";
                        this.https.postJson(GET_BURN_RULE_DATA_BY_ID, request).subscribe(res => {
                            this.burnRuleData = res;
                        }, err => {
                        });
                    }
                    else {
                        request = {
                            earnRuleId: this.promotionId
                        }
                        let GET_EARN_RULE_DATA_BY_ID = environment.APIEndpoint + "api/rpa/earnRule/v1/get";
                        this.https.postJson(GET_EARN_RULE_DATA_BY_ID, request).subscribe(res => {
                            this.earnRuleData = res;
                        }, err => {
                        });
                    }
                }
                else {
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
            }
        });
    }

    addCoupon() {
        const dialogRef = this.dialog.open(addCouponDialog, {
            data: {
                couponId: this.campaignData.basicDetails.attachedCouponId
            }
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result.buttonName === 'SELECT') {
                this.promotionError = false;
                this.promotionType = 'COUPON'
                if (result.tableData.length == 0) {
                    this.promotionId = this.campaignData.basicDetails.attachedCouponId
                }
                else {
                    this.promotionId = result.tableData[0].couponId;
                }
                let request = {
                    couponId: this.promotionId
                }
                let GET_COUPON_DATA_BY_ID = environment.APIEndpoint + "api/rpa/coupon/v1/get/couponcampaign";
                this.https.postJson(GET_COUPON_DATA_BY_ID, request).subscribe(res => {
                    this.couponData = res;
                }, err => {
                });
            }
        });
    }

    closeDialog() {
        this.couponData = [];
        this.burnRuleData = [];
        this.earnRuleData = [];
        this.promotionType = null;
        this.promotionId = null;
    }

    getCampaignVal(activity) {
        this.activity = activity.value;
        this.prePopulateActivityId = activity.id;
        this.prePopulateSegmentId = '';
        this.segmentCtrl.reset('');
        this.segments = [];
        if (null !== activity && activity.value === "File Upload Segment Campaign") {
            this.nonMembercamp = true;
            this.segmentTypeSelection = false;
            this.secondFormGroup.get('segmentType').setValue('');
            this.segmentTypes.map(obj => {
                obj.disabled = true;
            });
            this.communicationTypes.map(obj => {
                if (obj.name == "PUSH") {
                    obj.display = false;
                    obj.checked = false;
                    this.pushChecked = false;
                    this.customersSelected = "";
                    this.emailCustomersSelected = "";
                }
            });
        }
        else if (null !== activity && activity.value === "Member File upload segment campaign") {
            this.nonMembercamp = false;
            this.segmentTypeSelection = false;
            this.secondFormGroup.get('segmentType').setValue('SEGMENT_MEMBER');
            this.segmentTypeValue = 'SEGMENT_MEMBER';
            this.getSegmentList(this.segmentTypeValue, this.prePopulateSegmentId);
            this.communicationTypes.map(obj => { obj.display = true });
        }
        else {
            this.nonMembercamp = false;
            this.segmentTypeSelection = true;
            this.secondFormGroup.get('segmentType').setValue('SEGMENT_RULE');

            this.communicationTypes.map(obj => {
                obj.display = true
                obj.display = true
            });

        }
    }
    attributeDialog(index, type) {
        // this.activity
        const dialogRef = this.dialog.open(addAttributesDialog);
        dialogRef.componentInstance.campaignActivitySelection = this.activity;
        dialogRef.componentInstance.couponDataValue = this.couponData;
        dialogRef.afterClosed().subscribe(result => {
            let content;
            if (result.brand != undefined) {
                this.brandattr = result.brand;
                this.brandAttrId = result.brandId
                content = result.list.map(e => {
                    return `${e.fieldName}`
                });
                content.push(this.brandattr);
            } 
            else {
                content = result.map(e => {
                    return `${e.fieldName}`
                })
            }

            if (type == 'PUSH') {
                if (result.brand != undefined) {
                    this.otherAttr = result.list.map(e => { return e.id });
                    this.pushAttr = this.otherAttr;
                } 
                else {
                    this.pushAttr = result.map(e => { return e.id })
                }
                const item = <FormArray>this.thirdFormGroup.controls['pushLocaleArray'];
                this.insertAtCaret(content.join(" "), `#textareaPush${index}`, item, index, content);
            }
            else if (type == 'SMS') {
                if (result.brand != undefined) {
                    this.otherAttr = result.list.map(e => { return e.id });
                    this.smsAttr = this.otherAttr;
                } 
                else {
                    this.smsAttr = result.map(e => { return e.id });
                }

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
                }
                catch (err) {
                    // End code added by rohit gupta
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

        const dialogRef = this.dialog.open(segmentRuleDialog, {
            data: {
                segmentAttrJson: this.segmentAttrJson,
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            this.segmentAttrJson = result.segmentAttrJson;
            let request = {
                segmentAttrJson: JSON.stringify(this.segmentAttrJson),
                boolCampaign: this.boolCampaignVal,
                action: 'CREATE',
                couponOid: null != this.couponData ? this.couponData.couponId : null
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
                        // this.userSegment="";
                        // this.setSegmentAttribute();
                        setTimeout(() => {
                            this.selectfinalQuery = false;
                        }, 1000);
                        this.segmentData = response;
                        this.selectfinalQuery = false;

                        this.customersSelected = this.segmentData.customerCount;
                        if (this.customerSelectedCount < 500 && this.customerSelectedCount >= 0) {
                            this.getCustomerBtnEnbale = true;
                        }
                        else {
                            this.getCustomerBtnEnbale = false;
                            this.downloadQuery = false;
                        }
                        this.emailCustomersSelected = this.segmentData.emailCustomerCount;
                        this.segmentQuery = this.segmentData.finalQuery
                        this.filePath = this.segmentData.filePath;
                        this.segmentAttrJson = JSON.parse(this.segmentAttrJson);
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

                           
                            this.customerSelectedCountAbove = false;
                            this.selectfinalQuery = false;
                            this.segmentAttrJson = JSON.parse(this.campaignData.audience.segmentAttrJson);
                        });
                this.segmentError = false;
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

    updateCampaign() {

        if (this.thirdFormGroup.get('pushLinkTo').value == 'External Link') {
            this.updateValidationHyperLink(this.thirdFormGroup.get('pushLinkTo').value);
        }

        if (this.thirdFormGroup.invalid) {

            this.contentError = true;
        }
        if(this.thirdFormGroup.get('pushLinkTo').value == 'Product' || this.thirdFormGroup.get('pushLinkTo').value == 'Category')
            this.linkToItemErr = this.linkToId == '' ||  this.linkToId == undefined ? true : false;
        if (this.firstFormGroup.valid && this.secondFormGroup.valid && this.thirdFormGroup.valid && this.fileTypeErr != true && !this.linkToItemErr) {
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

            // let startDate = moment(this.firstFormGroup.get('startDate').value).format('YYYY-MM-DD HH:mm:ss');
            // let endDate = moment(this.firstFormGroup.get('endDate').value).format('YYYY-MM-DD HH:mm:ss');
            let delDate = (this.firstFormGroup.get('deliveryDate').value != '') ? moment(this.firstFormGroup.get('deliveryDate').value).format('YYYY-MM-DD') : "";
            let delTime = (this.firstFormGroup.get('deliveryTime').value != '') ? moment(this.firstFormGroup.get('deliveryTime').value).format('hh:mm A') : "";


            this.loading = true;
            this.showError = false;



            let request = {
                campaignId: (this.url != 'create') ? this.href : 0,
                // activityId: this.prePopulateActivityId,
                activityId: this.firstFormGroup.get('activity').value,
                campaignName: this.firstFormGroup.get('campaignName').value,
                campaignDescription: this.firstFormGroup.get('campaignDesc').value,
                campaignStartDate: startDate,
                campaignEndDate: endDate,
                status: this.toggleVal == true ? 'ONLINE' : 'OFFLINE',
                communicationType: this.communications,
                deliveryFrequency: this.firstFormGroup.get('deliveryFrequency').value,
                deliveryDate: delDate,
                deliveryTime: delTime,
                deliveryMonthDay: (this.firstFormGroup.get('deliveryMonthDay').value != '') ? this.firstFormGroup.get('deliveryMonthDay').value.join(",") : "",
                deliveryWeekDay: (this.firstFormGroup.get('deliveryWeekDay').value != '') ? this.firstFormGroup.get('deliveryWeekDay').value.join(",") : "",
                promotionId: this.promotionId,
                promotionType: null != this.promotionType ? this.promotionType : null,
                ruleType: this.ruleType,
            }

            let UPDATE_CAMPAIGN = environment.APIEndpoint + "api/rpa/campaign/v1/" + this.url;
            this.https.postJson(UPDATE_CAMPAIGN, request)
                .subscribe((response) => {
                    this.campaignData = response;
                    this.campaignId = this.campaignData.campaignId;
                    this.updateSegment();
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

    }

    updateSegment() {
        if (this.segmentTypeValue != "SEGMENT_RULE" && this.segmentTypeValue != null) {
            this.customersSelected = 0;
        }
        let request = {
            campaignId: this.campaignId,
            segmentId: this.prePopulateSegmentId,
            notificationLimit: this.secondFormGroup.get('notificationLimit').value,
            segmentDescription: this.secondFormGroup.get('segmentDesc').value,
            customerSelctedCount: this.customersSelected,
            selectedEmailCount: this.emailCustomersSelected,
            segmentQuery: this.segmentQuery,
            segmentAttrJson: JSON.stringify(this.segmentAttrJson),
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
                this.updateContent();
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

    updateContent() {
        this.loadingResponse = true;
        let request = {
            campaignId: this.campaignId,
            status: this.toggleVal == true ? 'ONLINE' : 'OFFLINE'
        }

        if (this.pushChecked) {
            for (let i = 0; i < this.languages.length; i++) {
                this.thirdFormGroup.value.pushLocaleArray[i].languageId = this.languages[i].languageId
            }
            if (this.thirdFormGroup.get('pushLinkTo').value === 'Our Brands') 
                this.linkToId = this.thirdFormGroup.get('specificBrand').value;
            
            let pushContent = {
                templateId: this.prePopulatePushTempId,
                //senderId : this.thirdFormGroup.get('pushSenderId').value,
                linkTo: this.thirdFormGroup.get('pushLinkTo').value,
                linkToId: this.linkToId != undefined ? this.linkToId : null,
                linkToItemName : this.linkToIteamName,
                hyperLink: this.thirdFormGroup.get('pushHyperLink').value,
                pushContentLocale: this.thirdFormGroup.value.pushLocaleArray,
                pushPersonaliseAttr: this.pushAttr
            }

            for (let i = 0; i < this.thirdFormGroup.value.pushLocaleArray.length; i++) {
                // const element = array[i];
                this.thirdFormGroup.value.pushLocaleArray[i].imagePath = this.imagePath[i];
                this.thirdFormGroup.value.pushLocaleArray[i].imagePathTwo = this.imagePathTwo[i];
                if (this.imagePath[i] != '') {
                    this.prePopulateImg = true;
                    this.uploadFlag[i] = false;
                }
                else {
                    this.prePopulateImg = false;
                    this.uploadFlag[i] = true;
                }

                if (this.imagePathTwo[i] != '') {
                    this.storeImgFlag[i] = false;
                }
                else {
                    this.storeImgFlag[i] = true;
                }

            }
            request['pushContent'] = pushContent
        }
        if (this.smsChecked) {
            for (let i = 0; i < this.languages.length; i++) {
                this.thirdFormGroup.value.smsLocaleArray[i].languageId = this.languages[i].languageId
            }
            let smsContent = {
                templateId: this.prePopulateSMSTempId,
                senderId: this.thirdFormGroup.get('smsSenderId').value,
                hyperLink: this.thirdFormGroup.get('smsHyperLink').value,
                smsContentLocale: this.thirdFormGroup.value.smsLocaleArray,
                smsPersonaliseAttr: this.smsAttr
            }
            request['smsContent'] = smsContent
        }
        if (this.emailChecked) {
            // for (let i = 0; i < this.languages.length; i++) {
            //     this.thirdFormGroup.value.emailLocaleArray[i].languageId = this.languages[i].languageId
            // }
            // let emailContent = {
            //     templateId: this.prePopulateEmailTempId,
            //     senderId: this.thirdFormGroup.get('emailSenderId').value,
            //     hyperLink: this.thirdFormGroup.get('emailHyperLink').value,
            //     emailContentLocale: this.thirdFormGroup.value.emailLocaleArray,
            //     emailPersonaliseAttr: this.emailAttr
            // }


            // request['emailContent'] = emailContent

            this.onExportHtmlTemp().then((d: any) => {
                this.getSeperateTemplate().then((contentObj: any) => {

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
                    request['emailContent'] = emailContent
                    this.repeatCreateForEmail(request);
                });
            });
            return;
        }

        let UPDATE_CONTENT = environment.APIEndpoint + "api/rpa/campaign/v1/content/update";
        this.https.postJson(UPDATE_CONTENT, request)
            .subscribe((response) => {
                this.segmentData = response;
                this.snackBar.openFromComponent(SnackBarComponent, {
                    duration: 1500,
                    data: {
                        status: "success",
                        message: "Campaign has been updated successfully"
                    }
                });
                this.loadingResponse = false;

                this.loading = false;
                sessionStorage.clear();
                this.router.navigate(['/search-campaign']);
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



    
    // Stripo code starts

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

    public loadDemoTemplate(callback) {
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
        let UPDATE_CONTENT = environment.APIEndpoint + "api/rpa/campaign/v1/content/update";
        this.https.postJson(UPDATE_CONTENT, request)
            .subscribe((response) => {
                this.segmentData = response;
                this.snackBar.openFromComponent(SnackBarComponent, {
                    duration: 1500,
                    data: {
                        status: "success",
                        message: "Campaign has been updated successfully"
                    }
                });
                this.loading = false;
                // this.buttonDisable = true;
                this.router.navigate(['/search-campaign']);
            }
                , err => {
                    this.loading = false;
                    // this.buttonDisable = false;
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

  // Stripo code ends









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
    expandDataEmail() {
        var allifram = document.getElementById("arabicID");
        var iFrame_Arabic = allifram.getElementsByTagName("iframe")[0];
        var html_Arabic = iFrame_Arabic.contentWindow.document.getElementsByTagName("html")[0];
        html_Arabic.setAttribute("style", "direction: rtl;text-align: right;");
    }
    uploadFileSku(event: FileList) {
        //pick from one of the 4 styles of file uploads below
        this.uploadAndProgress(event, "skuFile");
    }

    public uploadImage(event: FileList, i) {
        if (event[0].type == "image/jpeg" || event[0].type == "image/png" || event[0].type == "image/jpg") {
            if (event[0].size < 1000000) {
                this.uploadFile.upload(event.item(0), 'brandCategory', 'images')
                    .subscribe((response) => {
                        this.imagePath[i] = response['message'];
                        this.uploadFlag[i] = true;
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
    public removeImage(index) {
        this.imagePath[index] = "";
        this.uploadFlag[index] = false;
        const control = this.thirdFormGroup.get('notificationArray') as FormArray;
        // control.at(index).get('campaingnPushImage').setValue('');
    }

    public removeDetailImage(index) {
        this.imagePathTwo[index] = "";
        this.storeImgFlag[index] = false;
        const control = this.thirdFormGroup.get('notificationArray') as FormArray;
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
                        message: "file successfully uploaded"
                    }
                });
            }, err => {
                if (err.error.errorType == 'VALIDATION') {
                    this.snackBar.openFromComponent(SnackBarComponent, {
                        duration: 10000,
                        data: {
                            status: "failure",
                            message: 'File Extension Not Valid'
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
            );
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
                activityId: this.prePopulateActivityId,
                filePath: this.skuFilePath,
            }
            let VALIDATE_SKUS = environment.APIEndpoint + "api/rpa/campaign/v1/validate/";
            this.http.postJson(VALIDATE_SKUS, request)
                .subscribe((response) => {
                    this.nonmemberData = response;
                    this.customersSelected = this.nonmemberData.customerCount;
                    this.emailCustomersSelected = this.nonmemberData.emailCustomerCount;
                    this.smsCustomersSelected = this.nonmemberData.smsCustomerCount;
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
        console.log(index);
        const emoji : string = (event.emoji as any).native;
        const input = (index == 0) ? this.input.first.nativeElement : this.input.last.nativeElement;
        console.log(input);
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
        console.log(inputContent);
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