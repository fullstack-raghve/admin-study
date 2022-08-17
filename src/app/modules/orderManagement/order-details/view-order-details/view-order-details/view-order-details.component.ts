import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/services/http-service';
import { environment } from 'src/environments/environment';
import { MatDialog, MatDialogConfig, MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import { SnackBarComponent } from 'src/app/shared/components/snack-bar/snack-bar.component';
import { RejectOrderDialogComponent } from '../../../../../shared/components/orderManagement/reject-order-dialog/reject-order-dialog.component';
import { ModifyOrderDialogComponent } from '../../../../../shared/components/orderManagement/modify-order-dialog/modify-order-dialog.component';
import { CommonFunctions } from 'src/app/services/common-functions';

@Component({
  selector: 'view-order-details',
  templateUrl: './view-order-details.component.html',
  styleUrls: ['./view-order-details.component.scss']
})

export class ViewOrderDetailsComponent implements OnInit {
  public breadCrumbData: Array<Object> = [
    { title: 'Home', link: '' },
    { title: 'Order Management', link: '' }
  ];

  newProductSku = '';
  public ItemDetails: any = [];
  public orderId: any;
  public viewData: any = {};
  public foodPreparingBtn: boolean = false;
  public statusLoader: boolean = false;
  public transactionId: any;
  public newOrderStatus: boolean = false;
  public showRejectedStatusBtn: boolean;
  public completeStatusBtn: boolean = false;
  public orderToPos: boolean = false;
  public showModifyOrderBtns: boolean = false;
  public previousTabIndex: any;
  public showDeliveryIcon: boolean = true;
  public showChangeQtyBtn: boolean = false;
  public showAssigne: any = false;
  public userName: any;
  public showIntiateFundBtn: boolean = false;
  public showCloseTktBtn: boolean = false;
  public API_END_URL: string;
  public hideRefundBtn: boolean;
  public showAddNotesBtn: boolean = false;
  public pageLoader: boolean = false;
  public enquiryData: any[];
  public enquiryID: any;
  public enquirySection: boolean = false;
  public panelOpenState = false;
  public txnRefundAmpount: number;
  public refundSuccess: boolean = false;
  public showLogedUser: any = false;
  public paymentDetails:any = [];
  public billingData: any;
  public cardPay:boolean = false;
  public pointsPay:boolean = false;
  public cardAmount:any;
  public showRedeemedCash: boolean = false;
  public showRedeemedPoints: boolean = false;
  public menuIds: any = JSON.parse(localStorage.getItem("menuIds"));
  public refundBtnPermission: boolean = false;
  public acceptButton:boolean = false;
  public rejectButton:boolean = false;
  public inputInvoice:any = '';
  public showInvoiceErrorMsg:boolean = false;
  public cancelButton: boolean = false;
  boolRefund: boolean = true;

  constructor(
    private https: HttpService,
    public dialog: MatDialog,
    private router: Router,
    private commonFunctions: CommonFunctions,
    public snackBar: MatSnackBar) {
      this.menuIds.forEach(element => {
        if(element == 14002003){
          this.acceptButton = true;
        }
      });
      this.menuIds.forEach(element => {
        if(element == 14002004){
          this.rejectButton = true;
        }
      });
      this.menuIds.forEach(element => {
        if(element == 14002005){
          this.cancelButton = true;
        }
      });
     }

  ngOnInit() {
    if (localStorage.getItem('viewLiveOrderId')) {
      // if (this.menuIds.indexOf('14007') > -1) {
      //   this.refundBtnPermission = true;
      // }
      this.menuIds.forEach(element => {
        if(element == 14007){
        this.refundBtnPermission = true;
        }
      });
      this.showAssigne = localStorage.getItem('showAssigne');
      this.userName = localStorage.getItem('fullName');
      this.previousTabIndex = localStorage.getItem('currentTabIndex');
      this.orderId = localStorage.getItem('viewLiveOrderId');
      this.showLogedUser = localStorage.getItem('assignTo');
      localStorage.removeItem('viewLiveOrderId');
      localStorage.removeItem('showAssigne');
      localStorage.removeItem('assignTo');
      localStorage.removeItem('currentTabIndex');
      this.getOrderDetails();
    } else {
      this.router.navigate(['/live-orders-listing']);
    }
  }

  viewDataFromChild($event) {
    this.viewData.shoppingCartOid = $event.shoppingCartOid;
    this.ItemDetails = $event.shoppingCartItems;
  }

  openProductListDialog(ID) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      orderId: ID,
      storeOid: this.viewData.storeOid
    }
    dialogConfig.width = "unset";
    dialogConfig.height = 'auto';
    dialogConfig.autoFocus = false;
    dialogConfig.panelClass = 'modify-order-item-dialogue';
    const dialogRef = this.dialog.open(ModifyOrderDialogComponent, dialogConfig);
    dialogRef.componentInstance.currency = this.viewData.currency;
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.newProductSku = new Date().toString();
        result.forEach(item => {
          if (item.product.selectedQty > 0) {
            let addons = [];
            let itemAddons = [];
            item.product.selectedAddons.forEach(addon => {
              itemAddons.push(addon.skuCode + '-' + addon.selectedAddOnQty)
              addons.push({
                isFreeProduct: addon.isFreeProduct,
                addonSku: addon.skuCode,
                quantity: addon.selectedAddOnQty
              })
            });

            const obj = {
              price: item.product.productPrice,
              shoppingCartItemAddons: addons,
              productName: item.product.productName,
              variantName: item.product.productVariant.selectedVariantName,
              quantity: item.product.selectedQty,
              productSku: item.product.productSku,
              productType: 'PRODUCT', // TO BE TAKEN UP BY SERVICE TEAM WHEN WE USE ADDON(NON CUSTOMIZABLE)
            }
            let insertFlag = true;
            this.ItemDetails.forEach(itemDetail => {
              let itemDetailAddons = [];
              itemDetail.shoppingCartItemAddons.forEach(addon => {
                itemDetailAddons.push(addon.addonSku + '-' + addon.quantity)
              });
              if((itemDetail.productSku === item.product.productSku &&
                  JSON.stringify(itemAddons) === JSON.stringify(itemDetailAddons))) {
                    itemDetail.quantity += obj.quantity;
                    insertFlag = false;
              }
            });
            if(insertFlag) {
              this.ItemDetails.push(obj);
            }
          }
        });
      }
    });
  }

  saveAndAssignToStore() {
    let lineItems = [];
    let lineCount = 0;
    for (let product of this.ItemDetails) {
      let addons = [];
      product.shoppingCartItemAddons.forEach(addon => {
        addons.push({
          isFreeProduct: addon.isFreeProduct,
          addonSku: addon.addonSku,
          quantity: addon.quantity
        })
      });
      if (product.quantity > 0) {
        const line = {
          lineItemNo: ++lineCount,
          productSku: product.productSku,
          skuType: product.productType,
          quantity: product.quantity,
          transactionItemAddons: addons,
        }
        lineItems.push(line);
      }
    }

    const requestObj = {
      txnOid: this.viewData.orderId,
      billAmount: this.viewData.totalAmount,
      deliveryType: this.viewData.orderType,
      lineItems: lineItems,
      noOfProducts: this.viewData.noOfItems,
      scheduledTime: this.viewData.txnTime,
      shoppingCartOid: this.viewData.shoppingCartOid,
      storeId: this.viewData.storeOid,
      storeOid: this.viewData.storeOid
    }

    this.statusLoader = true;
    const MODIFY_ORDER = environment.APIEndpoint + 'api/rpa/order/v1/modifyOrder';

    this.https.postJson(MODIFY_ORDER, requestObj).subscribe(
      (response) => {
        this.statusLoader = false;
        localStorage.setItem('liverOrderTabIndex', '0');
        this.router.navigate(['/live-orders-listing']);
      }, (err) => {
        this.statusLoader = false;
        this.errorMsgCode(err)
      });
  }

  openStatusUpdateDialog(ID, statusType) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      orderId: ID,
      type: statusType
    }
    dialogConfig.width = "350px";
    dialogConfig.height = 'auto';
    dialogConfig.autoFocus = false;
    dialogConfig.panelClass = 'reject-order-dialogue';
    const dialogRef = this.dialog.open(RejectOrderDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      if (result == 'cancelled') {
        this.showRejectedStatusBtn = false;
        this.showModifyOrderBtns = false;
        this.showCloseTktBtn = false;
      } else if (result == 'reject') {
        localStorage.setItem('liverOrderTabIndex', '0');
        this.router.navigate(['/live-orders-listing']);
      }
    });
  }

  errorMsgCode(err) {
    if (err.error.errorType == 'VALIDATION') {
      this.snackBar.openFromComponent(SnackBarComponent, {
        duration: 10000,
        data: {
          status: "failure",
          message: err.error.errorDetails[0].description
        }
      });
    } else {
      this.statusLoader = false;
      this.snackBar.openFromComponent(SnackBarComponent, {
        duration: 10000,
        data: {
          status: "failure",
          message: "Your request cannot be saved at this time. Please try again later"
        }
      });
    }
  }

  getOrderDetails() {
    this.statusLoader = true;
    const GET_ORDER_DETAILS = environment.APIEndpoint + 'api/rpa/order/v2/transaction/view';
    let request = {
      "txnOid": this.orderId
    }
    this.https.postJson(GET_ORDER_DETAILS, request).subscribe(
      (response) => {
        this.statusLoader = false;
        this.viewData = response;
        this.transactionId = this.viewData.txnId;
        this.txnRefundAmpount = this.viewData.totalRefundAmount;
        this.paymentDetails = this.viewData['tenderDetails'];
        this.enquiryID = this.viewData.enquiryId;
        this.boolRefund = this.viewData.boolRefund;
        if (this.enquiryID == 0) {
          this.showAddNotesBtn = true;
          this.enquirySection = false;
        } else if (this.enquiryID != 0) {
          this.showAddNotesBtn = false;
          this.enquirySection = true;
        }
        if (this.viewData.orderStatus == 'ORDER_PICKED' || this.viewData.orderStatus == 'DELIVERY_PERSON_ASSIGNED' || this.viewData.orderStatus == 'ORDER_ACCEPTED' || this.viewData.orderStatus == 'FOOD_PREPARING') {
          if(this.viewData.orderStatus == 'ORDER_ACCEPTED' || this.viewData.orderStatus == 'FOOD_PREPARING'){
            this.foodPreparingBtn = true;
            this.newOrderStatus = false;
          }
   
          // if (this.viewData.orderType == 'DELIVERY') {
          //   this.completeStatusBtn = false;
          // } else if (this.viewData.orderType == 'PICKUP' || this.viewData.orderType == 'CURBSIDE') {
          //   this.completeStatusBtn = true;
          // }
        if (this.viewData.orderType == 'DELIVERY' || this.viewData.orderType == 'PICKUP' || this.viewData.orderType == 'CURBSIDE') {
            this.completeStatusBtn = true;
          }
        }
        if (this.viewData.orderStatus == 'ORDER_PLACED') {
          this.newOrderStatus = true;
          this.showIntiateFundBtn = false;
        }
        else {
          this.newOrderStatus = false;
        }
        if (this.viewData.orderStatus == 'ORDER_REJECTED') {
          console.log(this.viewData.orderStatus);
          this.showRejectedStatusBtn = true;
        } else {
          this.showRejectedStatusBtn = false;
        }
        if (this.viewData.orderStatus == 'ON_THE_WAY' || this.viewData.orderStatus == 'DELIVERY_DELAY') {
          if (this.viewData.orderType == 'DELIVERY' || this.viewData.orderType == 'CURBSIDE' || this.viewData.orderType == 'PICKUP') {
            this.showDeliveryIcon = true;
          } else {
            this.showDeliveryIcon = false;
          }
        }

        if (this.viewData.orderStatus == 'ORDER_READY') {
          // this.orderToPos = true;
          if (this.viewData.orderType == 'DELIVERY') {
            this.showDeliveryIcon = true;
            this.completeStatusBtn = false;
          } else if (this.viewData.orderType == 'PICKUP' || this.viewData.orderType == 'CURBSIDE') {
            this.completeStatusBtn = true;
            this.showDeliveryIcon = false;
          } 
        }

        if(this.viewData.orderStatus != 'ORDER_PLACED' && (this.viewData.orderType == 'DELIVERY' || this.viewData.orderType == 'PICKUP' || this.viewData.orderType == 'CURBSIDE')){
            for(var i=0; i < this.paymentDetails.length; i++){
              if(this.paymentDetails[i].tenderType == 'Cards' && this.txnRefundAmpount == 0 && this.refundBtnPermission == true){
                this.cardAmount = this.paymentDetails[i].tenderValue;
                this.cardPay = true;
                this.showIntiateFundBtn = true;
              }
              if(this.paymentDetails[i].tenderType == 'Points' &&  this.viewData.totalRefundPoints == 0 && this.refundBtnPermission == true){
                this.pointsPay = true;
                this.showIntiateFundBtn = true;
              }
              if(this.paymentDetails[i].tenderType == 'Free Product' &&  this.viewData.totalRefundPoints == 0 && this.refundBtnPermission == true){
                this.pointsPay = true;
                this.showIntiateFundBtn = true;
              }
              if(this.paymentDetails[i].tenderType == 'Cards' && this.txnRefundAmpount > 0){
                this.showRedeemedCash = true;
              }
              if(this.paymentDetails[i].tenderType == 'Points' && this.viewData.totalRefundPoints > 0){
                this.showRedeemedPoints = true;
              }
            }
        }

        if (this.viewData.modifiedOrder) {
          const CART_REQUEST = environment.APIEndpoint + 'api/ns/shoppingCart/v2/getItemsAdmin';
          const cartRequest = {
            txnOid: this.orderId,
            cartStatus: "MODIFIED"
          }
          this.https.postJson(CART_REQUEST, cartRequest).subscribe(
            (cartResponse: any) => {
              if (cartResponse) {
                this.ItemDetails = cartResponse['shoppingCartItems'];
                this.viewData.shoppingCartOid = cartResponse['shoppingCartOid'];
                this.billingData = cartResponse.billDetails;
                this.setBillDetails(cartResponse);
                this.statusLoader = false;
              }
            }, (err) => {
              this.statusLoader = false;
              this.errorMsgCode(err);
            });
        }else{
          const CART_REQUEST = environment.APIEndpoint + 'api/ns/shoppingCart/v2/getItemsAdmin';
          const cartRequest = {
            txnOid: this.orderId,
            cartStatus: "PLACED"
          }
          this.https.postJson(CART_REQUEST, cartRequest).subscribe(
            (cartResponse: any) => {
              this.ItemDetails = cartResponse['shoppingCartItems'];
              this.viewData.shoppingCartOid = cartResponse['shoppingCartOid'];
              this.billingData = cartResponse.billDetails;
              this.setBillDetails(cartResponse);
  
              this.statusLoader = false;
            }, (err) => {
              this.statusLoader = false;
              this.errorMsgCode(err);
            });
        }
      }, (err) => {
        this.statusLoader = false;
        this.errorMsgCode(err)
      });
  }


  setBillDetails(cartResponse) {
    this.viewData.noOfItems = cartResponse.shoppingCartItems.reduce((total, item) =>
      total + item.quantity
    ,0);
    this.viewData.totalTax = cartResponse.billDetails.totalTax;
    this.viewData.totalPackageCharge = cartResponse.billDetails.totalPackageCost;
    this.viewData.totalAmount = cartResponse.billDetails.totalPrice;
  }

  // orderPlaceToPos(transactionId){
  //   const ACCEPT_ORDER = environment.APIEndpoint + 'api/rpa/order/v1/pushOrderToERP';
  //   let request = {
  //     txnOid: transactionId,
  //   }
  //   this.https.postJson(ACCEPT_ORDER, request).subscribe((response) => {
  //     this.snackBar.openFromComponent(SnackBarComponent, {
  //       duration: 10000,
  //       data: {
  //         status: "success",
  //         message: "Order placed to POS."
  //       }
  //     });
  //     this.orderToPos = false;
  //   }, (err) => {
  //     if (err.error.status == 500) {
  //       this.snackBar.openFromComponent(SnackBarComponent, {
  //         duration: 10000,
  //         data: {
  //           status: "failure",
  //           message: "Your request cannot be saved at this time. Please try again later"
  //         }
  //       });
  //     } 
  //     else {
  //       this.snackBar.openFromComponent(SnackBarComponent, {
  //         duration: 10000,
  //         data: {
  //           status: "failure",
  //           message: err.error.message
  //         }
  //       });
  //     }
  // });
  // }

  updateOrderStatusOnInitiateRefund(transactionId){
    const ACCEPT_ORDER = environment.APIEndpoint + 'api/rpa/order/v2/updateOrderStatus';
    let request = {
      orderId: transactionId,
      orderStatus: 'order_refunded',
      orderDeliveryType: this.viewData.orderType,
      invoiceNumber: this.inputInvoice ? this.inputInvoice : "",
      rejectedReason: "",
      rejectedReasonDesc: ""
    }
    this.https.postJson(ACCEPT_ORDER, request).subscribe((response) => {
      this.snackBar.openFromComponent(SnackBarComponent, {
        duration: 10000,
        data: {
          status: "success",
          message: "Refund Initiated Successfully."
        }
      });
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
        this.statusLoader = false;
        this.snackBar.openFromComponent(SnackBarComponent, {
          duration: 10000,
          data: {
            status: "failure",
            message: "Your request cannot be saved at this time. Please try again later"
          }
        });
      }
    })
  }

  orderStatusChange(transactionId, status) {
    if(status == 'ready' && this.inputInvoice == ''){
      this.showInvoiceErrorMsg = true;
      return;
    }
    this.statusLoader = true;
    const ACCEPT_ORDER = environment.APIEndpoint + 'api/rpa/order/v2/updateOrderStatus';
    let request = {
      orderId: transactionId,
      orderStatus: status,
      orderDeliveryType: this.viewData.orderType,
      invoiceNumber: this.inputInvoice ? this.inputInvoice : "",
      rejectedReason: "",
      rejectedReasonDesc: ""
    }
    this.https.postJson(ACCEPT_ORDER, request).subscribe((response) => {
      this.statusLoader = false;
      this.getOrderDetails();
      if (status == 'accept') {
        this.foodPreparingBtn = true;
        this.completeStatusBtn = this.viewData.orderType == 'DELIVERY' ? false : true;
        this.newOrderStatus = false;
      }
      else {
        this.foodPreparingBtn = false;
      }
      if (status == 'food_is_ready') {
        this.completeStatusBtn = this.viewData.orderType == 'DELIVERY' ? false : true;
        this.foodPreparingBtn = false;
      }
      if (status == 'completed') {
        this.router.navigate(['/transactions-listing']);
      }
    }, (err) => {
      this.statusLoader = false;
      if (err.error.errorType == 'VALIDATION') {
        this.snackBar.openFromComponent(SnackBarComponent, {
          duration: 10000,
          data: {
            status: "failure",
            message: err.error.errorDetails[0].description
          }
        });
      } else {
        this.statusLoader = false;
        this.snackBar.openFromComponent(SnackBarComponent, {
          duration: 10000,
          data: {
            status: "failure",
            message: "Your request cannot be saved at this time. Please try again later"
          }
        });
      }
    })
  }

  modifyOrder(type) {
    if (type == 'modify') {
      this.showModifyOrderBtns = true;
      this.showRejectedStatusBtn = false;
      this.showChangeQtyBtn = true;
    }
  }

  gotoPreviousPage(ID) {
    localStorage.setItem('liverOrderTabIndex', this.previousTabIndex)
    this.router.navigate(['/live-orders-listing']);
  }

  intiateRefund(txnId, amount){
    if(this.cardPay == true){
      this.intiateCashRefund(txnId, amount);
    }
    if(this.pointsPay == true && this.cardPay == false){
      this.initiatePointsRefund();
    }
  }

  initiatePointsRefund(){
    this.statusLoader = true;
    const REFUND_POINTS = environment.APIEndpoint + 'api/rpa/order/v1/refundPoint';
    let request = {
      "txnOid": this.viewData.orderId,
    }
    this.https.postJson(REFUND_POINTS, request).subscribe((response) => {
      this.statusLoader = false;
      this.snackBar.openFromComponent(SnackBarComponent, {
        duration: 10000,
        data: {
          status: "success",
          message: "Refund Initiated Successfully."
        }
      });
      this.updateOrderStatus();
    }, (error) => {
      this.statusLoader = false;
      this.commonFunctions.displayErrorMessage(error);
    });
  }

  intiateCashRefund(txnId, amount) {
    this.statusLoader = true;
    if (environment.APIEndpoint == 'http://14.142.204.100:8080/') {
      this.API_END_URL = 'http://14.142.50.225:7700/paymentApp/api/rpa/ccavenue/v1/getRefund';
    } else if (environment.APIEndpoint == 'https://thuat-api.reciproci.com/') {
      this.API_END_URL = 'https://thuat-pg-api.reciproci.com/paymentApp/api/rpa/ccavenue/v1/getRefund';
    } else if(environment.APIEndpoint == 'https://thpreprod-admin-api.reciproci.com/'){
      this.API_END_URL = 'https://thpreprod-pg-api.reciproci.com/paymentApp/api/rpa/ccavenue/v1/getRefund';
    } else if(environment.APIEndpoint == 'https://th-api.reciproci.com/admin/'){
      this.API_END_URL = 'https://th-pg-api.reciproci.com/paymentApp/api/rpa/ccavenue/v1/getRefund';
    }
    let request = {
      "txnId": txnId.toString(),
      "amount": this.cardAmount
    }
    this.https.postJson(this.API_END_URL, request).subscribe((response) => {
      let result: any = response;
      this.statusLoader = false;
      if (result.refund_status == 0) {
        this.showIntiateFundBtn = false;
        this.refundSuccess = true;
        this.statusLoader = false;
        if(this.pointsPay == true){
          this.initiatePointsRefund();
        }
        if(this.pointsPay == false){
          this.updateOrderStatus();
        }
        this.snackBar.openFromComponent(SnackBarComponent, {
          duration: 10000,
          data: {
            status: "success",
            message: "Refund Initiated Successfully."
          }
        });
      } else if (result.refund_status == 1) {
        this.showIntiateFundBtn = true;
        this.refundSuccess = false;
        this.statusLoader = false;
        this.snackBar.openFromComponent(SnackBarComponent, {
          duration: 10000,
          data: {
            status: "failure",
            message: result.reason
          }
        });
      }
    }, (err) => {
      console.log(err);
      this.statusLoader = false;
      this.errorMsgCode(err)
    })
  }

  closeTicket() {
    this.statusLoader = true;
    const ASSIGN_TO = environment.APIEndpoint + 'api/rpa/order/v2/updateOrderAssignStatus';
    let request = {
      "userOid": localStorage.getItem('userId'),
      "transactionOid": this.viewData.orderId,
      "assignOrderStatus": "CLOSE"
    }
    this.https.postJson(ASSIGN_TO, request).subscribe((response) => {
      this.statusLoader = false;
      localStorage.setItem('liverOrderTabIndex', '0');
      this.router.navigate(['/live-orders-listing']);
    }, (err) => {
      this.statusLoader = false;
      this.errorMsgCode(err);
    })
  }

  updateOrderStatus() {
    this.statusLoader = true;
    const UPDATE_ORDER_STATUS = environment.APIEndpoint + 'api/rpa/order/v2/updateOrderStatus';
    let request = {
      orderId: this.viewData.txnId,
      orderStatus: 'order_refunded',
      orderDeliveryType: this.viewData.orderType,
      rejectedReason: "",
      invoiceNumber:"",
      rejectedReasonDesc: ""
    }
    this.https.postJson(UPDATE_ORDER_STATUS, request).subscribe((response) => {
      // this.closeTicket();
      this.statusLoader = false;
      localStorage.setItem('liverOrderTabIndex', '0');
      this.router.navigate(['/live-orders-listing']);
    }, (err) => { this.statusLoader = false; this.errorMsgCode(err); })
  }

  createEnquiry() {
    this.pageLoader = true;
    let request = {
      "transactionId": this.transactionId,
      "customerOid": this.viewData.customerOid,
      "enquiryCode": "TIM",
      "enquiryDescription": "Call Center Enquiry",
      "isTransaction": true,
      "transactionFeedback": []
    }
    const CREATE_ENQUIRY = environment.APIEndpoint + 'api/rpa/enquiry/v2/createNotes';
    this.https.postJson(CREATE_ENQUIRY, request).subscribe((response) => {
      this.enquiryData = response;
      this.enquiryID = this.enquiryData['notesId'];
      this.enquirySection = true;
      this.showAddNotesBtn = false;
      this.pageLoader = false;
    }, (err) => {
      this.pageLoader = false;
      this.errorMsgCode(err);
    })
  }

  isEmptyObject(obj) {
    return (obj && (Object.keys(obj).length === 0));
  }
}






