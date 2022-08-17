import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, Validators, FormBuilder, FormGroup, NgForm, FormGroupDirective, FormArray, } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { HttpService } from 'src/app/services/http-service';
import { environment } from 'src/environments/environment';
import { Router, ActivatedRoute } from '@angular/router';
import { ErrorStateMatcher } from '@angular/material/core';
import { SnackBarComponent } from 'src/app/shared/components/snack-bar/snack-bar.component';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { MatDialog } from '@angular/material';
import { selectStoreDialog } from 'src/app/shared/components/select-store-dialog/select-store.component';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

export interface UserData {
  storeOid: number;
  storeName: string;
  address: string;
}

@Component({
  selector: 'edit-delivery-area',
  templateUrl: './edit-delivery-area.component.html',
  styleUrls: ['./edit-delivery-area.component.scss']
})

export class EditDeliveryAreaComponent implements OnInit {
  public scrollbarOptions = { axis: 'y', theme: 'minimal-dark' };
  public breadCrumbData: Array<Object> = [{
    title: 'Store Management',
    link: ''
  }, {
    title: 'Delivery Areas',
    link: ''
  }
  ];

  deliveryAreaFormGroup: FormGroup;
  public deliveryAreaData: any = [];
  public statusValue: string = 'ONLINE';
  public imgUpload = false;
  public checked = true;
  public disabled;
  public deliveryAreaId;
  public toggleVal: boolean = false;
  displayedColumns: string[] = ['storeId', 'storeName', 'address'];
  dataSource: MatTableDataSource<UserData>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  public deliveryAreaLocale;
  public showError: boolean = false;
  public loading: boolean = false;
  public totalCount: number = 0;
  public storeCountTotal: any = 2000;
  alignCss = [];
  public languageList = JSON.parse(localStorage.getItem("languageList"));
  public countries: any = [];
  public cities: any = [];
  public showCountryError: boolean = false;
  public setCityValue: boolean = false;
  public selectedStore = [];
  stores = [];
  public googleMapData;
  public placeId: string;
  public formatedAddress: string;
  public countryName: string;
  public cityName: string;
  public areaName: string;
  BrandList = [];
  languageDirection = [];
  responseVar: any;

  constructor(private fb: FormBuilder,
    private http: HttpService,
    private https: HttpService,
    private activatedRoute: ActivatedRoute,
    public dialog: MatDialog,
    private router: Router, public snackBar: MatSnackBar) {
  }

  ngOnInit() {
    this.editbuildForm();
    let data = localStorage.getItem('DeliveryAreaEditID');
    if (data) {
      this.deliveryAreaId = data;
      this.getBrandList();
      this.dataSource = new MatTableDataSource();
      this.getDeliveryAreaById();
      this.getAllCountries();
      localStorage.removeItem('DeliveryAreaEditID');
    } else {
      sessionStorage.clear();
      this.router.navigate(['/search-delivery-area']);
    }
  }

  editbuildForm() {
    let form = {
      deliveryAreaArray: this.fb.array([]),
      country: ["", Validators.compose([Validators.required])],
      city: ["", Validators.compose([Validators.required])],
      address: ["", Validators.compose([Validators.required])],
      brand: [""]
    }
    this.deliveryAreaFormGroup = this.fb.group(form);
  }

  public getDeliveryAreaById() {
    let GET_DELIVERY_AREA_BY_ID = environment.APIEndpoint + "api/rpa/store/deliveryArea/v1/view";
    let request = {
      deliveryAreaOid: this.deliveryAreaId
    }
    this.http.postJson(GET_DELIVERY_AREA_BY_ID, request)
      .subscribe((response) => {
        this.deliveryAreaData = response;
        this.toggleVal = (this.deliveryAreaData.status == 'ONLINE' ? true : false);
        this.getAllCities(this.deliveryAreaData.countryOid);
        this.setCityValue = true;
        this.buildEditDeliveryAreaForm(response);
        this.deliveryAreaLocaleArray(response['deliveryAreaLocales']);
        this.statusValue = response['status'];
        this.dataSource.data = response['stores'];
      }
        , err => {
          this.snackBar.openFromComponent(SnackBarComponent, {
            duration: 1500,
            data: {
              status: "failure",
              message: "Your request cannot be saved at this time. Please try again later"
            }
          });
        });
  }

  getCountryName(countryName) {
    this.countryName = countryName;
  }

  getCityName(cityName) {
    this.cityName = cityName;
  }

  getAreaName(formData) {
    this.areaName = formData.deliveryAreaArray[0].areaName;
  }

  public buildEditDeliveryAreaForm(editData) {
    let brandOid = '';
    if (editData.brandOid != null) {
      brandOid = editData.brandOid.toString();
    }
    let form = {
      deliveryAreaArray: this.fb.array([]),
      country: [editData.countryOid, Validators.compose([Validators.required])],
      city: [editData.cityOid, Validators.compose([Validators.required])],
      address: [editData.address, Validators.compose([Validators.required])],
      brand: [brandOid]
    }
    this.deliveryAreaFormGroup = this.fb.group(form);
  }

  deliveryAreaLocaleArray(deliveryAreaArray) {
    let control = <FormArray>this.deliveryAreaFormGroup.controls['deliveryAreaArray'];
    for (let deliveryArea of deliveryAreaArray) {
      let form = this.fb.group({
        areaName: [deliveryArea.areaName, Validators.compose([Validators.required,Validators.pattern('^[a-zA-Z0-9\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF \"&\'(),-:.?_ ]*')])],
      });
      control.push(form);
      this.alignCss.push(deliveryArea.languageDirection == 'RTL' ? 'text-right' : '');
      this.languageDirection.push(deliveryArea.languageDirection == 'RTL' ? 'direction' : '');
    }
  }

  getAllCountries() {
    let GET_ALL_COUNTRIES = environment.APIEndpoint + "api/rpa/master/country/v1/get/countries";
    this.http.getJson(GET_ALL_COUNTRIES)
      .subscribe((response) => {
        this.countries = response;
      });
  }

  getAllCities(countryId) {
    let GET_ALL_CITIES = environment.APIEndpoint + "api/rpa/master/city/v1/get/cities";
    this.http.getJson(GET_ALL_CITIES + "?countryIds=" + countryId)
      .subscribe((response) => {
        this.cities = response;
      });
  }

  checkCountryId() {
    if (this.cities.length == 0){
      this.showCountryError = true;
    }
    else{
      this.showCountryError = false;
    }
  }

  updateDeliveryArea(formData) {
    this.deliveryAreaLocale = [];
    if (this.deliveryAreaFormGroup.invalid == true) {
      this.showError = true;
      return
    }
    else {
      this.loading = true;
      this.showError = false;
      let selectedStorearray = this.dataSource.data.map(a => a.storeOid);
      formData.deliveryAreaArray.forEach((deliveryAreaLocale, index) => {
        this.deliveryAreaLocale.push({
          areaName: deliveryAreaLocale.areaName,
          languageOid: this.deliveryAreaData.deliveryAreaLocales[index].languageOid
        });
      });

      let requestBody = {
        deliveryAreaOid: this.deliveryAreaId,
        countryOid: parseInt(formData.country),
        cityOid: parseInt(formData.city),
         placeId: '',
        address: formData.address,
        deliveryAreaLocales: this.deliveryAreaLocale,
        status: this.statusValue,
        storeOids: selectedStorearray,
        brandOid: formData.brand
      }

      let UPDATE_DELIVERY_AREA = environment.APIEndpoint + "api/rpa/store/deliveryArea/v2/update";
      this.http.postJson(UPDATE_DELIVERY_AREA, requestBody)
        .subscribe((response) => {
          this.responseVar = response;
          this.snackBar.openFromComponent(SnackBarComponent, {
            duration: 10000,
            data: {
              status: "success",
              message: "Delivery area updated successfully"
            }
          });
          this.loading = false;
          sessionStorage.clear();
          this.router.navigate(['/search-delivery-area']);
        }
          , err => {
            this.loading = false;
            if (err.error.status == 500) {
              this.snackBar.openFromComponent(SnackBarComponent, {
                duration: 10000,
                data: {
                  status: "failure",
                  message: "Your request cannot be saved at this time. Please try again later"
                }
              });
            } 
            else {
              this.snackBar.openFromComponent(SnackBarComponent, {
                duration: 10000,
                data: {
                  status: "failure",
                  message: err.error.message
                }
              });
            }
          });
    }
  }

  openDialog() {
    const dialogRef = this.dialog.open(selectStoreDialog);
    dialogRef.componentInstance.storeList = this.dataSource.data.map(a => a.storeOid);
    dialogRef.componentInstance.totalCount = this.storeCountTotal;
    dialogRef.afterClosed().subscribe(result => {
      if(result.tableData != undefined){
        this.dataSource.data = result.tableData ? result.tableData : '';
      }
    });
  }

  removeItem(i: number): void {
    this.stores.splice(i, 1);
    this.dataSource.data.splice(i, 1);
  }

  public toggleStatus(event) {
    if (event.checked == true) {
      this.statusValue = 'ONLINE';
    } else {
      this.statusValue = 'OFFLINE';
    }
  }

  getBrandList() {
    let GET_ALL_ONLINE_BRANDS = environment.APIEndpoint + "api/rpa/store/v1/get/storeBrands";
    this.https.getJson(GET_ALL_ONLINE_BRANDS)
      .subscribe((response) => {
        let brandList = response;
        for (let i = 0; i <= brandList.length - 1; i++) {
          let obj = {
            brandId: brandList[i]['brandId'],
            brandName: brandList[i]['brandName'],
          }
          this.BrandList.push(obj);
        }
      },
        (error) => {
        });
  }
}
