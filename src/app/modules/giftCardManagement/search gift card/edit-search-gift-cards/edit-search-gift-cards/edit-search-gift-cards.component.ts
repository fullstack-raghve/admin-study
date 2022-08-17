import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';

import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogConfig, MatSnackBar } from "@angular/material";
import { EditHistoryDialogComponent } from '../../edit-history-dialog/edit-history-dialog.component';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpService } from '../../../../../../../src/app/services/http-service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { SnackBarComponent } from '../../../../../../../src/app/shared/components/snack-bar/snack-bar.component';
import { Globals } from '../../../../../../../src/app/services/global';
import { EditSearchGiftCardRedeemedDialogComponent } from '../edit-search-gift-cards/edit-search-gift-card-redeemed-dialog/edit-search-gift-card-redeemed-dialog.component';
export interface UserData {
  oldStatus: string;
  newStatus: string;
  name: string;
  dateTime: string;
  comment: string;
}
@Component({
  selector: 'app-edit-search-gift-cards',
  templateUrl: './edit-search-gift-cards.component.html',
  styleUrls: ['./edit-search-gift-cards.component.scss']
})
export class EditSearchGiftCardsComponent implements OnInit {
  loadingResponse = true;
  public dataSource;
  cardDetails = []
  viewDataDetails: any = [];
  viewData = [];
  keywords = [];
  label = []
  keywordStatus: boolean = true;
  redeemedblockedCon: boolean=true;
  displayedColumns: string[] = ['oldStatus', 'newStatus', 'name', 'dateTime', 'comment'];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  viewHistoryDetails: UserData[] = [];
  public StatusValue :Boolean = true;;
  redeemedData = []
  redeemedData1=[]
  cardDetails1=[]
  viewTransactionHistory = []
  labelkey=[]
  REDEEMED;
  StatusValue1
  public buildFlag: boolean = false;
  public editSearchGiftCardFormGroup: FormGroup;
  keywordSta:boolean=false;
  public breadCrumbData: Array<Object> = [{
    title: 'Home',
    link: ''
  },
  {
    title: 'Gift Cards Management',
    link: ''
  },
  ];
  cardOid: any;
  storeOid: any;
  constructor(public dialog: MatDialog,private router: Router, public snackBar: MatSnackBar, private activatedRoute: ActivatedRoute, private https: HttpService, private fb: FormBuilder, ) {
    this.activatedRoute.params.subscribe((params) => {
      this.cardOid = params['id'];
    });
  }

  ngOnInit() {
    this.getViewData()

  }

  getViewData() {
    console.log( this.cardOid);
    
    let data = {
      "cardOid": this.cardOid
    }
    this.https.postJson1('https://as6xbe41md.execute-api.ap-south-1.amazonaws.com/searchgiftcard_sit/rest/api/v1/searchgiftcard/get_card_detail', data).subscribe(res => {
      console.log(JSON.stringify(res));
      this.viewData = res['Output'];
      this.loadingResponse = false;
      for (let i = 0; i < this.viewData.length; i++) {
        this.viewDataDetails = this.viewData[i]
        this.viewHistoryDetails = this.viewData[i]['history']
        this.viewTransactionHistory = this.viewData[i]['transactionHistory']
        this.cardDetails = this.viewData[i]['cardDetails']
        for(let i=0;i<this.cardDetails.length;i++){
          this.cardDetails1=this.cardDetails[i]
        
        }
        if(this.viewData[i]['label']!='' && this.viewData[i]['label']!=null ){
          this.keywords=this.viewData[i]['label'];
          console.log(this.keywords);
          
        }
     
       
      }
      // for (let i = 0; i < this.keywords.length; i++) {
      //   let value = this.keywords[i];
      //   console.log(value);
      //   if (value > 0) {
      //     this.keywords.push(value);
      //     console.log(JSON.stringify(this.keywords));
      //   }
      // }
      this.buildEditSearchGiftCardFormGroup(this.viewDataDetails);
      this.dataSource = new MatTableDataSource<UserData>(this.viewHistoryDetails);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;

    }, err => {
      console.log(err)
    })

  }


  buildEditSearchGiftCardFormGroup(editData) {
    console.log(editData.cardOid);
    if (editData.cardOid == undefined) {
      this.buildFlag = false;
      let form = {
        keywords: "",
        reason: ''

      }
      this.editSearchGiftCardFormGroup = this.fb.group(form);
    }

    else {
      this.buildFlag = true;
      console.log(editData);
      this.editSearchGiftCardFormGroup = this.fb.group({
        keywords: [editData.keywords,Validators.compose([Validators.required, Validators.pattern(Globals.regAlbhanumericVal)])],
        reason: ''

      });
    }
  }


  blockedData(val) {
   
    // if(this.StatusValue==true)
    this.StatusValue1 = true;
    // else{
    //   this.StatusValue1 = this.REDEEMED;
    // }
  }

  redeemed() {

    this.StatusValue1 = false;
    const dialogRef = this.dialog.open(EditSearchGiftCardRedeemedDialogComponent);
    dialogRef.componentInstance.redeemedList = this.cardDetails;
    dialogRef.afterClosed().subscribe(data => {
      {
          console.log(data);
          console.log(JSON.stringify(data));
          
          // if(data.value!="" && data.value!=undefined)
          // {
            this.redeemedData.push(data['cardData']);
            for(let i=0;i<data['cardData'].length;i++)
            {
              this.redeemedData=data['cardData'][i]
              console.log(this.redeemedData);
              
            }
            for(let i=0;i<this.redeemedData.length;i++){
              this.redeemedData1=this.redeemedData[i]
            }
            this.storeOid= data['storeOid']
            console.log(this.storeOid);
            
          // }
         
        }
      });
    
  }
  historyDialog() {
    const dialogRef = this.dialog.open(EditHistoryDialogComponent);
    dialogRef.componentInstance.historyList = this.viewTransactionHistory;


  }
  public showKeyword(keyword: HTMLInputElement) {
  
      if (this.keywords.length < 5) {
        if (this.keywords.includes(keyword.value.trim())) {
          this.keywordStatus = false;
        } 
        else {
          this.keywordStatus = true;
          if(keyword.value==''){
            this.keywordStatus = false;
          }
          if(keyword.value!=''){
            this.keywords.push(keyword.value);
            keyword.value = '';
          }
         
        }
  
      }
      else {
        this.keywordStatus = true;
        setTimeout(() => {
          this.keywordStatus = false;
        }, 2000);
  
      
    }
  
  
  }
  public deleteKeyword(index: any) {
    this.keywords.splice(index, 1);
  }

  statusUpdate(formData){
  if(this.StatusValue1==true && this.redeemedData1['tId']==undefined){
      this.redeemedblockedCon=false;
    }
   if(this.StatusValue1==false && this.redeemedData1['tId']!='' ){
      this.redeemedblockedCon=false;
    }
    console.log(formData);

  this.labelkey=formData.keywords
  console.log(this.labelkey);
 if(formData.keywords!='' && this.keywords.length<1){
   this.keywordSta=true;
 }
 else{
  this.keywordSta=false;
 }
 if(formData.keywords==null && this.keywords.length<1){
  this.keywordSta=false;
}
 else{
  this.keywordSta=false;
 }
  if(this.editSearchGiftCardFormGroup.valid && this.redeemedblockedCon==false && this.keywordSta==false){  
  
    let data={
      "cardOid": this.viewDataDetails.cardOid,
      "status":   this.StatusValue1==true? "BLOCKED" : "REDEEMED",
      "lable":   this.keywords,
      "reason": formData.reason,
      "txnid":  this.StatusValue1==true? 0 : this.redeemedData1['tId'],
      "redemptionAmount": this.StatusValue1==true? 0 : this.cardDetails1['fullRedemptionMount'],
      // "skuName": this.cardDetails1['skuName']=='-'? '' : this.cardDetails1['skuName'] ,
      // "costof1":  this.cardDetails1['costOfOne']=='-'? '' : this.cardDetails1['costOfOne'],
      "skuName": this.StatusValue1==true?  '' : this.cardDetails1['skuName'] ,
      "costof1":  this.StatusValue1==true?  '' : this.cardDetails1['costOfOne'],
      "currencyCode":this.StatusValue1==true? "":this.cardDetails1['currency'],
      "storeOid":  this.StatusValue1==true? 0 : this.storeOid, 
      "cashierId":  this.StatusValue1==true? "" : this.redeemedData1['cashierId'], 
    }   
    console.log(JSON.stringify(data));
     
    this.https.postJson1('https://as6xbe41md.execute-api.ap-south-1.amazonaws.com/searchgiftcard_sit/rest/api/v1/searchgiftcard/card_update', data).subscribe(res => {
      console.log(res);
      let val = res['Output'];
      if(val= "successfully status change"){
       this.snackBar.openFromComponent(SnackBarComponent, {
        duration: 1000,
        data: {
          status: 'success',
          message: 'Updated successfully'
        }
      });
    }
    this.router.navigate(['/search-search-gift-cards']);
    },
      (error) => {
        console.log(error);
        this.snackBar.openFromComponent(SnackBarComponent, {
          duration: 10000,
          data: {
            status: 'failure',
            message: error.error['Error_message'][0]
          }
        });
      }
    );
   
  }
}
}
