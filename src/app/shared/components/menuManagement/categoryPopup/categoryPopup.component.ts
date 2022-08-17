import { Component, OnInit, ViewChild, Inject, Input } from '@angular/core';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { HttpService } from 'src/app/services/http-service';
import { environment } from 'src/environments/environment';
import { FormBuilder, Validators, FormControl, FormGroup } from '@angular/forms';
import { SnackBarComponent } from 'src/app/shared/components/snack-bar/snack-bar.component';
import { Router } from '@angular/router';
import { DxSelectBoxModule, DxListModule, DxTemplateModule } from 'devextreme-angular';
import DataSource from 'devextreme/data/data_source';

@Component({
  selector: 'categoryPopup',
  templateUrl: './categoryPopup.component.html',
  styleUrls: ['./categoryPopup.component.scss']
})
export class CategoryPopupComponent implements OnInit {

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
  orderType: any;
  brandOid;

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
        // this.buildModifyOrderForm();
    this.getCategory();
    //  this.getAllProducts();
  }

  buildModifyOrderForm() {
    let form = {
      // storeId: [this.storeOid, Validators.required],
    }
    this.modifyOrderFormGroup = this.fb.group(form);
  }

  // getAllProducts(categoryId) {
  //   this.contentLoader= true;
  //   this.categoryId=categoryId;
  //  let request  =  {"categoryId": categoryId}

  //   this.https.postJson(environment.APIEndpoint + "api/ads/product/v1/getCategoryProductsByCategoryId", request).subscribe(res => {
  //     this.contentLoader= false;
  //     this.categoryName=res[0]['categoryName'];
  //     console.log(res)
  //      this.formatData(res);
  //   },(error) => {
  //     this.contentLoader= false;
  //   });
  // }
 

  isProduct=true;

  // getProductData(rawData) {
  //   let products = [];
  //   rawData.products.forEach(product => {
  //     let productPrice ;
  //     let productSku ;
  //     let varientName;
  //     let ImagePath='';
  //     let    varientName1
  //     let productOid = product.productOid
  //     for(let i=0; i<= product.productVariant.productVariants.length -1; i++){
  //       let variantOid = product.productVariant.productVariants[i].variantOid;
  //       productPrice = product.productVariant.productVariants[i].displayPrice;
  //       productSku = product.productVariant.productVariants[i].skuCode;
  //       varientName = product.productName+' ( '+ product.productVariant.productVariants[i].variantName+' )';
  //       varientName1=' ( '+ product.productVariant.productVariants[i].variantName+' )';
  //       if( product.productVariant.productVariants[i].productVariantImage != undefined &&  product.productVariant.productVariants[i].productVariantImage != '')
  //       {
  //         ImagePath=  this.filePathUrl+ product.productVariant.productVariants[i].productVariantImage;
  //       }
  //       // ImagePath = product.productVariant.productVariants[i].productVariantImage;
  //      let variantTypeOid = product.productVariant.productVariants[i].variantTypeOid;
  //      let skuCode = product.productVariant.productVariants[i].skuCode;
  //      let cgstRate = product.productVariant.productVariants[i].cgstRate;
  //      let sgstRate = product.productVariant.productVariants[i].sgstRate
  //       let tax = product.productVariant.productVariants[i].tax;

  //      if(cgstRate == null){
  //        cgstRate = 0
  //      }
  //      if(sgstRate == null){
  //       sgstRate = 0
  //     }
  //     if(tax == null){
  //       tax = 0;
  //     }

  //       let productData = {
  //         maxQuantityPerProduct:'',
  //         noOfProductSelectionFromList:'',

  //         productName: varientName,
  //         productName1:product.productName,
  //          productType: product.productType,
  //         imagePath: ImagePath,
           
  //         productOid:productOid,
  //         variantTypeOid: variantTypeOid,
  //         skuCode:skuCode,
         
  //         displayPrice:productPrice,
        
  //         variantOid:variantOid,
        
  //         categoryId:this.categoryId,
  //         categoryName: this.categoryName,
  //         varientName:varientName1,
  //         tax:tax
  //       };
  //       products.push(productData);
      
  //     }
  //   });
  //   return products;

  // }
  ProductListData=[]
  products=[];
  // formatData(rawData) {
  //   let categoryData = {}
  //    this.formattedData=[];
  //   const products = this.getProductData(rawData[0]);
  //    categoryData = {
  //     //  categoryName: this.categoryName,
  //     products: products,
  //   };
  //   this.formattedData.push(categoryData);
  //   this.products=this.formattedData[0]['products'];
  //   console.log(this.products)
     
  //     for(let i=0;i<= this.products.length-1;i++){
        
  //       if(this.ProductListData.includes(this.products[i]['skuCode'])){
  //         // this.selectedData.push(this.products[i])
  //         this.products[i].checked=true;
  //       }else{
  //         this.products[i].checked=false;
  //       }
        
  //     }
  // }

  // getCategory(brandId) {
  //   this.StoreBrandID = brandId;
  //   this.parentList = [];
  //   this.addCategoryGroup.get('sortorder').patchValue('');
  //   let GET_SORT = environment.APIEndpoint + "api/ads/productcategory/v1/get/brandCategories?brandId=" +brandId  ;
  //   this.http.getJson(GET_SORT)
  //     .subscribe((response) => {
  //       this.parentList = response;
  //     });
  // }

  onCloseClick(): void {
    this.dialogRef.close();
  }
  public selectedData: any = [];
  categoryIdList=[]
  getCategory(){
    let GET_ALL_CATEGORIES = environment.APIEndpoint + "api/rpa/productcategory/v1/get/brandCategories?brandId=" + this.brandOid;
    this.https.getJson(GET_ALL_CATEGORIES)
        .subscribe((response) => {
          console.log(response);
          this.contentLoader=false;
          this.categoryList=response;
          for(let i=0; i<=this.categoryList.length-1;i++){
            for(let j=0;j<=this.TempCategoryList.length-1;j++){
              if( this.categoryList[i]['categoryId'] == this.TempCategoryList[j]['categoryId']){
                if(!this.categoryIdList.includes(this.categoryList[i]['categoryId'])){
                  this.categoryIdList.push(this.categoryList[i]['categoryId']);
                  this.selectedData.push(this.categoryList[i])
                  this.categoryList[i].checked = true;
                }  
              }
              // let categoryId = this.TempCategoryList[i].categoryId;
              // if(!this.categoryIdList.includes(categoryId)){
              //   this.categoryIdList.push(categoryId);
              //   this.selectedData.push(this.TempCategoryList[i])
              // }
            }
          }
          
        
        })
  }
  toggleVisibility(e,data){
    if(e.checked == true){
      // this.ShowError = false;
      if(!this.categoryIdList.includes(data['categoryId'])){
        this.categoryIdList.push(data['categoryId']);
        this.selectedData.push(data)
      }     
    }else{
      if(this.categoryIdList.includes(data['categoryId'])){
        let index=this.categoryIdList.indexOf(data['categoryId']);
      this.categoryIdList.splice(index,1);
      this.selectedData.splice(index,1);
      }
      
    }
  }



  ShowError=false;
  TempData;
  ShowErrorProduct=false;
  TempCategoryList=[];
  createList(){
    if(this.selectedData.length>0){
    let request  =  {
      // "orderType": this.orderType,
      "categoryIds": this.categoryIdList
    // "brandOid" : this.brandOid
  }

    this.https.postJson(environment.APIEndpoint + "api/rpa/product/v2/getCategoryProductsByCategoryId", request).subscribe(res => {
      console.log(JSON.stringify(res));
      this.ShowErrorProduct = false;
    this.TempCategoryList=[]
      let wholeData = res;
      let Count=0;
      let TempCategoryID=[];

      for(let i=0;i<=wholeData.length-1;i++){
        if(wholeData[i]['products'].length > 0){
          if(!TempCategoryID.includes(wholeData[i]['categoryOid'])){
            TempCategoryID.push(wholeData[i]['categoryOid']);
          }
          Count++;
          for(let j=0;j<=wholeData[i]['products'].length-1;j++){
         

              this.ShowErrorProduct = false;
              let productsVariants = wholeData[i]['products'][j]['productVariant'].productVariants;
              for(let k=0;k<=productsVariants.length-1;k++){
                  console.log(productsVariants[k].skuCode);
                  if(this.ProductListData.includes(productsVariants[k].skuCode)){
  
                  }
                  else{
                    this.ProductListData.push(productsVariants[k].skuCode)
                    let ImagePath = ''
                    if(productsVariants[k].productVariantImage != undefined && productsVariants[k].productVariantImage != null ){
                      ImagePath = this.filePathUrl+productsVariants[k].productVariantImage;
                    }
                    let productData = {
                      maxQuantityPerProduct:'',
                      noOfProductSelectionFromList:'',
            
                      productName: wholeData[i]['products'][j].productName+' ( '+productsVariants[k].variantName+' )',
                       productName1:wholeData[i]['products'][j].productName,
                       productType: wholeData[i]['products'][j].productType,
                      imagePath: ImagePath,
                       
                      productOid:wholeData[i]['products'][j].productOid,
                      // variantTypeOid: productsVariants[k].skuCode,
                      skuCode:productsVariants[k].skuCode,
                     
                      displayPrice:productsVariants[k].displayPrice,
                    
                      // variantOid:productsVariants[k].skuCode,
                      varientName:'( '+productsVariants[k].variantName+' )',
                      categoryId: wholeData[i]['categoryOid'],
                      categoryName: wholeData[i]['categoryName'],
                      // varientName:productsVariants[k].variantName,
                      tax: productsVariants[k].taxRate == null ? 0: productsVariants[k].taxRate,
                      availableFrom:wholeData[i].availableFrom,
                      availableTo:wholeData[i].availableTo
                    };
                    this.products.push(productData);
                  }
              }
            }
          

          }
          
        
      }
      // this.TempData = this.selectedData;
 
     if(Count != 0){
      for(let i=0;i<=this.selectedData.length-1;i++){
        if(TempCategoryID.includes(this.selectedData[i]['categoryId'])){
          let obj ={
            categoryName:this.selectedData[i]['categoryName'],
            categoryId:this.selectedData[i]['categoryId']
          }
          this.TempCategoryList.push(obj);
        }
       
      
    } 
      let data = {
        Value :  this.products,
        categoryList:this.TempCategoryList
      }
      console.log(data)
      this.dialogRef.close(data);
     }else{
      this.ShowErrorProduct = true;

      setTimeout(() => {
       
        this.ShowErrorProduct = false;

   
      }, 3000);

     }
   
      //  this.formatData(res);
    },(error) => {
       this.contentLoader= false;
    });
  }else{
    this.ShowError=true;
  }
  }
}
