import {EventEmitter, Injectable} from '@angular/core';

@Injectable(
    { providedIn:  'root'}
)
export class NavService {
  public appDrawer: any;

  constructor() {
   
  }


  callNavServiceToggle(){
    if(this.appDrawer._animationState=='void'){
      this.appDrawer.open();
    }
    else if (this.appDrawer._animationState=='open'){
      this.appDrawer.open();
    }
  }
  public closeNav() {
    this.appDrawer.open();
  }

  public openNav() {
    this.appDrawer.open();
  }
}
