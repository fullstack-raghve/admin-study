import { Component, OnInit, ViewChild } from "@angular/core";
import {
  FormControl,
  Validators,
  FormBuilder,
  FormGroup,
  FormArray,
  NgForm
} from "@angular/forms";
import { COMMA, ENTER } from "@angular/cdk/keycodes";
import { MatChipInputEvent, MatSnackBar } from "@angular/material";
import { HttpService } from "src/app/services/http-service";
import { environment } from "src/environments/environment";
import { Router } from "@angular/router";
import { SnackBarComponent } from "src/app/shared/components/snack-bar/snack-bar.component";
import { UploadFile } from "src/app/services/uploadFile.service";

@Component({
  selector: "add-client-on-boarding",
  templateUrl: "./add-client-on-boarding.component.html",
  styleUrls: ["./add-client-on-boarding.component.scss"]
})
export class AddClientOnBoardingComponent implements OnInit {
  public breadCrumbData: Array<Object> = [
    {
      title: "Configurations",
      link: ""
    },
    {
      title: "Client On Boarding",
      link: "/add-client-on-boarding"
    }
  ];
  public imageUploading = false;
  public toggleVal = true;
  public imagePath = "";
  public name = "";
  public Nameerr: boolean = false;
  public showError = false;
  public showImageError = false;
  public loading = false;
  public filePathUrl = localStorage.getItem("imgBaseUrl");
  addClientOnBoardingGroup: FormGroup;
  addForm: FormGroup;
  rows: FormArray;
  itemForm: FormGroup;
  public divCount: any = [1];
  public count = 1;
  public languages = [];
  public language = [];
  public days = [];
  formSubmitted;
  public tierEngagementDays = [];
  public currency = [];
  public countries: any = [];
  public baseCountry = [];
  public regionList: any = [];
  constructor(
    private fb: FormBuilder,
    private http: HttpService,
    private router: Router,
    public snackBar: MatSnackBar,
    private uploadFile: UploadFile
  ) {
    this.buildCreateClientOnBoardingForm();
    this.onAddRow();
    setTime: new FormControl(new Date(new Date().setHours(0,0,0,0)))
  }

  // image upload

  url: any = "";
  onSelectFile(event) {
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();

      reader.readAsDataURL(event.target.files[0]); // read file as data url

      reader.onload = event => {
        // called once readAsDataURL is completed
        // this.url = event.target.result;
        this.url = <string>reader.result;
      };
    }
  }

  ngOnInit() {
    this.getAllCountries();
    this.getLangauges();
  }
  onAddRow() {
    let row = {
      countryId: "",
      currency: "",
      tierEngegementDays: 365,
      languageId: "",
      deliveryCharge: '',
      setTime:''
    };
    this.regionList.push(row);
  }
  onRemoveRow(rowIndex: number) {
    this.regionList.splice(rowIndex, 1);
  }

  getLangauges() {
    let GET_ALL_LANGUAGES =
      environment.APIEndpoint + "api/rpa/master/language/v1/list";
    this.http.getJson(GET_ALL_LANGUAGES).subscribe(response => {
      this.languages = response;
    });
  }

  getAllCountries() {
    let GET_ALL_COUNTRIES =
      environment.APIEndpoint + "api/rpa/master/country/v1/get/countries";
    this.http.getJson(GET_ALL_COUNTRIES).subscribe(response => {
      this.countries = response;
    });
  }

  public getCurrency(countryId, index) {
    for (let i of this.countries) {
      if (i.countryId == countryId) {
        this.regionList[index].currency = i.currencyCode;
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

  public buildCreateClientOnBoardingForm() {

    let form = {
      primaryColor: [
        "",
        Validators.compose([Validators.pattern("[a-zA-Z0-9#]{1,10}$")])
      ],
      secondaryColor: [
        "",
        Validators.compose([Validators.pattern("[a-zA-Z0-9#]{1,10}$")])
      ],
      includeMall: [false],
      includeBrand: [false]
    };
    this.addClientOnBoardingGroup = this.fb.group(form);
  }

  createClientOnBoarding(formData) {
    this.formSubmitted = true
    if (this.addClientOnBoardingGroup.invalid == true) {
      this.showError = true;
    } else if (this.imagePath == "") {
      this.showImageError = true;
    } else if (this.name == "" || this.name == undefined) {
      this.Nameerr = true;
    } else {
      for (let i of this.regionList) {
        delete i["currency"];
      }
      this.loading = true;
      this.showError = false;
      let request = {
        clientImage: this.imagePath,
        clientName: this.name,
        includeBrands: formData.includeBrand,
        includeMalls: formData.includeMall,
        primaryColor: formData.primaryColor,
        secondaryColor: formData.secondaryColor,
        regionList: this.regionList
      };
      
      let CREATE_ONBOARDING =
        environment.APIEndpoint + "api/rpa/client/onboarding/v1/save";
      this.http.postJson(CREATE_ONBOARDING, request).subscribe(
        response => {

          this.snackBar.openFromComponent(SnackBarComponent, {
            duration: 10000,
            data: {
              status: "success",
              message: "Client On-boarding has been added successfully"
            }
          });
          this.loading = false;
          this.router.navigate(["/view-client-on-boarding"]);
        },
        err => {
          this.loading = false;
          if (err.error.errorType == "VALIDATION") {
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
                message:
                  "Your request cannot be saved at this time. Please try again later"
              }
            });
          }
        }
      );
    }
  }
}
