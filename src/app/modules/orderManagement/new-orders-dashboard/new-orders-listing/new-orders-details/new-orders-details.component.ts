import { Component, Input, OnChanges, Output, EventEmitter, ViewChild, ElementRef} from '@angular/core';
import { Common } from 'src/app/services/common';
import { CommonFunctions } from 'src/app/services/common-functions';
import { RejectOrderDialogComponent } from '../../../../../shared/components/orderManagement/reject-order-dialog/reject-order-dialog.component';
import { MatDialogConfig, MatDialog, MatSnackBar } from '@angular/material';
import * as moment from 'moment';
import { SnackBarComponent } from 'src/app/shared/components/snack-bar/snack-bar.component';
import { environment } from 'src/environments/environment';
import { HttpService } from 'src/app/services/http-service';
import { Router } from '@angular/router';

const STATUS = {
  accepted: 'accept',
  ready: 'food_is_ready',
  rejected: 'reject',
  completed: 'completed'
};

@Component({
  selector: 'new-orders-details',
  templateUrl: './new-orders-details.component.html',
  styleUrls: ['./new-orders-details.component.scss']
})
export class NewOrdersDetailsComponent implements  OnChanges {
  @Input() newOrdersData;
  @Output() changeStatusEvent = new EventEmitter();
  @Output() internetConnection = new EventEmitter();
  @Output() newOrdersSubscription = new EventEmitter();

  @ViewChild('InvoiceNo') InvoiceNo: ElementRef;
  @ViewChild('selectedDeliveryBoy') selectedDeliveryBoy: ElementRef;


  public invoiceNumber = '';
  public otpNumber = '';
  // public invoicePattern = '^[a-z0-9]{1,30}$';
  // public otpPattern = '^[0-9]{4}$';
  public itemDetails;
  public status = '';
  private allOrders;
  private isOnline = true;
  public isInvoice: boolean = false;
  public statusLoader: boolean = false;
  public reassignFlag: boolean = false;

  scannerEnabled: boolean = false;
  public showInvoiceErrorMsg:boolean = false;
  public showDeliveryBoyErrorMsg:boolean = false;
  deliveryBoy: any;
  delBoy: any;
  public fileImgPathUrl = localStorage.getItem("imgBaseUrl");
  
  constructor(
    private https: HttpService,
    private commonFunctions: CommonFunctions,
    private commonService: Common,
    public dialog: MatDialog,
    public snackBar: MatSnackBar,
    private router: Router
  ) {
   }

  ngOnChanges() {
    this.commonService.isOnline().subscribe(isOnline => {
      this.isOnline = isOnline;
     this.internetConnection.emit(this.isOnline);
    });

    this.scannerEnabled = false;
    this.itemDetails = undefined;
    this.allOrders = JSON.parse(localStorage.getItem('allOrders'));
    if(this.newOrdersData && this.newOrdersData.status != '') {
      this.status = this.newOrdersData.status;
      this.itemDetails = this.allOrders[this.status].filter((order)=>{
        return order.orderId == this.newOrdersData.selectedItem.orderId;
      })[0];
      this.isInvoice = this.itemDetails.invoiceNumber != '' ? true : false;
    }
    if(this.status == 'accepted' || this.status =="ready"){
      this.getDeliveryBoyList();
      this.getReassignDeliveryBoyList();
    }
  }

  onCodeResult(resultString: string) {
    this.itemDetails.invoiceNumber = resultString;
    this.scannerEnabled = false;
  }

  enableScanner() {
    this.scannerEnabled = !this.scannerEnabled;
  }

  parseTime(t) {
    const part = t.match(/(\d+):(\d+)(?: )?(am|pm)?/i);
    let hr = parseInt(part[1], 10);
    const min = parseInt(part[2], 10);
    const ampm = part[3] ? part[3].toUpperCase() : null;
    hr = (ampm === "AM") ? (hr == 12) ? 0 : hr : hr;
    hr = (ampm === "PM") ? (hr != 12) ? hr += 12 : hr : hr;
    return { hr, min };
  }

  getTimeDiff(start,end){
    if(start === '' || end === '') {
      return '';
    }
    const {hr: startHr , min: startMin} = this.parseTime(start);
    const {hr: endHr , min: endMin} :any = this.parseTime(end);
    let hourDiff;
    let minDiff;
    if (endMin < startMin) {
      minDiff = endMin + 60 - startMin;
      hourDiff = endHr - 1 - startHr;
    } else {
      minDiff = endMin - startMin;
      hourDiff = endHr - startHr;
    }
    hourDiff = hourDiff.toString().padStart(2, '0');
    minDiff = minDiff.toString().padStart(2, '0');
    let timeText = '';
    timeText += hourDiff != '00' ? hourDiff + 'h, ' : '';
    timeText += minDiff != '00' ? minDiff + 'm ' : '';
    return timeText;
  }

  changeOrderStatus(previousStatus,newStatus) {
    if(newStatus == 'completed'){
      // if(this.deliveryBoy == undefined){
      //   this.showDeliveryBoyErrorMsg = true;
      //   return;
      // }
      if(this.InvoiceNo.nativeElement.value == ''){
        this.showInvoiceErrorMsg = true;
        return;
      }
    }

    this.status = newStatus;
    this.itemDetails.invoiceNumber = this.InvoiceNo.nativeElement.value;
    this.isInvoice = this.itemDetails.invoiceNumber != '' ? true : false;
    const data = {
      orderId : this.itemDetails.orderId,
      previousStatus,
      newStatus,
      order: this.itemDetails
    }
    if(newStatus != 'rejected') {
      const statusData = {
        orderId: this.itemDetails.txnId,
        orderStatus: STATUS[newStatus],
        orderDeliveryType: this.itemDetails.orderType,
        invoiceNumber: this.InvoiceNo.nativeElement.value,
        rejectedReason: "",
        rejectedReasonDesc: ""
      }
      this.invoiceNumber = '';
      if (data.newStatus === 'accepted') {
        this.itemDetails.orderTrackingDetails.orderAcceptTime = moment().format('hh:mm A');
        this.itemDetails.orderTrackingDetails.timePlaceAccept = this.getTimeDiff(
          this.itemDetails.orderTrackingDetails.orderPlaceTime, this.itemDetails.orderTrackingDetails.orderAcceptTime
        );
      } else if (data.newStatus === 'ready') {
        this.itemDetails.orderTrackingDetails.orderReadyTime = moment().format('hh:mm A');
        this.itemDetails.orderTrackingDetails.timeAcceptReady = this.getTimeDiff(
          this.itemDetails.orderTrackingDetails.orderAcceptTime, this.itemDetails.orderTrackingDetails.orderReadyTime
        );
      } else if (data.newStatus === 'completed') {
        this.itemDetails.orderTrackingDetails.orderCompletedTime = moment().format('hh:mm A');
        this.itemDetails.orderTrackingDetails.timeReadyComplete = this.getTimeDiff(
          this.itemDetails.orderTrackingDetails.orderReadyTime, this.itemDetails.orderTrackingDetails.orderCompletedTime
        );
      }
      this.statusLoader = true;
      this.commonService.changeOrderStatus(statusData).subscribe(res => {
        this.changeStatusEvent.emit(data);
        this.statusLoader = false;
      },
      error => {
        this.statusLoader = false;
        this.commonFunctions.displayErrorMessage(error);
      });
    }
    if(newStatus == 'rejected'){
      this.changeStatusEvent.emit(data);
    }
    if(newStatus != 'rejected')
      this.getDeliveryBoyList();
  }

  printPage() {
    window.print();
  }

  DeliveryBoyList= [];
  public getDeliveryBoyList() {
    let DeliveryBoy = environment.APIEndpoint + "api/rpa/order/v1/deliveryPersonList";
    let request = {
      orderId : this.itemDetails.txnId,
      orderStatus:this.status == 'accepted' ? 'ACCEPT' : 'food_is_ready',
    }
    this.https.postJson(DeliveryBoy, request)
      .subscribe((response) => {
        this.DeliveryBoyList = response;
        console.log(response);
      }
        , err => {
          this.snackBar.openFromComponent(SnackBarComponent, {
            duration: 1500,
            data: {
              status: "failure",
              message: "Your request cannot be saved at this time. Please try again later"
            }
          });
        });
  }

  reassignDeliveryBoyList= [];
  public getReassignDeliveryBoyList() {
    let DeliveryBoy = environment.APIEndpoint + "api/rpa/order/v1/reassignabledeliveryPersonList";
    let request = {
      orderId : this.itemDetails.txnId,
      orderStatus:this.status == 'accepted' ? 'ACCEPT' : 'food_is_ready',
    }
    this.https.postJson(DeliveryBoy, request)
      .subscribe((response) => {
        this.reassignDeliveryBoyList = response;
        console.log(response);
      }
        , err => {
          this.snackBar.openFromComponent(SnackBarComponent, {
            duration: 1500,
            data: {
              status: "failure",
              message: "Your request cannot be saved at this time. Please try again later"
            }
          });
        });
  }

//   reloadCurrentRoute() {
//     // let currentUrl = this.router.url;
//     this.router.routeReuseStrategy.shouldReuseRoute = () => false;
//     this.router.onSameUrlNavigation = 'reload';
//     // this.router.navigate([currentUrl]);
// }

  assignDeliveryBoy(oid){
    if(this.deliveryBoy == undefined && this.status == 'completed'){
        this.showDeliveryBoyErrorMsg = true;
        return;
    }
    const data = {
      orderId : this.itemDetails.orderId,
      order: this.itemDetails
    }
    const ACCEPT_ORDER = environment.APIEndpoint + 'api/rpa/order/v1/assignOrderDelivery';
    let request = {
      orderId : this.itemDetails.txnId,
      orderStatus:this.status == 'accepted' ? 'ACCEPT' : 'food_is_ready',
      oid : oid
    }
    console.log(request);
    this.https.postJson(ACCEPT_ORDER, request).subscribe((response) => {
      this.snackBar.openFromComponent(SnackBarComponent, {
        duration: 10000,
        data: {
          status: "success",
          message: "Delivery Boy Assigned to this order."
        }
      });
      this.itemDetails.deliveryPersonAssigned = true;
      this.changeStatusEvent.emit(data);
      this.getReassignDeliveryBoyList();
      // this.allOrders = JSON.parse(localStorage.getItem('allOrders'));
      // this.itemDetails = this.allOrders[this.status].filter((order)=>{
      //   return order.orderId == this.newOrdersData.selectedItem.orderId;
      // })[0]; 
       //   this.reloadCurrentRoute();
    }, (err) => {
      if (err.error.status == 500) {
        this.snackBar.openFromComponent(SnackBarComponent, {
          duration: 10000,
          data: {
            status: "failure",
            message: "Your request cannot be saved at this time. Please try again later"
          }
        });
      } 
      else {
        this.snackBar.openFromComponent(SnackBarComponent, {
          duration: 10000,
          data: {
            status: "failure",
            message: err.error.message
          }
        });
      }
  });
  this.deliveryBoy == '';
  this.delBoy == '';
  oid = '';
  this.showDeliveryBoyErrorMsg = false;
  }

  orderPlaceToPos(transactionId){
    this.itemDetails.invoiceNumber = this.InvoiceNo.nativeElement.value;
    this.isInvoice = this.itemDetails.invoiceNumber != '' ? true : false;
    this.itemDetails.orderPlacedToERP = true;
    const data = {
      orderId : this.itemDetails.orderId,
      order: this.itemDetails
    }
    const ACCEPT_ORDER = environment.APIEndpoint + 'api/rpa/order/v1/pushOrderToERP';
    let request = {
      txnOid: transactionId,
    }
    this.https.postJson(ACCEPT_ORDER, request).subscribe((response) => {
      this.snackBar.openFromComponent(SnackBarComponent, {
        duration: 10000,
        data: {
          status: "success",
          message: "Order placed to POS."
        }
      });
      this.changeStatusEvent.emit(data);
    }, (err) => {
      if (err.error.status == 500) {
        this.snackBar.openFromComponent(SnackBarComponent, {
          duration: 10000,
          data: {
            status: "failure",
            message: "Your request cannot be saved at this time. Please try again later"
          }
        });
      } 
      else {
        this.snackBar.openFromComponent(SnackBarComponent, {
          duration: 10000,
          data: {
            status: "failure",
            message: err.error.message
          }
        });
      }
  });
  }

  openRejectDialog(ID) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      orderId: ID,
      type: 'reject'
    }
    dialogConfig.width = "350px";
    dialogConfig.height = 'auto';
    dialogConfig.autoFocus = false;
    dialogConfig.panelClass = 'reject-order-dialogue';
    const dialogRef = this.dialog.open(RejectOrderDialogComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'reject') {
        this.changeOrderStatus('new','rejected');
      }
    });
  }

  repeatAddonBasedOnProductCount(n: number): any[] {
    return Array(n);
  }
  isEmptyObject(obj) {
    console.log(obj);
    return (obj && (Object.keys(obj).length === 0));
  }
}
