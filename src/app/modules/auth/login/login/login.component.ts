import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ErrorStateMatcher } from '@angular/material/core';
import { loginServcie } from '../../../../services/LoginServcie';
import { environment } from '../../../../../environments/environment'
import { HttpService } from '../../../../services/http-service';
import { forgot_passwordComponent } from '../forgot-password/forgot-password.component'
import { MatDialog, MatSnackBar } from '@angular/material';
import { FormControl, FormGroup, Validators, FormBuilder, NgForm, FormGroupDirective } from '@angular/forms';
import { SnackBarComponent } from 'src/app/shared/components/snack-bar/snack-bar.component';
import { EncrDecrService } from 'src/app/services/encrDecrservice';

import * as uuid from 'uuid';

const myDeviceId = uuid.v4();

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent implements OnInit {
  public loginFormGroup: FormGroup;
  public matcher = new MyErrorStateMatcher();
  public showSpinner = false;
  public loadingResponse: any;
  dialogRef: any;
  constructor(
    private http: loginServcie,
    private router: Router,
    public dialog: MatDialog,
    private https: HttpService,
    private fb: FormBuilder,
    public snackBar: MatSnackBar,
    private EncrDecr: EncrDecrService,) {
    this.buildLoginForm();
  }

  ngOnInit() {
  }

  public errFlag = false;
  public clearerr = function () {
    this.errFlag = false;
  }

  public doLogin = function () {
    if (null === sessionStorage.getItem("deviceId") || sessionStorage.getItem("deviceId") === ""
    || sessionStorage.getItem("deviceId") === undefined) {
    sessionStorage.setItem("deviceId", myDeviceId);
  }
    if (this.loginFormGroup.valid == true) {
      var encryptedMobileNumber = this.EncrDecr.set('TecHtreEiTSYsteM', this.loginFormGroup.value.userId);
      var encryptedPassword = this.EncrDecr.set('TecHtreEiTSYsteM', this.loginFormGroup.value.password);
      var encryptedDeviceId = this.EncrDecr.set('TecHtreEiTSYsteM', sessionStorage.getItem("deviceId"));

      var decryptedMobileNumber = this.EncrDecr.get('TecHtreEiTSYsteM', encryptedMobileNumber);
      var decryptedPassword = this.EncrDecr.get('TecHtreEiTSYsteM', encryptedPassword);
      var decryptedDeviceId = this.EncrDecr.get('TecHtreEiTSYsteM', encryptedDeviceId);

      let data = {
        "userName": encryptedMobileNumber,
        "password": encryptedPassword,
        "deviceId": sessionStorage.getItem("deviceId")
      }
      this.loadingResponse = true;
      this.http.unsecPostJson(environment.APIEndpoint + 'api/rpa/user/v1/login', data).subscribe(
        (response) => {
          this.loadingResponse = false;
          this.errFlag = false;
          localStorage.clear();
          localStorage.setItem("userpermissions", JSON.stringify(response));
          this.snackBar.openFromComponent(SnackBarComponent, {
            duration: 2500,
            data: {
              status: "success",
              message: "You have successfully logged in"
            }
          });
          this.router.navigate(['/welcome-page']);
        },
        (err) => {
          this.loadingResponse = false;
          this.snackBar.openFromComponent(SnackBarComponent, {
            duration: 3000,
            data: {
              status: "loginFailure",
              message: "Invalid Username or password"
            }
          });
          this.errFlag = true,
            this.error = err.error.error
        });
    } else {
      this.loadingResponse = false;
    }
  }

  openDialog() {
    const dialogRef = this.dialog.open(forgot_passwordComponent);
    dialogRef.afterClosed().subscribe(result => {
    });
  }

  buildLoginForm() {
    let formData = {
      userId: ["", Validators.required],
      password: ["", Validators.required]
    };
    this.loginFormGroup = this.fb.group(formData);
  }
}
