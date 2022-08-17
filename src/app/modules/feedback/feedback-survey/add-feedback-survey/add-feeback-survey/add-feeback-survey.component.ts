import { Component, OnInit, ViewChild, Input, ElementRef } from "@angular/core";
import { MatDialogConfig, MatDialog, MatSnackBar } from "@angular/material";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { HttpService } from "src/app/services/http-service";
import { environment } from "src/environments/environment";
import { SnackBarComponent } from "src/app/shared/components/snack-bar/snack-bar.component";
import { Router } from "@angular/router";
import { UploadFile } from 'src/app/services/uploadFile.service';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { KioskSelectedUserComponent } from "../../../../feedback/kiosk/kiosk-selected-user/kiosk-selected-user.component";
import { SelectKioskDialogComponent } from "../../../select-kiosk-dialog/select-kiosk-dialog.component";
import { SelectedFeedbacksurveyflowComponent } from "../../../../feedback/feedback-survey/selected-feedbacksurveyflow/selected-feedbacksurveyflow.component";
import { ConfirmDialogComponent } from "../../../feedback-survey/confirm-dialog/confirm-dialog.component";
import { SelectAutocompleteComponent } from 'mat-select-autocomplete';

@Component({
  selector: 'app-add-feeback-survey',
  templateUrl: './add-feeback-survey.component.html',
  styleUrls: ['./add-feeback-survey.component.scss']
})
export class AddFeebackSurveyComponent implements OnInit {
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
  public displayedColumns: string[] = ['deviceId', 'deviceName', 'location', 'countryName', 'brandName', 'connections', 'lastOnline', 'batteryPercentage', 'status', 'code', 'preview'];

  // @ViewChild("createfeedbackSurveyForm") createfeedbackSurveyForm;
  @ViewChild('uploadImgEl') uploadImgElRef: ElementRef;
  @ViewChild('uploadImgElBodyRef') uploadImgElBodyRef: ElementRef;
  @ViewChild('uploadImgElFooterRef') uploadImgElFooterRef: ElementRef;
  @ViewChild('countryInput') countryInput: SelectAutocompleteComponent;
  @ViewChild('cityInput') cityInput: SelectAutocompleteComponent;
  @ViewChild('brandInput') brandInput: SelectAutocompleteComponent;
  @ViewChild('mallInput') mallInput: SelectAutocompleteComponent;
  @ViewChild(MatSort) sort: MatSort;

  public imgBaseUrl = localStorage.getItem("imgBaseUrl");
  public feedbacksurveyFormgroup: FormGroup;
  public toggleVal = true;
  public statusValue = "ONLINE";
  public headercolor;
  public footercolor;
  public bgcolor;
  public otherChannels = 'YES';
  public cities: any = [];
  public countries: any = [];
  removable = true;
  public brandId = "";
  countryId = "";
  stores;
  brands;
  users;
  selectable = true;
  public flowCount = 1000;
  languages;
  selectedUser = [];
  selectedUserId = [];
  selectedCount: number;
  storeErrorMsg: string;
  loading: boolean;
  showError: boolean = false;
  checked: boolean = false;
  showSelectedUser: boolean = false;
  public otherChannelSelection: boolean = false;
  noRecords: boolean = false;
  countryOid;
  cityOid;
  showSelectedFlow: boolean = false;
  public selectedFlows = [];
  public paginationData;
  public resultsLength = 0;
  public flows;
  bgColor: any;
  disabledCountry: boolean = true;
  disabledCity: boolean = true;
  disabledMall: boolean = true;
  mallList: any = [];
  public dataSource;
  @Input('brandOid') brandOid: number = 0;
  @Input('isDisabled') isDisabled: boolean = false;
  public storeList: any = [];
  public imageUploading: boolean = false;
  public showImageError: boolean = false;
  public kioskBrandLogoPath: any = '';
  public bodyIamge: any = '';
  public footerIamge: any = '';
  public includeExclude = 'Include';
  public exclude = false;
  public storeRequired: boolean = false;
  public selectedKiosk: any = [];
  public selectedKioskCount;
  public errorValue: boolean = false;
  countrylist: any;
  brand: any;
  brandMall: any;
  cityListMall: any;
 
  selectedKioskval: any = [];
  public isOverriddeKiosk:any = '';
  public validationArrDetails: any = [];
  public validatedKioskIds: any = [];
  public validatedFlowIds: any = [];
  public kioskErrorMsg: boolean =false;

  brandList: any = [];
  countryList: any = [];
  cityList: any = [];

  selectedCityOptions: any[];
  selectedBrandOptions: any[];
  selectedMallOptions: any[];
  brandIds: any;

  countrylistMall = [];
  brandMallList = [];
  cityMallList = [];
  mallListall = [];
  public cityName:any;
  public kioskBrand:any;
  public pageLoader: boolean = false;

  constructor(
    private dialog: MatDialog,
    private fb: FormBuilder,
    private http: HttpService,
    public snackBar: MatSnackBar,
    private router: Router,
    private uploadFile: UploadFile,
    private https: HttpService
  ) {
    // this.buildFeedbackSurveyForm();
  }

  ngOnInit() {
    this.buildFeedbackSurveyForm();
    this.otherChannelData();
    this.getAllCountries();
    this.dataSource = new MatTableDataSource();
    this.dataSource.sort = this.sort;
    this.getFlows(this.flowCount, "", "");

  }

  otherChannelData() {
    if (this.otherChannels == 'YES') {
      // this.checked = false;
      this.includeExclude = 'Include';
      let v = this.feedbacksurveyFormgroup.get('ruleType');
      v.setValue(false);
      v.updateValueAndValidity();
      this.storeRequired = false;
      this.otherChannels = 'YES';
      console.log(this.otherChannels);
    } else {
      // this.checked = true;
      this.includeExclude = 'Exclude';
      this.feedbacksurveyFormgroup.get('ruleType').setValue(true);
      this.storeRequired = false;
      this.otherChannels = 'NO';
      console.log(this.otherChannels);
    }
  }
  public toggleStatus(event) {
    if (event.checked === true) {
      this.statusValue = "ONLINE";
    } else {
      this.statusValue = "OFFLINE";
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
 

  getUsersList(storeId) {
    this.http
      .getJson(
        environment.APIEndpoint + "api/rpa/store/v1/getStoreUsers/" + storeId
      )
      .subscribe(
        res => {
          console.log(res);
          console.log(res);
          this.users = res;
        },
        err => {
          console.log(err);
        }
      );
  }

  buildFeedbackSurveyForm() {
    let form = {
      surveyName: ['', Validators.compose([Validators.required, Validators.maxLength(100)])],
      brandOid: ["", Validators.required],
      countryOid: ["", Validators.required],
      cityOid: ["", Validators.required],
      mallOid: ["", Validators.required],
      // kioskCountry: ['', Validators.required],
      // cityName: ['', Validators.required],
      // kioskBrand: ['', Validators.required],
      // mallOid: ['', Validators.required],
      // feedbackFlow: ["", Validators.required],
      channel_email: false,
      channel_sms: false,
      channel_push: false,
      headerBackgroundColor: [""],
      headerText: ['', Validators.compose([Validators.maxLength(100)])],
      header_email: false,
      header_sms: false,
      header_push: false,
      bodybackgroundColor: [""],
      footerbackgroundColor: [""], 
      footerText: ['', Validators.compose([Validators.maxLength(100)])],
      footer_email: false,
      footer_sms: false,
      footer_push: false,

      ruleType: false,
      videoUrl: ['']
    }
    this.feedbacksurveyFormgroup = this.fb.group(form);
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


  //mallOid = this.feedbacksurveyFormgroup.controls['mallOid'].value;

  createfeedbacksurvey(formData) {
    this.pageLoader = true;
    if(this.selectedKioskValue.length == 0){
      this.dataSource = '';
    }
    if(this.selectedKioskValue.length == 0 && this.otherChannels == 'NO'){
      this.kioskErrorMsg = true;
    }else {
      this.kioskErrorMsg = false;
    }
    console.log(formData)
    console.log(this.isOverriddeKiosk);
    if (this.feedbacksurveyFormgroup.invalid) {
      this.showSelectedUser = true;
      this.showSelectedFlow = true;
    }
    // if (this.feedbacksurveyFormgroup.invalid === true && this.showSelectedFlow == true
    //   && this.showSelectedUser === true) {
    if (this.feedbacksurveyFormgroup.invalid || this.selectedUser.length==0 ||
      this.selectedFlows.length == 0 || this.kioskErrorMsg) {
      this.pageLoader = false;
      this.showError = false;
      this.showSelectedUser = true;
      this.showSelectedFlow = true;
      console.log(this.selectedFlows)
    } else {
      console.log(this.selectedFlows);
      console.log(this.selectedKioskval);
      this.showError = true;
      this.showSelectedUser = false;
      this.showSelectedFlow = false;
      const requestBody = {
        surveyId: 0,
        surveyName: formData.surveyName,
        // countryOid: formData.kioskCountry,
        // storeId: formData.kioskStore,
        // brandOid: formData.kioskBrand,
        // cityOid: formData.cityName,
        // mallOid: formData.mall,
        countryOid: formData.countryOid ? formData.countryOid : [],
        brandOid: formData.brandOid ? formData.brandOid : [],
        cityOid: formData.cityOid ? formData.cityOid : [],
        mallOid: formData.mallOid ? formData.mallOid : [],
        otherChannel: this.otherChannels,
        headerImage: this.kioskBrandLogoPath,
        headerBackgroundColor: formData.headerBackgroundColor,
        headerText: formData.headerText,
        //  headerImage:  ,
        bodyBackgroundColor: formData.bodybackgroundColor,

        // bodyBackgroundImage
        footerBackgroundColor: formData.footerbackgroundColor,
        checkKioskInSurveykStatus: this.isOverriddeKiosk == undefined || this.isOverriddeKiosk == '' ? 'NO' : this.isOverriddeKiosk,
        checkFlowInKioskStatus: this.isOverriddeKiosk == undefined || this.isOverriddeKiosk == '' ? 'NO' : this.isOverriddeKiosk,
        footerText: formData.footerText,
        bodyBackgroundImage: this.bodyIamge,
        footerImage: this.footerIamge,
        assignedFlowOid: formData.feedbackFlow,
        notifyUsers: this.selectedUserId,
        status: this.statusValue,
        kiosks: this.selectedKioskValue,
        // otherChannel:formData
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
      };
      console.log(requestBody);
      const CREATE_FEEDBACK_SURVEY =
        environment.APIEndpoint + "api/rpa/feedback/feedbackSurvey/v1/create";
      this.http.postJson(CREATE_FEEDBACK_SURVEY, requestBody).subscribe(
        response => {
          console.log(response);
          this.pageLoader = false;
          this.snackBar.openFromComponent(SnackBarComponent, {
            duration: 10000,
            data: {
              status: "success",
              message: "Feedback Survey has been Created successfully"
            }
          });
          this.loading = false;
          this.router.navigate(["/search-feedbacksurvey"]);
        },
        err => {
          this.pageLoader = false;
          this.loading = false;
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
            console.log(err)
            // dialogRef.componentInstance.UserList = this.selectedUserId;
            // console.log(this.selectedUserId);
            // this.snackBar.openFromComponent(SnackBarComponent, {
            //   duration: 1000,
            //   data: {
            //     status: "failure",
            //     message:
            //       "Kiosk Already Exist for the survey Do you want to override"
            //   }
            // });
            this.pageLoader = false;
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
                  this.createfeedbacksurvey(formData);
                }
                else if (result.buttonName === 'NO'){
                  this.isOverriddeKiosk = 'NO';
                  // this.selectedFlows = [];
                  for(var i=0; i<this.validationArrDetails.length; i++){
                    if(this.validationArrDetails[i].type == 'kiosk'){
                      this.validatedKioskIds.push(this.validationArrDetails[i].id);
                      console.log(this.validatedKioskIds);
                    }
                  }
                  for(var i=0; i<this.validationArrDetails.length; i++){
                    if(this.validationArrDetails[i].type == 'flow'){
                      this.validatedFlowIds.push(this.validationArrDetails[i].id);
                      console.log(this.validatedFlowIds);
                    }
                  }
                  if(this.validatedKioskIds.length>0 || this.validatedFlowIds.length>0){
                    for(var i=0; i< this.validatedFlowIds.length; i++){
                      for(var j=0; j < this.selectedFlows.length; j++){
                        console.log(this.validatedFlowIds[i]);
                        console.log(this.selectedFlows[j].flowOid);
                        
                        if(this.validatedFlowIds[i] == this.selectedFlows[j].flowOid){
                          this.selectedFlows.splice(j, 1);
                        }
                      }
                    }
                    for(var i=0; i<this.validatedKioskIds.length; i++){
                      for(var j=0; j<this.selectedKioskValue.length; j++){
                        if(this.validatedKioskIds[i] == this.selectedKioskValue[j]){
                          this.selectedKioskValue.splice(j, 1);
                        }
                      }
                    }
                    this.createfeedbacksurvey(formData);
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


  // image upload

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
    if (event.checked == false) {
      this.includeExclude = 'Include';
      this.feedbacksurveyFormgroup.get('ruleType').setValue(false);
      this.storeRequired = false;
      this.otherChannels = 'YES';
      console.log(this.otherChannels);
      if (this.otherChannels == 'YES' && this.selectedFlowsId.length == 0) {
        this.otherChannelSelection = false;
      }
      if (this.otherChannels == 'YES' && this.selectedFlowsId.length > 0) {
        this.otherChannelSelection = true;
      }
      else if (this.otherChannels == 'NO' && this.selectedFlowsId.length == 0) {
        this.otherChannelSelection = false;
      }
    } else {
      this.includeExclude = 'Exclude';
      this.feedbacksurveyFormgroup.get('ruleType').setValue(true);
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

  selectedFlowsId = [];
  selectedFlowsCount;
  selectFlowMessage;
  allassignedFlows = [];
  selectedFlow(brandId, countryId) {

    // this.feedbacksurveyFormgroup.controls['brandOid'].value, 
    // this.feedbacksurveyFormgroup.controls['countryOid'].value
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
        console.log(this.otherChannels);

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
    console.log(userdId, valueIndex);

    this.selectedFlowsId.splice(valueIndex, 1);
    const index = this.selectedFlows.indexOf(userdId);
    this.selectedFlows.splice(index, 1);
    console.log(this.selectedFlowsId);
    if (this.otherChannels == 'YES' && this.selectedFlowsId.length == 0) {
      this.otherChannelSelection = false;
    }
    if (this.otherChannels == 'YES' && this.selectedFlowsId.length > 0) {
      this.otherChannelSelection = true;
    }
    else {
      this.otherChannelSelection = false;
    }
  }

  public selectedKioskValue: any = [];
  public selectedKioskValueCount;
  public checkKioskInSurveykStatus;
  selectKiosk() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      countryOid: this.feedbacksurveyFormgroup.controls['countryOid'].value,
      cityOid: this.feedbacksurveyFormgroup.controls['cityOid'].value,
      brandOid: this.feedbacksurveyFormgroup.controls['brandOid'].value,
      mallOid: this.feedbacksurveyFormgroup.controls['mallOid'].value
    }
    console.log(dialogConfig.data);
    // this.selection.selected=null
    const dialogRef = this.dialog.open(SelectKioskDialogComponent, dialogConfig);
    // dialogRef.componentInstance.addnotificationCoupon = this.activityValue;
    dialogRef.componentInstance.UserList = this.selectedKioskValue;

    console.log(this.selectedKioskValue);
    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      if (result.buttonName === 'YES') {
        console.log('Yes');
        this.checkKioskInSurveykStatus = result.buttonName;
        // this.createfeedbacksurvey(result.buttonName);
      }
      else if (result.buttonName === 'NO') {
        console.log('No');
        this.checkKioskInSurveykStatus = result.buttonName;
        // this.createfeedbacksurvey(result.buttonName);
      }
      if (result.buttonName === 'SELECT') {
        this.selectedKioskValue = [];
        this.selectedKioskValueCount = result.tableData.length;
        // console.log(result["tableData"]);
        // this.dataSource = new MatTableDataSource(result["tableData"]);
        // console.log(this.dataSource);

        if (this.selectedKioskValueCount != 0) {
          this.noRecords = false;
          this.errorValue = false;
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
          this.noRecords = true;
          this.kioskErrorMsg = true;
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
        this.dataSource.sort = this.sort;
        // console.table(this.dataSource);
      }
    });
  }


  getAllCountries() {
    const GET_ALL_COUNTRIES = 'api/rpa/store/v1/get/storeRegions';
    this.https.getJson(environment.APIEndpoint + GET_ALL_COUNTRIES).subscribe(res => {
      console.log(res);
      res.forEach(res => {
        this.countryList.push({
          'countryId': res.countryId,
          'countryCode': res.countryCode,
          'languageDirection': res.languageDirection,
          'countryName': res.countryName,
          'value': res.countryId,
          'currencyCode': res.currencyCode

        });
      });
      console.log(this.countryList);
    }, err => {
      console.log(err);
    });
  }

  getAllCities(countryId):any {
    console.log(countryId);
    this.cityInput.selectAllChecked = false;
    this.brandInput.selectAllChecked = false;
    this.mallInput.selectAllChecked = false;
    this.selectedCityOptions = [];
    this.selectedBrandOptions = [];
    this.selectedMallOptions = [];

    if (countryId != '' && countryId != null && countryId != undefined) {
      this.disabledCity = false;
      let GET_ALL_CITIES = environment.APIEndpoint + "api/rpa/master/city/v1/get/storeCities";
      this.https.getJson(GET_ALL_CITIES + '?countryIds=' + countryId)
        .subscribe((response) => {
          console.log(response);
          this.cities = response;
          response.forEach(response => {
            this.cityList.push({
              // cityId: response.cityId,
              // cityCode: response.cityCode,
              // languageDirection: response.languageDirection,
              // cityName: response.cityName,
              // status: response.status,
              // value: response.cityId,
              "cityCode": response.cityCode,
              "cityId": response.cityId,
              "cityName": response.cityName,
              "currencyCode": response.currencyCode,
              "languageDirection": response.languageDirection,
              "value": response.cityId
            });
            // this.getAllMallsCity(countryId, response.cityId);
            console.log(this.cityList);
            this.cityList = this.cities;
            var uniqueArray = this.removeDuplicatesJSON(this.cityList, 'cityId');
            console.log(uniqueArray);
            this.cityList = uniqueArray;
          }
          )
        })
    } else {
      this.cityList = [];
      this.brandValueList = [];
      this.mallList = [];
      this.storeList = [];
    }
  }

  getAllBrands(countryId) {
    this.selectedBrandOptions = [];
    this.selectedMallOptions = [];
    this.brandInput.selectAllChecked = false;
    this.mallInput.selectAllChecked = false;
    console.log(countryId);

    this.countryIdval = countryId;
    if (countryId != '' && countryId != null && countryId != undefined) {
      this.disabledCity = false;
      let GET_ALL_ONLINE_BRANDS = environment.APIEndpoint + "api/rpa/master/brand/v1/getBrandByRegionByCountryId" + '?countryOid=' + countryId;
      this.https.getJson(GET_ALL_ONLINE_BRANDS)
        .subscribe((response) => {
          // if (countryId.length != 0) {
            console.log(response);
            this.brands = response;
            response.forEach(response => {
              this.brandValueList.push({
                brandId: response.brandId,
                brandCode: response.brandCode,
                languageDirection: response.languageDirection,
                brandName: response.brandName,
                status: response.status,
                brandType: response.brandType,
                value: response.brandId,
              });
              this.brandValueList = this.brands;
              var uniqueArray = this.removeDuplicatesJSON(this.brandValueList, 'brandId');
              console.log(uniqueArray);
              this.brandValueList = uniqueArray;
            });
            console.log(this.brandValueList);
          // }
          // else {
          //   this.brandValueList = [];
          // }
        },
          (error) => {
            console.log(error);
          });
    } else {
      // this.disabledCity = true;
      // this.cityList = [];
      this.brandValueList = [];
    }
  }

  getAllMallsCity(ev, cityId) {
    console.log(ev);
    console.log(cityId);
  }



  public countryIdval;
  public brandValueList;



  GetBrandOnCountry() {
    let GET_ALL_ONLINE_BRANDS = environment.APIEndpoint + "api/rpa/master/brand/v1/get/regionBrands";
    this.https.getJson(GET_ALL_ONLINE_BRANDS)
      .subscribe((response) => {
        // console.log(response);
        this.brandList = response;
        console.log(this.brandList['brandName']);
        console.log(this.brandList['brandId']);
      },
        (error) => {
          console.log(error);
        });
  }
  getStoreValue(ev) {
    console.log(ev);
  }

  getAllMalls(event, countryId, cityId) {
    this.selectedMallOptions = [];
    this.mallInput.selectAllChecked = false;
    
    console.log(event);
    console.log(countryId);
    // console.log(brandId);
    console.log(cityId);
    this.brandIds = event;
    

    if (countryId != '' && countryId != null && countryId != undefined && this.brandIds != '' && this.brandIds != null && this.brandIds != undefined && cityId != '' && cityId != null && cityId != undefined) {
      this.disabledCity = false;
    } else {
      this.disabledCity = true;
    }

    this.countrylistMall = this.feedbacksurveyFormgroup.controls['countryOid'].value;
    countryId = [];
    countryId.push(this.countrylistMall);
    this.brandMallList = this.feedbacksurveyFormgroup.controls['brandOid'].value;
    console.log(this.brandMallList);

    // brandId = [];
    // brandId.push(this.brandMallList);

    this.cityMallList = this.feedbacksurveyFormgroup.controls['cityOid'].value;
    cityId = [];
    cityId.push(this.cityMallList);
    //   console.log("brands" + brandId);


    // console.log(cityId, countryId, brandId);
    // this.cityListMall = this.feedbacksurveyFormgroup.controls['cityOid'].value;
    // cityId = [];
    // cityId.push(this.cityListMall)
    if (this.brandIds != '' && countryId != '' && cityId != ''
    ) {
      //    console.log(cityId);
      let GET_ALL_MALLS = environment.APIEndpoint + "api/rpa/store/v1/get/mallList"
      this.https
        .getJson(GET_ALL_MALLS + "?brandOids=" + this.brandIds + '&countryOids=' + countryId + "&cityOids=" + cityId)
        .subscribe(response => {
          console.log(response);
          this.mallListall = response;
          console.log(this.mallList)
          response.forEach(res => {
            this.mallList.push({
              "mallCode": res.mallCode,
              "mallId": res.mallId,
              "mallName": res.mallName,
              // "currencyCode": res.currencyCode,
              "languageDirection": res.languageDirection,
              "value": res.mallId
            });

          });

          this.mallList = this.mallListall;
          var uniqueArray = this.removeDuplicatesJSON(this.mallList, 'mallId');
          console.log(uniqueArray);
          this.mallList = uniqueArray;

          // console.log(this.mallList)
          // this.mallList = this.mallListall;
          // var uniqueArray = this.removeDuplicatesJSON(this.allBrandCountryCityMallList, 'mallId');
          // console.log(uniqueArray);

          // // this.allBrandCountryCityMallList = uniqueArray;
          // console.log(this.allBrandCountryCityMallList);
          // //    console.log('push all data', this.allBrandCountryCityMallList)
        });
    }
    else {
      // this.brandValueList = [];
      this.mallList = [];
    }
  }
}