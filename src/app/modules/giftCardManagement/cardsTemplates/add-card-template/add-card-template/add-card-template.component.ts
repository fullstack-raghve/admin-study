import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormControl,Validators, FormBuilder, FormGroup, FormArray, NgForm, FormGroupDirective } from '@angular/forms';
import { HttpService } from '../../../../../services/http-service';
import { Router } from '@angular/router';
import { UploadFile } from '../../../../../services/uploadFile.service';
import { SnackBarComponent } from '../../../../..//shared/components/snack-bar/snack-bar.component';
import { MatSnackBar } from '@angular/material';
import { environment } from 'src/environments/environment';
// import { timingSafeEqual } from 'crypto';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material';
import { ErrorStateMatcher } from '@angular/material/core';
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}
export interface Keyword {
  name: string;
}
@Component({
  selector: 'add-card-template',
  templateUrl: './add-card-template.component.html',
  styleUrls: ['./add-card-template.component.scss']
})

export class AddCardTemplateComponent implements OnInit {

//giftcard changes
APIBaseURL: 'https://zp787p79v0.execute-api.ap-south-1.amazonaws.com/';
APIBaseProjectName: 'sit';

  public breadCrumbData: Array<Object> = [{
    title: 'Home',
    link: ''
  },
  {
    title: 'Gift Cards Management',
    link: ''
  },
  {
    title: 'Cards Template',
    link: '/search-card-template'
  }
  ];

 

  @ViewChild('uploadImgEl') uploadImgElRef: ElementRef;
  public statusValue: string = 'ONLINE';
  programFormGroup: FormGroup;
  public languageList = JSON.parse(localStorage.getItem("languageList"));
  programLocales;
  alignCss = [];
  public imagePath = [];
  public imagePathLogo = [];
  public filePathUrl = localStorage.getItem('imgBaseUrl');
  public filePathUrlLogo = localStorage.getItem('imgBaseUrl');
  public imageUploading: boolean = false;
  public showImageError: boolean = false;
  public imgUpload = false;
  keywords = [];
  keywordStatus: boolean = true;
  public tempNames: any = [];
  public langId: any;
  public loading = false;
  public appearCheckbox: boolean;
  public imgNotEmpty: boolean = false;
  public imgNotEmpty1: boolean = false;
  public toggleVal:boolean=true;
  ImageData;
  disabled=true;
  MissingKeys=false;
  keywordErrorMsg=false;
  keywordArray=[];
  requiredKeywordError=false;
  keywordEmptyErrors=false;
  constructor(private fb: FormBuilder, private http: HttpService,
    private router: Router, public snackBar: MatSnackBar, private uploadFile: UploadFile) {
    this.buildGiftCardForm();
  }

  ngOnInit() {
    

  }

  // addKeyword(event: MatChipInputEvent, index): void {
  //   const input = event.input;
  //   const value = event.value;

  //   if(value==''){
  //     this.keywordEmptyErrors = true;
  //   }else{
  //     this.keywordArray.push(value);
  //     if (input) {
  //       input.value = '';
  //     }
  //     this.keywordEmptyErrors = false;
  //   }

  // }
  addKeyword(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;
    
   
    if (value != '') {

        if(this.keywordArray.length>=5){
          this.keywordErrorMsg = true;
          setTimeout(() => {
            input.value = '';
            this.keywordErrorMsg = false;
        }, 2000);
      }else{
        this.keywordErrorMsg= false;
        if ((value || '').trim()) {
          if(this.keywordArray.includes(value.trim())){
            this.requiredKeywordError = true;
            setTimeout(() => {
              input.value = '';
              this.requiredKeywordError = false;
          }, 2000);

          }else{
            this.keywordArray.push(value.trim());
            this.requiredKeywordError = false;
          this.keywordEmptyErrors = false;
          }
          
        }
        if (input) {
          input.value = '';
        }
      }
    
      }  
  
  }
  removeKeyword(keyword: Keyword): void {
    const index = this.keywordArray.indexOf(keyword);

    if (index >= 0) {
      this.keywordArray.splice(index, 1);
    }
  }
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];

  buildGiftCardForm() {
    let form = {
      templateFor: ["", Validators.compose([Validators.required])],
      keywords: ["", Validators.compose([Validators.required])],
      addGiftCardList: this.fb.array([])
    }
  
    // this.imagePath.push('');
    
    this.programFormGroup = this.fb.group(form);
   
    this.getLangauges();
  }



  public toggleStatus(event) {
    if (event.checked == true) {
      this.statusValue = 'ONLINE';
    } else {
      this.statusValue = 'OFFLINE';
    }
  }



  public fillData(i, formData) {
    this.imagePathLogo[i] = this.imagePathLogo[0] == "" || 'undefined' ? "" : this.imagePathLogo[0],
      this.imagePath[0] = this.imagePath[0] == "" || 'undefined' ? "" : this.imagePath[0],
      formData.addGiftCardList[0].headingMessage1 = formData.addGiftCardList[0].headingMessage1
      formData.addGiftCardList[0].headingMessage2 = formData.addGiftCardList[0].headingMessage2,
      formData.addGiftCardList[0].textMessage  = formData.addGiftCardList[0].textMessage,
      formData.addGiftCardList[0].textColor = formData.addGiftCardList[0].textColor,
      formData.addGiftCardList[0].backGroundColor = formData.addGiftCardList[0].backgroundColor
  }

  public addCard(formData) {
    if(this.keywordArray.length<=0){
      this.keywordEmptyErrors=true;
    }
    this.programFormGroup.controls['keywords'].patchValue(this.keywordArray)
    if(this.programFormGroup.invalid){
      // console.log(this.programFormGroup);
     
      
    }else{    
    let cardLocales = [];
    for (let i = 0; i < this.languageList.length; i++) {
      let obj = {
        templateName: formData.addGiftCardList[i].templateName.trim(),
        logoImage: formData.addGiftCardList[i].imagePathLogo ,
        backgroundImage: formData.addGiftCardList[i].imagePath ,
        headingMessage1: formData.addGiftCardList[i].headingMessage1,
        headingMmessage2: formData.addGiftCardList[i].headingMessage2,
        textMessage: formData.addGiftCardList[i].textMessage,
        textColor: formData.addGiftCardList[i].textColor,
        backgroundColor: formData.addGiftCardList[i].backgroundColor,
        languageCode : this.languageList[i]['languageCode'],
      }
      cardLocales.push(obj);
    }
    let RequestData = {
      templates: cardLocales,
      keywords: this.keywordArray,
      // templateId: 5,
      status: this.statusValue,
      templateFor: formData.templateFor
    }
    // console.log(JSON.stringify(RequestData));

    

    let TEMPURL = 'https://zp787p79v0.execute-api.ap-south-1.amazonaws.com/cardtemplate_sit/rest/api/v1/gc_template/Create_Card_Template';
    // let TEMPURL = environment.APIBaseURL+'cardtemplate_'+environment.APIBaseProjectName+'/rest/api/v1/gc_template/Create_Card_Template';
    // let data = {
    //   languageCode: "EN"
    // }
 
    return this.http.postCustomizeJson(TEMPURL, RequestData)
      .subscribe((response) => {
        // console.log(response);
                  this.snackBar.openFromComponent(SnackBarComponent, {
              duration: 10000,
              data: {
                status: "success",
                message: "Card Template  Saved successfully"
              }
            });
            this.loading = false;
            this.router.navigate(["search-card-template"]);
            }  ,
          err => {
            // console.log(err)
            this.snackBar.openFromComponent(SnackBarComponent, {
              duration: 3000,
              data: {
                status: "failure",
                message: err.error.Error_message
              }
            });
  
  
          });
        }
  
    }

  public uploadLogo(event: FileList, i) {
    this.imageUploading = true;
    if (
      event[0].type == "image/jpeg" ||
      event[0].type == "image/png" ||
      event[0].type == "image/jpg" 
      // event[0].type == "image/gif" ||
      // event[0].type == "image/tiff" ||
      // event[0].type == "image/svg+xml"
    ) {
      if (event[0].size < 1000000) {
        this.uploadFile
          .uploadIMG(event.item(0), "onboarding",  event[0].type)
          .subscribe(
            response => {

             
              this.programFormGroup.controls['addGiftCardList']['controls'][i]['controls']['imagePathLogo'].patchValue(response["Saved Location"])
              this.imagePathLogo[i] = response["Saved Location"];
              this.ImageData = this.imagePathLogo[i];
              if (this.ImageData!=undefined || this.ImageData !=''){
                this.imgNotEmpty1=true;
              }else{
                this.imgNotEmpty1=false;
              }
              // this.programFormGroup.controls['addGiftCardList']['controls'][0]['controls']['imagePathLogo'].patchValue(Value);
              this.imageUploading = false;
              this.snackBar.openFromComponent(SnackBarComponent, {
                duration: 1500,
                data: {
                  status: "success",
                  message: "image successfully uploaded"
                }
              });
            },
            err => {

              if (err.error.errorDetails[0].description = "Valid extension is required") {
                this.snackBar.openFromComponent(SnackBarComponent, {
                  duration: 10000,
                  data: {
                    status: "failure",
                    message: "Please upload PNG or SVG format image"
                  }
                });
              }
              else {
                // console.log(err)
              }
            }
          );
      }

      else if (event[0].size > 1000000) {
        this.snackBar.openFromComponent(SnackBarComponent, {
          duration: 10000,
          data: {
            status: "failure",
            message: "File size is large"

          }
        });
      }
    }

    else {
      this.snackBar.openFromComponent(SnackBarComponent, {
        duration: 10000,
        data: {
          status: "failure",
          message: "invalid file type"

        }
      });
    }
  }

  public uploadImage(event: FileList, i) {
    this.imageUploading = true;
    if (
      event[0].type == "image/jpeg" ||
      event[0].type == "image/png" ||
      event[0].type == "image/jpg" 
      // event[0].type == "image/gif" ||
      // event[0].type == "image/tiff" ||
      // event[0].type == "image/svg+xml"
    ) {
      if (event[0].size < 1000000) {
        this.uploadFile
          .uploadIMG(event.item(0), "onboarding",  event[0].type)
          .subscribe(
            response => {
              // console.log(response);
             
              this.programFormGroup.controls['addGiftCardList']['controls'][i]['controls']['imagePath'].patchValue(response["Saved Location"])
              this.imagePath[i] = response["Saved Location"];
              this.ImageData = this.imagePath[i];
              if (this.ImageData!=undefined || this.ImageData !=''){
                this.imgNotEmpty=true;
              }else{
                this.imgNotEmpty=false;
              }
              this.imageUploading = false;
              this.snackBar.openFromComponent(SnackBarComponent, {
                duration: 1500,
                data: {
                  status: "success",
                  message: "image successfully uploaded"
                }
              });
            },
            err => {
              if (err.error.errorDetails[0].description = "Valid extension is required") {
                this.snackBar.openFromComponent(SnackBarComponent, {
                  duration: 10000,
                  data: {
                    status: "failure",
                    message: "Please upload PNG or SVG format image"
                  }
                });
              }
              else {
                // console.log(err)
              }
            }
          );
      }

      else if (event[0].size > 1000000) {
        this.snackBar.openFromComponent(SnackBarComponent, {
          duration: 10000,
          data: {
            status: "failure",
            message: "File size is large"

          }
        });
      }
    }

    else {
      this.snackBar.openFromComponent(SnackBarComponent, {
        duration: 10000,
        data: {
          status: "failure",
          message: "invalid file type"

        }
      });
    }
  }

  getLangauges() {
    for (let i = 0; i < this.languageList.length; i++) {
      const control = <FormArray>this.programFormGroup.controls['addGiftCardList'];
      let newGroup = this.fb.group({
        headingMessage1: ["", Validators.compose([Validators.required])],
        headingMessage2: [""],
        textMessage: ["", Validators.compose([Validators.required])],
        textColor: '#979595',
        backgroundColor: '#000000',
        imagePathLogo:[""],
        imagePath:[""],
        templateName: ['', Validators.compose([Validators.required])]
        // languageName: this.languageList[i]['languageName']
      });
      control.push(newGroup);
     
      this.requiredKeywordError=false;  
      this.alignCss.push(this.languageList[i].direction == 'RTL' ? 'text-right' : '');
    }
  }

  ReflectImage(i) {

    let Textcolor = this.programFormGroup.controls['addGiftCardList']['controls'][0]['controls']['textColor'].value;
    let backgroundColor=this.programFormGroup.controls['addGiftCardList']['controls'][0]['controls']['backgroundColor'].value ;
    let logoImage= this.programFormGroup.controls['addGiftCardList']['controls'][0]['controls']['imagePathLogo'].value ;
    let backgroundImage = this.programFormGroup.controls['addGiftCardList']['controls'][0]['controls']['imagePath'].value ;
     this.programFormGroup.controls['addGiftCardList']['controls'][i+1]['controls']['textColor'].patchValue(Textcolor);
     this.programFormGroup.controls['addGiftCardList']['controls'][i+1]['controls']['backgroundColor'].patchValue(backgroundColor);
     this.programFormGroup.controls['addGiftCardList']['controls'][i+1]['controls']['imagePathLogo'].patchValue(logoImage);
     this.programFormGroup.controls['addGiftCardList']['controls'][i+1]['controls']['imagePath'].patchValue(backgroundImage);
     
  }


}
