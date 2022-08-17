import { Component, OnInit, ViewChild, Inject, Input } from '@angular/core';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { HttpService } from 'src/app/services/http-service';
import { environment } from 'src/environments/environment';
import { FormBuilder, Validators, FormControl, FormGroup } from '@angular/forms';
import { SnackBarComponent } from 'src/app/shared/components/snack-bar/snack-bar.component';
import { Router } from '@angular/router';
import * as moment from 'moment';

@Component({
  selector: 'modify-order-dialog',
  templateUrl: './modify-order-dialog.component.html',
  styleUrls: ['./modify-order-dialog.component.scss']
})
export class ModifyOrderDialogComponent implements OnInit {

  modifyOrderFormGroup: FormGroup;
  public categoryList: any = [];
  public exclusiveProducts: any = [];
  panelOpenState = false;
  isEdit: boolean = true;
  showCustomizationList:boolean = false;
  customizableProduct: any;
  contentLoader:boolean = false;
  error:boolean = false;
  errorMsg = '';


  @ViewChild("modifyOrderForm") modifyOrderForm;

  @Input('currency') currency;
  showoptions: boolean = false;
  orderId: any;
  storeOid: any;
  formattedData = [];
  tempSelectedItems = [];
  totalItemsSelected = 0;
  totalPrice = 0;


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
    const GET_ALL_PRODUCTS = environment.APIEndpoint + 'api/rpa/order/v3/getProduct';
    this.https.getJson(GET_ALL_PRODUCTS + '?storeOid=' + this.storeOid).subscribe((response) => {
      this.contentLoader= false;
      this.categoryList = response['categories'];
      this.exclusiveProducts = response['exclusiveProducts'];
      this.formatData(response['categories']);
    },(error) => {
      this.contentLoader= false;
    })
  }

  getProductData(category) {
    let products = [];
    category.products.forEach(product => {
      let productPrice = null;
      let productSku = product.productOid;
      if (product.productVariant.productVariants.length === 1) {
        productPrice = product.productVariant.productVariants[0].displayPrice;
        productSku = product.productVariant.productVariants[0].skuCode;
      }
      let image;
      if (product.productImages) {
        [image] = product.productImages.filter(img => img.isDefault);
      }

      product.productVariant.selectedVariantQty = 0;
      product.productVariant.selectedVariant = '';
      product.productVariant.selectedVariantName = '';
      const productData = {
        productSku: productSku,
        productName: product.productName,
        productType: product.productType,
        productImage: image !== undefined ? image.imgPath : '',
        productPrice: productPrice,
        productVariant: product.productVariant,
        productAvailable: moment().isBetween(
          moment(product.availableFrom, 'hh:mm'), moment(product.availableTo, 'hh:mm')
        ),
        customizeAddons: product.addon.customizeAddons,
        selectedQty: 0,
        selectedAddons: []
      };
      products.push(productData);
    });
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
    });
  }

  isCustomizable(product) {
    return product.productVariant.productVariants.length > 1 ||
    (product.customizeAddons != null && product.customizeAddons.length > 0);
  }

  addtoCart() {
    const unique = [];
    this.tempSelectedItems.reverse().map(x => unique.filter(a => a.productSku == x.productSku).length > 0 ? null : unique.push(x));
    this.dialogRef.close(unique);
  }

  onCloseClick(): void {
    this.dialogRef.close();
  }

  reset(product) {
    product.selectedAddons = [];
    product.productVariant.selectedVariantQty = 0;
    product.productVariant.selectedVariant = '';
    product.productVariant.selectedVariantName = '';
  }

  addItem(product) {
    this.showCustomizationList = false;
    this.reset(product);
    product.selectedQty = 1;
    if(this.isCustomizable(product)) {
      product.selectedQty = 0;
      this.showCustomization(product);
    } else {
      this.totalItemsSelected += 1;
      this.totalPrice += product.productPrice;
      const obj = {product, productSku: product.productSku, quantity: product.selectedQty, transactionItemAddons: []};
      this.tempSelectedItems.push(obj);
    }
  }

  itemIncrement(product) {
    this.showCustomizationList = false;
    if (this.isCustomizable(product)) {
      this.showCustomization(product);
      this.showCustomizationList = true;
    } else {
      product.selectedQty += 1;
      this.totalItemsSelected += 1;
      this.totalPrice += product.productPrice;
    }
    const obj = {product, productSku: product.productSku, quantity: product.selectedQty, transactionItemAddons: []};
    this.tempSelectedItems.push(obj);
  }

  itemDecrement(product) {
    let extraDetails = [];
    this.showCustomizationList = false;
    if (product.selectedQty > 0) {
      product.selectedQty -= 1;
    }
    if (product.selectedQty === 0 && this.isCustomizable(product)) {
      this.showCustomizationList = false;
    }
    if (this.isCustomizable(product)) {
      extraDetails.push({
        variantDetails : {
          selectedVariantQty: product.productVariant.selectedVariantQty,
          selectedVariant: product.productVariant.selectedVariant,
          selectedVariantName: product.productVariant.selectedVariantName
        },
        addOns: product.selectedAddons
      });
      product.productVariant.selectedVariantQty -= 1;
    }
    this.totalItemsSelected -= 1;
    this.totalPrice -= product.productPrice;
    const obj = {product, productSku: product.productSku, quantity: product.selectedQty, transactionItemAddons: extraDetails};
    this.tempSelectedItems.push(obj);
  }

  addVariantDetails(product) {
    const selectedVariantskuCode = product.productVariant.selectedVariant;
    if(product.customizeAddons) {
      product.customizeAddons.forEach(addOn => {
        let [selection] = addOn.variantSelection.filter(variantSelection => variantSelection.skuCode == selectedVariantskuCode);
        if (selection) {
          const upperLimit = 100000;
          const totalAddOnQty = addOn.totalAddOnQty ? addOn.totalAddOnQty : 0;
          const totalAddOnSelection = addOn.totalAddOnSelection ? addOn.totalAddOnSelection : 0;
          selection.maxQuantity  = selection.maxQuantity != 0 ? selection.maxQuantity : upperLimit;
          selection.maxSelection  = selection.maxSelection != 0 ? selection.maxSelection : upperLimit;
          if (addOn.isMandatory) {
            if (selection.maxQuantity == upperLimit || selection.maxSelection == upperLimit) {
              if (selection.maxQuantity != upperLimit ) {
                if (!(totalAddOnQty == selection.maxQuantity && totalAddOnSelection <= selection.maxSelection)) {
                  this.errorMsg = `Please select ${selection.maxQuantity} ${addOn.labelName}`;
                  this.error = true;
                  return;
                }
              }
              else if (!(totalAddOnQty <= selection.maxQuantity && totalAddOnSelection <= selection.maxSelection)) {
                this.errorMsg = `You can select upto ${selection.maxSelection} ${addOn.labelName} selections`;
                this.error = true;
                return;
              }
            }
            else if (!(totalAddOnQty == selection.maxQuantity && totalAddOnSelection <= selection.maxSelection)) {
              this.errorMsg = `Please select ${selection.maxQuantity} ${addOn.labelName}`;
              this.error = true;
              return;
            }
            if (totalAddOnQty == 0) {
              this.errorMsg = `Please select at least 1 ${addOn.labelName}`;
              this.error = true;
              return;
            }
          } else {
            if (!(totalAddOnQty <= selection.maxQuantity && totalAddOnSelection <= selection.maxSelection)) {
              this.errorMsg = `You can select upto ${selection.maxQuantity} ${addOn.labelName}`;
              if (totalAddOnQty <= selection.maxQuantity && totalAddOnSelection > selection.maxSelection) {
                this.errorMsg = `You can select upto ${selection.maxSelection} ${addOn.labelName} selections`;
              }
              this.error = true;
              return;
            }
          }
        }
        if (this.error === true) {
          return;
        }
      });
    }
    if (this.error === true) {
      return;
    }
    this.totalItemsSelected -= product.selectedQty ;
    this.totalPrice -= product.productPrice * product.selectedQty;
    let extraDetails = [];
    extraDetails.push({
      variantDetails : {
        selectedVariantQty: product.productVariant.selectedVariantQty,
        selectedVariant: product.productVariant.selectedVariant,
        selectedVariantName: product.productVariant.selectedVariantName
      },
      addOns: product.selectedAddons
    });
    product.productSku = product.productVariant.selectedVariant;
    product.productPrice = product.productVariant.selectedVariantPrice;
    product.selectedQty = product.productVariant.selectedVariantQty;
    const obj = {product, productSku: product.productSku, quantity: product.selectedQty, transactionItemAddons: extraDetails};
    this.tempSelectedItems.push(obj);
    this.showCustomizationList = false;
    this.totalItemsSelected += product.productVariant.selectedVariantQty;
    this.totalPrice += product.productPrice * product.productVariant.selectedVariantQty;
  }

  addVariant(customizableProduct,variant) {
    customizableProduct.productVariant.selectedVariantQty = 1;
    customizableProduct.productVariant.selectedVariant = variant.skuCode;
    customizableProduct.productVariant.selectedVariantName = variant.variantName;
    customizableProduct.productVariant.selectedVariantPrice = variant.displayPrice;
    if(customizableProduct.customizeAddons) {
      customizableProduct.customizeAddons.forEach(addOn => {
        const [selection] = addOn.variantSelection.filter(variantSelection => variantSelection.skuCode == variant.skuCode);
        if (selection) {
          addOn.maxQuantity = selection.maxQuantity;
          addOn.maxSelection = selection.maxSelection;
        }
      });
    }
  }

  variantIncrement(customizableProduct,variant) {
    customizableProduct.productVariant.selectedVariantQty += 1;
    customizableProduct.productVariant.selectedVariant = variant.skuCode;
    customizableProduct.productVariant.selectedVariantName = variant.variantName;
    customizableProduct.productVariant.selectedVariantPrice = variant.displayPrice;
  }

  variantDecrement(customizableProduct,variant) {
    customizableProduct.productVariant.selectedVariantQty -= 1;
    customizableProduct.productVariant.selectedVariant = variant.skuCode;
    customizableProduct.productVariant.selectedVariantName = variant.variantName;
    customizableProduct.productVariant.selectedVariantPrice = variant.displayPrice;
  }

  addOnSelected(event,customizableProduct,addOn,customizeAddon) {
    this.error = false;
    addOn.isFreeProduct = customizeAddon.isFreeProduct;
    if(event.checked || event.selected ) {
      customizeAddon.totalAddOnQty = customizeAddon.totalAddOnQty ? customizeAddon.totalAddOnQty + 1 : 1;
      customizeAddon.totalAddOnSelection = customizeAddon.totalAddOnSelection ? customizeAddon.totalAddOnSelection + 1 : 1;
      addOn.selectedAddOnQty = 1;
      customizableProduct.selectedAddons.push(addOn);
    } else {
      customizeAddon.totalAddOnQty -= addOn.selectedAddOnQty;
      customizeAddon.totalAddOnSelection -= 1;
      addOn.selectedAddOnQty = 0;
      customizableProduct.selectedAddons = customizableProduct.selectedAddons.filter(item => item !== addOn);
    }
  }

  addOnIncrement(customizableProduct,addOn,customizeAddon) {
    this.error = false;
    if (addOn.selectedAddOnQty) {
      addOn.selectedAddOnQty += 1;
      customizeAddon.totalAddOnQty += 1;
    } else {
      const event = {checked: true};
      this.addOnSelected(event,customizableProduct,addOn,customizeAddon);
    }
  }

  addOnDecrement(customizableProduct,addOn,customizeAddon) {
    this.error = false;
    if (addOn.selectedAddOnQty && addOn.selectedAddOnQty > 0) {
      if (addOn.selectedAddOnQty === 1) {
        const event = {checked: false, selected: false};
        this.addOnSelected(event,customizableProduct,addOn,customizeAddon);
        return;
      }
      addOn.selectedAddOnQty -= 1;
      customizeAddon.totalAddOnQty -= 1;
    }
  }

  isSelectedAddOn(customizableProduct,addOn) {
    return customizableProduct.selectedAddons.some(selAddOn => selAddOn.addonOid === addOn.addonOid);
  }

  showCustomization(product){
    this.error = false;
    this.showCustomizationList = true;
    this.customizableProduct = product;
  }
}
