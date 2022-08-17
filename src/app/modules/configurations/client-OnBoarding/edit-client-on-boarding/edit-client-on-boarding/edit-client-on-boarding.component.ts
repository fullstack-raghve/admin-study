import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, Validators, FormBuilder, FormGroup, FormArray, NgForm } from '@angular/forms';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent, MatSnackBar } from '@angular/material';
import { HttpService } from 'src/app/services/http-service';
import { environment } from 'src/environments/environment';
import { Router, ActivatedRoute } from '@angular/router';
import { UploadFile } from 'src/app/services/uploadFile.service';
import { SnackBarComponent } from 'src/app/shared/components/snack-bar/snack-bar.component';

@Component({
    selector: 'edit-client-on-boarding',
    templateUrl: './edit-client-on-boarding.component.html',
    styleUrls: ['./edit-client-on-boarding.component.scss']
})
export class EditClientOnBoardingComponent implements OnInit {
    public breadCrumbData: Array<Object> = [{
        title: 'Configurations',
        link: ''
    }, {
        title: 'Client On Boarding',
        link: '/view-client-on-boarding'
    }
    ];
    public imageUploading = false;
    public toggleVal = true;
    public imagePath = '';
    public name = '';
    public Nameerr : boolean = false;
    public showError = false;
    public showImageError = false;
    public loading = false;
    public filePathUrl = localStorage.getItem('imgBaseUrl');
    editClientOnBoardingGroup: FormGroup;
    addForm: FormGroup;
    rows: FormArray;
    itemForm: FormGroup;
    public divCount: any = [1];
    public count = 1;
    public languages = [];
    public language = [];
    public tierEngagementDays = [];
    public currency = [];
    public countries: any = [];
    public baseCountry = [];
    public regionList: any = [];
    public viewData: any = [];
    public regionId: any = [];
    constructor(private fb: FormBuilder, private http: HttpService, private activatedRoute: ActivatedRoute,
        private router: Router, public snackBar: MatSnackBar, private uploadFile: UploadFile, ) {
        let editKey = localStorage.getItem('viewClientKey');
        if(editKey){
            localStorage.removeItem('viewClientKey');
           this.buildCreateClientOnBoardingForm(this.viewData);
        }else{
            this.router.navigate(['/view-client-on-boarding']);
        }
    }

    getViewData() {
        let GET_ALL_ONBOARDING = environment.APIEndpoint + "api/rpa/client/onboarding/v1/view";
        this.http.getJson(GET_ALL_ONBOARDING)
            .subscribe((response) => {
                if (response != undefined) {
                    this.viewData = response;
                    this.regionList = response["regionList"];
                    for (let i of this.regionList) {
                        i.countryId = i.countryId.toString();
                        //   i.languageId= i.languageId.toString();
                    }
                    this.buildCreateClientOnBoardingForm(this.viewData);
                }
            })
    }

    url: any = '';
    onSelectFile(event) {
        if (event.target.files && event.target.files[0]) {
            var reader = new FileReader();
            reader.readAsDataURL(event.target.files[0]); // read file as data url
            reader.onload = (event) => { // called once readAsDataURL is completed
                // this.url = event.target.result;
                this.url = <string>reader.result;

            }
        }
    }

    ngOnInit() {
        this.getAllCountries();
    }
    onAddRow() {
        let row = {
            countryId: '',
            languageId: '',
            currency: '',
            tierEngegementDays: '',
        }
        this.regionList.push(row);
    }

    onRemoveRow(rowIndex: number) {
        this.regionList.splice(rowIndex, 1);
    }
    createItemFormGroup(): FormGroup {
        return this.fb.group({
            name: null,
            description: null,
            language: null,
            tier: null
        });
    }

    getLangauges() {
        let GET_ALL_LANGUAGES = environment.APIEndpoint + "api/rpa/master/language/v1/list";
        this.http.getJson(GET_ALL_LANGUAGES)
            .subscribe((response) => {
                this.languages = response;
            })
        this.getViewData();
    }

    getAllCountries() {
        let GET_ALL_COUNTRIES = environment.APIEndpoint + "api/rpa/master/country/v1/get/countries";
        this.http.getJson(GET_ALL_COUNTRIES)
            .subscribe((response) => {
                this.countries = response;
            })
        this.getLangauges();
    }

    public getCurrency(countryId, index) {
        for (let i of this.countries) {
            if (i.countryId == countryId) {
                this.regionList[index].currencyCode = i.currencyCode;
            }
        }
    }

    public uploadImage(event: FileList) {
        this.imageUploading = true;
        if (
          event[0].type == "image/jpeg" ||
          event[0].type == "image/png" ||
          event[0].type == "image/jpg" ||
          event[0].type == "image/gif" ||
          event[0].type == "image/tiff"||
          event[0].type == "image/svg+xml"
        ) {
          if(event[0].size < 1000000){
            this.uploadFile
            .upload(event.item(0), "onboarding", "images")
            .subscribe(
              response => {
                this.imagePath = response["message"];
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
                if(err.error.errorDetails[0].description="Valid extension is required"){
                 this.snackBar.openFromComponent(SnackBarComponent, {
                  duration: 10000,
                  data: {
                    status: "failure",
                    message:"Please upload PNG or SVG format image"

                  }
                });
                }
                 else {
                 }
              }
            );
          }

          else if (event[0].size > 1000000){
            this.snackBar.openFromComponent(SnackBarComponent, {
              duration: 10000,
              data: {
                status: "failure",
                message:"File size is large"

              }
            });
          }
        }

        else {
          this.snackBar.openFromComponent(SnackBarComponent, {
            duration: 10000,
            data: {
              status: "failure",
              message:"invalid file type"

            }
          });
        }
      }

    public buildCreateClientOnBoardingForm(viewData) {

        if (viewData.clientId == undefined) {
            let form = {
                primaryColor: ['', Validators.compose([Validators.pattern('[a-zA-Z0-9#]{1,10}$')])],
                secondaryColor: ['', Validators.compose([Validators.pattern('[a-zA-Z0-9#]{1,10}$')])],
                includeMall: [false],
                includeBrand: [false],
            }
            this.editClientOnBoardingGroup = this.fb.group(form);
        } else {
            this.editClientOnBoardingGroup.patchValue({
                primaryColor: viewData.primaryColor,
                secondaryColor: viewData.secondaryColor,
                includeMall: viewData.includeMalls,
                includeBrand: viewData.includeBrands,

            })
            this.imagePath = viewData.clientImage;
            this.name = viewData.clientName;

            this.regionList = viewData.regionList;
            for (let i = 0; i < this.regionList.length; i++) {
                this.regionId[i] = this.regionList[i].regionId;
                this.baseCountry[i] = this.regionList[i].countryId.toString();
                this.language[i] = this.regionList[i].languageId;
                this.currency[i] = this.regionList[i].currencyCode;
                this.tierEngagementDays[i] = this.regionList[i].tierEngegementDays;
            }

        }

    }

    createClientOnBoarding(formData) {
        // this.imagePath="test.svg";
        if (this.editClientOnBoardingGroup.invalid == true) {
            this.showError = true;
        } else if (this.imagePath == '') {
            this.showImageError = true;
        }
        else if(this.name == '' || this.name == undefined){
            this.Nameerr=true
        }
        else {
            this.loading = true;
            this.showError = false;
            let request = {
                clientId:this.viewData.clientId,
                clientImage: this.imagePath,
                clientName: this.name,
                includeBrands: formData.includeBrand,
                includeMalls: formData.includeMall,
                primaryColor: formData.primaryColor,
                secondaryColor: formData.secondaryColor,
                regionList: this.regionList
            }
            let CREATE_ONBOARDING = environment.APIEndpoint + "api/rpa/client/onboarding/v1/update";
            this.http.postJson(CREATE_ONBOARDING, request)
                .subscribe((response) => {
                    this.snackBar.openFromComponent(SnackBarComponent, {
                        duration: 10000,
                        data: {
                            status: "success",
                            message: "Client On-boarding has been added successfully"
                        }
                    });
                    this.loading = false;
                    this.router.navigate(['/view-client-on-boarding']);
                }
                    , err => {
                        this.loading = false;
                        if (err.error.errorType == 'VALIDATION') {
                            this.snackBar.openFromComponent(SnackBarComponent, {
                                duration: 10000,
                                data: {
                                    status: "failure",
                                    message: err.error.errorDetails[0].description
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
                    })
        }
    }
}
