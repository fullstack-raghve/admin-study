import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { HttpService } from 'src/app/services/http-service';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
export interface UserData {
  storeId: number;
  storeName: string;
  address: string;

}

@Component({
  selector: 'view-calendar',
  templateUrl: './view-calendar.component.html',
  styleUrls: ['./view-calendar.component.scss']
})
export class ViewCalendarComponent implements OnInit {
  public breadCrumbData: Array<Object> = [{
    title: 'Store Management',
    link: ''
    }, {
        title: 'Calendar',
        link: ''
    }
    ];
  public statusValue:string = 'ONLINE';
  public imgUpload = false;
  public checked = true;
  public disabled = true;
  public selectCalendarType = 'Set Business Hours';
  public holidayType:boolean ;
  containers = [];
  public id;
  public calendarData:any;
  public toggleVal:any;
  public businessHours=[];
  public deliveryHours=[];
  public resultsLength = 0;

  displayedColumns: string[] = ['storeId', 'storeName', 'address'];
  dataSource: MatTableDataSource<UserData>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  constructor(private router: Router,private https: HttpService) {
    this.dataSource = new MatTableDataSource();
  }

  limit:number = 10;
  skip:number = 0;
  totalLength:number = 0;
  pageIndex : number = 0;
  pageLimit:number[] = [10,20,50,100] ; 

  add() {
    this.containers.push(this.containers.length);
  }
  ngOnInit() {
    let data=localStorage.getItem('CalendarViewID');
    if(data){
      this.id = data;
      this.getCaledarById();
      localStorage.removeItem('CalendarViewID')
     
    }else{
      sessionStorage.clear();
      this.router.navigate(['/search-calendar'])

    }
    
  }

  public getCaledarById(){
    // this.id = this.router.url.split('view-calendar/')[1];
    let data = {
      "calendarOid": this.id
    }
    this.https.postJson(environment.APIEndpoint + 'api/rpa/calendar/v1/view', data).subscribe(res => {
      this.calendarData = res;
      this.businessHours = res["businessHours"];
      this.deliveryHours = res["deliveryHours"];
      this.toggleVal = res["status"] == "ONLINE" ? true : false;
      this.dataSource.data = res["stores"];
      this.resultsLength = res["selectedStoreCount"];
      this.totalLength=res["selectedStoreCount"];
      this.dataSource = new MatTableDataSource(res["stores"]);
      this.dataSource.sort = this.sort;
     }, err => {
       console.log(err);
     })
  }


  changePage(event){
    console.log('event',event)
    if(event.pageSize !== this.limit){
          this.limit = event.pageSize;
          this.skip = event.pageSize * event.pageIndex;
    }else{
   if(this.totalLength > this.dataSource.data.length){
        //if(this.pageIndex < event.pageIndex){
          // next page
          this.skip = event.pageSize * event.pageIndex;
        // }
      }
    }
    
    
  }
  MoveToEdit(ID){
    localStorage.setItem('CalendarEditID',ID);
    this.router.navigate(['/edit-calendar'])
  }
  
  
}
