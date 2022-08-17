import { Component, OnInit, ViewChild } from '@angular/core';
import {FormControl, Validators, FormBuilder, FormGroup, FormArray} from '@angular/forms';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {MatChipInputEvent, MatSnackBar} from '@angular/material';
import { HttpService } from 'src/app/services/http-service';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { SnackBarComponent } from 'src/app/shared/components/snack-bar/snack-bar.component';

@Component({
  selector: 'add-language',
  templateUrl: './add-language.component.html',
  styleUrls: ['./add-language.component.scss']
})
export class AddLanguageComponent implements OnInit {
    public breadCrumbData: Array<Object> = [{
      title: 'Configurations',
      link: ''
      }, {
          title: 'Language',
          link: '/search-country'
      }
    ];
    @ViewChild("createLanguageForm")createLanguageForm;
    languageFormGroup:FormGroup;
    public showError: boolean = false;
    public loading: boolean = false;
    public showLanguageError:boolean = false;
    public statusValue:string = 'Online';
    public toggleVal:boolean=true;
    readonly separatorKeysCodes: number[] = [ENTER, COMMA];
    public languageList:any = [];
    public languageArr:any=[];
    public language_locale:any=[];
    public arr:any=[];

   constructor(private fb: FormBuilder,
               private http:HttpService,
               private router: Router,
               public snackBar: MatSnackBar,){
       this.buildCreateLanguageForm();
   }

  ngOnInit() {
  }
  public buildCreateLanguageForm(){
      let form = {
            langCode : ["", Validators.required],
            langName: ["", Validators.required],
            direction: ["", Validators.required],
        }
        this.languageFormGroup=this.fb.group(form);
  }

  createLanguage(formData) {
    console.log();
    if(this.languageFormGroup.valid==false){
         return
    }
    let createLanguageReq = {
        langCode: formData.langCode,
         langName: formData.langName,
         direction: formData.direction,
         status: this.toggleVal==true ? 'ONLINE' : 'OFFLINE'
    }

    let CREATE_LANGUAGE=environment.APIEndpoint+"api/rpa/master/language/v1/create";
    this.http.postJson(CREATE_LANGUAGE,createLanguageReq)
    .subscribe((response) => {
            console.log(response);
            this.snackBar.openFromComponent(SnackBarComponent, {
                    duration: 10000,
                    data: {
                        status: "success",
                        message: "Language master has been added successfully"
                    }
            });
            this.loading = false;
            sessionStorage.clear();
            this.router.navigate(['/search-language']);
        }
        ,err => {
                this.loading = false;
                console.log("error Status = "+err);
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
