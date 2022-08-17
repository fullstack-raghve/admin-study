import { Component, OnInit , ViewChild} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpService } from 'src/app/services/http-service';
import { MatSnackBar } from '@angular/material';
import { environment } from 'src/environments/environment';
import { SnackBarComponent } from 'src/app/shared/components/snack-bar/snack-bar.component';

import { MatPaginator, MatSort, MatTableDataSource, MatTable } from '@angular/material';

export interface UserData {
  deviceId: number;
  deviceName: string;
  storeName: string;
  status: string;
  lastOnline: string;
  batteryStatus: number;

}



@Component({
  selector: 'app-view-feedback-survey',
  templateUrl: './view-feedback-survey.component.html',
  styleUrls: ['./view-feedback-survey.component.scss']
})
export class ViewFeedbackSurveyComponent implements OnInit {
  public displayedColumns: string[] = ['deviceId', 'deviceName','storeName', 'countryName', 'brandName',  'deviceStatus','lastOnline', 'batteryStatus', 'status', 'verificationCode', 'preview'];

  dataSource: MatTableDataSource<UserData>;
  public breadCrumbData: Array<Object> = [{
    title: 'Home',
    link: ''
  }, {
    title: 'Feedback',
    link: ''
  }];
  @ViewChild(MatSort) sort: MatSort;
  public imgUrl = localStorage.getItem('imgBaseUrl');
  public toggleVal: boolean = true;
  public statusValue: string = 'ONLINE';
  public surveyId;
  public surveyData;
  brands: [];
  countries: [];
  cities: [];
  malls: [];
  public assignedFlow:any = [];
  public notifyUsers:any = [];
  public kiosk:any = [];
  public otherChannels:boolean;
  public ne_ary = [];
  public checked = false;
  public verificationCode;
  public imgUpload = false;
  otherChannelSMS: any;
  otherChannelEMAIL: any;
  otherChannelPUSH: any;
  headerSendEMAIL: any;
  headerSendSMS: any;
  headerSendPUSH: any;
  footerSendEMAIL: any;
  footerSendSMS: any;
  footerSendPUSH: any;
  public attachkiosk: boolean = false;
  public displayNone: boolean = false;
  public otherSMS: boolean = false;
  public otherEMAIL: boolean = false;
  public otherPUSH: boolean = false;

  public headerEmail: boolean = false;
  public headerSMS: boolean = false;
  public headerPUSH: boolean = false;

  public footerEmail: boolean = false;
  public footerSMS: boolean = false;
  public footerPUSH: boolean = false;

  public IssendForApproval: boolean = false;
  public menuIds: any = localStorage.getItem("navigationArray");
  public approvalBtnStatus: string;
  public pageLoader: boolean =false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private http: HttpService,
    public snackBar: MatSnackBar, public router: Router) {
    this.activatedRoute.params.subscribe((params) => {
      this.surveyId = params.id;
    });
  }

  ngOnInit() {
    this.getSurveyById();
    this.getSurveyKiosk();
    this.getSurveyUsers();
    this.getSurveyFlows();
    this.dataSource = new MatTableDataSource();
    this.dataSource.sort = this.sort;
    this.getDataMenu();
  }

  getSurveyKiosk(){
    const GET_SURVEY_KIOSK = environment.APIEndpoint + 'api/rpa/feedback/feedbackSurvey/v1/viewFeedbackSurveyKiosk';
    const request = {
      surveyId: this.surveyId
    };
    this.http.postJson(GET_SURVEY_KIOSK, request)
    .subscribe((response) => {
      console.log(response);
      this.kiosk = response;
      console.log(this.kiosk);
      this.dataSource = new MatTableDataSource(this.kiosk);
      console.log(this.dataSource);
      // this.dataSource.sort = this.sort;
      setTimeout(() => {
        console.log(this.sort) //not undefined
        this.dataSource.sort = this.sort; 
      })
      if (this.kiosk != null && this.kiosk.length > 0) {
        this.attachkiosk = true;
      } else {
        this.attachkiosk = false;
      }
    }
    )
  }
  getSurveyUsers(){
  const GET_SURVEY_USERS = environment.APIEndpoint + 'api/rpa/feedback/feedbackSurvey/v1/viewFeedbackSurveyUsers';
    const request = {
      surveyId: this.surveyId
    };
    this.http.postJson(GET_SURVEY_USERS, request)
    .subscribe((response) => {
      console.log(response);
      this.notifyUsers = response;
      console.log(this.notifyUsers);
      
    }
    )
  }
  getSurveyFlows(){
  const GET_SURVEY_FLOWS = environment.APIEndpoint + 'api/rpa/feedback/feedbackSurvey/v1/viewFeedbackSurveyFlows';
    const request = {
      surveyId: this.surveyId
    };
    this.http.postJson(GET_SURVEY_FLOWS, request)
    .subscribe((response) => {
      console.log(response);
      this.assignedFlow = response;
    }
    )
  }


  getSurveyById() {
    this.pageLoader = true;
    const GET_FEEDBACK_SURVEY = environment.APIEndpoint + 'api/rpa/feedback/feedbackSurvey/v1/view';
    const request = {
      surveyId: this.surveyId
    };
    this.http.postJson(GET_FEEDBACK_SURVEY, request)
      .subscribe((response) => {
        console.log(response);
        this.surveyData = response;
        this.pageLoader = false;
        this.checked = response['status'] === 'ONLINE' ? true : false;
        //    this.verificationCode = response['verificationCode'];
        console.log(this.surveyData);
        this.brands = response['brand'];

        this.countries = response['country'];
        this.cities = response['city'];
        this.malls = response['mall'];
        // this.assignedFlow = response['assignedFlows'];
        console.log(this.assignedFlow);
        

       
       
        // this.ne_ary= this.removedup(this.assignedFlow)
        // this.assignedFlow=[]
        // ne_ary.forEach(function(i) {
        //   this.assignedFlow.push(i)
        // });
        // this.notifyUsers = response['notifyUsers']
        // this.kiosk = response['kiosk'];
        this.otherChannels = response['otherChannel'] == 'YES' ? true : false;
        this.approvalBtnStatus = response['feedbackCampaignApprovalStatus']

        this.otherChannelEMAIL = this.surveyData['otherChannelSendEmail'];
        console.log(this.otherChannelEMAIL);
        console.log(this.surveyData['bodyBackgroundImage']);
        if (this.otherChannelEMAIL == 'YES') {
          this.otherEMAIL = true
        } else {
          this.otherEMAIL = false
        }
        //   this.otherChannelSMS = this.surveyData.otherChannelSendSMS 
        //   if(this.otherChannelSMS == 'YES'){
        //     this.otherSMS =true;
        //   }else{
        //     this.otherSMS = false;
        //   }

        this.otherChannelPUSH = this.surveyData.otherChannelPush
        console.log(this.otherChannelPUSH);

        this.otherPUSH = this.surveyData['otherChannelPush'] == 'YES' ? true : false;
        this.otherSMS = this.surveyData['otherChannelSendSMS'] == 'YES' ? true : false;
        this.otherChannelEMAIL = this.surveyData['otherChannelSendEmail'] == 'YES' ? true : false;

        this.headerEmail = this.surveyData['headerSendEmail'] == 'YES' ? true : false;;
        this.headerSMS = this.surveyData['headerSendSMS'] == 'YES' ? true : false;;
        this.headerPUSH = this.surveyData['headerPush'] == 'YES' ? true : false;;

        this.footerEmail = this.surveyData['footerSendEmail'] == 'YES' ? true : false;;
        this.footerSMS = this.surveyData['footerSendSMS'] == 'YES' ? true : false;;
        this.footerPUSH = this.surveyData['footerPush'] == 'YES' ? true : false;;



        // if(this.otherChannelPUSH == 'YES'){
        //   this.otherPUSH = true;
        // }else{
        //   this.otherPUSH = false;
        // }
        //   this.headerSendEMAIL = this.surveyData.headerSendEmail
        //   if(this.headerSendEMAIL == 'YES'){
        //     this.headerEmail = true;
        //   }else{
        //     this.headerEmail = false;
        //   }
        //   this.headerSendSMS = this.surveyData.headerSendSMS
        //   if(this.headerSendSMS == 'YES'){
        //     this.headerSMS = true;
        //   }else{
        //     this.headerSMS = false;
        //   }
        //   this.headerSendPUSH = this.surveyData.headerPush
        //   if(this.headerSendPUSH == 'YES'){
        //     this.headerPUSH = true;
        //   }else{
        //     this.headerPUSH = false;
        //   }
        //   // "footerSendEmail":"YES",
        //   // "footerSendSMS":"YES",
        //   // "footerPush":"YES",

        //   this.footerSendEMAIL = this.surveyData.footerSendEmail
        //   if(this.footerSendEMAIL == 'YES'){
        //     this.footerEmail = true;
        //   }else{
        //     this.footerEmail = false;
        //   }
        //   this.footerSendSMS = this.surveyData.footerSendSMS
        //   if(this.footerSendEMAIL == 'YES'){
        //     this.footerSMS = true;
        //   }else{
        //     this.footerSMS = false;
        //   }
        //   this.footerSendPUSH = this.surveyData.footerPush
        //   if(this.footerSendEMAIL == 'YES'){
        //     this.footerPUSH = true;
        //   }else{
        //     this.footerPUSH = false;
        //   }
        // this.otherChannelEMAIL = this.surveyData.otherChannelSendEmail;
        // console.log(this.otherChannelEMAIL);
        // this.otherSMS = this.surveyData.otherChannelSendSMS;
        // this.otherPUSH = this.surveyData['otherChannelPush'];



        console.log(this.footerPUSH);

        //     this.surveyData['otherChannelSendEmail'] == 'YES' ? true : false,
        //     this.surveyData['otherChannelSendSMS'] == 'YES' ? true : false,
        //     channel_push: this.surveyData['otherChannelPush'] == 'YES' ? true : false,
        //     header_email: this.surveyData['headerSendEmail'] == 'YES' ? true : false,
        //     header_sms: this.surveyData['headerSendSMS'] == 'YES' ? true : false,
        //     header_push: this.surveyData['headerPush'] == 'YES' ? true : false,
        //     headerText: this.surveyData['headerText'],

        // this.dataSource = new MatTableDataSource(this.surveyData['kiosk']);
        // this.dataSource.sort = this.sort;
        // if (this.surveyData['kiosk'] != null && this.surveyData['kiosk'].length > 0) {
        //   this.attachkiosk = true;
        // } else {
        //   this.attachkiosk = false;
        // }
      }
        , err => {
          this.pageLoader = false;
          this.snackBar.openFromComponent(SnackBarComponent, {
            duration: 1500,
            data: {
              status: 'failure',
              message: 'Your request cannot be saved at this time. Please try again later'
            }
          });
          console.log('error Status = ' + err.status);
        });
  }
//   removedup(obj_Array) {
//   let selectedFlows_4=[]
//   let unique = {};
//   obj_Array.forEach(function(i) {
//     if(!unique[i]) {
//       unique[i] = true;
//       selectedFlows_4.push(i);
//     }
//   });
//   let selectedFlows_3= Object.keys(unique);
//   return selectedFlows_4;
// }
  // edit(){
  //   this.router.navigate(['/edit-feedbacksurvey']);
  // }
  sendForApproval(Val) {
    console.log(Val);
    if (Val == 'SENDFORAPPROVAL'){
      const SEND_FOR_APPROVALS = environment.APIEndpoint + 'api/rpa/feedback/feedbackSurvey/v1/approveFeedbackSurvey';
      let reqBody = {
        "surveyId": this.surveyId
      }
      this.http.postJson(SEND_FOR_APPROVALS, reqBody).subscribe(
        (response) => {
          console.log(response);
          this.snackBar.openFromComponent(SnackBarComponent, {
            duration: 10000,
            data: {
              status: "success",
              message: "Send For Approval successfully"
            }
          });
          this.displayNone = true;
          location.reload();
          // this.router.navigate(['/view-feedbacksurvey/'+ this.surveyId]);
        },
        (error) => {
          console.log(error);
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
    else if (Val == 'APPROVAL'){
      const SEND_FOR_APPROVALS = environment.APIEndpoint + 'api/rpa/feedback/feedbackSurvey/v1/approveFeedbackSurvey';
      let reqBody = {
        "surveyId": this.surveyId
      }
      this.http.postJson(SEND_FOR_APPROVALS, reqBody).subscribe(
        (response) => {
          console.log(response);
          this.snackBar.openFromComponent(SnackBarComponent, {
            duration: 10000,
            data: {
              status: "success",
              message: "Approve successfully"
            }
          });
          this.displayNone = true;
          location.reload();
          // this.router.navigate(['/view-feedbacksurvey/'+ this.surveyId]);
        },
        (error) => {
          console.log(error);
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
  }
  getDataMenu() {
    console.log(this.menuIds.indexOf('10006004'));
    if (this.menuIds.indexOf('10006004') > -1) {
      this.IssendForApproval = true;
    } else {
      this.IssendForApproval = false;
    }
  }
}
