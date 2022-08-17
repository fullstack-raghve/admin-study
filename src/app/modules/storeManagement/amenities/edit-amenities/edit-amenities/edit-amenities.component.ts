import {Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { HttpService } from 'src/app/services/http-service';
import { SnackBarComponent } from 'src/app/shared/components/snack-bar/snack-bar.component';
import { UploadFile } from 'src/app/services/uploadFile.service';
import {MatChipInputEvent, MatSnackBar} from '@angular/material';
import {FormControl, Validators, FormBuilder, FormGroup, NgForm, FormGroupDirective, FormArray,} from '@angular/forms';
import { environment } from 'src/environments/environment';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'edit-amenities',
  templateUrl: './edit-amenities.component.html',
  styleUrls: ['./edit-amenities.component.scss']
})
export class EditAmenitiesComponent implements OnInit {
  public breadCrumbData: Array<Object> = [{
    title: 'Store Management',
    link: ''
    }, {
        title: 'Amenities',
        link: ''
    }
    ];

  @ViewChild("editAmenityForm") editAmenityForm;
  amenityFormGroup:FormGroup;
    public amenityData: any = [];
    public imgUpload;
    public amenityLocale;
    public statusValue:string = '';
    public toggleVal:boolean=false;
    public showError: boolean = false;
    public checked = true;
    public disabled;
    public amenityOid;
    public buildFlag: boolean = false;
    public alignCss=[];
    public languageList =JSON.parse(localStorage.getItem("languageList"));
    public loading: boolean = false;

    @ViewChild('amenityImgFile') uploadElRef: ElementRef;
    public imagePath:string = '';
    public imageUploading:boolean=false;
    public imageErrMsg;
    public filePathUrl=localStorage.getItem("imgBaseUrl");
    brand;
    selectStore = true;
    BrandList=[];
    constructor(
      private fp: FormBuilder,
      private http:HttpService,
      private activatedRoute: ActivatedRoute,
      private router: Router,
      private https: HttpService,
      private uploadFile: UploadFile,
      public snackBar: MatSnackBar){
    //   this.activatedRoute.params.subscribe((params) => {
    //     this.amenityOid = params.id;
    // });
}

baseUrl:any = '';
ngOnInit() {
  let data= localStorage.getItem('AmenitiesEditID');
  if(data){
    this.amenityOid = data;
    this.getBrandList();
    this.buildEditAmenityForm();
    this.getAmenityById();
    localStorage.removeItem('AmenitiesEditID');
   
  }else{
    sessionStorage.clear();
    this.router.navigate(['/search-amenities']);
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

public getAmenityById() {
  let GET_AMENITY_BY_ID = environment.APIEndpoint+"api/rpa/store/amenity/v1/view";
  let request = {
    amenityOid:this.amenityOid
  }
  this.http.postJson(GET_AMENITY_BY_ID, request)
      .subscribe((response) => {
          console.log(response);
          this.amenityData = response;
          //*changes required
        this.selectStore= response['applyAllStore']  ;
        
          this.toggleVal=(this.amenityData.status=='ONLINE'?true:false);
          // this.buildEditAmenityForm();
          if(response['brandOid']!= null){
            this.amenityFormGroup.get('brand').patchValue(response['brandOid'].toString());
          }
         
          this.imagePath = response['amenityImagePath'];
          this.amenityTitleArray(response['amenityLocales']);
          this.statusValue = response['status'];
      }
      ,(error) => {
          alert(error);
      })
} 

public amenityTitleArray(amenityTitleArray){
  let control = <FormArray>this.amenityFormGroup.controls['amenityTitleArray'];
  //for(let i=0;i<this.languageList.length;i++){
  for(let amenity of amenityTitleArray){
  let form = this.fp.group({
      amenityTitle:[amenity.amenityTitle,Validators.compose([Validators.required])],
  });
  control.push(form);
  //this.alignCss.push(this.languageList[i].direction == 'RTL' ? 'text-right' : '');
  this.alignCss.push(amenity.languageDirection == 'RTL' ? 'text-right' : '');
  }
}

public buildEditAmenityForm(){
  this.buildFlag = true
  let form = {
    amenityTitleArray:this.fp.array([]),
    brand:[''],
    isApplyAllStore:['']
    }
    this.amenityFormGroup=this.fp.group(form);
}


public updateAmenity(formData){
  this.amenityLocale = [];
  if (this.amenityFormGroup.invalid == true) {
      this.showError = true;
      return 
  }else {
    this.loading = true;
    this.showError = false;
  formData.amenityTitleArray.forEach((amenityLocale, index) => {
      let locale={
          languageOid:this.languageList[index].languageId,
          amenityTitle:amenityLocale.amenityTitle,
      }
      this.amenityLocale.push(locale);
  })
  let selectStore;
  if( this.selectStore == true){
    selectStore = 1;
}else{
    selectStore = 0;
}
  let requestBody = {
      amenityOid:this.amenityOid,
      amenityImagePath:this.imagePath,
      amenityLocales:this.amenityLocale,
      status:this.statusValue,
      isApplyAllStore:selectStore,
      brandOid:formData.brand
  }

  let UPDATE_AMENITY = environment.APIEndpoint +"api/rpa/store/amenity/v1/update";
  this.https.postJson(UPDATE_AMENITY,requestBody).subscribe(
    (response) => {
        console.log(response);
        this.snackBar.openFromComponent(SnackBarComponent, {
                duration: 10000,
                data: {
                    status: "success",
                    message: "Amenity updated successfully"
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

public toggleStatus(event) {
  if (event.checked) {
      this.statusValue = 'ONLINE';
  } else {
      this.statusValue = 'OFFLINE';
  }

}

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
  getBrand(value){
    this.brand = value;
}
checkStore(value){
 this.selectStore = value;
//  this.amenityFormGroup.get('brand').patchValue('10518');
   
}
 
}
