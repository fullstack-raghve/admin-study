import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { HttpService } from '../../../services/http-service';
import { MatSnackBar, MatDialog } from '@angular/material';
import { environment } from '../../../../environments/environment';
import { Router } from '@angular/router';
import { Common } from 'src/app/services/common';
import { CommonFunctions } from 'src/app/services/common-functions';
import { StoresDialogComponent } from 'src/app/shared/components/stores-dialog/stores-dialog.component';
@Component({
  selector: 'create-eWallet',
  templateUrl: './create-ewallet.component.html',
  styleUrls: ['./create-ewallet.component.scss']
})
export class CreateEWalletComponent implements OnInit {
  public breadCrumbData: Array<Object> = [
    { title: 'Home', link: '' },
    { title: 'E-Wallet', link: '' }];

  public statusValue: string = 'ONLINE';
  public toggleVal: boolean = true;
  public showError = false;
  public btnLoader: boolean = false;
  public alignCss = [];
  public totalCount;
  public selectedStore = [];
  public storeWalletData = [];
  public languageList = JSON.parse(localStorage.getItem("languageList"));
  public createdBy = localStorage.getItem('fullName');
  public createdOn = new Date()
  public eWalletFormGroup: FormGroup;
  public tcError = false;
  public brandId: any[];
  public selectedStoreCount: any;
  public storeRequired: boolean;
  public selectStoreVal: boolean;
  public dataStore: boolean;
  public regionCurrencies: any = [];
  public denominationsArray: any = [];
  public denomiErrMsg: boolean = false;
  public pageLoader: boolean = false;
  public denominationsMaxValueError: boolean = false;
  public denominationsMinValueError: boolean = false;

  constructor(private fb: FormBuilder,
    private http: HttpService,
    public snackBar: MatSnackBar,
    public dialog: MatDialog,
    private router: Router,
    private common: Common,
    private commonFunction: CommonFunctions) {
    this.getStoreListCount();
  }

  ngOnInit() {
    this.getCurrencies();
    this.getCreatedWalletList();
    this.buildForm();
    this.termsAndConditionArray();
  }

  getCreatedWalletList() {
    let request = { "merchantID": "merchant0005" }
    this.common.getAllEwallets(request).subscribe((response) => {
      this.filterCurrencies(response['responseBody']);
    })
  }
  filterCurrencies(eWallets) {
    eWallets.forEach(element => {
      this.removeCurrency(element.currencyCode);
    });
  }

  removeCurrency(value) {
    this.regionCurrencies.forEach((element, index) => {
      if (value === element.currency) {
        this.regionCurrencies.splice(index, 1);
      }
    });
  }

  getStoreListCount() {
    let request = {
      "page": "0",
      "pageSize": 2000,
      "order": {
        "column": "MODIFIED_TIME",
        "dir": "desc"
      },
      "keySearch": "",
      "fieldSearch": []
    }
    this.common.getStoreList(request).subscribe((response) => {
      this.totalCount = response["totalCount"];
    })
  }

  public toggleStatus(event) {
    event.checked == true ? this.statusValue = 'ONLINE' : this.statusValue = 'OFFLINE';
  }

  public getCurrencies(): void {
    const GET_ALL_ONBOARDING = environment.APIEndpoint + 'api/rpa/client/onboarding/v1/view';
    this.http.getJson(GET_ALL_ONBOARDING)
      .subscribe((response: any) => {
        response.regionList.forEach((item) => {
          this.regionCurrencies.push({
            "currency": item.currencyCode,
            "regionId": item.regionId
          })
        });
        // this.getCreatedWalletList();
      })
  }
  public buildForm() {
    let form = {
      walletName: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(200), Validators.pattern('^[a-zA-Z]+$')])],
      currencyName: ['', Validators.required],
      minBalance: ['', Validators.required],
      maxBalance: ['', Validators.required],
      // maxSingleAmtLoading: ['', Validators.required],
      // maxTransactionDay: ['', Validators.required],
      // maxTransactionMonth: ['', Validators.required],
      termAndConditionArray: this.fb.array([]),
    }
    this.eWalletFormGroup = this.fb.group(form);
  }

  public termsAndConditionArray() {
    for (let ln of this.languageList) {
      const control = <FormArray>this.eWalletFormGroup.controls['termAndConditionArray'];
      let newForm = this.fb.group({
        termsAndCondition: ['', Validators.required]
      });
      control.push(newForm);
      this.alignCss.push(ln.direction == 'RTL' ? 'text-right' : '');
    }
    console.log(this.eWalletFormGroup)
  }

  public minBalErr: boolean = false;
  public maxBalErr: boolean = false;
  public maxSingleErr: boolean = false;
  public maxPerDayErr: boolean = false;
  public maxPerMonthErr: boolean = false;
  public maxPerMonthErr1: boolean = false;

  public checkBalance(min, max, maxAmtLoad, maxPerDay, maxPerMonth) {
    // console.log("min " + min + " max " + max + "maxSingle" + maxAmtLoad + " Per Day " + maxPerDay + "Per MOnth " + maxPerMonth)
    if (min != '' && max != '') {
      console.log("min" + min);
      console.log("max" + max);
      this.maxBalErr = Number(min) < Number(max) ? false : true;
      console.log(this.maxBalErr);
    }
    // if (min != '' && max != '' && maxAmtLoad != '') {
    //   console.log("maxSingle" + maxAmtLoad);
    //   this.maxSingleErr = maxAmtLoad < min && maxAmtLoad > max ? true : false;
    // }
    // if (maxPerDay != '' && min != '' && max != '') {
    //   console.log("max per day" + maxPerDay);

    //   this.maxPerDayErr = maxPerDay < min && maxPerDay > max ? true : false;
    // }
    // if (maxPerMonth != '' && min != '' && max != '') {
    //   console.log("max per month" + maxPerMonth);
    //   this.maxPerMonthErr = maxPerMonth < min && maxPerMonth > max ? true : false;
    // }
    // if (maxPerDay != '' && maxPerMonth != '') {
    //   console.log("max per month" + maxPerMonth);
    //   this.maxPerMonthErr1 = maxPerMonth < maxPerDay ? true : false;
    // }
  }

  openStoresDialog() {
    const dialogRef = this.dialog.open(StoresDialogComponent);
    dialogRef.componentInstance.currencyCode = this.eWalletFormGroup.get('currencyName').value;
    dialogRef.componentInstance.storeList = this.selectedStore;
    dialogRef.componentInstance.totalCount = this.totalCount;
    dialogRef.afterClosed().subscribe(
      (result) => {
        if (result.buttonName === 'SELECT') {
          this.selectedStore = [];
          this.brandId = [];
          this.selectedStoreCount = result.tableData.length;
          if (this.selectedStoreCount != 0) {
            this.storeRequired = false;
            for (let i = 0; i < result.tableData.length; i++) {
              console.log(result.tableData)
              let obj = {
                "storeID": result.tableData[i].storeOid + '',
                "storeName": result.tableData[i].storeName,
                "status": 'ONLINE'
              }
              this.storeWalletData.push(obj);
              let storeId = result.tableData[i].storeOid;
              let BrandID = result.tableData[i].brandId;
              this.selectedStore.push(storeId);
              this.brandId.push(BrandID);
              const arrrayTemp = this.selectedStore;
              this.selectedStore = Array.from(new Set(arrrayTemp));
              console.log(this.selectedStore.length);
              if (this.selectedStore.length) {
                this.selectStoreVal = true;
                this.dataStore = false;
                setTimeout(() => {
                  this.selectStoreVal = false;
                  if (this.selectStoreVal == false) {
                    this.dataStore = true;
                  }
                }, 2000);
              }
            }
          } 
        }
      }
    );
  }

  public addDenominations(value) {
    if (value != '' && value != null && value != undefined) {
      this.denominationsArray.length >= 5 ? this.denomiErrMsg = true : this.denominationsArray.push(value);
    }
  }

  public deleteAmount(index) {
    this.denominationsArray.splice(index, 1);
    this.validateDenominatons();
  }

  public addWallet(formData) {
    this.validateDenominatons();
    this.tcError = this.eWalletFormGroup.get('termAndConditionArray').invalid == true ? true : false;
    this.storeRequired = this.storeWalletData.length == 0 ? true : false;
    if (this.eWalletFormGroup.invalid == true || this.denominationsMaxValueError || this.denominationsMinValueError) {
      this.showError = true;
    }
    else {
      this.btnLoader = true;
      this.showError = false;
      console.log(formData);
      let termsArray = [];
      formData.termAndConditionArray.forEach((tc, index) => {
        termsArray.push({
          content: tc.termsAndCondition,
          language: this.languageList[index].languageId + '',
          status: this.statusValue
        })
      })
      let request = {
        "createdBy": 12345,
        "modifiedBy": 12345,
        "merchantID": "merchant0005",
        "walletName": formData.walletName,
        "minBalance": parseInt(formData.minBalance),
        "maxBalance": parseInt(formData.maxBalance),
        "maxAmountLoad": parseInt(formData.maxBalance),
        "perDayCap": parseInt(formData.maxBalance),
        "perMonthCap": parseInt(formData.maxBalance),
        "currencyCode": formData.currencyName,
        "status": this.statusValue,
        "currencyDecimals": 3,
        "storeIDs": this.storeWalletData,
        "termsNConditions": termsArray,
        "rechargeDenomination": this.denominationsArray
      }
      console.log(request);
      this.pageLoader = true;
      this.common.createEwallet(request).subscribe((response) => {
        this.commonFunction.displaySnackBarMessage('success', 'E-Wallet has been added successfully');
        this.btnLoader = false;
        this.pageLoader = false;
        sessionStorage.clear();
        this.router.navigate(['/search-eWallet']);
      }, (err) => {
        this.pageLoader = false;
        this.btnLoader = false;
        let currencyUniqErr;
        if('errorDetails' in err.error){
          for(let errItem of err.error.errorDetails){
            if(errItem.field == "currencyCode"){
              currencyUniqErr = errItem.description
            }
          }
        }
       
        if(currencyUniqErr != undefined){
          this.commonFunction.displaySnackBarMessage('failure', currencyUniqErr);
        }else if (err.status == 400) {
          this.commonFunction.displaySnackBarMessage('failure', err.error.responseBody.message);
        }
        else {
          this.commonFunction.displaySnackBarMessage('failure', 'Your request cannot be saved at this time. Please try again later');
        }
      });
    }
  }

  validateDenominatons() {
    this.denominationsArray = this.denominationsArray.map(i => Number(i));
    this.denominationsMinValueError = false;
    this.denominationsMaxValueError = false;
    let minReloadValue = this.eWalletFormGroup.get('minBalance').value;
    let maxReloadValue = this.eWalletFormGroup.get('maxBalance').value;
    for (let i = 0; i < this.denominationsArray.length; i++) {
      if (this.denominationsArray[i] < minReloadValue) {
        this.denominationsMinValueError = true;
        break;
      }
    }
    for (let i = 0; i < this.denominationsArray.length; i++) {
      if (this.denominationsArray[i] > maxReloadValue) {
        this.denominationsMaxValueError = true;
        break;
      }
    }
  }
}
