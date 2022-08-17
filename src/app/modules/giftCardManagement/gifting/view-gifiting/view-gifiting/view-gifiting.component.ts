import { Component, OnInit ,ViewChild} from '@angular/core';
import { FormControl, Validators, FormBuilder, FormGroup, NgForm, FormGroupDirective, FormArray } from '@angular/forms';
import { HttpService } from 'src/app/services/http-service';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { SnackBarComponent } from '../../../../../../../src/app/shared/components/snack-bar/snack-bar.component';
import { ViewGiftingTncDialogComponent } from '../view-gifting-tnc-dialog/view-gifting-tnc-dialog.component';
import { TermConditionDialogComponent } from '../../term-condition-dialog/term-condition-dialog.component';
import {MatTableModule} from '@angular/material/table';
import * as moment from "moment";
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog, MatSnackBar, MatTableDataSource, MatPaginator, MatSort,MatDialogConfig } from '@angular/material';
export interface UserData {
  ID_VAL: string;
  USER_NAME: string;
  EMAIL: string;
  MOBILE_NUMBER: number;
  corporateName: string;
}
const RECIPIENT_DATA: UserData[] = []

@Component({
  selector: 'app-view-gifiting',
  templateUrl: './view-gifiting.component.html',
  styleUrls: ['./view-gifiting.component.scss']
})
export class ViewGifitingComponent implements OnInit {
  public viewData=[]
  viewGiftingId;
  logoDetails;
  viewGiftingData:any=[]
  tnc=[]
  RECIPIENT_DATA: UserData[] = [];
  futureDate:boolean=false;
  displayedColumns: string[] = ['empId', 'USER_NAME','EMAIL', 'MOBILE_NUMBER', 'CORPORATE_NAME'];
  dataSource 
  public presentDate = new Date();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  public breadCrumbData: Array<Object> = [{
    title: 'Home',
    link: ''
  },
  {
    title: 'Gift Cards Management',
    link: ''
  },
  {
    title: 'Giftings',
    link: '/search-gifting'
  }
  ];
  templateId: any;
  
  constructor( public dialog: MatDialog ,private https: HttpService,public snackBar: MatSnackBar, private activatedRoute: ActivatedRoute, ) {
    this.activatedRoute.params.subscribe((params) => {
      this.viewGiftingId = params['id'];
      console.log(this.viewGiftingId);

    });
   }

  ngOnInit() {
    this.getViewData();
    console.log(this.presentDate);
    
  }

  

  termCondition() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = false;

    const dialogRef = this.dialog.open(TermConditionDialogComponent,
      dialogConfig
    ); dialogRef.componentInstance.TNCData = this.tnc;
 
    dialogRef.afterClosed().subscribe(result => {
      // console.log(JSON.stringify(result));



    });
  }
  
getViewData(){
  let data={
     "languageCode": "en",
     "giftingId": this.viewGiftingId
     }
  this.https.postJson1('https://ntkjwdf3e9.execute-api.ap-south-1.amazonaws.com/gifting_sit/rest/api/v1/gifting/gifting_corporate_selected_view', data).subscribe(res => {
    console.log(res);
    console.log(JSON.stringify(res));
    this.viewData = res['Output'];
    this.viewData['deliveryDate'];
    let Presentdate:Date = new Date() ;
   console.log( moment(Presentdate).format('YYYY-MM-DD'));
    for(let i=0;i<this.viewData.length;i++){
      this.viewGiftingData=this.viewData[i]
      this.templateId=this.viewData[i]['templateId']
      this.tnc=this.viewData[i]['tnc']
      this.RECIPIENT_DATA=this.viewData[i]['recipients']
      if( this.viewData[i]['deliveryDate']>moment(Presentdate).format('YYYY-MM-DD')){
        this.futureDate=true;
      }
    }
    this.dataSource = new MatTableDataSource<UserData>(this.RECIPIENT_DATA);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    console.log(this.templateId);
    
    if (this.templateId!= '') {
      this.getLogoDetails();
    }
if(res['Output']=='Giftcard Id not found'){
  this.snackBar.openFromComponent(SnackBarComponent, {
    duration: 1000,
    data: {
      status: 'success',
      message: this.viewData
    }
  });
}
   
  },  err => {
    console.log(err)
    // this.snackBar.openFromComponent(SnackBarComponent, {
    //   duration: 10000,
    //   data: {
    //     status: 'failure',
    //     message: err.error['Error_message']
    //   }
    // }
    // );
  }
  // err => 
  // {
  //   console.log(err)
  // }
  )
}
getLogoDetails() {
  console.log(this.templateId);
  let data =
  {
    "languageCode": "en",
    "templateId": this.templateId
  }
  this.https.postJson1('https://cupilfuhfg.execute-api.ap-south-1.amazonaws.com/gcadmin_sit/rest/api/v1/gcadmin/get_templates_details_by_id', data).subscribe(res => {
    console.log(res);
    this.logoDetails = res['Output'][0];

  }, err => {
    console.log(err)
  })
}



}
