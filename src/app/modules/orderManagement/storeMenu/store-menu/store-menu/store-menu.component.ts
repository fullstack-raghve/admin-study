import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { HttpService } from 'src/app/services/http-service';
import { SnackBarComponent } from 'src/app/shared/components/snack-bar/snack-bar.component';
import { MatDialogConfig, MatDialog, MatSnackBar } from '@angular/material';
import { FormControl, Validators, FormBuilder, FormGroup, FormArray, NgForm } from '@angular/forms';
import * as moment from 'moment';

@Component({
  selector: 'app-store-menu',
  templateUrl: './store-menu.component.html',
  styleUrls: ['./store-menu.component.scss']
})
export class StoreMenuComponent implements OnInit {
  public breadCrumbData: Array<Object> = [{
    title: 'Home',
    link: ''
  }, {
    title: 'Order Management',
    link: ''
  }
  ];
  totalCount: any;toggleVal=true;
  constructor(private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private http: HttpService,
    public snackBar: MatSnackBar,
    private router: Router,public dialog: MatDialog ) {

  }
  storeId=15310;
  categoryList=[];
  formattedData=[];
  disabled=true;
  storeList=[];
  loading=true;
  public brandList = [];

  ngOnInit() {
    this.getAllBrands()
  }
  storeOid;
  getStoreID(value){
    this.categoryList=[];
this.storeId=value;
  }
 

  brandChange(){
    this.categoryList=[];
  }

  getAllBrands() {
 
    let GET_ALL_ONLINE_BRANDS = environment.APIEndpoint + "api/rpa/master/brand/v1/get/brands";
    this.http.getJson(GET_ALL_ONLINE_BRANDS)
      .subscribe((res) => {
        this.brandList = res;
        this.loading = false;
        
      })
    
  }

  getStoresList(brandId){
    this.loading = true;
    let data = {
      "page": "0",
      "pageSize": "10000",
      "order": {
        "column": "",
        "dir": ""
      },
      "keySearch": "",
      "fieldSearch": [
        {
          "fieldName": "brandOids",
          "fieldValue": brandId
        }
      ]
    }
    this.http.postJson(environment.APIEndpoint + 'api/rpa/store/v1/search', data).subscribe(res => {
      this.loading = false;
      this.storeList = res["items"];
     
    }, err => {
      this.loading = false;
     
    })
  }
  getAllProducts() {
     this.loading= true;
    const GET_ALL_PRODUCTS = environment.APIEndpoint + 'api/rpa/product/v2/getAllCategoriesAllProducts';
    this.http.getJson(GET_ALL_PRODUCTS + '?storeOid=' + this.storeId).subscribe((response) => {
       this.loading= false;
 
      for(let i=0;i<=response['categories'].length-1;i++){
        if(response['categories'][i]['status'] == 'ONLINE'){
          let obj = {
            categoryName:response['categories'][i]['categoryName'],
            status: response['categories'][i]['status'],
          
            availableFrom: moment(response['categories'][i]['availableFrom'],'HH:mm').format('hh:mm A') ,
            availableTo:moment(response['categories'][i]['availableTo'],'HH:mm').format('hh:mm A'),
            products:this.getProductData(response['categories'][i])
          }
          this.categoryList.push(obj);
       
        }
      }
   
    },(error) => {
      // this.contentLoader= false;
    })
  }

  public sortColumn = "modifiedTime";
  public sortDirection = "desc";
  getStoreList(){
    let data = {
      "page":  "0",
      "pageSize": this.totalCount,
      "order": {
        "column": "oid",
        "dir": "asc"
      },
      "keySearch":  "",
      "fieldSearch": [
        {
          "fieldName": "country.oid",
          "fieldValue": "",
        },
        {
          "fieldName": "cityOids",
          "fieldValue":  "",
        },
        {
          "fieldName": "mallOids",
          "fieldValue":  "",
        },
        {
          "fieldName": "brandOids",
          "fieldValue":  "",
        }
      ]
    }

    this.http.postJson(environment.APIEndpoint + 'api/rpa/store/v2/getAll', data).subscribe(res => {
      
      
      this.storeList = res['items'];
      this.loading=false;
    });

  }

  getProductData(category) {
    let products = [];
    category.products.forEach(product => {
       
    
      if(product.status == 'ONLINE'){
    
      let productData = {
        productName: product.productName,
        productType: product.productType,
        productImage: product.productImages && product.productImages.length !== 0 ? product.productImages[0].imgPath : '',
        productVariant: product.productVariant,
    
        availableFrom: moment(product.availableFrom,'HH:mm').format('hh:mm A'),
        availableTo:  moment(product.availableTo,'HH:mm').format('hh:mm A'),
        productOid
        :product.productOid,
        menuStatus:product.menuStatus
      };
      products.push(productData);
    }
    });
  
    return products;
  }


  toggleStatus(data,index1,index2,productOid){
   
    if(data.checked==true){
      this.categoryList[index1]['products'][index2].menuStatus='ONLINE';
    }else{
      this.categoryList[index1]['products'][index2].menuStatus='OFFLINE';
    }
    
    let URL = environment.APIEndpoint + "api/rpa/product/v1/update/storeMenuOnlineOffline";
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
