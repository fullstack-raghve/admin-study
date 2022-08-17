import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { HttpService } from 'src/app/services/http-service';
import { environment } from 'src/environments/environment';
import { SnackBarComponent } from 'src/app/shared/components/snack-bar/snack-bar.component';

@Component({
    selector: 'view-feedback',
    templateUrl: './view-feedback.component.html',
    styleUrls: ['./view-feedback.component.scss']
})
export class ViewFeedbackComponent implements OnInit {
    public breadCrumbData: Array<Object> = [{
        title: 'Configurations',
        link: ''
    }, {
        title: 'Feedback',
        link: '/search-partner'
    }
    ];

    public checked = false;
    public feedBackId;
    public feedBackData: any = [];
    public statusValue: string = "ONLINE"
    public languageDirection = [];
    public languages = JSON.parse(localStorage.getItem("languageList"));
    constructor(private activatedRoute: ActivatedRoute,private router:Router,
         private http: HttpService, public snackBar: MatSnackBar) {

        // this.activatedRoute.params.subscribe((params) => {
        //     this.feedBackId = params.id;
        // });
    }

    ngOnInit() {

        // this.getFeedBackDataById();
        // for (let language of this.languages) {
        //     this.languageDirection.push(language.direction == 'RTL' ? 'text-right' : '');
        // }

        let data=localStorage.getItem('FeedbackViewID');
        if(data){
            this.feedBackId=data;
            this.getFeedBackDataById();
            for (let language of this.languages) {
                this.languageDirection.push(language.direction == 'RTL' ? 'text-right' : '');
            }
        }else{
            sessionStorage.clear();
            this.router.navigate(['/search-feedback'])
        }

    }


    public feedBackAnswerLocale;
    public feedBackAnswerLocaleOptions = [];

    public exampleArray = [];
    public exampleArray2 = [];

    public exampleArrayAr = [];
    public exampleArray2Ar = [];

    public exampleArrayIT = [];
    public exampleArray2IT = [];

    public feedBackAnswerLocaleOptionsLangidEng;
    public feedBackAnswerLocaleOptionsLangidAr;
    public feedBackAnswerLocaleOptionsLangidIT;

    public engValue: boolean = false;
    public brandData: boolean = false;
    public brandValueAll: boolean = false;
    getFeedBackDataById() {

        let request = {

            feedBackId: this.feedBackId
        }

        let GET_FEEDBACK_DATA_BY_ID = environment.APIEndpoint + "api/rpa/feedback/v1/view";

        this.http.postJson(GET_FEEDBACK_DATA_BY_ID, request)
            .subscribe((response) => {
                this.feedBackData = response;
                console.log(this.feedBackData);
                this.checked = this.feedBackData.status == 'ONLINE' ? true : false
                this.statusValue = this.feedBackData.status == "ONLINE" ? 'ONLINE' : 'OFFLINE';
                if (this.feedBackData.brandOid === null) {
                    this.brandData = false;
                }
                else {
                    this.brandData = true;
                }
                if (this.feedBackData.brandOid == 0){
                    this.brandValueAll = true;
                }
                else{
                    this.brandValueAll = false;
                }
                for (let i = 0; i < this.feedBackData.feedBackAnswer.length; i++) {
                    this.feedBackAnswerLocale = this.feedBackData.feedBackAnswer[i].feedBackAnswerLocale;


                    this.exampleArray = [];

                    this.exampleArrayAr = [];

                    this.exampleArrayIT = [];

                    for (let j = 0; j < this.feedBackAnswerLocale.length; j++) {
                        this.feedBackAnswerLocaleOptions = this.feedBackAnswerLocale[j].options;



                        this.exampleArray.push(this.feedBackAnswerLocaleOptions);
                        this.exampleArrayAr.push(this.feedBackAnswerLocaleOptions);
                        this.exampleArrayIT.push(this.feedBackAnswerLocaleOptions);

                        if (this.feedBackAnswerLocale[j].languageName == 'English') {
                            this.feedBackAnswerLocaleOptionsLangidEng = 'English';
                            this.exampleArray2.push(this.exampleArray);
                        }
                        else if (this.feedBackAnswerLocale[j].languageName == 'Arabic') {
                            this.feedBackAnswerLocaleOptionsLangidAr = 'Arabic';
                            this.exampleArray2Ar.push(this.exampleArrayAr);
                        }
                        else if (this.feedBackAnswerLocale[j].languageName == 'Italy') {
                            this.feedBackAnswerLocaleOptionsLangidIT = 'Italy';
                            this.exampleArray2IT.push(this.exampleArrayIT);
                            console.log(this.exampleArray2IT);

                        }
                    }
                }

            }
                , err => {
                    this.snackBar.openFromComponent(SnackBarComponent, {
                        duration: 1500,
                        data: {
                            status: "failure",
                            message: "Your request cannot be view at this time. Please try again later"
                        }
                    });
                    console.log("error Status = " + err.status);

                })
    }
    MoveToEdit(ID){
        localStorage.setItem('FeedbackEditID',ID);
        this.router.navigate(['/edit-feedback'])
      }
}
