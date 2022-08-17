import { Component, OnInit, Inject, Input } from '@angular/core';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { HttpService } from 'src/app/services/http-service';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { MatPaginator, MatSort, MatTableDataSource, MatTabsModule, MatSnackBar } from '@angular/material';
import { MatDialogModule } from '@angular/material/dialog';
import { SelectionModel } from '@angular/cdk/collections';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { UploadFile } from "src/app/services/uploadFile.service";
import { StoreDialogComponent } from "../store-dialog/store-dialog.component";

@Component({
  selector: 'addOns-dialog',
  templateUrl: './crossSell-addOns-dialog.component.html',
  styleUrls: ['./crossSell-addOns-dialog.component.scss']
})

export class CrossSellAddOnsComponent implements OnInit {
  public filePathUrl = localStorage.getItem("imgBaseUrl");
  public addonsData = [];
  public addOnType: any;
  list: any;
  public selected;
  public selectedData: any = [];
  public  categoryOid;
  
  @Input('brandId') brandId: number;
  parentList;
  formattedData=[];
  contentLoader=false;
  constructor(private dialogRef: MatDialogRef<MatDialog>,
    private fb: FormBuilder,
    private http: HttpService,
    private uploadFile: UploadFile,
    public snackBar: MatSnackBar,
    private router: Router,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    dialogRef.disableClose = true;
    
  }

  ngOnInit() {
    this.addOnType = this.data.addonType;
    
    this.getCategory();
    
  }
  getCategory() {
    this.parentList = [];

    let GET_SORT = environment.APIEndpoint + "api/rpa/productcategory/v1/get/brandCategories?brandId=" +this.brandId  ;
    this.http.getJson(GET_SORT)
      .subscribe((response) => {
        this.parentList = response;
        if(this.ProductListData.length>0){
       
          this.getAllProducts(this.categoryId);
           for(let i=0; i<=this.list.length-1;i++){
             this.selectedData.push(this.list[i])
           }
        }else{
          this.categoryId=''
        }
      });
  }
  toggleVisibility(e,productOid) {    
    if(e.checked == true){
      this.ShowError = false;
      this.ProductListData.push(productOid['uniqueID']);
      this.selectedData.push(productOid)

    }else{
      if(this.ProductListData.includes(productOid['uniqueID'])){
        let index=this.ProductListData.indexOf(productOid['uniqueID']);
        this.ProductListData.splice(index,1);
        this.selectedData.splice(index,1);
      }
    }
  }
  TempData;
  createList() {
    if(this.selectedData.length>0){
      this.ShowError=false;
      this.TempData = this.selectedData 
      let data = {
        Value : this.TempData,
      }
      this.dialogRef.close(data);
    }else{
      this.ShowError=true;
    }
 
  }
  onCloseClick(): void {
   
    if(this.selectedData.length>0){
      this.ShowError=false;
      this.TempData = this.list 
      let data = {
        Value : this.TempData,
      }
      this.dialogRef.close(data);
    }else{
      this.dialogRef.close();
    }
  }


  
 

 
  ShowError=false;


  categoryId='';
  getAllProducts(value) {

    this.contentLoader=true
    let data = {
      "categoryId": value
    }
    this.http.postJson(environment.APIEndpoint + "api/rpa/product/v1/getCategoryProductsByCategoryId", data).subscribe(res => {
      this.contentLoader = false;
      this.categoryId = value;
      this.formatData(res);
    },(error) => {
      this.contentLoader = false;
    })
  }
 
  
  products=[];
  getProductData(rawData) {
    let products = [];
    rawData.products.forEach(product => {
      let productPrice ;
      let productSku ;
      let varientName;
      let ImagePath='';
      let    varientName1
      let productOid = product.productOid
      for(let i=0; i<= product.productVariant.productVariants.length -1; i++){
        let variantOid = product.productVariant.productVariants[i].variantOid;
        productPrice = product.productVariant.productVariants[i].displayPrice;
        productSku = product.productVariant.productVariants[i].skuCode;
        varientName = product.productName+' ( '+ product.productVariant.productVariants[i].variantName+' )';
        varientName1=' ( '+ product.productVariant.productVariants[i].variantName+' )';
        ImagePath = product.productVariant.productVariants[i].productVariantImage;
       let variantTypeOid = product.productVariant.productVariants[i].variantTypeOid;
       let skuCode = product.productVariant.productVariants[i].skuCode;
       let cgstRate = product.productVariant.productVariants[i].cgstRate;
       let sgstRate = product.productVariant.productVariants[i].sgstRate
        let uniqueID = product.productVariant.productVariants[i].variantOid;

       if(cgstRate == null){
         cgstRate = 0
       }
       if(sgstRate == null){
        sgstRate = 0
      }

        let productData = {
          // productSku: productSku,

          productName: varientName,
          productName1:product.productName,
          // productType: product.productType,
          imagePath: ImagePath,
          // productPrice: productPrice,
          productOid:productOid,
          variantTypeOid: variantTypeOid,
          skuCode:skuCode,
          cgstRate:cgstRate,
          sgstRate:sgstRate,
          price:productPrice,
          addonType: 'CROSS_SELL',
          variantOid:variantOid,
          uniqueID:uniqueID,
          categoryId:this.categoryId,
          varientName:varientName1
        };
        products.push(productData);
      
      }
    });
    return products;
  }
  ProductListData=[]
  formatData(rawData) {
    let categoryData = {}
     this.formattedData=[];
    const products = this.getProductData(rawData[0]);
     categoryData = {
      // categoryName: this.categoryName,
      products: products,
    };
    this.formattedData.push(categoryData);
    this.products=this.formattedData[0]['products'];
    
     
      for(let i=0;i<= this.products.length-1;i++){
        
        if(this.ProductListData.includes(this.products[i]['uniqueID'])){
          this.products[i].checked=true;
        }else{
          this.products[i].checked=false;
        }
        
      }
  }
}

