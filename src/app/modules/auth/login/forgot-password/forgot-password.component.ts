import { OnInit, Component } from '@angular/core';
import {  FormGroup, Validators, FormBuilder } from '@angular/forms';
import { HttpService } from '../../../../services/http-service'
import { environment } from '../../../../../environments/environment'
import { MatDialog, MatDialogRef, MatSnackBar } from '@angular/material';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'forgot-password.component',
  templateUrl: 'forgot-password.component.html',
  styleUrls: ['forgot-password.component.scss']
})

export class forgot_passwordComponent implements OnInit {

  constructor(
    private https: HttpService,
    public dialog: MatDialog,
    public snackBar: MatSnackBar,
    private fb: FormBuilder,
    private http: HttpClient,
    private dialogRef: MatDialogRef<MatDialog>) {
    dialogRef.disableClose = true;

  }

  forgotPasswordForm: FormGroup;
  public unverifiedEmail;
  public error;
  public showSpinner;
  public success: boolean = false;

  ngOnInit() {
    this.buildForgotUserForm()
  }

  public buildForgotUserForm() {
    const form = {
      emailId: ['', Validators.compose([Validators.minLength(6), Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")])],
    };
    this.forgotPasswordForm = this.fb.group(form);
  }

  onCloseClick(): void {
    this.dialogRef.close();
  }

  verifyEmail(x) {
    let emailId = {
      "emailId": x.emailId
    }
    this.showSpinner = true;
    let url = environment.APIEndpoint + "api/rpa/user/forgot/password"
    if (this.forgotPasswordForm.valid) {
      let httpOptions = new HttpHeaders({
        'Content-Type': 'application/json'
      });
      this.http.post(url, emailId, { headers: httpOptions }).subscribe(res => {
        this.success = true;
        this.showSpinner = false;
        //  this.roleId=res;
      }, err => {
        if (err.status == 400) {
          this.showSpinner = false;
          this.error = true
          this.unverifiedEmail = err.error.errorDetails[0].description
        }
      });
    }
  }
}