import { OnInit, ViewChild, Output, Input, Component, EventEmitter,ViewEncapsulation, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder, FormGroupDirective, FormArray, NgForm } from '@angular/forms';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Sort } from '@angular/material/sort';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { Router } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig } from '@angular/material';
import { environment } from 'src/environments/environment';
import { HttpService } from 'src/app/services/http-service';
import { SelectionModel } from '@angular/cdk/collections';
import { SelectAutocompleteComponent } from 'mat-select-autocomplete';


// export interface Product {
//   sku: number;
//   product: string;
//   variant: string;

// }

// const productList: any[] = [
//   {sku: 111, product: 'Coffee', variant: 'Small'},
//   {sku: 222, product: 'Tea', variant: 'Medium'},
//   {sku: 333, product: 'Sandwich', variant: 'Small'},
//   {sku: 444, product: 'Coffee', variant: 'Large'},
//   {sku: 522, product: 'Tea', variant: 'Medium'},
//   {sku: 633, product: 'Sandwich', variant: 'Large'},
// ];

@Component({
  selector: 'app-select-product-items-dialog',
  templateUrl: './select-product-items-dialog.component.html',
  styleUrls: ['./select-product-items-dialog.component.scss']
})
export class SelectProductItemsDialogComponent implements OnInit {
///https://stackblitz.com/edit/angular-mat-table-checkbox-select-all?file=app%2Ftable-selection-example.ts

  displayedColumns: string[] = ['select','sku', 'product', 'variant'];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
 public dataSource;
 selection = new SelectionModel<any>(true, []);
 searchProductForm:FormGroup;
 public paginationData;
 public status = true;
  totalStore: number;
  @Input('productitem') productitem = [];
  sstatusDetails: any[];
  brandValueList: any[];
  public  brandDropdown = [];

  selectedstatusOptions:any[];
  selectedCountryOptions:any[];

  selectedCategoryOption:any[];

  categoryValueList: any[];
  categoryID: any;
  barndID: any;
  country0ID: any;
  newcategory: any;
  newcountry: any;

  constructor(private fb: FormBuilder,private router: Router,public dialog: MatDialog, 
    private https: HttpService,private http: HttpClient,
    private dialogRef: MatDialogRef<MatDialog>,
    @Inject(MAT_DIALOG_DATA) data
    ) {
      //console.log('data',data)

  }

  ngOnInit() {


    // this.dataSource.paginator = this.paginator;
    // this.totalStore = productList.length;
this.buildProductForm();

console.log('productitem',this.productitem);

//this.makeSelected()

this.getAllProduct();
this.selectedBrands();


  }


  selectedBrands(){
    this.https.getJson(environment.APIEndpoint + "api/rpa/master/brand/v1/get/regionBrands")
     .subscribe(response => {
     console.log('brandss>>>',response);
     if(response){
       this.brandDropdown = response;
     }
   //  this.brandList = response;
     //  this.brandId = this.brandList[0].brandId;
   //    this.getParentList(this.brandId);
     //  this.addProductGroup.get('brandId').patchValue(this.brandId);
     });
 
   }

buildProductForm(){
  this.searchProductForm = this.fb.group({
    // fullName: ["", Validators.compose([Validators.maxLength(50), Validators.minLength(3)])],
    // emailId: ["", Validators.compose([Validators.maxLength(50), Validators.minLength(6), Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")])],
    // phoneNumber: ["", [Validators.maxLength(10), Validators.minLength(10), Validators.pattern("^[0-9]+$")]],
    // storeName: [""],
    // userName: [''],
    // createdUserName: [''],
    // status: [""],
    searchVal: [''],
   // status: [""],
    Country: [''],
   brandDropdowncontrol:[''],
   category: ['']


  }); 


this.getAllCountries();
this.getStatus();
this.getAllBrands();
this.getAllCategory()
}




clickstatus:boolean = false;
openFilter() {
  this.clickstatus = !this.clickstatus;
}

loading:boolean = true;
noRecord:boolean = false;
getAllProduct(){

  let formVal = this.searchProductForm.value;
  console.log('formVal',formVal);
  console.log('selectedCountryOptions',this.selectedCountryOptions);
  console.log('selectedCategoryOption',this.selectedCategoryOption);

  if(formVal.Country && formVal.Country.length>0){
    let country = formVal.Country
    this.newcountry =  country && country.join(","); 
    //console.log('newcountry',newcountry)
  }

  if(formVal.category && formVal.category.length>0){
    let category = formVal.category
    this.newcategory =  category && category.join(","); 
   // console.log('newcategory',newcategory);
  }




  let data = {
    "page": "0",
    "pageSize": "10",
    "order": {
      "column": "",
      "dir": "asc"
    },
    "keySearch": formVal.searchVal ? formVal.searchVal : "",
    "fieldSearch": [
      {
        "fieldName": "STATUS",
        "fieldValue": "ONLINE"
      },
      {
        "fieldName": "categoryIds",
        "fieldValue": this.newcategory ? this.newcategory : ""
      },
      {
        "fieldName": "countryIds",
        "fieldValue":  this.newcountry ? this.newcountry : ""               //// formVal.Country ? 1 : "",
      },
      {
        "fieldName": "BRAND_OID",
        "fieldValue":  +this.barndID ? +this.barndID : ""
      }
  
    ]
  }
  
 /// let url = 'http://14.142.204.96:8080/'
  this.https.postJson(environment.APIEndpoint+'api/rpa/product/v2/searchProduct',data).subscribe(res => {
console.log('getAllProduct>>>',res);
if(res){
  this.loading = false;

  let productItem = res['items'];
  this.dataSource = new MatTableDataSource<any>(productItem);
  this.dataSource.paginator = this.paginator;
   this.dataSource.sort = this.sort;
   this.totalStore = productItem.length;

   if(productItem.length == 0){
    this.noRecord = true;
   }else{
    this.noRecord = false;

   }

   if (this.productitem.length > 0) {
    for (let i of productItem) {
      if (this.productitem.indexOf(i["skuCode"]) > -1) {
        this.selection.select(i);
      }
    }
  } 

}
  });


}
// selectedrewardType:any[];
@ViewChild('countryyInput') countryyInput: SelectAutocompleteComponent;
@ViewChild('countryyInput') categoryInput: SelectAutocompleteComponent;

 selectedBrandOptions:any[];
 resetForm(){
  let formVal = this.searchProductForm.value;
  formVal.Country = '';
  formVal.category = '';
  this.newcountry = '';
  this.newcategory = '';

this.barndID = '';
//  this.selectedBrandOptions = [];
  this.selectedCountryOptions = [];
  this.countryyInput.selectAllChecked = false;
  this.categoryInput.selectAllChecked = false;

  this.selectedCategoryOption = [];
//  this.selectedstatusOptions = [];
  this.searchProductForm.get('brandDropdowncontrol').reset();
  this.searchProductForm.get('Country').reset();
  this.searchProductForm.get('category').reset();

  this.searchProductForm.get('searchVal').reset();

  this.getAllProduct();


 }


public countryList: any = [];

getAllCountries() {
  const GET_ALL_COUNTRIES = 'api/rpa/store/v1/get/storeRegions';
  this.https.getJson(environment.APIEndpoint + GET_ALL_COUNTRIES).subscribe(res => {
    console.log('GET_ALL_COUNTRIES',res);
    res.forEach(res => {
      this.countryList.push({
        'countryId': res.countryId,
        'countryCode': res.countryCode,
        'languageDirection': res.languageDirection,
        'countryName': res.countryName,
        'value': res.countryId,
        'currencyCode': res.currencyCode

      });
    });
    console.log(this.countryList);
  }, err => {
    console.log(err);
  });
}

getAllBrands(){
  this.https.getJson(environment.APIEndpoint + "api/rpa/master/brand/v1/get/regionBrands")
   .subscribe(response => {
 //  console.log('brandss>>>',response);
   if(response){
   //  this.brandDropdown = response;
   this.brandValueList = response;
   var uniqueArray = this.removeDuplicatesJSON(this.brandValueList, 'brandId');
   console.log(uniqueArray);
   this.brandValueList = uniqueArray;
   }

   });

 }


 getAllCategory(){
  this.https.getJson(environment.APIEndpoint + "api/rpa/productcategory/v1/get/list")
   .subscribe(response => {
   console.log('cattegoryy>>>',response);
   if(response){
   this.categoryValueList = response;
  //  var uniqueArray = this.removeDuplicatesJSON(this.categoryValueList, 'brandId');
  //  this.categoryValueList = uniqueArray;
   }

   });

 }

 changecategory(catID){
   console.log('catID',catID);
   this.categoryID = catID;
 }
 changeCountry(val){
  this.country0ID = val;

 }

 changeBrand(barndid){
  console.log('barndid',barndid);
  this.barndID = barndid;
}



 searchVal(){

 }
 getUpdate($event){

 }

 removeDuplicatesJSON(originalArray, prop) {
  var newArray = [];
  var lookupObject = {};
  for (var i in originalArray) {
    lookupObject[originalArray[i][prop]] = originalArray[i];
  }
  for (i in lookupObject) {
    newArray.push(lookupObject[i]);
  }
  return newArray;
}

 

getStatus(){
  let statusData=['ONLINE','OFFLINE','NEW']
  this.sstatusDetails=[];
  for(let i=0;i<statusData.length;i++){
    this.sstatusDetails.push({
      storeDETAIL: statusData[i],
      value:statusData[i],
    });
    console.log();
    
  }
}
// makeSelected(){
//   if (this.productitem.length > 0) {
//     for (let i of productList) {
//       if (this.productitem.indexOf(i["sku"]) > -1) {
//         this.selection.select(i);
//       }
//     }
//     this.originalSelection = this.selection.selected;
//   }
// }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
        this.selection.clear() :
        this.dataSource.data.forEach(row => this.selection.select(row));
  }

  logSelection() {
    this.selection.selected.forEach(s => console.log(s));
  }
  public resultsLength = 0;
  originalSelection:any;
  onCloseClick(): void {
    let obj = {
      'buttonName': 'CANCEL',
      'tableData': this.originalSelection,
      'totalCount': this.resultsLength
    }
    localStorage.removeItem('stores');
    console.log('obj>>',obj);
    // localStorage.setItem('stores', JSON.stringify(this.stores));
    this.dialogRef.close(obj);
  }
  searchKey(){
  // this.getUpdate(this.paginationData);
    this.paginator.pageIndex = this.paginationData.pageIndex;
  }

  indexResetFormdataSearch(){
      
    // let formdata = this.searchProductForm.value;
    // if (formdata.searchVal!= '' && formdata.searchVal!= null){
    //   this.paginationData.pageIndex = 0;
    // }
    // if (formdata.fullName!='' && formdata.fullName!=null){
    //   this.paginationData.pageIndex = 0;
    // }
    // if (formdata.emailId!='' && formdata.emailId!=null){
    //   this.paginationData.pageIndex = 0;
    // }
    // if (formdata.phoneNumber!='' && formdata.phoneNumber!=null){
    //   this.paginationData.pageIndex = 0;
    // }
   
    // if (formdata.storeName!='' && formdata.storeName!=null){
    //   this.paginationData.pageIndex = 0;
    // }
    // if (formdata.status!='' && formdata.status!=null){
    //   this.paginationData.pageIndex = 0;
    // }
  }
 
}
