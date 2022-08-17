import { Component, OnInit, ViewChild } from '@angular/core';
import { Validators, FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { HttpService } from 'src/app/services/http-service';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { SnackBarComponent } from 'src/app/shared/components/snack-bar/snack-bar.component';


export interface Country {
    contentFor: string;
    language: string;
}
@Component({
  selector: 'edit-about-us-category',
  templateUrl: './edit-about-us-category.component.html',
  styleUrls: ['./edit-about-us-category.component.scss']
})
export class EditAboutUsCategoryComponent implements OnInit {
    public breadCrumbData: Array<Object> = [{
      title: 'Configurations',
      link: ''
      }, {
          title: 'About Us Category',
          link: '/search-country'
      }
    ];
    @ViewChild("editAboutUsForm") editAboutUsForm;
    aboutUsFormGroup: FormGroup;
    public showAboutUsError: boolean = false;
    public loading: boolean = false;
    public showError: boolean = false;
    public aboutUsCategoryId;
    public aboutUsData: any = [];
    public statusValue: string;
    public buildFlag: boolean = false;
    public toggleVal:boolean=false;
    errorUpdateMes;
    alignCss = [];

    constructor(private activatedRoute: ActivatedRoute,
        private http: HttpService, private fb: FormBuilder,
        private router: Router, public snackBar: MatSnackBar) {
        this.activatedRoute.params.subscribe((params) => {
            this.aboutUsCategoryId = params.id;
        });
    }

    ngOnInit() {
        // this.getAboutUsById();
        let data = localStorage.getItem('ABSEditID');
        if(data){
            this.aboutUsCategoryId=data;
        this.getAboutUsById();
        localStorage.removeItem('ABSEditID');
        }else{
            sessionStorage.clear();
            this.router.navigate(['/search-about-us-category']);

        }


        }

    public getAboutUsById() {
        let request = {
            aboutUsCategoryId: this.aboutUsCategoryId
        }
        this.http.postJson(environment.APIEndpoint + "api/rpa/master/aboutus/category/v1/view", request)
            .subscribe((response) => {
                this.aboutUsData = response["aboutUsCategoryLocales"];
                for(let i=0; i<this.aboutUsData.length; i++){
                    this.alignCss.push(this.aboutUsData[i].languageDirection == 'RTL' ? 'text-right' : '');
                 }
                this.buildEditAboutUsForm(this.aboutUsData);
                this.toggleVal = (response["status"] == 'ONLINE' ? true : false);
            })
        }

    private buildEditAboutUsForm(editAboutUs) {
        if (editAboutUs.length == 0) {
            let aboutUsFormData = {
                aboutUsLocale: this.fb.array([]),
            }
            this.aboutUsFormGroup = this.fb.group(aboutUsFormData);
        }
        else {
            this.buildFlag = true;
            this.aboutUsFormGroup = this.fb.group({
                aboutUsLocale: this.fb.array([]),
            })
            for(let i=0; i<editAboutUs.length; i++){
                const control = <FormArray>this.aboutUsFormGroup.controls['aboutUsLocale'];
                  let newGroup = this.fb.group({
                    contentFor: [editAboutUs[i].contentFor, Validators.compose([Validators.required,
                        Validators.minLength(2), Validators.pattern('[a-zA-Z0-9\u0600-\u06FF.\"&\'(),-:.?_ ]*')])]
               });
                     control.push(newGroup);
                }
            }
        }

    public updateAboutUs(formData) {
        if (this.aboutUsFormGroup.invalid == true) {
            this.showError = true;
          }
        else {
            this.loading = true;
            this.showError = false;
            let locales = []
            for(var i=0; i<formData.aboutUsLocale.length; i++) {
              let obj = {
                languageId: this.aboutUsData[i].languageId,
                contentFor: formData.aboutUsLocale[i].contentFor,
              }
              locales.push(obj)
            }

            let createAboutUsReq = {
                aboutUsCategoryId: this.aboutUsCategoryId,
                status: this.toggleVal == true ? "ONLINE" : "OFFLINE",
                aboutUsCategoryLocales: locales,
            }
            this.http.postJson(environment.APIEndpoint + "api/rpa/master/aboutus/category/v1/update", createAboutUsReq)
                .subscribe((response) => {
                    this.snackBar.openFromComponent(SnackBarComponent, {
                        duration: 10000,
                        data: {
                            status: "success",
                            message: "About Us Category master has been updated successfully"
                        }
                    });
                    this.loading = false;
                    sessionStorage.clear();
                    this.router.navigate(['/search-about-us-category']);
                }
                    , err => {
                        this.errorUpdateMes = err.error.errorDetails[0]['description'];
                        this.loading = false;
                        this.snackBar.openFromComponent(SnackBarComponent, {
                            duration: 10000,
                            data: {
                                status: "failure",
                                message: this.errorUpdateMes
                            }
                        });
                    });
                 }
            }
        }
