import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, Validators, FormBuilder, FormGroup, NgForm, FormGroupDirective, FormArray, } from '@angular/forms';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent, MatSnackBar } from '@angular/material';
import { HttpService } from 'src/app/services/http-service';
import { environment } from 'src/environments/environment';
import { ActivatedRoute, Router } from '@angular/router';
import { SnackBarComponent } from 'src/app/shared/components/snack-bar/snack-bar.component';
import { notificationDialog } from 'src/app/shared/components/notification-dialog/notification.component';
import { MatDialog} from '@angular/material';



@Component({
  selector: 'edit-enquiry-type',
  templateUrl: './edit-enquiry-type.component.html',
  styleUrls: ['./edit-enquiry-type.component.scss']
})
export class EditEnquiryTypeComponent implements OnInit {
    public breadCrumbData: Array<Object> = [{
        title: 'Configurations',
        link: ''
    }, {
        title: 'Enquiry Type',
        link: ''
    }
    ];
    @ViewChild("editEnquiryTypeForm") editEnquiryTypeForm;
    enquiryTypeFormGroup : FormGroup;
    checked = true;
    disabled = false;
    public statusValue: string = 'ONLINE';
    public enquiryTypeId;
    public enquiryTypeData: any = [];
    public toggleVal:boolean=false;
    public alignCss=[];
    public buildFlag: boolean = false;
    public loading: boolean = false;
    public enquiryLocale: any = [];
    public showError: boolean = false;

    public languageList =JSON.parse(localStorage.getItem("languageList"));

    constructor(private activatedRoute: ActivatedRoute,
        private http: HttpService, private fb: FormBuilder,
        private router: Router, public snackBar: MatSnackBar, public dialog:MatDialog) {
        // this.activatedRoute.params.subscribe((params) => {
        //     this.enquiryTypeId = params.id;
        // });
    }

  ngOnInit() {
    //   this.getEnquiryTypeById();
      let data=  localStorage.getItem('EnquiryEditID');
      if(data){
        this.enquiryTypeId=data;
        this.getEnquiryTypeById();
        localStorage.removeItem('EnquiryEditID');
      }else{
        sessionStorage.clear();
        this.router.navigate(['/search-enquiry-type']);
      }
  }

    public getEnquiryTypeById() {
        let GET_ENQUIRY_TYPE_BY_ID = environment.APIEndpoint + "api/rpa/master/enquiry/type/v1/view";
        let request = {
            enquiryTypeId: this.enquiryTypeId
        }
        this.http.postJson(GET_ENQUIRY_TYPE_BY_ID, request)
            .subscribe((response) => {
                console.log(response);
                this.enquiryTypeData = response;
                this.toggleVal=(this.enquiryTypeData.status=='ONLINE'?true:false);
                this.buildEditEnquiryTypeForm(response);
            }
            , err => {
                if (err.error == "invalid_token") {
                    alert("Invalid Token");
                }
                console.log("error Status = " + err.status);

            })

    }

    public enquiryTypeLocale(){
        console.log("size = "+this.languageList.length);
        const control = <FormArray>this.enquiryTypeFormGroup.controls['enquiryTypeLocale'];
        for(let ln of this.enquiryTypeData.enquiryTypeLocales){
            let arr= this.fb.group({
                enquiryTitle: [ln.enquiryTitle,Validators.compose([Validators.required, Validators.minLength(2),Validators.pattern('^[a-zA-Z0-9\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF \"&\'(),-:.?_ ]*')])],
            });
            control.push(arr);
        this.alignCss.push(ln.languageDirection == 'RTL' ? 'text-right' : '');
        }
    }

    public buildEditEnquiryTypeForm(editData){
        if (editData.enquiryCode == undefined) {
            let formData = {
                enquiryTypeLocale: this.fb.array([]),
                enquiryCode : ["", Validators.compose([Validators.required,Validators.pattern('^[a-zA-Z0-9]*')])],
            }
            this.enquiryTypeFormGroup = this.fb.group(formData);
        }
        else {
            this.buildFlag = true;
            this.statusValue = editData.status ;

            this.enquiryTypeFormGroup = this.fb.group({
                enquiryTypeLocale: this.fb.array([]),
                enquiryCode : [editData.enquiryCode, Validators.compose([Validators.required,Validators.pattern('^[a-zA-Z0-9]*')])],
            })
            this.enquiryTypeLocale();
            this.toggleVal=editData.status == 'ONLINE' ? true : false;

            this.enquiryTypeFormGroup.updateValueAndValidity();
        }
    }

    public updateEnquiryType(formData) {
        this.enquiryLocale=[];
         if (this.enquiryTypeFormGroup.invalid) {
            this.showError = true;
        }
        else {
            formData.enquiryTypeLocale.forEach((enquiryType, index)=>{
                this.enquiryLocale.push({
                     enquiryTitle:enquiryType.enquiryTitle,
                     languageId:this.enquiryTypeData.enquiryTypeLocales[index].languageId
                })
            })
            this.loading = true;
            this.showError = false;
            let editEnquiryTypeReq = {
                enquiryTypeId: this.enquiryTypeId,
                enquiryTypeLocales: this.enquiryLocale,
                enquiryCode: formData.enquiryCode,
                status: this.toggleVal == true ? 'ONLINE' : 'OFFLINE'
            }
            console.log("editEnquiryReq = " + editEnquiryTypeReq);
            let UPDATE_ENQUIRY_TYPE = environment.APIEndpoint + "api/rpa/master/enquiry/type/v1/update";
            this.http.postJson(UPDATE_ENQUIRY_TYPE, editEnquiryTypeReq)
                .subscribe((response) => {
                    console.log(response);
                    this.snackBar.openFromComponent(SnackBarComponent, {
                        duration: 1500,
                        data: {
                            status: "success",
                            message: "Enquiry type updated successfully"
                        }
                    });
                    this.loading = false;
                    sessionStorage.clear();
                    this.router.navigate(['/search-enquiry-type']);
                }
                    , err => {
                        this.loading = false;
                        this.snackBar.openFromComponent(SnackBarComponent, {
                            duration: 1500,
                            data: {
                                status: "failure",
                                message: "Your request cannot be saved at this time. Please try again later"
                            }
                        });
                        console.log("error Status = " + err.status);
                    })
        }

    }

  public toggleStatus(event) {
      if (event.checked == true) {
          this.statusValue = 'ONLINE';
      } else {
          this.statusValue = 'OFFLINE';
      }
      this.alertDialog();

  }

  alertDialog(): void {
    const dialogReference = this.dialog.open(notificationDialog, {
      width: '350px',
    });
    dialogReference.componentInstance.statusValue = this.statusValue;
    dialogReference.afterClosed().subscribe(result => {
      if(result){
        this.toggleVal = !this.toggleVal;
      }
    });
  }
}
