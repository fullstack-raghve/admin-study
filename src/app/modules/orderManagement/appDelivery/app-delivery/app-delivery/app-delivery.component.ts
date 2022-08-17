import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { HttpService } from 'src/app/services/http-service';
import { SnackBarComponent } from 'src/app/shared/components/snack-bar/snack-bar.component';
import { MatDialogConfig, MatDialog, MatSnackBar } from '@angular/material';
import { FormControl, Validators, FormBuilder, FormGroup, FormArray, NgForm } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { GlobalPopupComponent } from '../../global-popup/global-popup.component';
// import { GlobalPopupComponent } from '../global-popup/global-popup.component';

export interface Fruit {
  name: string;
}
@Component({
  selector: 'app-app-delivery',
  templateUrl: './app-delivery.component.html',
  styleUrls: ['./app-delivery.component.scss']
})
export class AppDeliveryComponent implements OnInit {
  public breadCrumbData: Array<Object> = [{
    title: 'Home',
    link: ''
  }, {
    title: 'Order Management',
    link: ''
  }
  ];
  checkData=false ;

  constructor(private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private https: HttpService,
    public snackBar: MatSnackBar,
    private router: Router,public dialog: MatDialog ) {
  }

  ngOnInit() {
  this.getData();
 
  }
  getData(){
    this.https.postJson(environment.APIEndpoint + 'api/rpa/order/v1/view/GlobalDelivery',''
    ).subscribe(
      (res) => {
        console.log(res);
        this.checkData = res['isGlobalDelivery']
        
      });
  }
  toggle(value){
    this.checkData=value.checked;
  }
  openDialog(){
    const dialogConfig = new MatDialogConfig();
    // dialogConfig.panelClass = 'global-dialogue'
    // dialogConfig.width = '300px';
    dialogConfig.panelClass = 'global-dialogue';
    const dialogRef = this.dialog.open(GlobalPopupComponent, {panelClass: 'global-dialogue'});

    // dialogConfig.width = '300px';
    // dialogConfig.panelClass = 'editFlowPage'
    // const dialogConfig = new MatDialogConfig();
    // dialogConfig.autoFocus = false;
    // const dialogRef = this.dialog.open(SkuDialogComponent, {panelClass: 'panelClass'}
    // ); 
    dialogRef.componentInstance.checkData = this.checkData;
    dialogRef.afterClosed().subscribe(result => {
        // if(result == 'Proceed'){    
        //     this.updateStoreInfo(true)
        // }
       
       
    })
}

}