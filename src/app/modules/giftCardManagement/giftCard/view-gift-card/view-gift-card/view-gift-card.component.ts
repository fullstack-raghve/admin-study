import { Component, OnInit } from '@angular/core';
import { MatDialogConfig, MatDialog, MatSnackBar } from "@angular/material";
import { FormArray, FormGroup, FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { HttpService } from '../../../../../../../src/app/services/http-service';
import { ViewStoreDialogComponent } from '../../../../../shared/components/view-store-dialog/view-store-dialog.component';
import { ViewGiftCardProductDialogComponent } from '../view-gift-card-product-dialog/view-gift-card-product-dialog.component';
import { SnackBarComponent } from '../../../../../../../src/app/shared/components/snack-bar/snack-bar.component';
@Component({
  selector: 'view-gift-card',
  templateUrl: './view-gift-card.component.html',
  styleUrls: ['./view-gift-card.component.scss']
})
export class ViewGiftCardComponent implements OnInit {

  public statusValue: string = 'ONLINE';
  public toggleVal: boolean = true;

  public breadCrumbData: Array<Object> = [{
    title: 'Home',
    link: ''
  }, {
    title: 'Gift Cards Management',
    // link: '/view-client-on-boarding'
  },
  {
    title: 'Gift Card',
    link: ''
  }
  ];
  loadingResponse = true;
  public templateId: any;
  languageCode: any;
  msg1: any;
  keywords = [];
  mappedProductIdsCount: any;
  couponTitle: any;
  public IssendForApproval: boolean = false;
  public menuIds: any = localStorage.getItem("navigationArray");
  statusUpdate: any;
  minVal: any;
  maxVal: string;
  noOfDay: string;
  maxTxnValuePerDay: string;
  maxTxnPerDay: any;
  logoImage:string;
  skuFileName: any;
  skuFileNameUrl: any;

  public toggleStatus(event) {
    if (event.checked == true) {
      this.statusValue = 'ONLINE';
    } else {
      this.statusValue = 'OFFLINE';
    }

  }
  msg
  fixedValue1;
  public cardId = [];
  public rightPanel = [];
  public alignCss = [];
  programFormGroup: FormGroup;
  public logoDetails: any = [];
  public termCondition = [];
  termAndCondition;
  public cardIdDetails:any=[];
  public RP_OID;
  public cardNames = [];
  public cardNameDetails;
  public descriptionText = [];
  public languageList = JSON.parse(localStorage.getItem("languageList"));
  selectStoreValPass = [];
  selectedProductIdVal = [];
  storeId = [];
  productId = [];
  publishDate = [];
  productCount = [];
  productIdCount = [];
  storeIdCount = [];
  mappedProductIds = [];
  constructor(private fb: FormBuilder, private activatedRoute: ActivatedRoute, private http: HttpService, public snackBar: MatSnackBar, private https: HttpService, public dialog: MatDialog) {
    this.activatedRoute.params.subscribe((params) => {
      this.RP_OID = params['id'];
      console.log(this.RP_OID);

    });
  }

  ngOnInit() {
    this.getMenuRole();
    this.buildForm();
    this.descriptionFormArray();
    this.getCorporateId();
    var d = new Date();
    console.log(d.toLocaleString());
   
  }

  public buildForm() {
    let form = {
      descriptionArray: this.fb.array([])
    }
    this.programFormGroup = this.fb.group(form);
  }

  public descriptionFormArray() {
    const controls = <FormArray>this.programFormGroup.controls['descriptionArray'];
    for (let i = 0; i < this.termCondition.length; i++) {
      let control = this.fb.group({
        language: this.termCondition[i]['languageName']
      });
      controls.push(control);
    }
  }

  getCorporateId() {

    let data = {
      "languageCode": "en",
      "cardId": this.RP_OID

    }
    this.https.postJson1('https://cupilfuhfg.execute-api.ap-south-1.amazonaws.com/gcadmin_sit/rest/api/v1/gcadmin/view_selected_gift_card_details', data).subscribe(res => {
      // this.https.postJson1('https://q2j4fc9t2h.execute-api.ap-south-1.amazonaws.com/gcadmin_sitv1/rest/api/v1/gcadmin/view_selected_gift_card_details', data).subscribe(res => {
      console.log(JSON.stringify(res));
      this.loadingResponse = false;

      this.cardIdDetails = res['Output'];
      console.log(this.cardIdDetails);
      this.cardNames = this.cardIdDetails.cardNames;
      this.templateId = this.cardIdDetails['templateId'];
      if (this.templateId!= '') {
        this.getLogoDetails();
      }

      this.statusValue =  res['Output']["status"];
      this.toggleVal = res['Output']["status"] == 'ONLINE' ? true : false;

      this.termCondition = this.cardIdDetails['TNC']
      this.storeId = this.cardIdDetails['storeId']
      console.log( this.storeId);
      
      this.couponTitle=this.cardIdDetails['couponTitle']
     if(this.cardIdDetails['storeId'].length>0){
      this.storeIdCount = this.cardIdDetails['storeId'].length;
      console.log(this.storeIdCount);
     }
     
      
      this.mappedProductIds = this.cardIdDetails['mappedProductIds']
      if(this.cardIdDetails['mappedProductIds'].length>0){
        this.mappedProductIdsCount = this.cardIdDetails['mappedProductIds'].length
      }
     
      console.log();
      
      // this.fixedValue1=this.cardIdDetails['fixedValue1','fixedValue2','fixedValue3','fixedValue4','fixedValue5']
      for (let i = 1; i <= 5; i++) {
        let value = res['Output']['fixedValue' + i];
        console.log(value)
        if (value > 0) {
          this.keywords.push(value);
          console.log(this.keywords);

        }
      }
      
      console.log(this.templateId);
      this.publishDate = this.cardIdDetails['publishDate']
      this.productCount = this.cardIdDetails['productCount']

      for (let i = 0; i < this.cardIdDetails['storeId'].length; i++) {
        this.cardId = this.cardIdDetails['storeId'][i]['GIFT_CARD_ID']
        console.log(this.cardId);

      }
      for (let i = 0; i < this.cardIdDetails['TNC'].length; i++) {
        console.log(this.cardIdDetails['TNC'][i]);
        console.log(this.cardIdDetails['TNC'][i]['languageName']);


      }
      this.productId = this.cardIdDetails['productId']
      this.productIdCount = this.cardIdDetails['productId'].length;
      this.skuFileNameUrl=this.cardIdDetails['upload_product_url'];
      console.log(this.skuFileName);
      // if(this.skuFileNameUrl!=''){
      //   this.skuFileName=this.cardIdDetails['uploadFileName']+ '.' + 'xls';
      // }
      this.skuFileName=this.cardIdDetails['uploadFileName']+ '.' + 'xls';
      
    }, err => {
      console.log(err)
    })
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
      this.logoDetails = res['Output'];
      this.logoImage=res['Output']['0'].logoImage;
      console.log('logoImage---->',typeof(this.logoImage));
      
    }, err => {
      console.log(err)
    })
  }

  sendForApproval() {
    var d = new Date();
    console.log(d.toLocaleString());
    let data = {
      "languageCode": "en",
      "cardId": this.RP_OID,
      "requestTime": d.toLocaleString()
    }
    this.https.postJson1('https://cupilfuhfg.execute-api.ap-south-1.amazonaws.com/gcadmin_sit/rest/api/v1/gcadmin/gidftcard_approval', data).subscribe(res => {
      console.log(res);
      this.msg = res['Output'].message
      console.log(this.msg);

      this.snackBar.openFromComponent(SnackBarComponent, {
        duration: 1000,
        data: {
          status: 'success',
          message: this.msg
        }
      });
      window.location.reload();

    }, err => {
      console.log(err)
      this.snackBar.openFromComponent(SnackBarComponent, {
        duration: 10000,
        data: {
          status: 'failure',
          message: 'Your request cannot be saved at this time. Please try again later'
        }
      });
    })
  }

  approved() {
    let data = {
      "languageCode": "en",
      "cardId": this.RP_OID,
    }
    this.https.postJson1('https://cupilfuhfg.execute-api.ap-south-1.amazonaws.com/gcadmin_sit/rest/api/v1/gcadmin/giftcard_approved', data).subscribe(res => {
      console.log(res);
      this.msg1 = res['Output']
      console.log(this.msg);

      this.snackBar.openFromComponent(SnackBarComponent, {
        duration: 1000,
        data: {
          status: 'success',
          message: this.msg1
        }
      });
      window.location.reload();

    }, err => {
      console.log(err)
      this.snackBar.openFromComponent(SnackBarComponent, {
        duration: 10000,
        data: {
          status: 'failure',
          message: 'Your request cannot be saved at this time. Please try again later'
        }
      });
    })
  }
  // store popup
  openStoresDialog() {
    const dialogRef = this.dialog.open(ViewStoreDialogComponent, {
      panelClass: 'custom-modalbox'
    });
    dialogRef.componentInstance.selectedStoreData = this.storeId;
    dialogRef.afterClosed().subscribe(
      (result) => {
        console.log(result);

      }
    );
  }
  // product pop up
  openProductDialog() {
    const dialogRef = this.dialog.open(ViewGiftCardProductDialogComponent, {
      panelClass: 'custom-modalbox'
    });
    console.log(this.productId);


    if (this.cardIdDetails['valueType'] == 'AMOUNT') 
       dialogRef.componentInstance.selectedProductIdVal = this.mappedProductIds;;
   
    dialogRef.afterClosed().subscribe(
      (result) => {
        console.log(result);

      }
    );
  }
  getMenuRole(){
    if (this.menuIds.indexOf('4009') > -1) {
      this.IssendForApproval = true;
      } else {
      this.IssendForApproval = false;
      }
  }
  statusCall(){
    let data={ 
      "languageCode":'en',
      "cardId":this.RP_OID,
      "statusToBe":this.statusValue
  }
  this.http.postCustomizeJson('https://cupilfuhfg.execute-api.ap-south-1.amazonaws.com/gcadmin_sit/rest/api/v1/gcadmin/change_giftcard_status', data).subscribe(res => {
    console.log(res);
   this.statusUpdate= res['Output'];
   this.getCorporateId();
 
   this.snackBar.openFromComponent(SnackBarComponent, {
    duration: 1000,
    data: {
      status: 'success',
      message: this.statusUpdate
    }
  });


}, err => {
  console.log(err)
  this.snackBar.openFromComponent(SnackBarComponent, {
    duration: 10000,
    data: {
      status: 'failure',
      message: err.error['Error_message']
    }
  });
})
  }
}
