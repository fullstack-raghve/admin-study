import { OnInit, ViewChild, Output, Input, Component, ElementRef, EventEmitter, AfterViewInit } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder, FormGroupDirective, FormArray, NgForm } from '@angular/forms';
import { MatPaginator, MatSort, MatTableDataSource, MatTabsModule, MatSnackBar } from '@angular/material';
import { MatDialogModule } from '@angular/material/dialog';
import { SelectionModel } from '@angular/cdk/collections';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { UploadFile } from 'src/app/services/uploadFile.service';
import { HttpService } from 'src/app/services/http-service';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { SnackBarComponent } from 'src/app/shared/components/snack-bar/snack-bar.component';
import { ExtraValidators } from 'src/app/services/validator-service';

@Component({
  selector: 'add-banner',
  templateUrl: './add-banner.component.html',
  styleUrls: ['./add-banner.component.scss']
})
export class AddBannerComponent implements OnInit {
  public breadCrumbData: Array<Object> = [{
    title: 'Banner Management',
    link: ''
  }, {
    title: 'Add Banner',
    link: 'add-banner'
  }
  ];

  @ViewChild('addBannerForm') addBannerForm;
  @ViewChild('uploadEl') uploadElRef: ElementRef;
  createBannerFormGroup: FormGroup;
  public imgUpload = false;
  checked = true;
  disabled = false;
  public languageList = JSON.parse(localStorage.getItem("languageList"));
  public alignCss = [];
  public imageUploading: boolean = false;
  public imagePath: any = [];
  public imagePath1: any = [];
  public filePathUrl = localStorage.getItem("imgBaseUrl");
  public banner_type_locale: any = [];
  public showError: boolean = false;
  public loading: boolean = false;
  public toggleVal: boolean = true;
  public imageErrMsg;
  public showImageError: boolean = false;
  public uploadFlag = [];
  public uploadError = [];
  public bannerLocaleArray;
  public bannersLocaleBeanArray;
  public bannerId: number;
  public sequenceNum = 1;
  public countryId = 14;
  public cityOid = 0;
  public imageOrVideoUrl;
  public uploadFlag1 = [];
  public uploadError1 = [];
  bannerType;

  constructor(private fb: FormBuilder, 
    private http: HttpService,
    private router: Router, 
    private uploadFile: UploadFile, 
    public snackBar: MatSnackBar) {
    this.buildCreateBannerForm();
  }

  ngOnInit() {
    this.bannersLocaleBeanA();
    if(localStorage.getItem('bannerType')=='type2'){
      this.bannerType = 'type2';
    }else{
      this.bannerType='type1'
    }
  }

  public buildCreateBannerForm() {
    this.createBannerFormGroup = this.fb.group({
      bannersLocaleBean: this.fb.array([]),
      bannerName: [""],
      imageOrVideoUrl : ['',Validators.required],
      titleArray:this.fb.array([]),
      pageContentArray: this.fb.array([]),

    });
    for (let l of this.languageList) {
      this.uploadFlag.push(false);
      this.uploadError.push(false);
      this.imagePath.push('');
    }
    this.titleArray();
    this.getLangauges();
  }

  getLangauges() {
    for (let i = 0; i < this.languageList.length; i++) {
      const control = <FormArray>(
        this.createBannerFormGroup.controls["pageContentArray"]
      );
      let newGroup = this.fb.group({
        content: ""
      });
      control.push(newGroup);
      this.alignCss.push(
        this.languageList[i].direction == "RTL" ? "text-right" : ""
      );
    }
  }


  titleArray(){
    let control = <FormArray>this.createBannerFormGroup.controls['titleArray'];
    for(let i=0;i<this.languageList.length;i++){
    let form = this.fb.group({
      imgBannerTitle:[''],
      title: ['', Validators.compose([Validators.pattern('^[a-zA-Z0-9\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF \"&\'(),-:.?_ ]*'),ExtraValidators.conditional(group => this.bannerType == 'type2', Validators.required)])],
    });
    control.push(form);
    for (let l of this.languageList) {
      this.uploadFlag1.push(false);
      this.uploadError1.push(false);
      this.imagePath1.push('');
    }
    this.alignCss.push(this.languageList[i].direction == 'RTL' ? 'text-right' : '');
    }
}

  public bannersLocaleBeanA() {
    const control = <FormArray>this.createBannerFormGroup.controls['bannersLocaleBean'];
    for (let i = 0; i < this.languageList.length; i++) {
      const newForm = this.fb.group({
        imgBanner: [''],
        videoUrl: ["", Validators.compose([Validators.pattern("^(http(s)?)://[-a-zA-Z0-9+&@#/%?=~_|!:,.;]*[-a-zA-Z0-9+&@#/%=~_|]$")])],
      });
      control.push(newForm);
      this.alignCss.push(this.languageList[i].direction == 'RTL' ? 'text-right' : '');
    }
  }
  
  public uploadImage(event: FileList, i,type) {
    this.imageUploading = true;
    if (event[0].size < 1000000) {
      if (event[0].type == "image/jpeg" || event[0].type == "image/png" || event[0].type == "image/jpg" || event[0].type == "image/JPG" || event[0].type == "image/JPEG" || event[0].type == "image/PNG") {
        if (event[0].size < 1000000) {
          this.uploadFile.upload(event.item(0), 'product', 'images')
            .subscribe((response) => {
              if(type=='imgBanner'){
                this.imagePath[i] = response['message'];
                this.uploadFlag[i] = true;
                this.uploadError[i] = false;
                this.uploadElRef.nativeElement.value = ''
              }
              else {
                this.imagePath1[i] = response['message'];
                this.uploadFlag1[i] = true;
                this.uploadError1[i] = false;
                this.uploadElRef.nativeElement.value = ''
              }
            
              this.snackBar.openFromComponent(SnackBarComponent, {
                duration: 1500,
                data: {
                  status: "success",
                  message: " image successfully uploaded"
                }
              });
            }, err => {
              this.snackBar.openFromComponent(SnackBarComponent, {
                duration: 10000,
                data: {
                  status: "failure",
                  message: "Internal server error"
                }
              });
            }
            )
        } else {
          this.imageUploading[i] = false;
          this.imageErrMsg = "Max upload file size is 1Mb";

        }
      } else {
        this.imagePath[i] = '';
        this.snackBar.openFromComponent(SnackBarComponent, {
          duration: 10000,
          data: {
            status: "failure",
            message: "Supported format is JPG, JPEG and PNG"
          }
        });
      }
    } else {
      this.imagePath[i] = '';
      this.snackBar.openFromComponent(SnackBarComponent, {
        duration: 10000,
        data: {
          status: "failure",
          message: "Max upload file size is 1Mb"
        }
      });
    }
  }

  public removeImage(index,type) {
    if(type == 'imgBanner'){
      this.imagePath[index] = "";
      this.uploadFlag[index] = false;
      const control = this.createBannerFormGroup.get('bannersLocaleBean') as FormArray;
      control.at(index).get('imgBanner').setValue('');
    }
    else {
      this.imagePath1[index] = "";
      this.uploadFlag1[index] = false;
      const control = this.createBannerFormGroup.get('titleArray') as FormArray;
      control.at(index).get('imgBannerTitle').setValue('');
    }
  }

  createBanners(formData,SeqNo, cityId, countryId) {
    this.bannersLocaleBeanArray = [];
    this.bannerLocaleArray = [];
    if (this.imagePath.length > 0) {
      for (let i = 0; i < formData.bannersLocaleBean.length; i++) {
        if (this.imagePath[i] == '') {
          this.uploadError[i] = true;
          this.showError = true;
        }
      }
    }

    if (this.createBannerFormGroup.invalid == true) {
      this.showError = true;
      return;
    }
    this.loading = true;
    this.showError = false;
    for (let i = 0; i < formData.bannersLocaleBean.length; i++) {
      if (formData.bannersLocaleBean[i] != '') {
        if(this.bannerType == 'type2'){
          let locale = {
            languageId: this.languageList[i].languageId,
            languageDirection: this.languageList[i].direction,
            imgPath: this.imagePath[i],
            videoPath : formData.bannersLocaleBean[i].videoUrl,
            title:formData.titleArray[i].title,
            content:formData.pageContentArray[i].content,
            detailImage:  this.imagePath1[i]
          }
          this.bannersLocaleBeanArray.push(locale);
        }else{
          let locale = {
            languageId: this.languageList[i].languageId,
            languageDirection: this.languageList[i].direction,
            imgPath: this.imagePath[i],
            videoPath : formData.bannersLocaleBean[i].videoUrl,
          }
          this.bannersLocaleBeanArray.push(locale);
        }
      
       
      }
    }

    const requestBody = {
      bannerId: this.bannerId,
      bannerName: formData.bannerName,
      bannersLocaleBean: this.bannersLocaleBeanArray
    }

    let CREATE_BANNER;
    if(this.bannerType == 'type2'){
      CREATE_BANNER = environment.APIEndpoint + 'api/rpa/banners/v1/TypeTwo/create';
    }
    else {
      CREATE_BANNER = environment.APIEndpoint + 'api/rpa/banners/v2/create';
    }
    this.http.postJson(CREATE_BANNER, requestBody).subscribe(
      (response) => {
        this.snackBar.openFromComponent(SnackBarComponent, {
          duration: 10000,
          data: {
            status: "success",
            message: "Banner details saved successfully"
          }
        });
        sessionStorage.clear();
        this.router.navigate(['/search-banner']);localStorage.setItem('BannerSeachSeqNo', SeqNo);
        localStorage.setItem('BannerSearchCity', cityId);
        localStorage.setItem('BannerSearchCountry', countryId);
        localStorage.setItem('bannerType', this.bannerType);
            this.router.navigate(['/search-banner']);
      },
      (error) => {
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
      });
  }

  GoToSearchBanner(SeqNo, cityId, countryId){
    countryId = 14;
    cityId = 0;
    localStorage.setItem('BannerSeachSeqNo', SeqNo);
    localStorage.setItem('BannerSearchCity', cityId);
    localStorage.setItem('BannerSearchCountry', countryId);
    localStorage.setItem('bannerType', this.bannerType);
    this.router.navigate(['/search-banner']);
  }

  GoToSearchBannerBack(SeqNo, cityId, countryId){
    countryId = 14;
    cityId = 0;
    localStorage.setItem('BannerSeachSeqNo', SeqNo);
    localStorage.setItem('BannerSearchCity', cityId);
    localStorage.setItem('BannerSearchCountry', countryId);
    localStorage.setItem('bannerType', this.bannerType);
    this.router.navigate(['/search-banner']);
  }

  expandDataEmail() {
    var allifram = document.getElementById("arabicID");
    var iFrame_Arabic = allifram.getElementsByTagName("iframe")[0];
    var html_Arabic = iFrame_Arabic.contentWindow.document.getElementsByTagName("html")[0];
    html_Arabic.setAttribute("style", "direction: rtl;");
  }
}