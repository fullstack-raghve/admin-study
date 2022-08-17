import { Component, OnInit, ViewChild, ɵConsole } from '@angular/core';
import { FormControl, Validators, FormBuilder, FormGroup, NgForm, FormGroupDirective, FormArray, } from '@angular/forms';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent, MatSnackBar } from '@angular/material';
import { HttpService } from 'src/app/services/http-service';
import { environment } from 'src/environments/environment';
import { SnackBarComponent } from 'src/app/shared/components/snack-bar/snack-bar.component';
import { Router } from '@angular/router';
import { ExtraValidators } from 'src/app/services/validator-service';


import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

export interface Brand {
  brandId: number;
  brandName: string;
}
export interface Option {
  name: string;
}

@Component({
  selector: 'add-feedback',
  templateUrl: './add-feedback.component.html',
  styleUrls: ['./add-feedback.component.scss']
})
export class AddFeedbackComponent implements OnInit {
  public breadCrumbData: Array<Object> = [{
    title: 'Configurations',
    link: ''
  }, {
    title: 'Feedback',
    link: ''
  }
  ];

  brandList;
  Brands: Brand[] = [];
  brandCtrl = new FormControl();
  filteredbrands: Observable<Brand[]>;

  @ViewChild("feedBackForm") feedBackForm;
  feedBackFormGroup: FormGroup;
  public languages = JSON.parse(localStorage.getItem("languageList"));
  public toggleVal: boolean = true;
  public ratingError: boolean = false;
  public errorManual: boolean = false;
  public selectable = true;
  public removable = true;
  public addOnBlur = true;
  public optionEnglish;
  public optionArabic;
  public optionItaly;
  public optionError: boolean = false;
  public ratingField: boolean = false;
  public statusValue: string = 'ONLINE';
  public brandData: boolean = false;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  forList: any = [];
  feedBackOptions: Option[] = [];
  public optionArray: any = [];
  public languageDirection = [];
  public options = [];

  public feedbackLocales: any = [];
  public feedbackAnswerLocalesArray: any = [];
  public feedbackAnswerLocales: any = [];
  public feedbackAnswers: any = [];

  constructor(private fb: FormBuilder,
    private http: HttpService, private https: HttpService,
    public snackBar: MatSnackBar, private router: Router) {

  }



  add(event: MatChipInputEvent, index): void {
    const input = event.input;
    const value = event.value;

    let regex = /^[a-zA-Z0-9\u0600-\u06FF \"&'(),-:.?_ ]+$/;
    if (value != '') {
      let valid = value.match(regex)
      if (valid && (value || '').trim()) {
        this.optionArray[index].option.push(value.trim());

        if (this.optionArray[0]) {
          this.optionEnglish = this.optionArray[0].option.length;
        }
        if (this.optionArray[1]) {
          this.optionArabic = this.optionArray[1].option.length;
        }
        // if (this.optionArray[2]) {
        //   this.optionItaly = this.optionArray[1].option.length;
        // }
        if (input) {
          input.value = '';
        }
      }
      // Reset the input value

    }
  }

  remove(option: Option, ind): void {
    const index = this.optionArray[ind].option.indexOf(option);
    this.optionArray[ind].option.splice(index, 1);
    console.log(this.optionArray[ind].option.length);
    if (ind === 0) {
      this.optionEnglish = this.optionArray[ind].option.length;
    }
    if (ind === 1) {
      this.optionArabic = this.optionArray[ind].option.length;
    }
    // if (ind === 2) {
    //   this.optionItaly = this.optionArray[ind].option.length;
    // }
    const control = this.feedBackFormGroup.get('feedBackLocale') as FormArray;
    for (let i = 0; i < this.optionArray.length; i++) {
      let option = this.optionArray[i].option;
      console.log(option.length);
      if (option.length <= 0) {
        control.at(i).get('feedBackOption').setValue('');
      }
    }
  }


  ngOnInit() {
    this.buildCreateFeedBackForm();
    this.getFeedBackForList();
  }

  getFeedBackForList() {

    let GET_FOR_LIST = environment.APIEndpoint + "api/rpa/feedback/v1/for/list";

    this.https.getJson(GET_FOR_LIST)
      .subscribe((response) => {
        console.log(response);
        
        this.forList = response;
      }
        , err => {
          console.log("error Status = " + err.status);

        })

  }

  public brandDataEnable;
  feedbackForData(fordata) {
    console.log(fordata.value);
    this.brandDataEnable = fordata.value;

    // let feedBackRating = this.feedBackFormGroup.get('feedBackRating');

    if (this.brandDataEnable == 'TransactionFeedback_Good' ||
      this.brandDataEnable == 'TransactionFeedback_Bad' ||
      this.brandDataEnable == 'TransactionFeedback_Moderate') {
      console.log("Brand Data will come");
      this.brandData = true;
      this.ratingField = false;
      // feedBackRating.clearValidators();
      // feedBackRating.updateValueAndValidity();
      this.getAllBrands();
    }
    else {
      // feedBackRating.setValidators([Validators.required]);
      // feedBackRating.updateValueAndValidity();
      
      this.brandData = false;
      this.ratingField = true;
    }
  }

  public brandIdValue;
  getBrandValue(val) {
    console.log(val);
    this.brandIdValue = val.brandId;
    if(val.brandName == 'ALL'){
      this.brandIdValue = 0;
    }
    else{
      this.brandIdValue = val.brandId; 
    }
  }

  getAllBrands() {
    // console.log(this.KioskForm.get('brands').value);

    let GET_ALL_ONLINE_BRANDS = environment.APIEndpoint + "api/rpa/master/brand/v1/get/regionBrands";
    this.https.getJson(GET_ALL_ONLINE_BRANDS)
      .subscribe((response) => {
        // console.log(response);
        this.brandList = response;

        for (let i = 0; i <= this.brandList.length - 1; i++) {
          let objMallkey = {
            brandId: this.brandList[i]['brandId'],
            brandName: this.brandList[i]['brandName'],
          }
          console.log(objMallkey);
          this.Brands.push(objMallkey);
        }
        this.filteredbrands = this.brandCtrl.valueChanges
          .pipe(
            startWith(''),
            map(brand => brand ? this._filterBrands(brand) : this.Brands.slice())
          );
        console.log(this.brandList['brandName']);
        console.log(this.brandList['brandId']);
      },
        (error) => {
          console.log(error);
        });
  }
  private _filterBrands(value: string): Brand[] {
    const filterValue = value.toLowerCase();
    return this.Brands.filter(brand => brand.brandName.toLowerCase().indexOf(filterValue) === 0);
  }

  checkFeedBackRating() {

    if (this.feedBackFormGroup.get('feedBackFor').value != "" && this.feedBackFormGroup.get('feedBackRating').value != "") {
      let request = {
        feedBackFor: this.feedBackFormGroup.get('feedBackFor').value,
        feedBackRating: this.feedBackFormGroup.get('feedBackRating').value
      }

      let CHECK_FEEDBACK_RATING = environment.APIEndpoint + "api/rpa/feedback/v1/check/rating";

      this.https.postJson(CHECK_FEEDBACK_RATING, request)
        .subscribe((response) => {
          this.ratingError = false;
        }
          , err => {
            this.ratingError = true;

          })
    }


  }

  public buildCreateFeedBackForm() {
    let form = {

      feedBackType: ["", Validators.required],
      feedBackFor: ["", Validators.required],
      feedBackRating: [''],
      feedBackDescription: ["", Validators.compose([Validators.required, Validators.pattern("[a-zA-Z0-9\u0600-\u06FF \"&'(),-:{}.?_\n ]*")])],
      // brandOid: []
      // brandOid: ['', Validators.compose([ExtraValidators.conditional(group => this.brandDataEnable == 'TransactionFeedback_Good' ||
      // this.brandDataEnable == 'TransactionFeedback_Bad' ||
      // this.brandDataEnable == 'TransactionFeedback_Moderate', Validators.required)])],
      feedBackLocale: this.fb.array([]),
    }
    this.feedBackFormGroup = this.fb.group(form);

    this.buildFeedBackLocale();
  }

  buildFeedBackLocale() {
    const control = <FormArray>this.feedBackFormGroup.controls['feedBackLocale'];
    for (let i = 0; i < this.languages.length; i++) {
      console.log(this.languages);
      let newForm = this.fb.group({
        feedBackTitle: ['', Validators.compose([Validators.required, Validators.pattern('[a-zA-Z0-9\u0600-\u06FF \"&\'(),-:{}.?_ ]*')])],
        feedBackOption: ['', Validators.compose([Validators.required, Validators.pattern('[a-zA-Z0-9\u0600-\u06FF \"&\'(),-:{}.?_\r?\n ]*')])],
      });
      control.push(newForm);
      this.optionArray.push({ option: [] });
      this.languageDirection.push(this.languages[i].direction == 'RTL' ? 'text-right' : '');
    }
  }

  public brandValueerror;
  public keyupValue;
  keyupValueData(ev) {
    console.log(ev.target.value);
    this.keyupValue = ev.target.value;
    // this.prePopulateBrandId = this.keyupValue;
  }

  createFeedBack(formData) {
    console.log(formData);
    console.log(this.brandIdValue);


    if (this.brandDataEnable == 'TransactionFeedback_Good' ||
      this.brandDataEnable == 'TransactionFeedback_Bad' ||
      this.brandDataEnable == 'TransactionFeedback_Moderate') {
      this.brandData = true;
      // if (this.brandIdValue === null || this.brandIdValue === '') {

      if (this.brandIdValue === '') {
      // this.brandValueerror = "";
        this.brandValueerror = "Please enter value";
        return
      }
      else {
        this.brandValueerror = "";
        // this.brandValueerror = "Please enter value";
      }
    }
   
    
    // else{
    //   this.brandData =false;
    //   this.brandValueerror = "";
    // }


    this.feedbackLocales = [];
    this.feedbackAnswerLocalesArray = [];
    this.feedbackAnswerLocales = [];
    this.feedbackAnswers = [];

    // if (this.optionEnglish !== this.optionArabic) {
    //   this.optionError = true;
    //   return
    // }

    // if (this.optionEnglish !== this.optionItaly) {
    //   this.optionError = true;
    //   return
    // }
    // if (this.optionArabic !== this.optionItaly) {
    //   this.optionError = true;
    //   return
    // }
    if (this.feedBackFormGroup.invalid == true || this.ratingError) {
      return
    }
    else {

      formData.feedBackLocale.forEach((feedBack, index) => {
        this.feedbackLocales.push({
          feedBackTitle: feedBack.feedBackTitle,
          languageId: this.languages[index].languageId
        })
      })

      // formData.feedBackLocale.forEach((feedBack, index)=>{
      //   this.feedbackAnswerLocales.push({
      //     options:this.optionArray[index].option,
      //     languageOid:this.languages[index].languageId
      //   })
      // })



      formData.feedBackLocale.forEach((feedBack, index) => {
        this.optionArray[index].option.forEach((optionVal) => {
          this.feedbackAnswers.push({
            feedBackAnswerOid: null,
            feedBackAnswerLocale: [
              {
                options: optionVal,
                languageOid: this.languages[index].languageId
              }
            ],
          })
        })
        // this.feedbackAnswers.push(this.feedbackAnswerLocalesArray);
        // console.log(this.feedbackAnswerLocales);
      })

      console.log(JSON.stringify(this.feedbackAnswers));

      // this.feedbackAnswers.push({
      //   // feedBackAnswerOid: null,
      //   feedBackAnswerLocale:this.feedbackAnswerLocales
      // })

      let request = {
        feedBackType: this.feedBackFormGroup.get('feedBackType').value,
        feedBackFor: this.feedBackFormGroup.get('feedBackFor').value,
        feedBackRating: "",
        feedBackDescription: this.feedBackFormGroup.get('feedBackDescription').value,
        brandOid: this.brandIdValue != undefined ? this.brandIdValue : null,
        status: this.toggleVal == true ? 'ONLINE' : 'OFFLINE',
        feedBackLocale: this.feedbackLocales,
        feedBackAnswer: this.feedbackAnswers,
      }

      console.log(JSON.stringify(request));


      // for (let i = 0; i < this.languages.length; i++) {
      //   this.feedBackFormGroup.value.feedBackLocale[i].languageId = this.languages[i].languageId
      //   this.options.push(this.optionArray[i].option)
      //   this.feedBackFormGroup.value.feedBackLocale[i].feedBackOption = this.options[i].join(",")
      // }
      // request['feedBackLocale'] = this.feedBackFormGroup.value.feedBackLocale;

      let CREATE_FEEDBACK = environment.APIEndpoint + "api/rpa/feedback/v1/create";
      this.https.postJson(CREATE_FEEDBACK, request)
        .subscribe((response) => {
          this.snackBar.openFromComponent(SnackBarComponent, {
            duration: 1500,
            data: {
              status: "success",
              message: "Feedback has been added successfully"
            }
          });
          sessionStorage.clear();
          this.router.navigate(['/search-feedback']);
        }
          , err => {
            if (err.error.errorType == 'VALIDATION') {
              this.snackBar.openFromComponent(SnackBarComponent, {
                duration: 1500,
                data: {
                  status: "failure",
                  message: err.error.errorDetails[0].description
                }
              });
            } else {
              this.snackBar.openFromComponent(SnackBarComponent, {
                duration: 1500,
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