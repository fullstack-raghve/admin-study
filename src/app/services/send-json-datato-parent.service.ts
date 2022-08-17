import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SendJsonDatatoParentService {
  private data: any = new BehaviorSubject("");
  dataJson = this.data.asObservable();
  constructor() { }

  sendDataToParent(data: any){
    this.data.next(data);
  }
}
