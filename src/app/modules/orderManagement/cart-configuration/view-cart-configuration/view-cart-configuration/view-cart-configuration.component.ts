import { OnInit, ViewChild, Output, Input, Component, EventEmitter, AfterViewInit } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder, FormGroupDirective, FormArray, NgForm } from '@angular/forms';
import { MatPaginator, MatSort, MatTableDataSource, MatTabsModule, MatSnackBar } from '@angular/material';
import { MatDialogModule } from '@angular/material/dialog';
import { SelectionModel } from '@angular/cdk/collections';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { addBeaconsDialog } from '../../../../../shared/components/add-beacons-dialog/add-beacons.component';
import { storeStaffDialog } from '../../../../../shared/components/store-staff-dialog/storestaff.component';
import { environment } from 'src/environments/environment';
import { HttpService } from 'src/app/services/http-service';
import { Router, ActivatedRoute } from '@angular/router';
import { SnackBarComponent } from 'src/app/shared/components/snack-bar/snack-bar.component';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
@Component({
  selector: 'app-view-cart-configuration',
  templateUrl: './view-cart-configuration.component.html',
  styleUrls: ['./view-cart-configuration.component.scss']
})
export class ViewCartConfigurationComponent implements OnInit {
  public breadCrumbData: Array<Object> = [
    { title: 'Home', link: '' },
    { title: 'Order Management', link: '' },
  ];
  public cartViewID;
  keywordArray=[20,30,40,50];
  ViewData;
  public alignCss = [];
  checked=false;
  // ViewDataList=[1,2]
  public filePathUrl = localStorage.getItem("imgBaseUrl");
  constructor(private router:Router,private http:HttpService) { }

  ngOnInit() {
    let data= localStorage.getItem('cartViewID');
    if(data){
      this.cartViewID = data;
      // this.dataSource = new MatTableDataSource();
      // this.dataSource.paginator = this.paginator;
      this.getViewData();
      localStorage.removeItem('cartViewID');
    }else{
      sessionStorage.clear();
      this.router.navigate(['/search-cart-configuration']);
    }
  }
  checkInstruction= false;
  checkTips=false;
  CountryList;
  getViewData(){
    let GET_DELIVERY_AREA_BY_ID = environment.APIEndpoint+"api/rpa/cartConfig/v1/view";
    let request = {
      oid:this.cartViewID
    }
    this.http.postJson(GET_DELIVERY_AREA_BY_ID,request)
    .subscribe((response) => {
            console.log(response);
            this.ViewData = response;
            this.CountryList = this.ViewData['countryList']
            this.checked = response['status']=='ONLINE'?true:false;
            if(this.ViewData['insDetailsViewBeans'].length >0){
              this.checkInstruction = true;
            }
            if(this.ViewData['tipDonationViewBean'].length >0){
              this.checkTips= true;
            }
            
    });
  }
  EditCart(){
    localStorage.setItem('cartEditID', this.cartViewID);
    this.router.navigate(['/edit-cart-configuration'])
  }
}
