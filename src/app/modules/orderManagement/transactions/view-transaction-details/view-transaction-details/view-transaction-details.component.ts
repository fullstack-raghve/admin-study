import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/services/http-service';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { SnackBarComponent } from 'src/app/shared/components/snack-bar/snack-bar.component';
import { MatSnackBar } from '@angular/material';
import { CommonFunctions } from 'src/app/services/common-functions';
@Component({
  selector: 'view-transaction-details',
  templateUrl: './view-transaction-details.component.html',
  styleUrls: ['./view-transaction-details.component.scss']
})

export class ViewTransactionDetailsComponent implements OnInit {
  public breadCrumbData: Array<Object> = [
    { title: 'Order Management', link: '' },
    { title: 'Transactions', link: '' },
  ];
  public ItemDetails: any = [];
  public orderId: any;
  public viewData: any = {};
  public txnId: number;
  public showAddNotesBtn: boolean = false;
  public pageLoader: boolean = false;
  public showRefundBtn: boolean = false;
  public API_END_URL: any;
  public enquiryData: any[];
  public enquiryID:any;
  public feedbackRatingData: any;
  public enquirySection: boolean = false;
  public txnRefundAmpount:number;
  public refundSuccess:boolean = false;
  public billingData:any;
  public paymentDetails:any = [];
  public cardPay:boolean = false;
  public pointsPay:boolean = false;
  public cardAmount:any;
  public showRedeemedCash: boolean = false;
  public showRedeemedPoints: boolean = false;
  public menuIds: any = localStorage.getItem("navigationArray");
  public refundBtnPermission: boolean = false;
  deliveryDetails: any;
   boolRefund: boolean = true;

  constructor(
    private https: HttpService, 
    private router: Router,
    public snackBar: MatSnackBar,
    private commonFunctions: CommonFunctions
  ) {}

  ngOnInit() {
    if (localStorage.getItem('viewOrderId')) {
      if (this.menuIds.indexOf('14007') > -1) {
        this.refundBtnPermission = true;
      }
      this.orderId = localStorage.getItem('viewOrderId');
      localStorage.removeItem('viewOrderId');
      this.getOrderDetails();
    } else {
      this.router.navigate(['/transactions-listing']);
    }
  }
  getOrderDetails() {
    this.pageLoader = true;
    const GET_ORDER_DETAILS = environment.APIEndpoint + 'api/rpa/order/v2/transaction/view';
    let request = {
      "txnOid": this.orderId
    }
    this.https.postJson(GET_ORDER_DETAILS, request).subscribe(
      (response) => {
        this.pageLoader = false;
        this.viewData = response;
        this.txnId = this.viewData.txnId;
        this.txnRefundAmpount = this.viewData.totalRefundAmount;
        this.paymentDetails = this.viewData['tenderDetails'];
        this.deliveryDetails = this.viewData['deliveryAddress'];
        this.boolRefund = this.viewData.boolRefund;
        console.log(this.deliveryDetails);
        for(var i=0; i < this.paymentDetails.length; i++){
          if(this.paymentDetails[i].tenderType == 'Cards' && this.txnRefundAmpount == 0 && this.refundBtnPermission == true){
            this.cardAmount = this.paymentDetails[i].tenderValue;
            this.cardPay = true;
            this.showRefundBtn = true;
          }
          if(this.paymentDetails[i].tenderType == 'Points' &&  this.viewData.totalRefundPoints == 0 && this.refundBtnPermission == true){
            this.pointsPay = true;
            this.showRefundBtn = true;
          }
          if(this.paymentDetails[i].tenderType == 'Cards' && this.txnRefundAmpount > 0){
            this.showRedeemedCash = true;
          }
          if(this.paymentDetails[i].tenderType == 'Points' && this.viewData.totalRefundPoints > 0){
            this.showRedeemedPoints = true;
          }
        }
        console.log(this.showRedeemedCash);
        console.log(this.showRedeemedPoints);
        
        console.log(this.pointsPay);  
        console.log(this.cardPay);
        
        // this.showRefundBtn = this.txnRefundAmpount == 0 || this.viewData.totalRefundPoints == 0 ? true : false;
        this.enquiryID = this.viewData.enquiryId;
        if(this.enquiryID == 0){
          this.showAddNotesBtn = true;
          this.enquirySection = false;
        }else if(this.enquiryID != 0){
          this.showAddNotesBtn = false;
          this.enquirySection = true;
          this.enquiryID;
          // alert(this.enquiryID);
          // this.showEnquirySection = true;
        }
        this.getFeedbackAndEnquiryDetails();
        this.ItemDetails = response['productDetail'];
        
        const CART_REQUEST = environment.APIEndpoint + 'api/ns/shoppingCart/v2/getItemsAdmin';
        const cartRequest = {
          txnOid : this.orderId,
          cartStatus : this.viewData.modifiedOrder ==  true ? 'MODIFIED' : 'PLACED'
        }
        this.https.postJson(CART_REQUEST, cartRequest).subscribe(
          (cartResponse) => {
          this.ItemDetails = cartResponse['shoppingCartItems'];
          this.viewData.shoppingcartOid = cartResponse['shoppingCartOid'];
          this.billingData = cartResponse['billDetails'];
          this.setBillDetails(cartResponse);
          this.pageLoader = false;
        }, (err) => {
          this.pageLoader = false;
          this.errorMsgCode(err);
        });

      }, err => {
        console.log(err);
        this.pageLoader = false;
      })
  }

  errorMsgCode(err) {
    console.log("error Status = ", err);
    if (err.error.errorType == 'VALIDATION') {
      this.pageLoader = false;
    } else {
      this.pageLoader = false;
      this.snackBar.openFromComponent(SnackBarComponent, {
        duration: 10000,
        data: {
          status: "failure",
          message: "Your request cannot be saved at this time. Please try again later"
        }
      });
    }
  }

  setBillDetails(cartResponse) {
    this.viewData.noOfItems = cartResponse.shoppingCartItems.reduce((total, item) =>
      total + item.quantity
    ,0);
    this.viewData.totalTax = cartResponse.billDetails.totalTax;
    this.viewData.totalPackageCharge = cartResponse.billDetails.totalPackageCost;
    this.viewData.totalAmount = cartResponse.billDetails.totalPrice;
  }

  intiateRefund(txnId, amount){
    // let payMode = this.viewData['paymentMode'];
    // if(payMode[0] == 'Points'){
    //   this.initiatePointsRefund(txnId, amount);
    // } else if(payMode[0] == 'Cards'){
    //   this.intiateCashRefund(txnId, amount);
    // }
    // if(this.txnRefundAmpount == 0 && this.viewData.totalRefundPoints == 0 ){
    //   this.intiateCashRefund(txnId, amount);
    //   this.initiatePointsRefund();
    // }else if(this.txnRefundAmpount == 0){
    //   this.intiateCashRefund(txnId, amount);
    // } else if(this.viewData.totalRefundPoints == 0){
    //   this.initiatePointsRefund();
    // }

    if(this.cardPay == true){
      this.intiateCashRefund(txnId, amount);
    }
    if(this.pointsPay == true && this.cardPay == false){
      this.initiatePointsRefund();
    }
  }

  initiatePointsRefund(){
    this.pageLoader = true;
    const REFUND_POINTS = environment.APIEndpoint + 'api/rpa/order/v1/refundPoint';
    let request = {
      "txnOid": this.viewData.orderId
      // "amount": amount
    }
    this.https.postJson(REFUND_POINTS, request).subscribe((response) => {
      console.log(response);
      this.pageLoader = false;
      this.snackBar.openFromComponent(SnackBarComponent, {
        duration: 10000,
        data: {
          status: "success",
          message: "Refund Initiated Successfully."
        }
      });
      this.updateOrderStatus();
    }, (error) => {
      this.pageLoader = false;
      this.commonFunctions.displayErrorMessage(error);
    });
  }

  intiateCashRefund(txnId, amount) {
    this.pageLoader = true;
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

      this.pageLoader = false;
      if (result.refund_status == 0) {
        this.showRefundBtn = false;
        this.refundSuccess = true;
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
        this.showRefundBtn = true;
        this.refundSuccess = false;
        this.snackBar.openFromComponent(SnackBarComponent, {
          duration: 10000,
          data: {
            status: "failure",
            message: result.reason
          }
        });
      }

    },(error)=>{
      this.pageLoader = false;
      console.log(error);
    })
  }

  closeTicket() {
    this.pageLoader = true;
    const ASSIGN_TO = environment.APIEndpoint + 'api/rpa/order/v2/updateOrderAssignStatus';
    let request = {
      "userOid": localStorage.getItem('userId'),
      "transactionOid": this.viewData.orderId,
      "assignOrderStatus": "CLOSE"
    }
    this.https.postJson(ASSIGN_TO, request).subscribe((response) => {
      this.pageLoader = false;
      this.router.navigate(['/transactions-listing']);
    }, (err) => {
      this.pageLoader = false;
      this.errorMsgCode(err);
    })
  }

  updateOrderStatus() {
    this.pageLoader = true;
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
      this.pageLoader = false;
      this.snackBar.openFromComponent(SnackBarComponent, {
        duration: 10000,
        data: {
          status: "success",
          message: "Refund Initiated Successfully."
        }
      });
      this.router.navigate(['/transactions-listing']);
    }, (err) => {
      this.pageLoader = false; 
      this.errorMsgCode(err); 
    })
  }


  createEnquiry() {
    this.pageLoader = true;
    let request = {
      "transactionId": this.txnId,
      "customerOid" : this.viewData.customerOid,
      "enquiryCode":"TIM",
      "enquiryDescription": "Test enquiry3",
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
    },(error)=>{
      console.log(error);
      this.pageLoader = false;
    })
  }

  getFeedbackAndEnquiryDetails(){
    const GET_FNB_ENQUIRY = environment.APIEndpoint + 'api/rpa/feedback/notifications/v1/transactionDetails';
    this.https.getJson(GET_FNB_ENQUIRY + '?txnOid=' + this.viewData.orderId).subscribe((response) => {
      this.feedbackRatingData = response;
    },(error)=>{
      console.log(error);
    })
  }

  isEmptyObject(obj) {
    return (obj && (Object.keys(obj).length === 0));
  }
}