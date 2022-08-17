import { Component, HostBinding, Input, Output, EventEmitter } from '@angular/core';
import { NavItem } from './navItem';
import { Router, NavigationEnd } from '@angular/router';
import { NavService } from '../../../services/navService';
import * as access from '../../../constants/menu.constant.left-nav';

@Component({
  selector: 'app-menu-list-item',
  templateUrl: './menu-list-item.component.html',
  styleUrls: ['./menu-list-item.component.scss'],
})
export class MenuListItemComponent {
  expanded: boolean;
  color;
  open = false;

  @HostBinding('attr.aria-expanded') ariaExpanded = this.expanded;
  @Input() item: NavItem;
  @Input() depth: number;
  @Input() navigationArray;
  @Input() isMenuActive: Boolean;
  public selected = false;
  public isSelected = false;
  public navItems: any = access.permissions.data;
  constructor(public navService: NavService, public router: Router) {
    if (this.depth === undefined) {
      this.depth = 0;
    }
  }
  public submenu = false;
  public parentRoute = '';
  @Output() updatedMenu = new EventEmitter();
  @Output() isReports = new EventEmitter<String>();

  ngOnInit(){
    if(localStorage.getItem("menuData") !== null) {
      const menuData = JSON.parse(localStorage.getItem('menuData'));
      this.parentRoute = menuData.parentRoute;
    }
  }

  onItemSelected(item: NavItem) {
    if(item.menuId === 9){
      this.isReports.emit('YES');
    }
    
    let urlPath = this.router.url.substr(1);
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd ) {
        this.parentRoute = '';
        urlPath = event.url.substr(1);
        if(urlPath.includes('/')) {
          urlPath = urlPath.split('/')[0];
        }
        const storedMenuData = JSON.parse(localStorage.getItem('menuData'));
        this.navItems = storedMenuData.navItems;
        for (let navItem of this.navItems) {
          for (let parent of navItem.children) {
            // if(this.parentRoute === '') {
              if( parent.route === urlPath && parent.isMenuYes === false ) {
                this.parentRoute = navItem.children[0].route;
              } else if(parent.children !== [] && parent.children.find( child => child.route === urlPath )) {
                let childIndex = parent.children.findIndex( child => child.route === urlPath);
                if(parent.route !== ''){
                  this.parentRoute = parent.route;
                } else if(parent.route === '' && parent.children[childIndex].isMenuYes === false) {
                  this.parentRoute = parent.children[0].route;
                }
              }
            // }
          }
        }

        const menuData = {
          navItems : this.navItems,
          parentRoute: this.parentRoute
        }
        localStorage.setItem('menuData', JSON.stringify(menuData));
      }
    });
    localStorage.setItem("ActiveNavId", String(item.menuId));
    for (let i of this.navItems) {
      if (i != item && i.checked == true) {
        i.checked = false;
        for (let k of i.children) {
          if (k == item) {
            i.checked = true
          }
          for(let l of k.children){
              if(l==item){
              i.checked = true
              k.checked=true
              }
          }

        }
      }
      if (i.children) {
        for (let j of i.children) {
          if (j != item && j.checked == true) {
            j.checked = false;
            for ( let k of j.children){
              if(k !==item && k.checked==true){
                k.checked =false
              }
              else if(k==item){
                j.checked=true;
              }
            }
          }
        }
      }

    }
    item.checked = !item.checked;

    let count = 0;
    for (let navItem of this.navItems) {
      if(navItem.menuId == item.menuId) {
        this.navItems[count].checked = true;
      }
      count++;
    }
    this.parentRoute = '';
    const menuData = {
      navItems : this.navItems,
      parentRoute: this.parentRoute
    }
    localStorage.setItem('menuData', JSON.stringify(menuData));
    this.updatedMenu.emit(this.navItems);

    if (!item.children || !item.children.length || item.displayName == 'Masters' || !item.isChildDisplayYes) {
      sessionStorage.clear();
      this.router.navigate([item.route]);
      this.navService.closeNav();
    }

    if (item.children && item.children.length && item.displayName != 'Masters') {
      this.expanded = !this.expanded;
      this.navService.openNav();
    }
    // let data = item.route;
    // let key = data.split('-');
    // if(key[0]=='search'){
    //   if(localStorage.getItem('saveIndex')){
    //     window.location.reload()
    //   }
    // }

  }
}
