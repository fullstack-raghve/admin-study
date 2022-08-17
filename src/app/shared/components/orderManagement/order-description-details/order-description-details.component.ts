import { Component, OnChanges, Input, EventEmitter, Output } from '@angular/core';
import { HttpService } from 'src/app/services/http-service';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { SnackBarComponent } from 'src/app/shared/components/snack-bar/snack-bar.component';
import { MatSnackBar } from '@angular/material';
@Component({
  selector: 'order-description-details',
  templateUrl: './order-description-details.component.html',
  styleUrls: ['./order-description-details.component.scss']
})

export class OrderDescriptionDetailsComponent implements OnChanges {

  @Input() orderDetails;
  @Input() productDetails;
  @Input() newProductSku;
  @Input() changeOrderQtyBtns;
  @Input() feedbackEnqData;
  @Input() showStarRating;
  @Input() paymentModeDetails;
  @Input() billingDetails;
  @Output() updateViewData = new EventEmitter();

  orderDescription: any = [];
  viewData: any = [];
  changeBtns: boolean = true;
  lineItems: any = [];
  ratingCount = 3;
  contentLoader = false;
  public fileImgPathUrl = localStorage.getItem("imgBaseUrl");
  
  constructor(private https: HttpService, private router: Router, public snackBar: MatSnackBar) {}

  ngOnChanges(status) {
    if (status.newProductSku && status.newProductSku.currentValue !== '') {
      this.setProductDetails();
      this.lineItems = [];
      this.productDetails.forEach(product => {
        if (product.quantity > 0) {
          this.lineItems.push(this.getObject(product));
        }
      });
      this.setItems();
    }
    if (status.productDetails && status.productDetails.currentValue.length > 0) {
      this.setProductDetails();
    }
  }

  setProductDetails() {
    this.productDetails.forEach(item => {
      item.quantity = item.quantity ? item.quantity : 0;
      item.customizedAddOnDetails = []
      if (item.shoppingCartItemAddons) {
        item.shoppingCartItemAddons.forEach(addon => {
          item.customizedAddOnDetails.push({
            isFreeProduct: addon.isFreeProduct,
            addonSku: addon.addonSku,
            quantity: addon.quantity
          })
        });
      }
    });
  }

  getObject(product) {
    return {
      productSku: product.productSku,
      quantity: product.quantity,
      productTye: product.productType,
      customizeProductAddons : product.customizedAddOnDetails
    }
  }

  itemIncrement(item) {
    item.quantity += 1;
    this.lineItems = [];
    this.productDetails.forEach(product => {
      if (product.quantity > 0) {
        this.lineItems.push(this.getObject(product));
      }
    });
    this.setItems();
  }

  itemDecrement(item) {
    if (item.quantity > 0) {
      item.quantity -= 1;
    }
    this.lineItems = [];
    this.productDetails.forEach(product => {
      if (product.quantity > 0) {
        this.lineItems.push(this.getObject(product));
      }
    });
    if(this.lineItems.length === 0) {
      item.quantity = 1;
      this.lineItems.push(this.getObject(item));
    }
    this.setItems();
  }

  setItems() {
    const SET_ITEMS = environment.APIEndpoint + 'api/ns/shoppingCart/v1/setItemCartAdmin';
    let request = {
      "storeOid": this.orderDetails.storeOid,
      "lineItems": this.lineItems,
      "cartStatus":"MODIFYING",
      "txnOid": this.orderDetails.orderId
    }
    this.contentLoader= true;
    this.https.postJson(SET_ITEMS, request).subscribe((response: any) => {
      this.updateViewData.emit({
        shoppingCartOid: response.shoppingCartOid,
        shoppingCartItems: response.shoppingCartItems,
      });

      this.orderDetails.noOfItems = response.shoppingCartItems.reduce((total, item) =>
        total + item.quantity
      ,0);
      this.orderDetails.totalTax = response.billDetails.totalTax;
      this.orderDetails.totalPackageCharge = response.billDetails.totalPackageCost;
      // this.orderDetails.totalAmount = response.billDetails.totalPrice;
      this.billingDetails.totalPrice = response.billDetails.totalPrice;
      this.billingDetails = response.billDetails;
      this.contentLoader= false;
    }, (err) => {
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
      }
      this.contentLoader= false;
    });
  }
  goToFeedbackNotification(ID){
    localStorage.setItem('viewFBEnqId', ID);
    this.router.navigate(['/view-feedback-and-enquiry']);
  }
}

