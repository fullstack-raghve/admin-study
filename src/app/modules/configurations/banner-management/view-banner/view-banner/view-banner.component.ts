import { OnInit, Component } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { HttpService } from 'src/app/services/http-service';
import { environment } from 'src/environments/environment';
import { SnackBarComponent } from 'src/app/shared/components/snack-bar/snack-bar.component';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'view-banner',
  templateUrl: './view-banner.component.html',
  styleUrls: ['./view-banner.component.scss']
})
export class ViewBannerComponent implements OnInit {
  public breadCrumbData: Array<Object> = [{
    title: 'Banner Management',
    link: ''
  }, {
    title: 'View Banner',
    link: 'view-banner'
  }
  ];

  public bannerData = [];
  public bannerDataSingle;
  public imgUpload = false;
  public languageList = JSON.parse(localStorage.getItem("languageList"));
  public alignCss = [];
  public imageUploading: boolean = false;
  public imagePath: any = [];
  public filePathUrl = localStorage.getItem("imgBaseUrl");
  public bannerDetailId: number;
  public sequenceNum: number;
  public bannerLinkThrough;
  public linkToId: number;
  public link
  public cityId: number = 0;
  public countryId: number;
  public linkToList = [];
  public storeList = [];
  public mallList = [];
  public brandList = [];
  public faqList = [];
  public bannerManagementLocaleBean: any = [];
  bannerDataList: any;
  public cityOid: number = 0;
  countries: any[];
  bannerDetailList: any = [];

  constructor(
    private http: HttpService, 
    public snackBar: MatSnackBar, 
    private router: Router, 
    private activatedRoute: ActivatedRoute, 
    private sanitized: DomSanitizer) {
  }
  bannerType;
  ngOnInit() {
    let bannerSeqNo = localStorage.getItem('BannerSeqNo');
    let bannerCity = localStorage.getItem('BannerSelectedCity');
    let bannerCountry = localStorage.getItem('BannerSelectedCountry');
    let bannerType = localStorage.getItem('bannerType')
    if(bannerSeqNo){
      this.sequenceNum=Number(bannerSeqNo);
      this.cityOid=Number(bannerCity);
      this.countryId=Number(bannerCountry);
      let bannerType = localStorage.getItem('bannerType')
      this.bannerType = bannerType;

      this.getBanner();
      this.getBrandByRegion();
      this.getStoreByRegion();
      this.getMallByRegion();
      this.getFaqByRegion();
      this.getBannerDetails();
      localStorage.removeItem('BannerSeqNo')
      localStorage.removeItem('BannerSelectedCity')
      
      localStorage.removeItem('bannerType')
    }else{
      sessionStorage.clear();
      this.router.navigate(['/search-banner'])
    }

  }

  getBannerDetails() {
    if (this.cityOid == null) {
      this.cityOid = 0;
    }
    this.http.getJson(environment.APIEndpoint + 'api/rpa/banners/v1/getRegionDetails/' + this.countryId + '/' + this.cityOid)
      .subscribe((response) => {
        this.bannerDetailList = response;
      })
  }

  getBanner() {
    if (this.cityOid != 0) {
     let GET_BANNER;
      if(this.bannerType == 'type2'){
        GET_BANNER =environment.APIEndpoint+ 'api/rpa/banners/v2/TypeTwo/view/city/' +this.cityOid;
      }else{
        GET_BANNER = environment.APIEndpoint + 'api/rpa/banners/v2/view/city/' + this.cityOid;
      }
      // let GET_BANNER = environment.APIEndpoint + 'api/rpa/banners/v2/view/city/' + this.cityOid;
      this.http.getJson(GET_BANNER)
        .subscribe((response) => {
          this.bannerData = response;
          this.bannerDataSingle = response;
          for (let i = 0; i < this.bannerData.length; i++) {
            if (this.bannerData[i].sequenceNum == this.sequenceNum) {
              this.bannerDataSingle = this.bannerData[i];
            }
          }
          if(this.bannerType == 'type2'){
          this.getReplacedContent( )
          }
        }, err => {
          this.snackBar.openFromComponent(SnackBarComponent, {
            duration: 1500,
            data: {
              status: "failure",
              message: "Your request cannot be saved at this time. Please try again later"
            }
          });
        })
    }
    else {
      let GET_BANNER;
      if(this.bannerType == 'type2'){
        GET_BANNER =environment.APIEndpoint+ 'api/rpa/banners/v2/TypeTwo/view/country/' +this.countryId;
      }else{
        GET_BANNER = environment.APIEndpoint + 'api/rpa/banners/v2/view/country/' + this.countryId;
      }
      this.http.getJson(GET_BANNER)
        .subscribe((response) => {
          this.bannerData = response;
          this.bannerDataSingle = response;

          for (let i = 0; i < this.bannerData.length; i++) {
            if (this.bannerData[i].sequenceNum == this.sequenceNum) {
              this.bannerDataSingle = this.bannerData[i];
            }
          }
          if(this.bannerType == 'type2'){
            this.getReplacedContent( )
            }
        }, err => {
          this.snackBar.openFromComponent(SnackBarComponent, {
            duration: 1500,
            data: {
              status: "failure",
              message: "Your request cannot be saved at this time. Please try again later"
            }
          });
        });
    }
  }

  deletBanner(sequenceNum, cityId, countryId) {
    if (confirm("Are you sure you want to delete ?")) {
      const requestBody = {
        bannerDetailId: this.bannerDataSingle.bannerDetailId,
      }
      const CREATE_BANNER = environment.APIEndpoint + 'api/rpa/banners/v2/delete';
      this.http.postJson(CREATE_BANNER, requestBody).subscribe(
        (response) => {
          this.snackBar.openFromComponent(SnackBarComponent, {
            duration: 10000,
            data: {
              status: "success",
              message: "Banner deleted successfully"
            }
          });
          localStorage.setItem('BannerSeachSeqNo', sequenceNum);
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

  getStoreByRegion() {
    this.http.getJson(environment.APIEndpoint + 'api/rpa/banners/v1/getStoresByRegion/' + this.countryId + '/' + this.cityOid)
      .subscribe((response) => {
        this.storeList = response;
      })
  }

  getMallByRegion() {
    this.http.getJson(environment.APIEndpoint + 'api/rpa/master/mall/v1/getMallByRegion?countryOid=' + this.countryId + '&cityOid=' + this.cityOid)
      .subscribe((response) => {
        this.mallList = response;
      })
  }

  getBrandByRegion() {
    this.http.getJson(environment.APIEndpoint + 'api/rpa/master/brand/v1/getBrandByRegion?countryOid=' + this.countryId + '&cityOid=' + this.cityOid)
      .subscribe((response) => {
        this.brandList = response;
      })
  }

  getFaqByRegion() {
    this.http.getJson(environment.APIEndpoint + 'api/rpa/faq/v1/getFaqByRegion?countryOid=' + this.countryId)
      .subscribe((response) => {
        this.faqList = response;
      })
  }

  MoveToEdit(bannerEditSeqIdNo, bannerCityId, bannerCountryId){
    localStorage.setItem('BannerEditSeqNo', bannerEditSeqIdNo);
    localStorage.setItem('BannerEditCity', bannerCityId);
    localStorage.setItem('BannerEditCountry', bannerCountryId);
    localStorage.setItem('bannerType', this.bannerType);
    this.router.navigate(['/edit-banner']);
  }

  GoToSearchBanner(SeqNo, cityId, countryId){
    localStorage.setItem('BannerSeachSeqNo', SeqNo);
    localStorage.setItem('BannerSearchCity', cityId);
    localStorage.setItem('BannerSearchCountry', countryId);
    localStorage.setItem('bannerType', this.bannerType);
    this.router.navigate(['/search-banner']);
  }

  contentText=[];
  languageDirection=[]
  public getReplacedContent() {
    for (let bd of this.bannerDataSingle['bannerManagementLocaleBean']) {
      this.contentText.push(this.sanitized.bypassSecurityTrustHtml(bd.content));
      this.alignCss.push(bd.languageDirection == 'RTL' ? 'text-right' : '');
      this.languageDirection.push(bd.languageDirection == 'RTL' ? 'direction' : '');
    }
  }
}
