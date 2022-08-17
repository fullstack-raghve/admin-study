import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, Validators, FormBuilder, FormGroup, NgForm, FormGroupDirective, FormArray, } from '@angular/forms';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent, MatSnackBar } from '@angular/material';
import { HttpService } from 'src/app/services/http-service';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { UploadFile } from 'src/app/services/uploadFile.service';
import { ErrorStateMatcher } from '@angular/material/core';
import { SnackBarComponent } from 'src/app/shared/components/snack-bar/snack-bar.component';
export class MyErrorStateMatcher implements ErrorStateMatcher {
    isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
        const isSubmitted = form && form.submitted;
        return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
    }
}

@Component({
  selector: 'add-partner',
  templateUrl: './add-partner.component.html',
  styleUrls: ['./add-partner.component.scss']
})
export class AddPartnerComponent implements OnInit {
    public breadCrumbData: Array<Object> = [{
        title: 'Configurations',
        link: ''
    }, {
        title: 'Partner',
        link: ''
    }
    ];
    checked = true;
    disabled = false;
    public showError: boolean = false;
    partnerFormGroup:FormGroup;
    public statusValue:string = 'ONLINE';
    public languageList =JSON.parse(localStorage.getItem("languageList"));
    alignCss = [];
    public partnerLocale;

    constructor(private fp: FormBuilder,private http:HttpService,
        private router: Router,
        private https: HttpService,
        private uploadFile: UploadFile,
        public snackBar: MatSnackBar,){
            this.buildCreatePartnerForm();
            this.partnerTitleArray();
        }

  ngOnInit() {
   
  }

    public buildCreatePartnerForm(){
        let form = {
              partnerTitleArray:this.fp.array([]),
              partnerCode : ["", Validators.compose([Validators.required,Validators.minLength(2),Validators.pattern('^[a-zA-Z0-9]*')])],
          }
          this.partnerFormGroup=this.fp.group(form);
    }

    partnerTitleArray(){
        let control = <FormArray>this.partnerFormGroup.controls['partnerTitleArray'];
        for(let i=0;i<this.languageList.length;i++){
        let form = this.fp.group({
            partnerTitle:['',Validators.compose([Validators.required, Validators.minLength(2),Validators.pattern('^[a-zA-Z0-9\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF \"&\'(),-:.?_ ]*')])],
        });
        control.push(form);
        this.alignCss.push(this.languageList[i].direction == 'RTL' ? 'text-right' : '');
        }

    }

    createPartner(formData){
        this.partnerLocale = [];
        if (this.partnerFormGroup.invalid == true) {
            this.showError = true;
            return 
        }
        formData.partnerTitleArray.forEach((partnerLocale, index) => {
            let locale={
                languageId:this.languageList[index].languageId,
                partnerTitle:partnerLocale.partnerTitle,
            }
            this.partnerLocale.push(locale);
        })
        let requestBody = {
            partnerCode:formData.partnerCode,
            partnerLocales:this.partnerLocale,
            status:this.statusValue,
        }

        let CREATE_PARTNER = environment.APIEndpoint +"api/rpa/master/partner/v1/create";
        this.https.postJson(CREATE_PARTNER,requestBody).subscribe(
        (response)=>{
            console.log(response);
            this.snackBar.openFromComponent(SnackBarComponent, {
                duration: 10000,
                data: {
                    status: "success",
                    message: "Partner master added successfully"
                }
            });
            sessionStorage.clear();
            this.router.navigate(['/search-partner']);
        },
        (error)=>{
            console.log(error);
            if (error.error.errorType == 'VALIDATION') {
                this.snackBar.openFromComponent(SnackBarComponent, {
                    duration: 10000,
                    data: {
                        status: "failure",
                        message: error.error.errorDetails[0].description
                    }
                });
            } else {
                this.snackBar.openFromComponent(SnackBarComponent, {
                    duration: 10000,
                    data: {
                        status: "failure",
                        message: "Your request cannot be saved at this time. Please try again later"
                    }
                });
            }
        }
    );

    }

  public toggleStatus(event) {
      if (event.checked == true) {
          this.statusValue = 'ONLINE';
      } else {
          this.statusValue = 'OFFLINE';
      }

  }
}
