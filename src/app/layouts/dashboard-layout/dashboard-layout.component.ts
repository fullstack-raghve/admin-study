import { Component, OnInit } from '@angular/core';

// import { LeftSidebarComponent } from './components/left-sidebar/leftSidebar.component';
 import { TopNavComponent } from '../../shared/components/top-Nav/top-Nav.component';

@Component({
  selector: 'app-dashboard-layout',
  templateUrl: './dashboard-layout.component.html',
  styleUrls: ['./dashboard-layout.component.scss']
})
export class DashboardLayoutComponent implements OnInit {


public isMenuActive;
  constructor() { }

  ngOnInit() { }


 toggleChange($event){
    this.isMenuActive=$event;
 }
}
