import { Component, OnInit, ViewChild } from '@angular/core';
import { Validators, FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { HttpService } from 'src/app/services/http-service';
import { environment } from 'src/environments/environment';
import { Router, ActivatedRoute } from '@angular/router';
import { SnackBarComponent } from 'src/app/shared/components/snack-bar/snack-bar.component';
import { Globals } from 'src/app/services/global';
@Component({
    selector: 'edit-faq',
    templateUrl: './edit-faq.component.html',
    styleUrls: ['./edit-faq.component.scss']
})
export class EditFaqComponent implements OnInit {
    public breadCrumbData: Array<Object> = [{
        title: 'FAQ',
        link: '/search-faq'
    },
    ];

    @ViewChild("editFaqForm") editFaqForm;
    faqFormGroup: FormGroup;
    public toggleVal: boolean = false;
    checked = true;
    disabled = false;
    public showError: boolean = false;
    public loading: boolean = false;
    public faqId;
    public faqLocales;
    public faqCategoryList = [];
    public buildFlag = false;
    public alignCss = [];
    public langfieldname = [];
    public countries: any = [];

    constructor(private fb: FormBuilder, private http: HttpService,
        public snackBar: MatSnackBar, private https: HttpService, private activatedRoute: ActivatedRoute,
        private router: Router) {
        // this.activatedRoute.params.subscribe((params) => {
        //     this.faqId = params.id;
        //     console.log(Globals.regCustomwhiteList);
            
        // });
        this.getAllCategories();
    }

    ngOnInit() {
        this.getAllCountries();
    }

    getAllCategories() {
        this.http.getJson(environment.APIEndpoint + "api/rpa/faq/category/v1/get/faq/categories")
            .subscribe((response) => {
                this.faqCategoryList = response;
                let data = localStorage.getItem('FAQEditId');
                if(data){
                  this.faqId=Number(data);
                  this.getViewFaqData();
                  localStorage.removeItem('FAQEditId')
                }else{
                  sessionStorage.clear();
                  this.router.navigate(['/search-faq'])
                }
            })
    }

    getAllCountries() {
        let GET_ALL_COUNTRIES = environment.APIEndpoint + "api/rpa/master/country/v1/get/countries";
        this.http.getJson(GET_ALL_COUNTRIES)
            .subscribe((response) => {
                console.log(response);
                this.countries = response;

            })
    }
    getViewFaqData() {
        let data = {
            "faqId": parseFloat(this.faqId)
        }
        this.https.postJson(environment.APIEndpoint + "api/rpa/faq/v1/view", data).subscribe(res => {
            this.faqLocales = res["faqLocales"];
            this.buildFlag = true;
            this.toggleVal = res["status"] == "ONLINE" ? true : false;
            this.buildEditFaqForm(res);
            for (let i = 0; i < this.faqLocales.length; i++) {
                this.alignCss.push(this.faqLocales[i].languageDirection == 'RTL' ? 'text-right' : '');
                this.langfieldname.push(this.faqLocales[i].languageDirection == 'RTL' ? 'lang-field-right' : '');
            }
        })
    }

    public buildEditFaqForm(viewData) {
        if (viewData.faqId == undefined) {
            let form = {
                faqFormArray: this.fb.array([]),
                faqCategory: ["", Validators.required],
                country: ["", Validators.required],
            }
            this.faqFormGroup = this.fb.group(form);
        } else {
            this.faqFormGroup = this.fb.group({
                faqFormArray: this.fb.array([]),
                faqCategory: viewData.faqCategory.faqCategoryId,
                country: [viewData.countryOid, Validators.required],
            })
            for (let ln of viewData.faqLocales) {
                const control = <FormArray>this.faqFormGroup.controls['faqFormArray'];
                let newGroup = this.fb.group({
                    question: [ln.question, Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(150), Validators.pattern(Globals.regCustomwhiteList)])],
                    answer: [ln.answer, Validators.compose([Validators.required, Validators.minLength(4), Validators.maxLength(1500), Validators.pattern(Globals.regCustomwhiteList)])]
                });
                control.push(newGroup);
            }
        }
    }
    createFAQRequest(formData) {
        if (this.faqFormGroup.invalid == true) {
            this.showError = true;
        }
        else {
            this.loading = true;
            this.showError = false;
            let faqLocalesList = [];
            for (var i = 0; i < formData.faqFormArray.length; i++) {
                let obj = {
                    languageId: this.faqLocales[i].languageId,
                    question: formData.faqFormArray[i].question,
                    answer: formData.faqFormArray[i].answer,
                }
                faqLocalesList.push(obj);
            }

            let createfaqReq = {
                faqId: parseFloat(this.faqId),
                faqCategoryId: formData.faqCategory,
                countryOid: parseInt(formData.country),
                status: this.toggleVal == true ? 'ONLINE' : 'OFFLINE',
                faqLocales: faqLocalesList
            }
            this.http.postJson(environment.APIEndpoint + "api/rpa/faq/v1/update", createfaqReq)
                .subscribe((response) => {
                    this.snackBar.openFromComponent(SnackBarComponent, {
                        duration: 10000,
                        data: {
                            status: "success",
                            message: "FAQ has been updated successfully"
                        }
                    });
                    this.loading = false;
                    sessionStorage.clear();
                    this.router.navigate(['/search-faq']);
                }
                    , err => {
                        this.loading = false;
                        if (err.error.errorType == 'VALIDATION') {
                            this.snackBar.openFromComponent(SnackBarComponent, {
                                duration: 10000,
                                data: {
                                    status: "failure",
                                    message: err.error.errorDetails[0].description
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
                    })
        }
    }

}
