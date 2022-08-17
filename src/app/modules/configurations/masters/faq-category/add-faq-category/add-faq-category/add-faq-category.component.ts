import { Component, OnInit, ViewChild } from '@angular/core';
import { Validators, FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { HttpService } from 'src/app/services/http-service';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { UploadFile } from 'src/app/services/uploadFile.service';
import { MatSnackBar } from '@angular/material';
import { SnackBarComponent } from 'src/app/shared/components/snack-bar/snack-bar.component';
import { Globals } from 'src/app/services/global';

@Component({
  selector: 'add-faq-category',
  templateUrl: './add-faq-category.component.html',
  styleUrls: ['./add-faq-category.component.scss']
})
export class AddFaqCategoryComponent implements OnInit {
  public breadCrumbData: Array<Object> = [{
    title: 'Configurations',
    link: ''
  }, {
    title: 'FAQ Category',
    link: '/search-country'
  }
  ];

  @ViewChild("createFaqForm") createFaqForm;
  addFaqGroup: FormGroup;
  addForm: FormGroup;
  rows: FormArray;
  itemForm: FormGroup;
  public showError: boolean = false;
  public loading: boolean = false;
  public showCountryError: boolean = false;
  public languageList = JSON.parse(localStorage.getItem("languageList"));
  public imagePath= [];
  public uploadFlag=[];
  public faqCategoryLocales = [];
  public toggleVal: boolean = true;
  checked = true;
  public imageUploading: boolean = false;
  disabled = false;
  public imgUpload = false;
  //public filePathUrl = environment.APIEndpoint + 'img/';
  public filePathUrl = localStorage.getItem("imgBaseUrl");
  public imageErr = [];
  public imageErrMsg = [];
  public alignCss = [];

  constructor(private fb: FormBuilder, private router: Router,
    private uploadFile: UploadFile, public snackBar: MatSnackBar,
    private https: HttpService) {
  }

  ngOnInit() {
    let form = {
      faqFormArray:this.fb.array([]),
    }
    this.addFaqGroup=this.fb.group(form);
    this.getLanguage();
  }

  getLanguage() {
            for(let i=0; i< this.languageList.length; i++){
                const control = <FormArray>this.addFaqGroup.controls['faqFormArray'];
                let newGroup = this.fb.group({
                  faqTitle: ["", Validators.compose([Validators.required,Validators.minLength(2),Validators.pattern(Globals.regCustomwhiteList)])],
                  faqCategoryImage :[]
                });
            control.push(newGroup);
            this.alignCss.push(this.languageList[i].direction == 'RTL' ? 'text-right' : '');
            this.uploadFlag.push(false);
            this.imagePath.push('');
        }
    }

    private markFormGroupTouched(formGroup: FormGroup) {
      (<any>Object).values(formGroup.controls).forEach(control => {
        control.markAsTouched();
        if (control.controls) {
          this.markFormGroupTouched(control);
        }
      });
    }

  createFaq(formData) {
    if (this.addFaqGroup.invalid == true) {
      this.markFormGroupTouched(this.addFaqGroup);
      this.showError = true;
    }
    else {
        this.loading = true;
        this.showError = false;
        this.faqCategoryLocales = []
        for(var i=0; i<formData.faqFormArray.length; i++) {
        let obj = {
          languageId: this.languageList[i].languageId,
          faqCategoryTitle: formData.faqFormArray[i].faqTitle,
          imagePath: this.imagePath[i]
        }
        this.faqCategoryLocales.push(obj)
      }
      let data = {
      status: this.toggleVal == true ? "ONLINE" : "OFFLINE",
      faqCategoryLocales: this.faqCategoryLocales
    }
    this.https.postJson(environment.APIEndpoint + "api/rpa/faq/category/v1/create", data).subscribe(res => {
      this.snackBar.openFromComponent(SnackBarComponent, {
        duration: 1500,
        data: {
          status: "success",
          message: "FAQ Category master has been added successfully"
        }
      });
      sessionStorage.clear();
      this.router.navigate(['/search-faq-category'])
    }, err => {
      this.loading = false;
      if(err.error.errorType=='VALIDATION'){
          this.snackBar.openFromComponent(SnackBarComponent, {
                  duration: 10000,
                  data: {
                      status: "failure",
                      message: err.error.errorDetails[0].description
                  }
              });
      }else{
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

  public uploadImage(event: FileList, i) {
    this.imageUploading = true;
    if (event[0].type == "image/jpeg" || event[0].type == "image/png" || event[0].type == "image/jpg") {
      if (event[0].size < 1000000){
        this.imageErr[i] = false;
        this.imageErrMsg[i] = "";this.uploadFile.upload(event.item(0), 'brandCategory', 'images')
        .subscribe((response) => {
          this.imagePath[i] = response['message'];
          this.uploadFlag[i]=true;
          this.imageUploading = false;
          this.snackBar.openFromComponent(SnackBarComponent, {
            duration: 1500,
            data: {
              status: "success",
              message: " image successfully uploaded"
            }
          });
        }, err => {
        })
      }else{
        this.imageErr[i] = true;
        this.imageErrMsg[i] = "Max upload file size is 1Mb";
      }
    }else{
      this.imageErr[i] = true;
      this.imageErrMsg[i] = "Supported format is JPG, JPEG and PNG";
    }
  }

  public removeImage(index){
    this.imagePath[index]="";
    this.uploadFlag[index]=false;
    const control = this.addFaqGroup.get('faqFormArray') as FormArray;
    control.at(index).get('faqCategoryImage').setValue('');
  }
}
