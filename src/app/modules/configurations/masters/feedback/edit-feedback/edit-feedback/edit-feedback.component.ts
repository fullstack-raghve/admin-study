import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, Validators, FormBuilder, FormGroup, NgForm, FormGroupDirective, FormArray, } from '@angular/forms';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent, MatSnackBar } from '@angular/material';
import { HttpService } from 'src/app/services/http-service';
import { environment } from 'src/environments/environment';
import { Router, ActivatedRoute } from '@angular/router';
import { SnackBarComponent } from 'src/app/shared/components/snack-bar/snack-bar.component';
import { notificationDialog } from 'src/app/shared/components/notification-dialog/notification.component';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';


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
  selector: 'edit-feedback',
  templateUrl: './edit-feedback.component.html',
  styleUrls: ['./edit-feedback.component.scss']
})
export class EditFeedbackComponent implements OnInit {
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

  feedBackFormGroup: FormGroup;
  public selectable = true;
  public removable = true;
  public addOnBlur = true;
  public toggleVal: boolean = true;
  public ratingError: boolean = false;
  public feedBackId;
  public statusValue: string = 'ONLINE';
  public brandData: boolean = false;
  public languages = JSON.parse(localStorage.getItem("languageList"));
  forList: any = [];
  public optionArray = [];
  public languageDirection = [];
  feedBackOptions: Option[] = [];
  public options = [];
  public optionEnglish;
  public optionArabic;
  public optionItaly;
  public optionError: boolean = false;
  public feedBackData: any = [];
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  public feedbackLocales: any = [];
  public feedbackAnswerLocales: any = [];

  public prePopulateBrandId;
  public feedbackAnswers: any = [];
  public brandValueerror;
  public keyupValue;
  constructor(private formBuilder: FormBuilder, private https: HttpService,
    private router: Router, private activatedRoute: ActivatedRoute,
    public snackBar: MatSnackBar, public dialog: MatDialog) {

    // this.activatedRoute.params.subscribe((params) => {
    //   this.feedBackId = params.id;
    // });
    this.buildFeedBackForm();
  }
  ngOnInit() {
    // this.getFeedBackForList();
    // this.getFeedBackDataById();

    let data=localStorage.getItem('FeedbackEditID');
    if(data){
      this.feedBackId=data;
      this.getFeedBackForList();
    this.getFeedBackDataById();
    }else{
      sessionStorage.clear();
            this.router.navigate(['/search-feedback'])
    }
    
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
    if (index >= 0) {
      this.optionArray[ind].option.splice(index, 1);
      if (ind === 0) {
        this.optionEnglish = this.optionArray[ind].option.length;
      }
      if (ind === 1) {
        this.optionArabic = this.optionArray[ind].option.length;
      }
      // if (ind === 2) {
      //   this.optionItaly = this.optionArray[ind].option.length;
      // }
    }
    const control = this.feedBackFormGroup.get('feedBackLocale') as FormArray;

    for (let i = 0; i < this.optionArray.length; i++) {
      let option = this.optionArray[i].option;
      if (option.length <= 0) {
        control.at(i).get('feedBackOption').setValidators([Validators.required]);
        control.at(i).get('feedBackOption').updateValueAndValidity();
      } else {
        control.at(i).get('feedBackOption').clearValidators();
        control.at(i).get('feedBackOption').updateValueAndValidity();
      }
    }
  }

 

  getFeedBackForList() {

    let GET_FOR_LIST = environment.APIEndpoint + "api/rpa/feedback/v1/for/list";

    this.https.getJson(GET_FOR_LIST)
      .subscribe((response) => {
        this.forList = response;
      }
        , err => {
          console.log("error Status = " + err.status);

        })

  }

  checkFeedBackRating() {

    if (this.feedBackFormGroup.get('feedBackFor').value != "" && this.feedBackFormGroup.get('feedBackRating').value != "") {
      if (this.feedBackData.feedBackFor != this.feedBackFormGroup.get('feedBackFor').value && this.feedBackData.feedBackRating != this.feedBackFormGroup.get('feedBackRating').value) {
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
      else {
        this.ratingError = false;
      }
    }


  }

  public buildFeedBackForm() {
    let form = {

      feedBackType: ["", Validators.required],
      feedBackFor: ["", Validators.required],
      feedBackRating: [""],
      feedBackDescription: ["", Validators.compose([Validators.required, Validators.pattern("[a-zA-Z0-9\u0600-\u06FF \"&'(),-:{}.?_ ]*")])],
      feedBackLocale: this.formBuilder.array([]),
    }
    this.feedBackFormGroup = this.formBuilder.group(form);

    this.buildFeedBackLocale();
  }
 public brandDataEnable;
  feedbackForData(fordata){
    console.log(fordata.value);
    this.brandDataEnable = fordata.value;
    if (this.brandDataEnable == 'TransactionFeedback_Good' || 
    this.brandDataEnable == 'TransactionFeedback_Bad' ||
    this.brandDataEnable == 'TransactionFeedback_Moderate'){
      console.log("Brand Data will come");
      this.brandData = true;
      // this.getAllBrands();
    }
    else{
      this.brandData = false;
      // this.prePopulateBrandId = null;
    }
  }

  getAllBrands(prePopulateBrandId) {
    console.log(prePopulateBrandId);
    
    // console.log(this.KioskForm.get('brands').value);
    // this.selectedCityIdValue = ev;
    let GET_ALL_ONLINE_BRANDS = environment.APIEndpoint + "api/rpa/master/brand/v1/get/regionBrands";
    this.https.getJson(GET_ALL_ONLINE_BRANDS)
      .subscribe((response) => {
        // console.log(response);
        this.Brands = [];
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
        for (let j = 0; j < this.Brands.length; j++) {
          if (this.Brands[j].brandId == this.prePopulateBrandId) {
            this.brandCtrl.setValue(this.Brands[j].brandName);
          }
        }
      },
        (error) => {
          console.log(error);
        });
  }
  private _filterBrands(value: string): Brand[] {
    const filterValue = value.toLowerCase();
    return this.Brands.filter(brand => brand.brandName.toLowerCase().indexOf(filterValue) === 0);
  }

  getBrandValue(val) {
    console.log(val);
    this.prePopulateBrandId = val;
    if (this.prePopulateBrandId != ''){
      this.brandValueerror = '';
    }
  }

  buildFeedBackLocale() {
    const control = <FormArray>this.feedBackFormGroup.controls['feedBackLocale'];
    for (let i = 0; i < this.languages.length; i++) {

      let newForm = this.formBuilder.group({
        feedBackTitle: ['', Validators.compose([Validators.required, Validators.pattern('[a-zA-Z0-9\u0600-\u06FF \"&\'(),-:{}.?_ ]*')])],
        feedBackOption: ['', Validators.compose([Validators.pattern('[a-zA-Z0-9\u0600-\u06FF \"&\'(),-:{}.?_\r?\n ]*')])],
      });
      control.push(newForm);
      this.optionArray.push({ option: [] });
      this.languageDirection.push(this.languages[i].direction == 'RTL' ? 'text-right' : '');
    }
  }

  getFeedBackDataById() {
    let data = {
      feedBackId: this.feedBackId
    };

    this.https
      .postJson(environment.APIEndpoint + "api/rpa/feedback/v1/view", data)
      .subscribe(
        res => {
          this.feedBackData = res;
          this.toggleVal = this.feedBackData.status == "ONLINE" ? true : false;
          this.statusValue = this.feedBackData.status == "ONLINE" ? "ONLINE" : "OFFLINE";

          this.populateData();
        },
        err => {
          console.log(err);
        }
      );
  }

  public populateData() {
    console.log(this.feedBackData.feedBackForId);
    if (this.feedBackData.feedBackForId == 5 || this.feedBackData.feedBackForId == 4 || this.feedBackData.feedBackForId == 3){
      this.brandData = true;
    }
    else{
      this.brandData = false;
    }
    this.feedBackFormGroup.patchValue({

      feedBackType: this.feedBackData.feedBackEnumType,
      feedBackFor: this.feedBackData.feedBackForId,
      feedBackRating: this.feedBackData.feedBackRating,
      feedBackDescription: this.feedBackData.feedBackDescription
    })
    this.prePopulateBrandId = this.feedBackData.brandOid;
    console.log(this.prePopulateBrandId);
    
    this.feedBackLocale(this.feedBackData.feedBackLocale);
    this.feedBackAnswerLocale(this.feedBackData.feedBackAnswer);
    this.getAllBrands(this.prePopulateBrandId)
  }

  public feedBackLocale(feedBackLocale) {
    if (feedBackLocale != undefined && feedBackLocale.length > 0) {
      for (let i = 0; i < feedBackLocale.length; i++) {
        const item = <FormArray>(
          this.feedBackFormGroup.controls["feedBackLocale"]
        );
        console.log(this.feedBackFormGroup.controls["feedBackLocale"]);

        item.at(i).patchValue({
          languageId: feedBackLocale[i].languageName,
          feedBackTitle: feedBackLocale[i].feedBackTitle

        });
      }
    }
  }

  public feedBackAnswerOid;
  public languageId;
  public feedBackAnswerLocale(feedBackAnswer) {
    console.log(feedBackAnswer);
    console.log(this.languages);

    if (feedBackAnswer != undefined && feedBackAnswer.length > 0) {
      for (let i = 0; i < feedBackAnswer.length; i++) {
        for (let k of feedBackAnswer[i].feedBackAnswerLocale) {
          console.log(k.options);
          for (let i = 0; i < this.languages.length; i++) {
            this.languageId = this.languages[i].languageId;
            if (this.languageId == 1 && k.languageOid == 1) {
              this.optionArray[i].option.push(k.options);
            }
            else if (this.languageId == 2 && k.languageOid == 2){
              this.optionArray[i].option.push(k.options);
            }
            else if (this.languageId == 3 && k.languageOid == 3){
              this.optionArray[i].option.push(k.options);
            }
          }
          // this.languageId = k.languageOid;
          
        }
      }
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
      if (result) {
        this.toggleVal = !this.toggleVal;
      }
    });
  }
  
  keyupValueData(ev){
    console.log(ev.target.value);
    this.keyupValue = ev.target.value;
    this.prePopulateBrandId = this.keyupValue;
  }
  updateFeedBack(formData) {
    this.feedbackLocales = [];
    this.feedbackAnswerLocales = [];
    this.feedbackAnswers = [];
    if (this.optionEnglish !== this.optionArabic) {
      this.optionError = true;
      return
    }
    // if (this.optionEnglish !== this.optionItaly) {
    //   this.optionError = true;
    //   return
    // }
    // if (this.optionArabic !== this.optionItaly) {
    //   this.optionError = true;
    //   return
    // }
    if (this.brandDataEnable == 'TransactionFeedback_Good' || 
    this.brandDataEnable == 'TransactionFeedback_Bad' ||
    this.brandDataEnable == 'TransactionFeedback_Moderate'){
      this.brandData =true;
      if (this.brandData == true){
        if (this.prePopulateBrandId === null || this.prePopulateBrandId === ''){
          // this.brandValueerror = "";
          this.brandValueerror = "Please enter value";
          return
        }
        else{
          this.brandValueerror = "";
          // this.brandValueerror = "Please enter value";
        }
      }
      
    }
    // else{
    //   this.brandData =false;
    //   this.brandValueerror = "";
    // }
    if (this.feedBackFormGroup.invalid === true || this.ratingError) {
      return
    }
    else {

      formData.feedBackLocale.forEach((feedBack, index) => {
        this.feedbackLocales.push({
          feedBackTitle: feedBack.feedBackTitle,
          languageId: this.languages[index].languageId
        })
      })

      formData.feedBackLocale.forEach((feedBack, index) => {
        // this.feedbackAnswers.push({
        //   feedBackAnswerOid: null,
        //   options: this.optionArray[index].option,
        //   languageOid: this.languages[index].languageId
        // })
        this.optionArray[index].option.forEach((optionVal) => {
          console.log(optionVal);
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
      })

      let request = {
        feedBackId: this.feedBackId,
        feedBackType: this.feedBackFormGroup.get('feedBackType').value,
        feedBackFor: this.feedBackFormGroup.get('feedBackFor').value,
        feedBackRating: "",
        feedBackDescription: this.feedBackFormGroup.get('feedBackDescription').value,
        brandOid: this.prePopulateBrandId != undefined ? this.prePopulateBrandId: null,
        status: this.toggleVal == true ? 'ONLINE' : 'OFFLINE',
        feedBackLocale: this.feedbackLocales,
        feedBackAnswer: this.feedbackAnswers,
      }

      // for (let i = 0; i < this.languages.length; i++) {
      //   this.feedBackFormGroup.value.feedBackLocale[i].languageId = this.languages[i].languageId
      //   this.options.push(this.optionArray[i].option)
      //   this.feedBackFormGroup.value.feedBackLocale[i].feedBackOption = this.options[i].join(",") 
      // }
      // request['feedBackLocale'] = this.feedBackFormGroup.value.feedBackLocale;

      let UPDATE_FEEDBACK = environment.APIEndpoint + "api/rpa/feedback/v1/update";
      this.https.postJson(UPDATE_FEEDBACK, request)
        .subscribe((response) => {
          this.snackBar.openFromComponent(SnackBarComponent, {
            duration: 1500,
            data: {
              status: "success",
              message: "Feedback has been updated successfully"
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
}
