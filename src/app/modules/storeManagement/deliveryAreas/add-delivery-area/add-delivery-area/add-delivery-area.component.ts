import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, Validators, FormBuilder, FormGroup, NgForm, FormGroupDirective, FormArray, } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { HttpService } from 'src/app/services/http-service';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { ErrorStateMatcher } from '@angular/material/core';
import { SnackBarComponent } from 'src/app/shared/components/snack-bar/snack-bar.component';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { MatDialog } from '@angular/material';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
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

declare var require: any;
@Component({
  selector: 'add-delivery-area',
  templateUrl: './add-delivery-area.component.html',
  styleUrls: ['./add-delivery-area.component.scss']
})

export class AddDeliveryAreaComponent implements OnInit {
  public scrollbarOptions = { axis: 'y', theme: 'minimal-dark' };
  public breadCrumbData: Array<Object> = [{
    title: 'Store Management',
    link: ''
    }, {
        title: 'Delivery Areas',
        link: ''
    }
    ];

  deliveryAreaFormGroup:FormGroup;
  public statusValue:string = 'ONLINE';
  public imgUpload = false;
  public checked = true;
  public disabled ;
  public loading: boolean = false;
  displayedColumns: string[] = ['storeId', 'storeName', 'address'];
  dataSource: MatTableDataSource<UserData>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  public totalCount:number=0;
  public storeCountTotal:any=2000;
  alignCss = [];
  public languageList =JSON.parse(localStorage.getItem("languageList"));
  public countries: any = [];
  public result: any = [];
  public cities: any = [];
  public showCountryError:boolean=false;
  public deliveryAreaLocale;
  public showError: boolean = false;
  public selectedCount;
  public selectedStore = [];
  public storeErrorMsg;
  public googleMapData;
  public placeId: string;
  public formatedAddress:string;
  public countryName:string;
  public cityName:string;
  public areaName:string;
  stores = [];
  BrandList = [];
  languageDirection = [];

  constructor(private fb: FormBuilder,
    private http: HttpService,
    private https: HttpService,
    public dialog: MatDialog,
    private router: Router, public snackBar: MatSnackBar, ) {
    this.dataSource = new MatTableDataSource();
    this.buildCreateDeliveryAreaForm();
  }

  ngOnInit() {
    this.getAllCountries();
    this.deliveryAreaLocaleArray();
    this.getBrandList();
  }

  removeItem(i: number): void {
    this.stores.splice(i, 1);
  }

  //<-- drag and drop
  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.stores, event.previousIndex, event.currentIndex);
  }

  // drag and drop -->
  getCountryName(countryName){
    this.countryName = countryName;
  }

  getCityName(cityName){
    this.cityName = cityName;
  }

  getAreaName(formData){
      this.areaName =formData.deliveryAreaArray[0].areaName;
  }

  public buildCreateDeliveryAreaForm() {
    let form = {
        deliveryAreaArray: this.fb.array([]),
        country: ["", Validators.compose([Validators.required])],
        city: ["", Validators.compose([Validators.required])],
        address: ["", Validators.compose([Validators.required])],
        brand:[""]
      }
    this.deliveryAreaFormGroup = this.fb.group(form);
  }

  deliveryAreaLocaleArray(){
    let control = <FormArray>this.deliveryAreaFormGroup.controls['deliveryAreaArray'];
    for(let i=0;i<this.languageList.length;i++){
    let form = this.fb.group({
      areaName:['',Validators.compose([Validators.required,Validators.pattern('^[a-zA-Z0-9\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF \"&\'(),-:.?_ ]*')])],
    });
    control.push(form);
    this.alignCss.push(this.languageList[i].direction == 'RTL' ? 'text-right' : '');
    this.languageDirection.push(this.languageList[i].direction == 'RTL' ? 'direction' : '');
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
    this.http.getJson(GET_ALL_CITIES + "?countryIds="+countryId)
        .subscribe((response) => {
            this.cities = response;
        });
  }

  checkCountryId(){
    if(this.cities.length == 0){
      this.showCountryError = true;
    }
    else{
      this.showCountryError = false;
    }
  }

createDeliveryArea(formData){
  this.deliveryAreaLocale = [];
  if (this.deliveryAreaFormGroup.invalid == true) {
      this.showError = true;
      return 
  }else {
    this.loading = true;
    this.showError = false;
    let selectedStorearray = this.dataSource.data.map(a => a.storeOid)
    formData.deliveryAreaArray.forEach((deliveryAreaLocale, index) => {
      let locale={
          languageOid:this.languageList[index].languageId,
          areaName:deliveryAreaLocale.areaName,
      }
      this.deliveryAreaLocale.push(locale);
  });
  
  let requestBody = {
      countryOid:parseInt(formData.country),
      cityOid:parseInt(formData.city),
       placeId: '',
      address: formData.address,
      deliveryAreaLocales:this.deliveryAreaLocale,
      status:this.statusValue,
      storeOids:selectedStorearray,
      brandOid:formData.brand
  }

  let CREATE_DELIVERY_AREA = environment.APIEndpoint +"api/rpa/store/deliveryArea/v2/create";
  this.https.postJson(CREATE_DELIVERY_AREA,requestBody).subscribe(
  (response) => {
      this.snackBar.openFromComponent(SnackBarComponent, {
              duration: 10000,
              data: {
                  status: "success",
                  message: "Delivery area created successfully"
              }
      });
      this.loading = false;
      sessionStorage.clear();
      this.router.navigate(['/search-delivery-area']);
  }
  ,err => {
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
    dialogRef.componentInstance.totalCount=this.storeCountTotal;
    dialogRef.afterClosed().subscribe(result => {
      if(result.tableData != undefined){
        this.dataSource.data=result.tableData ? result.tableData : '';
      }
    });
  }


  public toggleStatus(event){
    if(event.checked==true){
        this.statusValue='ONLINE';
    }else{
         this.statusValue='OFFLINE';
    }
}

getBrandList(){
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