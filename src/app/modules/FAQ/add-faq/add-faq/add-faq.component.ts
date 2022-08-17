import { Component, OnInit, ViewChild } from '@angular/core';
import { Validators, FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { HttpService } from 'src/app/services/http-service';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { SnackBarComponent } from 'src/app/shared/components/snack-bar/snack-bar.component';
import { Globals } from 'src/app/services/global';

@Component({
    selector: 'add-faq',
    templateUrl: './add-faq.component.html',
    styleUrls: ['./add-faq.component.scss']
})
export class AddFaqComponent implements OnInit {
    public breadCrumbData: Array<Object> = [{
        title: 'FAQ',
        link: '/search-faq'
    },
    ];

    @ViewChild("createFaqForm") createFaqForm;
    faqFormGroup: FormGroup;
    public showError: boolean = false;
    public loading: boolean = false;
    public toggleVal: boolean = true;
    public languageList;
    public faqCategoryList = [];
    public alignCss = [];
    public langfieldname = [];
    checked = true;
    disabled = false;
    public countries: any = [];

    constructor(private fb: FormBuilder, private http: HttpService,
        private router: Router, public snackBar: MatSnackBar, ) {
        this.buildCreateFaqForm();
    }

    ngOnInit() {
        this.getAllCategories();
        this.getAllCountries();
    }

    getLanguage() {
        this.http.getJson(environment.APIEndpoint + "api/rpa/master/language/v1/list")
            .subscribe((response) => {
                var S1 = "[";
                var S3 = "'";
                var S4 = "\\]";
                var S5 = "\\\\";


                this.languageList = response;
                for (let i = 0; i < this.languageList.length; i++) {
                    const control = <FormArray>this.faqFormGroup.controls['faqFormArray'];
                    if (this.languageList[i].direction != 'RTL') {
                        let newGroup = this.fb.group({
                            question: ['', Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(150), Validators.pattern(Globals.regCustomwhiteList)])],
                            // answer: ['', Validators.compose([Validators.required, Validators.minLength(4), Validators.maxLength(1500), Validators.pattern('[a-zA-Z0-9\u0600-\u06FF \"&\'(),-:.?!#%*+=@;`^~$_]*')])]
                            answer: ['', Validators.compose([Validators.required, Validators.minLength(4), Validators.maxLength(1500), Validators.pattern(Globals.regCustomwhiteList)])]
                        });
                        control.push(newGroup);
                    } else {
                        let newGroup = this.fb.group({
                            question: ['', Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(150), Validators.pattern(Globals.regCustomwhiteList)])],
                            answer: ['', Validators.compose([Validators.required, Validators.minLength(4), Validators.maxLength(1500), Validators.pattern(Globals.regCustomwhiteList)])]
                        });
                        control.push(newGroup);
                    }

                    this.alignCss.push(this.languageList[i].direction == 'RTL' ? 'text-right' : '');
                    this.langfieldname.push(this.languageList[i].direction == 'RTL' ? 'lang-field-right' : '');
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

    getAllCategories() {
        this.http.getJson(environment.APIEndpoint + "api/rpa/faq/category/v1/get/faq/categories")
            .subscribe((response) => {
                this.faqCategoryList = response;
            })
    }

    public buildCreateFaqForm() {
        let form = {
            faqFormArray: this.fb.array([]),
            faqCategory: ["", Validators.required],
            country: ["", Validators.required],
        }
        this.faqFormGroup = this.fb.group(form);
        this.getLanguage();
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
                if (formData.faqFormArray[i].question != "" && formData.faqFormArray[i].answer != "") {
                    let obj = {
                        languageId: this.languageList[i].languageId,
                        question: formData.faqFormArray[i].question,
                        answer: formData.faqFormArray[i].answer,

                    }
                    faqLocalesList.push(obj);
                }
            }
            let createfaqReq = {
                faqCategoryId: formData.faqCategory,
                countryOid: parseInt(formData.country),
                status: this.toggleVal == true ? 'ONLINE' : 'OFFLINE',
                faqLocales: faqLocalesList
            }
            this.http.postJson(environment.APIEndpoint + "api/rpa/faq/v1/create", createfaqReq)
                .subscribe((response) => {
                    this.snackBar.openFromComponent(SnackBarComponent, {
                        duration: 10000,
                        data: {
                            status: "success",
                            message: "FAQ has been added successfully"
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
