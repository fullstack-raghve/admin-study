import { OnInit, ViewChild, Component, ElementRef } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder, FormArray } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { UploadFile } from 'src/app/services/uploadFile.service';
import { HttpService } from 'src/app/services/http-service';
import { environment } from 'src/environments/environment';
import { SnackBarComponent } from 'src/app/shared/components/snack-bar/snack-bar.component';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { Globals } from 'src/app/services/global';
import { DomSanitizer } from '@angular/platform-browser';

export interface Banner {
  bannerId: number;
  bannerName: string;
}

export interface Store {
  oid: number;
  storeName: string;
}

export interface Faq {
  faqCategoryId: number;
  faqCategoryTitle: string;
}

export interface Mall {
  mallId: number;
  mallName: string;
}

export interface Brand {
  brandId: number;
  brandName: string;
}

@Component({
  selector: 'edit-banner',
  templateUrl: './edit-banner.component.html',
  styleUrls: ['./edit-banner.component.scss']
})

export class EditBannerComponent implements OnInit {
  public breadCrumbData: Array<Object> = [{
    title: 'Banner Management',
    link: ''
  }, {
    title: 'Edit Banner',
    link: 'edit-banner'
  }
  ];

  @ViewChild('addBannerForm') addBannerForm;
  @ViewChild('uploadEl') uploadElRef: ElementRef;
  createBannerFormGroup: FormGroup;
  localesFormGroup: FormGroup;
  public imgUpload = false;
  public languageList = JSON.parse(localStorage.getItem("languageList"));
  public alignCss = [];
  public imageUploading: boolean = false;
  public imagePath: any = [];
  public imagePath1: any = [];
  public videoPath: any = [];
  public filePathUrl = localStorage.getItem("imgBaseUrl");
  public banner_type_locale: any = [];
  public showError: boolean = false;
  public loading: boolean = false;
  public toggleVal: boolean = true;
  public imageErrMsg;
  public showImageError: boolean = false;
  public uploadFlag = [];
  public uploadError = [];
  public uploadFlag1 = [];
  public uploadError1= [];
  public bannerLocaleArray;
  public bannersLocaleBeanArray;
  public bannerDetailId: number;
  public linkTo: number;
  public buildFlag = false;
  public bannerData: any = [];
  public sequenceNum: number;
  public linkToId: number;
  public cityId: number;
  public countryId: number;
  bannerDataSingle;
  bannerDataLocale;
  public images: any[];
  public countryOid: number;
  public cityOid: number;
  bannerLinkThrough: string;
  submitted = false;
  disabled: boolean;
  public buttonValue: boolean = false;
  bannerDetailList: any[];

  public bannerList;
  Banners: Banner[] = [];
  bannerCtrl = new FormControl();
  filteredbanners: Observable<Banner[]>;
  prePopulateBannerId: number;

  public storeList;
  Stores: Store[] = [];
  linkToStoreCtrl = new FormControl();
  filteredStoreList: Observable<Store[]>;
  prePopulateStoreId: number;

  public faqList;
  Faqs: Faq[] = [];
  linkToFaqCtrl = new FormControl();
  filteredFaqList: Observable<Faq[]>;
  prePopulateFaqId: number;


  public mallList;
  Malls: Mall[] = [];
  linkToMallCtrl = new FormControl();
  filteredMallList: Observable<Mall[]>;
  prePopulateMallId: number;

  public brandList;
  Brands: Brand[] = [];
  linkToBrandCtrl = new FormControl();
  filteredBrandList: Observable<Brand[]>;
  prePopulateBrandId: number;
  bannerType;

  pushList = [
    { value: 'Customer Profile', label: 'Customer Profile' },
    { value: 'My Transactions', label: 'My Transactions' },
    { value: 'Points Summary', label: 'Points Summary' },
    { value: 'Our Brands', label: 'Our Brands' },
    { value: 'Coupon', label: 'Coupons' },
    { value: 'Refer and Earn', label: 'Refer and Earn' },
    { value: 'Press Releases', label: 'Press Releases' },
    { value: 'FAQ', label: 'FAQ' },
    { value: 'Customer Tier', label: 'Customer Tier' },
    { value: 'Others', label: 'Others - Lands to Home screen' },
    { value: 'External Link', label: 'External Link' },
    { value: 'All Orders', label: 'All Orders' },
    { value: 'Menu', label: 'Menu' },
    { value: 'Stores', label: 'Stores' },
    { value: 'About Us', label: 'About Us' },
    { value: 'Schedule Order Page', label: 'Schedule Order Page' },
    { value: 'Rewards Dashboard', label: 'Rewards Dashboard' },
    { value: 'Scratch Card Listing Page', label: 'Scratch Card Listing Page' },
    { value: 'Hotsellers Category', label: 'Hotsellers Category' },
    { value: 'Exclusive', label: 'Exclusive' },
    { value: 'ime Bounded', label: 'ime Bounded' },
    { value: 'Healthy', label: 'Healthy' },
];

  constructor(private activatedRoute: ActivatedRoute, 
    private fb: FormBuilder, 
    private http: HttpService,
    private router: Router, 
    private uploadFile: UploadFile, 
    public snackBar: MatSnackBar, 
    private sanitized: DomSanitizer) {
    this.getBanner();
  }

  ngOnInit() {
    let bannerType =localStorage.getItem('bannerType');
    let bannerSeqNo = localStorage.getItem('BannerEditSeqNo');
    let bannerCity = localStorage.getItem('BannerEditCity');
    let bannerCountry = localStorage.getItem('BannerEditCountry');

    if(bannerSeqNo){
      this.bannerType = bannerType;
      this.sequenceNum=Number(bannerSeqNo);
      this.cityOid=Number(bannerCity);
      this.countryId=Number(bannerCountry);
      this.bannerType = bannerType;

      this.getBanner();
      this.getBannerDetails();
      this.getAllBanners();
      localStorage.removeItem('BannerEditSeqNo')
      localStorage.removeItem('BannerEditCity')
      localStorage.removeItem('BannerEditCountry');
    }
    else {
      sessionStorage.clear();
      this.router.navigate(['/search-banner'])
    }
  }

  public buildCreateBannerForm(editData) {
    this.buildFlag = true;
    if (editData.bannerDetailId <= 0) {
      this.createBannerFormGroup = this.fb.group({
        bannersLocaleBean: this.fb.array([]),
        bannerLinkThrough: [''],
        linkTo: [''],
        hyperlink: ['', Validators.compose([Validators.pattern(Globals.regUrl)])],
      });
      this.bannersLocaleBeanA(editData['bannerManagementLocaleBean']);
  
      for (let l of this.languageList) {
        this.uploadFlag.push(false);
        this.uploadError.push(false);
        this.imagePath.push('');
        this.uploadFlag1.push(false);
        this.uploadError1.push(false);
        this.imagePath1.push('');
      }
    }
    else {
      this.createBannerFormGroup = this.fb.group({
        bannersLocaleBean: this.fb.array([]),
        bannerLinkThrough: [editData.bannerLinkThrough],
        linkTo: [null != editData.linkTo ? editData.linkTo : ''],
        hyperlink: [editData.bannerLinkThrough == 'Specific Url' ? editData.externalLink : ''],
       
      });
      
      this.bannersLocaleBeanA(editData['bannerManagementLocaleBean']);
      this.prepopulateBannerDetails(editData['bannerManagementLocaleBean']);
      for (let l of this.languageList) {
        this.uploadFlag.push(false);
        this.uploadError.push(false);
        this.imagePath.push('');
        this.uploadFlag1.push(false);
        this.uploadError1.push(false);
        this.imagePath1.push('');
      }
      this.selectedBanner(editData.bannerId);
      this.bannerCtrl.setValue(editData.bannerName);
    }
    this.getAllBanners();
  }

  public updateValidation(value: any) {
    if (this.bannerLinkThrough == 'Specific Url') {
      let hyperlinkValue = this.createBannerFormGroup.get('hyperlink');
      hyperlinkValue.setValidators([Validators.required]);
      hyperlinkValue.updateValueAndValidity();
    } 
    else {
      let hyperlink = this.createBannerFormGroup.get('hyperlink');
      hyperlink.clearValidators();
      hyperlink.updateValueAndValidity();
    }
  }

  getAllBanners() {
    let GET_ALL_ONLINE_BRANDS;
    if(this.bannerType == 'type2'){
      GET_ALL_ONLINE_BRANDS = environment.APIEndpoint + "api/rpa/banners/v2/TypeTwo/getAllBanner";
    }
    else {
      GET_ALL_ONLINE_BRANDS = environment.APIEndpoint + "api/rpa/banners/v2/getAllBanner";
    }
    this.http.getJson(GET_ALL_ONLINE_BRANDS)
        .subscribe((response) => {
            this.Banners = [];
            this.bannerList = response;
            for (let i = 0; i <= this.bannerList.length - 1; i++) {
                    let objMallkey = {
                    bannerId: this.bannerList[i]['bannerId'],
                    bannerName: this.bannerList[i]['bannerName'],
                    bannersLocaleBean: this.bannerList[i].bannersLocaleBean
                }
                this.Banners.push(objMallkey);
            }
            this.filteredbanners = this.bannerCtrl.valueChanges
                .pipe(
                    startWith(''),
                    map(banner => banner ? this._filterBanners(banner) : this.Banners.slice())
                );

            for (let j = 0; j < this.Banners.length; j++) {
                if (this.Banners[j].bannerId == this.prePopulateBannerId) {
                    this.bannerCtrl.setValue(this.Banners[j].bannerName);
                }
            }
        },
            (error) => {
            });
}

private _filterBanners(value: string): Banner[] {
    const filterValue = value.toLowerCase();
    return this.Banners.filter(banner => banner.bannerName.toLowerCase().indexOf(filterValue) === 0);
}

selectedBanner(bannerId) {
  this.prePopulateBannerId = bannerId;
}

  getStoreByRegion() {
    let GET_ALL_ONLINE_STORE = environment.APIEndpoint + 'api/rpa/banners/v1/getStoresByRegion/' + this.countryId + '/' + this.cityOid;
    this.http.getJson(GET_ALL_ONLINE_STORE)
        .subscribe((response) => {
            this.Stores = [];
            this.storeList = response;

            for (let i = 0; i <= this.storeList.length - 1; i++) {
                let objStorekey = {
                    oid: this.storeList[i]['oid'],
                    storeName: this.storeList[i]['storeName'],
                }
                this.Stores.push(objStorekey);
            }
            this.filteredStoreList = this.linkToStoreCtrl.valueChanges
                .pipe(
                    startWith(''),
                    map(store => store ? this._filteredStoreList(store) : this.Stores.slice())
                );

            for (let j = 0; j < this.Stores.length; j++) {
                if (this.Stores[j].oid == this.prePopulateStoreId) {
                    this.linkToStoreCtrl.setValue(this.Stores[j].storeName);
                }
            }
        },
            (error) => {
            });
}

private _filteredStoreList(value: string): Store[] {
    const filterValue = value.toLowerCase();
    return this.Stores.filter(store => store.storeName.toLowerCase().indexOf(filterValue) === 0);
}

selectedStore(oid) {
  this.prePopulateStoreId = oid;
}

getFaqByRegion() {
  let GET_ALL_ONLINE_STORE = environment.APIEndpoint + 'api/rpa/faq/v1/getFaqByRegion?countryOid=' + this.countryId;
  this.http.getJson(GET_ALL_ONLINE_STORE)
      .subscribe((response) => {
          this.Faqs = [];
          this.faqList = response;
          for (let i = 0; i <= this.faqList.length - 1; i++) {
              let objStorekey = {
                faqCategoryId: this.faqList[i]['faqCategoryId'],
                faqCategoryTitle: this.faqList[i]['faqCategoryTitle'],
              }
              this.Faqs.push(objStorekey);
          }
          this.filteredFaqList = this.linkToFaqCtrl.valueChanges
              .pipe(
                  startWith(''),
                  map(faq => faq ? this._filteredFaqList(faq) : this.Faqs.slice())
              );

          for (let j = 0; j < this.Faqs.length; j++) {
              if (this.Faqs[j].faqCategoryId == this.prePopulateFaqId) {
                  this.linkToFaqCtrl.setValue(this.Faqs[j].faqCategoryTitle);
              }
          }
      },
          (error) => {
          });
}

private _filteredFaqList(value: string): Faq[] {
  const filterValue = value.toLowerCase();
  return this.Faqs.filter(faq => faq.faqCategoryTitle.toLowerCase().indexOf(filterValue) === 0);
}

selectedFaq(oid) {
this.prePopulateFaqId = oid;
}

  getMallByRegion() {
    let GET_ALL_ONLINE_STORE = environment.APIEndpoint + 'api/rpa/master/mall/v1/getMallByRegion?countryOid=' + this.countryId + '&cityOid=' + this.cityOid;
    this.http.getJson(GET_ALL_ONLINE_STORE)
        .subscribe((response) => {
            this.Malls = [];
            this.mallList = response;
            for (let i = 0; i <= this.mallList.length - 1; i++) {
                let objStorekey = {
                    mallId: this.mallList[i]['mallId'],
                    mallName: this.mallList[i]['mallName'],
                }
                this.Malls.push(objStorekey);
            }
            this.filteredMallList = this.linkToMallCtrl.valueChanges
                .pipe(
                    startWith(''),
                    map(mall => mall ? this._filteredMallList(mall) : this.Malls.slice())
                );

            for (let j = 0; j < this.Malls.length; j++) {
                if (this.Malls[j].mallId == this.prePopulateMallId) {
                    this.linkToMallCtrl.setValue(this.Malls[j].mallName);
                }
            }
        },
            (error) => {
            });
}

private _filteredMallList(value: string): Mall[] {
    const filterValue = value.toLowerCase();
    return this.Malls.filter(mall => mall.mallName.toLowerCase().indexOf(filterValue) === 0);
}

selectedMall(oid) {
  this.prePopulateMallId = oid;
}

  getBrandByRegion() {
    let GET_ALL_ONLINE_STORE = environment.APIEndpoint + 'api/rpa/master/brand/v1/getBrandByRegion?countryOid=' + this.countryId + '&cityOid=' + this.cityOid;
    this.http.getJson(GET_ALL_ONLINE_STORE)
        .subscribe((response) => {
            this.Brands = [];
            this.brandList = response;
            for (let i = 0; i <= this.brandList.length - 1; i++) {
                let objStorekey = {
                    brandId: this.brandList[i]['brandId'],
                    brandName: this.brandList[i]['brandName'],
                }
                this.Brands.push(objStorekey);
            }
            this.filteredBrandList = this.linkToBrandCtrl.valueChanges
                .pipe(
                    startWith(''),
                    map(mall => mall ? this._filteredBrandList(mall) : this.Brands.slice())
                );

            for (let j = 0; j < this.Brands.length; j++) {
                if (this.Brands[j].brandId == this.prePopulateBrandId) {
                    this.linkToBrandCtrl.setValue(this.Brands[j].brandName);
                }
            }
        },
            (error) => {
            });
}

private _filteredBrandList(value: string): Brand[] {
    const filterValue = value.toLowerCase();
    return this.Brands.filter(brand => brand.brandName.toLowerCase().indexOf(filterValue) === 0);
}

selectedBrand(oid) {
  this.prePopulateBrandId = oid;
}

  getBannerDetails() {   
    this.http.getJson(environment.APIEndpoint + 'api/rpa/banners/v1/getRegionDetails/' + this.countryId + '/' + this.cityOid)
      .subscribe((response) => {
        this.bannerDetailList = response;
      });
  }

  getBanner() {
    if (this.cityOid != 0) {
      this.uploadFlag = [];
      let GET_BANNER ;
      if(this.bannerType == 'type2'){
        GET_BANNER =environment.APIEndpoint+ 'api/rpa/banners/v2/TypeTwo/view/city/' +this.cityOid;
      }else{
        GET_BANNER = environment.APIEndpoint + 'api/rpa/banners/v2/view/city/' + this.cityOid;
      }
      this.http.getJson(GET_BANNER)
        .subscribe((response) => {
          this.bannerData = response;
          for (let i = 0; i < this.bannerData.length; i++) {
            if (this.bannerData[i].sequenceNum == this.sequenceNum) {
              this.bannerDataSingle = this.bannerData[i];
            }
          }
          this.bannerDetailId = this.bannerDataSingle['bannerDetailId'];
          this.prePopulateBannerId = this.bannerDataSingle['bannerId'];
          if (this.bannerDataSingle.bannerLinkThrough == 'Store') {
            this.prePopulateStoreId = this.bannerDataSingle.linkToId;
          } else if (this.bannerDataSingle.bannerLinkThrough == 'Mall') {
            this.prePopulateMallId = this.bannerDataSingle.linkToId;
          } else if (this.bannerDataSingle.bannerLinkThrough == 'Specific Brand') {
            this.prePopulateBrandId = this.bannerDataSingle.linkToId;
          } else if (this.bannerDataSingle.bannerLinkThrough == 'FAQ') {
            this.prePopulateFaqId = this.bannerDataSingle.linkToId;
          }
          this.buildCreateBannerForm(this.bannerDataSingle);
        });
    }
    else {
      this.uploadFlag = [];
      let GET_BANNER ;
      if(this.bannerType == 'type2'){
        GET_BANNER =environment.APIEndpoint+ 'api/rpa/banners/v2/TypeTwo/view/country/' +this.countryId;
      } 
      else {
        GET_BANNER = environment.APIEndpoint + 'api/rpa/banners/v2/view/country/' + this.countryId;
      }
      this.http.getJson(GET_BANNER)
        .subscribe((response) => {
          this.bannerData = response;
          for (let i = 0; i < this.bannerData.length; i++) {
            if (this.bannerData[i].sequenceNum == this.sequenceNum) {
              this.bannerDataSingle = this.bannerData[i];
            }
          }
          this.bannerDetailId = this.bannerDataSingle['bannerDetailId'];
          this.prePopulateBannerId = this.bannerDataSingle['bannerId'];
          if (this.bannerDataSingle.bannerLinkThrough == 'Store') {
            this.prePopulateStoreId = this.bannerDataSingle.linkToId;
          } else if (this.bannerDataSingle.bannerLinkThrough == 'Mall') {
            this.prePopulateMallId = this.bannerDataSingle.linkToId;
          } else if (this.bannerDataSingle.bannerLinkThrough == 'Specific Brand') {
            this.prePopulateBrandId = this.bannerDataSingle.linkToId;
          } else if (this.bannerDataSingle.bannerLinkThrough == 'FAQ') {
            this.prePopulateFaqId = this.bannerDataSingle.linkToId;
          }
          this.buildCreateBannerForm(this.bannerDataSingle);
        });
    }
  }

  prepopulateBannerDetails(banner) {
    const control = this.createBannerFormGroup.get('bannersLocaleBean') as FormArray;
    for (let i = 0; i < banner.length; i++) {
      this.imagePath[i] = banner[i].imgPath;
      this.videoPath[i] = banner[i].videoPath;
      if (this.imagePath[i] != ''){
        this.uploadFlag[i] = true;
        this.uploadError[i] = false;
    }
    this.imagePath1[i] = banner[i].detailImage;
    if (this.imagePath1[i] != ''){
      this.uploadFlag1[i] = true;
      this.uploadError1[i] = false;
  }
    control.at(i).get('title').patchValue(banner[i]['title'])
    control.at(i).get('content').patchValue(banner[i]['content'])
    }
    this.getReplacedContent(banner)
  }

  contentText=[];
  languageDirection=[];
  public getReplacedContent(banner) {
    this.contentText=[]
    for (let bd of banner) {
      this.contentText.push(this.sanitized.bypassSecurityTrustHtml(bd.content));
      this.alignCss.push(bd.languageDirection == 'RTL' ? 'text-right' : '');
      this.languageDirection.push(bd.languageDirection == 'RTL' ? 'direction' : '');
    }
  }
  
  public bannersLocaleBeanA(edit) {
    const control = <FormArray>this.createBannerFormGroup.controls['bannersLocaleBean'];
    if(edit == undefined || edit == null){
      for (let i = 0; i < this.languageList.length; i++) {
        const newForm = this.fb.group({
          imgPath: this.imagePath[i],
          videoPath: this.videoPath[i],
          title:'',
          content:'',
          detailImage:this.imagePath1[i]
        });
        control.push(newForm);
      }
    }else{
    for (let i = 0; i < this.languageList.length; i++) {
      const newForm = this.fb.group({
        imgPath: this.imagePath[i],
        videoPath: this.videoPath[i],
        title:edit[i].title,
        content:edit[i].content,
        detailImage:this.imagePath1[i]
      });
      control.push(newForm);
    }
  }
  }

  public updateBanners(formData,SeqNo,cityId, countryId) {
    if (this.bannerDetailId <= 0) { 
      this.showError = false;
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
      if(this.createBannerFormGroup.valid && this.bannerCtrl.status == "VALID"){

      let TempArray =['Store', 'Mall','Specific Brand','FAQ'];
      if(TempArray.includes(formData.bannerLinkThrough)){
          if(formData.bannerLinkThrough != null && formData.bannerLinkThrough != ''){
            if(formData.bannerLinkThrough == 'Store' && this.linkToStoreCtrl.status == 'VALID'){
              this.linkToId = this.prePopulateStoreId;
            }else if(formData.bannerLinkThrough == 'Mall' && this.linkToMallCtrl.status == 'VALID'){
              this.linkToId = this.prePopulateMallId;
            }else if(formData.bannerLinkThrough == 'Specific Brand' && this.linkToBrandCtrl.status == 'VALID'){
              this.linkToId = this.prePopulateBrandId;
            }else if(formData.bannerLinkThrough == 'FAQ' && this.linkToFaqCtrl.status == 'VALID'){
              this.linkToId = this.prePopulateFaqId;
            }else{
              return
            }
          }
        }
      
        for (let i = 0; i < formData.bannersLocaleBean.length; i++) {
          if(this.bannerType != 'type2'){
          if (formData.bannersLocaleBean[i] != '') {
            let locale = {
              languageId: this.languageList[i].languageId,
              imgPath: this.imagePath[i],
              LangDirectionType: this.languageList[i].languageDirection
            }
            this.bannersLocaleBeanArray.push(locale);
          }
        }
        else {
          if (formData.bannersLocaleBean[i] != '') {
            let locale = {
              languageId: this.languageList[i].languageId,
              imgPath: this.imagePath[i],
              videoPath:this.videoPath[i],
              LangDirectionType: this.languageList[i].languageDirection,
              title:formData.bannersLocaleBean[i]['title'],
              content:formData.bannersLocaleBean[i]['content'],
              detailImage:this.imagePath1[i],
            }
            this.bannersLocaleBeanArray.push(locale);
          }
          }
        }
        
        const requestBody = {
          bannerId: this.prePopulateBannerId,
          linkToId: this.linkToId,
          linkTo: formData.bannerLinkThrough,
          externalLink: formData.hyperlink,
          countryOid: this.countryId,
          cityOid: this.cityOid,
          imgPath: '',
          sequenceNum: this.sequenceNum,
          bannerName: formData.bannerName,
          bannerManagementLocaleBean: this.bannersLocaleBeanArray
        };
      
        let CREATE_BANNER ;
        if(this.bannerType == 'type2'){
          CREATE_BANNER = environment.APIEndpoint + 'api/rpa/banners/v1/TypeTwo/create/bannerDetails';
        }else{
          CREATE_BANNER = environment.APIEndpoint + 'api/rpa/banners/v1/create/bannerDetails';
        }
        this.http.postJson(CREATE_BANNER, requestBody).subscribe(
          (response) => {
            this.snackBar.openFromComponent(SnackBarComponent, {
              duration: 10000,
              data: {
                status: "success",
                message: "Banner updated successfully"
              }
            });
         
            localStorage.setItem('BannerSeachSeqNo', SeqNo);
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
          }
        );
      }
    }
    else {
      this.showError = false;
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
    
      if(this.createBannerFormGroup.valid && this.bannerCtrl.status == "VALID"){
      let TempArray =['Store', 'Mall','Specific Brand','FAQ'];
      if(TempArray.includes(formData.bannerLinkThrough)){
      
          if(formData.bannerLinkThrough != null && formData.bannerLinkThrough != ''){
            if(formData.bannerLinkThrough == 'Store' && this.linkToStoreCtrl.status == 'VALID'){
              this.linkToId = this.prePopulateStoreId;
            }
            else if(formData.bannerLinkThrough == 'Mall' && this.linkToMallCtrl.status == 'VALID'){
              this.linkToId = this.prePopulateMallId;
            }
            else if(formData.bannerLinkThrough == 'Specific Brand' && this.linkToBrandCtrl.status == 'VALID'){
              this.linkToId = this.prePopulateBrandId;
            }
            else if(formData.bannerLinkThrough == 'FAQ' && this.linkToFaqCtrl.status == 'VALID'){
              this.linkToId = this.prePopulateFaqId;
            }
            else {
              return
            }
          }
        }
     
        for (let i = 0; i < formData.bannersLocaleBean.length; i++) {
          if(this.bannerType != 'type2'){
          if (formData.bannersLocaleBean[i] != '') {
            let locale = {
              languageId: this.languageList[i].languageId,
              imgPath: this.imagePath[i],
              LangDirectionType: this.languageList[i].languageDirection
            }
            this.bannersLocaleBeanArray.push(locale);
          }
        }
        else {
          if (formData.bannersLocaleBean[i] != '') {
            let locale = {
              languageId: this.languageList[i].languageId,
              imgPath: this.imagePath[i],
              videoPath:this.videoPath[i],
              LangDirectionType: this.languageList[i].languageDirection,
              title:formData.bannersLocaleBean[i]['title'],
              content:formData.bannersLocaleBean[i]['content'],
              detailImage:this.imagePath1[i],
            }
            this.bannersLocaleBeanArray.push(locale);
          }
          }
        }

        const requestBody = {
          bannerId: this.prePopulateBannerId,
          bannerDetailId: this.bannerDetailId,
          linkToId: this.linkToId,
          linkTo: formData.bannerLinkThrough,
          externalLink: formData.hyperlink,
          countryOid: this.countryId,
          cityOid: this.cityOid,
          imgPath: '',
          sequenceNum: this.sequenceNum,
          bannerName: formData.bannerName,
          bannerManagementLocaleBean: this.bannersLocaleBeanArray,
        };

        let UPDATE_BANNER ;
        if(this.bannerType == 'type2'){
          UPDATE_BANNER = environment.APIEndpoint + 'api/rpa/banners/v1/TypeTwo/update/bannerDetails';
        }
        else {
          UPDATE_BANNER = environment.APIEndpoint + 'api/rpa/banners/v1/update/bannerDetails';
        }
        this.http.postJson(UPDATE_BANNER, requestBody).subscribe(
          (response) => {
            this.snackBar.openFromComponent(SnackBarComponent, {
              duration: 10000,
              data: {
                status: "success",
                message: "Banner updated successfully"
              }
            });
            localStorage.setItem('BannerSeachSeqNo', SeqNo);
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
    }
  }

  viewBannerManagement(sequenceNo, selectedCityOid, SelectedCountryOid){
    localStorage.setItem('BannerSeqNo', sequenceNo);
    localStorage.setItem('BannerSelectedCity', selectedCityOid);
    localStorage.setItem('BannerSelectedCountry', SelectedCountryOid);
    localStorage.setItem('bannerType', this.bannerType);
    this.router.navigate(['/search-banner']);
  }

  GoToSearchBanner(SeqNo, cityId, countryId) {
    localStorage.setItem('BannerSeachSeqNo', SeqNo);
    localStorage.setItem('BannerSearchCity', cityId);
    localStorage.setItem('BannerSearchCountry', countryId);
    localStorage.setItem('bannerType', this.bannerType);
    this.router.navigate(['/search-banner']);
  }

  GoToSearchBannerCanCel(SeqNo, cityId, countryId) {
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