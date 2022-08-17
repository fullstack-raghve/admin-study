import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import {FormControl, Validators, FormBuilder, FormGroup, FormArray} from '@angular/forms';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {MatChipInputEvent, MatSnackBar} from '@angular/material';
import { HttpService } from 'src/app/services/http-service';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { SnackBarComponent } from 'src/app/shared/components/snack-bar/snack-bar.component';
import { UploadFile } from 'src/app/services/uploadFile.service';
import { Globals } from 'src/app/services/global';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

export interface City {
    cityId: number;
    cityName: string;
}

@Component({
  selector: 'add-malls',
  templateUrl: './add-malls.component.html',
  styleUrls: ['./add-malls.component.scss']
})
export class AddMallsComponent implements OnInit {
    public breadCrumbData: Array<Object> = [{
      title: 'Configurations',
      link: ''
      }, {
          title: 'Mall',
          link: '/search-malls'
      }
    ];

    @ViewChild("createMallForm")createMallForm;
    @ViewChild('uploadEl') uploadElRef: ElementRef;
    mallFormGroup:FormGroup;
    public showError: boolean = false;
    public loading: boolean = false;
    public showMallError:boolean = false;
    public statusValue:string = 'ONLINE';
    public languageList =JSON.parse(localStorage.getItem("languageList"));
    // public checked:boolean = true;
    public imgUpload = false;
    disabled = false;
    checked = true;
    public mallArr:any=[];
    public mallLocales:any=[];
    public toggleVal:boolean=true;
    public countries:any=[];
    public showCountryError:boolean=false;
    public imageUploading:boolean=false;
    public imagePath:string='';
    public showImageError:boolean=false;
    public filePathUrl=localStorage.getItem("imgBaseUrl");
    public cities:any=[];
    public alignCss=[];
    public imageErrMsg;


    public cityList;
    Cities: City[] = [];
    cityCtrl = new FormControl();
    filteredCities: Observable<City[]>;
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

      constructor(private fb: FormBuilder,private http:HttpService,
          private router: Router, public snackBar: MatSnackBar, private uploadFile: UploadFile,){
          this.buildCreateMallForm();
      }

      ngOnInit() {
           this.mallLocale();
           this.getAllCountries();
      }

      public buildCreateMallForm(){
          let form = {
                mallLocale:this.fb.array([]),
                mallCode : ["", Validators.compose([Validators.required,Validators.pattern('^[a-zA-Z0-9]*')])],
                country: ["", Validators.required],
                // city: ["", Validators.required],
                latitude: ["", Validators.compose([Validators.required, Validators.minLength(2),Validators.pattern('^[0-9.-]*$')])],
                longitude: ["", Validators.compose([Validators.required, Validators.minLength(2),Validators.pattern('^[0-9.-]*$')])],


            }
            this.mallFormGroup=this.fb.group(form);
      }
      public mallLocale(){

            const control = <FormArray>this.mallFormGroup.controls['mallLocale'];
            for (let ln of this.languageList) {
                let arr= this.fb.group({
                    mallName: ['',Validators.compose([Validators.required, Validators.minLength(2), Validators.pattern(Globals.mulRegExpAlphaNumWithSplChar)])]
                });
                control.push(arr);
                 this.alignCss.push(ln.direction == 'RTL' ? 'text-right' : '');
            }
      }
      addMallValue(code) {
          var key = code;
          return this.fb.group({
          [key]: ['',Validators.compose([Validators.required,Validators.minLength(2),Validators.pattern('[a-zA-Z0-9\u0600-\u06FF \"&\'(),:.?_- ]*')])]
            });
          }
      public toggleStatus(event){
          if(event.checked==true){
              this.statusValue='ONLINE';
          }else{
               this.statusValue='OFFLINE';
          }

      }
      getAllCountries() {
          let GET_ALL_COUNTRIES = environment.APIEndpoint + "api/rpa/master/country/v1/get/countries";
          this.http.getJson(GET_ALL_COUNTRIES)
              .subscribe((response) => {
                  console.log(response);
                  this.countries = response;

              })
      }

      getAllCities(countryId) {
          console.log(countryId);
          
        let GET_ALL_CITIES = environment.APIEndpoint + "api/rpa/master/city/v1/get/cities";
          this.http.getJson(GET_ALL_CITIES + "?countryIds="+countryId)
          .subscribe((response) => {
            // console.log(response);
            this.cityList = [];
            this.Cities = [];
            this.cityList = response;
    
            for (let i = 0; i <= this.cityList.length - 1; i++) {
              let objMallkey = {
                cityId: this.cityList[i]['cityId'],
                cityName: this.cityList[i]['cityName'],
              }
              console.log(objMallkey);
              this.Cities.push(objMallkey);
            }
            this.filteredCities = this.cityCtrl.valueChanges
                .pipe(
                  startWith(''),
                  map(city => city ? this._filterCities(city) : this.Cities.slice())
                );
          },
            (error) => {
              console.log(error);
            });
      }
      private _filterCities(value: string): City[] {
        const filterValue = value.toLowerCase();
        return this.Cities.filter(city => city.cityName.toLowerCase().indexOf(filterValue) === 0);
      }

      public cityId;

      getAllcity(countryId){
          this.cityId = countryId;
          console.log(this.cityId);
      }

    //   getAllCities(countryId) {
    //       console.log("countryId..............."+countryId);
    //       let GET_ALL_CITIES = environment.APIEndpoint + "api/rpa/master/city/v1/get/cities";
    //       this.http.getJson(GET_ALL_CITIES + "?countryIds="+countryId)
    //           .subscribe((response) => {
    //               console.log(response);
    //               this.cities = response;

    //           })
    //   }
      checkCountryId(){
          if(this.cities.length==0)
              this.showCountryError=true;
          else
              this.showCountryError=false;
      }

      createMall(formData){
          this.mallLocales=[];
          if (this.mallFormGroup.invalid == true) {
                this.showError = true;
            }else if(this.imagePath==''){
                this.showImageError=true;
            }
            else {
                this.loading = true;
                this.showError = false;
                formData.mallLocale.forEach((mall, index)=>{
                    this.mallLocales.push({
                        mallName:mall.mallName,
                         languageId:this.languageList[index].languageId
                    })
                })




                    let request = {
                        mallLocales:this.mallLocales,
                        mallCode: formData.mallCode,
                        cityId: this.cityId,
                        imagePath: this.imagePath,
                        latitude:formData.latitude,
                        longitude:formData.longitude,
        	            status: this.toggleVal==true ? 'ONLINE' : 'OFFLINE'
                    }

                    let CREATE_MALL=environment.APIEndpoint+"api/rpa/master/mall/v1/create";
                    this.http.postJson(CREATE_MALL,request)
                    .subscribe((response) => {
                            console.log(response);
                            this.snackBar.openFromComponent(SnackBarComponent, {
                                    duration: 10000,
                                    data: {
                                        status: "success",
                                        message: "Mall master has been added successfully"
                                    }
                            });
                            this.loading = false;
                            sessionStorage.clear();
                            this.router.navigate(['/search-malls']);
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
