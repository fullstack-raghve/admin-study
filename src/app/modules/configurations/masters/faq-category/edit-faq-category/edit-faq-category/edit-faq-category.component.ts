import { Component, OnInit, ViewChild } from '@angular/core';
import { Validators, FormBuilder, FormGroup, FormArray} from '@angular/forms';
import { MatSnackBar} from '@angular/material';
import { HttpService } from 'src/app/services/http-service';
import { environment } from 'src/environments/environment';
import { Router, ActivatedRoute } from '@angular/router';
import { UploadFile } from 'src/app/services/uploadFile.service';
import { SnackBarComponent } from 'src/app/shared/components/snack-bar/snack-bar.component';
import { Globals } from 'src/app/services/global';

@Component({
  selector: 'app-edit-faq-category',
  templateUrl: './edit-faq-category.component.html',
  styleUrls: ['./edit-faq-category.component.scss']
})
export class EditFaqCategoryComponent implements OnInit {
    public breadCrumbData: Array<Object> = [{
      title: 'Configurations',
      link: ''
      }, {
          title: 'FAQ Category',
          link: '/search-country'
      }
    ];

  @ViewChild("createFaqForm")createFaqForm;
  editFaqGroup: FormGroup;
  items: FormArray;
  public showError: boolean = false;
  public loading: boolean = false;
  public showCountryError: boolean = false;
  public imagePath = [];
  public uploadFlag=[];
  public faqCategoryLocales = [];
  public toggleVal;
  checked = true;
  public imageUploading: boolean = false;
  disabled = false;
  public imgUpload = false;
  public imageErr = [];
  public imageErrMsg = [];
  public viewFAQ;
  public faqId;
  public buildFlag = false;
  //public filePathUrl = environment.APIEndpoint + 'img/';
  public filePathUrl = localStorage.getItem("imgBaseUrl");
  alignCss = [];

  constructor(private fb: FormBuilder, private http: HttpService,
    private uploadFile: UploadFile, public snackBar: MatSnackBar,
    private https: HttpService, private activatedRoute: ActivatedRoute, private router: Router)  {
      // this.activatedRoute.params.subscribe((params) => {
      //   this.faqId = params.id;
      // });

  }
  ngOnInit() {
    let form = {
      faqFormArray:this.fb.array([]),
    }
    this.editFaqGroup=this.fb.group(form);
    // this.getViewData();
    let  data=localStorage.getItem('FaqEditID');
    if(data){
      this.faqId=data;
      this.getViewData();
    }else{
      sessionStorage.clear();
      this.router.navigate(['/search-faq-category'])
    }
   

  }

    getViewData(){
        let data={
          "faqCategoryId" : this.faqId
        }

        this.http.postJson(environment.APIEndpoint+"api/rpa/faq/category/v1/view", data).subscribe(res=>{
          console.log(res);
          this.viewFAQ=res["faqCategoryLocales"];
          this.toggleVal = res["status"] == "ONLINE" ? true : false;
          for(let i=0; i<this.viewFAQ.length; i++){

            this.alignCss.push(this.viewFAQ[i].languageDirection == 'RTL' ? 'text-right' : '');
         }
         // for (let v of this.viewFAQ){
         //   console.log(v);
         // }

          this.buildCreateFaqForm(this.viewFAQ);
        });
    }

    public buildCreateFaqForm(viewData){
      if(viewData.length == 0){
        let form = {
          faqFormArray:this.fb.array([])
          }
          this.editFaqGroup=this.fb.group(form);
        }else{
          this.buildFlag=true;
          this.editFaqGroup= this.fb.group({
            faqFormArray: this.fb.array([])
          })
       for(let i=0;i<this.viewFAQ.length;i++){
         if( this.viewFAQ[i].imagePath==''){
           this.uploadFlag[i]=false;
         }else{
           this.uploadFlag[i]=true;
           this.imagePath[i] = this.viewFAQ[i].imagePath;
         }

        const control = <FormArray>this.editFaqGroup.controls['faqFormArray'];
          let newGroup = this.fb.group({
            faqTitle: [this.viewFAQ[i].faqCategoryTitle, Validators.compose([Validators.required,Validators.minLength(2),Validators.pattern(Globals.regCustomwhiteList)])],
            faqCategoryImage:[]
       });
        control.push(newGroup);


        }
      }

    }

    updateFaq(formData) {
      if (this.editFaqGroup.invalid == true) {
        this.showError = true;
      }
      else {
          this.showError = false;
          this.faqCategoryLocales = []
          for(var i=0; i<formData.faqFormArray.length; i++) {
            let obj = {
              languageId: this.viewFAQ[i].languageId,
              faqCategoryTitle: formData.faqFormArray[i].faqTitle,
              imagePath: this.imagePath[i]
            }
            this.faqCategoryLocales.push(obj)
          }
          let data = {
            faqCategoryId : this.faqId,
            status: this.toggleVal == true ? "ONLINE" : "OFFLINE",
            faqCategoryLocales: this.faqCategoryLocales
          }
      this.https.postJson(environment.APIEndpoint + "api/rpa/faq/category/v1/update", data).subscribe(res => {
        this.snackBar.openFromComponent(SnackBarComponent, {
          duration: 1500,
          data: {
            status: "success",
            message: "FAQ Category master has been updated successfully"
          }
        });
        sessionStorage.clear();
        this.router.navigate(['/search-faq-category'])
      }, err => {
        for( let i of err.error.errorDetails){
          this.snackBar.openFromComponent(SnackBarComponent, {
            duration: 1500,
            data: {
              status: "failure",
              message: i.description
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
      const control = this.editFaqGroup.get('faqFormArray') as FormArray;
      control.at(index).get('faqCategoryImage').setValue('');
    }
}
