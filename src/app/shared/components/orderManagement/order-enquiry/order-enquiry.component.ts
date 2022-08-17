import { Component, OnInit, Input, ViewChild, ElementRef, ChangeDetectorRef, Renderer2 } from '@angular/core';
import { Validators, FormBuilder, FormGroup, FormArray, NgForm } from '@angular/forms';
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

@Component({
  selector: 'app-order-enquiry',
  templateUrl: './order-enquiry.component.html',
  styleUrls: ['./order-enquiry.component.scss']
})
export class OrderEnquiryComponent implements OnInit {

  @Input() showCutomerTab;
  @Input('viewEnqId') viewEnqId;
  @Input('link') link;

  channelsList = [{
    value: 'SMS',
    label: 'SMS',
    checked: false
  }, {
    value: 'EMAIL',
    label: 'Email',
    checked: false
  }];

  viewEnquiryFormGroup: FormGroup;
  createInternalNotesFormGroup: FormGroup;
  createCustomerReplyFormGroup: FormGroup;

  @ViewChild("viewEnquiryForm") viewEnquiryForm;
  @ViewChild("enquiryInternalNotesForm") enquiryInternalNotesForm;
  @ViewChild("enquiryCustomerReplyForm") enquiryCustomerReplyForm;

  public channelErrorMsg: boolean;
  public triggeredValue = [];
  public selectedChannels = [];
  public enquiryTypeList = [];
  public responseData: any;
  public enquiryData: any;
  public enquiryId: any;
  public buildFlag: boolean = false;
  public seletedTabIndex: any;
  public pageLoader: boolean = false;
  public internalReplyRequired: boolean = false;
  public customerReplyRequired: boolean = false;

  constructor(
    private elRef: ElementRef,
    private renderer: Renderer2,
    private activatedRoute: ActivatedRoute,
    private http: HttpService,
    public snackBar: MatSnackBar,
    private fb: FormBuilder,
    private router: Router) {
  }


  ngOnInit() {
    if (this.viewEnqId != null) {
      this.getViewEnquiry();
      this.buildCreateEnquiryForm();
      this.buildEnquiryResponsePostForm();
      // this.getResponse();
    }
  }

  public tabChanged(tabChangeEvent: MatTabChangeEvent): void { }

  selectedChannel(ev) {
    ev.checked = !ev.checked;
    if (ev.checked == true) {
      // this.channelErrorMsg = false;
      this.triggeredValue = ev.value;
      this.selectedChannels.push(this.triggeredValue);
    } else {
      // this.channelErrorMsg = true;
    }
  }

  public getViewEnquiry() {
    let GET_ENQUIRY_BY_ID = environment.APIEndpoint + "api/rpa/enquiry/v2/view";
    let request = {
      enquiryId: this.viewEnqId
    }
    this.http.postJson(GET_ENQUIRY_BY_ID, request)
      .subscribe(
        (response) => {
          this.enquiryData = response;
          this.buildEnquiryFormGroup(this.enquiryData);
          this.enquiryId = this.enquiryData.enquiryId
          this.getEnquiryType(this.enquiryData);
          this.getResponse();
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
    this.buildFlag = true;
  }

  public buildCreateEnquiryForm() {
    this.createInternalNotesFormGroup = this.fb.group({
      internalComment: ['', Validators.compose([Validators.maxLength(500), Validators.pattern(Globals.regCustomwhiteList)])]
    });
  }

  public buildEnquiryResponsePostForm() {
    this.createCustomerReplyFormGroup = this.fb.group({
      enquiryCustomerComment: ['', Validators.compose([Validators.maxLength(500), Validators.pattern(Globals.regCustomwhiteList)])]
    });
  }

  public getResponse() {
    let GET_RESPONSE_BY_ID = environment.APIEndpoint + "api/rpa/enquiry/v2/view/response";
    let request = {
      enquiryId: this.enquiryId,
    }
    this.http.postJson(GET_RESPONSE_BY_ID, request)
      .subscribe(
        (response) => {
          this.responseData = response["enquiryResponses"];
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

  public updateEnquiry(formData) {
    if (this.viewEnquiryFormGroup.invalid == true) {
      // this.showError = true;
    } else {
      let request = {
        enquiryId: this.enquiryId,
        enquiryStatus: formData.enquiryStatus,
        internalEnquiryId: formData.internalEnquiryId,
      }
      let UPDATE_ENQUIRY = environment.APIEndpoint + "api/rpa/enquiry/v2/update";
      this.http.postJson(UPDATE_ENQUIRY, request)
        .subscribe((response) => {
          this.getViewEnquiry();
          this.snackBar.openFromComponent(SnackBarComponent, {
            duration: 10000,
            data: {
              status: "success",
              message: "Enquiry updated successfully"
            }
          });
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

  public createInternalNotes(formData, form: NgForm) {
    this.pageLoader = true;
    this.internalReplyRequired = false;
    if (this.createInternalNotesFormGroup.invalid == true) {
      this.internalReplyRequired = true;
      this.pageLoader = false;
    } else {
      let enquiryCommentList = [];
      let locale = {
        languageId: 1,
        response: formData.internalComment
      }
      enquiryCommentList.push(locale);
      if (this.createInternalNotesFormGroup.get('internalComment').value == '') {
        this.internalReplyRequired = true;
        this.pageLoader = false;
      } else {
        let request = {
          enquiryId: this.enquiryId,
          postAs: [''],
          postTo: "INTERNAL",
          enquiryLocales: enquiryCommentList,
        }
        let CREATE_RESPONSE = environment.APIEndpoint + "api/rpa/enquiry/v2/create/response";
        this.http.postJson(CREATE_RESPONSE, request)
          .subscribe((response) => {
            this.internalReplyRequired = false;
            // form.reset();
            this.getResponse();
            this.createInternalNotesFormGroup.get('internalComment').reset();
            this.createInternalNotesFormGroup.get('internalComment').updateValueAndValidity();
            this.pageLoader = false;
          }
            , err => {
              this.internalReplyRequired = false;
              this.pageLoader = false;
              if (err.error.errorType == 'VALIDATION') {
                this.snackBar.openFromComponent(SnackBarComponent, {
                  duration: 10000,
                  data: {
                    status: "failure",
                    message: err.error.errorDetails[0].description
                  }
                });
              } else if (err.error.error == "access_denied") {
                this.pageLoader = false;
                this.snackBar.openFromComponent(SnackBarComponent, {
                  duration: 1500,
                  data: {
                    status: "failure",
                    message: err.error.error_description
                  }
                });
              } else {
                this.pageLoader = false;
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
  public removeValidation() {
    this.internalReplyRequired = false;
    this.customerReplyRequired = false;
  }

  public createCustomerReply(formData, form: NgForm) {
    this.customerReplyRequired = false;
    if (this.selectedChannels.length > 0) {
      this.channelErrorMsg = false;
    } else {
      this.channelErrorMsg = true;
    }
    if (this.createCustomerReplyFormGroup.invalid == true || this.channelErrorMsg == true) {
      // this.customerReplyRequired = true;
    } else {
      let responseList = [];
      let req = {
        languageId: 1,
        response: formData.enquiryCustomerComment
      }
      responseList.push(req)
      if (this.createCustomerReplyFormGroup.get('enquiryCustomerComment').value == '') {
        this.customerReplyRequired = true;
      } else {
        let request = {
          enquiryId: this.enquiryId,
          postTo: "USER",
          postAs: this.selectedChannels,
          enquiryLocales: responseList,
        }
        this.pageLoader = true;
        let CREATE_RESPONSE = environment.APIEndpoint + "api/rpa/enquiry/v2/create/response";
        this.http.postJson(CREATE_RESPONSE, request)
          .subscribe((response) => {
            this.pageLoader = false;
            for (let i = 0; i < this.channelsList.length; i++) {
              this.channelsList[i].checked = false;
            }
            this.selectedChannels = [];
            this.getResponse();
            this.createCustomerReplyFormGroup.get('enquiryCustomerComment').reset();
            this.createCustomerReplyFormGroup.get('enquiryCustomerComment').updateValueAndValidity();
          }
            , err => {
              this.pageLoader = false;
              if (err.error.errorType == 'VALIDATION') {
                this.snackBar.openFromComponent(SnackBarComponent, {
                  duration: 10000,
                  data: {
                    status: "failure",
                    message: err.error.errorDetails[0].description
                  }
                });
              } else if (err.error.error == "access_denied") {
                this.pageLoader = false;
                this.snackBar.openFromComponent(SnackBarComponent, {
                  duration: 1500,
                  data: {
                    status: "failure",
                    message: err.error.error_description
                  }
                });
              } else {
                this.pageLoader = false;
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
}
