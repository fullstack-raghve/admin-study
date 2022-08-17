import { Injectable } from '@angular/core';
import { Subject, Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TimerService {

  _userActionOccured: Subject<void> = new Subject();
  get userActionOccured(): Observable<void> { return this._userActionOccured.asObservable() };

  notifyUserAction() {
    this._userActionOccured.next();
  }

  refreshPage() {
    console.log('time out');
    window.location.reload();
  }
}
