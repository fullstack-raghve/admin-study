import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormControl,Validators, FormBuilder,FormGroupDirective,NgForm, FormGroup, FormArray } from '@angular/forms';
import { HttpService } from '../../../../../services/http-service';
import { Router, ActivatedRoute } from '@angular/router';
import { UploadFile } from '../../../../../services/uploadFile.service';
import { SnackBarComponent } from '../../../../..//shared/components/snack-bar/snack-bar.component';
import { MatSnackBar } from '@angular/material';
import { environment } from 'src/environments/environment';
import { MatChipInputEvent } from '@angular/material';
import { ErrorStateMatcher } from '@angular/material/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';

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
  selector: 'edit-card-template',
  templateUrl: './edit-card-template.component.html',
  styleUrls: ['./edit-card-template.component.scss']
})
export class EditCardTemplateComponent implements OnInit {

  //giftcard changes
// APIBaseURL: 'https://zp787p79v0.execute-api.ap-south-1.amazonaws.com/';
// APIBaseProjectName: 'sit';

  public breadCrumbData: Array<Object> = [{
    title: 'Home',
    link: ''
  }, {
    title: 'Gift Cards Management',
    // link: '/view-client-on-boarding'
  },
  {
    title: 'Cards Template',
    link: ''
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
  public textColor1: any = [];
  public backgroundColor1: any = [];
  // keywords = [];
  keywordStatus: boolean = false;
  public tempNames: any = [];
  public langId: any;
  public loading = false;
  public appearCheckbox: boolean;
  public toggleVal: boolean = true;
  ImageData;
  storeId: any;
  ViewJson: any[];
  keywords: any;
  TemplateData: any;
  TemplateFor: any;
  lastIndex:any;
  keywordErrorMsg: boolean;
  keywordArray=[];
  requiredKeywordError: boolean;
  keywordEmptyErrors: boolean;
  public imgNotEmpty: boolean = false;
  public imgNotEmpty1: boolean = false;
  loadingResponse=true;
  // public nonEditable: boolean = false;
  constructor(private fb: FormBuilder, public snackBar: MatSnackBar, private uploadFile: UploadFile, private http: HttpService,
    private router: Router, private activatedRoute: ActivatedRoute, ) {
      this.activatedRoute.params.subscribe((params) => {
        this.storeId = params.id;
  
      })
  }

  ngOnInit() {
    this.getData();
  }

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
  getData() {
    let TEMPURL = 'https://zp787p79v0.execute-api.ap-south-1.amazonaws.com/cardtemplate_sit/rest/api/v1/gc_template/Get_Templates_By_ID';
    // let TEMPURL = environment.APIBaseURL+'cardtemplate_'+environment.APIBaseProjectName+'/rest/api/v1/gc_template/Get_Templates_By_ID';
    let data = {
      "templateId":this.storeId
    }
    return this.http.postCustomizeJson(TEMPURL, data)
      .subscribe((response) => {
        let value = response;
        // console.log(value);
        this.ViewJson = response;
        this.keywords = value['Output']['keywords'];
        this.keywordArray = value['Output']['keywords']
        this.TemplateData = value['Output']['templates'];
        this.TemplateFor = value['Output']['templateFor'];
        let statusValue = value['Output']['status'];
        this.loadingResponse=false;
        if(this.keywords.length <= 5){
          this.keywordStatus = true;
        }else{ 
          this.keywordStatus = false;
        }

        if (statusValue == 'ONLINE') {
          this.statusValue = statusValue;
          this.toggleVal = true;
        } else {
          this.statusValue = statusValue;
          this.toggleVal = false;
        }
        this.buildGiftCardForm(value['Output']);


      },
        (error) => {
          // console.log(error);

        });
  }

  public toggleStatus(event) {
    if (event.checked == true) {
      this.statusValue = 'ONLINE';
    } else {
      this.statusValue = 'OFFLINE';
    }
  }
  buildGiftCardForm(editData) {

    if (editData.templateFor == undefined) {
      let form = {

        templateFor: [[''], Validators.compose([Validators.required])],
        keywords: [[''], Validators.compose([Validators.required])],
        addGiftCardList: this.fb.array([])
      }
      this.programFormGroup = this.fb.group(form);
    } else {


      this.programFormGroup = this.fb.group({
        keywords: [this.keywords, Validators.compose([Validators.required])],
        templateFor: [this.TemplateFor, Validators.compose([Validators.required])],
        addGiftCardList: this.fb.array([]),

      })
      // this.giftCardLangFormArray();
      this.programFormGroup.controls['templateFor'].patchValue(this.TemplateFor)
      this.addGiftCardList();

      // this.programFormGroup.updateValueAndValidity();
      // console.log(this.programFormGroup);
    }


  }

  public addGiftCardList() {
    const control = <FormArray>this.programFormGroup.controls['addGiftCardList'];
    for (let i = 0; i < this.TemplateData.length; i++) {
      let newForm = this.fb.group({
        headingMessage1: [this.TemplateData[i]['headingMessage1'], Validators.compose([Validators.required])],
        headingMessage2: this.TemplateData[i]['headingMmessage2'],
        textMessage: [this.TemplateData[i]['textMessage'], Validators.compose([Validators.required])],
        textColor: this.TemplateData[i]['textColor'],
        backgroundColor: this.TemplateData[i]['backgroundColor'],
        imagePathLogo: this.TemplateData[i]['logoImage'],
        imagePath: this.TemplateData[i]['backgroundImage'],
        templateName: [this.TemplateData[i]['templateName'], Validators.compose([Validators.required])],
        languageCode: this.TemplateData[i]['languageCode'],
        languageName: this.TemplateData[i]['languageName']
      });
      control.push(newForm);
      let Object1 = {
        languageCode: this.TemplateData[i]['languageCode'],
        languageName: this.TemplateData[i]['languageName']
      }
      this.languageList.push(Object1);

      this.imagePath.push(this.TemplateData[i]['backgroundImage']);
      this.imagePathLogo.push(this.TemplateData[i]['logoImage']);
       this.alignCss.push(this.languageList[i].direction == 'RTL' ? 'text-right' : '');
    }

    if(this.imagePathLogo.length>0){
      this.imgNotEmpty1=true;
    }else{
      this.imgNotEmpty1=false;
    }
    if(this.imagePath.length>0){
      this.imgNotEmpty=true;
    }else{
      this.imgNotEmpty=false;
    }
  }

  public uploadLogo(event: FileList, i) {
    this.imageUploading = true;
    if (
      event[0].type == "image/jpeg" ||
      event[0].type == "image/png" ||
      event[0].type == "image/jpg" 
 
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
 
  UpdateCard(formData) {
    if(this.keywordArray.length<=0){
      this.keywordEmptyErrors=true;
    }
    if (this.programFormGroup.invalid) {
     
    }
    else {
      let cardLocales = [];
      for (let i = 0; i <= this.TemplateData.length - 1; i++) {
        let obj = {
          templateName: formData.addGiftCardList[i].templateName,
          logoImage: this.imagePathLogo[i],
          backgroundImage: this.imagePath[i],
          headingMessage1: formData.addGiftCardList[i].headingMessage1,
          headingMmessage2: formData.addGiftCardList[i].headingMessage2,
          textMessage: formData.addGiftCardList[i].textMessage,
          textColor: formData.addGiftCardList[i].textColor,
          backgroundColor: formData.addGiftCardList[i].backgroundColor,
          languageCode: formData.addGiftCardList[i].languageCode,
          languageName: formData.addGiftCardList[i].languageName,
          subTemplatesId: this.TemplateData[i]['subTemplatesId']
        }

        cardLocales.push(obj);
      }
      let RequestData = {
        templates: cardLocales,
        keywords: this.keywordArray,
        // templateId: 5,
        status: this.statusValue,
        templatesMainId: this.storeId
      }
      // console.log(JSON.stringify(RequestData));
      // let TEMPURL = environment.APIBaseURL+'cardtemplate_'+environment.APIBaseProjectName+'/rest/api/v1/gc_template/Update_Card_Template';
      let TEMPURL = 'https://zp787p79v0.execute-api.ap-south-1.amazonaws.com/cardtemplate_sit/rest/api/v1/gc_template/Update_Card_Template';
      // let data = {
      //   languageCode: "EN"
      // }

      return this.http.postCustomizeJson(TEMPURL, RequestData)
        .subscribe((response) => {

          let value = response['Output'];
          if(value == 'Gift Card Template details updated successfully'){
          // console.log(response);
                    this.snackBar.openFromComponent(SnackBarComponent, {
                duration: 10000,
                data: {
                  status: "success",
                  message: "Card Template updated successfully"
                }
              });
              this.loading = false;
              this.router.navigate(["search-card-template"]);
            }
            else if (value=="Template name should not be duplicates"){
                 this.snackBar.openFromComponent(SnackBarComponent, {
                duration: 10000,
                data: {
                  status: "failure",
                  message: "Template name should not be duplicates"
                }
              })
            
            }
            else{
              this.snackBar.openFromComponent(SnackBarComponent, {
                duration: 10000,
                data: {
                  status: "failure",
                  message: "Template name already exists"
                }
              })
            }
            
          },
          (error) => {
            console.log(typeof(error));
             this.snackBar.openFromComponent(SnackBarComponent, {
              duration: 10000,
              data: {
                status: 'failure',
                message: error.error['Error_message']
              }
            });
          }
          )
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
