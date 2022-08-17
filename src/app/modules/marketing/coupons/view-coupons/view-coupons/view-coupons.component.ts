import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder, FormGroupDirective, FormArray, NgForm } from '@angular/forms';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { HttpService } from 'src/app/services/http-service';
import { environment } from 'src/environments/environment';
import { addStoreDialog } from '../../../../../shared/components/add-store-dialog/add-store.component';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { MatChipInputEvent, MatSnackBar } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { ViewStoreDialogComponent } from '../../../../../shared/components/view-store-dialog/view-store-dialog.component';
import { SnackBarComponent } from 'src/app/shared/components/snack-bar/snack-bar.component';

@Component({
  selector: 'view-coupons',
  templateUrl: './view-coupons.component.html',
  styleUrls: ['./view-coupons.component.scss']
})
export class ViewCouponsComponent implements OnInit {
  public breadCrumbData: Array<Object> = [{
    title: 'Marketing',
    link: ''
  }, {
    title: 'Coupons',
    link: '/search-coupons'
  }
  ];
  public searchStoreVal: boolean = false;
  public id;
  public couponData: any = [];
  public toggleVal;
  public disabled: boolean = true;
  public checked = false;
  public filePathUrl = localStorage.getItem("imgBaseUrl");
  public skuFilePathUrl = localStorage.getItem("fileBaseUrl");
  public previousUrl = localStorage.getItem('previousUrl');
  public codeType = '';
  public manualFileName = '';
  public skuFileName = '';
  public text = [];
  public alignCss = [];
  public langfield = [];
  public fileUrl = localStorage.getItem("fileBaseUrl");
  selectStoreValPass;
  public selectStoreIDCouponValue;
  BrandName = ''
  public viewMemId;
  languageDirection = [];
  public bogoSection: boolean = false;
  public couponBuys: any = [];
  public couponGets: any = [];
  public showMinCouponUse: boolean = false;
  public showSpecificProduct: boolean = false;
  public offerAlertMsgLocale: any = [];
  public englishBuyAlertMsg: any = '';
  public englishGetAlertMsg: any = '';
  public arabicBuyAlertMsg: any = '';
  public arabicGetAlertMsg: any = '';
  public couponGetsProducts: any = [];
  public couponBuysFixedProducts: any = [];
  public couponBuysProducts:any = [];
  public couponBuysCategories:any = [];

  constructor(private fb: FormBuilder,
    private https: HttpService,
    private router: Router,
    public snackBar: MatSnackBar, private sanitized: DomSanitizer, public dialog: MatDialog) { }

  ngOnInit() {
   
    let data=  localStorage.getItem('CouponViewID');
    this.viewMemId = localStorage.getItem('memberCustomerId');
    if(data){
      this.id=data;
      this.getCouponDetails();
      localStorage.removeItem('CouponViewID');
      localStorage.removeItem('memberCustomerId')
    }else{
      sessionStorage.clear();
      this.router.navigate(['/search-coupons'])
    }


  }

  getCouponDetails() {
    this.searchStoreVal = true;
    // this.id = this.router.url.split('view-coupons/')[1];
    let data = {
      "couponId": this.id
    }
    this.https.postJson(environment.APIEndpoint + 'api/rpa/coupon/v3/view', data).subscribe(res => {
      this.searchStoreVal = false;
      this.couponData = res;
      if(this.couponData.discountType == 'BUY_X_GET_Y' || this.couponData.discountType == 'BUY_X_GET_Z_DISCOUNT_AMOUNT_ON_Y_PRODUCT' || this.couponData.discountType == 'BUY_X_GET_Z_DISCOUNT_ON_Y_PRODUCT'){
        this.bogoSection = true;
        this.couponBuys = this.couponData.couponBuys;
        this.couponGets = this.couponData.couponGets;
        this.showMinCouponUse = this.couponGets.minCouponUsePerOffer != null ? true : false;
        this.couponBuysCategories = this.couponBuys.couponBuysCategories != null ? this.couponBuys.couponBuysCategories : [];
        this.couponBuysProducts = this.couponBuys.couponBuysProducts != null ? this.couponBuys.couponBuysProducts : [];
        this.couponBuysFixedProducts = this.couponBuys.couponBuysProductsList != null ? this.couponBuys.couponBuysProductsList : [];
        this.couponGetsProducts = this.couponGets.couponGetsProducts != null ? this.couponGets.couponGetsProducts : [];
       
        if(this.couponData.specificProduct){
          this.showSpecificProduct = this.couponData.specificProduct;
          this.offerAlertMsgLocale = this.couponGets.couponOfferMessageLocale;
          console.log(this.offerAlertMsgLocale);
          let enBuyAlertMsg = this.offerAlertMsgLocale[0].buyMessage.replace('Buy', '');
          enBuyAlertMsg = enBuyAlertMsg.replace(this.couponBuys.quantity, '');
          this.englishBuyAlertMsg = enBuyAlertMsg.trim();
          let enGetAlertMsg = this.offerAlertMsgLocale[0].getMessage.replace('Get', '');
          enGetAlertMsg = enGetAlertMsg.replace(this.couponGets.quantity, '');
          this.englishGetAlertMsg = enGetAlertMsg.trim();
        }else {
          this.showSpecificProduct = false;
        }
      } else {
        this.bogoSection = false;
      }
      let BrandData = res['brands'];
      if(res['brands'] != null || res['brands'] != undefined){
        try{
          this.BrandName = res['brands'][0]['brandName'];
        }
        catch{
        }
      }
     
      this.selectStoreValPass = res['couponStores'];
      console.log(this.selectStoreValPass);
      if (this.selectStoreValPass!=''){
        this.selectStoreIDCouponValue = true;
      }
      else{
        this.selectStoreIDCouponValue = false;
      }
      
      if (res["codeType"] == 'FIXED') {
        this.codeType = "Fixed Code";
      } else if (res["codeType"] == 'PREFIX') {
        this.codeType = "Prefix";
      } else if (res["codeType"] == 'SUFFIX') {
        this.codeType = "Suffix";
      } else if (res["codeType"] == 'FILEUPLOAD') {
        this.codeType = "Manual Upload";
        this.manualFileName = res["codeValue"].split("/").pop();
      }

      if (res['skuFilePath'] != null && res['skuFilePath'] != '' && res['skuFilePath'] != undefined) {
        this.skuFileName = res["skuFilePath"].split("/").pop();
      }
      this.toggleVal = res["status"] == "ONLINE" ? true : false
      this.getText(this.couponData);

      for (let p of res['couponLocales']) {
        // this.alignCss.push(p.direction == 'RTL' ? 'text-right' : '');
        // this.langfield.push(p.direction == 'RTL' ? 'lang-field-right' : '');
        this.alignCss.push(p.direction == 'RTL' ? 'text-right' : '');
        this.langfield.push(p.direction == 'RTL' ? 'lang-field-right' : '');
        this.languageDirection.push(p.direction == 'RTL' ? 'direction' : '');
      }

    }, err => {
      console.log(err);
      this.searchStoreVal = true;
    })
  }

  public getText(couponData) {
    for (var i = 0; i < couponData.couponLocales.length; i++) {
      this.text.push(this.sanitized.bypassSecurityTrustHtml(couponData.couponLocales[i].termsAndCondition));
    }
  }
  openStoresDialog() {
    const dialogRef = this.dialog.open(ViewStoreDialogComponent, {
      panelClass: 'custom-modalbox'
    });
    dialogRef.componentInstance.selectedStoreData = this.selectStoreValPass;
    dialogRef.componentInstance.selectStoreIdCoupon = this.selectStoreIDCouponValue;
    dialogRef.afterClosed().subscribe(
      (result) => {

      }
    );
  }
  MoveToEdit(id,type){
    let data = id+'-'+type
    localStorage.setItem('CouponEditID',data);
    this.router.navigate(['/edit-coupons'])
  }
  moveToPreviousUrl(){
    if(this.previousUrl.startsWith('/view-member')){
      localStorage.setItem('memberCustomerId',this.viewMemId);
      this.router.navigate(['/view-member'])
    }
    else{
      this.router.navigate([this.previousUrl])
    }
   }
   public toggleStatus(event) {
     let statusValue;
    if (event.checked) {
      statusValue = 'ONLINE';
    } else {
      statusValue = 'OFFLINE';
    }
    let data ={
      "couponId": this.id,
      "status":statusValue
    }
    this.https.postJson(environment.APIEndpoint + 'api/rpa/coupon/v1/status/change', data).subscribe(res => {
      this.snackBar.openFromComponent(SnackBarComponent, {
        duration: 10000,
        data: {
          status: "success",
          message: "Coupon status updated successfully"
        }
      });
  });
}
}
