import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormControl, Validators, FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { MatSnackBar,MatDatepicker } from '@angular/material';
import { HttpService } from 'src/app/services/http-service';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { UploadFile } from 'src/app/services/uploadFile.service';
import { uploadBonusFile } from 'src/app/services/uploadBonus.service';
import { SnackBarComponent } from 'src/app/shared/components/snack-bar/snack-bar.component';
import * as moment from 'moment';
import {MatDatepickerInputEvent} from '@angular/material/datepicker';

@Component({
  selector: 'app-create-file-upload',
  templateUrl: './create-file-upload.component.html',
  styleUrls: ['./create-file-upload.component.scss']
})
export class CreateFileUploadComponent implements OnInit {
  public breadCrumbData: Array<Object> = [{
    title: 'Home',
    link: ''
  },
  {
    title: 'Configurations',
    link: ''
  },
  {
    title: 'File Upload',
    link: ''
  },
  ];
  @ViewChild("fileUploadForm") fileUploadForm;
  public reciprociUploadFile: File;
  fileUploadFormGroup: FormGroup;
  checked: string;
  fileUploadValue: string;
  public manualFileName = '';
  public submitForm = true;
  public manualFilePath: any = [];
  private files: File[];
  public manualFileRequired = false;
  public validCouponCode = false;
  public validCouponRequired = false;
  public diableDate = false;
  public diableDay = false;
  public manualErrorFileName = '';
  public manualErrorFile = '';
  public skuRequired = false;
  public errorMes:boolean = false;
  public eventTimeScheduled:boolean = false;
  @ViewChild('uploadFile') uploadManualXLSFile: ElementRef;
  @ViewChild('uploadFile') uploadManualTXTFile: ElementRef;
  @ViewChild('uploadSku') uploadSkuRef: ElementRef;

  public skuFilePath = '';
  public skuFileName = '';
  public skuErrorFile = '';
  public skuErrorFileName = '';
  public validSkuFile = true;
  fileNameVal: any;
  // stopScrollfalse:boolean = false;
  public minDate = new Date();
  commonErrormes;
  events: string[] = [];
  scheduledTimeValue;
  loadingResponse: boolean = false;
  fileUploadLength: number;
  // fileUploadLength: any;
  public programList = [];
  productRegionCtrl: string | Blob;
  programOid: string | Blob;
  public regionProgram:boolean = true;
  regionVal: any;

  constructor(private fb: FormBuilder, private http: HttpService,
    private router: Router, public uploadBonusFile: uploadBonusFile, public snackBar: MatSnackBar,
    private uploadFiles: UploadFile, private https: HttpService, ) {

  }
  fileTypes = [
    // {
    //   fileId: 'StoreFlatFile',
    //   fileName: 'Store Flat File'
    // },
    // {
    //   fileId: 'StoreStaffFlatFile',
    //   fileName: 'Store Staff FlatFile'
    // },
    {
      fileId: 'Bonus',
      fileName: 'Bonus'
    },
  ];
  hours = [
    {
      hourId: 1,
      hourvalue: 1
    },
    {
      hourId: 2,
      hourvalue: 4
    },
  ];
  minutes = [
    {
      minuteId: 1,
      minutevalue: 1
    },
    {
      minuteId: 2,
      minutevalue: 4
    },
  ];
  fileuploadOptionVals = [
    {
      value: 'Manual Upload',
      label: 'MANUAL FILE UPLOAD',
      checked: true
    },
    // {
    //   value: 'scheduled Upload',
    //   label: 'SCHEDULED FILE UPLOAD',
    //   checked: false
    // },
  ];
  teamOptionsVal = [
    // {
    //   value: 'CAPoints',
    //   label: 'Member File',
    //   checked: true
    // },
    {
      value: 'CAPoints',
      label: 'Member / Non-member File',
      checked: true
    },
  ];
  processScheduledoptions = [
    {
      value: 'Immediate',
      label: 'Process Immediate',
      checked: true
    },
    // {
    //   value: 'Other',
    //   label: 'Upload to FTP (Scheduled)',
    //   checked: false
    // },
  ];
  manualList: boolean = true;
  scheduledList: boolean = false;
  ngOnInit() {
    this.getProgramsList();
    this.buildCreateFileUploadForm();
  }
  public buildCreateFileUploadForm() {
    let form = {
      fileuploadOptions: ['Manual Upload', Validators.required],
      accrualRuleName: ['', Validators.required],
      accrualDescription: ["", Validators.compose([Validators.required])],
      // fileUploadformat: ['', Validators.required],
      teamOptions: ['CAPoints', Validators.required],
      processScheduledCtrl: ['Immediate', Validators.required],
      // fileUploadTitle: ['', Validators.required],
      daysVal: ['',],
      expiryDate: ['',],
      eventTimeScheduledCtrl: ['',],
      fileUploadType: ['', Validators.required],
      productRegionCtrl: [''],
      programOid: [''],
      // hoursVal: ['', Validators.required],
      // fileUploadDescription: ["", Validators.compose([Validators.required])],
    }
    this.fileUploadFormGroup = this.fb.group(form);
  }

  fileChange(event: FileList) {
    this.fileUploadLength = event.length;
    if (event.length!=0){
      this.errorMes = false;
    }
    else{
      this.errorMes = true;
    }
    this.reciprociUploadFile = event.item(0);
  }
  openCalendarev(picker: MatDatepicker<Date>,ev){
    // this.stopScrollfalse = true;
    picker.open(); 
  }
  openCalendar(picker: MatDatepicker<Date>,eve) { 
    // this.stopScrollfalse = true;
    picker.open(); 
  }
  addEvent(type: string, event: MatDatepickerInputEvent<Date>) {
    this.events.push(`${type}: ${event.value}`);
    if (event.value == null){
      this.diableDay = false;
    }else{
      this.diableDay = true;
    }
  }
  createFileUpload(formData) {
    if(formData.fileUploadType == 'Bonus'){
      if (this.fileUploadLength!=0 && this.fileUploadLength != undefined){
        this.errorMes= false
      }
      else{
        this.errorMes= true;
      }
    }
    if (this.fileNameVal == 'Bonus') {
      if (this.fileUploadFormGroup.invalid == true || this.errorMes == true){
        // this.loadingResponse = true;
        return;
      }
      this.productRegionCtrl = formData.productRegionCtrl == null || formData.productRegionCtrl == undefined ? '' : formData.productRegionCtrl;
      this.programOid = formData.programOid == null || formData.programOid == undefined ? '' : formData.programOid;
      let date1 = formData.expiryDate == '' ? null : moment(formData.expiryDate).format('DD/MM/YYYY');
      const fileUploadFormData: FormData = new FormData();

      this.scheduledTimeValue = this.fileUploadFormGroup.get('eventTimeScheduledCtrl').value == '' ? '' : moment(this.fileUploadFormGroup.get('eventTimeScheduledCtrl').value).format('hh:mm A');

      if(this.eventTimeScheduled){
        fileUploadFormData.append("scheduledTime", this.scheduledTimeValue);
      }

      fileUploadFormData.append("fileName", this.reciprociUploadFile, this.reciprociUploadFile.name);
      fileUploadFormData.append("accrualRuleName", formData.accrualRuleName);
      fileUploadFormData.append("accrualDescription", formData.accrualDescription);
      fileUploadFormData.append("pointsType", formData.teamOptions);
      fileUploadFormData.append("pointsExpiryDays", formData.daysVal);
      fileUploadFormData.append("pointsExpiryDate", date1);
      fileUploadFormData.append("uploadType", formData.fileuploadOptions);
      fileUploadFormData.append("ImmdOther", formData.processScheduledCtrl);
      
      fileUploadFormData.append("region", this.productRegionCtrl);
      fileUploadFormData.append("programId", this.programOid);

      const CREATE_FILEUPLOAD_MANUAL_BONUS = "api/rpa/bonus/v1/partner/upload";
      this.loadingResponse = true;
      this.uploadBonusFile.postUploadFormdata(environment.APIEndpoint + CREATE_FILEUPLOAD_MANUAL_BONUS, fileUploadFormData).subscribe(
        (response) => {
          this.errorMes= false;
          this.snackBar.openFromComponent(SnackBarComponent, {
            duration: 1000,
            data: {
              status: 'success',
              message: 'File has been Uploaded successfully'
            }
          });
          this.router.navigate(['/view-upload']);
          this.loadingResponse = false;
        },
        (error) => {
          this.loadingResponse = false;

          for (let i = 0; i < error.error.errorDetails.length; i++) {
            this.commonErrormes = error.error.errorDetails[i].fileName;            
          }
          
          if(error.error.errorDetails['0'].accrualDescription){
            this.commonErrormes = "Accrual description should be between 4 and 255."
          }
          else if(error.error.errorDetails['0'].fileStatus){
            this.commonErrormes = "File Name already exists"
            this.errorMes= false;
          }
          else if(error.error.errorDetails['0'].accrualRuleName){
            this.commonErrormes = "Accrual Rule Name already exists"
          }
          this.snackBar.openFromComponent(SnackBarComponent, {
            duration: 10000,
            data: {
              status: 'failure',
              message: this.commonErrormes
            }
          });

        }
      );
    }
    // else if (this.fileNameVal == 'Store Staff FlatFile') {
    //   let date1 = formData.expiryDate == '' ? null : moment(formData.expiryDate).format('DD/MM/YYYY');
    //   const fileUploadFormData: FormData = new FormData();

    //   fileUploadFormData.append("title", formData.fileUploadTitle);
    //   fileUploadFormData.append("description", formData.accrualDescription);
    //   fileUploadFormData.append("fileType", formData.fileUploadType);
    //   fileUploadFormData.append("file", this.reciprociUploadFile, this.reciprociUploadFile.name);
    //   // fileUploadFormData.append("pointsExpiryDays", formData.daysVal);
    //   // fileUploadFormData.append("pointsExpiryDate", date1);
    //   // fileUploadFormData.append("uploadType", formData.fileuploadOptions);
    //   // fileUploadFormData.append("ImmdOther", formData.processScheduledCtrl);

    //   const CREATE_FILEUPLOAD_STORESTAFF = "api/rpa/store/v1/staff/upload";
    //   this.uploadBonusFile.postUploadFormdata(environment.APIEndpoint + CREATE_FILEUPLOAD_STORESTAFF, fileUploadFormData)
    //     .subscribe((response) => {
    //       this.snackBar.openFromComponent(SnackBarComponent, {
    //         duration: 1000,
    //         data: {
    //           status: 'success',
    //           message: 'File has been Uploaded successfully'
    //         }
    //       });
    //     },
    //       (error) => {
    //         this.snackBar.openFromComponent(SnackBarComponent, {
    //           duration: 10000,
    //           data: {
    //             status: 'failure',
    //             message: 'Your request cannot be saved at this time. Please try again later'
    //           }
    //         });
    //       });
    // }
    // else if (this.fileNameVal == 'Store Flat File') {
    // }
  }

  changeValidation(ev) {
    if (ev.value == 'Manual Upload') {
      this.manualList = true;
      this.scheduledList = false;
      this.eventTimeScheduled = false;
    } else {
      this.scheduledList = true;
      this.eventTimeScheduled = true;
      this.manualList = false;
    }
  }

  teamValidation(ev) {
    if(ev.value == 'BankPoints'){
      this.regionProgram = false;
      let hyperlink1 = this.fileUploadFormGroup.get('productRegionCtrl');
      hyperlink1.clearValidators();
      hyperlink1.updateValueAndValidity();
      let hyperlink = this.fileUploadFormGroup.get('programOid');
      hyperlink.clearValidators();
      hyperlink.updateValueAndValidity();
    }
    else{
      this.regionProgram = true; 
      let hyperlinkValue1 = this.fileUploadFormGroup.get('productRegionCtrl');
      hyperlinkValue1.setValidators([Validators.required]);
      hyperlinkValue1.updateValueAndValidity();
      let hyperlinkValue = this.fileUploadFormGroup.get('programOid');
      hyperlinkValue.setValidators([Validators.required]);
      hyperlinkValue.updateValueAndValidity();
    }
  }

  processScheduledValidation(ev) {
  }
  getFileTypeStatus(filetypeVal) {
    this.fileNameVal = filetypeVal.fileName;
    if (this.scheduledList == true && filetypeVal.fileName == 'Bonus'){
      this.eventTimeScheduled = true;
    }else{
      this.eventTimeScheduled = false;
    }
    // this.buildCreateFileUploadForm();
  }
  uploadManualCoupon(event: FileList) {
    //pick from one of the 4 styles of file uploads below
    this.uploadAndProgress(event, "manual");
  }
  uploadAndProgress(files: FileList, fileType: String) {
    //    var formData = new FormData();
    //    Array.from(files).forEach(f => formData.append('file',f))
    if (files.item(0).type == "application/vnd.ms-excel" || files.item(0).type == "text/plain") {
      this.uploadFiles.upload(files.item(0), 'coupon', 'files')
        .subscribe((response) => {

          if (fileType == 'manual') {
            this.manualFileName = files.item(0).name;
            this.manualFilePath = response['message'];
            this.submitForm = true;
            this.manualFileRequired = false;
            this.validCouponCode = false;
            this.manualErrorFileName = '';
            this.manualErrorFile = '';
            this.uploadManualTXTFile.nativeElement.value = ''
          } else {
            this.skuFileName = files.item(0).name;
            this.skuFilePath = response['message'];
            this.skuRequired = false;
            this.validSkuFile = false;
            this.skuErrorFile = '';
            this.skuErrorFileName = '';
            this.uploadSkuRef.nativeElement.value = '';
          }

          this.snackBar.openFromComponent(SnackBarComponent, {
            duration: 1500,
            data: {
              status: "success",
              message: " file successfully uploaded"
            }
          });
        }, err => {
          if (err.error.errorType == 'VALIDATION') {
            this.snackBar.openFromComponent(SnackBarComponent, {
              duration: 10000,
              data: {
                status: "failure",
                message: err.error.errorDetails['0']
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
    } else {
      this.snackBar.openFromComponent(SnackBarComponent, {
        duration: 10000,
        data: {
          status: "failure",
          message: "Supported file format is xls"
        }
      });
    }
  }
  onKeydownEvent(eve){
    if (eve.target.value == !''){
      this.diableDate = true;
    }else{
      this.diableDate = false;
    }
  }

  getProgramsList() {
    this.https.getJson(environment.APIEndpoint + 'api/rpa/loyalty/program/v1/get/baseAndBrandPrograms?publishStatus=LIVE')
      .subscribe(
        (response) => {
          this.programList = response;
          console.log(this.programList)
        },
        (error) => {
        });
  }

  changeProductRegion(regionVal) {
    this.regionVal = regionVal;
  }
}
