import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { FormControl, FormGroup, Validators, FormBuilder, FormGroupDirective, FormArray, NgForm } from '@angular/forms';
import { HttpService } from 'src/app/services/http-service';
import { SnackBarComponent } from 'src/app/shared/components/snack-bar/snack-bar.component';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import * as moment from 'moment';
import * as XLSX from 'xlsx';

@Component({
  selector: 'dump-flow-dialog',
  templateUrl: './dump-flow-dialog.component.html',
  styleUrls: ['./dump-flow-dialog.component.scss']
})
export class DumpFlowDialogComponent implements OnInit {

  public dumpFlowFormGroup: FormGroup;
  public customerOid;
  public showError: boolean;
  public loading: boolean;
  public enquiryList = [];
  public dumpData: any;
  public flowId: any;
  public formattedJson: any;
  public excelDate: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<MatDialog>,
    private fb: FormBuilder,
    private https: HttpService,
    private router: Router,
    private http: HttpService,
    public snackBar: MatSnackBar,
  ) {
    dialogRef.disableClose = true;
    this.buildEnquiryForm();
  }

  ngOnInit() {
    this.flowId = this.data.flowOid;
    this.getEnquiryTypeData();
  }

  public buildEnquiryForm() {
    let form = {
      fromDate: [""],
      endDate: [""]
    }
    this.dumpFlowFormGroup = this.fb.group(form);
  }

  public getEnquiryTypeData() {
    let GET_ENQUIRY_TYPE = environment.APIEndpoint + 'api/rpa/master/enquiry/type/v1/get/list'
    this.http.getJson(GET_ENQUIRY_TYPE).subscribe((response) => {
      this.enquiryList = response;
    })
  }

  dumpFlow(formdata) {
    if (this.dumpFlowFormGroup.invalid == false) {
      let formdata = this.dumpFlowFormGroup.value;
      let data =
      {
        "page": "0",
        "pageSize": "100",
        "order": {
          "column": "modifiedTime",
          "dir": "desc"
        },
        "keySearch": "",
        "fieldSearch": [
          {
            "fieldName": "flowOid",
            "fieldValue": this.flowId
          },
          {
            "fieldName": "fromDate",
            "fieldValue": formdata.fromDate !== '' ? moment(formdata.fromDate).format('YYYY-MM-DD'):''
          }
          ,
          {
            "fieldName": "toDate",
            "fieldValue": formdata.endDate !== '' ? moment(formdata.endDate).format('YYYY-MM-DD'):''
          }
        ]
      };
      this.https
        .postJson(
          environment.APIEndpoint + "api/rpa/feedback/flow/v1/notificationReport",
          data
        )
        .subscribe(
          res => {
            console.log(res);
            this.dumpData = res["items"];
            console.log(this.dumpData)
            this.exportAsExcel();
            this.dialogRef.close();
          },
          err => {
            console.log(err);
          }
        );
    }
  }
  public exportAsExcel() {

    this.formattedJson = this.dumpData.map(res => {
      // if(res.feedbackQuestionsAndAnswers.length>0){
      //   for(let i=0;i<res.feedbackQuestionsAndAnswers.length;i++){
          
      //   }
      // }
      return {
        'Question':res.feedbackQuestionsAndAnswers[0].answer,

        //   'Flow Id': res.flowId,
        // 'Flow Name': res.flowName,
        // 'Kiosk Assigned': res.kioskAssigned,
        // 'Email': res.email,
        // 'SMS': res.sms,
        // 'FeedBack Count': res.feedbackCount,
        // 'ResponseTime': res.responseTime,
      };
    });

    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.formattedJson);//convert the json value to xlsx woorkSheet
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'enquire');

    /* save to file */
    XLSX.writeFile(wb, 'FlowFeedback.xlsx');
    
  }

  onCloseClick(): void {
    this.dialogRef.close();
  }
}
