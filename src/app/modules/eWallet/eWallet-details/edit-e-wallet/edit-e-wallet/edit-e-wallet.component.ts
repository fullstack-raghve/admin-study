import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { HttpService } from '../../../../../services/http-service';
import { MatSnackBar, MatDialog } from '@angular/material';
import { environment } from '../../../../../../environments/environment';
import { selectStoreDialog } from 'src/app/shared/components/select-store-dialog/select-store.component';

@Component({
  selector: 'edit-e-wallet',
  templateUrl: './edit-e-wallet.component.html',
  styleUrls: ['./edit-e-wallet.component.scss']
})
export class EditEWalletComponent implements OnInit {
  public breadCrumbData: Array<Object> = [{
    title: 'Home',
    link: ''
  },
  {
    title: 'E-wallet',
    link: ''
  }
  ];

  public toggleVal;
  public checked;
  public loading: boolean = false;
  public alignCss = [];
  public totalCount;
  public selectedStore = [];
  public languageList = JSON.parse(localStorage.getItem("languageList"));
  public eWalletFormGroup: FormGroup;
  public currencyNames = [];
  brandId: any[];
  selectedStoreCount: any;
  storeRequired: boolean;
  selectStoreVal: boolean;
  dataStore: boolean;
  constructor(private fb: FormBuilder, private http: HttpService,
    public snackBar: MatSnackBar, public dialog: MatDialog) {
    let data = {
      "order": {
        "column": "modifiedTime",
        "dir": "desc"
      },
      "keySearch": "",
      "fieldSearch": [
      ]
    }
    this.http.postJson(environment.APIEndpoint + 'api/rpa/store/v1/getAll', data).subscribe(res => {
      this.totalCount = res["totalCount"];
    });
  }

  ngOnInit() {
    this.buildForm();
  }

  public buildForm() {
    let form = {
      walletName: [''],
      currencyName: [''],
      minBalance: [''],
      maxBalance: [''],
      maxSingleAmtLoading: [''],
      maxTransactionDay: [''],
      maxTransactionMonth: [''],
      termAndCondition: ['']
    }
    this.eWalletFormGroup = this.fb.group(form)
  }

  openStoresDialog() {
    const dialogRef = this.dialog.open(selectStoreDialog);
    dialogRef.componentInstance.storeList = this.selectedStore;
    dialogRef.componentInstance.totalCount = this.totalCount;
    // dialogRef.componentInstance.programBrand = this.programBrand;
    // dialogRef.componentInstance.brandOid = this.brandOid;
    dialogRef.afterClosed().subscribe(
      (result) => {
        if (result.buttonName === 'SELECT') {
          this.selectedStore = [];
          this.brandId = [];
          this.selectedStoreCount = result.tableData.length;
          if (this.selectedStoreCount != 0) {
            this.storeRequired = false;
            for (let i = 0; i < result.tableData.length; i++) {
              // console.log(result.tableData)
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
          } else {
            //  this.storeErrorMsg = "Please select Store";
          }
        }
      }
    );
  }

  public updateWallet(formData) {
    console.log(formData);

  }
}
