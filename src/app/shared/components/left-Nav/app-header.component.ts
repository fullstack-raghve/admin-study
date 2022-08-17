import {
  ChangeDetectorRef,
  Component,
  Output,
  ViewChild,
  ElementRef,
  AfterViewInit,
  EventEmitter
  } from '@angular/core';
import { HttpService } from '../../../services/http-service';
import {NavService} from '../../../services/navService';
import {VERSION} from '@angular/material';
import {MenuListItemComponent} from '../menu-list-item/menu-list-item.component';
import { environment } from 'src/environments/environment';
import * as access from '../../../constants/menu.constant';
import { Router,RoutesRecognized} from '@angular/router';
import { filter, pairwise } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  templateUrl: './app-header.component.html',
  styleUrls: ['./app-header.component.scss']
})


export class AppHeaderComponent implements AfterViewInit {
  public scrollbarOptions = { axis: 'y', theme: 'light' };
  @ViewChild('appDrawer') appDrawer: ElementRef;
  @ViewChild('ToggleNav') ToggleNav: MenuListItemComponent;
  @Output() valueChangeNav = new EventEmitter();
  version = VERSION;
  isMenuActive = false;
  isReportMenu:string;

  public navigationArray;
   navItems= access.permissions.data;
   constructor(
    private navService: NavService,
    private cdRef: ChangeDetectorRef,
    private http:HttpService,
    public router: Router
  ) {
  }

  toggle() {
    this.isMenuActive = !this.isMenuActive;
    this.valueChangeNav.emit(this.isMenuActive);
    this.navService.callNavServiceToggle();
  }

  ngAfterViewInit() {
    this.getNavigationArray();
    this.navService.appDrawer = this.appDrawer;
    this.navService.openNav();
    this.cdRef.detectChanges();
    this.getAllLanguage();

    this.router.events
      .pipe(filter((e: any) => e instanceof RoutesRecognized),
          pairwise()
      ).subscribe((e: any) => {
        localStorage.setItem('previousUrl', e[0].urlAfterRedirects);// previous url
      });
  }

  ngOnInit() {
    if(localStorage.getItem("menuData") === null) {
      for (let navItem of this.navItems) {
        navItem.checked = false;
      }
      this.navItems[0].checked = true;
    } 
    else {
      const menuData = JSON.parse(localStorage.getItem('menuData'));
      this.navItems = menuData.navItems;
    }
  }

  public getNavigationArray(){
      let req=[];
      let NAVIGATION = environment.APIEndpoint+"api/rpa/user/menu/list";
      this.http.postJson(NAVIGATION,req)
      .subscribe((response) => {
          this.navigationArray=response["menuIds"];
              localStorage.setItem("navigationArray",response["menuIds"].sort());
              localStorage.setItem("menuIds", JSON.stringify(response["menuIds"]));
              localStorage.setItem("imgBaseUrl",response["imgBaseUrl"]);
              localStorage.setItem("fileBaseUrl",response["fileBaseUrl"]);
              localStorage.setItem("fullName" , response["fullName"]);
              this.navService.appDrawer = this.appDrawer;
              this.navService.openNav();
              this.cdRef.detectChanges();
          });
  }

  getAllLanguage(){
      let GET_LANGUAGE_LIST = environment.APIEndpoint+"api/rpa/master/language/v1/list";
      this.http.getJson(GET_LANGUAGE_LIST)
      .subscribe((response)=>{
          let languageList=response;
          localStorage.setItem("languageList", JSON.stringify(languageList));
      } , err=>{
        if(err.status==0){
          this.getAllLanguage();
          this.getNavigationArray();
        }
      });
  }

  reportsToggle() {
    this.isMenuActive = !this.isMenuActive;
    this.valueChangeNav.emit(this.isMenuActive);
    this.navService.callNavServiceToggle();
  }

  getIsReportValue(value){
    this.isReportMenu = value;
    if(this.isReportMenu == 'YES'){
      this.reportsToggle();
    }
  }
}
