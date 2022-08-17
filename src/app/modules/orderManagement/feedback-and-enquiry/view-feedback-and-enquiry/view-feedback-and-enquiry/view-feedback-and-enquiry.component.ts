import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { BehaviorSubject } from 'rxjs';
import { HttpService } from 'src/app/services/http-service';
import { SnackBarComponent } from 'src/app/shared/components/snack-bar/snack-bar.component';
import { MatDialogConfig, MatDialog, MatSnackBar, MatTabChangeEvent } from '@angular/material';
import { FormControl, Validators, FormBuilder, FormGroup, FormArray, NgForm } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material';
import { COMMA, ENTER } from '@angular/cdk/keycodes';

export interface Fruit {
  name: string;
}

@Component({
  selector: 'view-feedback-and-enquiry',
  templateUrl: './view-feedback-and-enquiry.component.html',
  styleUrls: ['./view-feedback-and-enquiry.component.scss']
})
export class ViewFeedbackAndEnquiryComponent implements OnInit {
  public breadCrumbData: Array<Object> = [{
    title: 'Order Management',
    link: ''
  }, {
    title: 'Feedback & Enquiry',
    link: ''
  }
  ];
  public referenceId: any;
  viewEnquiryFormGroup: FormGroup;

  //internal notes & external notes
  internalNotesFormGroup: FormGroup;
  externalNotesFormGroup: FormGroup;

  createNotificationResponseForm: FormGroup;
  public loading: boolean = false;
  public disabled: boolean = false;
  viewValue;
  users;
  public buildFlag: boolean = false;
  userCount = 10;
  showError: boolean = false;
  noPrevResponse: boolean = false;
  questions: [];
  userIdValue: any;
  previousresponses: any;
  responseIdVal: any;
  public viewValuestatus: any;
  customerName: any;
  customerEmailId: any;
  customerMobile: any;
  adminUsername: any;


  // notification tags
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  fruits: Fruit[] = [
    { name: 'Lemon' },
    { name: 'Lime' },
    { name: 'Apple' },
  ];
  tagsList: any;
  keywordErrorMsg: any;
  autoSearchResult: any[];
  public emailEnable: boolean = false;
  public smsEnable: boolean = false;
  public externalChannelErr: boolean = false;
  public imageBaseUrl = localStorage.getItem('imgBaseUrl');
  public menuIds: any = JSON.parse(localStorage.getItem("menuIds"));
  public externalCommunicationTab: boolean = false;
  languages: any[];
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
  public responseCustomerRequired = false;
    public responseInternalRequired = false;
  tabValue: string;
  @ViewChild('tabGroup') tabGroup;
  public seletedTabIndex = 0;
  @ViewChild("enquiryResponseForm") enquiryResponseForm;
  @ViewChild("enquiryResponsePostForm") enquiryResponsePostForm;
  custArr: any;
  triggeredValue: any;
  public alignCss = [];
  public alignCssAr = [];
  public alignCssResponse = [];
  languageDirection = [];
  createEnquiryResponsePostOptions: FormGroup;

  constructor(private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private https: HttpService,
    public snackBar: MatSnackBar,
    private router: Router, ) {
      this.menuIds.forEach(element => {
        if(element == 14005002){
          this.externalCommunicationTab = true;
        }
      });
  }

  ngOnInit() {
    let viewRefId = localStorage.getItem('viewFBEnqId');
    if(viewRefId != null && viewRefId != ''){
      this.referenceId = localStorage.getItem('viewFBEnqId');

      this.viewNotification();
      this.buildInternalNotesResponse();
      this.buildExternalNotesResponse();
      this.getUsersList();
      this.getAllTagsById();
      this.getAllNotificationTags();
      // this.getLanguageList();

      localStorage.removeItem('viewFBEnqId');
    }else{
      sessionStorage.clear();
      this.router.navigate(['/search-feedback-and-enquiry'])
    }

  }

  getUsersList() {
    const data = {
      'page': '0',
      'pageSize': '1000',
      'order': {
        'column': 'modifiedTime',
        'dir': 'desc'
      },
      'keySearch': '',
      'fieldSearch': [
        {
          'fieldName': 'status',
          'fieldValue': 'ONLINE'
        }
      ]
    };
    this.https.postJson(environment.APIEndpoint + 'api/rpa/user/search', data).subscribe(res => {
      this.users = res['items'];
    }, err => {
      console.log(err);
    });
  }


  buildnotificationFormGroup(formData) {
    this.buildFlag = true;
    this.viewEnquiryFormGroup = this.fb.group({
      selectassigne: [formData.assigneeId, Validators.required],
      notificationStatus: [formData.feedbackStatus, Validators.required],
      // representativeResponse: ['', Validators.required]
    });
   
  }

  viewNotification() {
    const VIEW_NOTIFICATION = 'api/rpa/feedback/notifications/v1/view';
    const reqId = {
      referenceId: this.referenceId
    };
    this.https.postJson(environment.APIEndpoint + VIEW_NOTIFICATION, reqId).subscribe(
      (response) => {
        this.buildnotificationFormGroup(response);
        this.adminUsername = localStorage.getItem("fullName");
        this.viewValue = response;
        this.customerName = this.viewValue.customerName;
        this.customerEmailId = this.viewValue.emailId;
        this.customerMobile = this.viewValue.mobileNumber;
        this.viewValuestatus = this.viewValue.feedbackStatus;
        this.emailEnable = this.viewValue.tranUserEmailId != null && this.viewValue.tranUserEmailId != '' ? false : true;
        this.smsEnable = this.viewValue.tranUserMobileNo != null && this.viewValue.tranUserMobileNo != '' ? false : true;
        this.questions = this.viewValue['feedbackQuestionsAndAnswers'];
        this.previousresponses = this.viewValue['previousResponse'];
        if (this.previousresponses.length == 0 || this.previousresponses.length == 'null') {
          this.noPrevResponse = true;
        } else {
          this.noPrevResponse = false;
        }
        this.getLanguageList();

      },
      (error) => {
        console.log(error);
      }
    );
  }
  previousResponseData() {
    const VIEW_NOTIFICATION = 'api/rpa/feedback/notifications/v1/view';
    const reqId = {
      referenceId: this.referenceId
    };
    this.https.postJson(environment.APIEndpoint + VIEW_NOTIFICATION, reqId).subscribe(
      (response) => {

        this.buildnotificationFormGroup(response);
        this.adminUsername = localStorage.getItem("fullName");
        this.viewValue = response;
        this.customerName = this.viewValue.customerName;
        this.customerEmailId = this.viewValue.emailId;
        this.customerMobile = this.viewValue.mobileNumber;
        this.viewValuestatus = this.viewValue.feedbackStatus;
        this.emailEnable = this.viewValue.tranUserEmailId != null && this.viewValue.tranUserEmailId != '' ? false : true;
        this.smsEnable = this.viewValue.tranUserMobileNo != null && this.viewValue.tranUserMobileNo != '' ? false : true;
        this.questions = this.viewValue['feedbackQuestionsAndAnswers'];
        this.previousresponses = this.viewValue['previousResponse'];
        
        if (this.previousresponses.length == 0 || this.previousresponses.length == 'null') {
          this.noPrevResponse = true;
        } else {
          this.noPrevResponse = false;
        }
        // this.getLanguageList();

      },
      (error) => {
        console.log(error);
      }
    );
  }
public getLanguageList() {
  let GET_ALL_LANGUAGES = environment.APIEndpoint + "api/rpa/master/language/v1/list";
  this.https.getJson(GET_ALL_LANGUAGES)
      .subscribe((response) => {
          this.languages = response;
          this.adduserResponse();
          this.addEnquiryPostResponses();

          // this.addEnquiryPostResponses();
          this.changeValidation('EN');
          this.changeValidationPost('EN');
      });
    }
    selectedValue;
    condition: boolean = false;


    isSelectedItem(i) {
      this.selectedValue = i;
      if (this.selectedValue == 0) {
          this.condition = true;
      } else if (this.selectedValue == 1) {
          this.condition = false;
      }
  }
    changeValidation(ev) {
      const control = this.createEnquiryResponse.get('userResponse') as FormArray
      for (let i = 0; i < this.languages.length; i++) {
          if (this.languages[i].languageCode != ev) {
             
              control.at(i).get('representativeResponse').disable();
              control.at(i).get('representativeResponse').setValue('');
              control.at(i).get('representativeResponse').updateValueAndValidity();
          } else {
              control.at(i).get('representativeResponse').enable();
          }
      }
  }
    createEnquiryResponse: FormGroup;
  buildInternalNotesResponse() {
      this.createEnquiryResponse = this.fb.group({
          userResponse: this.fb.array([]),
          languageOptions: ['English', Validators.required],
      });
  }
  
  buildExternalNotesResponse() {
    this.createEnquiryResponsePostOptions = this.fb.group({
      externalResponse: [''],

      userResponse: this.fb.array([]),
            email: [''],
      sms: [''],
      languageOptionsPost: ['English', Validators.required],
      
    });
  }
 
  changeValidationPost(ev) {
    const control = this.createEnquiryResponsePostOptions.get('userResponse') as FormArray
    for (let i = 0; i < this.languages.length; i++) {
        if (this.languages[i].languageCode != ev) {
         
            control.at(i).get('representativeResponse').disable();
            control.at(i).get('representativeResponse').setValue('');
            control.at(i).get('representativeResponse').updateValueAndValidity();
        } else {
            control.at(i).get('representativeResponse').enable();
        }
    }
}

public addEnquiryPostResponses() {
  for (let i = 0; i < this.languages.length; i++) {
      const control = <FormArray>this.createEnquiryResponsePostOptions.controls['userResponse'];
      let newForm = this.fb.group({
          representativeResponse: ["", Validators.compose([Validators.maxLength(500)])],
      });
      control.push(newForm);
      this.alignCss.push(this.languages[i].direction == 'RTL' ? 'text-right' : '');
      this.languageDirection.push(this.languages[i].direction == 'RTL' ? 'direction' : '');
  }
}
public tabChanged(tabChangeEvent: MatTabChangeEvent): void {
  this.changeValidation('EN');
  this.changeValidationPost('EN')

  if (tabChangeEvent.index == 1) {
      this.tabValue = "USER";
  
      const control = this.createEnquiryResponsePostOptions.get('userResponse') as FormArray
      for (let i = 0; i < this.languages.length; i++) {
         
          this.changeValidation('EN');
          
      }
  } else if (tabChangeEvent.index == 0) {
     
      this.tabValue = "INTERNAL";
      this.changeValidation('EN');
  }

}
  public adduserResponse() {
    for (let i = 0; i < this.languages.length; i++) {
        const control = <FormArray>this.createEnquiryResponse.controls['userResponse'];
        let newForm = this.fb.group({
            representativeResponse: ["", Validators.compose([Validators.maxLength(500)])],
        });
        control.push(newForm);
        this.alignCss.push(this.languages[i].direction == 'RTL' ? 'text-right' : '');
        this.languageDirection.push(this.languages[i].direction == 'RTL' ? 'direction' : '');
    }
}

languageIdNumbericVal;
get pairs() {
  return (<FormArray>this.createEnquiryResponse.get('userResponse'));
}
get pairsPost() {
  return (<FormArray>this.createEnquiryResponsePostOptions.get('userResponse'));
}
  addInternalNotes(formData, form: NgForm) {
    if (this.createEnquiryResponse.invalid === true) {
      this.showError = false;
      this.loading = false;
    } else {
      this.showError = true;
           
              let responseList = [];
            for (var i = 0; i < formData.userResponse.length; i++) {
                
                if (formData.languageOptions == "English" || formData.languageOptions == "EN") {
                    this.languageIdNumbericVal = 1;
                }
                if (formData.languageOptions == "AR") {
                    this.languageIdNumbericVal = 2;
                }
                if (null != formData.userResponse[i].representativeResponse && formData.userResponse[i].representativeResponse != "") {
                    let locale = {
                        languageId: this.languageIdNumbericVal,
                        userResponse: formData.userResponse[i].representativeResponse
                    }
                    responseList.push(locale);
                }
            }
            if (responseList.length == 0) {
              this.responseInternalRequired = true;
          } else {
              this.pairs.controls.forEach(group => group.get('representativeResponse').reset());
            this.loading = true;
            this.disabled = true;
      const ADD_RESPONSE = 'api/rpa/feedback/notifications/v1/addResponse';
      const reqBody = {
        referenceId: this.referenceId,
        userResponseLocale:responseList,
        sms: "",
        email: "",
        push: "",
        link: "Internal"
      };
      this.https.postJson(environment.APIEndpoint + ADD_RESPONSE, reqBody).subscribe(
        (response) => {
          this.loading = false;
          this.disabled = false;
          this.buildFlag = false;
          // form.reset();
          this.previousResponseData();
          this.snackBar.openFromComponent(SnackBarComponent, {
            duration: 10000,
            data: {
              status: 'success',
              message: 'Response has been Created successfully'
            }
          });
          //this.router.navigate(['/feedback-search-notifications']);
        },
        (error) => {
          this.loading = false;
          this.snackBar.openFromComponent(SnackBarComponent, {
            duration: 10000,
            data: {
              status: 'failure',
              message: 'Your request cannot be saved at this time. Please try again later'
            }
          });
          console.log(error);
        }
      );
    }
  }
  }
  public removeValidation() {
    this.externalChannelErr = false;
    this.responseCustomerRequired = false;
    this.responseInternalRequired = false;

}

  addExternalNotes(formData, form: NgForm) {
    if ((formData.sms == null || formData.sms == '') && (formData.email == null || formData.email == '')) {
      this.externalChannelErr = true;
  } else {
 
      this.externalChannelErr = false;
      if (this.createEnquiryResponsePostOptions.invalid === true) {
        this.showError = false;
        this.loading = false;
      } else {
        this.showError = true;
        
        let responseList = [];
        for (var i = 0; i < formData.userResponse.length; i++) {
      
            if (formData.languageOptionsPost == "English" || formData.languageOptionsPost == "EN") {
                this.languageIdNumbericVal = 1;
            }
            if (formData.languageOptionsPost == "AR") {
                this.languageIdNumbericVal = 2;
            }
            if (null != formData.userResponse[i].representativeResponse && formData.userResponse[i].representativeResponse != "") {
                let locale = {
                    languageId: this.languageIdNumbericVal,
                    userResponse: formData.userResponse[i].representativeResponse
                }
                responseList.push(locale);
            }
        }
   
        if (responseList.length == 0) {
          this.responseCustomerRequired = true;
      } else {
        this.loading = true;
        this.disabled = true;
        this.pairsPost.controls.forEach(group => group.get('representativeResponse').reset());
        const ADD_RESPONSE = 'api/rpa/feedback/notifications/v1/addResponse';
        const reqBody = {
          referenceId: this.referenceId,
          userResponseLocale: responseList,
          sms: formData.sms == true ? 'sms' : '',
          email: formData.email == true ? 'email' : '',
          push: '',
          link: "External"
        };
        this.https.postJson(environment.APIEndpoint + ADD_RESPONSE, reqBody).subscribe(
          (response) => {
            this.loading = false;
            this.disabled = false;
            this.buildFlag = false;
            // form.reset();
            this.previousResponseData();
            this.snackBar.openFromComponent(SnackBarComponent, {
              duration: 10000,
              data: {
                status: 'success',
                message: 'Response has been Created successfully'
              }
            });
          },
          (error) => {
            this.loading = false;
            this.disabled = false;
            this.snackBar.openFromComponent(SnackBarComponent, {
              duration: 10000,
              data: {
                status: 'failure',
                message: 'Your request cannot be saved at this time. Please try again later'
              }
            });
            console.log(error);
          }
        );
      }
    }
    }

  }


  deleteResponse(prevResponse) {
    this.responseIdVal = prevResponse.responseId;
    const DELETE_RESPONSE = "api/rpa/feedback/notifications/v1/deleteResponse"
    const reqBody = {
      userResponseId: this.responseIdVal,
    }
    this.https.postJson(environment.APIEndpoint + DELETE_RESPONSE, reqBody).subscribe(
      (response) => {
        this.snackBar.openFromComponent(SnackBarComponent, {
          duration: 10000,
          data: {
            status: 'success',
            message: 'Response Deleted successfully'
          }
        });
        this.viewNotification();
      },
      (error) => {
        console.log(error);
      }
    );
  }

  updateStatus(formData) {
    if(this.viewEnquiryFormGroup.invalid === true){
      this.viewEnquiryFormGroup.get('selectassigne').markAsTouched();
    }else{
      const UPDATE_NOTIFICATION_STATUS = 'api/rpa/feedback/notifications/v1/updateFeedabackStatus';
      const reqBody = {
        referenceId: this.referenceId,
        feedbackStatus: formData.notificationStatus,
        userId: formData.selectassigne
      };
      this.https.postJson(environment.APIEndpoint + UPDATE_NOTIFICATION_STATUS, reqBody).subscribe(
        (response) => {
          this.snackBar.openFromComponent(SnackBarComponent, {
            duration: 10000,
            data: {
              status: 'success',
              message: 'Notification Updated successfully'
            }
          });
          this.viewNotification();
        },
        err => {
          this.loading = false;
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
                message: "Your request cannot be saved at this time. Please try again later"
              }
            });
          }
        })
    }
  }

  convertMiliToSecond(millis) {
    var minutes: any = Math.floor(millis / 60000);
    var seconds: any = ((millis % 60000) / 1000).toFixed(0);
    var min = minutes + ":";
    if (millis <= 59500) {
      min = ''
      return (seconds == 60 ? (minutes + 1) + ":00" : min + (seconds < 10 ? "0" : "") + seconds);
    }
    else {
      return (seconds == 60 ? (minutes + 1) + ":00" : min + (seconds < 10 ? "0" : "") + seconds);
    }


  }


  // notification tags
  addTag(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;


    let regex = /^[a-zA-Z0-9\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF\s]*$/;
    if (value != '') {
      let valid = value.match(regex)
      if (!valid) {
        // this.keywordErrorMsg[index] = true;
      } else {
        // this.keywordErrorMsg[index] = false;
        // Add our keyword
        if ((value || '').trim()) {

          const req = {
            referenceId: this.referenceId,
            notificationTag: value,
            isDelete: false,
            oid: 0
          }
          this.https.postJson(environment.APIEndpoint + 'api/rpa/feedback/notifications/v1/updateNotificationTagList', req).subscribe(
            (res) => {
              this.getAllTagsById();
            }
          )
        }
        // this.keywordArray.push()

        // Reset the input value
        if (input) {
          input.value = '';
        }
      }
    }
  }
  deleteTag(value): void {
    const delReq = {
      referenceId: this.referenceId,
      notificationTag: '',
      isDelete: true,
      oid: value
    }
    this.https.postJson(environment.APIEndpoint + 'api/rpa/feedback/notifications/v1/updateNotificationTagList', delReq).subscribe(
      (res) => {
        this.getAllTagsById();
      }
    )
  }

  public getAllTagsById() {
    const req = {
      referenceId: this.referenceId,
      notificationTag: '',
      isDelete: false,
      oid: '',
      getAll: true
    }
    this.https.postJson(environment.APIEndpoint + 'api/rpa/feedback/notifications/v1/updateNotificationTagList', req).subscribe(
      (res) => {
        this.tagsList = res;
      }
    )
  }

  public getAllNotificationTags() {
    this.https.getJson(environment.APIEndpoint + 'api/rpa/feedback/notifications/v1/getNotificationTagList').subscribe(
      (res) => {
        this.autoSearchResult = res;
      }
    )
  }

  CheckType(event){
    if(event.checked){
      this.externalChannelErr = false;
    }
  }
}

