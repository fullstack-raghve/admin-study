import { OnInit, ViewChild, Component } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { HttpService } from 'src/app/services/http-service';
import { environment } from 'src/environments/environment';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { MatSort } from '@angular/material';
import { MatTable } from '@angular/material';

export interface BannerData {
  sequenceNum: number;
  bannerId: number;
  bannerName: string;
  linkTo: string;
}

@Component({
  selector: 'search-banner',
  templateUrl: './search-banner.component.html',
  styleUrls: ['./search-banner.component.scss']
})

export class SearchBannerComponent implements OnInit {
  public breadCrumbData: Array<Object> = [{
    title: 'Banner Management',
    link: ''
  }, {
    title: 'Search Banner',
    link: 'search-banner'
  }
  ];
  public noRecords: boolean = false;
  public searchStoreVal: boolean = false;
  public selected = '';
  @ViewChild("searchBannerForm") searchBannerForm;
  searchBannerFormGroup: FormGroup;
  public countries: any = [];
  displayedColumns: string[] = ['position', 'sequenceNum', 'bannerId', 'bannerName', 'linkTo'];
  public dataSource;
  public imgUpload = false;
  public languageList = JSON.parse(localStorage.getItem("languageList"));
  public alignCss = [];
  public imageUploading: boolean = false;
  public imagePath: any = [];
  public filePathUrl = localStorage.getItem("imgBaseUrl");
  public cities: any = [];
  public bannerId: number;
  public bannerDetailId: number;
  public linkToId: number;
  public countryOid: number;
  public cityOid: number;
  public sequenceNum: number;
  public bannerDataList = [];
  public bannerManagementLocaleBean: any = [];
  public storeList = [];
  public mallList = [];
  public brandList = [];
  public faqList = [];
  countryName: string;
  snackBar: any;
  bannersLocaleBeanArray: any;
  public cityId: number;
  public countryId: number;
  showError: boolean;
  createBannerFormGroup: any;
  uploadError: any;
  bannerLocaleArray: any[];
  defaultCountry;
  cityName: string;
  href: string;
  public selectedCountry;
  public selectedCity;
  public resultsLength = 0;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('table') table: MatTable<any>;


  constructor(private fb: FormBuilder, 
    private http: HttpService,
    private https: HttpService, 
    private router: Router, 
    public route: ActivatedRoute) {
    let bannerSearchSeqNo = localStorage.getItem('BannerSeachSeqNo');
    let bannerSearchCity = localStorage.getItem('BannerSearchCity');
    let bannerSearchCountry = localStorage.getItem('BannerSearchCountry');
    if (bannerSearchSeqNo && bannerSearchCity && bannerSearchCountry) {
      this.sequenceNum = Number(bannerSearchSeqNo);
      this.countryId = Number(bannerSearchCountry);
      this.cityOid = Number(bannerSearchCity);
      this.selectedCountry = this.countryId;
      this.selectedCity = this.cityOid;
      localStorage.removeItem('BannerSeachSeqNo');
      localStorage.removeItem('BannerSearchCity');
      localStorage.removeItem('BannerSearchCountry');
    } else {
      this.sequenceNum = 1;
      this.countryId = 1;
      this.cityOid = 0;
      this.selectedCountry = 1;
      this.selectedCity = 0;
    }

    this.getAllCountries();
    this.buildBannerSearchForm();
    this.getAllCities(this.selectedCountry);
  }

  ngOnInit() {
    this.languageList.forEach(lang => {
      this.displayedColumns.push(lang.languageName);
    });
    this.searchVal();
  }

  cityDetails(value: number) {
    this.cityOid = value;
  }

  public buildBannerSearchForm() {
    this.searchBannerFormGroup = this.fb.group({
      countryId: [this.countryId.toString()],
      cityId: [this.cityOid.toString()],
      searchVal: [""],
      bannerType: ['']
    });
    if (localStorage.getItem('bannerType')) {
      this.searchBannerFormGroup.get('bannerType').patchValue(localStorage.getItem('bannerType'));
    } else {
      this.searchBannerFormGroup.get('bannerType').patchValue('type2');
    }
  }

  getAllCountries() {
    let GET_ALL_COUNTRIES = environment.APIEndpoint + "api/rpa/master/country/v1/get/countries";
    this.https.getJson(GET_ALL_COUNTRIES)
      .subscribe((response) => {
        this.countries = response;
      });
  }

  getAllCities(countryId) {
    this.countryOid = countryId;
    let GET_ALL_CITIES = environment.APIEndpoint + "api/rpa/master/city/v1/get/cities";
    this.https.getJson(GET_ALL_CITIES + "?countryIds=" + countryId)
      .subscribe((response) => {
        this.cities = response;
      });
  }

  onChangeClearCity() {
    this.searchBannerFormGroup.get('cityId').setValue('');
    this.cityOid = 0;
    this.searchVal();
  }

  searchVal() {
    this.searchStoreVal = true;
    this.bannerDataList = [];
    if (this.cityOid <= 0) {
      this.cityOid = 0;
      if (this.searchBannerFormGroup.invalid == false) {
        let formdata = this.searchBannerFormGroup.value;
        if (formdata.cityOid == '') {
          this.cityOid = 0;
        }
        let data =
        {
          "keySearch": formdata.searchVal,
          "fieldSearch": [
            {
              "fieldName": "country.oid",
              "fieldValue": this.countryId,
            },
            {
              "fieldName": "city.oid",
              "fieldValue": formdata.cityOid,
            },
          ]
        }
        let SEARCH_BANNER;
        if (this.searchBannerFormGroup.get('bannerType').value == 'type2') {
          SEARCH_BANNER = 'api/rpa/banners/v2/TypeTwo/view/country/' + formdata.countryId

        } 
        else {
          SEARCH_BANNER = 'api/rpa/banners/v2/view/country/' + formdata.countryId
        }

        this.https.getJson(environment.APIEndpoint + SEARCH_BANNER).subscribe(
          (res) => {
            this.searchStoreVal = false;
            this.bannerDataList = res;
            if (this.resultsLength == 0) {
              this.noRecords = true;
            } 
            else {
              this.noRecords = false;
            }
            this.dataSource = res;
          }, err => {
            this.searchStoreVal = true;
          });
      }
    }
    else {
      this.searchStoreVal = true;
      if (this.searchBannerFormGroup.invalid == false) {
        let formdata = this.searchBannerFormGroup.value;
        let data =
        {
          "keySearch": formdata.searchVal,
          "fieldSearch": [
            {
              "fieldName": "country.oid",
              "fieldValue": formdata.countryId,
            },
            {
              "fieldName": "city.oid",
              "fieldValue": formdata.cityOid,
            },
          ]
        }
        let SEARCH_BANNER;
        if (this.searchBannerFormGroup.get('bannerType').value == 'type2') {
          SEARCH_BANNER = 'api/rpa/banners/v2/TypeTwo/view/city/' + this.cityOid
        } 
        else {
          SEARCH_BANNER = 'api/rpa/banners/v2/view/city/' + this.cityOid;
        }

        this.https.getJson(environment.APIEndpoint + SEARCH_BANNER).subscribe(
          (res) => {
            this.searchStoreVal = false;
            this.bannerDataList = res;
            if (this.resultsLength == 0) {
              this.noRecords = true;
            } else {
              this.noRecords = false;
            }
            this.dataSource = res;

          }, err => {
            this.searchStoreVal = true;
          });
      }
    }
  }

  viewBannerManagement(sequenceNo, selectedCityOid, SelectedCountryOid) {
    if (this.countryOid != null && this.countryOid != undefined || this.cityOid != null && this.cityOid != undefined) {
      selectedCityOid = this.cityOid;
      SelectedCountryOid = this.countryOid;
      localStorage.setItem('BannerSeqNo', sequenceNo);
      localStorage.setItem('BannerSelectedCity', selectedCityOid);
      localStorage.setItem('BannerSelectedCountry', SelectedCountryOid);
    } 
    else {
      localStorage.setItem('BannerSeqNo', sequenceNo);
      localStorage.setItem('BannerSelectedCity', selectedCityOid);
      localStorage.setItem('BannerSelectedCountry', SelectedCountryOid);
    }
    localStorage.setItem('bannerType', this.searchBannerFormGroup.get('bannerType').value);
    this.router.navigate(['/view-banner']);
    localStorage.setItem('bannerType', this.searchBannerFormGroup.get('bannerType').value);
  }

  getBannerId() {
    localStorage.setItem('bannerType', this.searchBannerFormGroup.get('bannerType').value);
  }

  dropTable(event: CdkDragDrop<string[]>) {
    const prevIndex = this.dataSource.findIndex((d) => d === event.item.data);
    moveItemInArray(this.dataSource, prevIndex, event.currentIndex);
    this.table.renderRows();
    let TempArray = [];
    for (let i = 0; i <= this.dataSource.length - 1; i++) {
      if (this.dataSource[i]['bannerId'] > 0) {
        let obj = {
          sortOrder: i + 1,
          bannerId: this.dataSource[i]['bannerDetailId']
        }
        TempArray.push(obj)
      }
    }
    let type = this.searchBannerFormGroup.get('bannerType').value;
    let requestBody = {
      bannerType: type.toUpperCase(),
      bannerSortOrder: TempArray,
      countryOid: this.countryOid,
      cityOid: this.cityOid,
    }

    const UPDATE_BANNER = environment.APIEndpoint + 'api/rpa/banners/v1/Banner/sortOrder';
    this.http.postJson(UPDATE_BANNER, requestBody).subscribe(
      (response) => {
        this.searchVal();
      });
  }
  dragDisabled = false;
}
