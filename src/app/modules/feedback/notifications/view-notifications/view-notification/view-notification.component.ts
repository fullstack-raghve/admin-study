import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { BehaviorSubject } from 'rxjs';
import { HttpService } from 'src/app/services/http-service';
import { SnackBarComponent } from 'src/app/shared/components/snack-bar/snack-bar.component';
import { MatDialogConfig, MatDialog, MatSnackBar } from '@angular/material';
import { FormControl, Validators, FormBuilder, FormGroup, FormArray, NgForm } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material';
import { COMMA, ENTER } from '@angular/cdk/keycodes';

export interface Fruit {
  name: string;
}
@Component({
  selector: 'app-view-notification',
  templateUrl: './view-notification.component.html',
  styleUrls: ['./view-notification.component.scss']
})
export class ViewNotificationComponent implements OnInit {
  public breadCrumbData: Array<Object> = [{
    title: 'Member Management',
    link: ''
  }, {
    title: 'Enquiries',
    link: ''
  }
  ];
  public referenceId: number;
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

  constructor(private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private https: HttpService,
    public snackBar: MatSnackBar,
    private router: Router, ) {
    this.activatedRoute.params.subscribe((params) => {
      this.referenceId = +(params.id);
      console.log(this.referenceId);
    });
  }

  ngOnInit() {
    this.viewNotification();
    this.buildInternalNotesResponse();
    this.buildExternalNotesResponse();
    this.getUsersList();
    this.getAllTagsById();
    this.getAllNotificationTags();
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
      console.log(res);
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
    console.log(this.viewValuestatus);
    console.log(this.viewEnquiryFormGroup.value.notificationStatus);
  }

  viewNotification() {
    const VIEW_NOTIFICATION = 'api/rpa/feedback/notifications/v1/view';
    const reqId = {
      referenceId: this.referenceId
    };
    this.https.postJson(environment.APIEndpoint + VIEW_NOTIFICATION, reqId).subscribe(
      (response) => {
        this.buildnotificationFormGroup(response);
        console.log(response);
        this.adminUsername = localStorage.getItem("fullName");
        console.log(this.adminUsername)
        this.viewValue = response;
        this.customerName = this.viewValue.customerName;
        this.customerEmailId = this.viewValue.emailId;
        this.customerMobile = this.viewValue.mobileNumber;
        this.viewValuestatus = this.viewValue.feedbackStatus;
        this.emailEnable = this.viewValue.emailId != null && this.viewValue.emailId != '' ? false : true;
        this.smsEnable = this.viewValue.mobileNumber != null && this.viewValue.mobileNumber != '' ? false : true;
        this.questions = this.viewValue['feedbackQuestionsAndAnswers'];
        this.previousresponses = this.viewValue['previousResponse'];
        console.log(this.previousresponses.length);
        console.log(this.questions);
        if (this.previousresponses.length == 0 || this.previousresponses.length == 'null') {
          this.noPrevResponse = true;
        } else {
          this.noPrevResponse = false;
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }

  buildInternalNotesResponse() {
    this.internalNotesFormGroup = this.fb.group({
      internalResponse: ['']
    });
  }
  buildExternalNotesResponse() {
    this.externalNotesFormGroup = this.fb.group({
      externalResponse: [''],
      email: [''],
      sms: [''],
      // push:['']
    });
  }


  addInternalNotes(formData, form: NgForm) {
    console.log(this.viewEnquiryFormGroup.controls['selectassigne'].value)
    if (this.internalNotesFormGroup.invalid === true) {
      this.showError = false;
      this.loading = false;
    } else {
      this.showError = true;
      this.loading = true;
      this.disabled = true;
      const ADD_RESPONSE = 'api/rpa/feedback/notifications/v1/addResponse';
      const reqBody = {
        referenceId: this.referenceId,
        userResponse: formData.internalResponse,
        sms: "",
        email: "",
        push: "",
        link: "Internal"
      };
      console.log(reqBody);
      this.https.postJson(environment.APIEndpoint + ADD_RESPONSE, reqBody).subscribe(
        (response) => {
          console.log(response);
          this.loading = false;
          this.disabled = false;
          this.buildFlag = false;
          form.reset();
          this.viewNotification();
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

  addExternalNotes(formData, form: NgForm) {
    if ((formData.sms == null || formData.sms == '') && (formData.email == null || formData.email == '')) {
      this.externalChannelErr = true;
    } else {
      this.externalChannelErr = false;
      if (this.externalNotesFormGroup.invalid === true) {
        this.showError = false;
        this.loading = false;
      } else {
        this.showError = true;
        this.loading = true;
        this.disabled = true;
        const ADD_RESPONSE = 'api/rpa/feedback/notifications/v1/addResponse';
        const reqBody = {
          referenceId: this.referenceId,
          userResponse: formData.externalResponse,
          sms: formData.sms == true ? 'sms' : '',
          email: formData.email == true ? 'email' : '',
          push: '',
          link: "External"
        };
        console.log(reqBody);
        this.https.postJson(environment.APIEndpoint + ADD_RESPONSE, reqBody).subscribe(
          (response) => {
            console.log(response);
            this.loading = false;
            this.disabled = false;
            this.buildFlag = false;
            form.reset();
            this.viewNotification();
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


  deleteResponse(prevResponse) {
    console.log(prevResponse);
    this.responseIdVal = prevResponse.responseId;
    const DELETE_RESPONSE = "api/rpa/feedback/notifications/v1/deleteResponse"
    const reqBody = {
      userResponseId: this.responseIdVal,
    }
    this.https.postJson(environment.APIEndpoint + DELETE_RESPONSE, reqBody).subscribe(
      (response) => {
        console.log(response);
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
        this.router.navigate(['/feedback-search-notifications']);
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
    // );
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








    // const req = {
    //     referenceId:this.referenceId,
    //     notificationTag: value,
    //     isDelete:false,
    //     oid:0
    // }
    // this.https.postJson(environment.APIEndpoint + 'api/rpa/feedback/notifications/v1/updateNotificationTagList', req).subscribe(
    //   (res)=> {
    //     console.log(res);
    //     this.tagsList = res;
    //   }
    // )
    // Add our fruit
    // if ((value || '').trim()) {
    //   this.fruits.push({ name: value.trim() });
    // }

    // Reset the input value
    // if (input) {
    //   input.value = '';
    // }
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
        console.log(res);
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
        console.log(res);
        this.tagsList = res;
      }
    )
  }

  public getAllNotificationTags() {
    this.https.getJson(environment.APIEndpoint + 'api/rpa/feedback/notifications/v1/getNotificationTagList').subscribe(
      (res) => {
        console.log(res);
        this.autoSearchResult = res;
      }
    )
  }


}
