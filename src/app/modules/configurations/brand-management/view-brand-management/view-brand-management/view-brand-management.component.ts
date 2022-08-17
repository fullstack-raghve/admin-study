import { OnInit, ViewChild, Output, Input, Component, EventEmitter, AfterViewInit } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder, FormGroupDirective, FormArray, NgForm } from '@angular/forms';
import {MatPaginator, MatSort, MatTableDataSource, MatTabsModule, MatSnackBar} from '@angular/material';
import {MatDialogModule} from '@angular/material/dialog';
import {SelectionModel} from '@angular/cdk/collections';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { UploadFile } from 'src/app/services/uploadFile.service';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpService } from 'src/app/services/http-service';
import { environment } from 'src/environments/environment';
import { SnackBarComponent } from 'src/app/shared/components/snack-bar/snack-bar.component';
import * as moment from 'moment';
import { BehaviorSubject } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';


export interface CouponData {
  couponId: string;
  couponTitle: string;
  discountType: string;
  discountValue: string; 
  startDate: string;
  endDate: string;
  createdBy: string;
  modifiedTime: string;
   status: string;
}
export interface StoreData {
  storeId: number;
  userId: number;
  userName: string;
  storeName: string;
  city: string;
  country: string;
  phoneNumber: number;
  adminName: string;
  status: string;
}
export interface BrandWallData {
  productName: string;
  productSku: string;
  imageType: string;
  modifiedTime: string;
  // expectedExpiryDate : string;
  status: string;
}


@Component({
  selector: 'view-brand-management',
  templateUrl: './view-brand-management.component.html',
  styleUrls: ['./view-brand-management.component.scss']
})
export class ViewBrandComponent implements OnInit {
  selectable = true;
  removable = true;

  public imgUpload = false;
  public imgUploadArabic = false;
  public breadCrumbData: Array<Object> = [{
        title: 'Brand Management',
        link: ''
      },{
        title: 'View Brand',
        link: 'search-notifications'
    }
      ];

      public filePathUrl=localStorage.getItem("imgBaseUrl");
      public searchBrandCouponFormGroup:FormGroup;
      public searchBrandStoreFormGroup: FormGroup;
      public searchBrandWallFormGroup: FormGroup;
      public brandRegionId:number;
      public tabSelectionId:number;
      public countryOid:number;
      public brandOid:number;
      public alignCss=[];
      public checked=false; 
      public brandData;
      public brandRegionLocaleArray : any =[];
      public paginationData;
      public resultsLength = 0;
      public couponResultsLength = 0;
      public  brandList=[];
      public countries:any=[];
      public cities:any=[];
      public showCountryError:boolean=false;
      public showCityError=false;
      public mallList=[];
      public contentText=[];
      public isBrandWallTabActive:boolean=false;

displayedCouponColumns: string[] = ['couponId', 'couponTitle', 'discountType', 'discountValue', 'startDate', 'endDate','createdBy', 'modifiedTime', 'status' ];
dataSource: MatTableDataSource<CouponData>;
displayedStoreColumns: string[] = ['storeId', 'userId', 'userName', 'storeName', 'cityName', 'countryName', 'phoneNumber', 'storeAdminName', 'status' ];
dataSource1: MatTableDataSource<StoreData>;
displayedBrandWallColumns: string[] = ['productName', 'productSku', 'imageType', 'modifiedTime','status' ];
dataSource2: MatTableDataSource<BrandWallData>;

@ViewChild(MatPaginator) paginator: MatPaginator;
@ViewChild(MatSort) sort: MatSort;
@ViewChild(MatPaginator) paginator1: MatPaginator;
@ViewChild(MatSort) sort1: MatSort;
@ViewChild(MatPaginator) paginator2: MatPaginator;
@ViewChild(MatSort) sort2: MatSort;

constructor(
  private fb: FormBuilder,
  private activatedRoute: ActivatedRoute,
  private http:HttpService,
  public snackBar: MatSnackBar,
  private https: HttpService, 
  public router: Router,
  private sanitized: DomSanitizer) {
    // this.activatedRoute.params.subscribe((params) => {
    //       this.brandRegionId = params['id'];
    //       this.tabSelectionId = params['tabSelectionIndex'];
    //   });
      this.buildSearchBrandCouponForm();
      this.buildSearchBrandStoreForm();
      this.buildSearchBrandWallForm();
      this.dataSource = new MatTableDataSource();
      this.dataSource1 = new MatTableDataSource();
      this.dataSource2 = new MatTableDataSource();
  }


  ngOnInit() {
    let data = localStorage.getItem('viewBrandManagementId');
    if(data){
      this.brandRegionId=Number(data);
      this.tabSelectionId = 0;
      this.getBrandById();
      this.getAllBrands();
      this.getAllCountries();
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.dataSource1.paginator = this.paginator1;
      this.dataSource1.sort = this.sort1;
      this.dataSource2.paginator = this.paginator2;
      this.dataSource2.sort = this.sort2;
      localStorage.removeItem('viewBrandManagementId')
    }else{
      sessionStorage.clear();
      this.router.navigate(['/search-brand-management'])
    }


    
  }

  public getBrandById(){
    let GET_BRAND_BY_ID = environment.APIEndpoint+"api/rpa/master/brand/v1/view";
    let request = {
      brandRegionOid:this.brandRegionId
    }
    this.http.postJson(GET_BRAND_BY_ID,request)
    .subscribe((response) => {
            this.brandData= response;
            this.isBrandWallTabActive = true;
            this.countryOid = response['countryOid'];
            this.brandOid = response['brandOid'];
            this.checked = response['status']=='ONLINE'?true:false;
            
            for(let c of this.brandData.brandLocales){
                this.alignCss.push(c.languageDirection == 'RTL' ? 'text-right' : '');
            }
            this.brandRegionLocaleArray = response['brandsRegionLocale'];
            for(let b of this.brandRegionLocaleArray){
              this.alignCss.push(b.languageDirection == 'RTL' ? 'text-right' : '');
            }
            this.getReplacedContent(this.brandData);
            this.searchBrandCoupon();
            this.searchBrandStore();
            this.searchBrandWall();
        }
        ,err => {
            this.snackBar.openFromComponent(SnackBarComponent, {
                duration: 1500,
                data: {
                    status: "failure",
                    message: "Your request cannot be saved at this time. Please try again later"
                }
            });
        })
      }
      
      public getReplacedContent(viewData){
        for(let bd of viewData.brandsRegionLocale) {
          this.contentText.push(this.sanitized.bypassSecurityTrustHtml(bd.aboutBrand));
        }
      }

      getAllBrands(){
        let GET_ALL_ONLINE_BRANDS = environment.APIEndpoint + "api/rpa/master/brand/v1/get/brands";
        this.https.getJson(GET_ALL_ONLINE_BRANDS)
        .subscribe((response) => {
            this.brandList = response;
        })
      }

      getAllCountries() {
        let GET_ALL_COUNTRIES = environment.APIEndpoint + "api/rpa/master/country/v1/get/countries";
        this.https.getJson(GET_ALL_COUNTRIES)
            .subscribe((response) => {
                this.countries = response;
            })
      }

      getAllCities(countryId) {
        if(countryId==undefined || countryId==''){
        //    this.showCountryError=true;
        } else{
            let GET_ALL_CITIES = environment.APIEndpoint + "api/rpa/master/city/v1/get/cities";
            this.https.getJson(GET_ALL_CITIES + "?countryIds="+countryId)
                .subscribe((response) => {
                    this.cities = response;
                    this.showCountryError=false;
                    this.showCityError=false;
                })
            }
      }

      getAllMalls(cityId){
        if(cityId==undefined || cityId==''){
           // this.showCityError=true;
        } else{
            let GET_ALL_MALLS =  environment.APIEndpoint + "api/rpa/master/mall/v1/get/malls"
            this.https.getJson(GET_ALL_MALLS + "?cityIds="+cityId)
                .subscribe((response) => {
                    this.mallList = response;
                    this.showCityError=false;

                })
            }
      }

      checkCityId(){
        if(this.mallList.length==0)
            this.showCityError=true;
        else
            this.showCityError=false

        if(this.cities.length==0)
            this.showCountryError=true;
        else
            this.showCountryError=false

    }
    isCountrySelected(country){
        if(country == undefined || country == '')
            this.showCountryError=true;
        else
            this.showCountryError=false
    }

myTrim(x) {
  return x.replace(/^\s+|\s+$/gm,'');
 }

searchBrandCoupon() {  
  let formdata = this.searchBrandCouponFormGroup.value;
  let data =
  {
    "page": this.paginationData !== undefined ? this.paginationData.pageIndex : "0",
    "pageSize": this.paginationData !== undefined ? this.paginationData.pageSize : "10",
    "order": {
      "column": "modifiedTime",
      "dir": "desc"
    },
    "keySearch": this.myTrim(formdata.searchVal),
    "fieldSearch": [
      {
        "fieldName": "oid",
        "fieldValue": this.myTrim(formdata.couponId)
      },
      {
        "fieldName": "couponTitle",
        "fieldValue": this.myTrim(formdata.couponTitle)
      },
      {
        "fieldName": "discountType",
        "fieldValue": this.myTrim(formdata.discountType)
      },
      {
          "fieldName": "notificationType",
          "fieldValue": this.myTrim(formdata.notificationType)
      },
      {
        "fieldName": "countryOids",
        "fieldValue": formdata.country.toString()
      },
      {
        "fieldName": "cityOids",
        "fieldValue": formdata.city.toString()
      },
      {
          "fieldName": "startDate",
          "fieldValue": formdata.startDate!='' ? moment(formdata.startDate).format('YYYY-MM-DD'):''
      },
      {
          "fieldName": "endDate",
          "fieldValue":formdata.endDate!='' ? moment(formdata.endDate).format('YYYY-MM-DD'):''
      },
      {
        "fieldName": "status",
        "fieldValue": formdata.status
      }
    ]
  }
let GET_COUPONS_BY_BRAND_OID = environment.APIEndpoint + "api/rpa/coupon/v1/brandCouponSearch";
  this.https.postJson(GET_COUPONS_BY_BRAND_OID+"?brandOid="+this.brandOid, data).subscribe(res => {
    this.dataSource.data = res["items"];
    this.couponResultsLength = res["totalCount"];
    this.dataSource = new MatTableDataSource(res["items"]);
    this.dataSource.sort = this.sort;
    }, err => {
  });
}

public buildSearchBrandCouponForm(){
  let form = {
          couponId:["",Validators.compose([Validators.pattern('^[0-9]*')])],
          couponTitle:["",Validators.compose([Validators.pattern('^[a-zA-Z0-9\u0600-\u06FF \"&\'(),-:.?_ ]*')])],
          discountType:[""],
          notificationType:[""],
          country:[""],
          city:[""],
          searchVal: [""],
          status:[""],
          startDate:[""],
          endDate:[""],
          
    }
    this.searchBrandCouponFormGroup=this.fb.group(form);
}

      paginationDetail = new BehaviorSubject(
      {
        length: 10,
        pageIndex: 0,
        pageSize: 10
      });

      getUpdate(event) {
      this.paginationDetail.next(event);
      this.paginationData = event;
      this.searchBrandStore();
      }

      getCouponUpdate(event) {
      this.paginationDetail.next(event);
      this.paginationData = event;
      this.searchBrandCoupon();
      }

      getBrandWallUpdate(event) {
        this.paginationDetail.next(event);
        this.paginationData = event;
        this.searchBrandWall();
      }
  
    status = true;
    openFilter() {
    this.status = !this.status;
    }

    searchBrandStore() {
      let formdata = this.searchBrandStoreFormGroup.value;
      if(!this.searchBrandStoreFormGroup.invalid){
          let data =
          {
            "page": this.paginationData !== undefined ? this.paginationData.pageIndex : "0",
            "pageSize": this.paginationData !== undefined ? this.paginationData.pageSize : "10",
            "order": {
              "column": "modifiedTime",
              "dir": "desc"
            },
            "keySearch": formdata.searchVal,
            "fieldSearch": [
              {
                "fieldName": "storeAdmin.adminName",
                "fieldValue": formdata.adminName,
              },
              {
                "fieldName": "brand.oid",
                "fieldValue": this.brandOid
              },
              {
                "fieldName": "storeId",
                "fieldValue": formdata.storeId
              },
              {
                "fieldName": "storeName",
                "fieldValue": formdata.storeName
              },
              {
                "fieldName": "mall.oid",
                "fieldValue": formdata.mall,
              },
              {
                "fieldName": "city.oid",
                "fieldValue": formdata.city
              },
              {
                "fieldName": "country.oid",
                "fieldValue": formdata.country
              },
              {
                "fieldName": "storeAdmin.emailId",
                "fieldValue": formdata.emailId
              },
               {
                "fieldName" : "storeAdmin.phoneNumber",
                "fieldValue" :formdata.phoneNumber
              },
              {
                "fieldName": "status",
                "fieldValue": formdata.status
              }
            ]
          }
          this.https.postJson(environment.APIEndpoint + 'api/rpa/store/v1/search', data).subscribe(res => {
          //this.dataSource1 = res["items"];
          this.resultsLength = res["totalCount"]
          this.dataSource1 = new MatTableDataSource(res["items"]);
          this.dataSource1.sort = this.sort1;
          }, err => {
          })
      }
    }

    buildSearchBrandStoreForm(){
      this.searchBrandStoreFormGroup = this.fb.group({
        // fullName: ["",Validators.pattern('[a-zA-Z\u0600-\u06FF \"&\'(),-:.?_ ]*')],
        brands: [""],
        storeId: ["",Validators.pattern('[a-zA-Z0-9]{1,15}$')],
        adminName: [""],
        country: [""],
        city: [""],
        mall: [""],
        emailId: ["",Validators.compose([Validators.minLength(7), Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")])],
        phoneNumber: ["",Validators.compose([Validators.minLength(8),Validators.pattern('[0-9]{8,15}$')])],
        storeName: ["",Validators.pattern('[a-zA-Z0-9\u0600-\u06FF \"&\'(),-:.?_ ]*')],
        status: [""],
        searchVal: [""]
      });
  }



  buildSearchBrandWallForm(){
    this.searchBrandWallFormGroup = this.fb.group({
      productName: ["",],
      productSku: ["",],
      imageType: [""],
      status: [""],
      searchVal: [""]
    });
}

  searchBrandWall() {
    let formdata = this.searchBrandWallFormGroup.value;
    if(!this.searchBrandWallFormGroup.invalid){
        let data =
        {
          "page": this.paginationData !== undefined ? this.paginationData.pageIndex : "0",
          "pageSize": this.paginationData !== undefined ? this.paginationData.pageSize : "10",
          "order": {
            "column": "modifiedTime",
            "dir": "desc"
          },
          "keySearch": formdata.searchVal,
          "fieldSearch": [
            {
              "fieldName": "brandsRegion.oid",
              "fieldValue": this.brandRegionId
            },
            {
              "fieldName": "productName",
              "fieldValue": formdata.productName
            },
            {
              "fieldName": "productSku",
              "fieldValue": formdata.productSku,
            },
            {
              "fieldName": "imageType",
              "fieldValue": formdata.imageType
            },
            {
              "fieldName": "status",
              "fieldValue": formdata.status
            }
          ]
        }
        this.https.postJson(environment.APIEndpoint + 'api/rpa/master/brand/wall/v1/search', data).subscribe(res => {
        //this.dataSource1 = res["items"];
        this.resultsLength = res["totalCount"]
        this.dataSource2 = new MatTableDataSource(res["items"]);
        this.dataSource2.sort = this.sort2;
        }, err => {
        });
    }
  }
    
  resetBrandStoreForm(){
    this.buildSearchBrandStoreForm();
    this.searchBrandStore();
    this.showCountryError=false;
    this.showCityError=false;
    this.countries=[];
    this.cities=[];
    this.mallList=[];
    this.getAllCountries();
   }

   resetBrandCouponForm(){
    this.buildSearchBrandCouponForm();
    this.searchBrandCoupon();
    this.showCountryError=false;
    this.countries=[];
    this.cities=[];
    this.getAllCountries();
   }
  
   resetBrandWallForm(){
    this.buildSearchBrandWallForm();
    this.searchBrandWall();
   }

  remove(){
  }
  viewStore(ID){
    localStorage.setItem('StoreViewID',ID);
    this.router.navigate(['/view-store'])
  }
  MoveToEdit(ID){
    localStorage.setItem('BrandManagementEditId',ID);
    this.router.navigate(['/edit-brand-management']);
  }
}