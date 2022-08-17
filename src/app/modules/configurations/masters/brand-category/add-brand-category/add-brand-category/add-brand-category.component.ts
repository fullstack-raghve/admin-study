import {Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import {FormControl, Validators, FormBuilder, FormGroup, NgForm, FormGroupDirective, FormArray,} from '@angular/forms';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {MatChipInputEvent, MatSnackBar} from '@angular/material';
import { HttpService } from 'src/app/services/http-service';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { ErrorStateMatcher } from '@angular/material/core';
import { SnackBarComponent } from 'src/app/shared/components/snack-bar/snack-bar.component';
import { UploadFile } from 'src/app/services/uploadFile.service';
import { Globals } from 'src/app/services/global';
export class MyErrorStateMatcher implements ErrorStateMatcher {
    isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
        const isSubmitted = form && form.submitted;
        return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
    }
}



@Component({
  selector: 'add-brand-category',
  templateUrl: './add-brand-category.component.html',
  styleUrls: ['./add-brand-category.component.scss']
})
export class AddBrandCategoryComponent implements OnInit {
    public breadCrumbData: Array<Object> = [{
        title: 'Configurations',
        link: ''
    }, {
        title: 'Brand Category',
        link: '/search-brand-category'
    }
    ];
    @ViewChild("createBrandCategoryForm")createBrandCategoryForm;
    @ViewChild('uploadEl') uploadElRef: ElementRef;

    brandCategoryFormGroup:FormGroup;
    public showError: boolean = false;
    public loading: boolean = false;
    public showBrandError:boolean = false;
    public statusValue:string = 'ONLINE';
    public imageErrMsg;
    checked = true;
    disabled = false;
    categoryCode= new FormControl('', [Validators.required]);
    public showCurrencyError:boolean = false;
    public languageList =JSON.parse(localStorage.getItem("languageList"));
    public countryArr:any=[];
    public brandCategoryLocales:any=[];
    public arr:any=[];
    public imageUploading:boolean=false;
    public toggleVal:boolean=true;
    public imagePath:string='';
    public imgUpload = false;
    public showImageError:boolean=false;
    public filePathUrl=localStorage.getItem('imgBaseUrl');
    public alignCss=[];



    constructor(private fb: FormBuilder,private http:HttpService,
        private router: Router, public snackBar: MatSnackBar, private uploadFile: UploadFile,) {
            this.buildCreateBrandCategoryForm();
    }
    //image upload

    url:any = '';
    onSelectFile(event) {

      if (event.target.files && event.target.files[0]) {
          this.imgUpload = true;
        var reader = new FileReader();

        reader.readAsDataURL(event.target.files[0]); // read file as data url

        reader.onload = (event) => { // called once readAsDataURL is completed
          // this.url = event.target.result;
          this.url = <string>reader.result;

        }
      }
    }
    ngOnInit() {
        this.brandCategoryLocale();



    }
    public buildCreateBrandCategoryForm(){
        let form = {
            brandCategoryArr:this.fb.array([]),
            categoryCode : ["",  Validators.compose([Validators.required, Validators.minLength(2), Validators.pattern("^[A-Za-z0-9]{1,10}$")])],
            status:[false],
        }
        this.brandCategoryFormGroup=this.fb.group(form);
    }
    public brandCategoryLocale(){

        const control = <FormArray>this.brandCategoryFormGroup.controls['brandCategoryArr'];
        for (let ln of this.languageList) {
            let arr= this.fb.group({
                 brandCategoryName: ['',Validators.compose([Validators.required, Validators.minLength(2),Validators.pattern(Globals.mulRegExpOnlyAlphaWithSplChar)])]
            });
            control.push(arr);
             this.alignCss.push(ln.direction == 'RTL' ? 'text-right' : '');
        }
    }

    public createBrandCategory(formData){
        this.brandCategoryLocales=[];
        if (this.brandCategoryFormGroup.invalid == true) {
            this.showError = true;
        }else if(this.imagePath==''){
            this.showImageError=true;
        }
        else {
            this.loading = true;
            this.showError = false;
            formData.brandCategoryArr.forEach((brandCat, index)=>{
                this.brandCategoryLocales.push({
                    categoryTitle:brandCat.brandCategoryName,
                     languageId:this.languageList[index].languageId
                })
            })

                let createCategoryReq = {
                    brandCategoryLocales:this.brandCategoryLocales,
                    categoryCode: formData.categoryCode,
                    categoryImgPath: this.imagePath,
                    status: this.statusValue
                }
                console.log("contryReq = "+createCategoryReq);
                let CREATE_BRAND_CATEGORY=environment.APIEndpoint+"api/rpa/master/brandCategory/v1/create";
                this.http.postJson(CREATE_BRAND_CATEGORY,createCategoryReq)
                .subscribe((response) => {
                    console.log(response);
                    this.snackBar.openFromComponent(SnackBarComponent, {
                        duration: 1500,
                        data: {
                            status: "success",
                            message: "Brand category master has been added successfully"
                        }
                    });
                    this.loading = false;
                    sessionStorage.clear();
                    this.router.navigate(['/search-brand-category']);
                }
                ,err => {
                    this.loading = false;
                    console.log("error Status = "+err);
                    if(err.error.errorType=='VALIDATION'){
                        this.snackBar.openFromComponent(SnackBarComponent, {
                            duration: 1500,
                            data: {
                                status: "failure",
                                message: err.error.errorDetails[0].description
                            }
                        });
                    }else{
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
    public toggleStatus(event){
        if(event.checked==true){
            this.statusValue='ONLINE';
        }else{
            this.statusValue='OFFLINE';
        }
    }
    public uploadImage(event: FileList) {
        this.imageUploading = true;
        if (event[0].size < 1000000){
        if(event[0].type == "image/jpeg" || event[0].type == "image/png" || event[0].type == "image/jpg" || event[0].type == "image/JPG" || event[0].type == "image/JPEG" || event[0].type == "image/PNG") {
              if (event[0].size < 1000000){
                  this.uploadFile.upload(event.item(0), 'brandCategory', 'images')
                .subscribe((response) => {
                    console.log(response);
                    this.imagePath=response['message'];
                    this.imageUploading = false;
                    this.showImageError=false;
                    this.uploadElRef.nativeElement.value = ''


                        console.log("res ::: "+response)
                        this.snackBar.openFromComponent(SnackBarComponent, {
                            duration: 1500,
                            data: {
                                status: "success",
                                message: " image successfully uploaded"
                            }
                        });


                },err => {


                        this.snackBar.openFromComponent(SnackBarComponent, {
                                duration: 10000,
                                data: {
                                    status: "failure",
                                    message: "Internal server error"
                                }
                            });
                    }


            )
        }else{
            this.imageUploading=false;
            this.imageErrMsg = "Max upload file size is 1Mb";

        }
        }else{
            this.snackBar.openFromComponent(SnackBarComponent, {
                    duration: 10000,
                    data: {
                        status: "failure",
                        message: "Supported format is JPG, JPEG and PNG"
                    }
                });
        }
    }else{
        this.imagePath='';
        this.snackBar.openFromComponent(SnackBarComponent, {
                duration: 10000,
                data: {
                    status: "failure",
                    message: "Max upload file size is 1Mb"
                }
            });
    }
    }
    removeImage(){
        this.imagePath='';
    }

}
