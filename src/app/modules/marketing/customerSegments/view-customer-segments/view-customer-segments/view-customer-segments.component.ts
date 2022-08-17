import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpService } from 'src/app/services/http-service';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { SnackBarComponent } from 'src/app/shared/components/snack-bar/snack-bar.component';
import { MatSnackBar } from '@angular/material';


@Component({
    selector: 'view-customer-segments',
    templateUrl: './view-customer-segments.component.html',
    styleUrls: ['./view-customer-segments.component.scss']
})
export class ViewCustomerSegmentsComponent implements OnInit {
    public href;
    public segmentId;
    public toggleVal;
    public disabled: boolean = true;
    public checked: boolean = true;
    public statusValue: string = 'OFFLINE';
    public viewTemplateData;
    public fileUrl = localStorage.getItem("fileBaseUrl");

    public fileSegmentUrl = localStorage.getItem("fileBaseUrl");
    public breadCrumbData: Array<Object> = [{
        title: 'Marketing',
        link: ''
    }, {
        title: 'Customer Segments',
        link: 'search-customer-segments'
    }
    ];

    public userSegment = "";
    public addEndBrace = false;
    public finalCondition: string = "AND";
    loadingResponse: boolean = false;

    public viewcusSegmentData: boolean = false;
    public disableData: boolean = false;
    public downloadQuery: boolean = false;
    public selectfinalQuery: boolean = false;
    public segmentSuccessPath;


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
    public customerSelectedCount: number;
    public getCustomerBtnEnbale: boolean = false;
    public segmentAttrJson: any;
    public finalQuery: string;

    public customerSegmentFileapply: any = [];
    public customerfilePath: boolean = false;
    public filePathCustomer: string;
    public customerSelectedCountAbove: boolean = false;

    public viewErrorFilePath;


    constructor(
        private router: Router,
        private https: HttpService,
        private sanitizer: DomSanitizer,
        public snackBar: MatSnackBar,
    ) { }

    ngOnInit() {
        let data = localStorage.getItem('CustomerSegmentViewID');
        if (data) {
            this.href = data;
            this.getViewData();
            localStorage.removeItem('CustomerSegmentViewID')
        } else {
            sessionStorage.clear();
            this.router.navigate(['/search-customer-segments']);
        }
    }

    getViewData() {
        let data = {
            "segmentId": this.href
        }
        this.viewcusSegmentData = true;
        this.https.postJson(environment.APIEndpoint + 'api/rpa/customer/segment/v1/view', data).subscribe(res => {
            this.viewcusSegmentData = false;
            this.viewTemplateData = res;
            this.viewErrorFilePath = res['errorFilePath'];
            this.toggleVal = res["status"] == "ONLINE" ? true : false;
            this.checked = res["status"] == 'ONLINE' ? true : false
            this.statusValue = res["status"] == "ONLINE" ? 'ONLINE' : 'OFFLINE';
            this.segmentId = res['segmentId'];
            this.fileUrl = this.fileUrl + res['filePath'];
            this.finalQuery = this.viewTemplateData.segmentQuery;
            this.segmentSuccessPath = res['successFilePath'];
            this.customerSelectedCount = this.viewTemplateData.customerSelctedCount;
            if (this.customerSelectedCount < 500 && this.customerSelectedCount >= 0) {
                this.getCustomerBtnEnbale = true;
            }
            else {
                this.getCustomerBtnEnbale = false;
                this.downloadQuery = false;
            }
            this.segmentAttrJson = JSON.parse(res['segmentAttrJson']);
            this.setSegmentAttribute();
        }, err => {
            this.viewcusSegmentData = false;
        });
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

    downloadSegmentFile() {
        var url = this.segmentSuccessPath;
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
            this.userSegment = this.userSegment + "(";
            for (let i = 0; i < rule.rules.length; i++) {
                let r = rule.rules[i];
                this.createSegmentQuery(r);
            }
            this.userSegment = this.userSegment + ")";
        } else {
            for (let i = 0; i < this.segementData.length; i++) {
                if (this.segementData[i].value == rule.id) {
                    let value = this.getElementValue(rule.value, rule.id);
                    this.userSegment = this.userSegment + " " + this.segementData[i].name + " " + rule.operator + " " + value + " " + this.segmentAttrJson['condition'];
                    this.finalCondition = this.segmentAttrJson['condition'];
                }
            }
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
        }
        if (returnValue != "") {
            return returnValue.slice(0, returnValue.length - 1);
        } else {
            return values
        }

    }
    MoveToEdit(ID, type) {
        let data = ID + '-' + type;
        localStorage.setItem('CustomerSegmentEditID', data);
        this.router.navigate(['/edit-customer-segments'])
    }
    toggleStatus(event) {
        if (event.checked == true) {
            this.statusValue = 'ONLINE';
        } else {
            this.statusValue = 'OFFLINE';
        }
        let GET_SEGMENT_STATUS_CHANGE = environment.APIEndpoint + "api/rpa/customer/segment/v1/update/segment/status";
        let request = {
            segmentId: this.segmentId,
            status: this.statusValue
        }
        this.https.postJson(GET_SEGMENT_STATUS_CHANGE, request).subscribe(
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
         });
    }
}
