import { OnInit, ViewChild, Component } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatPaginator, MatTableDataSource } from '@angular/material';
import { HttpService } from '../../../services/http-service';
import { Router } from '@angular/router';
import { Common } from 'src/app/services/common';
import { CommonFunctions } from 'src/app/services/common-functions';
import { environment } from '../../../../environments/environment';

export interface TxnData {
  srNo: number;
  walletName: string;
  currencyCode: string;
  minBalance: string;
  maxBalance: string;
  maxAmountLoad: string;
  perDayCap: string;
  status: string;
  createdOn: string;
  createdBy: string;
}

@Component({
  selector: 'search-ewallet',
  templateUrl: './search-ewallet.component.html',
  styleUrls: ['./search-ewallet.component.scss']
})
export class SearchEWalletComponent implements OnInit {
  public breadCrumbData: Array<Object> = [
    { title: 'Home', link: '' },
    { title: 'E-Wallet', link: '' }
  ];

  displayedColumns: string[] = ['srNo', 'walletName', 'currencyCode', 'minBalance', 'maxBalance', 'maxAmountLoad', 'perDayCap', 'status', 'createdOn', 'createdBy'];
  dataSource: MatTableDataSource<TxnData>;

  public searchEwalletFormGroup: FormGroup;
  public paginationData;
  public resultsLength = 0;
  public noRecords: boolean = false;
  public searchPageLoader: boolean = false;
  public sortColumn = "modifiedTime";
  public sortDirection = "desc";
  public status = true;
  public storeList: any = [];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  public pageLoader: boolean = false;
  public regionCurrencies: any = [];

  constructor(private fb: FormBuilder,
    private router: Router,
    private https: HttpService,
    private common: Common,
    private commonFunction: CommonFunctions) {
    this.dataSource = new MatTableDataSource();
  }

  ngOnInit() {
    this.getCurrencies();
    this.getCreatedWalletList();
    this.dataSource.paginator = this.paginator;
    this.buildStoreForm();
    this.dataSource = new MatTableDataSource();
    this.searchVal();
  }
  buildStoreForm() {
    this.searchEwalletFormGroup = this.fb.group({
      searchVal: [""]
    });
  }

  searchVal() {
    let data;
    if (this.searchEwalletFormGroup.get('searchVal').value != '') {
      data = {
        "merchantID": "merchant0005",
        "walletName": this.searchEwalletFormGroup.get('searchVal').value
      }
    }
    else {
      data = { "merchantID": "merchant0005" }
    }
    this.pageLoader = true;
    this.common.getAllEwallets(data).subscribe((response) => {
      this.resultsLength = response["responseBody"] == null ? 0 : response["responseBody"].length;
      this.dataSource = new MatTableDataSource(response["responseBody"]);
      this.dataSource.paginator = this.paginator;
      if (this.paginationData !== undefined && this.paginationData.pageIndex * this.paginationData.pageSize > this.resultsLength) {
        this.paginationData.pageIndex = 0;
        this.paginator.pageIndex = 0;
        this.searchVal();
      }
      this.pageLoader = false;
    }, (error) => {
      this.pageLoader = false;
      this.commonFunction.displayErrorMessage(error);
    })
  }

  goToviewEWallet(walletName) {
    localStorage.setItem('merchantID', "merchant0005");
    localStorage.setItem('walletName', walletName);
    this.router.navigate(['/view-eWallet']);
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

  public showAlertMsg() {
    if (this.regionCurrencies.length == 0)
      this.commonFunction.displayErrorMessage("zeroCurrency");
    else
      this.router.navigate(['/create-eWallet']);
  }

  public getCurrencies(): void {
    const GET_ALL_ONBOARDING = environment.APIEndpoint + 'api/rpa/client/onboarding/v1/view';
    this.https.getJson(GET_ALL_ONBOARDING)
      .subscribe((response: any) => {
        response.regionList.forEach((item) => {
          this.regionCurrencies.push({ 
            "currency": item.currencyCode,
            "regionId": item.regionId
          })
        });
      })
  }
}

