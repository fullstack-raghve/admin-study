import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef, Renderer2 } from '@angular/core';
import { Validators, FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { HttpService } from 'src/app/services/http-service';
import { environment } from 'src/environments/environment';
import { MatSnackBar } from '@angular/material';
import { SnackBarComponent } from 'src/app/shared/components/snack-bar/snack-bar.component';
import { formatDate } from '@angular/common';
import { Router } from '@angular/router';
import { MatTabChangeEvent } from '@angular/material';
import { Globals } from 'src/app/services/global';
import { log } from 'util';
import { concat } from 'rxjs';


@Component({
    selector: 'view-enquiries',
    templateUrl: './view-enquiries.component.html',
    styleUrls: ['./view-enquiries.component.scss']
})
export class ViewEnquiriesComponent implements OnInit {
    public breadCrumbData: Array<Object> = [{
        title: 'Member Management',
        link: ''
    }, {
        title: 'Enquiries',
        link: ''
    }
    ];
    public loadingResponse: boolean = false;
    public loadingCusResponse: boolean = false;
    @ViewChild("viewEnquiryForm") viewEnquiryForm;
    @ViewChild("enquiryResponseForm") enquiryResponseForm;
    @ViewChild("enquiryResponsePostForm") enquiryResponsePostForm;
    public enquiryId;
    public enquiryData: any;
    public responseData: any;
    public tabValue;
    public preferredLanguageVal;
    public enquiryTypeList = [];
    public languages = [];
    public preferedLanguages = [];
    public alignCss = [];
    public alignCssAr = [];
    public alignCssResponse = [];
    public seletedTabIndex = 0;
    @ViewChild('tabGroup') tabGroup;
    matVal: boolean = false;
    public triggeredValue = [];
    public custArr = [];
    public postAsOptions: any = [];
    public tabName;
    postAsOptionsVals = [
        {
            value: 'SMS',
            label: 'SMS',
            checked: false
        },
        {
            value: 'EMAIL',
            label: 'Email',
            checked: false
        },
        // {
        //     value: 'PUSH',
        //     label: 'App-Push Notification',
        //     checked: false
        // },
    ];
    languageVals = [
        {
            value: 'EN',
            label: 'English',
            checked: true
        },

         {
            value: 'AR',
              label: 'Arabic',
            checked: false
         },
    ];
    languageValposts = [
        {
            value: 'EN',
            label: 'English',
            checked: true
        },
        {
              value: 'AR',
             label: 'Arabic',
             checked: false
          },
    ];
    public showError = false;
    public responseRequired = false;

    public responseCustomerRequired = false;
    public responseInternalRequired = false;

    public previusUrl = localStorage.getItem('previousUrl');
    viewEnquiryFormGroup: FormGroup;
    createEnquiryResponse: FormGroup;
    selectedValue;
    condition: boolean = false;
    languageIdVal: boolean = false;
    public languageIdNumbericVal: number;
    public languageIdNumbericValpost: number;
    createEnquiryResponsePostOptions: FormGroup;
    public memberID: any;
    public viewMemberID: any;
    previousSearchData;
    countryId: string;
    cityId: string;
    languageDirectionResponse = [];
    languageDirection = [];

    constructor(private elRef: ElementRef, private renderer: Renderer2, private activatedRoute: ActivatedRoute,
        private http: HttpService, public snackBar: MatSnackBar, private fb: FormBuilder, private router: Router) {

        // this.activatedRoute.params.subscribe(
        //     (param) => {
        //         this.enquiryId = param.id;
        //     }
        // );
    }

    ngOnInit() {
        let data = localStorage.getItem('EnquiryRefID');
        let previousSearchData = localStorage.getItem('searchData');
        let countryId = localStorage.getItem('countryId');
        let cityId = localStorage.getItem('cityId');
        let viewMemId = localStorage.getItem('memberCustomerId');

        // let viewMemId = localStorage.getItem('viewMemberID');
        

        console.log(previousSearchData);
        this.previousSearchData = previousSearchData;
        this.countryId = countryId;
        this.cityId = cityId;
        this.viewMemberID = viewMemId;
        console.log(this.viewMemberID);
        
        this.tabName = localStorage.getItem('TabName');
        if (data) {
            this.enquiryId = data;
            // console.log(previousSearchData);
            this.getViewEnquiry();
            this.buildEnquiryResponseForm();
            this.buildEnquiryResponsePostForm();
            console.log(this.preferredLanguageVal);
            localStorage.removeItem('EnquiryRefID');
            localStorage.removeItem('memberCustomerId');
        } else {
            sessionStorage.clear();
            this.router.navigate(['/search-enquiries'])
        }

    }
    public tabChanged(tabChangeEvent: MatTabChangeEvent): void {
        this.changeValidation('EN');
        this.changeValidationPost('EN')

        console.log(tabChangeEvent.index);
        if (tabChangeEvent.index == 1) {
            // this.responseRequired = false;
            this.tabValue = "USER";
            const control = this.createEnquiryResponsePostOptions.get('enquiryResponses') as FormArray
            for (let i = 0; i < this.languages.length; i++) {
                console.log(this.languages);
                this.changeValidation('EN');
                

                // console.log(this.preferredLanguageVal);
                // if (this.languages[i].languageCode != this.preferredLanguageVal) {
                //     control.at(i).get('representativeResponse').disable();
                //     control.at(i).get('representativeResponse').setValue('');
                //     control.at(i).get('representativeResponse').updateValueAndValidity();
                // } else {
                //     control.at(i).get('representativeResponse').enable();
                // }
            }
        } else if (tabChangeEvent.index == 0) {
            // this.responseRequired = false;
            this.tabValue = "INTERNAL";
            this.changeValidation('EN');
            

        }

        this.getResponse();
    }
    changeValidation(ev) {
        console.log(ev);
        const control = this.createEnquiryResponse.get('enquiryResponses') as FormArray
        for (let i = 0; i < this.languages.length; i++) {
            if (this.languages[i].languageCode != ev) {
                this.alignCssAr.push(this.languages[i].languageCode == ev ? 'd-none-eng' : 'display-arabic');
                control.at(i).disable();
                control.at(i).get('representativeResponse').disable();
                control.at(i).get('representativeResponse').setValue('');
                control.at(i).get('representativeResponse').updateValueAndValidity();
            } else {
                this.alignCssAr.push(this.languages[i].languageCode == ev ? 'd-none-eng' : 'display-arabic');
                control.at(i).get('representativeResponse').enable();
            }
        }
    }
    changeValidationPost(ev) {
        console.log(ev);
        const control = this.createEnquiryResponsePostOptions.get('enquiryResponses') as FormArray
        for (let i = 0; i < this.languages.length; i++) {
            if (this.languages[i].languageCode != ev) {
                this.alignCssAr.push(this.languages[i].languageCode == ev ? 'd-none-eng' : 'display-arabic');
                control.at(i).disable();
                control.at(i).get('representativeResponse').disable();
                control.at(i).get('representativeResponse').setValue('');
                control.at(i).get('representativeResponse').updateValueAndValidity();
       } else {
                 this.alignCssAr.push(this.languages[i].languageCode == ev ? 'd-none-eng' : 'display-arabic');
                control.at(i).get('representativeResponse').enable();
            }
        }
    }
    isSelectedItem(i) {
        console.log(i);
        this.selectedValue = i;
        if (this.selectedValue == 0) {
            this.condition = true;
            console.log("english");
        } else if (this.selectedValue == 1) {
            console.log("Arbic");
            this.condition = false;
        }
    }
    isSelectedItemPost(i) {
        console.log(i);
        this.selectedValue = i;
        if (this.selectedValue == 0) {
            this.condition = true;
            console.log("english");
        } else if (this.selectedValue == 1) {
            console.log("Arbic");
            this.condition = false;
        }
    }
    public getViewEnquiry() {
        let GET_ENQUIRY_BY_ID = environment.APIEndpoint + "api/rpa/enquiry/v1/view";
        let request = {
            enquiryId: this.enquiryId
        }
        this.http.postJson(GET_ENQUIRY_BY_ID, request)
            .subscribe(
                (response) => {
                    this.enquiryData = response;
                    this.getEnquiryType(this.enquiryData);
                    this.getResponse();
                    this.buildEnquiryFormGroup(this.enquiryData);
                    this.getLanguageList();
                    // this.preferredLanguageVal = response['preferredLanguage'];
                    console.log(this.preferredLanguageVal);
                }, err => {
                    if (err.error.error == "access_denied") {
                        this.snackBar.openFromComponent(SnackBarComponent, {
                            duration: 1500,
                            data: {
                                status: "failure",
                                message: err.error.error_description
                            }
                        });
                    } else {
                        this.snackBar.openFromComponent(SnackBarComponent, {
                            duration: 1500,
                            data: {
                                status: "failure",
                                message: "Unable to fetch data at current movement. Please try again later"
                            }
                        });
                    }
                })
    }

    public getViewEnquiryViewUpdate() {
        let GET_ENQUIRY_BY_ID = environment.APIEndpoint + "api/rpa/enquiry/v1/view";
        let request = {
            enquiryId: this.enquiryId
        }
        this.http.postJson(GET_ENQUIRY_BY_ID, request)
            .subscribe(
                (response) => {
                    this.enquiryData = response;
                    console.log(this.preferredLanguageVal);
                }, err => {
                    if (err.error.error == "access_denied") {
                        this.snackBar.openFromComponent(SnackBarComponent, {
                            duration: 1500,
                            data: {
                                status: "failure",
                                message: err.error.error_description
                            }
                        });
                    } else {
                        this.snackBar.openFromComponent(SnackBarComponent, {
                            duration: 1500,
                            data: {
                                status: "failure",
                                message: "Unable to fetch data at current movement. Please try again later"
                            }
                        });
                    }
                })
    }

    public buildEnquiryFormGroup(enquiryData: any) {
        this.viewEnquiryFormGroup = this.fb.group({
            enquiryStatus: [enquiryData.enquiryStatus, Validators.compose([Validators.required])],
            internalEnquiryId: [enquiryData.internalEnquiryId.toString(), Validators.compose([Validators.required])]
        });

    }

    public updateEnquiry(formData) {
        if (this.viewEnquiryFormGroup.invalid == true) {
            this.showError = true;
        } else {
            let request = {
                enquiryId: this.enquiryId,
                enquiryStatus: formData.enquiryStatus,
                internalEnquiryId: formData.internalEnquiryId,
            }
            let UPDATE_ENQUIRY = environment.APIEndpoint + "api/rpa/enquiry/v1/update";
            this.http.postJson(UPDATE_ENQUIRY, request)
                .subscribe((response) => {
                    //  this.getViewEnquiry();
                    this.snackBar.openFromComponent(SnackBarComponent, {
                        duration: 10000,
                        data: {
                            status: "success",
                            message: "Enquiry updated successfully"
                        }
                    });
                    this.getViewEnquiryViewUpdate();
                }

                    , err => {
                        if (err.error.errorType == 'VALIDATION') {
                            this.snackBar.openFromComponent(SnackBarComponent, {
                                duration: 10000,
                                data: {
                                    status: "failure",
                                    message: err.error.errorDetails[0].description
                                }
                            });
                        } else if (err.error.error == "access_denied") {
                            this.snackBar.openFromComponent(SnackBarComponent, {
                                duration: 1500,
                                data: {
                                    status: "failure",
                                    message: err.error.error_description
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
                    });
        }
    }


    public buildEnquiryResponseForm() {
        this.createEnquiryResponse = this.fb.group({
            enquiryResponses: this.fb.array([]),
            languageOptions: ['English', Validators.required],
        });
    }

    public buildEnquiryResponsePostForm() {
        this.createEnquiryResponsePostOptions = this.fb.group({
            enquiryResponses: this.fb.array([]),
            languageOptionsPost: ['English', Validators.required],
            postAsOptions: ['', Validators.required],
        });
    }

    getLangVal() {
        console.log(this.createEnquiryResponse.get('languageOptions').value);
        console.log(this.languages);
    }
    public getLanguageList() {
        let GET_ALL_LANGUAGES = environment.APIEndpoint + "api/rpa/master/language/v1/list";
        this.http.getJson(GET_ALL_LANGUAGES)
            .subscribe((response) => {
                this.languages = response;
                console.log(this.languages);

                // for(let i=0;i<this.languages.length;i++){

                //     if(this.languages[i].languageCode == this.enquiryData.preferredLanguage || null == this.enquiryData.preferredLanguage){
                //         this.preferedLanguages.push(this.languages[i]);
                //     }
                // }
                // this.languages = this.preferedLanguages;
                this.addEnquiryResponses();
                this.addEnquiryPostResponses();
                this.getLangVal();
                this.changeValidation('EN');
                this.changeValidationPost('EN');
            })
    }

    public addEnquiryResponses() {
        for (let i = 0; i < this.languages.length; i++) {
            const control = <FormArray>this.createEnquiryResponse.controls['enquiryResponses'];
            let newForm = this.fb.group({
                representativeResponse: ["", Validators.compose([Validators.maxLength(500)])],
            });
            control.push(newForm);
            this.alignCss.push(this.languages[i].direction == 'RTL' ? 'text-right' : '');
            this.languageDirection.push(this.languages[i].direction == 'RTL' ? 'direction' : '');
        }
    }

    public addEnquiryPostResponses() {
        for (let i = 0; i < this.languages.length; i++) {
            const control = <FormArray>this.createEnquiryResponsePostOptions.controls['enquiryResponses'];
            let newForm = this.fb.group({
                representativeResponse: ["", Validators.compose([Validators.maxLength(500)])],
            });
            control.push(newForm);
            this.alignCss.push(this.languages[i].direction == 'RTL' ? 'text-right' : '');
            this.languageDirection.push(this.languages[i].direction == 'RTL' ? 'direction' : '');
        }
    }

    public getResponse() {
        let GET_RESPONSE_BY_ID = environment.APIEndpoint + "api/rpa/enquiry/v1/view/response";
        let request = {
            enquiryId: this.enquiryId,


        }
        this.http.postJson(GET_RESPONSE_BY_ID, request)
            .subscribe(
                (response) => {
                    this.responseData = response["enquiryResponses"];
                    if (this.responseData != null && this.responseData.length != 0) {
                        for (var i = 0; i < this.responseData.length; i++) {
                            console.log(this.responseData[i]);
                            console.log(this.responseData[i].postTo);
                            for (var j = 0; j < this.responseData[i].enquiryResponseLocales.length; j++) {
                                console.log(this.responseData[i].enquiryResponseLocales[j].langauageCode);
                                this.alignCssResponse.push(this.languages[j].direction == 'RTL' ? 'text-right' : '');
                                this.languageDirectionResponse.push(this.languages[j].direction == 'RTL' ? 'direction' : '');
                                console.log(this.responseData[i].enquiryResponseLocales[j].response);
                                // if (null != this.responseData[i].enquiryResponseLocales[j].response)
                                //     // this.responseData[i].enquiryResponseLocales[j].response = this.responseData[i].enquiryResponseLocales[j].response.replace(/(\\r\\n)|([\r\n])/gmi, '<br/>');
                                //     this.responseData[i].enquiryResponseLocales[j].response = this.responseData[i].enquiryResponseLocales[j].response.replace(/(\\r\\n)|([\r\n])/gmi, '<br/>');
                            }
                        }
                    }
                }, err => {
                    if (err.error.error == "access_denied") {
                        this.snackBar.openFromComponent(SnackBarComponent, {
                            duration: 1500,
                            data: {
                                status: "failure",
                                message: err.error.error_description
                            }
                        });
                    } else {
                        this.snackBar.openFromComponent(SnackBarComponent, {
                            duration: 1500,
                            data: {
                                status: "failure",
                                message: "Unable to fetch representative response at current movement. Please try again later"
                            }
                        });
                    }

                })
    }

    public getEnquiryType(enquiryData: any) {
        let GET_ENQUIRY_TYPE = environment.APIEndpoint + "api/rpa/master/enquiry/type/v1/get/list";
        this.http.getJson(GET_ENQUIRY_TYPE)
            .subscribe(
                (response) => {
                    this.enquiryTypeList = response;
                    this.enquiryTypeList.sort((a, b) => a.enquiryTitle.localeCompare(b.enquiryTitle));
                }, (err) => {
                    this.snackBar.openFromComponent(SnackBarComponent, {
                        duration: 1500,
                        data: {
                            status: "failure",
                            message: "Unable to fetch internal enquiry type at current movement. Please try again later"
                        }
                    });
                })
    }

    // removeInternalValidation() {
    //     this.responseInternalRequired = false;
    // }

    // public removeCustomerValidation() {
    //     this.responseCustomerRequired = false;
    // }
    public removeValidation() {
        this.responseInternalRequired = false;
        this.responseCustomerRequired = false;
    }
    public createResponse(formData) {
        console.log(formData);
        if (this.createEnquiryResponse.invalid == true) {
            this.showError = true;
            this.loadingResponse = false;
        } else {

            let responseList = [];
            for (var i = 0; i < formData.enquiryResponses.length; i++) {
                console.log(formData.languageOptions);
                console.log(this.languages[i].languageCode);
                if (formData.languageOptions == "English" || formData.languageOptions == "EN") {
                    this.languageIdNumbericVal = 1;
                }
                if (formData.languageOptions == "AR") {
                    this.languageIdNumbericVal = 2;
                }
                if (null != formData.enquiryResponses[i].representativeResponse && formData.enquiryResponses[i].representativeResponse != "") {
                    let locale = {
                        languageId: this.languageIdNumbericVal,
                        response: formData.enquiryResponses[i].representativeResponse
                    }
                    responseList.push(locale);
                }
            }
            if (responseList.length == 0) {
                this.responseRequired = true;
                this.responseInternalRequired = true;
            } else {

                let request = {
                    enquiryId: this.enquiryId,
                    postTo: this.tabValue == undefined ? "INTERNAL" : this.tabValue,
                    postAs: [''],
                    enquiryLocales: responseList,
                }
                this.loadingResponse = true;
                let CREATE_RESPONSE = environment.APIEndpoint + "api/rpa/enquiry/v1/create/response";
                this.http.postJson(CREATE_RESPONSE, request)
                    .subscribe((response) => {
                        this.loadingResponse = false;
                        //  this.router.navigate(['/search-enquiries']);
                        if (!this.responseRequired) {
                            this.responseRequired = false;
                            this.createEnquiryResponse.controls['enquiryResponses'].reset();
                        }

                        this.getResponse();
                        this.createEnquiryResponsePostOptions.get('representativeResponse').reset();
                        this.createEnquiryResponsePostOptions.get('representativeResponse').updateValueAndValidity();
                    }
                        , err => {
                            this.loadingResponse = false;
                            if (err.error.errorType == 'VALIDATION') {
                                this.snackBar.openFromComponent(SnackBarComponent, {
                                    duration: 10000,
                                    data: {
                                        status: "failure",
                                        message: err.error.errorDetails[0].description
                                    }
                                });
                            } else if (err.error.error == "access_denied") {
                                this.snackBar.openFromComponent(SnackBarComponent, {
                                    duration: 1500,
                                    data: {
                                        status: "failure",
                                        message: err.error.error_description
                                    }
                                });
                            }
                            else {
                                this.snackBar.openFromComponent(SnackBarComponent, {
                                    duration: 10000,
                                    data: {
                                        status: "failure",
                                        message: "Your request cannot be saved at this time. Please try again later"
                                    }
                                });
                            }
                        });
            }

        }
    }

    postVal(ev) {
        ev.checked = !ev.checked;
        if (ev.checked == true) {
            this.matVal = false;
            let arr = [];
            this.triggeredValue = ev.value;
            this.custArr.push(this.triggeredValue);
            console.log(this.custArr);
        } else {
            this.matVal = true;
            this.custArr = [''];
        }
    }

    // postVal(ev) {
    //     ev.checked = !ev.checked;
    //     if (ev.checked == true) {
    //         this.matVal = false;
    //         let arr = [];
    //         this.custArr.push(ev.value);
    //     } else {
    //         this.matVal = true;
    //         // this.custArr = [''];
    //     }
    // }

    public createResponsePost(formData) {
        console.log(formData);
        if (this.createEnquiryResponsePostOptions.get('postAsOptions').invalid == true) {
            this.matVal = true;
        } else {
            this.matVal = false;
        }
        for (i = 0; i < formData.enquiryResponses.length; i++) {
            if (formData.enquiryResponses[i].representativeResponse != '') {
                this.responseCustomerRequired = false;
            }
            else {
                this.responseCustomerRequired = true;

            }
        }
        if (this.createEnquiryResponsePostOptions.invalid == true) {
            this.showError = true;
            this.loadingCusResponse = false;
        } else {
            let responseList = [];
            for (var i = 0; i < formData.enquiryResponses.length; i++) {
                console.log(formData.languageOptions);
                console.log(this.languages[i].languageCode);
                if (formData.languageOptionsPost == "English" || formData.languageOptionsPost == "EN") {
                    this.languageIdNumbericValpost = 1;
                }
                if (formData.languageOptionsPost == "AR") {
                    this.languageIdNumbericValpost = 2;
                }
                if (null != formData.enquiryResponses[i].representativeResponse && formData.enquiryResponses[i].representativeResponse != "") {
                    let locale = {
                        languageId: this.languageIdNumbericValpost,
                        response: formData.enquiryResponses[i].representativeResponse
                    }
                    responseList.push(locale);
                }
            }
            if (responseList.length == 0) {
                // this.responseRequired = true;
                this.responseCustomerRequired = true;
            } else {

                let request = {
                    enquiryId: this.enquiryId,
                    postTo: this.tabValue,
                    postAs: this.custArr,
                    enquiryLocales: responseList,
                }
                this.loadingCusResponse = true;
                let CREATE_RESPONSE = environment.APIEndpoint + "api/rpa/enquiry/v1/create/response";
                this.http.postJson(CREATE_RESPONSE, request)
                    .subscribe((response) => {
                        console.log(response);
                        this.loadingCusResponse = false;
                        //  this.router.navigate(['/search-enquiries']);
                        this.createEnquiryResponsePostOptions.get('enquiryResponses').reset();
                        this.createEnquiryResponsePostOptions.controls['postAsOptions'].reset();
                        this.postAsOptionsVals.forEach((item) => { item.checked = false; });
                        console.log(this.postAsOptionsVals)
                        this.getResponse();
                        this.custArr = [];
                        console.log(this.custArr);
                    }
                        , err => {
                            this.loadingCusResponse = false;
                            if (err.error.errorType == 'VALIDATION') {
                                this.snackBar.openFromComponent(SnackBarComponent, {
                                    duration: 10000,
                                    data: {
                                        status: "failure",
                                        message: err.error.errorDetails[0].description
                                    }
                                });
                            } else if (err.error.error == "access_denied") {
                                this.snackBar.openFromComponent(SnackBarComponent, {
                                    duration: 1500,
                                    data: {
                                        status: "failure",
                                        message: err.error.error_description
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
                        });
            }

        }
    }

    goToPreviousPage() {
        console.log(this.viewMemberID);

        if (this.tabName != null) {
            localStorage.setItem('pointTabIndex', 'POINTS');
        }
        if (this.previusUrl.startsWith('/view-member')) {
            localStorage.setItem('memberCustomerId', this.viewMemberID);
            this.router.navigate([this.previusUrl]);
        }
        else {
            localStorage.setItem('memberCustomerId', this.viewMemberID);
            localStorage.setItem('searchData', this.previousSearchData);
            localStorage.setItem('countryId', this.countryId);
            localStorage.setItem('cityId', this.cityId);
            console.log(this.previousSearchData);
            this.router.navigate(['/search-enquiries']);
        }
        console.log(this.previusUrl);
    }

    viewMember(ID) {
        localStorage.setItem('memberCustomerId', ID);
        localStorage.setItem('IsfromDirectEnquiryPage', "yes");
        localStorage.setItem('enquiryId', this.enquiryId);
        this.router.navigate(['/view-member']);
    }

    viewTransactionPage(ID) {
        localStorage.setItem('enquiryId', this.enquiryId);
        localStorage.setItem('TxnOid', ID);
        this.router.navigate(['/view-transaction'])
    }
}