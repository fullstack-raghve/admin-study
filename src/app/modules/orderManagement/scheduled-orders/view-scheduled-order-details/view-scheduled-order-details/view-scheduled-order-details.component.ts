import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/services/http-service';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { MatDialog, MatDialogConfig, MatSnackBar } from '@angular/material';
import { RejectOrderDialogComponent } from '../../../../../shared/components/orderManagement/reject-order-dialog/reject-order-dialog.component';
import { SnackBarComponent } from 'src/app/shared/components/snack-bar/snack-bar.component';
import { CommonFunctions } from 'src/app/services/common-functions';

@Component({
  selector: 'view-scheduled-order-details',
  templateUrl: './view-scheduled-order-details.component.html',
  styleUrls: ['./view-scheduled-order-details.component.scss']
})
export class ViewScheduledOrderDetailsComponent implements OnInit {
  public breadCrumbData: Array<Object> = [
    { title: 'Order Management', link: '' },
    { title: 'Scheduled Order', link: '' },
  ];
  public ItemDetails: any = [];
  public orderId: any;
  public viewData: any = {};
  public showIntiateFundBtn:boolean = false; 
  public showAddNotesBtn: boolean = false;
  public pageLoader: boolean = false;
  public enquiryData: any[];
  public enquiryID:any;
  enquirySection: boolean = false;
  public transactionId: any;
  public statusLoader: boolean = false;
  public txnRefundAmpount:number;
  public refundSuccess:boolean = false;
  public API_END_URL: string;
  public paymentDetails:any = [];
  public billingData: any;
  public cardPay:boolean = false;
  public pointsPay:boolean = false;
  public cardAmount:any;
  public showRedeemedCash: boolean = false;
  public showRedeemedPoints: boolean = false;
  public menuIds: any = JSON.parse(localStorage.getItem("menuIds"));
  public refundBtnPermission: boolean = false;
  public cancelButton: boolean = false;

  constructor(private https: HttpService,
    private router: Router,
    public dialog: MatDialog,
    public snackBar: MatSnackBar,
    private commonFunctions: CommonFunctions
  ) { 
    this.menuIds.forEach(element => {
      if(element == 14002005){
        this.cancelButton = true;
      }
    });
  }

  ngOnInit() {
    if (localStorage.getItem('viewScheduleId')) {
      this.menuIds.forEach(element => {
        if(element == 14007){
          this.refundBtnPermission = true;
        }
      });
      this.orderId = localStorage.getItem('viewScheduleId');
      localStorage.removeItem('viewScheduleId');
      this.getOrderDetails();
    } else {
      this.router.navigate(['/scheduled-orders-listing']);
    }
  }

  openCancelDialog(ID) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      orderId: ID,
      type:'cancelled'
    }
    dialogConfig.width = "350px";
    dialogConfig.height = 'auto';
    dialogConfig.autoFocus = false;
    dialogConfig.panelClass = 'reject-order-dialogue';
    const dialogRef = this.dialog.open(RejectOrderDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      if(result == 'cancelled'){
        // if(this.viewData['paymentMode'].length != 0){
        //   this.showIntiateFundBtn = true; 
        // }
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
    });
  }

  getOrderDetails() {
    const GET_ORDER_DETAILS = environment.APIEndpoint + 'api/rpa/order/v2/transaction/view';
    let request = {
      "txnOid": this.orderId
    }
    this.https.postJson(GET_ORDER_DETAILS, request).subscribe(
      (response) => {
        this.viewData = response;
        this.transactionId = this.viewData.txnId;
        this.enquiryID = this.viewData.enquiryId;
        this.paymentDetails = this.viewData['tenderDetails'];
        this.txnRefundAmpount = this.viewData.totalRefundAmount;

        if(this.enquiryID == 0){
          this.showAddNotesBtn = true;
          this.enquirySection = false;
        }else if(this.enquiryID != 0){
          this.showAddNotesBtn = false;
          this.enquirySection = true;
        }
        this.ItemDetails = response['productDetail'];
        
        const CART_REQUEST = environment.APIEndpoint + 'api/ns/shoppingCart/v2/getItemsAdmin';
        const cartRequest = {
          txnOid : this.orderId,
          cartStatus : "PLACED"
        }
        this.https.postJson(CART_REQUEST, cartRequest).subscribe(
          (cartResponse) => {
          this.ItemDetails = cartResponse['shoppingCartItems'];
          this.viewData.shoppingcartOid = cartResponse['shoppingCartOid'];
          this.billingData = cartResponse['billDetails'];
          this.setBillDetails(cartResponse);

          if(this.viewData.modifiedOrder) {
            const CART_REQUEST = environment.APIEndpoint + 'api/ns/shoppingCart/v2/getItemsAdmin';
            const cartRequest = {
              txnOid : this.orderId,
              cartStatus : "MODIFIED"
            }
            this.https.postJson(CART_REQUEST, cartRequest).subscribe(
              (cartResponse) => {
                if(cartResponse) {
                  this.ItemDetails = [...this.ItemDetails, ...cartResponse['shoppingCartItems']];
                  this.viewData.shoppingcartOid = cartResponse['shoppingCartOid'];
                  this.billingData = cartResponse['billDetails'];
                  this.setBillDetails(cartResponse);
                }
              }, (err) => {
                this.statusLoader = false;
                // this.errorMsgCode(err);
              });
          }

          this.statusLoader = false;
        }, (err) => {
          this.statusLoader = false;
          // this.errorMsgCode(err);
        });
      }
    )
  }
  errorMsgCode(err) {
    console.log("error Status = ", err);
    if (err.error.errorType == 'VALIDATION') {
      this.statusLoader = false;
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
  setBillDetails(cartResponse) {
    this.viewData.noOfItems = cartResponse.shoppingCartItems.reduce((total, item) =>
      total + item.quantity
    ,0);
    this.viewData.totalTax = cartResponse.billDetails.totalTax;
    this.viewData.totalPackageCharge = cartResponse.billDetails.totalPackageCost;
    this.viewData.totalAmount = cartResponse.billDetails.totalPrice;
  }

  createEnquiry() {
    this.pageLoader = true;
    let request = {
      "transactionId": this.transactionId,
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

  intiateRefund(txnId, amount){
    if(this.cardPay == true){
      this.intiateCashRefund(txnId);
    }
    if(this.pointsPay == true && this.cardPay == false){
      this.initiatePointsRefund();
    }
  }

  initiatePointsRefund(){
    this.pageLoader = true;
    const REFUND_POINTS = environment.APIEndpoint + 'api/rpa/order/v1/refundPoint';
    let request = {
      "txnOid": this.viewData.orderId,
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

  intiateCashRefund(txnId) {
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
        this.statusLoader = false;
        this.showIntiateFundBtn = true;
        this.refundSuccess = false;
        this.snackBar.openFromComponent(SnackBarComponent, {
          duration: 10000,
          data: {
            status: "failure",
            message: result.reason
          }
        });
      }

    }, (error) => {
      this.statusLoader = false;
      console.log(error);
    })
  }

  updateOrderStatus() {
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
      this.router.navigate(['/scheduled-orders-listing']);
      this.snackBar.openFromComponent(SnackBarComponent, {
        duration: 10000,
        data: {
          status: "success",
          message: "Refund Initiated Successfully."
        }
      });
    }, (error) => { console.log(error) })
  }

  updateOrderStatusOnInitiateRefund() {
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
    });
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
      this.router.navigate(['/scheduled-orders-listing']);
    }, (error) => {
      this.statusLoader = false;
      console.log(error);
    })
  }

  isEmptyObject(obj) {
    return (obj && (Object.keys(obj).length === 0));
  }
}
