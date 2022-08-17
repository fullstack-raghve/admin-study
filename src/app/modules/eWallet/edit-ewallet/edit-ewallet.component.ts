import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { HttpService } from '../../../services/http-service';
import { MatSnackBar, MatDialog } from '@angular/material';
import { environment } from '../../../../environments/environment';
import { selectStoreDialog } from '../../../shared/components/select-store-dialog/select-store.component';
import { SnackBarComponent } from '../../../shared/components/snack-bar/snack-bar.component';
import { Router } from '@angular/router';
import { CommonFunctions } from 'src/app/services/common-functions';
import { Common } from 'src/app/services/common';
import { StoresDialogComponent } from 'src/app/shared/components/stores-dialog/stores-dialog.component';
@Component({
  selector: 'app-edit-ewallet',
  templateUrl: './edit-ewallet.component.html',
  styleUrls: ['./edit-ewallet.component.scss']
})
export class EditEWalletComponent implements OnInit {
  public breadCrumbData: Array<Object> = [
    { title: 'Home', link: '' },
    { title: 'E-Wallet', link: '' }
  ];
  public toggleVal: boolean = true;
  public checked = true;
  public disabled = false;
  public showError = false;
  public btnLoader: boolean = false;
  public alignCss = [];
  public totalCount;
  public selectedStore = [];
  public storeWalletData = [];
  public languageList = JSON.parse(localStorage.getItem("languageList"));
  public eWalletFormGroup: FormGroup;
  public selectedStoreCount: any;
  public storeRequired: boolean;
  public selectStoreVal: boolean;
  public dataStore: boolean;
  public walletData: any;
  public merchntId: any;
  public waletName: any;
  public viewData: any;
  public tcError: boolean = false;
  public statusValue: any;
  public regionCurrencies: any = [];
  public denominationsArray: any = [];
  public denomiErrMsg: boolean = false;
  public selectedCurrency: any = '';
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

  ngOnInit() {
    this.merchntId = localStorage.getItem('merchantID');
    this.waletName = localStorage.getItem('walletName');
    if (this.merchntId) {
      this.getWalletDetails();
      localStorage.removeItem('merchantID')
      localStorage.removeItem('walletName')
    } else {
      sessionStorage.clear();
      this.router.navigate(['/search-eWallet'])
    }
    this.buildForm();
  }

  public toggleStatus(event) {
    event.checked == true ? this.statusValue = 'ONLINE' : this.statusValue = 'OFFLINE';
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

  public getWalletDetails() {
    let data = {
      "merchantID": this.merchntId,
      "walletName": this.waletName
    }
    this.pageLoader = true;
    this.common.getAllEwallets(data).subscribe((response) => {
      this.viewData = response['responseBody'][0];
      if (this.viewData.rechargeDenomination != null && this.viewData.rechargeDenomination != "") {
        this.denominationsArray = this.viewData.rechargeDenomination.split(',');
      }
      this.regionCurrencies.push(this.viewData.currencyCode);
      this.toggleVal = this.viewData["status"] == 'ONLINE' ? true : false;
      this.statusValue = this.viewData["status"];
      this.pageLoader = false;
      this.buildForm();
    }, (error) => {
      this.pageLoader = false;
      this.commonFunction.displayErrorMessage(error);
    })
  }

  public buildForm() {
    let editData = this.viewData
    if (editData == undefined) {
      let form = {
        walletName: {value : '' , disabled : true},
        currencyName: ['', Validators.required],
        minBalance: ['', Validators.required],
        maxBalance: ['', Validators.required],
        // maxSingleAmtLoading: ['', Validators.required],
        // maxTransactionDay: ['', Validators.required],
        // maxTransactionMonth: ['', Validators.required],
        termAndConditionArray: this.fb.array([]),
      }
      this.eWalletFormGroup = this.fb.group(form)
    }
    else {
      let form = {
        walletName: {value : editData.walletName , disabled : true},
        currencyName: [editData.currencyCode, Validators.required],
        minBalance: [editData.minBalance, Validators.required],
        maxBalance: [editData.maxBalance, Validators.required],
        // maxSingleAmtLoading: [editData.maxAmountLoad, Validators.required],
        // maxTransactionDay: [editData.perDayCap, Validators.required],
        // maxTransactionMonth: [editData.perMonthCap, Validators.required],
        termAndConditionArray: this.fb.array([]),
      }
      this.eWalletFormGroup.get('currencyName').setValue(this.viewData.currencyCode);
      this.eWalletFormGroup = this.fb.group(form);
      this.termsAndConditionArray(editData);
      console.log(editData['storeIDs']);

      for (let i = 0; i < editData['storeIDs'].length; i++) {
        this.selectedStore.push(parseInt(editData['storeIDs'][i]['storeID']));
        let obj = {
          "storeID": editData['storeIDs'][i]['storeID'],
          "storeName": editData['storeIDs'][i]['storeName'],
          'status': 'ONLINE'
        }
        this.storeWalletData.push(obj);
      }
      console.log(this.selectedStore);

    }
    console.log(this.eWalletFormGroup);
  }

  public minBalErr: boolean = false;
  public maxBalErr: boolean = false;
  public maxSingleErr: boolean = false;
  public maxPerDayErr: boolean = false;
  public maxPerMonthErr: boolean = false;
  public maxPerMonthErr1: boolean = false;
  public checkBalance(min, max, maxAmtLoad, maxPerDay, maxPerMonth) {
    console.log("min " + min + " max " + max + "maxSingle" + maxAmtLoad +
      " Per Day " + maxPerDay + "Per MOnth " + maxPerMonth)
    if (min != '' && max != '') {
      this.maxBalErr = Number(max) < Number(min) ? true : false;
    }
    // if (min != '' && max != '' && maxAmtLoad != '') {
    //   this.maxSingleErr = maxAmtLoad < min && maxAmtLoad > max ? true : false;
    // }
    // if (maxPerDay != '' && min != '' && max != '') {
    //   this.maxPerDayErr = maxPerDay < min && maxPerDay > max ? true : false;
    // }
    // if (maxPerMonth != '' && min != '' && max != '') {
    //   this.maxPerMonthErr = maxPerMonth < min && maxPerMonth > max ? true : false;
    // }
    // if (maxPerDay != '' && maxPerMonth != '') {
    //   this.maxPerMonthErr1 = maxPerMonth < maxPerDay ? true : false;
    // }
  }

  public termsAndConditionArray(editData) {
    let eWalletTNC = editData['termsNConditions'];
    if (eWalletTNC.length != undefined && editData['termsNConditions'].length > 0) {
      for (let tnc of eWalletTNC) {
        const control = <FormArray>this.eWalletFormGroup.controls['termAndConditionArray'];
        let newForm = this.fb.group({
          termsAndCondition: [tnc.content, Validators.required]
        });
        control.push(newForm);
        // this.alignCss.push(tnc.language == 'ARABIC' ? 'text-right' : '');
      }
    } else {
      for (let ln of this.languageList) {
        const control = <FormArray>this.eWalletFormGroup.controls['termAndConditionArray'];
        let newForm = this.fb.group({
          termsAndCondition: ['', Validators.required]
        });
        control.push(newForm);
        this.alignCss.push(ln.direction == 'RTL' ? 'text-right' : '');
      }
    }
  }

  openStoresDialog() {
    console.log(this.selectedStore);
    const dialogRef = this.dialog.open(StoresDialogComponent);
    dialogRef.componentInstance.currencyCode = this.eWalletFormGroup.get('currencyName').value;
    dialogRef.componentInstance.storeList = this.selectedStore;
    dialogRef.componentInstance.totalCount = this.totalCount;
    dialogRef.afterClosed().subscribe(result => {
      if (result.buttonName === 'SELECT') {
        this.selectedStore = [];
        this.storeWalletData = [];
        this.selectedStoreCount = result.tableData.length;
        this.totalCount = result.totalCount;
        for (let i = 0; i < result.tableData.length; i++) {
          let obj = {
            "storeID": result.tableData[i].storeOid + '',
            "storeName": result.tableData[i].storeName,
            'status': 'ONLINE'
          }
          this.storeWalletData.push(obj);
          this.selectedStore.push(result.tableData[i].storeOid);
          const arrrayTemp = this.selectedStore;
          this.selectedStore = Array.from(new Set(arrrayTemp));
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
        if (this.selectedStore.length != 0) {
          this.storeRequired = false;
        }
      }
    });
  }
  public updateWallet(formData) {
    this.validateDenominatons();
    this.tcError = this.eWalletFormGroup.get('termAndConditionArray').invalid == true ? true : false;
    this.storeRequired = this.storeWalletData.length == 0 ? true : false;
    if (this.eWalletFormGroup.invalid == true || this.denominationsMaxValueError || this.denominationsMinValueError) {
      this.showError = true;
    }
    else {
      console.log(formData);
      this.btnLoader = true;
      this.showError = false;
      let termsArray = [];
      formData.termAndConditionArray.forEach((tc, index) => {
        termsArray.push({
          content: tc.termsAndCondition,
          language: this.languageList[index].languageId + '',
          status: this.toggleVal == true ? 'ONLINE' : 'OFFLINE'
        })
      })

      let request = {
        "oid": this.viewData.oid,
        "merchantID": this.merchntId,
        "walletName": this.viewData.walletName,
        "minBalance": parseInt(formData.minBalance),
        "maxBalance": parseInt(formData.maxBalance),
        "maxAmountLoad": parseInt(formData.maxBalance),
        "perDayCap": parseInt(formData.maxBalance),
        "perMonthCap": parseInt(formData.maxBalance),
        "currencyCode": formData.currencyName,
        "status": this.toggleVal == true ? 'ONLINE' : 'OFFLINE',
        "currencyDecimals": 3,
        "storeIDs": this.storeWalletData,
        "termsNConditions": termsArray,
        "rechargeDenomination": this.denominationsArray,
        "createdBy": 12345,
        "modifiedBy": 12345,
      }
      console.log(request);
      this.pageLoader = true;
      this.common.updateEwallet(request).subscribe((response) => {
        this.commonFunction.displaySnackBarMessage('success', 'E-Wallet has been updated successfully')
        this.btnLoader = false;
        this.pageLoader = false;
        sessionStorage.clear();
        this.router.navigate(['/search-eWallet']);
      }, (err) => {
        let currencyUniqErr;
        if('errorDetails' in err.error){
          for(let errItem of err.error.errorDetails){
            if(errItem.field == "currencyCode"){
              currencyUniqErr = errItem.description
            }
          }
        }
        this.pageLoader = false;
        this.btnLoader = false;
        if(currencyUniqErr != undefined){
          this.commonFunction.displaySnackBarMessage('failure', currencyUniqErr);
        }else{
          this.commonFunction.displayErrorMessage(err);
        }
      })
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
