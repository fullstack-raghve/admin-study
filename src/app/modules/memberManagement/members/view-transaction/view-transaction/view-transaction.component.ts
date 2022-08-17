import { OnInit, ViewChild, Output, Input, Component, EventEmitter, AfterViewInit, Renderer2 } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder, FormGroupDirective, FormArray, NgForm } from '@angular/forms';
import { MatPaginator, MatSort, MatTableDataSource, MatTabsModule, MatSnackBar } from '@angular/material';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';
import { HttpService } from 'src/app/services/http-service';

import { SnackBarComponent } from 'src/app/shared/components/snack-bar/snack-bar.component';
import { TransactionFeedbackComponent } from '../../view-transaction/transaction-feedback/transaction-feedback.component'
import { MatTabChangeEvent } from '@angular/material';

@Component({
  selector: 'view-transaction',
  templateUrl: './view-transaction.component.html',
  styleUrls: ['./view-transaction.component.scss']
})
export class ViewTransactionComponent implements OnInit {
  public toggleVal: boolean = true;
  public viewTxnDataView: boolean = false;
  public viewTxnsData: boolean = false;
  public txnOid = 0;
  public txnDetails;
  public memId;
  public lineItems = [];
  public enquiriesItems = [];
  public feedbackArray = [];
  public feedbacks = [];
  public enqId;
  public tabValue;
  matVal: boolean = false;
  @ViewChild('tabGroup') tabGroup;
  @ViewChild("viewEnquiryForm") viewEnquiryForm;
  @ViewChild("enquiryResponseForm") enquiryResponseForm;
  @ViewChild("enquiryResponsePostForm") enquiryResponsePostForm;
  public enquiryId: number;
  public enquiryData: any;
  public responseData: any;
  public enquiryTypeList = [];
  public languages = [];
  public alignCss = [];
  public alignCssResponse = [];
  public triggeredValue = [];
  public custArr = [];
  public seletedTabIndex = 0;
  feedbackEnq: boolean = false;
  @Input('feedbackList') feedbackList = [];
  feedbackDataValue;
  public languageIdNumbericValpost: number;

  public languageIdNumbericVal: number;
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
  cardResponse = [];
  feedbackData;
  public mattabvalueindex;
  public showError = false;
  public responseRequired = false;
  public previusUrl = localStorage.getItem('previousUrl');
  viewEnquiryFormGroup: FormGroup;
  createEnquiryResponse: FormGroup;
  createEnquiryResponsePostOptions: FormGroup;
  customerRepliedBy;

  public breadCrumbData: Array<Object> = [{
    title: 'Member Management',
    link: ''
  },
  {
    title: 'View Members',
    link: ''
  },
  {
    title: 'Transaction',
    link: ''
  }
  ];
  selectedValue;
  condition: boolean = false;
  viewEnquiryStatusFormGroup: FormGroup;
  public buildFlag: boolean = false;
  public viewValuestatus: any;
  tabName;
  orderId: number;
  memberId: string;
  viewFormGroup: FormGroup;
  constructor(private renderer: Renderer2, public dialog: MatDialog, private activatedRoute: ActivatedRoute, private https: HttpService,
    private http: HttpService, public snackBar: MatSnackBar, private fb: FormBuilder, private router: Router) {
    this.getLanguageList();
  }
  public preferredLanguageVal;
  ngOnInit() {
  
    let data = localStorage.getItem('TxnOid');
    this.tabName = localStorage.getItem('TabName');
    if(data){
      this.txnOid = Number(data);
      this.memberId = localStorage.getItem('memberID');
      console.log(this.memberId);
      console.log(this.txnOid);
      localStorage.removeItem('TxnOid');
      localStorage.removeItem('memberID');
      localStorage.removeItem('TabName');
      this.getTxnDetails();
      this.buildEnquiryResponseForm();
      this.buildEnquiryResponsePostForm();
    }
    else{
      sessionStorage.clear();
      this.router.navigate(['/search-member'])
    }

  }

 
  changeValidation(ev) {
    console.log(ev);
    const control = this.createEnquiryResponse.get('enquiryResponses') as FormArray
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
  changeValidationPost(ev) {
    console.log(ev);
    const control = this.createEnquiryResponsePostOptions.get('enquiryResponses') as FormArray
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
  public buildEnquiryResponseForm() {
    this.createEnquiryResponse = this.fb.group({
      enquiryResponses: this.fb.array([]),
      languageOptions: ['English', Validators.required],
    });
  }
 
  getLangVal() {
    console.log(this.createEnquiryResponse.get('languageOptions').value);
    console.log(this.languages);
  }
  public buildEnquiryResponsePostForm() {
    this.createEnquiryResponsePostOptions = this.fb.group({
      enquiryResponses: this.fb.array([]),
      languageOptionsPost: ['English', Validators.required],
      postAsOptions: ['', Validators.required],
    });
  }
  buildnotificationFormGroup() {
    this.buildFlag = true;
    this.viewEnquiryStatusFormGroup = this.fb.group({
      notificationStatus: [this.feedbackData, Validators.required],
    });
    console.log(this.feedbackData);
  }
  public getLanguageList() {
    let GET_ALL_LANGUAGES = environment.APIEndpoint + "api/rpa/master/language/v1/list";
    this.http.getJson(GET_ALL_LANGUAGES)
      .subscribe((response) => {
        this.languages = response;
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
        representativeResponse: ["", Validators.compose([Validators.maxLength(500), Validators.pattern('^[a-zA-Z0-9\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF \"&\'(),-:.?`،؟_ ;%@><\\\n]*')])],
      });
      control.push(newForm);
      this.alignCss.push(this.languages[i].direction == 'RTL' ? 'text-right' : '');
    }
  }

  public addEnquiryPostResponses() {
    for (let i = 0; i < this.languages.length; i++) {
      const control = <FormArray>this.createEnquiryResponsePostOptions.controls['enquiryResponses'];
      let newForm = this.fb.group({
        representativeResponse: ["", Validators.compose([Validators.maxLength(500), Validators.pattern('^[a-zA-Z0-9\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF \"&\'!\*\[\\\]#+={}(),-:.?`،؟_ ;%@><\\\n]*')])],
      });
      control.push(newForm);
      this.alignCss.push(this.languages[i].direction == 'RTL' ? 'text-right' : '');
    }
  }

  public getResponse() {
    console.log(this.tabValue);
    let GET_RESPONSE_BY_ID = environment.APIEndpoint + "api/rpa/enquiry/v1/view/response";
    let request = {
      enquiryId: this.enquiryId
    }
    this.http.postJson(GET_RESPONSE_BY_ID, request)
      .subscribe(
        (response) => {

          this.responseData = response["enquiryResponses"];
          if (this.responseData != null && this.responseData.length != 0) {
            for (var i = 0; i < this.responseData.length; i++) {
              for (var j = 0; j < this.responseData[i].enquiryResponseLocales.length; j++) {
                this.alignCssResponse.push(this.languages[j].direction == 'RTL' ? 'text-right' : '');
                if (null != this.responseData[i].enquiryResponseLocales[j].response)
                  this.responseData[i].enquiryResponseLocales[j].response = this.responseData[i].enquiryResponseLocales[j].response.replace(/(\\r\\n)|([\r\n])/gmi, '<br/>');
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
          } 
          else {
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
  public tabChanged(tabChangeEvent: MatTabChangeEvent): void {
    console.log(tabChangeEvent.index);
    this.mattabvalueindex = tabChangeEvent.index;
    if (tabChangeEvent.index == 1) {
      this.tabValue = "USER";
      const control = this.createEnquiryResponsePostOptions.get('enquiryResponses') as FormArray
      for (let i = 0; i < this.languages.length; i++) {
        console.log(this.languages);
        // console.log(this.preferredLanguageVal);
        // if (this.languages[i].languageCode != this.preferredLanguageVal) {
        //   control.at(i).get('representativeResponse').disable();
        //   control.at(i).get('representativeResponse').setValue('');
        //   control.at(i).get('representativeResponse').updateValueAndValidity();
        // } 
        // else {
        //   control.at(i).get('representativeResponse').enable();
        // }
      }
    } else if (tabChangeEvent.index == 0) {
      this.tabValue = "INTERNAL";
    }
    this.getResponse();
  }
  public getViewEnquiry(transactionId: any) {
    let GET_ENQUIRY_BY_ID = environment.APIEndpoint + "api/rpa/enquiry/v1/view";
    // let request = {
    //   transactionId: transactionId
    // }
    let request = {
      enquiryId: this.enqId
    }
    console.log(request);
    this.http.postJson(GET_ENQUIRY_BY_ID, request)
      .subscribe(
        (response) => {
          console.log(response);

          this.enquiryData = response;
          console.log(this.enquiryData.internalEnquiryId);

          this.enquiryId = response['enquiryId'];
          this.getEnquiryType(this.enquiryData);
          this.getResponse();
          this.buildEnquiryFormGroup(this.enquiryData);
        }, err => {
          if (err.error.error == "access_denied") {
            this.snackBar.openFromComponent(SnackBarComponent, {
              duration: 1500,
              data: {
                status: "failure",
                message: err.error.error_description
              }
            });
          }
          // else {
          //   this.snackBar.openFromComponent(SnackBarComponent, {
          //     duration: 1500,
          //     data: {
          //       status: "failure",
          //       message: "Unable to fetch data at current movement. Please try again later"
          //     }
          //   });
          // } 
        })
  }
  public buildEnquiryFormGroup(enquiryData: any) {
    this.viewEnquiryFormGroup = this.fb.group({
      enquiryStatus: [enquiryData.enquiryStatus, Validators.compose([Validators.required])],
      internalEnquiryId: [enquiryData.internalEnquiryId.toString(), Validators.compose([Validators.required])]
    });

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
  public getTxnDetails() {
    this.viewTxnsData = true;
    this.viewTxnDataView = false;
    this.renderer.addClass(document.body, 'viewdata-disabled');
    let body = {
      txnOid: this.txnOid
    }
    let GET_TXN_DETAILS = environment.APIEndpoint + "api/rpa/order/v1/get";
    this.https.postJsonMember(GET_TXN_DETAILS, body)
      .subscribe(
        (response) => {
          this.viewTxnsData = false;
          this.viewTxnDataView = true;
          this.renderer.removeClass(document.body, 'viewdata-disabled');
          this.txnDetails = response;
          console.log(this.txnDetails);
          this.memId = response['customerOid'];
          console.log(this.memId);
          this.getFeedbackData();
          this.lineItems = response['lineItems'];
          console.log(this.lineItems);
          this.enquiriesItems = response['enquiries'];
          console.log(this.enquiriesItems);
          if (this.enquiriesItems != null) {
            this.feedbackEnq = true;
            for (let i = 0; i < this.enquiriesItems.length; i++) {
              this.feedbackArray = this.enquiriesItems[i].feedbacks;
              console.log(this.enquiriesItems[i].enquiryStatus);
              this.feedbackData = this.enquiriesItems[i].enquiryStatus;
              this.enqId = this.enquiriesItems[i].enquiryId;
            }
            this.getViewEnquiry(response['transactionId']);
          } else {
            this.feedbackEnq = false;
          }
          // this.feedbacks = this.txnDetails['enquiries'][0]['feedbacks'];
          this.buildnotificationFormGroup();
          // this.getViewEnquiry();
        },
        (error) => {
          console.log(error);
          this.viewTxnsData = false;
          this.viewTxnDataView = true;
          this.renderer.removeClass(document.body, 'viewdata-disabled');
        });

  }
  addResponse(formData) {
    console.log(this.viewEnquiryStatusFormGroup);
    if (this.viewEnquiryStatusFormGroup.invalid === true) {
      this.showError = false;
    } else {
      this.showError = true;
      const ADD_RESPONSE = 'api/rpa/enquiry/v1/create/response';
      const reqBody = {

      };
      console.log(reqBody);
      this.https.postJson(environment.APIEndpoint + ADD_RESPONSE, reqBody).subscribe(
        (response) => {
          console.log(response);
          this.buildFlag = false;
          this.changeValidation('EN')
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

  public createResponse(formData) {
    console.log(formData);
    if (this.createEnquiryResponse.invalid == true) {
      this.showError = true;
    } else {
      let responseList = [];
      for (var i = 0; i < formData.enquiryResponses.length; i++) {
        if (formData.languageOptions == "English") {
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
      } else {
        let request = {
          enquiryId: this.enqId,
          enquiryLocales: responseList,
        }
        let CREATE_RESPONSE = environment.APIEndpoint + "api/rpa/enquiry/v1/create/response";
        this.http.postJson(CREATE_RESPONSE, request)
          .subscribe((response) => {
            this.getTxnDetails();
            this.snackBar.openFromComponent(SnackBarComponent, {
              duration: 10000,
              data: {
                status: "success",
                message: "Enquiry updated successfully"
              }
            });
            window.location.reload();
            // this.buildEnquiryResponseForm();
            // this.createEnquiryResponse.reset();
            // this.router.navigate(['/search-enquiries']);
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
  }
  postVal(ev) {
    ev.checked = !ev.checked;
    if (ev.checked == true) {
      this.matVal = false;
      this.triggeredValue = ev.value;
      this.custArr.push(this.triggeredValue);
      console.log(this.custArr);
    } else {
      this.matVal = true;
    }
  }

  public createResponsePost(formData) {
    console.log(formData);
    console.log(formData);
    if (this.createEnquiryResponsePostOptions.get('postAsOptions').invalid == true) {
      this.matVal = true;
    } else {
      this.matVal = false;
    }
    if (this.createEnquiryResponsePostOptions.invalid == true) {
      this.showError = true;
      this.responseRequired = true;
    } else {
      this.responseRequired = false;
      let responseList = [];
      for (var i = 0; i < formData.enquiryResponses.length; i++) {
        if (formData.languageOptionsPost == "English") {
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
        this.responseRequired = true;
      } else {
        console.log(this.custArr);
        let request = {
          enquiryId: this.enquiryId,
          postTo: this.tabValue,
          postAs: this.custArr,
          enquiryLocales: responseList,
        }
        let CREATE_RESPONSE = environment.APIEndpoint + "api/rpa/enquiry/v1/create/response";
        this.http.postJson(CREATE_RESPONSE, request)
          .subscribe((response) => {
            console.log(response);
            this.getTxnDetails();
            this.snackBar.openFromComponent(SnackBarComponent, {
              duration: 10000,
              data: {
                status: "success",
                message: "Enquiry updated successfully"
              }
            });
            window.location.reload();
            // this.router.navigate(['/search-enquiries']);
          }
            , err => {
              console.log(err);
              
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
  opneTransactionFeedbackDialog() {
    const dialogRef = this.dialog.open(TransactionFeedbackComponent);
    dialogRef.componentInstance.feedbackList = this.feedbackDataValue;
  }
  public removeValidation() {
    this.responseRequired = false;
  }
  getFeedbackData(){
    let reqBody = {
      memberOid: this.memId == null ? Number(this.memberId) :this.memId,
      transactionOid: this.txnOid,
    }
    console.log(reqBody);
    
    let FEEDBACK_DATA = environment.APIEndpoint + 'api/rpa/feedback/v1/getTransactionFeedback';
    this.http.postJson(FEEDBACK_DATA, reqBody)
    .subscribe(
      (response) =>{
        console.log(response);
        this.feedbackDataValue = response;
      },
      (error)=>{
        console.log(error);
      }
    )
  }
  onSelection(ev) {
    console.log(ev);
    let request = {
      enquiryId: this.enquiryId,
      enquiryStatus: ev,
      internalEnquiryId: this.enquiryData.internalEnquiryId,
    }
    let UPDATE_ENQUIRY = environment.APIEndpoint + "api/rpa/enquiry/v1/update";
    this.http.postJson(UPDATE_ENQUIRY, request)
      .subscribe((response) => {
        this.getTxnDetails();
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
  
  goToPreviousPage(Id){
    if(this.memberId != null){
      this.router.navigate(['/transaction-listing']);
    }else{
      if(this.tabName!=null){
        localStorage.setItem('pointTabIndex', 'POINTS');
      }
      localStorage.setItem('memberCustomerId', Id);
      this.router.navigate(['/view-member']);
    }
}

}
