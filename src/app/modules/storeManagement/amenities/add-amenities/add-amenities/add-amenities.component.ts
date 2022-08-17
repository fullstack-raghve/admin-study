import {Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { HttpService } from 'src/app/services/http-service';
import { SnackBarComponent } from 'src/app/shared/components/snack-bar/snack-bar.component';
import { UploadFile } from 'src/app/services/uploadFile.service';
import {MatChipInputEvent, MatSnackBar} from '@angular/material';
import {FormControl, Validators, FormBuilder, FormGroup, NgForm, FormGroupDirective, FormArray,} from '@angular/forms';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'add-amenities',
  templateUrl: './add-amenities.component.html',
  styleUrls: ['./add-amenities.component.scss']
})
export class AddAmenitiesComponent implements OnInit {
  public breadCrumbData: Array<Object> = [{
    title: 'Store Management',
    link: ''
    }, {
        title: 'Amenities',
        link: ''
    }
    ];
  amenityFormGroup:FormGroup;
  public imageUploading:boolean=false;
  public statusValue:string = 'ONLINE';
  public imgUpload = false;
  public checked = true;
  public amenityLocale;
  public showError: boolean = false;
  public imageErrMsg;
  public filePathUrl=localStorage.getItem("imgBaseUrl");
  public loading: boolean = false;

  @ViewChild('amenityImgFile') uploadElRef: ElementRef;
  public imagePath:string = '';
  public languageList =JSON.parse(localStorage.getItem("languageList"));
  alignCss = [];
  public disabled ;
  selectStore = 0;
  BrandList=[];
  constructor(private sa: FormBuilder,private http:HttpService,
    private router: Router,
    private https: HttpService,
    private uploadFile: UploadFile,
    public snackBar: MatSnackBar,){
      this.buildCreateAmenityForm();
    }

  baseUrl:any = '';
  amenityIcon(event) {
    if (event.target.files && event.target.files[0]) {
        this.imgUpload = true;
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = (event) => {
        this.baseUrl = <string>reader.result;

      }
    }
  }
  ngOnInit() {
      this.getBrandList();
    this.amenityTitleArray();
  }

  public buildCreateAmenityForm(){
    let form = {
          amenityTitleArray:this.sa.array([]),
          brand:['']
      }
      this.amenityFormGroup=this.sa.group(form);
  }

  amenityTitleArray(){
    let control = <FormArray>this.amenityFormGroup.controls['amenityTitleArray'];
    for(let i=0;i<this.languageList.length;i++){
    let form = this.sa.group({
      amenityTitle:['',Validators.compose([Validators.required])],
    });
    control.push(form);
    this.alignCss.push(this.languageList[i].direction == 'RTL' ? 'text-right' : '');
    }

}

public amenityImg(event: FileList) {
    this.imageUploading = true;
    if (event[0].size < 1000000){
    if(event[0].type == "image/jpeg" || event[0].type == "image/png" || event[0].type == "image/jpg" ) {
        if (event[0].size < 1000000){
        this.uploadFile.upload(event.item(0), 'amenity', 'images')
            .subscribe((response) => {
                console.log(response);
                this.imagePath=response['message'];
                console.log(this.imagePath);
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

  removeAmenityImage(){
    this.imagePath='';
  }

  createAmenity(formData){
    this.amenityLocale = [];
    if (this.amenityFormGroup.invalid == true) {
        this.showError = true;
        return 
    } else {
        this.loading = true;
        this.showError = false;
    formData.amenityTitleArray.forEach((amenityLocale, index) => {
        let locale={
            languageOid:this.languageList[index].languageId,
            amenityTitle:amenityLocale.amenityTitle,
        }
        this.amenityLocale.push(locale);
    })
    // let storevalue;

    let requestBody = {
        amenityImagePath:this.imagePath,
        amenityLocales:this.amenityLocale,
        status:this.statusValue,
        brandOid:formData.brand,
        isApplyAllStore: this.selectStore
    }

    let CREATE_AMENITY = environment.APIEndpoint +"api/rpa/store/amenity/v1/create";
    this.https.postJson(CREATE_AMENITY,requestBody).subscribe(
        (response) => {
            console.log(response);
            this.snackBar.openFromComponent(SnackBarComponent, {
                    duration: 10000,
                    data: {
                        status: "success",
                        message: "Amenity created successfully"
                    }
            });
            this.loading = false;
            sessionStorage.clear();
            this.router.navigate(['/search-amenities']);
        }
        ,err => {
                this.loading = false;
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
    getBrandList(){
        // this.BrandList=['AAA', 'BBB', 'CCC'];

        let GET_ALL_ONLINE_BRANDS = environment.APIEndpoint + "api/rpa/store/v1/get/storeBrands";
        this.https.getJson(GET_ALL_ONLINE_BRANDS)
          .subscribe((response) => {
            // console.log(response);
            let brandList = response;
    
            for (let i = 0; i <= brandList.length - 1; i++) {
              let obj = {
                brandId: brandList[i]['brandId'],
                brandName: brandList[i]['brandName'],
              }
              console.log(obj);
              this.BrandList.push(obj);
            }
        
            console.log(this.BrandList['brandName']);
            console.log(this.BrandList['brandId']);
          },
            (error) => {
              console.log(error);
            });
    }

checkStore(value){
    if(value == true){
        this.selectStore = 1;
    }else{
        this.selectStore = 0;
    }
   
}
}
