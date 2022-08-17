import { OnInit, ViewChild, Input, Component } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSnackBar, MatTableDataSource } from '@angular/material';
import { FormControl, Validators, FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { HttpService } from 'src/app/services/http-service';
import { Router, ActivatedRoute } from '@angular/router';
import { SnackBarComponent } from 'src/app/shared/components/snack-bar/snack-bar.component';
import * as moment from 'moment';

@Component({
  selector: 'app-transaction-feedback',
  templateUrl: './transaction-feedback.component.html',
  styleUrls: ['./transaction-feedback.component.scss']
})
export class TransactionFeedbackComponent implements OnInit {
  @Input('feedbackList') feedbackList = [];
  constructor(private dialogRef: MatDialogRef<MatDialog>, private https: HttpService, private activatedRoute: ActivatedRoute, private fb: FormBuilder,
    public snackBar: MatSnackBar) {
    dialogRef.disableClose = true;
  }
  
feedbackdata;
public feedbackAnswers = [];
public optionsArray = [];
public optionsList = [];
  ngOnInit() {
    console.log(this.feedbackList);
    this.getFeedback();
  }
  getFeedback(){
    // console.log(this.feedbackList.length);
    // for (let i = 0; i < this.feedbackList.length; i++) {
    //   console.log("list===>"+ this.feedbackList[i]);
    //   console.log(i);
    //   this.optionsArray = this.feedbackList[i].options;
    //   console.log(this.optionsArray);
    // }
    this.feedbackdata = this.feedbackList;
    this.feedbackAnswers = this.feedbackList['feedbackAnswers'];
  }
  onCloseClick(): void {
    this.dialogRef.close();
  }
  removeComment(x){
    console.log(x);
  }
}
