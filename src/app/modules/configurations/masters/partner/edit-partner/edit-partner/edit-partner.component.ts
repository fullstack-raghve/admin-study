import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, Validators, FormBuilder, FormGroup, NgForm, FormGroupDirective, FormArray, } from '@angular/forms';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent, MatSnackBar } from '@angular/material';
import { HttpService } from 'src/app/services/http-service';
import { environment } from 'src/environments/environment';
import { ActivatedRoute, Router } from '@angular/router';
import { SnackBarComponent } from 'src/app/shared/components/snack-bar/snack-bar.component';

@Component({
  selector: 'edit-partner',
  templateUrl: './edit-partner.component.html',
  styleUrls: ['./edit-partner.component.scss']
})
export class EditPartnerComponent implements OnInit {
    public breadCrumbData: Array<Object> = [{
        title: 'Configurations',
        link: ''
    }, {
        title: 'Partner',
        link: ''
    }
    ];

    @ViewChild("editPartnerForm") editPartnerForm;
    partnerFormGroup:FormGroup;
    public partnerData: any = [];
    public partnerLocale;
    public statusValue:string = '';
    public toggleVal:boolean=false;
    public showError: boolean = false;
    checked = true;
    disabled = false;
    public partnerId;
    public buildFlag: boolean = false;
    public alignCss=[];
    public languageList =JSON.parse(localStorage.getItem("languageList"));



    constructor(private activatedRoute: ActivatedRoute,
        private https: HttpService,
        private http:HttpService,
        private fp: FormBuilder,
        private router: Router,
        public snackBar: MatSnackBar) {
        this.activatedRoute.params.subscribe((params) => {
            this.partnerId = params.id;
        });
    }
    ngOnInit() {
        // this.getPartnerById();
        let data= localStorage.getItem('PartnerEditID');
        if(data){
            this.partnerId=data;
            this.getPartnerById();
        }else{
            sessionStorage.clear();
    this.router.navigate(['/search-partner'])
        }
    }
    public getPartnerById() {
        let GET_PARTNER_BY_ID = environment.APIEndpoint+"api/rpa/master/partner/v1/view";
        let request = {
            partnerId:this.partnerId
        }
        this.http.postJson(GET_PARTNER_BY_ID, request)
            .subscribe((response) => {
                console.log(response);
                this.partnerData = response;
                this.toggleVal=(this.partnerData.status=='ONLINE'?true:false);
                this.buildEditPartnerForm(response);
                this.partnerTitleArray(response['partnerLocales']);
                this.statusValue = response['status'];
            }
            ,(error) => {
                alert(error);
            })
    } 

    public toggleStatus(event) {
        if (event.checked) {
            this.statusValue = 'ONLINE';
        } else {
            this.statusValue = 'OFFLINE';
        }

    }

    public partnerTitleArray(partnerTitleArray){
        let control = <FormArray>this.partnerFormGroup.controls['partnerTitleArray'];
        //for(let i=0;i<this.languageList.length;i++){
        for(let partner of partnerTitleArray){
        let form = this.fp.group({
            partnerTitle:[partner.partnerTitle,Validators.compose([Validators.required, Validators.minLength(2),Validators.pattern('^[a-zA-Z0-9\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF \"&\'(),-:.?_ ]*')])],
        });
        control.push(form);
        //this.alignCss.push(this.languageList[i].direction == 'RTL' ? 'text-right' : '');
        this.alignCss.push(partner.languageDirection == 'RTL' ? 'text-right' : '');
        }
    }

    public buildEditPartnerForm(editData){
        this.buildFlag = true
        let form = {
              partnerTitleArray:this.fp.array([]),
              partnerCode : [editData.partnerCode, Validators.compose([Validators.required,Validators.minLength(2),Validators.pattern('^[a-zA-Z0-9]*')])],
          }
          this.partnerFormGroup=this.fp.group(form);
    }

    public updatePartner(formData){
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
            partnerId:this.partnerId,
            partnerCode:formData.partnerCode,
            partnerLocales:this.partnerLocale,
            status:this.statusValue,
        }

        let UPDATE_PARTNER = environment.APIEndpoint +"api/rpa/master/partner/v1/update";
        this.https.postJson(UPDATE_PARTNER,requestBody).subscribe(
        (response)=>{
            console.log(response);
            this.snackBar.openFromComponent(SnackBarComponent, {
                duration: 10000,
                data: {
                    status: "success",
                    message: "Partner master updated successfully"
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
}
