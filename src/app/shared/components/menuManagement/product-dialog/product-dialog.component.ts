import { Component, OnInit, ViewChild, Inject, Input } from '@angular/core';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { HttpService } from 'src/app/services/http-service';
import { environment } from 'src/environments/environment';
import { FormBuilder, Validators, FormControl, FormGroup } from '@angular/forms';
import { SnackBarComponent } from 'src/app/shared/components/snack-bar/snack-bar.component';
import { Router } from '@angular/router';

@Component({
  selector: 'product-dialog',
  templateUrl: './product-dialog.component.html',
  styleUrls: ['./product-dialog.component.scss']
})
export class ProductDialogComponent implements OnInit {

  modifyOrderFormGroup: FormGroup;
  public categoryList: any = [];
  public exclusiveProducts: any = [];
  panelOpenState = false;
  isEdit: boolean = true;
  showCustomizationList:boolean = false;
  customizableProduct: any;
  contentLoader:boolean = true;


  @ViewChild("modifyOrderForm") modifyOrderForm;

  @Input('currency') currency;
  showoptions: boolean = false;
  orderId: any;
  storeOid: any;
  formattedData = [];
  tempSelectedItems = [];
  totalItemsSelected = 0;
  totalPrice = 0;
  categoryName;
  categoryId;
  public filePathUrl = localStorage.getItem("imgBaseUrl");

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<MatDialog>,
    private https: HttpService,
    public snackBar: MatSnackBar,
    private router: Router,
    private fb: FormBuilder) {
    dialogRef.disableClose = true;
  }

  ngOnInit() {
    this.storeOid = this.data.storeOid;
    this.orderId = this.data.orderId;
    this.buildModifyOrderForm();
    this.getAllProducts();
  }

  buildModifyOrderForm() {
    let form = {
      // storeId: [this.storeOid, Validators.required],
    }
    this.modifyOrderFormGroup = this.fb.group(form);
  }

  getAllProducts() {
    this.contentLoader= true;
   let request  =  {"categoryId": this.categoryId}

    this.https.postJson(environment.APIEndpoint + "api/rpa/product/v1/getCategoryProductsByCategoryId", request).subscribe(res => {
      this.contentLoader= false;
       this.formatData(res);
    },(error) => {
      this.contentLoader= false;
    });
  }
 
  getProductData(rawData) {
    let products = [];

    rawData.products.forEach(product => {
      let productPrice ;
      let productSku ;
      if (product.productVariant.productVariants.length>0) {
        productPrice = product.productVariant.productVariants[0].displayPrice;
        productSku = product.productVariant.productVariants[0].skuCode;
      }
      // product.productVariant.selectedVariantQty = 0;
      // product.productVariant.selectedVariant = '';
      // product.productVariant.selectedVariantName = '';
      // let ProductName;
      // for(let i=0; i<=product.productLocales.length-1;i++){
      //   if(product.productLocales[i]['languageCode']=='EN'){
      //     ProductName = product.productLocales[i].productName;
      //   }
      // }
      let ImagePath='';
      if (product.productImages.length > 0) {
        ImagePath = product.productImages[0].imgPath;
      }
      // let ProductImage =  product.productImages && product.productImages.length !== 0 ? product.productImages[0].imgPath : '';
        
      //  if(ProductImage ! = ''){
      //   ImagePath=  ProductImage;
      //  }else{
      //    ImagePath=''
      //  }
      let productData = {
        productSku: productSku,
        productName: product.productName,
        productType: product.productType,
        productImage: ImagePath,
        productPrice: productPrice,
        // productVariant: product.productVariant,
        // customizeAddons: product.addon.customizeAddons,
        selectedQty: 0,
        selectedAddons: []
      };
      products.push(productData);
    });
    return products;
  }
  isProduct=true;
  getCategoryData(rawData){
    let subCategoriesData=[];
    for(let i=0;i<=rawData['subCategories'].length-1;i++){
      if( rawData['subCategories'][i].products.length>0){
       let categoryName = rawData['subCategories'][i]['categoryName']
      let products=[]
      rawData['subCategories'][i].products.forEach(product => {
        let productPrice ;
      let productSku ;
      if (product.productVariant.productVariants.length>0) {
        productPrice = product.productVariant.productVariants[0].displayPrice;
        productSku = product.productVariant.productVariants[0].skuCode;
      }
  
      let ImagePath='';
      if (product.productImages.length > 0) {
        ImagePath = product.productImages[0].imgPath;
      }
    
      let productData = {
        productSku: productSku,
        productName: product.productName,
        productType: product.productType,
        productImage: ImagePath,
        productPrice: productPrice,
       
        selectedQty: 0,
        selectedAddons: []
      };
      products.push(productData);
    });
   let subCategoryData = {
          categoryName: categoryName,
          products: products
        };
        subCategoriesData.push(subCategoryData)
  }
}
  return subCategoriesData;
  }
  formatData(rawData) {
    const products = this.getProductData(rawData[0]);
    let subCategoriesData = this.getCategoryData(rawData[0]);
    // rawData[0].subCategories.forEach(subCategory => {
    //   const subProducts = this.getProductData(subCategory);
    //   let subCategoryData = {
    //     categoryName: subCategory.categoryName,
    //     products: subProducts
    //   };
    //   subCategoriesData.push(subCategoryData);
    // });
    
    if(products.length == 0 || products.length== undefined ){
      // this.dialogRef.close();
      this.isProduct=false;
    }else{
      this.isProduct=true;
      let categoryData = {
        categoryName: this.categoryName,
        products: products,
         subCategories:subCategoriesData
      };
      this.formattedData.push(categoryData);
    }
  }

  // isCustomizable(product) {
  //   return product.productVariant.productVariants.length > 1 ||
  //   (product.customizeAddons != null && product.customizeAddons.length > 0);
  // }

  // addtoCart() {
  //   const unique = [];
  //   this.tempSelectedItems.reverse().map(x => unique.filter(a => a.productSku == x.productSku).length > 0 ? null : unique.push(x));
  //   this.dialogRef.close(unique);
  // }

  onCloseClick(): void {
    this.dialogRef.close();
  }

}
