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
  selector: 'productPopup',
  templateUrl: './productPopup.component.html',
  styleUrls: ['./productPopup.component.scss']
})
export class ProductPopupComponent implements OnInit {

  modifyOrderFormGroup: FormGroup;
  public categoryList: any = [];
  public exclusiveProducts: any = [];
  panelOpenState = false;
  isEdit: boolean = true;
  showCustomizationList:boolean = false;
  customizableProduct: any;
  contentLoader:boolean = true;
  orderType;

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
  list;
  brandOid;
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
    // this.buildModifyOrderForm();
    this.getAllProducts();
    //  this.getAllProducts();
  }

  buildModifyOrderForm() {
    let form = {
      // storeId: [this.storeOid, Validators.required],
    }
    this.modifyOrderFormGroup = this.fb.group(form);
  }

  getAllProducts() {
    this.contentLoader= true;
 
  //  let request  =  {	"orderType":this.orderType,
  //         "brandOid" : this.brandOid}
    // this.https.postJson(environment.APIEndpoint + "api/ads/product/v2/getCategoryProductsByCategoryId", request).subscribe(res => {
      this.https.getJson(environment.APIEndpoint + "api/rpa/product/v1/brandProducts?brandId=" + this.brandOid).subscribe(res => {
 
    this.contentLoader= false;
    
      console.log(res)
       this.formatData(res);
   

    },(error) => {
      this.contentLoader= false;
    });
  }
 

  isProduct=true;

  getProductData(rawData) {
    let products = [];
    rawData.forEach(product => {
      let productPrice ;
      // let productSku ;
      let varientName;
      let ImagePath='';
      let    varientName1
      let productOid = product.productOid
      for(let i=0; i<= product.productVariants.length -1; i++){
        let variantOid = product.productVariants[i].variantOid;
        productPrice = product.productVariants[i].displayPrice;
        // productSku = product.productVariants[i].skuCode;
        varientName = product.productName+' ( '+ product.productVariants[i].variantName+' )';
        varientName1=' ( '+ product.productVariants[i].variantType+' )';
        ImagePath = product.productVariants[i].productVariantImage;
       let variantTypeOid = product.productVariants[i].variantTypeOid;
       let skuCode = product.productVariants[i].skuCode;
 
        // let uniqueID = product.productVariants[i].variantOid;
        let tax =product.productVariants[i].tax;

        if(tax == null){
          tax = 0;
        }
   

        let productData = {

          productName: varientName,
          productName1:product.productName,
           productType: product.productType,
          imagePath: ImagePath,
          displayPrice: productPrice,
          productOid:productOid,
          variantTypeOid: variantTypeOid,
          skuCode:skuCode,
         
          variantOid:variantOid,
      
          varientName:varientName1,
          tax:tax,
          availableFrom:product.availableFrom,
          availableTo:product.availableTo
        };
        products.push(productData);
      
      }
    });
    return products;

  }
  ProductListData=[]
  products=[];
  formatData(rawData) {
   
     this.formattedData=[];
     this.products = this.getProductData(rawData);
     for(let i=0;i<= this.products.length-1;i++){
        
      if(this.ProductListData.includes(this.products[i]['skuCode'])){
        this.products[i].checked=true;
      }else{
        this.products[i].checked=false;
      }
      
    }

  }


  onCloseClick(): void {
    this.dialogRef.close();
  }
  public selectedData: any = [];

  toggleVisibility(e,products) {    
    if(e.checked == true){
      // this.ShowError = false;
      this.ProductListData.push(products['skuCode']);
      this.selectedData.push(products)

    }else{
      if(this.ProductListData.includes(products['skuCode'])){
        let index=this.ProductListData.indexOf(products['skuCode']);
        this.ProductListData.splice(index,1);
        this.selectedData.splice(index,1);
      }
    }
  }
  ShowError=false;
  TempData;
  TempCategoryList=[];
  createList() {
    if(this.selectedData.length>0){
      this.ShowError=false;
      this.TempData = this.selectedData;
      // let TempCategoryList=[];
 
      let data = {
        Value : this.TempData,
      }
      this.dialogRef.close(data);
    }else{
      this.ShowError=true;
    }
  }
}
