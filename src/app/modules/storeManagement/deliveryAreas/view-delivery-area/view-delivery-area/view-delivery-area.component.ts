import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { HttpService } from 'src/app/services/http-service';
import { environment } from 'src/environments/environment';
import { SnackBarComponent } from 'src/app/shared/components/snack-bar/snack-bar.component';
import { selectStoreDialog } from 'src/app/shared/components/select-store-dialog/select-store.component';

export interface StoreData {
  storeId: number;
  storeName: string;
  address:string;
}

@Component({
  selector: 'view-delivery-area',
  templateUrl: './view-delivery-area.component.html',
  styleUrls: ['./view-delivery-area.component.scss']
})

export class ViewDeliveryAreaComponent implements OnInit {
  public breadCrumbData: Array<Object> = [{
    title: 'Store Management', 
    link: ''
    }, {
        title: 'Delivery Areas',
        link: ''
    }
    ];
  public statusValue:string = 'ONLINE';
  public checked=false;
  public deliveryAreaOid;
  public deliveryAreaData;
  public alignCss=[];
  public disabled ;

  displayedColumns: string[] = ['storeId', 'storeName','address'];
  dataSource: MatTableDataSource<StoreData>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  languageDirection = [];

    constructor(
      private activatedRoute: ActivatedRoute,
      public dialog: MatDialog,
      private http:HttpService,
      private router:Router,
      public snackBar: MatSnackBar) {
      }

  ngOnInit() {
    let data = localStorage.getItem('DeliveryAreaViewID');
    if(data){
      this.deliveryAreaOid = data;
      this.dataSource = new MatTableDataSource();
      this.dataSource.paginator = this.paginator;
      this.getDeliveryAreaById();
      localStorage.removeItem('DeliveryAreaViewID');
    }else{
      sessionStorage.clear();
      this.router.navigate(['/search-delivery-area']);
    }
  }

  public getDeliveryAreaById(){
    let GET_DELIVERY_AREA_BY_ID = environment.APIEndpoint+"api/rpa/store/deliveryArea/v2/view";
    let request = {
      deliveryAreaOid:this.deliveryAreaOid
    }
    this.http.postJson(GET_DELIVERY_AREA_BY_ID,request)
    .subscribe((response) => {
            this.deliveryAreaData= response;
           for(let c of this.deliveryAreaData.deliveryAreaLocales){
               this.alignCss.push(c.languageDirection == 'RTL' ? 'text-right' : '');
               this.languageDirection.push(c.languageDirection == 'RTL' ? 'direction' : '');
           }
            this.checked = response['status']=='ONLINE'?true:false;
            this.dataSource.data = response['stores'];
        }
        ,err => {
            this.snackBar.openFromComponent(SnackBarComponent, {
                duration: 1500,
                data: {
                    status: "failure",
                    message: "Your request cannot be saved at this time. Please try again later"
                }
            });
        });
    }

  openDialog() {
    const dialogRef = this.dialog.open(selectStoreDialog);
  }

  public toggleStatus(event){
    if(event.checked == true){
        this.statusValue = 'ONLINE';
    }
    else{
         this.statusValue = 'OFFLINE';
    }
}

    MoveToEdit(ID){
      localStorage.setItem('DeliveryAreaEditID',ID);
    this.router.navigate(['/edit-delivery-area'])
    }
}
