import { Injectable} from '@angular/core';
import { Observable, Observer, fromEvent, merge } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpService } from 'src/app/services/http-service';
import { environment } from 'src/environments/environment';

@Injectable(
    { providedIn:  'root'}
)
export class Common {
  private api = environment.APIEndpoint;
  private ewalletApi = environment.EwalletEndpoint;

  constructor(private https: HttpService) {}

  isOnline() {
    return merge<boolean>(
      fromEvent(window, 'offline').pipe(map(() => false)),
      fromEvent(window, 'online').pipe(map(() => true)),
      new Observable((sub: Observer<boolean>) => {
        sub.next(navigator.onLine);
        sub.complete();
      }));
  }

  changeOrderStatus(data) {
    let body = JSON.stringify(data);
    return this.https.postJson(this.api + 'api/rpa/order/v2/updateOrderStatus', body);
  }

  getNewOrders(data) {
    let body = JSON.stringify(data);
    return this.https.postJson(this.api + 'api/rpa/order/v4/newOrder/search', body);
  }

  getPreparingOrders(data) {
    return this.https.postJson(this.api + 'api/rpa/order/v3/preparingOrder/search', JSON.stringify(data));
  }

  getReadyForPickupOrders(data) {
    return this.https.postJson(this.api + 'api/rpa/order/v3/pickedOrder/search', JSON.stringify(data));
  }

  // Live orders listing
  getLiveOrderListByTabName(tabName){
    return this.https.getJson(this.api + 'api/rpa/order/v2/liveOrders' + '?tab=' + tabName);
  }

  getAllErrorMeaasges(){
    return this.https.getJson(this.api + 'api/rpa/order/v1/pickupErrors/get?currentDay=false');
  }

  getAllOrders(data) {
    let body = JSON.stringify(data);
    return this.https.postJson(this.api + 'api/rpa/order/v4/newOrder/search', body);
  }

  // menu management
  getDefaultStoresData(){
    return this.https.getJson(this.api + 'api/rpa/menu/defaultStores/v1/view');
  }

  updateRegionStore(data){
    let body = JSON.stringify(data);
    return this.https.postJson(this.api + 'api/rpa/menu/defaultStores/v1/create', body);
  }
  getStoreList(data){
    let body = JSON.stringify(data);
    return this.https.postJson(this.api + 'api/rpa/store/v2/getAll', body);
  }
 // E wallet 
 getAllEwallets(data) {
  let body = JSON.stringify(data);
  return this.https.postJson(this.ewalletApi  + 'api/rpa/ewallet/getWalletDetails', body);
}

createEwallet(data) {
  let body = JSON.stringify(data);
  return this.https.postJson(this.ewalletApi + 'api/rpa/ewallet/v1/create', body);
}

updateEwallet(data) {
  let body = JSON.stringify(data);
  return this.https.postJson(this.ewalletApi  + 'api/rpa/ewallet/v1/update', body);
}

getCategoriesForCoupon(data) {
  let body = JSON.stringify(data);
  return this.https.postJson(this.api + 'api/rpa/productcategory/v1/searchCategory', body);
}

}