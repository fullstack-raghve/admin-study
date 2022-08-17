import {Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import {FormControl, Validators, FormBuilder,FormArray, FormGroup, NgForm, FormGroupDirective,} from '@angular/forms';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {MatChipInputEvent, MatSnackBar} from '@angular/material';
import { HttpService } from 'src/app/services/http-service';
import { environment } from 'src/environments/environment';
import { Router, ActivatedRoute } from '@angular/router';
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
  selector: 'edit-brands',
  templateUrl: './edit-brands.component.html',
  styleUrls: ['./edit-brands.component.scss']
})
export class EditBrandsComponent implements OnInit {

    public breadCrumbData: Array<Object> = [{
      title: 'Configurations',
      link: ''
      }, {
          title: 'Brand',
          link: '/search-brands'
      }
    ];
    @ViewChild("editBrandForm")editBrandForm;
    public filePathUrl = localStorage.getItem("imgBaseUrl");
    public languageList =JSON.parse(localStorage.getItem("languageList"));
    brandFormGroup:FormGroup;
    public showError: boolean = false;
    public loading: boolean = false;
    public showBrandError:boolean = false;
    public statusValue:string = '';
    checked = true;
    disabled = false;
    public brandName;
    public imgUpload = false;
    visible = true;
    selectable = true;
    removable = true;
    addOnBlur = true;
    public brandId:number;
    public brandData;
    readonly separatorKeysCodes: number[] = [ENTER, COMMA];
    cuisines= [];
    public buildFlag=false;
    public alignCss=[];
    public brandCategoriesDetails;
    @ViewChild('brandImgFile') uploadElRef: ElementRef;
    public brandImagePath:string = '';
    public imageUploading:boolean=false;
    public brandCat = [];

    //  getErrorMessageCode() {
    //   return this.brandCode.hasError('required') ? 'Please enter a value' :
    //       this.brandCode.hasError('brandCode') ? 'Not a valid currency' :
    //           '';
    // }


    showBrandImagepathError: boolean = false;

    constructor(
      private fb: FormBuilder,
      private http:HttpService,
      private activatedRoute: ActivatedRoute,
      private router: Router,
      private https: HttpService,
      private uploadFile: UploadFile,
      public snackBar: MatSnackBar){
      this.activatedRoute.params.subscribe((params) => {
        this.brandId = params.id;

    });
    this.getBrandCategories();
    }


    getBrandCategories(){
      let GET_BRAND_CATEGORIES = "api/rpa/master/brandCategory/v1/get/categories"
      this.https.getJson(environment.APIEndpoint+GET_BRAND_CATEGORIES).subscribe(
          (response)=>{
              this.brandCategoriesDetails = response;
              console.log(response)

          }
      );
  }


    baseUrl:any = '';
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
                                  message: "Supported format is JPG, JPEG and PNG"
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
        this.getBrandById();
      }


      getBrandById(){
        let GET_BRAND_BY_ID = environment.APIEndpoint+"api/rpa/master/brand/v1/view";
        let request = {
            brandId:this.brandId
        }
        this.http.postJson(GET_BRAND_BY_ID,request)
        .subscribe((response) => {
                this.brandData= response;
                this.buildEditBrandForm(response);
                this.brandNameArray(response['brandLocales']);
                this.brandImagePath = response['imagePath'];
                this.cuisines = response['cuisines'];
                this.statusValue = response['status'];
                console.log(this.brandData);
            }
            ,(error) => {

            })
    }
      public buildEditBrandForm(editData){
        this.brandCat = editData.categories.map(function (item) {
          return item.categoryOid;
      })
        this.buildFlag = true
          let form = {
                priceForTwo:[editData.priceForTwo],
                brandCode : [editData.brandCode],
                brandNameArray:this.fb.array([]),
                brandCategories: [this.brandCat],
            }
            this.brandFormGroup=this.fb.group(form);
      }


      public brandNameArray(brandNameArray){
        const control = <FormArray>this.brandFormGroup.controls['brandNameArray'];
        for(let brand of brandNameArray){
            let newForm = this.fb.group({
             brandName:[brand.brandName,Validators.compose([Validators.required, Validators.minLength(2)])]
            });
            control.push(newForm);
            this.alignCss.push(brand.languageDirection == 'RTL' ? 'text-right' : '');
        }
      }


      public toggleStatus(event){
        if(event.checked){
            this.statusValue='ONLINE';
        }else{
             this.statusValue='OFFLINE';
        }
    }

      updateBrand(formData){
        this.brandName = [];
        if (this.brandFormGroup.invalid == true) {
          this.showError = true;
          return 
        }else if(this.brandImagePath==''){
            this.showBrandImagepathError=true;
        }
        formData.brandNameArray.forEach((brand,index) => {
          let locale={
            languageId:this.languageList[index].languageId,
            brandName:brand.brandName,
           
        }
        this.brandName.push(locale);
        });

        let requestBody = {
          brandId:this.brandId,
          brandCode:formData.brandCode,
          imagePath:this.brandImagePath,
          priceForTwo:formData.priceForTwo,
          cuisines:this.cuisines,
          brandLocales:this.brandName,
          brandCategoryIds:formData.brandCategories,
          status:this.statusValue
        }

        let UPDATE_BRAND = environment.APIEndpoint +"api/rpa/master/brand/v1/update";
        this.https.postJson(UPDATE_BRAND,requestBody).subscribe(
        (response)=>{
          console.log(response);
          this.snackBar.openFromComponent(SnackBarComponent, {
            duration: 1500,
            data: {
                status: "success",
                message: "Brand updated successfully"
            }
        });
          this.router.navigate(['/search-brands/']);
        },
        (error)=>{
          console.log(error);
        }
        );
      }


      
}
