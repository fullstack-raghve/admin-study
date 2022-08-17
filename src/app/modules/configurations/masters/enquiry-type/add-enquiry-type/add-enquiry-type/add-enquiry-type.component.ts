import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, Validators, FormBuilder, FormGroup, NgForm, FormGroupDirective, FormArray, } from '@angular/forms';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent, MatSnackBar } from '@angular/material';
import { HttpService } from 'src/app/services/http-service';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { SnackBarComponent } from 'src/app/shared/components/snack-bar/snack-bar.component';

@Component({
  selector: 'add-enquiry-type',
  templateUrl: './add-enquiry-type.component.html',
  styleUrls: ['./add-enquiry-type.component.scss']
})
export class AddEnquiryTypeComponent implements OnInit {
    public breadCrumbData: Array<Object> = [{
        title: 'Configurations',
        link: ''
    }, {
        title: 'Enquiry Type',
        link: ''
    }
    ];

    @ViewChild('createEnquiryTypeForm')createEnquiryTypeForm;
    enquiryTypeFormGroup:FormGroup;
    checked = true;
    disabled = false;
    public statusValue: string = 'ONLINE';
    public languageList =JSON.parse(localStorage.getItem("languageList"));
    public alignCss=[];
    public enquiry_type_locale:any=[];
    public showError: boolean = false;
    public loading: boolean = false;
    public toggleVal:boolean=true;

    constructor(private fb: FormBuilder,private http:HttpService,
        private router: Router, public snackBar: MatSnackBar,){
            this.buildCreateEnquiryTypeForm();
        }

    ngOnInit() {
        this.enquiryTypeLocale();
    }

    public buildCreateEnquiryTypeForm(){
        let form = {
            enquiryTypeLocale:this.fb.array([]),
            enquiryCode : ["", Validators.compose([Validators.required,Validators.pattern('^[a-zA-Z0-9]*')])],
        }
        this.enquiryTypeFormGroup=this.fb.group(form);
    }

    public enquiryTypeLocale(){
        console.log("size = "+this.languageList.length);
        const control = <FormArray>this.enquiryTypeFormGroup.controls['enquiryTypeLocale'];
        for(let ln of this.languageList){
            let arr= this.fb.group({
                enquiryTitle: ['',Validators.compose([Validators.required, Validators.minLength(2),Validators.pattern('^[a-zA-Z0-9\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF \"&\'(),-:.?_ ]*')])],
            });
            control.push(arr);
        this.alignCss.push(ln.direction == 'RTL' ? 'text-right' : '');
        }
    }

    createEnquiryType(formData){
        this.enquiry_type_locale=[];
        if (this.enquiryTypeFormGroup.invalid) {
              this.showError = true;
          }
          else {
              this.loading = true;
              this.showError = false;
              formData.enquiryTypeLocale.forEach((enquiryType, index)=>{
                  this.enquiry_type_locale.push({
                       enquiryTitle:enquiryType.enquiryTitle,
                       languageId:this.languageList[index].languageId
                  })
              })
  
              let createEnquiryTypeReq = {
                  enquiryTypeLocales:this.enquiry_type_locale,
                  enquiryCode: formData.enquiryCode,
                  status:this.statusValue,
              }
              console.log("enquiryReq = "+createEnquiryTypeReq);
              let CREATE_ENQUIRY_TYPE=environment.APIEndpoint+"api/rpa/master/enquiry/type/v1/create";
              this.http.postJson(CREATE_ENQUIRY_TYPE,createEnquiryTypeReq)
              .subscribe((response) => {
                      console.log(response);
                      this.snackBar.openFromComponent(SnackBarComponent, {
                              duration: 10000,
                              data: {
                                  status: "success",
                                  message: "Enquiry type added successfully"
                              }
                      });
                      this.loading = false;
                      sessionStorage.clear();
                      this.router.navigate(['/search-enquiry-type']);
                  }
                  ,(err) => {
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

  public toggleStatus(event) {
      if (event.checked == true) {
          this.statusValue = 'ONLINE';
      } else {
          this.statusValue = 'OFFLINE';
      }

  }
}
