import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { HttpService } from 'src/app/services/http-service';
import { Router } from '@angular/router';
import { segmentRuleDialog } from '../../../../../shared/components/segment-rule-dialog/segment-rule.component';
import { MatDialog, MatSnackBar } from '@angular/material';
import { environment } from 'src/environments/environment';
import { UploadFile } from 'src/app/services/uploadFile.service';
import { SnackBarComponent } from 'src/app/shared/components/snack-bar/snack-bar.component';
import { uploadBonusFile } from 'src/app/services/uploadBonus.service';


@Component({
    selector: 'add-customer-segments',
    templateUrl: './add-customer-segments.component.html',
    styleUrls: ['./add-customer-segments.component.scss']
})
export class AddCustomerSegmentsComponent implements OnInit {
    public breadCrumbData: Array<Object> = [{
        title: 'Marketing',
        link: ''
    }, {
        title: 'Customer Segments',
        link: '/search-customer-segments'
    }
    ];

    public SEGMENT_MEMBER_TYPE: boolean = false;
    public SEGMENT_NON_MEMBER_TYPE: boolean = false;
    public SEGMENT_MEMBER_AND_NON_MEMBER_TYPE: boolean = false;
    public SEGMENT_RULE_MEMBER_TYPE: boolean = false;

    public removeSegmentBool: boolean = false;

    @ViewChild("createCustomerSegmentsForm") createCustomerSegmentsForm;
    customerSegmentsFormGroup: FormGroup;
    public loading: boolean = false;
    public err: boolean = false;
    public statusValue: string = 'ONLINE';
    public toggleVal: boolean = true;
    checked = true;
    disabled = false;
    selectfinalQuery: boolean = false;
    closeLoader: boolean = false;
    public customerSelectedCount: number;
    public finalQuery: string;
    public filePath: string;
    public filePathCustomer: string;
    public segmentData: any = [];
    public customerSegmentFileapply: any = [];
    public customerfilePath: boolean = false;
    public segmentAttrJson: string;
    public fileUrl = localStorage.getItem("fileBaseUrl");
    public downloadQuery: boolean = false;
    public segmentErrorMes;
    public userSegment = "";
    public addEndBrace = false;
    public finalCondition: string = "AND";
    public loadingResponse: boolean = false;
    public getCustomerBtnEnbale: boolean = false;
    public customerSelectedCountAbove: boolean = false;
    public disableData: boolean = false;
    public disableSegmentOptions: boolean = false;

    @ViewChild('uploadSku') uploadSkuRef: ElementRef;
    fileTypeErr: boolean;




    public skuFileName = '';
    public skuFilePath = '';

    public segmentType;
    public skuErrorFileName = '';
    public skuErrorFile = '';
    public codeCountBool: boolean = false;



    public manualFileRequired = false;
    public validCouponCode = false;
    public validCouponRequired = false;
    public skuRequired = false;
    public submitForm = true;

    public nonmemberData: any = [];
    public customersSelected: '';
    public emailCustomersSelected: '';
    public errorFilePathUrl = localStorage.getItem("fileBaseUrl");

    public errorMesCampaign;


    @ViewChild('uploadFile') uploadManualXLSFile: ElementRef;

    //skuValidated: boolean
    public validSkuFile = true;
    public validateSkuFile = false;
    skuRequiredError: boolean = false;

    public memberData: any = [];
    public customersMemSelected: '';
    public emailCustomersMemSelected: '';
    public validMemCouponRequired = false;
    @ViewChild('uploadMemSku') uploadMemSkuRef: ElementRef;
    public fileTypeMemErr: boolean;
    public validMemSkuFile = true;
    public validateMemSkuFile = false;
    public skuMemRequiredError: boolean = false;
    public skuMemFilePath = '';
    public skuMemFileName = '';
    public skuMemErrorFile = '';
    public skuMemErrorFileName = '';
    public skuMemRequired = false;
    public submitMemForm = true;
    public manualErrorFileName = '';
    public skuMemeRequiredError: boolean = false;

    public memberNonData: any = [];
    public customersNonMemSelected: '';
    public emailCustomersNonMemSelected: '';
    public validNonMemCouponRequired = false;
    @ViewChild('uploadNonMemSku') uploadNonMemSkuRef: ElementRef;
    public fileTypeNonMemErr: boolean;
    public validNonMemSkuFile = true;
    public validateNonMemSkuFile = false;
    public skuNonMemRequiredError: boolean = false;
    public skuNonMemFilePath = '';
    public skuNonMemFileName = '';
    public skuNonMemErrorFile = '';
    public skuNonMemErrorFileName = '';
    public skuNonMemRequired = false;
    public submitNonMemForm = true;
    public manualErrorNonFileName = '';
    public skuNonMemeRequiredError: boolean = false;


    public segmentFileOid;

    public skuValidated: boolean = false;
    public skuNonMemValidated: boolean = false;
    public skuMemValidated: boolean = false;

    public errorMes: boolean = false;
    public errorMes1: boolean = false;
    fileUploadLength: number = 0;
    public reciprociUploadFile: File;




    public segementData = [{
        "value": "ca__gender",
        "name": "Gender"
    }, {
        "value": "ca__dateOfBirth",
        "name": "Age"
    }, {
        "value": "birthDateRange",
        "name": "DOB Range without year"
    }, {
        "value": "ca__COUNTRY_OID",
        "name": "Country of Residence"
    }, {
        "value": "mobileCountryCode",
        "name": "Mobile Country Code"
    }, {
        "value": "ca__CITY_OID",
        "name": "City"
    }, {
        "value": "ca__NATIONALITY_OID",
        "name": "Nationality"
    }, {
        "value": "ca__EMAIL_ID",
        "name": "Email Id"
    }, {
        "value": "ca__TIER_OID",
        "name": "Customer Tier"
    }, {
        "value": "ca__OID",
        "name": "Fixed Customers"
    }, {
        "value": "INCOMPLETE_PROFILE",
        "name": "Incomplete Profile"
    }, {
        "value": "txn__transaction_type",
        "name": "Transaction Type"
    }, {
        "value": "txn__business__type",
        "name": "Business Type"
    }, {
        "value": "txn__brand_transacted",
        "name": "Brands Transacted With"
    }, {
        "value": "course",
        "name": "Course Transacted With"
    }, {
        "value": "txn__no",
        "name": "No. of Transactions"
    }, {
        "value": "txn__date",
        "name": "Transaction Date"
    }, {
        "value": "txn__booking__day",
        "name": "Booking Day"
    }, {
        "value": "txn__city",
        "name": "City Transacted With"
    }, {
        "value": "txn__average",
        "name": "Average Value of Transactions"
    }, {
        "value": "pstmt__redeem__trans",
        "name": "Redeemed Transactions in"
    }, {
        "value": "txn__currency",
        "name": "Currency"
    }, {
        "value": "txn__annual__spend",
        "name": "Annual Spending"
    },
    {
        "value": "txn__cumulative__spend",
        "name": "Cumulative Spending"
    },
    {
        "value": "txn__lifetime__spend",
        "name": "Annual Spending"
    },
    {
        "value": "txn__last__transaction",
        "name": "Last Transaction"
    }, {
        "value": "cc__coupon",
        "name": "Coupon"
    }, {
        "value": "status__coupon",
        "name": "Coupon Status"
    }, {
        "value": "pstmt__redeem__point",
        "name": "Point Redeemed"
    }, {
        "value": "pstmt__redeem__date",
        "name": "Point Redeemed Date"
    }, {
        "value": "tspt__balance__points",
        "name": "Point Redeemed Date"
    }, {
        "value": "tspt__expiry__point",
        "name": "Expired Points"
    }, {
        "value": "tspt__point__expiry__date",
        "name": "Point Expiry Date"
    }, {
        "value": "cpst__expiry__point__days",
        "name": "Remaining Days For Expiry"
    }, {
        "value": "cp__customerType_member",
        "name": "Member"
    },
    ];


    constructor(private fb: FormBuilder, 
        private https: HttpService,
        private router: Router,
        private uploadFiles: UploadFile,
        public dialog: MatDialog, 
        public snackBar: MatSnackBar,
        public uploadBonusFile: uploadBonusFile, 
        private uploadFile: UploadFile) {
        this.buildCreateCustomerSegmentsForm();
    }

    ngOnInit() {
        this.setLocalStorageData();
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
            $.getJSON(environment.APIEndpoint + "api/rpa/master/brand/ca/v2/get/brands", function (data) {
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
                    let couponIdName = item.couponId + '-' + item.couponTitle;
                    item['couponIdName'] = couponIdName;
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
            $.get(environment.APIEndpoint + "api/rpa/store/v2/getAllStores", function (data) {
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

                data.forEach(function (item) {
                    let campIdName = item.campaignId + '-' + item.campaignName;
                    item['campIdName'] = campIdName;
                });
                localStorage.campiagnData = JSON.stringify(data);

            });
        }
        if (localStorage.txnCountryCityData === undefined) {
            $.ajaxSetup({
                headers: {
                    'Authorization': userData.token_type + " " + userData.access_token,
                    'Accept-Language': 'EN',
                    'Content-Type': 'application/json'
                }
            });
            $.getJSON(environment.APIEndpoint + "api/rpa/master/city/v1/get/txn/cityList", function (data) {
                localStorage.txnCountryCityData = JSON.stringify(data.txnCityList);
            });
        }
    }

    public buildCreateCustomerSegmentsForm() {
        let form = {
            segmentName: ["", Validators.required],
            description: ["", Validators.required],
            segmentType: ["", Validators.required]
        }
        this.customerSegmentsFormGroup = this.fb.group(form);
    }

    public checkSegmentName() {

        let request = {
            segmentName: this.customerSegmentsFormGroup.get('segmentName').value
        }

        let CHECK_SEGMENT_NAME = environment.APIEndpoint + "api/rpa/customer/segment/v1/check/segment/name"
        this.https.postJson(CHECK_SEGMENT_NAME, request)
            .subscribe((response) => {
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

    public toggleStatus(event) {
        if (event.checked == true) {
            this.statusValue = 'ONLINE';
        } else {
            this.statusValue = 'OFFLINE';
        }

    }

    fileChange(event: FileList) {
        this.errorMes = false;
        this.errorMes1 = false;
        this.fileUploadLength = event.length;
        if (event.length != 0) {
            this.errorMes = false;
        }
        else {
            this.errorMes = true;
        }
        this.reciprociUploadFile = event.item(0);
    }

    selectSegmentDialog() {

        this.SEGMENT_RULE_MEMBER_TYPE = true;
        this.customerSegmentsFormGroup.get('segmentType').setValue('SEGMENT_RULE');
        if (this.err == true) {
            this.err = false
        }
        const dialogRef = this.dialog.open(segmentRuleDialog, {
            data: {
                segmentAttrJson: this.segmentAttrJson,
            },
            panelClass: 'custom-segment-dialogbox'
        });

        dialogRef.afterClosed().subscribe(result => {
            this.segmentAttrJson = result.segmentAttrJson;
            this.userSegment = "";
            this.setSegmentAttribute();
            let request = {
                boolCampaign: false,
                segmentAttrJson: JSON.stringify(this.segmentAttrJson),
                action: 'CREATE'
            }
            this.removeSegmentBool = true;
            if (request.segmentAttrJson != undefined) {
                this.selectfinalQuery = true;
                this.removeSegmentBool = true;
                // setTimeout(() => {
                //     this.selectfinalQuery = false;
                // }, 3000);
            }
            else {
                this.selectfinalQuery = false;
                // this.removeSegmentBool = false;
            }
            let GET_COUNT = environment.APIEndpoint + "api/rpa/customer/segment/ca/v2/apply/rule"
            if (this.segmentAttrJson != "" && this.segmentAttrJson != null) {
                this.https.postJson(GET_COUNT, request)
                    .subscribe((response) => {
                        setTimeout(() => {
                            this.selectfinalQuery = false;
                        }, 1000);
                        this.removeSegmentBool = true;
                        this.disableSegmentOptions = true;
                        this.customerSelectedCountAbove = false;
                        this.segmentData = response;
                        this.customerSelectedCount = this.segmentData.customerCount;
                        if (this.customerSelectedCount < 500 && this.customerSelectedCount >= 0) {
                            this.getCustomerBtnEnbale = true;
                        }
                        else {
                            this.getCustomerBtnEnbale = false;
                            this.downloadQuery = false;
                        }
                        this.removeSegmentBool = true;
                        this.finalQuery = this.segmentData.finalQuery;
                        this.filePath = this.segmentData.filePath;
                        this.segmentAttrJson = JSON.parse(this.segmentData.segmentAttrJson);
                        this.skuNonMemRequiredError = false;
                        this.skuMemRequiredError = false;
                        this.skuRequiredError = false;
                    }
                        , err => {
                            this.disableSegmentOptions = false;
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
                                this.segmentErrorMes = err.error.errorDetails[i].description;
                                this.selectfinalQuery = false;
                            }

                            this.selectfinalQuery = false;
                            this.snackBar.openFromComponent(SnackBarComponent, {
                                duration: 3000,
                                data: {
                                    status: "failure",
                                    message: this.segmentErrorMes
                                }
                            });
                        })
                this.err = false;
            }
        });
    }

    removeSegment() {
        // this.removeSegmentBool = false;
        this.disableSegmentOptions = false;
        this.finalQuery = '';
        this.customerSelectedCount = 0;
        this.getCustomerBtnEnbale = false;
        this.segmentAttrJson = '';
    }

    getCustomerList() {
        this.disableData = true;
        this.downloadQuery = true;
        let request = {
            segmentQuery: this.finalQuery,
        }
        let GET_QUERY = environment.APIEndpoint + "api/rpa/customer/segment/ca/v1/segmentfile/apply/rule";
        this.https.postJson(GET_QUERY, request).subscribe(
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

    public setSegmentAttribute() {
        if (this.segmentAttrJson != "" && this.segmentAttrJson != null) {
            this.userSegment = this.userSegment + "(";
            for (let i = 0; i < this.segmentAttrJson['rules'].length; i++) {
                let rule = this.segmentAttrJson['rules'][i];
                this.createSegmentQuery(rule);
            }
            let lastIndex = this.userSegment.lastIndexOf(this.finalCondition);
            this.userSegment = this.userSegment.slice(0, lastIndex - 1);
            this.userSegment = this.userSegment + ")";
        }
    }

    public createSegmentQuery(rule: any) {
        if (rule.condition) {
            this.addEndBrace = true;
            this.userSegment = this.userSegment + "(";
            for (let i = 0; i < rule.rules.length; i++) {
                let r = rule.rules[i];
                this.createSegmentQuery(r);
            }
        } else {
            for (let i = 0; i < this.segementData.length; i++) {
                if (this.segementData[i].value == rule.id) {
                    let value = this.getElementValue(rule.value, rule.id);
                    this.userSegment = this.userSegment + " " + this.segementData[i].name + " " + rule.operator + " " + value + " " + this.segmentAttrJson['condition'];
                    this.finalCondition = this.segmentAttrJson['condition']
                }
            }
            if (this.addEndBrace) {
                this.userSegment = this.userSegment + ")";
            }
            this.addEndBrace = false;
        }
    }

    public getElementValue(values: any, segmentId: String) {
        let returnValue: String = "";
        if (segmentId == "ca__COUNTRY_OID" || segmentId == "mobileCountryCode" || segmentId == "ca__NATIONALITY_OID") {
            let arrayOf: any = values.toString().split(",");
            if (arrayOf.length > 0) {
                for (let i = 0; i < arrayOf.length; i++) {
                    JSON.parse(localStorage.countryData).forEach(function (item) {
                        if (item.countryId == arrayOf[i]) {
                            returnValue = returnValue + item.countryName + ",";
                        }
                    });

                }
            }
        } else if (segmentId == "ca__CITY_OID" || segmentId == "txn__city") {
            let arrayOf: any = values.toString().split(",");
            if (arrayOf.length > 0) {
                for (let i = 0; i < arrayOf.length; i++) {
                    JSON.parse(localStorage.cityData).forEach(function (item) {
                        if (item.cityId == arrayOf[i]) {
                            returnValue = returnValue + item.cityName + ",";
                        }
                    });

                }
            }
        } else if (segmentId == "ca__TIER_OID") {
            let arrayOf: any = values.toString().split(",");
            if (arrayOf.length > 0) {
                for (let i = 0; i < arrayOf.length; i++) {
                    JSON.parse(localStorage.tierData).forEach(function (item) {
                        if (item.tierId == arrayOf[i]) {
                            returnValue = returnValue + item.tierName + ",";
                        }
                    });

                }
            }
        } else if (segmentId == "txn__brand_transacted") {
            let arrayOf: any = values.toString().split(",");
            if (arrayOf.length > 0) {
                for (let i = 0; i < arrayOf.length; i++) {
                    JSON.parse(localStorage.brandData).forEach(function (item) {
                        if (item.brandId == arrayOf[i]) {
                            returnValue = returnValue + item.brandName + ",";
                        }
                    });

                }
            }
        } else if (segmentId == "txn__currency") {
            let arrayOf: any = values.toString().split(",");
            if (arrayOf.length > 0) {
                for (let i = 0; i < arrayOf.length; i++) {
                    JSON.parse(localStorage.currencyData).forEach(function (item) {
                        if (item.currencyId == arrayOf[i]) {
                            returnValue = returnValue + item.currencyCode + ",";
                        }
                    });

                }
            }
        } else if (segmentId == "cc__coupon") {
            let arrayOf: any = values.toString().split(",");
            if (arrayOf.length > 0) {
                for (let i = 0; i < arrayOf.length; i++) {
                    JSON.parse(localStorage.coupon).forEach(function (item) {
                        if (item.couponId == arrayOf[i]) {
                            returnValue = returnValue + item.couponTitle + ",";
                        }
                    });

                }
            }
        } else if (segmentId == "course") {
            let arrayOf: any = values.toString().split(",");
            if (arrayOf.length > 0) {
                for (let i = 0; i < arrayOf.length; i++) {
                    JSON.parse(localStorage.courseData).forEach(function (item) {
                        if (item.courseCode == arrayOf[i]) {
                            returnValue = returnValue + item.courseName + ",";
                        }
                    });

                }
            }
        } else if (segmentId == "outlet") {
            let arrayOf: any = values.toString().split(",");
            if (arrayOf.length > 0) {
                for (let i = 0; i < arrayOf.length; i++) {
                    JSON.parse(localStorage.storeData).forEach(function (item) {
                        if (item.outletId == arrayOf[i]) {
                            returnValue = returnValue + item.outletName + ",";
                        }
                    });

                }
            }
        } else if (segmentId == "merchant") {
            let arrayOf: any = values.toString().split(",");
            if (arrayOf.length > 0) {
                for (let i = 0; i < arrayOf.length; i++) {
                    JSON.parse(localStorage.mallData).forEach(function (item) {
                        if (item.merchantId == arrayOf[i]) {
                            returnValue = returnValue + item.merchantName + ",";
                        }
                    });

                }
            }
        } else if (segmentId == "settings") {
            let arrayOf: any = values.toString().split(",");
            if (arrayOf.length > 0) {
                for (let i = 0; i < arrayOf.length; i++) {
                    JSON.parse(localStorage.settingData).forEach(function (item) {
                        if (item.settingId == arrayOf[i]) {
                            returnValue = returnValue + item.settingName + ",";
                        }
                    });

                }
            }
        } else if (segmentId == "cp__customerType_sub_master") {
            let arrayOf: any = values.toString().split(",");
            if (arrayOf.length > 0) {
                for (let i = 0; i < arrayOf.length; i++) {
                    JSON.parse(localStorage.customerSubType).forEach(function (item) {
                        if (item.code == arrayOf[i]) {
                            returnValue = returnValue + item.title + ",";
                        }
                    });

                }
            }
        } else if (segmentId == "cp__customerType_master") {
            let arrayOf: any = values.toString().split(",");
            if (arrayOf.length > 0) {
                for (let i = 0; i < arrayOf.length; i++) {
                    JSON.parse(localStorage.customerType).forEach(function (item) {
                        if (item.code == arrayOf[i]) {
                            returnValue = returnValue + item.title + ",";
                        }
                    });

                }
            }
        }
        if (returnValue != "") {
            return returnValue.slice(0, returnValue.length - 1);
        } else {
            return values
        }

    }


    segmentTypeChange(ev) {
        if (ev.value == "SEGMENT_MEMBER_AND_NON_MEMBER") {
            this.skuMemRequiredError = false;
            this.skuRequiredError = false;
        }
        else if (ev.value == "SEGMENT_MEMBER") {
            this.skuRequiredError = false;
            this.skuNonMemRequiredError = false;
        }
        else if (ev.value == "SEGMENT_NON_MEMBER") {
            this.skuNonMemRequiredError = false;
            this.skuMemRequiredError = false;
        }
    }


    uploadFileSku(event: FileList) {

        //pick from one of the 4 styles of file uploads below
        this.uploadAndProgress(event, "skuFile");
    }

    uploadMemFileSku(event: FileList) {
        this.SEGMENT_MEMBER_TYPE = true;
        //pick from one of the 4 styles of file uploads below
        this.uploadMemAndProgress(event, "skuFile");
    }

    uploadNonMemFileSku(event: FileList) {
        //pick from one of the 4 styles of file uploads below
        this.uploadNonMemAndProgress(event, "skuFile");
    }


    uploadAndProgress(files: FileList, fileType: String) {
        this.SEGMENT_NON_MEMBER_TYPE = true;
        this.customerSegmentsFormGroup.get('segmentType').setValue('SEGMENT_NON_MEMBER');
        this.fileTypeErr = false;
        //    var formData = new FormData();
        //    Array.from(files).forEach(f => formData.append('file',f))

        this.uploadFile.uploadsegmentmember(files.item(0), 'segmentnonmember', 'files')
            .subscribe((response) => {
                this.skuFileName = files.item(0).name;
                this.skuFilePath = response['message'];
                this.skuRequiredError = false
                this.disableSegmentOptions = true;
                this.skuNonMemRequiredError = false;
                this.skuMemRequiredError = false;
                this.skuRequired = false;
                this.validSkuFile = false;
                this.skuErrorFile = '';
                this.skuErrorFileName = '';
                this.uploadSkuRef.nativeElement.value = '';
                this.snackBar.openFromComponent(SnackBarComponent, {
                    duration: 1500,
                    data: {
                        status: "success",
                        message: " file successfully uploaded"
                    }
                });
            }, err => {
                this.disableSegmentOptions = false;

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

    uploadMemAndProgress(files: FileList, fileType: String) {
        this.SEGMENT_MEMBER_TYPE = true;
        this.customerSegmentsFormGroup.get('segmentType').setValue('SEGMENT_MEMBER');

        this.fileTypeMemErr = false;
        this.uploadFile.uploadsegmentmember(files.item(0), 'segmentmember', 'files')
            .subscribe((response) => {
                this.skuMemFileName = files.item(0).name;
                this.skuMemFilePath = response['message'];
                this.disableSegmentOptions = true;
                this.skuMemRequiredError = false;
                this.skuRequiredError = false;
                this.skuNonMemRequiredError = false;
                this.skuMemRequired = false;
                this.validMemSkuFile = false;
                this.skuMemErrorFile = '';
                this.skuMemErrorFileName = '';
                this.uploadMemSkuRef.nativeElement.value = '';
                this.snackBar.openFromComponent(SnackBarComponent, {
                    duration: 1500,
                    data: {
                        status: "success",
                        message: " file successfully uploaded"
                    }
                });
            }, err => {
                this.disableSegmentOptions = false;
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
            );
    }

    uploadNonMemAndProgress(files: FileList, fileType: String) {
        this.SEGMENT_MEMBER_AND_NON_MEMBER_TYPE = true;
        this.customerSegmentsFormGroup.get('segmentType').setValue('SEGMENT_MEMBER_AND_NON_MEMBER');
        this.fileTypeNonMemErr = false;
        this.uploadFile.uploadsegmentmember(files.item(0), 'segment', 'files')
            .subscribe((response) => {

                // else {
                this.skuNonMemFileName = files.item(0).name;
                this.skuNonMemFilePath = response['message'];
                this.disableSegmentOptions = true;

                this.skuMemRequiredError = false;
                this.skuRequiredError = false;

                this.skuNonMemRequiredError = false;
                this.skuNonMemRequired = false;
                this.validNonMemSkuFile = false;
                this.skuNonMemErrorFile = '';
                this.skuNonMemErrorFileName = '';
                this.uploadNonMemSkuRef.nativeElement.value = '';
                // }

                this.snackBar.openFromComponent(SnackBarComponent, {
                    duration: 1500,
                    data: {
                        status: "success",
                        message: " file successfully uploaded"
                    }
                });
            }, err => {
                this.disableSegmentOptions = false;

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
        this.disableSegmentOptions = false;
    }

    public skuMemUpload(value: any) {
        this.skuMemFilePath = '';
        this.submitMemForm = true
        this.skuMemErrorFile = '';
        this.skuMemErrorFileName = '';
        this.validMemSkuFile = true;
        this.validMemCouponRequired = false;
        this.skuMemFileName = '';
        this.validateMemSkuFile = false;
        this.skuMemRequired = false;
        this.customersMemSelected = '';
        this.emailCustomersMemSelected = '';
        this.uploadMemSkuRef.nativeElement.value = null;
        this.disableSegmentOptions = false;
    }

    public skuNonMemUpload(value: any) {
        this.skuNonMemFilePath = '';
        this.submitNonMemForm = true
        this.skuNonMemErrorFile = '';
        this.skuNonMemErrorFileName = '';
        this.validNonMemSkuFile = true;
        this.validNonMemCouponRequired = false;
        this.skuNonMemFileName = '';
        this.validateNonMemSkuFile = false;
        this.skuNonMemRequired = false;
        this.customersNonMemSelected = '';
        this.emailCustomersNonMemSelected = '';
        this.uploadNonMemSkuRef.nativeElement.value = null;
        this.disableSegmentOptions = false;
    }


    validateSKUs() {
        if (null != this.skuFilePath && this.skuFilePath != '') {
            this.validateSkuFile = false;
            this.skuRequiredError = false;
            let request = {
                // activityId: this.activityId,
                filePath: this.skuFilePath,
                segmentType: 'SEGMENT_NON_MEMBER'
            }
            let VALIDATE_SKUS = environment.APIEndpoint + "api/rpa/customer/segment/v1/validate";
            this.https.postJson(VALIDATE_SKUS, request)
                .subscribe((response) => {
                    this.nonmemberData = response;
                    this.segmentFileOid = this.nonmemberData.fileUploadOid;
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

    validateMemSKUs() {
        if (null != this.skuMemFilePath && this.skuMemFilePath != '') {
            this.validateMemSkuFile = false;
            this.skuMemRequiredError = false;
            let request = {
                // activityId: this.activityId,
                filePath: this.skuMemFilePath,
                segmentType: 'SEGMENT_MEMBER'
            }
            let VALIDATE_SKUS = environment.APIEndpoint + "api/rpa/customer/segment/v1/validate";
            this.https.postJson(VALIDATE_SKUS, request)
                .subscribe((response) => {
                    this.memberData = response;
                    this.segmentFileOid = this.memberData.fileUploadOid;
                    this.customersMemSelected = this.nonmemberData.customerCount;
                    this.emailCustomersMemSelected = this.nonmemberData.emailCustomerCount;

                    //  smsCustomerCount
                    this.validMemSkuFile = true;
                    this.submitMemForm = true;
                    this.snackBar.openFromComponent(SnackBarComponent, {
                        duration: 10000,
                        data: {
                            status: "success",
                            message: "File validated successfully"
                        }
                    });
                    this.skuMemRequiredError = false
                }, err => {
                    for (let i = 0; i < err.error.errorDetails.length; i++) {
                        this.errorMesCampaign = err.error.errorDetails[i].description
                    }
                    this.validMemSkuFile = false;
                    let fileMemErr = undefined;
                    fileMemErr = this.skuMemFilePath != '' ? this.skuMemFilePath.includes('.csv') || this.skuMemFilePath.includes('.CSV') : undefined;
                    if (this.skuMemFilePath != '' && fileMemErr != undefined) {
                        this.snackBar.openFromComponent(SnackBarComponent, {
                            duration: 10000,
                            data: {
                                status: "failure",
                                message: this.errorMesCampaign
                            }
                        });
                        this.fileTypeMemErr = true;
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
                        this.skuMemErrorFile = this.errorFilePathUrl + '/' + err.error.errorDetails[0].errorFilePath;
                        this.skuMemErrorFileName = this.skuErrorFile.split("/").pop();
                    }
                })
        }
    }

    validateNonMemSKUs() {
        if (null != this.skuNonMemFilePath && this.skuNonMemFilePath != '') {
            this.validateNonMemSkuFile = false;
            this.skuNonMemRequiredError = false;
            let request = {
                // activityId: this.activityId,
                filePath: this.skuNonMemFilePath,
                segmentType: 'SEGMENT_MEMBER_AND_NON_MEMBER'
            }
            let VALIDATE_SKUS = environment.APIEndpoint + "api/rpa/customer/segment/v1/validate";
            this.https.postJson(VALIDATE_SKUS, request)
                .subscribe((response) => {
                    this.memberNonData = response;
                    this.segmentFileOid = this.memberNonData.fileUploadOid;
                    this.customersNonMemSelected = this.memberNonData.customerCount;
                    this.emailCustomersMemSelected = this.memberNonData.emailCustomerCount;


                    //  smsCustomerCount
                    this.validNonMemSkuFile = true;
                    this.submitNonMemForm = true;
                    this.snackBar.openFromComponent(SnackBarComponent, {
                        duration: 10000,
                        data: {
                            status: "success",
                            message: "File validated successfully"
                        }
                    });
                    this.skuNonMemRequiredError = false
                }, err => {
                    for (let i = 0; i < err.error.errorDetails.length; i++) {
                        this.errorMesCampaign = err.error.errorDetails[i].description
                    }
                    this.validNonMemSkuFile = false;
                    let fileNonMemErr = undefined;
                    fileNonMemErr = this.skuNonMemFilePath != '' ? this.skuNonMemFilePath.includes('.csv') || this.skuNonMemFilePath.includes('.CSV') : undefined;
                    if (this.skuNonMemFilePath != '' && fileNonMemErr != undefined) {
                        this.snackBar.openFromComponent(SnackBarComponent, {
                            duration: 10000,
                            data: {
                                status: "failure",
                                message: this.errorMesCampaign
                            }
                        });
                        this.fileTypeNonMemErr = true;
                    }
                    else {
                        this.skuNonMemFileName = '';
                        this.snackBar.openFromComponent(SnackBarComponent, {
                            duration: 10000,
                            data: {
                                status: "failure",
                                message: err.error.errorDetails[0].description
                            }
                        });
                    }
                    if (err.error.errorDetails[0].errorFilePath != undefined) {
                        this.skuNonMemErrorFile = this.errorFilePathUrl + '/' + err.error.errorDetails[0].errorFilePath;
                        this.skuNonMemErrorFileName = this.skuErrorFile.split("/").pop();
                    }
                });
        }
    }


    public createCustomerSegments() {
        if (this.customerSegmentsFormGroup.valid) {

            if (this.customerSegmentsFormGroup.controls['segmentType'].value == 'SEGMENT_RULE') {
                if (this.segmentData.finalQuery == undefined || this.segmentData.finalQuery == '') {
                    this.err = true;
                }
            }

            if (this.customerSegmentsFormGroup.controls['segmentType'].value == 'SEGMENT_MEMBER') {

                this.filePath = this.skuMemFilePath;

                if (!this.validMemSkuFile) {
                    this.validateMemSkuFile = true;
                    this.skuMemValidated = true;
                    return;
                }
                if (this.skuMemRequired == true || this.skuMemFileName == '') {
                    this.skuMemRequiredError = true;
                    return;
                } else {
                    this.skuMemRequiredError = false;
                }

            }
            if (this.customerSegmentsFormGroup.controls['segmentType'].value == 'SEGMENT_NON_MEMBER') {
                if (!this.validSkuFile) {
                    this.validateSkuFile = true;
                    this.skuValidated = true;
                    return;
                }
                if (this.skuRequired == true || this.skuFileName == '') {
                    this.skuRequiredError = true;
                    return;
                }
                 else {
                    this.skuRequiredError = false;
                }
                this.filePath = this.skuFilePath;
            }
            if (this.customerSegmentsFormGroup.controls['segmentType'].value == 'SEGMENT_MEMBER_AND_NON_MEMBER') {
                this.filePath = this.skuNonMemFilePath;

                if (!this.validNonMemSkuFile) {
                    this.validateNonMemSkuFile = true;
                    this.skuNonMemValidated = true;
                    return;
                }
                if (this.skuNonMemRequired == true || this.skuNonMemFileName == '') {
                    this.skuNonMemRequiredError = true;
                    return;
                } else {
                    this.skuNonMemRequiredError = false;
                }

            }

            let segment_empty = "";

            let request = {
                segmentName: this.customerSegmentsFormGroup.get("segmentName").value,
                segmentDescription: this.customerSegmentsFormGroup.get("description").value,
                customerSelctedCount: this.customerSelectedCount != undefined ? this.customerSelectedCount : '',
                segmentQuery: this.finalQuery != undefined ? this.finalQuery : '',
                segmentAttrJson: JSON.stringify(this.segmentAttrJson) != undefined ? JSON.stringify(this.segmentAttrJson) : segment_empty,
                status: this.toggleVal == true ? 'ONLINE' : 'OFFLINE',
                filePath: this.filePath,
                segmentType: this.customerSegmentsFormGroup.controls['segmentType'].value,
                segmentFileUploadId: this.segmentFileOid,
                action: 'CREATE'
            }
            this.loadingResponse = true;
            let CREATE_CUSTOMER_SEGMENT = environment.APIEndpoint + "api/rpa/customer/segment/v1/save";
            this.https.postJson(CREATE_CUSTOMER_SEGMENT, request)
                .subscribe((response) => {
                    this.loadingResponse = false;
                    this.snackBar.openFromComponent(SnackBarComponent, {
                        duration: 1500,
                        data: {
                            status: "success",
                            message: "Customer Segment has been added successfully"
                        }
                    });
                    this.loading = false;
                    sessionStorage.clear();
                    this.router.navigate(['/search-customer-segments']);
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
                    });
        }
        // }

    }
}
