import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonFunctions } from 'src/app/services/common-functions';
import { Common } from 'src/app/services/common';
@Component({
  selector: 'app-view-ewallet',
  templateUrl: './view-ewallet.component.html',
  styleUrls: ['./view-ewallet.component.scss']
})
export class ViewEWalletComponent implements OnInit {
  public breadCrumbData: Array<Object> = [
    { title: 'Home',link: ''},
    { title: 'E-Wallet',link: '' }
  ];

  public toggleVal;
  public checked;
  public loading: boolean = false;
  public merchantId:any;
  public walletName:any;
  public viewData:any = [];
  public alignCss:any = [];
  public rightPanel:any = [];
  public languageList = JSON.parse(localStorage.getItem("languageList"));
  public merchntId;
  public waletName;
  public denominationsArray: any = [];
  public pageLoader: boolean = false;
  
  constructor(
    private router: Router,
    private common: Common,
    private commonFunction :CommonFunctions) {
  }

  ngOnInit() {
    this.merchntId = localStorage.getItem('merchantID');
    this.waletName = localStorage.getItem('walletName');
    
    if (this.waletName) {
      this.getViewWalletData();
      localStorage.removeItem('merchantID')
      localStorage.removeItem('walletName')
    } else {
      sessionStorage.clear();
      this.router.navigate(['/search-eWallet'])
    }
  }

  public getViewWalletData() {
    let data = {
      "merchantID":this.merchntId,
      "walletName": this.waletName
    }
    this.pageLoader = true;
    this.common.getAllEwallets(data).subscribe((response)=>{
      console.log(response['responseBody']);
      this.viewData = response['responseBody'][0];
      console.log(this.viewData);
      this.toggleVal =  this.viewData["status"];
      this.checked =  this.viewData['status'] == 'ONLINE' ? true : false;
      if(this.viewData.rechargeDenomination != null && this.viewData.rechargeDenomination != ""){
        this.denominationsArray = this.viewData.rechargeDenomination.split(',');
      }
      this.pageLoader = false;
    },(error)=>{
      this.pageLoader = false;
      this.commonFunction.displayErrorMessage(error);
    })
  }

  goToEditEWallet(){
    localStorage.setItem('merchantID',this.merchntId);
    localStorage.setItem('walletName',this.waletName);
    this.router.navigate(['/edit-eWallet']);
  }
}
