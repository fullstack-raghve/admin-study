import { Component, OnInit, ViewChild, Input, ElementRef } from "@angular/core";
import { MatDialogConfig, MatDialog, MatSnackBar } from "@angular/material";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { HttpService } from "src/app/services/http-service";
import { environment } from "src/environments/environment";
import { SnackBarComponent } from "src/app/shared/components/snack-bar/snack-bar.component";
import { UploadFile } from 'src/app/services/uploadFile.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { KioskSelectedUserComponent } from "../../../../feedback/kiosk/kiosk-selected-user/kiosk-selected-user.component";
import { SelectKioskDialogComponent } from "../../../select-kiosk-dialog/select-kiosk-dialog.component";
import { SelectedFeedbacksurveyflowComponent } from "../../../../feedback/feedback-survey/selected-feedbacksurveyflow/selected-feedbacksurveyflow.component";
import { BehaviorSubject } from 'rxjs';
import { ConfirmDialogComponent } from "../../../feedback-survey/confirm-dialog/confirm-dialog.component"

@Component({
  selector: 'app-edit-feedback-survey',
  templateUrl: './edit-feedback-survey.component.html',
  styleUrls: ['./edit-feedback-survey.component.scss']
})
export class EditFeedbackSurveyComponent implements OnInit {
  public breadCrumbData: Array<Object> = [
    {
      title: "Home",
      link: ""
    },
    {
      title: "Feedback",
      link: ""
    }
  ];
  public displayedColumns: string[] = ['deviceId', 'deviceName', 'storeName', 'countryName', 'brandName', 'deviceStatus', 'lastOnline', 'batteryPercentage', 'status', 'verificationCode', 'preview'];

  @ViewChild('uploadImgEl') uploadImgElRef: ElementRef;
  @ViewChild('uploadImgElBodyRef') uploadImgElBodyRef: ElementRef;
  @ViewChild('uploadImgElFooterRef') uploadImgElFooterRef: ElementRef;
  @ViewChild(MatSort) sort: MatSort;
  public imgBaseUrl = localStorage.getItem("imgBaseUrl");
  public editFeedbacksurveyFormgroup: FormGroup;
  public toggleVal = true;
  public statusValue = "ONLINE";
  public headercolor;
  public footercolor;
  public bgcolor;

  public cities: any = [];
  public countries: any = [];
  removable = true;
  // public brandId = "";
  brandId: any = [];
  countryId = "";
  stores;
  public brandList = [];
  brands;
  users;
  selectable = true;
  public flowCount = 1000;
  languages;
  selectedUser = [];
  selectedUserId = [];
  selectedDeviceId = [];
  selectedCount: number;
  storeErrorMsg: string;
  loading: boolean;
  showError: boolean = false;
  showSelectedUser: boolean = false;
  showSelectedFlow: boolean = false;
  public selectedFlows = [];
  public paginationData;
  public resultsLength = 0;
  selectedKioskval: any = [];
  public flows;
  bgColor: any;
  disabledCountry: boolean = true;
  disabledCity: boolean = true;
  disabledMall: boolean = true;
  public includeExclude = 'Include';
  mallList: any = [];
  public urlParam;
  public dataSource;
  @Input('brandOid') brandOid: number = 0;
  @Input('isDisabled') isDisabled: boolean = false;
  public storeList: any = [];
  public imageUploading: boolean = false;
  public showImageError: boolean = false;
  public kioskBrandLogoPath: any = '';
  public bodyIamge: any = '';
  public footerIamge: any = '';
  // public includeExclude;
  public exclude = false;
  public storeRequired: boolean = false;
  public selectedKiosk: any = [];
  public selectedKioskCount;
  public errorValue: boolean = false;
  countrylist: any;
  cityList: any;
  brand: any;
  brandMall: any;
  countrylistMall: any;
  cityListMall: any;
  brandMallList: any;
  allBrandCountryCityMallList = [];
  allBrandCountryCityList = [];
  selectedFlowsId = [];
  selectedFlowsCount;
  selectFlowMessage;
  allassignedFlows = [];
  public buildFlag: boolean = false;
  public surveyId;
  public surveyData;
  public otherChannels;
  noRecords: boolean = false;
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
  public otherSMS: boolean = false;
  public otherEMAIL: boolean = false;
  public otherPUSH: boolean = false;

  public headerEmail: boolean = false;
  public headerSMS: boolean = false;
  public headerPUSH: boolean = false;

  public footerEmail: boolean = false;
  public footerSMS: boolean = false;
  public footerPUSH: boolean = false;
  public otherChannelValue: boolean = false;
  public kioskValue: boolean = false;
  public otherChannelSelection: boolean = false;
  public validationArrDetails: any = [];
  public validatedKioskIds: any = [];
  public validatedFlowIds: any = [];
  public otherChannelDisable: boolean = false;

  malls: [];
  assignedFlow: any = [];
  notifyUsers: any = [];
  kiosk: any = [];
  allBrandCountryList = [];
  arrayObj = [];
  public isOverriddeKiosk: string = '';
  public kioskErrorMsg: boolean = false;
  brandIds: any;
  mallListValues: any;
  public pageLoader: boolean = false;

  constructor(
    private dialog: MatDialog,
    private fb: FormBuilder,
    private http: HttpService,
    public snackBar: MatSnackBar,
    private router: Router,
    private uploadFile: UploadFile,
    private https: HttpService,
    private activatedRoute: ActivatedRoute,
  ) {
    this.activatedRoute.params.subscribe((params) => {
      this.surveyId = params.id;
    });
  }

  ngOnInit() {
    this.getSurveyKiosk();
    this.getSurveyUsers();
    this.getSurveyFlows();
    this.getViewFeebackSurvey();
    this.getParams();
    this.getAllCountries();
    this.dataSource = new MatTableDataSource();
    this.dataSource.sort = this.sort;
    this.getFlows(this.flowCount, "", "");
  }
  getParams() {
    this.surveyId = this.activatedRoute.snapshot.paramMap.get('id');
    this.urlParam = this.activatedRoute.snapshot.paramMap.get('parameter')
    console.log(this.surveyId);
    console.log(this.urlParam)
  }
  getSurveyKiosk() {
    const GET_SURVEY_KIOSK = environment.APIEndpoint + 'api/rpa/feedback/feedbackSurvey/v1/viewFeedbackSurveyKiosk';
    const request = {
      surveyId: this.surveyId
    };
    this.http.postJson(GET_SURVEY_KIOSK, request)
      .subscribe((response) => {
        console.log(response);
        this.kiosk = response;
        console.log(this.kiosk);
        if (this.kiosk != null) {
          for (const kiosk of this.kiosk) {
            if (kiosk.deviceId != null) {
              this.selectedKioskValue.push(kiosk.deviceId);
              // this.selectedKioskValue.push(kiosk);
            }
          }
        }
        this.dataSource = new MatTableDataSource(this.kiosk);
        // this.dataSource.sort = this.sort;
        setTimeout(() => {
          console.log(this.sort)
          this.dataSource.sort = this.sort; 
        })
      }
      )
  }
  getSurveyUsers() {
    const GET_SURVEY_USERS = environment.APIEndpoint + 'api/rpa/feedback/feedbackSurvey/v1/viewFeedbackSurveyUsers';
    const request = {
      surveyId: this.surveyId
    };
    this.http.postJson(GET_SURVEY_USERS, request)
      .subscribe((response) => {
        console.log(response);
        this.notifyUsers = response;
        for (const user of this.notifyUsers) {
          this.selectedUserId.push(user.userId);
          this.selectedUser.push(user);
        }
        console.log(this.notifyUsers);

      }
      )
  }
  getSurveyFlows() {
    const GET_SURVEY_FLOWS = environment.APIEndpoint + 'api/rpa/feedback/feedbackSurvey/v1/viewFeedbackSurveyFlows';
    const request = {
      surveyId: this.surveyId
    };
    this.http.postJson(GET_SURVEY_FLOWS, request)
      .subscribe((response) => {
        console.log(response);
        this.assignedFlow = response;
        for (const user of this.assignedFlow) {
          this.selectedFlows.push(user);
          this.selectedFlowsId.push(user.flowOid);
          this.arrayObj.push(user.flowOid);
          console.log(user.flowOid);

        }
      }
      )
  }
  getViewFeebackSurvey() {
    const GET_FEEDBACK_SURVEY = environment.APIEndpoint + 'api/rpa/feedback/feedbackSurvey/v1/view';
    const request = {
      surveyId: this.surveyId
    };
    this.http.postJson(GET_FEEDBACK_SURVEY, request)
      .subscribe((response) => {
        console.log(response);
        this.surveyData = response;
        console.log(this.surveyData);
        this.buildeditFeedbackSurveyForm(this.surveyData);
        this.checked = response['status'] === 'ONLINE' ? true : false;
        this.toggleVal = response['status'] === 'ONLINE' ? true : false;
        console.log(this.surveyData);
        this.brands = response['brand'];
        this.countryId = this.surveyData['countryOid'];
        console.log(this.countryId);
        if (this.countryId != '') {
          // this.brandId = this.surveyData['brandOid'];
          // console.log(this.brandId);
          this.brandIds = this.surveyData['brandOid'];
          console.log(this.brandIds);
          this.getAllBrands(this.countryId);
        }
        if (this.countryId != '') {
          // alert('get ALl cities')
          this.cityList = this.surveyData['cityOid'];
          console.log(this.cityList);
          this.getAllCities(this.countryId);
        }
        if (this.brandId != '' && this.countryId != '') {
          // alert('get ALl malls')
          this.mallList = this.surveyData['mallOid'];
          this.getAllMalls(this.brandId, this.countryId, this.cityList);
        }
        // this.dataSource = new MatTableDataSource(this.surveyData['kiosk']);
        // console.log(this.dataSource);
        // for (const user of this.surveyData['notifyUsers']) {
        //   this.selectedUserId.push(user.userId);
        //   this.selectedUser.push(user);
        // }
        // if (this.surveyData['kiosk']!=null){
        // for (const kiosk of this.surveyData['kiosk']) {
        //   if (kiosk.deviceId != null) {
        //     this.selectedKioskValue.push(kiosk.deviceId);
        //     // this.selectedKioskValue.push(kiosk);
        //   }
        // }
        // }
        // console.log(response["assignedFlows"].length);
        // if (this.surveyData['otherChannel'] == 'YES' && response["assignedFlows"].length == 1) {
        //   this.otherChannelSelection = true;
        // }
        if (this.surveyData['otherChannel'] == 'YES' && this.kiosk.length == 0) {
          this.otherChannelSelection = false;
        }
        if (this.surveyData['otherChannel'] == 'YES' && this.kiosk.length > 0) {
          this.otherChannelSelection = true;
        }
        else if (this.surveyData['otherChannel'] == 'NO' && this.kiosk.length == 0) {
          this.otherChannelSelection = false;
        }
        else {
          this.otherChannelSelection = false;
        }
        // for (const user of response["assignedFlows"]) {
        //   this.selectedFlows.push(user);
        //   this.selectedFlowsId.push(user.flowOid);
        //   this.arrayObj.push(user.flowOid);
        //   console.log(user.flowOid);

        // }


        console.log(this.surveyData['otherChannel']);
        console.log(this.checked);
        if (this.surveyData['otherChannel'] == 'YES') {
          this.otherChannelValue = true;
          console.log(this.otherChannelValue);
          this.kioskValue = false;
          this.checked = false;
          this.includeExclude = 'Include';
          let v = this.editFeedbacksurveyFormgroup.get('ruleType');
          v.setValue(false);
          v.updateValueAndValidity();
          this.storeRequired = false;
          this.otherChannels = 'YES';
          console.log(this.otherChannels);
        } else {
          this.checked = true;
          this.otherChannelValue = false;
          this.kioskValue = true;
          this.includeExclude = 'Exclude';
          this.editFeedbacksurveyFormgroup.get('ruleType').setValue(true);
          this.storeRequired = false;
          this.otherChannels = 'NO';
          console.log(this.otherChannels);
        }
        console.log(this.surveyData['footerBackgroundColor']);
        this.footercolor = this.surveyData['footerBackgroundColor'];
        this.bgcolor = this.surveyData['bodyBackgroundColor'];
        this.headercolor = this.surveyData['headerBackgroundColor'];
        this.kioskBrandLogoPath = this.surveyData['headerImage'];
        this.bodyIamge = this.surveyData['bodyBackgroundImage'];
        this.footerIamge = this.surveyData['footerImage'];
        if (this.surveyId) {
          this.editFeedbacksurveyFormgroup.patchValue({
            brandOid: this.brandIds,
            countryOid: this.countryId,
            cityOid: this.cityList,
            mallOid: this.mallList,
            ruleType: this.surveyData['otherChannel'] == 'YES' ? false : true,
            channel_email: this.surveyData['otherChannelSendEmail'] == 'YES' ? true : false,
            channel_sms: this.surveyData['otherChannelSendSMS'] == 'YES' ? true : false,
            channel_push: this.surveyData['otherChannelPush'] == 'YES' ? true : false,
            header_email: this.surveyData['headerSendEmail'] == 'YES' ? true : false,
            header_sms: this.surveyData['headerSendSMS'] == 'YES' ? true : false,
            header_push: this.surveyData['headerPush'] == 'YES' ? true : false,
            headerText: this.surveyData['headerText'],
            headerBackgroundColor: this.surveyData['headerBackgroundColor'],
            footer_email: this.surveyData['footerSendEmail'] == 'YES' ? true : false,
            footer_sms: this.surveyData['footerSendSMS'] == 'YES' ? true : false,
            footer_push: this.surveyData['footerPush'] == 'YES' ? true : false,
            footerText: this.surveyData['footerText'],
            footerbackgroundColor: this.surveyData['footerBackgroundColor'],
            bodyBackgroundColor: this.surveyData['bodyBackgroundColor']
          });
        }
      }
        , err => {
          this.snackBar.openFromComponent(SnackBarComponent, {
            duration: 1500,
            data: {
              status: 'failure',
              message: 'Your request cannot be saved at this time. Please try again later'
            }
          });
          console.log('error Status = ' + err.status);
        });

    console.log(this.checked);
  }

  public buildeditFeedbackSurveyForm(editFeedbackSurvey) {
    console.log(editFeedbackSurvey);
    if (editFeedbackSurvey.feedbackSurveyId == undefined) {
      let form = {
        surveyName: ['', Validators.compose([Validators.required, Validators.maxLength(150)])],
        brandOid: ["", Validators.required],
        countryOid: ["", Validators.required],
        cityOid: ["", Validators.required],
        mallOid: ["", Validators.required],
        // feedbackFlow: ["", Validators.required],
        channel_email: false,
        channel_sms: false,
        channel_push: false,
        headerBackgroundColor: [""],
        headerText: ['', Validators.compose([Validators.maxLength(200)])],
        header_email: false,
        header_sms: false,
        header_push: false,
        bodybackgroundColor: [""],
        footerbackgroundColor: [""],
        footerText: ['', Validators.compose([Validators.maxLength(200)])],
        footer_email: false,
        footer_sms: false,
        footer_push: false,

        ruleType: true,
        videoUrl: ['']
      }
      this.editFeedbacksurveyFormgroup = this.fb.group(form);
    }
    else {
      this.buildFlag = true;

      console.log(editFeedbackSurvey['brand']);
      // this.surveyData['brandOid']
      this.brandId = editFeedbackSurvey['brandOid'];

      console.log(this.brandId);
      this.statusValue = editFeedbackSurvey.status;
      this.editFeedbacksurveyFormgroup = this.fb.group({
        surveyName: [editFeedbackSurvey.surveyName, Validators.compose([Validators.required, Validators.maxLength(100)])],
        brandOid: ["", Validators.required],
        countryOid: ["", Validators.required],
        cityOid: ["", Validators.required],
        mallOid: ["", Validators.required],
        // feedbackFlow: ["", Validators.required],
        channel_email: '',
        channel_sms: '',
        channel_push: '',
        headerBackgroundColor: [""],
        headerText: ['', Validators.compose([Validators.maxLength(100)])],
        header_email: '',
        header_sms: '',
        header_push: '',
        bodybackgroundColor: [""],
        footerbackgroundColor: [""],
        footerText: ['', Validators.compose([Validators.maxLength(100)])],
        footer_email: '',
        footer_sms: '',
        footer_push: '',
        ruleType: true,
        videoUrl: ['']
      })
      this.editFeedbacksurveyFormgroup.updateValueAndValidity();
    }
  }

 
  getAllCountries() {
    const GET_ALL_COUNTRIES = 'api/rpa/store/v1/get/storeRegions';
    this.https.getJson(environment.APIEndpoint + GET_ALL_COUNTRIES)
      .subscribe(response => {
        console.log(response);
        this.countries = response;
        response.forEach(res => {
          this.countries.push({
            "countryCode": res.countryCode,
            "countryId": res.countryId,
            "countryName": res.countryName,
            "currencyCode": res.currencyCode,
            "languageDirection": res.languageDirection,
            "value": res.countryId
          });
        });
        this.allBrandCountryList = this.countries;
        var uniqueArray = this.removeDuplicatesJSON(this.allBrandCountryList, 'countryId');
        this.allBrandCountryList = uniqueArray;
      });
    // console.log(this.editFeedbacksurveyFormgroup.controls['countryOid'].value);
  }

  getAllBrands(countryId) {
    console.log(countryId);
    // this.countryIdval = countryId;
    if (countryId != '' && countryId != null && countryId != undefined) {
      this.disabledCity = false;
      let GET_ALL_ONLINE_BRANDS = environment.APIEndpoint + "api/rpa/master/brand/v1/getBrandByRegionByCountryId" + '?countryOid=' + countryId;
      this.https.getJson(GET_ALL_ONLINE_BRANDS)
        .subscribe((response) => {
          // if (countryId.length != 0) {
          console.log(response);
          this.brands = response;
          response.forEach(response => {
            this.brandList.push({
              brandId: response.brandId,
              brandCode: response.brandCode,
              languageDirection: response.languageDirection,
              brandName: response.brandName,
              status: response.status,
              brandType: response.brandType,
              value: response.brandId,
            });
            this.brandList = this.brands;
            var uniqueArray = this.removeDuplicatesJSON(this.brandList, 'brandId');
            console.log(uniqueArray);
            this.brandList = uniqueArray;
          });
          console.log(this.brandList);
          // }
          // else {
          //   this.brandList = [];
          // }
        },
          (error) => {
            console.log(error);
          });
    } else {
      // this.disabledCity = true;
      // this.cityList = [];
      this.brandList = [];
    }
  }

  getAllCities(countryId) {
    console.log(countryId);
    if (countryId != '' && countryId != null && countryId != undefined) {
      let GET_ALL_CITIES = environment.APIEndpoint + "api/rpa/master/city/v1/get/storeCities";
      this.https.getJson(GET_ALL_CITIES + '?countryIds=' + countryId)
        .subscribe(response => {
          console.log(response);
          this.cities = response;
          response.forEach(res => {
            this.cities.push({
              "cityCode": res.cityCode,
              "cityId": res.cityId,
              "cityName": res.cityName,
              "currencyCode": res.currencyCode,
              "languageDirection": res.languageDirection,
              "value": res.cityId
            });

          });
          this.allBrandCountryCityList = this.cities;
          var uniqueArray = this.removeDuplicatesJSON(this.allBrandCountryCityList, 'cityId');
          this.allBrandCountryCityList = uniqueArray;
        });
    }
    else {
      this.allBrandCountryCityList = [];
    }
  }

  getAllMalls(brandId, countryId, cityId) {
    console.log(cityId)

    // if (this.editFeedbacksurveyFormgroup.controls['brandOid'].value == '') {
    //   this.brand = this.surveyData['brandOid'];
    //   brandId = [];
    //   brandId.push(this.brand);
    //   console.log(this.brand);
    //   console.log(this.editFeedbacksurveyFormgroup.controls['brandOid'].value);
    // }

    // else {
    //   this.brand = this.editFeedbacksurveyFormgroup.controls['brandOid'].value;
    //   brandId = [];
    //   brandId.push(this.brand);
    // }

    if (this.editFeedbacksurveyFormgroup.controls['countryOid'].value == '') {
      this.countrylist = this.surveyData['countryOid'];
      countryId = [];
      countryId.push(this.countrylist);
    }

    else {
      this.countrylist = this.editFeedbacksurveyFormgroup.controls['countryOid'].value;
      countryId = [];
      countryId.push(this.countrylist);
    }


    if (this.editFeedbacksurveyFormgroup.controls['cityOid'].value == '') {
      this.cityListMall = this.surveyData['cityOid'];
      cityId = [];
      cityId.push(this.cityListMall);
    }

    else {
      this.cityListMall = this.editFeedbacksurveyFormgroup.controls['cityOid'].value;
      cityId = [];
      cityId.push(this.cityListMall);
    }

    // this.brandMallList = this.editFeedbacksurveyFormgroup.controls['brandOid'].value;
    // brandId = [];
    // brandId.push(this.brandMallList);

    //   console.log("brands" + brandId);

    // this.countrylistMall = this.editFeedbacksurveyFormgroup.controls['countryOid'].value;
    // countryId = [];
    // countryId.push(this.countrylistMall);

    // this.cityListMall = this.editFeedbacksurveyFormgroup.controls['cityOid'].value;
    // cityId = [];
    // cityId.push(this.cityListMall);


    if (brandId != '' && countryId != '' && cityId != ''
    ) {
      let GET_ALL_MALLS = environment.APIEndpoint + "api/rpa/store/v1/get/mallList"
      this.http
        .getJson(GET_ALL_MALLS + "?brandOids=" + brandId + '&countryOids=' + countryId + "&cityOids=" + cityId)
        .subscribe(response => {
          console.log(response);
          this.mallListValues = response;
          // response.forEach(res => {
          //   this.mallList.push({
          //     "mallCode": res.mallCode,
          //     "mallId": res.mallId,
          //     "mallName": res.mallName,
          //     "currencyCode": res.currencyCode,
          //     "languageDirection": res.languageDirection,
          //     "value": res.mallId
          //   });

          // });
          this.allBrandCountryCityMallList = this.mallList;
          console.log(this.allBrandCountryCityMallList);
          // var uniqueArray = this.removeDuplicatesJSON(this.allBrandCountryCityMallList, 'cityId');
          // this.allBrandCountryCityMallList = uniqueArray;
        });
    }
    else {
      this.mallListValues = [];
      this.allBrandCountryCityMallList = [];
    }
  }
  getUsersList(storeId) {
    this.http
      .getJson(environment.APIEndpoint + "api/rpa/store/v1/getStoreUsers/" + storeId)
      .subscribe(
        res => {
          console.log(res);
          this.users = res;
        },
        err => {
          console.log(err);
        }
      );
  }
  removeuser(userdId) {
    this.selectedUserId;
    const index = this.selectedUser.indexOf(userdId);
    const removedUserId = userdId.userId;
    const removedUserIdIndex = this.selectedUserId.indexOf(removedUserId);
    if (index > -1) {
      this.selectedUser.splice(index, 1);
      if (removedUserIdIndex > -1) {
        this.selectedUserId.splice(removedUserIdIndex, 1);
      }
    }
  }
  public uploadImage(event: FileList) {
    this.imageUploading = true;
    console.log("event[0].size" + event[0].size)
    if (event[0].size < 1000000) {
      this.uploadFile.upload(event.item(0), 'feedback', 'images')
        .subscribe((response) => {
          console.log(response);
          this.kioskBrandLogoPath = response['message'];
          this.imageUploading = false;
          this.showImageError = false;
          this.uploadImgElRef.nativeElement.value = ''
          this.snackBar.openFromComponent(SnackBarComponent, {
            duration: 1500,
            data: {
              status: "success",
              message: "Image successfully uploaded"
            }
          });
        }, err => {

          console.log("error Status = " + err);
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
                message: "Internal server error"
              }
            });
          }

        }
        );
    } else {
      this.imageUploading = false;
      this.snackBar.openFromComponent(SnackBarComponent, {
        duration: 10000,
        data: {
          status: "failure",
          message: "Max upload file size is 1Mb"
        }
      });
    }
  }
  public uploadBodyImage(event: FileList) {
    this.imageUploading = true;
    console.log("event[0].size" + event[0].size)
    if (event[0].size < 1000000) {
      this.uploadFile.upload(event.item(0), 'feedback', 'images')
        .subscribe((response) => {
          console.log(response);
          this.bodyIamge = response['message'];
          this.imageUploading = false;
          this.showImageError = false;
          this.uploadImgElBodyRef.nativeElement.value = ''

          this.snackBar.openFromComponent(SnackBarComponent, {
            duration: 1500,
            data: {
              status: "success",
              message: "Image successfully uploaded"
            }
          });
        }, err => {
          console.log("error Status = " + err);
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
                message: "Internal server error"
              }
            });
          }
        }
        );
    } else {
      this.imageUploading = false;
      this.snackBar.openFromComponent(SnackBarComponent, {
        duration: 10000,
        data: {
          status: "failure",
          message: "Max upload file size is 1Mb"
        }
      });
    }
  }
  public uploadFooterImage(event: FileList) {
    this.imageUploading = true;
    console.log("event[0].size" + event[0].size)
    if (event[0].size < 1000000) {
      this.uploadFile.upload(event.item(0), 'feedback', 'images')
        .subscribe((response) => {
          console.log(response);
          this.footerIamge = response['message'];
          this.imageUploading = false;
          this.showImageError = false;
          this.uploadImgElFooterRef.nativeElement.value = ''
          this.snackBar.openFromComponent(SnackBarComponent, {
            duration: 1500,
            data: {
              status: "success",
              message: "Image successfully uploaded"
            }
          });
        }, err => {
          console.log("error Status = " + err);
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
                message: "Internal server error"
              }
            });
          }
        }
        );
    } else {
      this.imageUploading = false;
      this.snackBar.openFromComponent(SnackBarComponent, {
        duration: 10000,
        data: {
          status: "failure",
          message: "Max upload file size is 1Mb"
        }
      });
    }
  }
  public removeImage() {
    this.kioskBrandLogoPath = "";
  }
  public removeBodyImage() {
    this.bodyIamge = "";
  }
  public removeFooterImage() {
    this.footerIamge = "";
  }

  public toggleIncludeExclude(event) {
    console.log(event);
    if (event.checked == false) {
      this.includeExclude = 'Include';
      this.editFeedbacksurveyFormgroup.get('ruleType').setValue(false);
      this.storeRequired = false;
      this.otherChannels = 'YES';
      console.log(this.otherChannels);
      // if (this.otherChannels == 'YES' || this.selectedFlowsId.length > 0) {
      //   this.otherChannelSelection = true;
      // }
      if (this.otherChannels == 'YES' && this.selectedFlowsId.length == 0) {
        this.otherChannelSelection = false;
      }
      if (this.otherChannels == 'YES' && this.selectedFlowsId.length > 0) {
        this.otherChannelSelection = true;
      }
      else if (this.otherChannels == 'NO' && this.selectedFlowsId.length == 0) {
        this.otherChannelSelection = false;
      }
      // this.otherChannelSelection = true;
    } else {
      this.includeExclude = 'Exclude';
      this.editFeedbacksurveyFormgroup.get('ruleType').setValue(true);
      this.storeRequired = false;
      this.otherChannels = 'NO';
      console.log(this.otherChannels);
      this.otherChannelSelection = false;
    }
  }

  selectedUsers() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = false;
    const dialogRef = this.dialog.open(
      KioskSelectedUserComponent,
      dialogConfig
    );
    dialogRef.componentInstance.UserList = this.selectedUserId;
    console.log(this.selectedUserId);
    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      var getSelectedFlow = result.tableData.slice(-1)[0];
      console.log(getSelectedFlow);
      this.selectedUser = [];
      this.selectedUserId = [];
      if (result.buttonName === "SELECT") {
        this.selectedUser = [];
        this.selectedUserId = [];
        this.selectedCount = result.tableData.length;
        if (this.selectedCount !== 0) {
          for (let i = 0; i < result.tableData.length; i++) {
            const userId = result.tableData[i].userId;
            this.selectedUserId.push(userId);
            this.selectedUser.push(result.tableData[i]);
          }
        } else {
          this.storeErrorMsg = "Please select User";
          console.log(this.storeErrorMsg);
        }
      }
    });
  }
  removeDuplicatesJSON(originalArray, prop) {
    var newArray = [];
    var lookupObject = {};
    for (var i in originalArray) {
      lookupObject[originalArray[i][prop]] = originalArray[i];
    }
    for (i in lookupObject) {
      newArray.push(lookupObject[i]);
    }
    return newArray;
  }
  selectedFlow(brandId, countryId) {

    console.log(brandId, countryId);


    this.editFeedbacksurveyFormgroup.controls['brandOid'].value,
      this.editFeedbacksurveyFormgroup.controls['countryOid'].value
    console.log(brandId, countryId);
    console.log(this.selectedFlows)
    let sendData = {
      brandId: brandId,
      countryId: countryId,
      selectedFlow: this.selectedFlows
    };
    let dialogConfig = new MatDialogConfig();
    dialogConfig = {
      autoFocus: false,
      maxHeight: "100vh",
      data: sendData,
      maxWidth: "100%",
    };
    const dialogRef = this.dialog.open(
      SelectedFeedbacksurveyflowComponent,
      dialogConfig
    );
    // dialogRef.componentInstance.flowList = this.selectedFlowsId;

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      if (result.buttonName != "CANCEL") {
        if (this.otherChannels == 'YES') {
          this.otherChannelSelection = true;
        }
        else if (this.otherChannels == 'NO') {
          this.otherChannelSelection = false;
        }
        this.selectedFlows.push(result);
        this.selectedFlowsId.push(result.flowOid);
        console.log(this.selectedFlows)
        var removeDuplicate = this.removeDuplicatesJSON(this.selectedFlows, 'flowOid');
        this.selectedFlows = removeDuplicate;
      } else {
        this.selectFlowMessage = "Please select Flows";
      }
    });
  }

  removeFlow(userdId, valueIndex) {
    this.selectedFlowsId.splice(valueIndex, 1);
    const index = this.selectedFlows.indexOf(userdId);
    this.selectedFlows.splice(index, 1);
    console.log(this.selectedFlowsId);
    console.log(this.selectedFlowsId);
    // if (this.otherChannels == 'YES' && this.selectedFlowsId.length == 0) {
    //   this.otherChannelSelection = true;
    // }
    if (this.otherChannels == 'YES' && this.selectedFlowsId.length == 0) {
      this.otherChannelSelection = false;
    }
    if (this.otherChannels == 'YES' && this.selectedFlowsId.length > 0) {
      this.otherChannelSelection = true;
    }
    else if (this.otherChannels == 'NO' && this.selectedFlowsId.length == 0) {
      this.otherChannelSelection = false;
    }
  }
  getFlows(flowCount, brandId, countryId) {
    const data = {
      page:
        this.paginationData !== undefined ? this.paginationData.pageIndex : "0",
      pageSize: flowCount !== 10 ? flowCount : "10",
      order: {
        column: "modifiedTime",
        dir: "asc"
      },
      keySearch: "",
      fieldSearch: [
        {
          fieldName: "kioskType",
          fieldValue: "YES"
        },
        {
          fieldName: "countryOid",
          fieldValue: countryId
        },
        {
          fieldName: "brandOid",
          fieldValue: brandId
        }
      ]
    };
    this.https
      .postJson(
        environment.APIEndpoint + "api/rpa/feedback/flow/v1/search",
        data
      )
      .subscribe(
        res => {
          this.flows = res["items"];
          console.log(this.flows);
        },
        err => {
          console.log(err);
        }
      );
  }
  public toggleStatus(event) {
    if (event.checked === true) {
      this.statusValue = "ONLINE";
    } else {
      this.statusValue = "OFFLINE";
    }
  }



  public selectedKioskValue: any = [];
  public selectedKioskValueCount;

  selectKiosk() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      countryOid: this.editFeedbacksurveyFormgroup.controls['countryOid'].value,
      cityOid: this.editFeedbacksurveyFormgroup.controls['cityOid'].value,
      brandOid: this.editFeedbacksurveyFormgroup.controls['brandOid'].value,
      mallOid: this.editFeedbacksurveyFormgroup.controls['mallOid'].value
    }
    console.log(dialogConfig.data);
    const dialogRef = this.dialog.open(SelectKioskDialogComponent, dialogConfig);
    // dialogRef.componentInstance.addnotificationCoupon = this.activityValue;
    dialogRef.componentInstance.UserList = this.selectedKioskValue;
    console.log(this.selectedKioskValue);
    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      if (result.buttonName === 'SELECT') {
        this.selectedKioskValue = [];
        this.selectedKioskValueCount = result.tableData.length;
        console.log(result["tableData"]);
        this.dataSource = new MatTableDataSource(result["tableData"]);
        this.dataSource.sort = this.sort;
        console.log(this.dataSource);

        if (this.selectedKioskValueCount != 0) {
          this.errorValue = false;
          this.noRecords = true;
          this.kioskErrorMsg = false;
          // this.selectedCouponData = true;
          for (let i = 0; i < result.tableData.length; i++) {
            let deviceId = result.tableData[i].deviceId;
            this.selectedKioskValue.push(deviceId);
            const arrrayTemp = this.selectedKioskValue;
            this.selectedKioskValue = Array.from(new Set(arrrayTemp));
            console.log(this.selectedKioskValue.length);
            console.log(this.selectedKioskValue);
          }
        } else {
          // this.selectedCouponData = false;
          this.noRecords = false;
        }
        const NewSelectedData = [];
        const Added_data = [];
        for (let index1 = 0; index1 < (this.selectedKioskValue).length; index1++) {
          for (let index = 0; index < (result["tableData"]).length; index++) {
            const Get_main_ID = this.selectedKioskValue[index1];
            if ((((result["tableData"])[index]).deviceId) == Get_main_ID) {
              if (Added_data.includes(Get_main_ID) == false) {
                Added_data.push(Get_main_ID)
                NewSelectedData.push((result["tableData"])[index]);

              }

            }
            // const Get_sub_ID=(result["tableData"])[index];
          }
        }



        this.dataSource = new MatTableDataSource(NewSelectedData);
        // console.table(this.dataSource);
      }

    });
  }






  select1Kiosk() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = false;
    const dialogRef = this.dialog.open(
      SelectKioskDialogComponent,
      dialogConfig
    );
    dialogRef.componentInstance.UserList = this.selectedKiosk;
    console.log(this.selectedKiosk);
    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      if (result.buttonName === 'SELECT') {
        this.selectedKiosk = [];
        this.selectedKioskCount = result.tableData.length;
        this.dataSource = new MatTableDataSource(result["tableData"]);
        console.log(this.dataSource);
        if (this.selectedKioskCount != 0) {
          this.errorValue = false;
          this.selectedKioskCount = true;
          for (let i = 0; i < result.tableData.length; i++) {
            let deviceId = result.tableData[i].deviceId;
            this.selectedKioskCount.push(deviceId);
            const arrrayTemp = this.selectedKiosk;
            this.selectedKiosk = Array.from(new Set(arrrayTemp));
            console.log(this.selectedKiosk.length);
            console.log(this.selectedKiosk);
          }

        } else {
          this.selectedKioskCount = false;

        }

        const NewSelectedData = [];
        const Added_data = [];

        for (let index1 = 0; index1 < (this.selectedKiosk).length; index1++) {
          for (let index = 0; index < (result["tableData"]).length; index++) {
            const Get_main_ID = this.selectedKiosk[index1];

            if ((((result["tableData"])[index]).couponId) == Get_main_ID) {
              if (Added_data.includes(Get_main_ID) == false) {
                Added_data.push(Get_main_ID)
                NewSelectedData.push((result["tableData"])[index]);

              }

            }
            // const Get_sub_ID=(result["tableData"])[index];
          }

        }



        this.dataSource = new MatTableDataSource(NewSelectedData);
        console.table(this.dataSource);
      }
    });
  }
  updatefeedbacksurvey(formData) {
    this.pageLoader = true;
    if (this.selectedKioskValue.length == 0) {
      this.dataSource = '';
    }
    console.log(formData);
    console.log(this.selectedKioskValue)
    if (this.selectedKioskValue.length == 0 && this.otherChannels == 'NO') {
      this.kioskErrorMsg = true;
    } else {
      this.kioskErrorMsg = false;
    }
    if (this.editFeedbacksurveyFormgroup.invalid || this.selectedUser.length == 0 ||
      this.selectedFlows.length == 0 || this.kioskErrorMsg) {
      this.pageLoader = false;
      this.showError = true;
      this.showSelectedUser = true;
      this.showSelectedFlow = true;
    }
    else {
      console.log(this.selectedKioskValue);
      this.showError = false;
      this.showSelectedUser = false;
      this.showSelectedFlow = false;
      const editFeedbackSurvey = {
        surveyName: formData.surveyName,
        surveyId: this.surveyId,
        countryOid: formData.countryOid ? formData.countryOid : [],
        brandOid: formData.brandOid ? formData.brandOid : [],
        cityOid: formData.cityOid ? formData.cityOid : [],
        mallOid: formData.mallOid ? formData.mallOid : [],
        otherChannel: this.otherChannels,
        headerImage: this.kioskBrandLogoPath,
        headerBackgroundColor: formData.headerBackgroundColor,
        headerText: formData.headerText,

        bodyBackgroundColor: formData.bodybackgroundColor,

        footerBackgroundColor: formData.footerbackgroundColor,
        footerText: formData.footerText,
        bodyBackgroundImage: this.bodyIamge,
        footerImage: this.footerIamge,
        assignedFlowOid: formData.feedbackFlow,
        notifyUsers: this.selectedUserId,
        status: this.statusValue,
        kiosks: this.selectedKioskValue,

        selectFlows: this.selectedFlows,
        otherChannelSendEmail: formData.channel_email === true ? 'YES' : 'NO',
        otherChannelSendSMS: formData.channel_sms === true ? 'YES' : 'NO',
        otherChannelPush: formData.channel_push === true ? 'YES' : 'NO',
        headerSendEmail: formData.header_email === true ? 'YES' : 'NO',
        headerSendSMS: formData.header_sms === true ? 'YES' : 'NO',
        headerPush: formData.header_push === true ? 'YES' : 'NO',
        footerSendEmail: formData.footer_email === true ? 'YES' : 'NO',
        footerSendSMS: formData.footer_sms === true ? 'YES' : 'NO',
        footerPush: formData.footer_push === true ? 'YES' : 'NO',
        checkKioskInSurveykStatus: this.isOverriddeKiosk == undefined || this.isOverriddeKiosk == '' ? 'NO' : this.isOverriddeKiosk,
        // checkFlowInKioskStatus: 'NO'
      };
      let EDIT_FEEDBACK_SURVEY = environment.APIEndpoint + "api/rpa/feedback/feedbackSurvey/v1/update";
      this.http.postJson(EDIT_FEEDBACK_SURVEY, editFeedbackSurvey).subscribe(
        response => {
          console.log(response);
          this.pageLoader = false;
          this.snackBar.openFromComponent(SnackBarComponent, {
            duration: 10000,
            data: {
              status: "success",
              message: "Feedback Survey has been Updated successfully"
            }
          });
          this.loading = false;
          this.router.navigate(["/search-feedbacksurvey"]);
        },
        err => {
          this.loading = false;
          this.pageLoader = false;
          console.log("error Status = " + err.error);
          this.validationArrDetails = err.error;
          console.log(this.validationArrDetails);
          if (err.error.errorType === "VALIDATION") {
            this.snackBar.openFromComponent(SnackBarComponent, {
              duration: 10000,
              data: {
                status: "failure",
                message: err.error.errorDetails[0].description
              }
            });
          } else {
            this.pageLoader = false;
            console.log(err)
            // dialogRef.componentInstance.UserList = this.selectedUserId;

            let dialogConfig = new MatDialogConfig();
            dialogConfig = {
              autoFocus: false,
              data: this.validationArrDetails,
            };
            dialogConfig.autoFocus = false;
            const dialogRef = this.dialog.open(ConfirmDialogComponent, dialogConfig
            );
            dialogRef.afterClosed().subscribe(
              (result) => {
                console.log(result);

                if (result.buttonName === 'YES') {
                  this.isOverriddeKiosk = 'YES';
                  this.updatefeedbacksurvey(formData);
                }
                else if (result.buttonName === 'NO') {
                  this.isOverriddeKiosk = 'NO';
                  // this.selectedFlows = [];
                  for (var i = 0; i < this.validationArrDetails.length; i++) {
                    if (this.validationArrDetails[i].type == 'kiosk') {
                      this.validatedKioskIds.push(this.validationArrDetails[i].id);
                      console.log(this.validatedKioskIds);
                    }
                  }
                  for (var i = 0; i < this.validationArrDetails.length; i++) {
                    if (this.validationArrDetails[i].type == 'flow') {
                      this.validatedFlowIds.push(this.validationArrDetails[i].id);
                      console.log(this.validatedFlowIds);
                    }
                  }
                  if (this.validatedKioskIds.length > 0 || this.validatedFlowIds.length > 0) {
                    for (var i = 0; i < this.validatedFlowIds.length; i++) {
                      for (var j = 0; j < this.selectedFlows.length; j++) {
                        console.log(this.validatedFlowIds[i]);
                        console.log(this.selectedFlows[j].flowOid);

                        if (this.validatedFlowIds[i] == this.selectedFlows[j].flowOid) {
                          this.selectedFlows.splice(j, 1);
                        }
                      }
                    }
                    for (var i = 0; i < this.validatedKioskIds.length; i++) {
                      for (var j = 0; j < this.selectedKioskValue.length; j++) {
                        if (this.validatedKioskIds[i] == this.selectedKioskValue[j]) {
                          this.selectedKioskValue.splice(j, 1);
                        }
                      }
                    }
                    this.updatefeedbacksurvey(formData);
                  }
                  // this.removeFlow(userdId, valueIndex) {
                  //   console.log(userdId, valueIndex);
                  //   this.selectedFlows 
                  //   this.selectedFlowsId.splice(valueIndex, 1);
                  //   const index = this.selectedFlows.indexOf(userdId);
                  //   this.selectedFlows.splice(index, 1);
                  //   console.log(this.selectedFlowsId);
                  //   if (this.otherChannels == 'YES' && this.selectedFlowsId.length == 0) {
                  //     this.otherChannelSelection = false;
                  //   } else {
                  //     this.otherChannelSelection = true;
                  //   }
                  // }
                  // this.selectedFlows
                  // this.createfeedbacksurvey(formData, this.isOverriddeKiosk);
                }
              }
            )
          }
        }
      );
    }
  }
  paginationDetail = new BehaviorSubject(
    {
      length: 10,
      pageIndex: 0,
      pageSize: 10
    });
  getUpdate(event) {
    this.paginationDetail.next(event);
    this.paginationData = event;
    // this.searchVal();
  }

}
