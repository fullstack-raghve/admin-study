import { Component, OnInit, ViewChild } from '@angular/core';
import { Validators, FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { HttpService } from 'src/app/services/http-service';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders, HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { SnackBarComponent } from 'src/app/shared/components/snack-bar/snack-bar.component';

@Component({
    selector: 'change-password',
    templateUrl: './change-password.component.html',
    styleUrls: ['./change-password.component.scss']
})
export class change_passwordComponent implements OnInit {

    @ViewChild("createFaqForm") createFaqForm;
    changePassword: FormGroup;
    checked = true;
    disabled = false;
    showerror = false;
    unverifiedEmail;
    errFlag=false
    href;
    constructor(private fb: FormBuilder, private http: HttpClient,
        private router: Router, public snackBar: MatSnackBar, ) {

    }

    ngOnInit() {
        this.buildchangePasswordForm();
    }

    updatePassword() {
        if (this.changePassword.valid) {
            if (this.changePassword.value.oldPassword != this.changePassword.value.newPassword) {
                this.showerror = true
            }
            else if (this.changePassword.value.oldPassword == this.changePassword.value.newPassword) {
                this.showerror = false;
                this.href = this.router.url.split('/reset/password?p=')[1];
                let obj = {
                    "userId": this.href,
                    "password": this.changePassword.value.oldPassword,
                    "confPassword": this.changePassword.value.newPassword
                }
                let url = environment.APIEndpoint + "api/rpa/user/password/reset"
                let httpOptions = new HttpHeaders({
                    'Content-Type': 'application/json'
                });
                this.http.post(url, obj, { headers: httpOptions }).subscribe(res => {
                    this.snackBar.openFromComponent(SnackBarComponent, {
                        duration: 1500,
                        data: {
                            status: "success",
                            message: "password updated successfully"
                        }
                    });
                this.router.navigate(['/login']);
                }, err => {
                    this.snackBar.openFromComponent(SnackBarComponent, {
                        duration: 3000,
                        data: {
                            status: "failure",
                            message: err.error.errorDetails[0].description
                        }
                    });


                })
            }
        }
    }

    buildchangePasswordForm() {
        let formData = {
            oldPassword: ["", Validators.compose([Validators.required, Validators.minLength(6), Validators.pattern("^(?=.*[0-9])(?=.*[a-zA-Z ^%$#!~@,-])([a-zA-Z0-9 ^%$#!~@,-]+)$")])],
            newPassword: ["", Validators.compose([Validators.required,Validators.minLength(6), Validators.pattern("^(?=.*[0-9])(?=.*[a-zA-Z ^%$#!~@,-])([a-zA-Z0-9 ^%$#!~@,-]+)$")])]
        };
        this.changePassword = this.fb.group(formData);
    }


}
