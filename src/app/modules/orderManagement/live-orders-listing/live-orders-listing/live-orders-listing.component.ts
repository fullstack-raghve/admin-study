import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTabChangeEvent, MatDialogConfig, MatDialog  } from '@angular/material';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { HttpService } from 'src/app/services/http-service';
import { environment } from 'src/environments/environment';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Router } from '@angular/router';
import { Common } from 'src/app/services/common';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Subscription, timer } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { SelectAutocompleteComponent } from 'mat-select-autocomplete';
import { CommonFunctions } from 'src/app/services/common-functions';
import { ErrorMessagesDialogComponent } from 'src/app/shared/components/orderManagement/error-messages-dialog/error-messages-dialog.component';
export interface LiveOrdersData {
  orderId: string,
  storeName: string,
  noOfItems: number,
  totalAmount: number,
  timeElapsed: string,
  orderType: string,
  assignedTo: string,
  dateTime: string,
  txnReqDate: string,
  status: string
}

@Component({
  selector: 'live-orders-listing',
  templateUrl: './live-orders-listing.component.html',
  styleUrls: ['./live-orders-listing.component.scss']
})
export class LiveOrdersListingComponent implements OnInit {
  public breadCrumbData: Array<Object> = [
    { title: 'Home', link: '' },
    { title: 'Order Management', link: '' }];

  public seearchLiveOrderFormGroup: FormGroup;

  public seletedTabIndex: any = 0;
  public landingTabIndex: any;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) myTicketsPaginator: MatPaginator;
  @ViewChild(MatPaginator) pendingOrderPaginator: MatPaginator;
  @ViewChild(MatPaginator) newOrderPaginator: MatPaginator;
  @ViewChild(MatPaginator) foodPreparingPaginator: MatPaginator;
  @ViewChild(MatPaginator) readyForPickupPaginator: MatPaginator;
  @ViewChild(MatPaginator) onTheWayPaginator: MatPaginator;
  @ViewChild(MatPaginator) rejectedOrdersPaginator: MatPaginator;
  @ViewChild(MatPaginator) deliveryDelayPaginator: MatPaginator;
  @ViewChild(MatPaginator) globalSearchPaginator: MatPaginator;

  @ViewChild('storeInput') storeInput: SelectAutocompleteComponent;
  @ViewChild('brandInput') brandInput: SelectAutocompleteComponent;

  //My Tickets orders
  displayedMyTicketOrdersColumns: string[] = ['txnId', 'storeName', 'noOfItems', 'totalAmount', 'timeElapsed', 'orderType', 'assignedTo', 'dateTime', 'status'];
  dataMyTicketOrderSource: MatTableDataSource<LiveOrdersData>;

  //Pending orders
  displayedPendingOrdersColumns: string[] = ['txnId', 'storeName', 'noOfItems', 'totalAmount', 'timeElapsed', 'orderType', 'dateTime', 'status'];
  dataPendingOrderSource: MatTableDataSource<LiveOrdersData>;

  //New orders
  displayedNewOrdersColumns: string[] = ['txnId', 'storeName', 'noOfItems', 'totalAmount', 'timeElapsed', 'orderType', 'dateTime', 'status'];
  dataNewOrderSource: MatTableDataSource<LiveOrdersData>;

  //Food preparing
  displayedFoodPreparingOrdersColumns: string[] = ['txnId', 'storeName', 'noOfItems', 'totalAmount', 'timeElapsed', 'orderType', 'dateTime', 'status'];
  dataFoodPreparingOrderSource: MatTableDataSource<LiveOrdersData>;

  //Ready For Pickup
  displayedReadyForPickupOrdersColumns: string[] = ['txnId', 'storeName', 'noOfItems', 'totalAmount', 'timeElapsed', 'orderType', 'dateTime', 'status'];
  dataReadyForPickupOrderSource: MatTableDataSource<LiveOrdersData>;

  //On the Way
  displayedOnTheWayOrdersColumns: string[] = ['txnId', 'storeName', 'noOfItems', 'totalAmount', 'timeElapsed', 'orderType', 'dateTime', 'status'];
  dataOnTheWayOrderSource: MatTableDataSource<LiveOrdersData>;

  //Rejected orders
  displayedRejectedOrderColumns: string[] = ['txnId', 'storeName', 'noOfItems', 'totalAmount', 'timeElapsed', 'orderType', 'assignedTo', 'dateTime', 'status'];
  dataRejectedOrderSource: MatTableDataSource<LiveOrdersData>

  //Delievery Delay
  displayedDeliveryDelayOrderColumns: string[] = ['txnId', 'storeName', 'noOfItems', 'totalAmount', 'timeElapsed', 'orderType', 'dateTime', 'status'];
  dataDeliveryDelayOrderSource: MatTableDataSource<LiveOrdersData>;

  public myTicketsCount: number = 0;
  public pendingOrdersCount: number = 0;
  public newOrdersCount: number = 0;
  public foodPreparingOrdersCount: number = 0;
  public readyForPickupOrdersCount: number = 0;
  public onTheWayOrdersCount: number = 0;
  public rejectedOrdersCount: number = 0;
  public deliveryDelayOrdersCount: number = 0;

  public myTicketsLoader: boolean = false;
  public pendingOrderLoader: boolean = false;
  public newOrderLoader: boolean = false;
  public foodPreparingLoader: boolean = false;
  public readyForPickupLoader: boolean = false;
  public onTheWayOrderLoader: boolean = false;
  public rejectedOrderLoader: boolean = false;
  public deliveryDelayOrderLoader: boolean = false;
  public searchGlobalLoader: boolean = false;

  public myTicketBadgeActive: boolean = true;
  public pendingBadgeActive: boolean = false;
  public newOrderBadgeActive: boolean = false;
  public foodPreparingBadgeActive: boolean = false;
  public readyForPickupBadgeActive: boolean = false;
  public onTheWayBadgeActive: boolean = false;
  public rejectedBadgeActive: boolean = false;
  public deliveryDelayBadgeActive: boolean = false;
  activeTabIndex: any = 0;

  public brandsList: any = [];
  public storesList: any = [];
  public selectedBrandOptions: any = [];
  public selectedStoreOptions: any = [];

  public showGlobalSearchSection: boolean = false;
  public globalSearchRecords: boolean = false;
  public globalSearchLength: number;
  public fieldSerachFilter: boolean = true;

  private timeoutInterval: number = 10000;
  public subscriptionMyTickets: Subscription;
  public subscriptionPendingOrders: Subscription;
  public subscriptionNewOrders: Subscription;
  public subscriptionFoodPreparingOrders: Subscription;
  public subscriptionReadyForPickipOrders: Subscription;
  public subscriptionOnThewayOrders: Subscription;
  public subscriptionRejectOrders: Subscription;
  public subscriptionDeliveryDelayOrders: Subscription;

  public paginationData;
  public errorMessagesList:any = [];
  public statusLoader: boolean;
  public menuIds: any = JSON.parse(localStorage.getItem("menuIds"));
  public showNewOrderTab: boolean = false;

  constructor(private https: HttpService, private router: Router, private fb: FormBuilder, public dialog: MatDialog,
    private commonService: Common, private commonFunctions: CommonFunctions) {
    this.dataMyTicketOrderSource = new MatTableDataSource();
    this.dataPendingOrderSource = new MatTableDataSource();
    this.dataNewOrderSource = new MatTableDataSource();
    this.dataFoodPreparingOrderSource = new MatTableDataSource();
    this.dataReadyForPickupOrderSource = new MatTableDataSource();
    this.dataOnTheWayOrderSource = new MatTableDataSource();
    this.dataRejectedOrderSource = new MatTableDataSource();
    this.dataDeliveryDelayOrderSource = new MatTableDataSource();
    console.log(this.menuIds);
    this.menuIds.forEach(element => {
      if(element == 14002002){
        this.showNewOrderTab = true;
        console.log(this.showNewOrderTab);
      }
    });
  }

  ngOnInit() {
    this.paginationData = {
      pageIndex: 0,
      pageSize: 10,
      length: 10,
      previousPageIndex: 0
    };
    this.getAllBrands();
    if (localStorage.getItem('liverOrderTabIndex') != null) {
      this.landingTabIndex = localStorage.getItem('liverOrderTabIndex');
      localStorage.removeItem('liverOrderTabIndex');
    }
    if (this.landingTabIndex != null) {
      this.seletedTabIndex = this.landingTabIndex;
      this.activeTabIndex = this.landingTabIndex;
      this.apiCallBasedOnTabChange(this.activeTabIndex);
    }
    else {
      this.seletedTabIndex = 0;
    }

    // auto refresh every 10 sec for Rejected
    this.subscriptionRejectOrders = timer(5000, this.timeoutInterval).pipe(
      switchMap(() => {
        if(this.activeTabIndex == 0){
        return this.commonService.getLiveOrderListByTabName('rejected');
        }
        return [];
      }),
    )
      .subscribe(
        (response) => {
          if(response != []){
          this.processRejectedOrdersData(response);
          // if (response["liveOrdersDetails"].length > 0) {
          //   this.beep();
          // }
          }
        },
        (error) => { console.error("Error while fetching orders!"); }
      );


    // auto refresh every 10 sec for Get my tickets
    this.subscriptionMyTickets = timer(5000, this.timeoutInterval).pipe(
      switchMap(() => {
        if(this.activeTabIndex == 1){
          return this.commonService.getLiveOrderListByTabName('myTickets');
        }
        return [];
      }),
    )
      .subscribe(
        (response) => {
          if(response != []){
            this.processMyTicketData(response);
          }
        },
        (error) => { console.error("Error while fetching orders!"); }
      );

    // auto refresh every 10 sec for All pending orders
    this.subscriptionPendingOrders = timer(5000, this.timeoutInterval).pipe(
      switchMap(() => {
        if(this.activeTabIndex == 2){
        return this.commonService.getLiveOrderListByTabName('pending');
        }
        return [];
      }),
    )
      .subscribe(
        (response) => {
          if(response != []){
          this.processPendingOrdersData(response);
          }
        },
        (error) => { console.error("Error while fetching orders!"); }
      );

    // auto refresh every 10 sec for New orders
    this.subscriptionNewOrders = timer(5000, this.timeoutInterval).pipe(
      switchMap(() => {
        if(this.activeTabIndex == 3){
        return this.commonService.getLiveOrderListByTabName('new');
        }
        return [];
      }),
    )
      .subscribe(
        (response) => {
          if(response != []){
          this.processNewOrdersData(response);
          }
        },
        (error) => { console.error("Error while fetching orders!"); }
      );

    // auto refresh every 10 sec for Food preparing
    this.subscriptionFoodPreparingOrders = timer(5000, this.timeoutInterval).pipe(
      switchMap(() => {
        if(this.activeTabIndex == 4){
        return this.commonService.getLiveOrderListByTabName('foodPreparing');
        }
        return [];
      }),
    )
      .subscribe(
        (response) => {
          if(response != []){
          this.processFoodPreparingOrdersData(response);
          }
        },
        (error) => { console.error("Error while fetching orders!"); }
      );

    // auto refresh every 10 sec for ready for pick up
    this.subscriptionReadyForPickipOrders = timer(5000, this.timeoutInterval).pipe(
      switchMap(() => {
        if(this.activeTabIndex == 5){
        return this.commonService.getLiveOrderListByTabName('readyForPickup');
        }
        return [];
      }),
    )
      .subscribe(
        (response) => {
          if(response != []){
          this.processReadyForPickupOrdersData(response);
          }
        },
        (error) => { console.error("Error while fetching orders!"); }
      );

    // auto refresh every 10 sec for on the way
    this.subscriptionOnThewayOrders = timer(5000, this.timeoutInterval).pipe(
      switchMap(() => {
        if(this.activeTabIndex == 6){
        return this.commonService.getLiveOrderListByTabName('onTheWay');
        }
        return [];
      }),
    )
      .subscribe(
        (response) => {
          if(response != []){
          this.processOnTheWayOrdersData(response);
          }
        },
        (error) => { console.error("Error while fetching orders!"); }
      );

    // auto refresh every 10 sec for Delivery Delay
    this.subscriptionDeliveryDelayOrders = timer(5000, this.timeoutInterval).pipe(
      switchMap(() => {
        if(this.activeTabIndex == 7){
        return this.commonService.getLiveOrderListByTabName('deliveryDelay');
        }
        return [];
      }),
    )
      .subscribe(
        (response) => {
          if(response != []){
          this.processDeliveryDelayData(response);
          }
        },
        (error) => { console.error("Error while fetching orders!"); }
      );

    this.getAllRejectedOrders();
    // this.getAllMyTicketsOrders();
    // this.getAllPendingOrders();
    // this.getAllNewOrders();
    // this.getAllFoodPreparingOrders();
    // this.getAllReadyForPickupOrders();
    // this.getAllOnTheWayOrders();
    // this.getAllDeliveryDelayOrders();

    this.dataMyTicketOrderSource.sort = this.sort;
    this.dataFoodPreparingOrderSource.sort = this.sort;
    this.dataPendingOrderSource.sort = this.sort;
    this.dataNewOrderSource.sort = this.sort;
    this.dataReadyForPickupOrderSource.sort = this.sort;
    this.dataOnTheWayOrderSource.sort = this.sort;
    this.dataRejectedOrderSource.sort = this.sort;
    this.dataDeliveryDelayOrderSource.sort = this.sort;
  }

  ngOnDestroy() {
    this.subscriptionMyTickets.unsubscribe();
    this.subscriptionPendingOrders.unsubscribe();
    this.subscriptionNewOrders.unsubscribe();
    this.subscriptionFoodPreparingOrders.unsubscribe();
    this.subscriptionReadyForPickipOrders.unsubscribe();
    this.subscriptionOnThewayOrders.unsubscribe();
    this.subscriptionRejectOrders.unsubscribe();
    this.subscriptionDeliveryDelayOrders.unsubscribe();
  }


  onTabChange(tabChangeEvent: MatTabChangeEvent): void {
    this.activeTabIndex = tabChangeEvent.index;
    this.apiCallBasedOnTabChange(this.activeTabIndex);
    this.onTabChangeProcessData(this.activeTabIndex);
  }

  onTabChangeProcessData(tabIndex) {

    if (tabIndex == 0) {
      this.myTicketBadgeActive = false;
      this.pendingBadgeActive = false;
      this.newOrderBadgeActive = false;
      this.foodPreparingBadgeActive = false;
      this.readyForPickupBadgeActive = false;
      this.onTheWayBadgeActive = false;
      this.deliveryDelayBadgeActive = false;
      this.rejectedBadgeActive = !this.rejectedBadgeActive;
      this.dataRejectedOrderSource.paginator = this.rejectedOrdersPaginator;
    } else if (tabIndex == 1) {
      this.myTicketBadgeActive = !this.myTicketBadgeActive;
      this.pendingBadgeActive = false;
      this.newOrderBadgeActive = false;
      this.foodPreparingBadgeActive = false;
      this.readyForPickupBadgeActive = false;
      this.onTheWayBadgeActive = false;
      this.rejectedBadgeActive = false;
      this.deliveryDelayBadgeActive = false;
      this.dataMyTicketOrderSource.paginator = this.myTicketsPaginator;
    } else if (tabIndex == 2) {
      this.myTicketBadgeActive = false;
      this.newOrderBadgeActive = false;
      this.foodPreparingBadgeActive = false;
      this.readyForPickupBadgeActive = false;
      this.onTheWayBadgeActive = false;
      this.rejectedBadgeActive = false;
      this.deliveryDelayBadgeActive = false;
      this.pendingBadgeActive = !this.pendingBadgeActive;
      this.dataPendingOrderSource.paginator = this.pendingOrderPaginator;
    } else if (tabIndex == 3) {
      this.myTicketBadgeActive = false;
      this.pendingBadgeActive = false;
      this.foodPreparingBadgeActive = false;
      this.readyForPickupBadgeActive = false;
      this.onTheWayBadgeActive = false;
      this.rejectedBadgeActive = false;
      this.deliveryDelayBadgeActive = false;
      this.newOrderBadgeActive = !this.newOrderBadgeActive;
      this.dataNewOrderSource.paginator = this.newOrderPaginator;
    } else if (tabIndex == 4) {
      this.myTicketBadgeActive = false;
      this.pendingBadgeActive = false;
      this.newOrderBadgeActive = false;
      this.readyForPickupBadgeActive = false;
      this.onTheWayBadgeActive = false;
      this.rejectedBadgeActive = false;
      this.deliveryDelayBadgeActive = false;
      this.foodPreparingBadgeActive = !this.foodPreparingBadgeActive;
      this.dataFoodPreparingOrderSource.paginator = this.foodPreparingPaginator;
    } else if (tabIndex == 5) {
      this.myTicketBadgeActive = false;
      this.pendingBadgeActive = false;
      this.newOrderBadgeActive = false;
      this.foodPreparingBadgeActive = false;
      this.onTheWayBadgeActive = false;
      this.rejectedBadgeActive = false;
      this.deliveryDelayBadgeActive = false;
      this.readyForPickupBadgeActive = !this.readyForPickupBadgeActive;
      this.dataReadyForPickupOrderSource.paginator = this.readyForPickupPaginator;
    } else if (tabIndex == 6) {
      this.myTicketBadgeActive = false;
      this.pendingBadgeActive = false;
      this.newOrderBadgeActive = false;
      this.foodPreparingBadgeActive = false;
      this.readyForPickupBadgeActive = false;
      this.rejectedBadgeActive = false;
      this.deliveryDelayBadgeActive = false;
      this.onTheWayBadgeActive = !this.onTheWayBadgeActive;
      this.dataOnTheWayOrderSource.paginator = this.onTheWayPaginator;
    } else if (tabIndex == 7) {
      this.myTicketBadgeActive = false;
      this.pendingBadgeActive = false;
      this.newOrderBadgeActive = false;
      this.foodPreparingBadgeActive = false;
      this.readyForPickupBadgeActive = false;
      this.onTheWayBadgeActive = false;
      this.rejectedBadgeActive = false;
      this.deliveryDelayBadgeActive = !this.deliveryDelayBadgeActive;
      this.dataDeliveryDelayOrderSource.paginator = this.deliveryDelayPaginator;
    }
  }

  apiCallBasedOnTabChange(activeTab){
    if(activeTab == 0){
      this.getAllRejectedOrders();
    }else if(activeTab == 1){
      this.getAllMyTicketsOrders();
    }else if(activeTab == 2){
      this.getAllPendingOrders();
    }else if(activeTab == 3){
      this.getAllNewOrders();
    }else if(activeTab == 4){
      this.getAllFoodPreparingOrders();
    }else if(activeTab == 5){
      this.getAllReadyForPickupOrders();
    }else if(activeTab == 6){
      this.getAllOnTheWayOrders();
    }else if(activeTab == 7){
      this.getAllDeliveryDelayOrders();
    }
  }

  getAllBrands() {
    const GET_ALL_BRANDS = environment.APIEndpoint + 'api/rpa/order/v1/brandListing';
    this.https.getJson(GET_ALL_BRANDS).subscribe((brands) => {
      brands.forEach(res => {
        this.brandsList.push({
          'brandOid': res.brandOid,
          'brandName': res.brandName,
          'value': res.brandOid,
        });
      }, (error) => {
        console.log(error);
      });
    })
  }

  getAllStores(brandIds) {
    this.selectedStoreOptions = [];
    this.storeInput.selectAllChecked = false;
    if (brandIds != '' && brandIds != undefined) {
      const GET_ALL_STORES = environment.APIEndpoint + 'api/rpa/order/v1/storeListing';
      let request = {
        "brandId": brandIds.toString()
      }
      this.https.postJson(GET_ALL_STORES, request).subscribe((stores) => {
        this.storesList = [];
        stores.forEach(res => {
          this.storesList.push({
            'storeId': res.storeId,
            'storeName': res.storeName,
            'value': res.storeId,
          });
        });
        var uniqueArray = this.removeDuplicatesJSON(this.storesList, 'storeId');
        this.storesList = uniqueArray;
      }, (error) => {
        console.log(error);
      })
    }
  }

  removeDuplicatesJSON(originalArray, prop) {
    var newArray = [];
    var lookupObject = {};
    for (var i in originalArray) {
      lookupObject[originalArray[i][prop]] = originalArray[i];
    }
    for (i in lookupObject) {
      newArray.push(lookupObject[i]);
    }
    return newArray;
  }

  getAllMyTicketsOrders() {
    this.myTicketsLoader = true;
    this.commonService.getLiveOrderListByTabName('myTickets').subscribe(
      (response) => {
        this.myTicketsLoader = false;
        this.processMyTicketData(response);
      }, (err) => {
        this.myTicketsLoader = false;
        console.log(err);
      });
  }

  processMyTicketData(response) {
    this.getAllBadgesCount(response);
    if (response["liveOrdersDetails"] != null && response["liveOrdersDetails"] != []) {
      this.dataMyTicketOrderSource = new MatTableDataSource(response["liveOrdersDetails"]);
      this.dataMyTicketOrderSource.sort = this.sort;
      this.onTabChangeProcessData(this.activeTabIndex);
    } else if(response["liveOrdersDetails"] == null){
      this.dataMyTicketOrderSource = new MatTableDataSource([]);
    }
  }

  getAllPendingOrders() {
    this.pendingOrderLoader = true;
    this.commonService.getLiveOrderListByTabName('pending').subscribe(
      (response) => {
        this.pendingOrderLoader = false;
        this.processPendingOrdersData(response);
      }, err => {
        this.pendingOrderLoader = false;
        console.log(err);
      });
  }

  processPendingOrdersData(response) {
    this.getAllBadgesCount(response);
    if (response["liveOrdersDetails"] != null && response["liveOrdersDetails"] != []) {
      this.dataPendingOrderSource = new MatTableDataSource(response["liveOrdersDetails"])
      this.dataPendingOrderSource.sort = this.sort;
      this.onTabChangeProcessData(this.activeTabIndex);
    } else if(response["liveOrdersDetails"] == null){
      this.dataPendingOrderSource = new MatTableDataSource([]);
    }
  }

  getAllNewOrders() {
    this.newOrderLoader = true;
    this.commonService.getLiveOrderListByTabName('new').subscribe(
      (response) => {
        this.newOrderLoader = false;
        this.processNewOrdersData(response);
      }, err => {
        this.newOrderLoader = false;
        console.log(err);
      });
  }

  processNewOrdersData(response) {
    this.getAllBadgesCount(response);
    if (response["liveOrdersDetails"] != null && response["liveOrdersDetails"] != []) {
      this.dataNewOrderSource = new MatTableDataSource(response["liveOrdersDetails"]);
      this.dataNewOrderSource.sort = this.sort;
      this.onTabChangeProcessData(this.activeTabIndex);
    } else if(response["liveOrdersDetails"] == null){
      this.dataNewOrderSource = new MatTableDataSource([]);
    }
  }

  getAllFoodPreparingOrders() {
    this.foodPreparingLoader = true;
    this.commonService.getLiveOrderListByTabName('foodPreparing').subscribe(
      (response) => {
        this.foodPreparingLoader = false;
        this.processFoodPreparingOrdersData(response);
      }, err => {
        this.foodPreparingLoader = false;
        console.log(err);
      });
  }

  processFoodPreparingOrdersData(response) {
    this.getAllBadgesCount(response);
    if (response["liveOrdersDetails"] != null && response["liveOrdersDetails"] != []) {
      this.dataFoodPreparingOrderSource = new MatTableDataSource(response["liveOrdersDetails"])
      this.dataFoodPreparingOrderSource.sort = this.sort;
      this.onTabChangeProcessData(this.activeTabIndex);
    }else if(response["liveOrdersDetails"] == null){
      this.dataFoodPreparingOrderSource = new MatTableDataSource([]);
    }
  }

  getAllReadyForPickupOrders() {
    this.readyForPickupLoader = true;
    this.commonService.getLiveOrderListByTabName('readyForPickup').subscribe(
      (response) => {
        this.readyForPickupLoader = false;
        this.processReadyForPickupOrdersData(response);
      }, err => {
        this.readyForPickupLoader = false;
        console.log(err);
      });
  }

  processReadyForPickupOrdersData(response) {
    this.getAllBadgesCount(response);
    if (response["liveOrdersDetails"] != null && response["liveOrdersDetails"] != []) {
      this.dataReadyForPickupOrderSource = new MatTableDataSource(response["liveOrdersDetails"])
      this.dataReadyForPickupOrderSource.sort = this.sort;
      this.onTabChangeProcessData(this.activeTabIndex);
    } else if(response["liveOrdersDetails"] == null){
      this.dataReadyForPickupOrderSource = new MatTableDataSource([]);
    }
  }

  getAllOnTheWayOrders() {
    this.onTheWayOrderLoader = true;
    this.commonService.getLiveOrderListByTabName('onTheWay').subscribe(
      (response) => {
        this.onTheWayOrderLoader = false;
        this.processOnTheWayOrdersData(response);
      }, err => {
        this.onTheWayOrderLoader = false;
        console.log(err);
      });
  }

  processOnTheWayOrdersData(response) {
    this.getAllBadgesCount(response);
    if (response["liveOrdersDetails"] != null && response["liveOrdersDetails"] != []) {
      this.dataOnTheWayOrderSource = new MatTableDataSource(response["liveOrdersDetails"])
      this.dataOnTheWayOrderSource.sort = this.sort;
      this.onTabChangeProcessData(this.activeTabIndex);
    } else if(response["liveOrdersDetails"] == null){
      this.dataOnTheWayOrderSource = new MatTableDataSource([]);
    }
  }

  getAllRejectedOrders() {
    this.rejectedOrderLoader = true;
    this.commonService.getLiveOrderListByTabName('rejected').subscribe(
      (response) => {
        this.rejectedOrderLoader = false;
        this.processRejectedOrdersData(response);
      }, err => {
        this.rejectedOrderLoader = false;
        console.log(err);
      });
  }

  processRejectedOrdersData(response) {
    this.getAllBadgesCount(response);
    if (response["liveOrdersDetails"] != null && response["liveOrdersDetails"] != []) {
      this.dataRejectedOrderSource = new MatTableDataSource(response["liveOrdersDetails"])
      this.dataRejectedOrderSource.sort = this.sort;
      this.onTabChangeProcessData(this.activeTabIndex);
    } else if(response["liveOrdersDetails"] == null){
      this.dataRejectedOrderSource = new MatTableDataSource([]);
    }
  }

  getAllDeliveryDelayOrders() {
    this.deliveryDelayOrderLoader = true;
    this.commonService.getLiveOrderListByTabName('deliveryDelay').subscribe(
      (response) => {
        this.deliveryDelayOrderLoader = false;
        this.processDeliveryDelayData(response);
      }, err => {
        this.deliveryDelayOrderLoader = false;
        console.log(err);
      });
  }

  processDeliveryDelayData(response) {
    this.getAllBadgesCount(response);
    if (response["liveOrdersDetails"] != null && response["liveOrdersDetails"] != []) {
      this.dataDeliveryDelayOrderSource = new MatTableDataSource(response["liveOrdersDetails"]);
      this.dataDeliveryDelayOrderSource.sort = this.sort;
      this.onTabChangeProcessData(this.activeTabIndex);
    } else if(response["liveOrdersDetails"] == null){
      this.dataDeliveryDelayOrderSource = new MatTableDataSource([]);
    }
  }

  getAllBadgesCount(response) {
    this.myTicketsCount = response.myTicketsCount;
    this.pendingOrdersCount = response.allPendingOrdersCount;
    this.newOrdersCount = response.newOrderCount;
    this.foodPreparingOrdersCount = response.foodPreparingCount;
    this.readyForPickupOrdersCount = response.readyForPickupCount;
    this.onTheWayOrdersCount = response.onThewayOrderCount;
    this.rejectedOrdersCount = response.rejectedOrderCount;
    this.deliveryDelayOrdersCount = response.deliveryDelayCount;
    // if(this.rejectedOrdersCount > 0){
    //   this.beep();
    // }
  }

  viewLiveOrder(ID) {
    localStorage.setItem('currentTabIndex', this.activeTabIndex);
    localStorage.setItem('viewLiveOrderId', ID);
    this.router.navigate(['/view-order-details']);
  }
  viewMyTicketsOrder(ID) {
    localStorage.setItem('assignTo', 'true');
    localStorage.setItem('viewLiveOrderId', ID);
    this.router.navigate(['/view-order-details']);
  }



  viewRejectOrder(ID) {
    this.statusLoader = true;
    const ASSIGN_TO = environment.APIEndpoint + 'api/rpa/order/v2/updateOrderAssignStatus';
    let request = {
      "userOid": localStorage.getItem('userId'),
      "transactionOid": ID,
      "assignOrderStatus": "CLOSE"
    }
    this.https.postJson(ASSIGN_TO, request).subscribe((response) => {
      this.assignOrder(ID);
    }, (err) => {
      this.statusLoader = false;
      this.router.navigate(['/live-orders-listing']);
    })
  }

  assignOrder(ID) {
    this.statusLoader = true;
    const ASSIGN_TO = environment.APIEndpoint + 'api/rpa/order/v1/assignOrder/create';
    let request = {
      "userOid": localStorage.getItem('userId'),
      "transactionOid": ID,
      "assignOrderStatus": "OPEN"
    }
    this.https.postJson(ASSIGN_TO, request).subscribe((response) => {
      this.statusLoader = false;
      localStorage.setItem('currentTabIndex', this.activeTabIndex);
      localStorage.setItem('showAssigne', 'true');
      localStorage.setItem('viewLiveOrderId', ID);
      this.router.navigate(['/view-order-details']);
    }, error => {
      this.statusLoader = false;
      this.commonFunctions.displayErrorMessage(error, 1000);
    })
    localStorage.setItem('liverOrderTabIndex', '0');
    // this.rejectedBadgeActive = true;
    // this.myTicketBadgeActive = false;
  }
  showFilteredTable() {
    this.router.navigate(['live-orders-global-search']);
  }
  beep() {
    const beepAudio = new Audio();
    beepAudio.src = 'assets/sound/beep.mp3';
    beepAudio.play();
  }

  openErrorMessageDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = "350px";
    dialogConfig.height = 'auto';
    dialogConfig.autoFocus = false;
    dialogConfig.panelClass = 'error-messages-dialogue';
    const dialogRef = this.dialog.open(ErrorMessagesDialogComponent, dialogConfig);
  }

}
