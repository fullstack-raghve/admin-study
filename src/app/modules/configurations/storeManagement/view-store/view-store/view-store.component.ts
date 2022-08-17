import { OnInit, ViewChild, Output, Input, Component, EventEmitter, AfterViewInit } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder, FormGroupDirective, FormArray, NgForm } from '@angular/forms';
import { MatPaginator, MatSort, MatTableDataSource, MatTabsModule, MatSnackBar } from '@angular/material';
import { MatDialogModule } from '@angular/material/dialog';
import { SelectionModel } from '@angular/cdk/collections';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { addBeaconsDialog } from '../../../../../shared/components/add-beacons-dialog/add-beacons.component';
import { storeStaffDialog } from '../../../../../shared/components/store-staff-dialog/storestaff.component';
import { environment } from 'src/environments/environment';
import { HttpService } from 'src/app/services/http-service';
import { Router, ActivatedRoute } from '@angular/router';
import { SnackBarComponent } from 'src/app/shared/components/snack-bar/snack-bar.component';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
export interface PeriodicElement {
  name: string;
  openTime: string;
  closeTime: string;
}
export interface UserData {
  userId: number;
  userName: string;
  firstName: string;
  lastName: string;
  role: string;
  phoneNumber: number;
  email: string;
  status: string;
  actions: string;
}
export interface BeaconsData {
  beaconId: number;
  beaconDisplayName: string;
  status: string;

}


const ELEMENT_DATA: PeriodicElement[] = [
  { name: 'Monday', openTime: '10:30 AM', closeTime: '10:30 PM' },
  { name: 'Tuesday', openTime: '10:30 AM', closeTime: '10:30 PM' },
  { name: 'Wednesday', openTime: '10:30 AM', closeTime: '10:30 PM' },
  { name: 'Thursday', openTime: '10:30 AM', closeTime: '10:30 PM' },
  { name: 'Friday', openTime: '10:30 AM', closeTime: '10:30 PM' },
  { name: 'Saturday', openTime: '10:30 AM', closeTime: '10:30 PM' },
  { name: 'Sunday', openTime: '10:30 AM', closeTime: '10:30 PM' },

];
@Component({
  selector: 'view-store',
  templateUrl: './view-store.component.html',
  styleUrls: ['./view-store.component.scss']
})
export class ViewStoreComponent implements OnInit {
  public scrollbarOptions = { axis: 'y', theme: 'minimal-dark' };
  public scrollbarForAmenities = { axis: 'x', theme: 'minimal-dark' };
  public breadCrumbData: Array<Object> = [{
    title: 'Configurations',
    link: '/login'
  }, {
    title: 'Store Management',
    link: '/search-user'
  },];
  displayedColumnsStaff: string[] = ['userId', 'userName', 'firstName', 'lastName', 'role', 'phoneNumber', 'email', 'status', 'actions'];
  dataSourceStaff: MatTableDataSource<UserData>;
  public paginationData;
  public staffDeleteData;
  public storeId;
  public filePathUrl = localStorage.getItem("imgBaseUrl");
  public previousUrl = localStorage.getItem('previousUrl');
  public storeData = [];
  public checked = false;
  public staffOid = {};
  public staffResultsLength = 0;
  public beaconResultsLength = 0;
  public alignCss = [];
  public statusValue;
  public contactCss = [];
  public storeService;
  public deliveryHours = [];
  public businessHours = [];
  public businessAvailable247 = false;
  public deliveryAvailable247 = false;
  public storeStaffArray = [];
  public activeElement = 1;
  public storeWallData;
  public showNotification: boolean;
  public toggleVal: boolean = true;

  formattedData=[];
  categoryList= [];
  exclusiveProducts= [];
  elementType : 'url' | 'canvas' | 'img' = 'url';
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  // constructor(public dialog: MatDialog<ViewUserComponent>) {
  displayedColumns1: string[] = ['beaconId', 'beaconDisplayName', 'status'];
  dataSource1: MatTableDataSource<BeaconsData>;

  deleteStaffOID;
  displayedColumns: string[] = ['name', 'openTime', 'closeTime'];
  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
  selection = new SelectionModel<PeriodicElement>(true, []);
  public totalCount: [];
  value: string;
  menuUrl: string;

  languageDirection = [];
  productList: any[];
  storeStatusList: any[];
  constructor(public dialog: MatDialog, private fb: FormBuilder, public snackBar: MatSnackBar,
    private http: HttpService,
    private router: Router, private activatedRoute: ActivatedRoute, ) {
    // this.activatedRoute.params.subscribe((params) => {
    //   this.storeId = params.id;

    // });
    let data = 
    {
      "order": {
        "column": "modifiedTime",
        "dir": "desc"
      },
      "keySearch": "",
      "fieldSearch": [
        {
          "fieldName": "status",
          "fieldValue": "ONLINE",
        },
        {
          "fieldName": "fullName",
          "fieldValue": "",
        },
        {
          "fieldName": "emailId",
          "fieldValue": ""
        },

        {
          "fieldName": "employeeId",
          "fieldValue": ""
        },
        {
          "fieldName": "status",
          "fieldValue": ""
        }
      ]
    }

    this.http.postJson(environment.APIEndpoint + 'api/rpa/user/search', data).subscribe(res => {
      console.log(res);
      
      this.totalCount = res['totalCount'];
      // this.selectedCount = res["totalCount"];
      console.log(this.totalCount);
    }); 
    this.showNotification = true;
  }

  ngOnInit() {
    let data = localStorage.getItem('StoreViewID');
    if(data){
      this.storeId=data;
      this.getStoreDetails();
      this.getStoreStaffList();
      this.getBeaconList();
      this.getStoreWallByStoreId();
      this.getAllProducts();

      localStorage.removeItem('StoreViewID')
    }else{
      sessionStorage.clear();
      this.router.navigate(['/search-store'])
    }

  }

  //     showImage(imgName) {
  //  var curImage = document.getElementById('currentImg');
  //  var thePath = 'images/';
  //  var theSource = thePath + imgName;
  //     }
  public selectedItem(id) {
    this.activeElement = id;
  }

  public onCloseClick(): void {
    this.showNotification = false;
  }

  paginationDetail = new BehaviorSubject(
    {
      length: 10,
      pageIndex: 0,
      pageSize: 10
    });


    private convertBase64ToBlob(Base64Image: any) {
      // SPLIT INTO TWO PARTS
      const parts = Base64Image.split(';base64,');
      // HOLD THE CONTENT TYPE
      const imageType = parts[0].split(':')[1];
      // DECODE BASE64 STRING
      const decodedData = window.atob(parts[1]);
      // CREATE UNIT8ARRAY OF SIZE SAME AS ROW DATA LENGTH
      const uInt8Array = new Uint8Array(decodedData.length);
      // INSERT ALL CHARACTER CODE INTO UINT8ARRAY
      for (let i = 0; i < decodedData.length; ++i) {
      uInt8Array[i] = decodedData.charCodeAt(i);
      }
      // RETURN BLOB IMAGE AFTER CONVERSION
      return new Blob([uInt8Array], { type: imageType });
      }

    saveAsImage(parent) {
      console.log(parent)
      // fetches base 64 date from image
      const parentElement = parent.qrcElement.nativeElement.querySelector("img").src;
      
      // converts base 64 encoded image to blobData
      let blobData = this.convertBase64ToBlob(parentElement);
      
      // saves as image
      if (window.navigator && window.navigator.msSaveOrOpenBlob) { //IE
      window.navigator.msSaveOrOpenBlob(blobData, 'Qrcode');
      } else { // chrome
      const blob = new Blob([blobData], { type: "image/png" });
      const url = window.URL.createObjectURL(blob);
      // window.open(url);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'Qrcode';
      link.click();
      }
      
      }

  openDialog() {
    const dialogRef = this.dialog.open(addBeaconsDialog);
    dialogRef.componentInstance.storeId = this.storeId;
    dialogRef.afterClosed().subscribe(() => {
      this.getBeaconList();
    });
  }

  openStoreStaffDialog() {
    const dialogRef = this.dialog.open(storeStaffDialog);
    let array = [];
    this.storeStaffArray.forEach(element => {
      array.push(element.staffId);
    });
    dialogRef.componentInstance.storeList = array;
    dialogRef.componentInstance.totalCount = this.totalCount;
    dialogRef.afterClosed().subscribe((result) => {

      console.log(`Dialog result: ${result}`);
      this.staffOid = result.map(function (item) {
        return item.userId;
      })

      this.assignStoreStaff();
      //this.getBeaconList();
    });

  }
  StoreTypeList = []
  getStoreDetails() {
    let request = {
      storeOid: this.storeId
    }

    let GET_STORE_DETAILS = environment.APIEndpoint + "api/rpa/store/v1/view"
    this.http.postJson(GET_STORE_DETAILS, request)
      .subscribe((response) => {
        this.storeData = response;
        console.log(response);
        console.log(response['storeOid']);
        this.statusValue = response["status"];
        this.checked = response["status"] == 'ONLINE' ? true : false;
        this.deleteStaffOID = response['storeOid'];
        this.menuUrl = response['menuUrl'];
        console.log(this.menuUrl);
        if(environment.APIEndpoint == 'https://danbro-api-uat.reciproci.com/'){
          // this.value = 'https://smo.reciproci.com/#/welcome-page/'+ this.menuUrl;
          this.value = response['dynamicLink'];
        }
        if(environment.APIEndpoint == 'https://danbro-admin-api.reciproci.com/'){
          // this.value = 'https://danbro.reciproci.com/smo/welcome-page/'+ this.menuUrl;
          this.value = response['dynamicLink'];
        }
      if(environment.APIEndpoint == 'https://danbro-preprod-admin-api.reciproci.com/'){
        // this.value = 'https://danbro-preprod.reciproci.com/smo/welcome-page/'+ this.menuUrl;
        this.value = response['dynamicLink'];
      }

      console.log(this.value);
        
        this.storeService = response["storeService"];
        this.deliveryHours = response["deliveryHours"];
        this.businessHours = response["businessHours"];
        let tempArray = response['storeTypes'];
        for(let i=0;i<=tempArray.length-1;i++){
          let key = tempArray[i]['storeTypeValue'];
          this.StoreTypeList.push(key)
        }
      

        for (let l of this.storeData['storeLocales']) {
          this.alignCss.push(l.languageDirection == 'RTL' ? 'text-right' : '');
          this.languageDirection.push(l.languageDirection == 'RTL' ? 'direction' : '');
        }
        if (this.storeData['storeContactPersonDetails'] != undefined && this.storeData['storeContactPersonDetails'].length != 0) {
          for (let cont of this.storeData['storeContactPersonDetails'][0]['contactDetailLocales']) {
            this.contactCss.push(cont.languageDirection == 'RTL' ? 'text-right' : '');
            this.languageDirection.push(cont.languageDirection == 'RTL' ? 'direction' : '');
          }
        }
        if (this.deliveryHours[0].isAvalilable247) {
          this.deliveryAvailable247 = true;
        }
        if (this.businessHours[0].isAvalilable247) {
          this.businessAvailable247 = true;
        }

       
        this.dataSource = this.storeData['storeTimings'];

      })

  }
  getUpdate(event) {
    this.paginationDetail.next(event);
    this.paginationData = event;
    this.getStoreStaffList();
  }

  getStoreStaffList() {
    let request = {
      storeOid: this.storeId
    }
    let GET_STORE_STAFF_LIST = environment.APIEndpoint + "api/rpa/store/v1/staff/list?storeOid=";
    this.http.getJson(GET_STORE_STAFF_LIST + this.storeId)
      .subscribe((response) => {
        this.dataSourceStaff = new MatTableDataSource(response);
        let staffList = response;
        this.staffResultsLength = staffList.length;
        this.storeStaffArray = response;
      })
  }
  getBeaconList() {
    let request = {
      storeOid: this.storeId
    }
    let GET_STORE_BEACON_LIST = environment.APIEndpoint + "api/rpa/store/v1/beacon/list?storeOid=";
    this.http.getJson(GET_STORE_BEACON_LIST + this.storeId)
      .subscribe((response) => {
        console.log(response);

        this.dataSource1 = new MatTableDataSource(response);
        let beaconsList = response;
        this.beaconResultsLength = beaconsList.length;

      })
  }
  assignStoreStaff() {
    let request = {
      storeOid: this.storeId,
      staffOids: this.staffOid
    }
    let ASSIGN_STORE_STAFF = environment.APIEndpoint + 'api/rpa/store/v1/addStaff';
    this.http.postJson(ASSIGN_STORE_STAFF, request).
      subscribe(response => {
        this.snackBar.openFromComponent(SnackBarComponent, {
          duration: 1500,
          data: {
            status: "success",
            message: "Staff member details have been assigned successfully"
          }
        });

        this.getStoreStaffList();
      }, err => {
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
        };
      });
  }

  public getStoreWallByStoreId() {
    let GET_STORE_WALL_BY_STORE_ID = environment.APIEndpoint + "api/rpa/store/wall/v1/view";
    let request = {
      storeOid: this.storeId
    }
    this.http.postJson(GET_STORE_WALL_BY_STORE_ID, request)
      .subscribe((response) => {
        console.log(response);
        this.storeWallData = response;
      }
        , err => {
          this.snackBar.openFromComponent(SnackBarComponent, {
            duration: 1500,
            data: {
              status: "failure",
              message: "Your request cannot be saved at this time. Please try again later"
            }
          });
          console.log("error Status = " + err.status);

        })
  }
  deleteStaff(row) {

    console.log(row.staffOid);
    let GET_STORE_STAFF_DELETE = environment.APIEndpoint + "api/rpa/store/v1/staff/delete";
    let requestBody = {
      staffOid: row.staffOid
    }
    this.http.postJson(GET_STORE_STAFF_DELETE, requestBody)
      .subscribe((response) => {
        console.log(response);
        this.staffDeleteData = response;
        this.getStoreStaffList();
        this.snackBar.openFromComponent(SnackBarComponent, {
          duration: 1500,
          data: {
            status: "sucess",
            message: "Store Staff Deleted Successfully"
          }
        });
      },
        (error) => {
          console.log(error);
          this.snackBar.openFromComponent(SnackBarComponent, {
            duration: 1500,
            data: {
              status: "failure",
              message: "Your request cannot be saved at this time. Please try again later"
            }
          });
        }
      );
  }
  MoveToEdit(ID){
    localStorage.setItem('StoreEditID',ID);
    this.router.navigate(['/edit-store']);
  }

   getAllProducts() {
    // this.contentLoader= true;
    // const GET_ALL_PRODUCTS = environment.APIEndpoint + 'api/rpa/product/v2/getAllCategoriesAllProducts';
    const GET_ALL_PRODUCTS = environment.APIEndpoint + 'api/rpa/product/v2/getStoreMenuProducts';

    this.http.getJsonStore(GET_ALL_PRODUCTS,this.storeId).subscribe((response) => {
this.productList = response;
      // this.contentLoader= false;
      console.log(JSON.stringify(response));
      this.categoryList = response['categories'];
      this.exclusiveProducts = response['exclusiveProducts'];
      console.log(this.categoryList);
      console.log(this.exclusiveProducts)
      this.formatData(response['categories']);
    },(error) => {
      // this.contentLoader= false;
    })
  }

  getProductData(category) {
    let products = [];
    category.products.forEach(product => {
      let productPrice = null;
      // let productSku ;
      // if (product.productVariant.productVariants.length === 1) {
      //   productPrice = product.productVariant.productVariants[0].displayPrice;
      //   productSku = product.productVariant.productVariants[0].skuCode;
      // }
      product.productVariant.selectedVariantQty = 0;
      product.productVariant.selectedVariant = '';
      product.productVariant.selectedVariantName = '';
      let productData = {
        // productSku: productSku,
        productName: product.productName,
        productType: product.productType,
        productImage: product.productImages && product.productImages.length !== 0 ? product.productImages[0].imgPath : '',
        productPrice: productPrice,
        productVariant: product.productVariant,
        customizeAddons: product.addon.customizeAddons,
        selectedQty: 0,
        selectedAddons: [],
        availableFrom: product.availableFrom,
        availableTo: product.availableTo,
        status:product.status,
        productOid:product.productOid
      };
      products.push(productData);
    });
    console.log(products)
    return products;
  }

  formatData(rawData) {
    rawData.forEach(category => {
      const products = this.getProductData(category);
      let subCategoriesData = [];
      category.subCategories.forEach(subCategory => {
        const subProducts = this.getProductData(subCategory);
        let subCategoryData = {
          categoryName: subCategory.categoryName,
          products: subProducts
        };
        subCategoriesData.push(subCategoryData);
      });
      let categoryData = {
        categoryName: category.categoryName,
        products: products,
        subCategories: subCategoriesData,
      };
      this.formattedData.push(categoryData);
      console.log(JSON.stringify(this.formattedData))
    });
  }

  ProductList=[]
  getAllProductsList(index){
    this.ProductList=[]
    this.ProductList = this.formattedData[index]['products'];
    console.log(this.ProductList)
  }

  toggleStatus(data,index1,index2,productOid){
    console.log(data);
    console.log(status)
    if(data.checked==true){
      this.categoryList[index1]['products'][index2].menuStatus='ONLINE';
    }else{
      this.categoryList[index1]['products'][index2].menuStatus='OFFLINE';
    }
    
    // console.log(row.staffOid);
    let URL = environment.APIEndpoint + "api/rpa/product/v1/update/menuStatus";
    let requestBody = {
      status:this.categoryList[index1]['products'][index2].menuStatus,
      productOid:productOid,
      storeOid:this.storeId
    }
    this.http.postJson(URL, requestBody)
      .subscribe(
        response => {
        
          this.snackBar.openFromComponent(SnackBarComponent, {
            duration: 1500,
            data: {
              status: "success",
              message: "Status Updated successfully "
            }
          });
        },
        err => {
       
        }
      );
     }
}
