import { Component, OnInit, HostListener, ViewChild } from '@angular/core';
import { HttpService } from 'src/app/services/http-service';
import { Common } from 'src/app/services/common';
import { environment } from 'src/environments/environment';

import { Subscription, timer } from 'rxjs';
import { switchMap, retryWhen } from 'rxjs/operators';
import { MatDialog, MatDialogConfig, MatExpansionPanel } from '@angular/material';
import { ErrorMessagesDialogComponent } from 'src/app/shared/components/orderManagement/error-messages-dialog/error-messages-dialog.component';
// import { StorageService } from 'src/app/services/storageService';
import { TimerService } from 'src/app/services/timer-service';

@Component({
  selector: 'new-orders-listing',
  templateUrl: './new-orders-listing.component.html',
  styleUrls: ['./new-orders-listing.component.scss']
})
export class NewOrdersListingComponent implements OnInit {
  private timeoutInterval : number = 20000;
  public searchBrandId = '';
  public searchStoreId = '';
  public noOrderFound = false;
  private newOrdersOriginalList: any = {
    new : [],
    accepted : [],
    ready : [],
    rejected: [],
    completed: []
  };

  public breadCrumbData: Array<Object> = [
    { title: 'Home', link: ''},
    { title: 'Order Management',link: ''},
    { title: 'New Orders', link: ''}
  ];
  public newOrdersList = {
    new : [],
    accepted : [],
    ready : [],
    rejected: [],
    completed: []
  };
  public newOrdersSubscription: Subscription;
  public beepSubscription: Subscription;
  public storeList = [];
  public brandList = [];

  public panelOpenState: boolean = true;
  public highlightedOrder: any = {orderId : -1};
  public selectedOrder: any;

  public isNewPanelOpen: boolean = true;
  public isAcceptedPanelOpen: boolean = false;
  public isReadyPanelOpen: boolean = false;
  public statusLoader: boolean = false;
  public beepLoader: boolean = false;
  public beepPromise: boolean;

  @ViewChild('newPanel') newPanel: MatExpansionPanel;

  // public above60SecFlag: boolean = true;
  // public above45SecFlag: boolean = true;
  // public above30SecFlag: boolean = true;
  // public above1SecFlag: boolean = true;
  // public above10SecFlag: boolean = true;

  beepAudio;
  beepInitialized: boolean = false;
  storeloader: boolean = false;
  public currentTimeStamp: Date;

  constructor(
    private timerservice: TimerService,
    private https: HttpService,
    public dialog: MatDialog,
    private commonService: Common
  ) { }

  ngOnInit() {
    this.beep();
    // this.beepSubscription = timer(0,1000).subscribe(async () => {
      // this.newOrdersList.new.forEach((order) => {
      //   order.timeElapsed = this.ticker(order.timeElapsed);
      // });
      // if (this.newOrdersList.new.length > 0 && this.above10SecFlag) {
      //   this.above10SecFlag = false;
      //   this.beep();
      //   await timer(9000).take(1).toPromise();
      //   this.above10SecFlag = true;
      // }
      // const aboveMinuteOrders = this.newOrdersList.new.filter((order) => {
      //   order.timeElapsed = this.ticker(order.timeElapsed);
      //   return this.checkForElapsedTime(order.timeElapsed, 59);
      // });
      // if (aboveMinuteOrders.length > 0) {
      //   if (this.above60SecFlag) {
      //     await timer(1000).take(1).toPromise();
      //     this.above60SecFlag = false;
      //   }
      //   this.beep();
      //   return;
      // } else {
      //   this.above60SecFlag = true;
      // }
      // const above45SecOrders = this.newOrdersList.new.filter((order) => {
      //   return this.checkForElapsedTime(order.timeElapsed, 46);
      // });
      // if (above45SecOrders.length > 0 && this.above45SecFlag === true) {
      //   this.above45SecFlag = false;
      //   this.beep();
      //   await timer(4000).take(1).toPromise();
      //   this.above45SecFlag = true;
      //   return;
      // }
      // const above30SecOrders = this.newOrdersList.new.filter((order) => {
      //   return this.checkForElapsedTime(order.timeElapsed, 31, 45);
      // });
      // if (above30SecOrders.length > 0 && this.above30SecFlag === true) {
      //   this.above30SecFlag = false;
      //   this.beep();
      //   await timer(1000).take(1).toPromise();
      //   this.beep();
      //   await timer(14000).take(1).toPromise();
      //   this.above30SecFlag = true;
      //   return;
      // }
      // const newOrders = this.newOrdersList.new.filter((order) => {
      //   return this.checkForElapsedTime(order.timeElapsed, 0, 15);
      // });
      // if (newOrders.length > 0 && this.above1SecFlag === true) {
      //   this.above1SecFlag = false;
      //   this.beep();
      //   await timer(29000).take(1).toPromise();
      //   this.above1SecFlag = true;
      //   return;
      // }

    // });
    localStorage.setItem('excludeFromTimeout', 'true');
    // if(localStorage.getItem("beepLoader")) {
    //   this.beepLoader = true;
    //   localStorage.removeItem("beepLoader")
    // }

    this.beepPromise = true;
    let element:HTMLElement = document.getElementById('auto_trigger') as HTMLElement;
    element.click();
    this.getAllBrands();
    this.newOrdersList = {
      new : [],
      accepted : [],
      ready : [],
      rejected: [],
      completed: []
    };

    this.beepSubscription = timer(0,1000).subscribe(() => {
      if (this.newOrdersList.new.length > 0) {
        this.beep();
      }
    });

    this.newOrdersSubscription = timer(0,this.timeoutInterval).pipe(
      switchMap(() => {
        let data = this.requestData();
        return this.commonService.getAllOrders(data).pipe(
          // retryWhen(err => err.delay(10000))
        );
      })
    )
    .subscribe(
      (response:any) => {
        this.processOrdersData(response.items[0].newOrders);
        this.processOrdersData(response.items[0].readyOrders, 'accepted');
        this.processOrdersData(response.items[0].pickupOrders, 'ready');
      },
      (error) => { //TODO add error
      }
    );

    let reqData = this.requestData();
    // this.prepareOrderSubscription(reqData);
    // this.pickupOrderSubscription(reqData);

    if (localStorage.getItem('allOrders') !== null) {
      this.newOrdersList = JSON.parse(localStorage.getItem('allOrders'));
      this.newOrdersOriginalList = this.newOrdersList;
    } else {
      this.getAllNewOrders();
    }

    // this.commonService.isOnline().subscribe(isOnline => // logic);
    // // get current value
    // this.storage.get('foo');

    // // set new value
    // this.storage.set('foo', 'bar');

    // // watch value changes
    // this.storage.watch('foo').pipe(takeUntil(this.unsubscribe)).subscribe(foo => //logic);
  }

  ngOnDestroy() {
    localStorage.removeItem('excludeFromTimeout');
    this.newOrdersSubscription.unsubscribe();
    this.beepSubscription.unsubscribe();
  }

  internetStatus:string;
  receiveInternetUpdate($event) {
    this.internetStatus = $event
  }

  // for checking DOM events
  @HostListener("document:touchmove", ["$event"])
  @HostListener("document:touchend", ["$event"])
  @HostListener("document:touchstart", ["$event"])
  @HostListener("document:click", ["$event"])
  @HostListener("document:wheel", ["$event"])
  @HostListener("document:MSPointerMove", ["$event"])
  @HostListener("document:DOMMouseScroll", ["$event"])
  @HostListener('document:keyup', ['$event'])
  resetTimer() {
    this.timerservice.notifyUserAction();
  }

  ticker(elapsedTime) {
    const hr = parseInt(elapsedTime.substr(0,2));
    const min = parseInt(elapsedTime.substr(3,2));
    const sec = parseInt(elapsedTime.substr(6,2));
    let hrUpdate = elapsedTime.substr(0,2);
    let minUpdate = elapsedTime.substr(3,2);
    let secUpdate = elapsedTime.substr(6,2);
      if (sec < 59) {
        secUpdate = (sec + 1).toString().padStart(2, '0');
      } else {
        secUpdate = '00';
        if (minUpdate < 59) {
          minUpdate = (min + 1).toString().padStart(2, '0');
        } else {
          minUpdate = '00';
          hrUpdate = (hr + 1).toString().padStart(2, '0');
        }
      }
    return  hrUpdate + ':' + minUpdate + ':' + secUpdate;
  }

  beep(start = false) {
    // let audio = new Audio('assets/sound/beep.mp3');
    // audio.load();
    // audio.play();
    // if(start && !localStorage.beepNewOrders) {
    //   this.beepAudio.play();
    //   localStorage.setItem('beepNewOrders', 'true');
    //   return;
    // }
    // if(start && localStorage.beepNewOrders) {
    //   this.beepAudio.pause();
    //   return;
    // }
    this.beepAudio = new Audio();
    if(start) {
      this.beepAudio.play().then(_ => {
        this.beepLoader = false;
      }).catch(error => {
        console.log(error);
        if(this.beepPromise) {
          this.beepLoader = true;
          this.beep();
          this.beepPromise = false;
        }
      });
      return;
    }
    this.beepAudio.src = 'assets/sound/beep.mp3';
    this.beepAudio.play().then(_ => {
      this.beepLoader = false;
    }).catch(error => {
      if(this.beepPromise) {
        this.beepLoader = true;
        this.beep();
        this.beepPromise = false;
      }
    });
  }

  checkForElapsedTime(elapsedTime, start, end = 59) {
    const hr = parseInt(elapsedTime.substr(0,2));
    const min = parseInt(elapsedTime.substr(3,2));
    const sec = parseInt(elapsedTime.substr(6,2));
    return hr > 0 ? true : (min > 0 ? true : (sec >= start && sec <= end ? true : false ));
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

  processOrdersData(response, tab = 'new') {
    this.currentTimeStamp = new Date();
    this.newOrdersList[tab] = response;
    this.newOrdersList[tab].forEach((order) => {
      if (order.orderTrackingDetails) {
        order.orderTrackingDetails = {
          orderPlaceTime: order.orderTrackingDetails.orderPlaceTime !== null ? order.orderTrackingDetails.orderPlaceTime : '',
          orderAcceptTime: order.orderTrackingDetails.orderAcceptTime !== null ? order.orderTrackingDetails.orderAcceptTime : '',
          orderReadyTime: order.orderTrackingDetails.orderReadyTime !== null ? order.orderTrackingDetails.orderReadyTime : '',
          orderOnTheWayTime: order.orderTrackingDetails.orderOnTheWayTime !== null ? order.orderTrackingDetails.orderOnTheWayTime : '',
          orderCompletedTime: order.orderTrackingDetails.orderCompletedTime !== null ? order.orderTrackingDetails.orderCompletedTime : '',
          timePlaceAccept: '',
          timeAcceptReady: '',
          timeReadyComplete: '',
        }
      } else {
        order.orderTrackingDetails = {
          orderPlaceTime: '',
          orderAcceptTime: '',
          orderReadyTime: '',
          orderOnTheWayTime: '',
          orderCompletedTime: '',
          timePlaceAccept: '',
          timeAcceptReady: '',
          timeReadyComplete: '',
        }
      }

      if (tab === 'accepted') {
        order.orderTrackingDetails.timePlaceAccept = this.getTimeDiff(
          order.orderTrackingDetails.orderPlaceTime, order.orderTrackingDetails.orderAcceptTime
        ); 

      } else if (tab === 'ready') {
        order.orderTrackingDetails.timeAcceptReady = this.getTimeDiff(
          order.orderTrackingDetails.orderAcceptTime, order.orderTrackingDetails.orderReadyTime
        );
      }
    });
    if (tab === 'new') {
      if (this.selectedOrder === undefined || this.selectedOrder.status === '') {
        if (this.newOrdersList.new.length > 0) {
          if(this.noOrderFound == false)
            this.selectedOrderId(this.newOrdersList.new[this.newOrdersList.new.length - 1], tab);
        }
      }
    }
    this.newOrdersOriginalList[tab]= this.newOrdersList[tab];

    localStorage.setItem('allOrders', JSON.stringify(this.newOrdersList));
    let obj = {
      brandId: this.searchBrandId,
      storeId: this.searchStoreId,
      brandList: this.brandList,
      storeList: this.storeList
    }
    localStorage.setItem('allOrdersBrandStore', JSON.stringify(obj));
  }

  searchOrder(orderId) {
    this.noOrderFound = false;
    if(orderId !== '') {
      const newOrder = this.newOrdersOriginalList.new.filter((order)=>{
        return order.txnId == orderId;
      });
      this.isNewPanelOpen = newOrder.length === 1 ? true : false;

      const accepted = this.newOrdersOriginalList.accepted.filter((order)=>{
        return order.txnId == orderId;
      });
      this.isAcceptedPanelOpen = accepted.length === 1 ? true : false;

      const ready = this.newOrdersOriginalList.ready.filter((order)=>{
        return order.txnId == orderId;
      });
      this.isReadyPanelOpen = ready.length === 1 ? true : false;

      const order = newOrder.length === 1 ? newOrder[0] :
        accepted.length === 1 ? accepted[0] :
        ready.length === 1 ? ready[0] : this.highlightedOrder;

      const status = newOrder.length === 1 ? 'new' :
        accepted.length === 1 ? 'accepted' :
        ready.length === 1 ? 'ready' : '';

      if(status != '') {
        console.log(status);
        if(status == 'new'){
          let newData = this.newOrdersList.new
          let index = newData.findIndex(x => x.txnId === orderId);
          this.newOrdersList.new.splice(index, 1);
          this.newOrdersList.new.unshift(newOrder[0])
        }else if(status == 'accepted'){
          let acctedData = this.newOrdersList.accepted
          let index = acctedData.findIndex(x => x.txnId === orderId);
          this.newOrdersList.accepted.splice(index, 1);
          this.newOrdersList.accepted.unshift(accepted[0])
        }else if(status == 'ready'){
          let readyData = this.newOrdersList.ready
          let index = readyData.findIndex(x => x.txnId === orderId);
          this.newOrdersList.ready.splice(index, 1)
          this.newOrdersList.ready.unshift(ready[0]);
        }
        if(this.noOrderFound == false)
          this.selectedOrderId(order,status);
      } else {
        this.noOrderFound = true;
        this.selectedOrderId({},status);
      }
    }
  }

  brandChange(brandId){
    this.searchBrandId = brandId;
  }

  storeChange(storeId){
    this.searchStoreId = storeId;
  }

  getAllBrands() {
    if (localStorage.getItem('allOrdersBrandStore') !== null) {
      const obj = JSON.parse(localStorage.getItem('allOrdersBrandStore'));
      this.searchBrandId = obj.brandId;
      this.searchStoreId = obj.storeId;
      this.brandList = obj.brandList;
      this.storeList = obj.storeList;
    } else {
    let GET_ALL_ONLINE_BRANDS = environment.APIEndpoint + "api/rpa/master/brand/v1/get/brands";
    this.https.getJson(GET_ALL_ONLINE_BRANDS)
      .subscribe((res) => {
        this.brandList = res;
        this.brandList.sort((a, b) => (a.brandName.toLowerCase() > b.brandName.toLowerCase()) ? 1: -1)
        this.brandChange(this.brandList[0].brandId);
        this.getStoresList(this.brandList[0].brandId);
      })
    }
  }

  getStoresList(brandId){
    this.storeloader = true;
    let data = {
      "page": "0",
      "pageSize": "10000",
      "order": {
        "column": "",
        "dir": ""
      },
      "keySearch": "",
      "fieldSearch": [
        {
          "fieldName": "brandOids",
          "fieldValue": brandId
        }
      ]
    }
    this.https.postJson(environment.APIEndpoint + 'api/rpa/store/v1/search', data).subscribe(res => {
      this.storeloader = false;
      this.storeList = res["items"];
      this.storeList.sort((a, b) => (a.storeName.toLowerCase() > b.storeName.toLowerCase()) ? 1: -1)
      if(this.storeList.length > 0) {
        this.storeChange(this.storeList[0].storeOid);
      }
    }, err => {
      this.storeloader = false;
      this.statusLoader = false;
      //TODO add error
    })
  }

  requestData() {
    return {
      "page" : "0",
      "pageSize" : "10000",
      "order": {
          "column": "",
          "dir": ""
      },
      "keySearch": "",
      "fieldSearch" : [
        {
          "fieldName" : "storeOid",
          "fieldValue" : this.searchStoreId ? this.searchStoreId : "0"
        },
      {
          "fieldName" : "brandOid",
          "fieldValue" : this.searchBrandId ? this.searchBrandId : "0"
        }
      ]
    }
  }

  getAllNewOrders(){
    this.statusLoader = true;
    this.newPanel.open();
    this.newOrdersList = {
      new : [],
      accepted : [],
      ready : [],
      rejected: [],
      completed: []
    };
    const data = this.requestData();
    this.commonService.getAllOrders(data).subscribe(
      (response:any) => {
        this.processOrdersData(response.items[0].newOrders);
        this.processOrdersData(response.items[0].readyOrders, 'accepted');
        this.processOrdersData(response.items[0].pickupOrders, 'ready');
        this.statusLoader = false;
      },
      (error) => {
        this.statusLoader = false;
        //TODO add error
      }
    );
  }

  prepareOrderSubscription(data) {
    this.commonService.getPreparingOrders(data).subscribe(
      (response) => {
        this.processOrdersData(response, 'accepted');
      },
      (error) => { //TODO add error
      }
    );
  }

  pickupOrderSubscription(data) {
    this.commonService.getReadyForPickupOrders(data).subscribe(
      (response) => {
        this.processOrdersData(response, 'ready');
        this.emptySelectedOrderDetails();
      },
      (error) => { //TODO add error
      }
    );
  }

  changeOrderStatus(data) {
    this.isNewPanelOpen = false;
    this.isAcceptedPanelOpen = data.newStatus === 'accepted' ? true : false;
    this.isReadyPanelOpen = data.newStatus === 'ready' ? true : false;

    const orderToBeUpdated = this.newOrdersList[data.previousStatus].filter((order) => {
      return order.orderId == data.orderId;
    })[0];

    orderToBeUpdated.orderTrackingDetails = data.order.orderTrackingDetails;
    orderToBeUpdated.invoiceNumber = data.order.invoiceNumber;

    this.newOrdersList[data.newStatus].push(orderToBeUpdated);
    this.newOrdersList[data.previousStatus] = this.newOrdersList[data.previousStatus].filter(
      (order) => order.orderId !== data.orderId
    );

    this.newOrdersOriginalList = this.newOrdersList;
    localStorage.setItem('allOrders', JSON.stringify(this.newOrdersOriginalList));
    if(data.newStatus == "completed" || data.newStatus == "rejected"){
      this.selectedOrderId({},'');
    }
  }

  public selectedOrderId(selectedItem, status) {
    this.highlightedOrder = selectedItem;
    this.selectedOrder = { selectedItem, status };
  }

  openErrorMessageDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = "350px";
    dialogConfig.height = 'auto';
    dialogConfig.autoFocus = false;
    dialogConfig.panelClass = 'error-messages-dialogue';
    const dialogRef = this.dialog.open(ErrorMessagesDialogComponent, dialogConfig);
  }

  emptySelectedOrderDetails(){
    if (this.selectedOrder && this.selectedOrder.selectedItem !== {}) {
      const newOrders = this.newOrdersList['new'].filter((order) => {
        return order.txnId == this.selectedOrder.selectedItem.txnId;
      });
      const acceptedOrders = this.newOrdersList['accepted'].filter((order) => {
        return order.txnId == this.selectedOrder.selectedItem.txnId;
      });
      const readyOrders = this.newOrdersList['ready'].filter((order) => {
        return order.txnId == this.selectedOrder.selectedItem.txnId;
      });
      if (newOrders.length === 0 && acceptedOrders.length === 0 && readyOrders.length === 0) {
        this.selectedOrderId({},'');
      }
    }
  }
}
