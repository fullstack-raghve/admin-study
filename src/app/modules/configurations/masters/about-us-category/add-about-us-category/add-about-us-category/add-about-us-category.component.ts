import { Component, OnInit, ViewChild } from '@angular/core';
import { Validators, FormBuilder, FormGroup, FormArray} from '@angular/forms';
import { MatSnackBar} from '@angular/material';
import { HttpService } from 'src/app/services/http-service';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { SnackBarComponent } from 'src/app/shared/components/snack-bar/snack-bar.component';

@Component({
  selector: 'add-about-us-category',
  templateUrl: './add-about-us-category.component.html',
  styleUrls: ['./add-about-us-category.component.scss']
})
export class AddAboutUsCategoryComponent implements OnInit {
    public breadCrumbData: Array<Object> = [{
      title: 'Configurations',
      link: ''
      }, {
          title: 'About Us Category',
          link: ''
      }
    ];
    @ViewChild("createAboutUsForm")createAboutUsForm;
    aboutUsFormGroup:FormGroup;
    addForm: FormGroup;
    rows: FormArray;
    itemForm: FormGroup;
    public showError: boolean = false;
    public showAboutError=false;
    public loading: boolean = false;
    public showContentError:boolean = false;
    public statusValue:string = 'ONLINE';
    public toggleVal: boolean = true;
    checked = true;
    public languageList = JSON.parse(localStorage.getItem("languageList"));
    public alignCss = [];

    constructor(private fb: FormBuilder,private http:HttpService,
    private router: Router, public snackBar: MatSnackBar,){
    }

    ngOnInit() {
        let form = {
            contentLocale:this.fb.array([]),
          }
          this.aboutUsFormGroup=this.fb.group(form);
       this.getLanguage();
    }

    getLanguage() {
        for(let i=0; i< this.languageList.length; i++){
                const control = <FormArray>this.aboutUsFormGroup.controls['contentLocale'];
                let newGroup = this.fb.group({
                    contentFor: ["", Validators.compose([Validators.required,
                        Validators.minLength(2), Validators.pattern('[a-zA-Z0-9\u0600-\u06FF.\"&\'(),-:.?_ ]*')])]
              });
                control.push(newGroup);
                this.alignCss.push(this.languageList[i].direction == 'RTL' ? 'text-right' : '');
            }
    }

    createAboutUs(formData){
        if (this.aboutUsFormGroup.invalid == true) {
              this.showError = true;
          }
          else {
                this.loading = true;
                this.showError = false;
                let locales = [];
                for(var i=0; i<formData.contentLocale.length; i++) {
                    let obj = {
                        languageId: this.languageList[i].languageId,
                        contentFor: formData.contentLocale[i].contentFor,
                    }
                         locales.push(obj);
                }
                  let createAboutUsReq = {
                       "status": this.toggleVal == true ? "ONLINE" : "OFFLINE",
                       aboutUsCategoryLocales:locales,
                  }
                  let CREATE_ABOUT_US=environment.APIEndpoint+"api/rpa/master/aboutus/category/v1/create";
                  this.http.postJson(CREATE_ABOUT_US,createAboutUsReq)
                  .subscribe((response) => {
                          this.snackBar.openFromComponent(SnackBarComponent, {
                                  duration: 10000,
                                  data: {
                                      status: "success",
                                      message: "About Us Category master added successfully"
                                  }
                          });
                          this.loading = false;
                          sessionStorage.clear();
                          this.router.navigate(['/search-about-us-category']);
                      }
                      ,err => {
                              this.loading = false;
                              if(err.error.errorType=='VALIDATION'){
                                  this.snackBar.openFromComponent(SnackBarComponent, {
                                          duration: 10000,
                                          data: {
                                              status: "failure",
                                              message: err.error.errorDetails[0].description
                                          }
                                      });
                              }else{
                                  this.snackBar.openFromComponent(SnackBarComponent, {
                                          duration: 10000,
                                          data: {
                                              status: "failure",
                                              message: "Your request cannot be saved at this time. Please try again later"
                                          }
                                      });
                              }
                      })
              }

          }

    }
