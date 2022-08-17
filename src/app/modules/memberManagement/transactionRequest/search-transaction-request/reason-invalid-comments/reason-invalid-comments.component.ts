import { Component, OnInit, Inject, Input, ViewChild } from '@angular/core';
import { Validators, FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { HttpService } from 'src/app/services/http-service';
import { environment } from 'src/environments/environment';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { SnackBarComponent } from 'src/app/shared/components/snack-bar/snack-bar.component';
import { formatDate } from '@angular/common';
import { Router } from '@angular/router';
import { Globals } from 'src/app/services/global'

@Component({
  selector: 'app-reason-invalid-comments',
  templateUrl: './reason-invalid-comments.component.html',
  styleUrls: ['./reason-invalid-comments.component.scss']
})
export class ReasonInvalidCommentsComponent implements OnInit {
  @Input('txnReqId') txnReqId: string;
  @Input('txnRequestStatus') txnRequestStatus: string;
  @ViewChild("invalidCommentForm") invalidCommentForm;
  invalidCommentFormGroup: FormGroup;
  public languages = [];
  public alignCss = [];
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private https: HttpService, private dialogRef: MatDialogRef<MatDialog>,
    private activatedRoute: ActivatedRoute,
    private http: HttpService, public snackBar: MatSnackBar, private fb: FormBuilder, private router: Router) {
    dialogRef.disableClose = true;
  }

  ngOnInit() {
    console.log(this.txnReqId);
    console.log(this.txnRequestStatus);
    this.buildCommentReasonsForm();
    this.getLanguageList();
  }

  public buildCommentReasonsForm() {
    this.invalidCommentFormGroup = this.fb.group({
      commentReasons: this.fb.array([]),
      internalComment: [''],
    });

  }
  public getLanguageList() {
    let GET_ALL_LANGUAGES = environment.APIEndpoint + "api/rpa/master/language/v1/list";
    this.http.getJson(GET_ALL_LANGUAGES)
      .subscribe((response) => {
        this.languages = response;
        console.log(this.languages);
        this.addCommentsLang();
      })
  }
  public addCommentsLang() {
    for (let i = 0; i < this.languages.length; i++) {
      const control = <FormArray>this.invalidCommentFormGroup.controls['commentReasons'];
      let newForm = this.fb.group({
        commentReasonCtrl: ["", Validators.compose([Validators.maxLength(500), Validators.pattern(Globals.regCustomwhiteList)])],
      });
      control.push(newForm);
      this.alignCss.push(this.languages[i].direction == 'RTL' ? 'text-right' : '');
    }
  }

  public updateCommentStatus(formData) {
    console.log(formData);
    let responseList = [];
    for (var i = 0; i < formData.commentReasons.length; i++) {
      console.log(this.languages[i].languageCode);
      if (null != formData.commentReasons[i].commentReasonCtrl && formData.commentReasons[i].commentReasonCtrl != "") {
        let locale = {
          languageOid: this.languages[i].languageId,
          comments: formData.commentReasons[i].commentReasonCtrl
        }
        responseList.push(locale);
      }
    }
    // alert(JSON.stringify(responseList));
    let request = {
      "transactionRequestOid": this.txnReqId,
      "transactionRequestStatus": this.txnRequestStatus,
      "internalComment": formData.internalComment,
      "transactionRequestLocale": responseList
    }
    console.log(request);
    let UPDATE_REQ_STATUS = environment.APIEndpoint + "api/rpa/transaction/request/v1/updateRequestStatus";
    this.https.postJson(UPDATE_REQ_STATUS, request).subscribe((response) => {
      console.log(response);
      // this.viewTxnDetails = response;
      this.dialogRef.close();
      this.router.navigate(['/search-transaction-request']);
      this.snackBar.openFromComponent(SnackBarComponent, {
        duration: 1000,
        data: {
          status: "success",
          message: "Transaction Request Status have been updated successfully"
        }
      });
      window.location.reload();
    },
      (error) => {
        console.log(error);
      }
    )
  }


  onCloseClick(): void {
    this.dialogRef.close();
  }
}
