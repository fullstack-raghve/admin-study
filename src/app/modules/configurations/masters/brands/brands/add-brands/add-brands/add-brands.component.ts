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
export class MyErrorStateMatcher implements ErrorStateMatcher {
    isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
        const isSubmitted = form && form.submitted;
        return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
    }
}

export interface Cuisine {
  name: string;
}
@Component({
  selector: 'add-brands',
  templateUrl: './add-brands.component.html',
  styleUrls: ['./add-brands.component.scss']
})
export class AddBrandsComponent implements OnInit {
    public breadCrumbData: Array<Object> = [{
      title: 'Configurations',
      link: ''
      }, {
          title: 'Brand',
          link: '/search-brands'
      }
    ];
    brandFormGroup:FormGroup;
    public showError: boolean = false;
    public showBrandImageError:boolean = false;
    public loading: boolean = false;
    public showBrandError:boolean = false;
    public statusValue:string = 'ONLINE';
    checked = true;
    disabled = false;
    brandName= new FormControl();
    brandCode = new FormControl('', [Validators.required]);
    public imgUpload = false;
    visible = true;
    selectable = true;
    removable = true;
    addOnBlur = true;
    readonly separatorKeysCodes: number[] = [ENTER, COMMA];
    cuisines = [];
    public imageUploading:boolean=false; 
    @ViewChild('brandImgFile') uploadElRef: ElementRef;
    public brandImagePath:string = '';
    public filePathUrl = localStorage.getItem("imgBaseUrl");
    public languageList =JSON.parse(localStorage.getItem("languageList"));
    alignCss = [];
    public toggleVal:boolean=true;
    public brand;
   


     getErrorMessageCode() {
      return this.brandCode.hasError('required') ? 'Please enter a value' :
          this.brandCode.hasError('brandCode') ? 'Not a valid currency' :
              '';
    }

    brandCategories;

    brandList: string[] = ['Select All', 'Accessories','Fashion', 'Cosmetics', 'Departmental Store'];

    constructor(private fb: FormBuilder,private http:HttpService,
    private router: Router,
    private https: HttpService,
    private uploadFile: UploadFile,
    public snackBar: MatSnackBar,){
        this.buildCreateBrandForm();
    }

    baseUrl:any = '';
    brandImage(event) {
      if (event.target.files && event.target.files[0]) {
          this.imgUpload = true;
        var reader = new FileReader();
        reader.readAsDataURL(event.target.files[0]);
        reader.onload = (event) => {
          this.baseUrl = <string>reader.result;

        }
      }
    }


    public toggleStatus(event){
        if(event.checked){
            this.statusValue='ONLINE';
        }else{
             this.statusValue='OFFLINE';
        }
  
    }

    add(event: MatChipInputEvent): void {
      const input = event.input;
      const value = event.value;

      // Add our cuisine
      if ((value || '').trim()) {
        this.cuisines.push(value.trim());
      }

      // Reset the input value
      if (input) {
        input.value = '';
      }
    }

    remove(cuisine: Cuisine): void {
      const index = this.cuisines.indexOf(cuisine);

      if (index >= 0) {
        this.cuisines.splice(index, 1);
      }
    }


      ngOnInit() {
        this.getBrandCategories();
        this.brandNameArray();

      }
      public buildCreateBrandForm(){
          let form = {
                brandNameArray:this.fb.array([]),
                brandCode : ["",Validators.required],
                brandCategories: ["",Validators.required],
                priceForTwo:['',Validators.required], 
                cuisine:['']
            }
            this.brandFormGroup=this.fb.group(form);
      }

      brandNameArray(){
        let control = <FormArray>this.brandFormGroup.controls['brandNameArray'];
        for(let i=0;i<this.languageList.length;i++){
          let form = this.fb.group({
              brandName:['',Validators.compose([Validators.required, Validators.minLength(2)])]
          });
          control.push(form);
          this.alignCss.push(this.languageList[i].direction == 'RTL' ? 'text-right' : '');
        }
  
      }

      getBrandCategories(){
        let GET_BRAND_CATEGORIES = "api/rpa/master/brandCategory/v1/get/categories"
        this.https.getJson(environment.APIEndpoint+GET_BRAND_CATEGORIES).subscribe(
            (response)=>{
                this.brandCategories = response;
            }
        );
    }

    
    public brandImg(event: FileList) {
      this.imageUploading = true;
      if (event[0].size < 1000000){
      if(event[0].type == "image/jpeg" || event[0].type == "image/png" || event[0].type == "image/jpg" ) {
          this.uploadFile.upload(event.item(0), 'brand', 'images')
              .subscribe((response) => {
                  console.log(response);
                  this.brandImagePath=response['message'];
                  this.imageUploading = false;
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
                  console.log("error Status = "+err);
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
                                  message: "Internal server error"
                              }
                          });
                  }
    
              }
          )
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
      this.brandImagePath='';
      this.snackBar.openFromComponent(SnackBarComponent, {
              duration: 10000,
              data: {
                  status: "failure",
                  message: "Max upload file size is 1Mb"
              }
          });
  }


    
    }

    removeBrandImage(){
      this.brandImagePath='';
    }


      createBrand(formData){
         this.brand = [];
        if (this.brandFormGroup.invalid == true) {
            this.showError = true;
            return 
          }

          formData.brandNameArray.forEach((brand, index) => {
            let locale={
                languageId:this.languageList[index].languageId,
                brandName:brand.brandName,
            }
            this.brand.push(locale);
        })
        let requestBody = {
          brandCode:formData.brandCode,
          imagePath:this.brandImagePath,
          priceForTwo:formData.priceForTwo,
          cuisines:this.cuisines,
          brandLocales:this.brand,
          brandCategoryIds:formData.brandCategories,
          status:this.statusValue,
        }
    let CREATE_BRAND = environment.APIEndpoint +"api/rpa/master/brand/v1/create";
    this.https.postJson(CREATE_BRAND,requestBody).subscribe(
        (response)=>{
            console.log(response);
            this.snackBar.openFromComponent(SnackBarComponent, {
                duration: 10000,
                data: {
                    status: "success",
                    message: "Brand master has been added successfully"
                }
            });
            this.router.navigate(['/search-brands']);
        },
        (error)=>{
            console.log(error);
            if (error.error.errorType == 'VALIDATION') {
                this.snackBar.openFromComponent(SnackBarComponent, {
                    duration: 10000,
                    data: {
                        status: "failure",
                        message: error.error.errorDetails[0].description
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
        }
    );
      }
}
