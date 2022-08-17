import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';
import { Router } from '@angular/router';
import { HttpService } from 'src/app/services/http-service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-view-gifting-limit',
  templateUrl: './view-gifting-limit.component.html',
  styleUrls: ['./view-gifting-limit.component.scss']
})
export class ViewGiftingLimitComponent implements OnInit {
  giftingLimitsDummy: any;
///@ViewChild('userOid') userOid 
@Input('userOid') userOid = [];
@Input('totalData') totalData = [];
@Input('fullusersGifting') fullusersGifting = [];
  giftData: any;


  constructor(private http:HttpService,private router: Router,private dialogRef: MatDialogRef<MatDialog>,) { }

  ngOnInit() {

  console.log('userOid',this.userOid);
  console.log('total data on popup',this.totalData);
  console.log('fullusersGifting',this.fullusersGifting);

  this.calculateData(this.fullusersGifting,this.userOid);




  /// this.getUserGifting(this.userOid);

    this.giftingLimitsDummy = [
      {
        "giftType": "COUPONS",
        "giftName": "AED100 off",
        "maxGiftPerCustomer": 100,
        "maxGiftPerEvent": 10,
        "balance": 100
      },
      {
        "giftType": "PROGRAM",
        "giftName": "base program",
        "maxGiftPerCustomer": 50,
        "maxGiftPerEvent": 10,
        "balance": 10
      },
      {
        "giftType": "PRODUCT",
        "giftName": "coffee large",
        "maxGiftPerCustomer": 150,
        "maxGiftPerEvent": 10,
        "balance": 140
      }
    ]
  }


  calculateData(fullusersGifting,userOid){
  let newuserOid = userOid.toString();

  console.log('fullusersGifting>>>',fullusersGifting);

    for(let i=0;i<fullusersGifting.length;i++){
      console.log('fullusersGifting 0>>>',fullusersGifting[0].userOid);

         if(fullusersGifting[i]['userOid'].includes(newuserOid)){
            console.log('matched usr data',fullusersGifting[i]);
            this.giftData =  fullusersGifting[i]['giftingLimits'];
         }
    }
    

  }

  closePOPup(){
    this.dialogRef.close({ event: 'close' });
  }

  getUserGifting(userOid){
    let data = {   
        "userOid": +userOid
    }

    let url = "eventgifting_sit/rest/api/v1/event_admin/view_user_giftlimits"
this.http.postJson(environment.APIEndpoint + url, data).subscribe((response) => {
console.log('view user gfting res',response);
})
  }



}
